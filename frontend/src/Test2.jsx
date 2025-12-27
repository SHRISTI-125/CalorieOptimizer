import React, { useState, useRef } from "react";
/*import Test from "./Test";*/
/*import "./Predictor.css";*/
import Test from "./Test";

const api = "http://127.0.0.1:5000";

export default function Test2() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [textInput, setTextInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fileRef = useRef(null);

  const resetAll = () => {
    setFile(null);
    setPreview(null);
    setTextInput("");
    setResult(null);
    setError(null);
    if (fileRef.current) fileRef.current.value = null;
  };

  const formatText = (t = "") =>
    t.split("_").map(w => w[0]?.toUpperCase() + w.slice(1)).join(" ");

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError(null);
  };

  const predict = async () => {
    if (!file && !textInput.trim()) {
      return setError("Upload image or enter food name");
    }

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = file
        ? await fetch(`${api}/predictFoodName`, {
            method: "POST",
            body: (() => {
              const fd = new FormData();
              fd.append("image", file);
              return fd;
            })(),
          })
        : await fetch(`${api}/predictFoodFromText`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: textInput }),
          });

      const data = await res.json();

      setResult({
        food: formatText(data.predicted_food),
        calories: data.details?.calories_per_piece || 0,
        category: data.details?.category || "Unknown",
        description: data.details?.description || "No description available",
        nutrients: data.details?.nutrients
          ? Object.entries(data.details.nutrients).map(([k, v]) => ({
              name: formatText(k),
              value: v,
            }))
          : [],
        risk:
          data.details?.bad_for?.length
            ? data.details.bad_for.join(", ")
            : "No major risks detected",
        alternative:
          data.details?.alternative || "No healthier alternative suggested",
      });
    } catch {
      setError("Prediction failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50 px-6 py-10">
      <h1 className="text-center text-4xl font-extrabold text-slate-900 mb-10">
        Calorie <span className="text-green-600">Optimizer</span>
      </h1>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
        {/* INPUT CARD */}
        <div className="bg-white rounded-3xl border border-green-100 shadow-xl p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            Predict Nutrition 🌱
          </h2>

          <div
            onClick={() => fileRef.current.click()}
            className="cursor-pointer border-2 border-dashed border-green-300 rounded-2xl h-56 flex items-center justify-center text-slate-400 hover:bg-green-50 transition"
          >
            {preview ? (
              <img src={preview} alt="preview" className="h-full object-cover rounded-2xl" />
            ) : (
              <p>Click or Drag & Drop food image</p>
            )}
          </div>

          <input
            ref={fileRef}
            type="file"
            hidden
            accept="image/*"
            onChange={handleFileChange}
          />

          <input
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Or type food name"
            className="mt-6 w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-400 outline-none"
          />

          <div className="flex gap-4 mt-6">
            <button
              onClick={predict}
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition disabled:opacity-60"
            >
              {loading ? "Analyzing..." : "Predict"}
            </button>
            <button
              onClick={resetAll}
              className="flex-1 border border-green-300 text-green-700 py-3 rounded-xl font-bold hover:bg-green-50"
            >
              Clear
            </button>
          </div>

          {error && (
            <p className="mt-4 text-center text-red-500 font-medium">
              {error}
            </p>
          )}
        </div>

        {/* RESULT CARD */}
        <div className="bg-white rounded-3xl border border-green-100 shadow-xl p-8">
          {loading && (
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-green-100 rounded w-1/2" />
              <div className="h-40 bg-green-50 rounded" />
              <div className="h-4 bg-green-100 rounded w-3/4" />
            </div>
          )}

          {!loading && result && <Test result={result} />}

          {!loading && !result && (
            <p className="text-slate-400 text-center">
              Upload an image or type food name to start
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
