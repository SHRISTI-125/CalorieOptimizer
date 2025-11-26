import React, { useState, useRef} from "react";
import Test from "./Test";
import "./Predictor.css";

const api = "http://127.0.0.1:5000";

function Test2() {
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
      console.error(err);
      setError(err.message || "Image prediction failed.");
    } finally {
      setLoading(false);
    }
  };

  const predictText = async () => {
    if (!textInput.trim()) return setError("Please enter food name.");

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
      console.error(err);
      setError(err.message || "Text prediction failed.");
    } finally {
      setLoading(false);
    }
  };

  const smartPredict = async () => {
    if (file) await predictImage();
    else if (textInput.trim()) await predictText();
    else setError("Please provide an image or food name.");
  };

  /* FINAL FORMATTED RESULT */
  const formattedResult = result
    ? {
        food: formatFoodName(result.predicted_food),
        calories: result.details?.calories_per_piece || 0,

        nutrients: result.details?.nutrients
          ? Object.entries(result.details.nutrients).map(([key, value]) => ({
              name: formatFoodName(key),
              value: value,
            }))
          : [],

        risk: result.details?.bad_for?.length
          ? result.details.bad_for.join(", ")
          : "No major risks",

        alternative:
          result.details?.alternative || "No healthier alternative available",

        category: result.details?.category || "Not specified",

        description: result.details?.description || "No description available",
      }
    : null;

  return (
    <div className="predictor-container">
    <h1 
  className="main-heading" 
  style={{
    fontSize: '2.5rem', 
    color: '#eef0f2ff', // Blue accent color
    marginBottom: '30px', 
    fontWeight: 700,
    textShadow: '0 0 10px rgba(96, 165, 250, 0.4)', // Subtle blue glow
    textDecoration: 'none' 
  }}
>
   Calorie Optimizer
</h1>
      
      <div className="predictor-grid">
        <div className="input-panel">

          <div className="upload-box" onClick={() => fileRef.current.click()}>
            {preview ? (
              <img src={preview} alt="preview" className="preview-image" />
            ) : (
              <p>Click or Upload Food Image</p>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            ref={fileRef}
            onChange={handleFileChange}
            hidden
          />

          <input
            type="text"
            className="food-input"
            placeholder="Type your food name here..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />

          <div className="button-group">
            <button onClick={smartPredict} disabled={loading}>
              {loading ? "Analyzing..." : "Predict"}
            </button>

            <button className="secondary" onClick={resetAll}>
              Clear
            </button>
          </div>

          {error && <p className="error-text">{error}</p>}
        </div>

        <div className="result-panel">
          {formattedResult ? (
            <Test result={formattedResult} />
          ) : (
            <div className="no-result-box">
              <h2>Waiting for input...</h2>
              <p>Upload an image or type a food name</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Test2;
