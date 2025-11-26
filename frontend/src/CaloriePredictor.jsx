import React, { useState, useRef } from "react";

const api = "http://127.0.0.1:5000"; 

export default function CaloriePredictorUnified() {
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

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
    setError(null);
  };

  const formatFoodName = (food) => {
    if (!food) return "";
    return food
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  const predictImage = async () => {
    if (!file) return setError("Please select an image first.");
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch(`${api}/predictFoodName`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError("Image prediction failed.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const predictText = async () => {
    if (!textInput.trim()) return setError("Please enter text first.");
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`${api}/predictFoodFromText`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textInput }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError("Text prediction failed.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const smartPredict = async () => {
    if (file) await predictImage();
    else if (textInput.trim()) await predictText();
    else setError("Please provide image or text.");
  };

  return (
    <div style={{ padding: "40px", background: "#F3F0EE", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center" }}>Calorie Optimizer</h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "40px",
          flexWrap: "wrap",
          marginTop: "40px",
        }}
      >
      
        <div style={{ minWidth: "280px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <input type="file" accept="image/*" ref={fileRef} onChange={handleFileChange} />
          {preview && <img src={preview} alt="preview" style={{ width: 260, height: 260, objectFit: "cover", marginTop: 16 }} />}

          <input
            type="text"
            placeholder="Or type food name"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            style={{ marginTop: 16, padding: 8, width: "100%" }}
          />

          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            <button onClick={smartPredict} disabled={loading}>
              {loading ? "Predicting..." : "Predict"}
            </button>
            <button onClick={resetAll}>Clear</button>
          </div>

          {error && <p style={{ color: "red", marginTop: 12 }}>{error}</p>}
        </div>

        <div style={{ minWidth: 300 }}>
          {result ? (
            <div style={{ background: "#fadeefff", padding: 20, borderRadius: 12 }}>
              <h3>{formatFoodName(result.predicted_food)}</h3>
              <p>Calories: {result.details?.calories_per_piece ?? "N/A"}</p>
              {result.details?.nutrients && (
                <div>
                  <p>Sugar: {result.details.nutrients.sugar ?? "N/A"}</p>
                  <p>Fat: {result.details.nutrients.total_fat ?? "N/A"}</p>
                  <p>Cholestrol: {result.details.nutrients.cholestrol ?? "N/A"}</p>
                </div>
              )}
              {result.details?.category && <p>Category: {result.details.category}</p>}
              {result.details?.description && <p>Description: {result.details.description}</p>}
              {result.details?.bad_for && <p>Not good for: {result.details.bad_for.join(", ")}</p>}
              {result.details?.alternative && <p>Alternative: {result.details.alternative}</p>}
            </div>
          ) : (
            <div style={{ padding: 20, background: "#fff", textAlign: "center" }}>
              Provide an image or type text to predict.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
