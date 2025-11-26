import "./Test.css";
import React, { useEffect, useState } from "react";

function Test({ result }) {
  const [voices, setVoices] = useState([]);
  const [ready, setReady] = useState(false); // for user interaction

  useEffect(() => {
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length > 0) {
        setVoices(v);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // Force activation on first click anywhere
  useEffect(() => {
    const activateSpeech = () => setReady(true);
    window.addEventListener("click", activateSpeech);
    return () => window.removeEventListener("click", activateSpeech);
  }, []);

  const data = result || {
    food: "Apple Pie",
    category: "Dessert",
    description:
      "Classic baked pie filled with spiced apples and crust; high in sugar and fat.",
    calories: 320,
    nutrients: [
      { name: "Carbohydrates", value: "45 g" },
      { name: "Fat", value: "14 g" },
      { name: "Sugar", value: "25 g" }
    ],
    risk: "High sugar & saturated fat",
    alternative: "Fruit salad with yogurt"
  };

  // BADGE LOGIC
  const getHealthBadge = () => {
    let sugar = 0;
    let fat = 0;

    data.nutrients?.forEach(n => {
      if (n.name.toLowerCase().includes("sugar"))
        sugar = parseInt(n.value);
      if (n.name.toLowerCase().includes("fat"))
        fat = parseInt(n.value);
    });

    if (sugar >= 20 || fat >= 15) return { label: "UNHEALTHY", color: "red" };
    if (sugar >= 10 || fat >= 8) return { label: "MODERATE", color: "orange" };
    return { label: "HEALTHY", color: "green" };
  };

  const badge = getHealthBadge();

  const speakResult = () => {
    if (!ready) {
      alert("Click anywhere on the page once, then try again.");
      return;
    }

    if (!window.speechSynthesis) {
      alert("Speech not supported in this browser");
      return;
    }

    if (voices.length === 0) {
      alert("Voices not loaded yet. Wait 2 seconds and try again.");
      return;
    }

    window.speechSynthesis.cancel();

    const msg = new SpeechSynthesisUtterance(
      `The food is ${data.food}. 
      It belongs to category ${data.category}. 
      ${data.description}. 
      It contains ${data.calories} calories. 
      Health level is ${badge.label}. 
      The main risk is ${data.risk}. 
      A healthier alternative is ${data.alternative}.`
    );

    const preferred =
      voices.find(v => v.name.includes("Google")) ||
      voices.find(v => v.lang.includes("en")) ||
      voices[0];

    msg.voice = preferred;
    msg.rate = 0.9;
    msg.pitch = 1;
    msg.volume = 1;

    window.speechSynthesis.speak(msg);
  };

  const circleDash = 2 * Math.PI * 60;
  const percent = Math.min((data.calories / 500) * 100, 100);
  const offset = circleDash - (circleDash * percent) / 100;

  return (
    <div className="result-container">
      <div className="neo-card">

        

        <h1 className="big-heading">Nutrition Analysis</h1>

        <p className="category"> {data.category}</p>
        <p className="description"> {data.description}</p>

        <div className="wheel-container">
          <svg width="160" height="160">
            <circle
              cx="80"
              cy="80"
              r="60"
              stroke="#1e293b"
              strokeWidth="14"
              fill="none"
            />
            <circle
              cx="80"
              cy="80"
              r="60"
              stroke="#3b82f6"
              strokeWidth="14"
              fill="none"
              strokeDasharray={circleDash}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="progress-circle"
            />
          </svg>

          <div className="wheel-text">
            <h2>{data.calories}</h2>
            <p>kcal</p>
          </div>
        </div>

        <h2 className="food-name">{data.food}</h2>
        <h3 className={`health-badge ${badge.color}`}>
          {badge.label}
        </h3>

        <div className="macros">
          {data.nutrients?.map((item, index) => (
            <div key={index} className="macro-box">
              {item.name}: {item.value}
            </div>
          ))}
        </div>

        <div className="risk-box">
           <strong>Risk:</strong> {data.risk}
        </div>

        <div className="alt-box">
           <strong>Better Option:</strong> {data.alternative}
        </div>

        {/*<button onClick={speakResult} className="speak-btn">
           Hear Result
        </button>

        {!ready && (
          <p style={{ color: "gray", marginTop: "10px" }}>
            Click anywhere once to enable speech
          </p>
        )}*/}
      </div>
    </div>
  );
}

export default Test;
