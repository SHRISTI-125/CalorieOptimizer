import React, { useState } from "react";
import "./NGOCard.css";

function NGOCard() {
  const [stateInput, setStateInput] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = async () => {
    if (!stateInput.trim() && !cityInput.trim()) {
      alert("Please enter a State or City to search.");
      return;
    }

    setError(null);
    setIsLoading(true);
    setResults([]);

    try {
      const params = new URLSearchParams();

      if (stateInput.trim()) {
        params.append("state", stateInput.trim());
      }

      if (cityInput.trim()) {
        params.append("city", cityInput.trim());
      }

      const res = await fetch(`http://127.0.0.1:5000/search?${params}`);

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setResults(data);
      } else {
        setResults([]);
      }

    } catch (err) {
      console.error("Search failed:", err);
      setError("Server error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ngo-container">
      <h1 className="main-heading">🤝 NGO Finder</h1>

      <div className="search-controls">
        <input
          type="text"
          placeholder="Enter State"
          value={stateInput}
          onChange={(e) => setStateInput(e.target.value)}
          onKeyDown={handleKeyPress}
        />

        <input
          type="text"
          placeholder="Enter City "
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
          onKeyDown={handleKeyPress}
        />

        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="search-button"
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </div>

      <hr className="results-divider" />

      {error && <p className="error-text">{error}</p>}

      {isLoading && results.length === 0 && (
        <p className="no-results">Loading NGOs...</p>
      )}

      {results.length > 0 ? (
        results.map((ngo, index) => (
          <div key={ngo._id || ngo.name || index} className="ngo-card">
            <p><strong>Name:</strong> {ngo.name}</p>

            <p>
              <strong>Location:</strong>{" "}
              {ngo.city ? `${ngo.city}, ` : ""}{ngo.state}
            </p>

            <p><strong>Address:</strong> {ngo.address || "N/A"}</p>

            <p className="ngo-focus">
              <strong>Focus Areas:</strong>{" "}
              {Array.isArray(ngo.focus)
                ? ngo.focus.join(", ")
                : ngo.focus || "Not specified"}
            </p>

            <p>
              <strong>Accepts Food:</strong>
              <span
                className={`accepts-food-badge ${
                  ngo.accepts_food ? "accepts-food-yes" : "accepts-food-no"
                }`}
              >
                {ngo.accepts_food ? " Yes" : " No"}
              </span>
            </p>

            <p className="ngo-website">
              <strong>Website:</strong>{" "}
              {ngo.website ? (
                <a
                  href={ngo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {ngo.website}
                </a>
              ) : (
                "N/A"
              )}
            </p>
          </div>
        ))
      ) : (
        !isLoading &&
        !error && (
          <p className="no-results">
            Enter a State and/or City to find relevant NGOs.
          </p>
        )
      )}
    </div>
  );
}

export default NGOCard;
