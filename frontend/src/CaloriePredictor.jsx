import React, { useState, useRef } from "react";
import "./index.css";

const api = "http://127.0.0.1:5000";

export default function CaloriePredictor() {
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

  const formatFoodName = (food) =>
    food
      ? food
          .split("_")
          .map((w) => w[0].toUpperCase() + w.slice(1))
          .join(" ")
      : "";

      

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
    setError(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
    setError(null);
  };

  const handleDragOver = (e) => e.preventDefault();


  const predictImage = async () => {
    if (!file) return setError("Please upload an image first.");
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch(`${api}/predictFoodName`, {
        method: "POST",
        body: fd,
      });
      setResult(await res.json());
    } catch {
      setError("Image prediction failed.");
    } finally {
      setLoading(false);
    }
  };

  const predictText = async () => {
    if (!textInput.trim()) return setError("Enter food name first.");
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch(`${api}/predictFoodFromText`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textInput }),
      });
      setResult(await res.json());
    } catch {
      setError("Text prediction failed.");
    } finally {
      setLoading(false);
    }
  };

  const smartPredict = async () => {
    if (file) await predictImage();
    else if (textInput.trim()) await predictText();
    else setError("Provide image or text.");
  };


  const Skeleton = () => (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-4 bg-slate-200 rounded-xl"></div>
      ))}
    </div>
  );

  const HealthBadge = ({ label, color }) => (
    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold ${color}`}
    >
      {label}
    </span>
  );


  const calories = result?.details?.calories_per_piece;

  const healthStatus =
    calories > 500
      ? { label: "High Calories ⚠️", color: "bg-red-100 text-red-700" }
      : calories > 250
      ? { label: "Moderate ⚡", color: "bg-orange-100 text-orange-700" }
      : { label: "Healthy Choice 🌿", color: "bg-green-100 text-green-700" };


  return (
    <div className="min-h-screen bg-white px-4 py-10">
      <h1 className="text-center text-4xl font-extrabold text-slate-900 mb-10">
        Calorie <span className="text-green-600">Optimizer</span>
      </h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* INPUT CARD */}
        <div className="bg-white rounded-3xl shadow-xl border border-green-100 p-8">
          <h2 className="text-2xl font-bold mb-6">Predict Calories 🌱</h2>

          {/* Drag & Drop */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileRef.current.click()}
            className="h-48 border-2 border-dashed border-green-400 rounded-2xl
                       flex items-center justify-center text-green-700 font-semibold
                       cursor-pointer hover:bg-green-50 transition"
          >
            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="h-full w-full object-cover rounded-2xl"
              />
            ) : (
              <div className="text-center">
                <p>Drag & Drop food image</p>
                <p className="text-sm text-slate-500">or click to upload</p>
              </div>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            ref={fileRef}
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Text Input */}
          <input
            type="text"
            placeholder="Or type food name"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            className="mt-6 w-full px-4 py-3 rounded-xl border
                       focus:ring-2 focus:ring-green-400"
          />

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={smartPredict}
              disabled={loading}
              className="flex-1 py-3 bg-green-600 text-white font-bold
                         rounded-xl hover:bg-green-700 disabled:opacity-60"
            >
              {loading ? "Analyzing..." : "Predict"}
            </button>

            <button
              onClick={resetAll}
              className="flex-1 py-3 border border-green-300 text-green-700
                         rounded-xl hover:bg-green-50"
            >
              Clear
            </button>
          </div>

          {error && (
            <p className="mt-4 text-red-500 text-center">{error}</p>
          )}
        </div>

        {/* RESULT CARD */}
        <div className="bg-white rounded-3xl shadow-xl border border-green-100 p-8">
          {loading ? (
            <Skeleton />
          ) : result ? (
            <>
              <h2 className="text-2xl font-extrabold text-green-700 mb-3">
                {formatFoodName(result.predicted_food)}
              </h2>

              <HealthBadge {...healthStatus} />

              <div className="mt-4 space-y-2 text-slate-700">
                <p><strong>Calories:</strong> {calories}</p>
                <p><strong>Sugar:</strong> {result.details?.nutrients?.sugar}</p>
                <p><strong>Fat:</strong> {result.details?.nutrients?.total_fat}</p>
                <p><strong>Cholesterol:</strong> {result.details?.nutrients?.cholestrol}</p>

                {result.details?.bad_for && (
                  <p className="text-red-600">
                     Not good for: {result.details.bad_for.join(", ")}
                  </p>
                )}

                {result.details?.alternative && (
                  <p className="text-green-700">
                     Better alternative: {result.details.alternative}
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400">
              Upload an image or type food name to see prediction.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
