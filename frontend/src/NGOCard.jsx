import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function NGOCard() {
  const [stateInput, setStateInput] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!stateInput.trim() && !cityInput.trim()) {
      setError("Please enter a State or City");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults([]);

    try {
      const params = new URLSearchParams();
      if (stateInput) params.append("state", stateInput.trim());
      if (cityInput) params.append("city", cityInput.trim());

      const res = await fetch(`http://127.0.0.1:5000/search?${params}`);
      if (!res.ok) throw new Error("Server error");

      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch {
      setError("Unable to fetch NGOs. Try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 px-6 py-12">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold text-center text-green-700 mb-10"
        >
          🤝 NGO Finder
        </motion.h1>

        {/* SEARCH BAR */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl border border-green-100 p-6 flex flex-col md:flex-row gap-4"
        >
          <input
            placeholder="Enter State"
            value={stateInput}
            onChange={(e) => setStateInput(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl border border-green-200
              focus:ring-2 focus:ring-green-400 outline-none"
          />
          <input
            placeholder="Enter City"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl border border-green-200
              focus:ring-2 focus:ring-green-400 outline-none"
          />
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="px-6 py-3 rounded-xl bg-green-600 text-white font-bold
              hover:bg-green-700 transition disabled:opacity-60"
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </motion.div>

        {/* ERROR */}
        {error && (
          <p className="text-center text-red-500 font-medium mt-6">{error}</p>
        )}

        {isLoading && (
          <div className="grid md:grid-cols-2 gap-6 mt-10 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-40 bg-green-50 rounded-2xl" />
            ))}
          </div>
        )}

        {/* RESULTS */}
        <AnimatePresence>
          {!isLoading && results.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid md:grid-cols-2 gap-6 mt-10"
            >
              {results.map((ngo, index) => (
                <motion.div
                  key={ngo._id || index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="bg-white rounded-2xl shadow-lg border border-green-100
                    p-6 hover:shadow-green-200 transition"
                >
                  <h3 className="text-xl font-bold text-green-800 mb-2">
                    {ngo.name}
                  </h3>

                  <p className="text-slate-600 text-sm mb-1">
                     {ngo.city ? `${ngo.city}, ` : ""}{ngo.state}
                  </p>

                  <p className="text-slate-600 text-sm mb-2">
                    {ngo.address || "Address not available"}
                  </p>

                  <p className="text-sm mb-3">
                    <span className="font-semibold">Focus:</span>{" "}
                    {Array.isArray(ngo.focus)
                      ? ngo.focus.join(", ")
                      : ngo.focus || "Not specified"}
                  </p>

                  {/* FOOD BADGE */}
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold
                      ${
                        ngo.accepts_food
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                  >
                    {ngo.accepts_food ? "Accepts Food 🍲" : "Does not accept food"}
                  </span>

                  {/* WEBSITE */}
                  {ngo.website && (
                    <a
                      href={ngo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block mt-4 text-green-600 font-semibold hover:underline"
                    >
                      Visit Website →
                    </a>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        
        {!isLoading && results.length === 0 && !error && (
          <p className="text-center text-slate-500 mt-10">
            Enter a State or City to discover NGOs near you 🌍
          </p>
        )}
      </div>
    </div>
  );
}
