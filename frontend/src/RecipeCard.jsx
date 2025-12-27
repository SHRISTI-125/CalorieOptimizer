import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Helper
const capitalize = (s = "") => s.charAt(0).toUpperCase() + s.slice(1);

// Skeleton loader
const Skeleton = () => (
  <div className="mt-6 space-y-4 animate-pulse">
    <div className="h-32 bg-green-50 rounded-xl" />
    <div className="h-5 w-1/2 bg-green-100 rounded" />
    <div className="h-4 w-32 bg-green-100 rounded" />
    <div className="grid grid-cols-2 gap-3">
      <div className="h-10 bg-green-50 rounded-lg" />
      <div className="h-10 bg-green-50 rounded-lg" />
    </div>
  </div>
);

// Calculate health badge
const getHealthBadge = (nutrients = []) => {
  let sugar = 0;
  let fat = 0;
  nutrients.forEach((n) => {
    if (n.name.toLowerCase().includes("sugar")) sugar = parseInt(n.value);
    if (n.name.toLowerCase().includes("fat")) fat = parseInt(n.value);
  });

  if (sugar >= 20 || fat >= 15) return { label: "UNHEALTHY", color: "red" };
  if (sugar >= 10 || fat >= 8) return { label: "MODERATE", color: "orange" };
  return { label: "HEALTHY", color: "green" };
};

export default function RecipeCard() {
  const [ingredients, setIngredients] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    try {
      setSaved(JSON.parse(localStorage.getItem("savedRecipes")) || []);
    } catch {
      setSaved([]);
    }
  }, []);

  const isSaved = result && saved.some((r) => r.recipe_name === result.recipe_name);

  const getRecipe = async () => {
    if (!ingredients.trim()) {
      setError("Please enter ingredients");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("http://127.0.0.1:5000/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
    } catch (e) {
      setError(e.message || "Backend not reachable");
    } finally {
      setLoading(false);
    }
  };

  const toggleSave = () => {
    if (!result) return;
    const updated = isSaved
      ? saved.filter((r) => r.recipe_name !== result.recipe_name)
      : [...saved, result];
    setSaved(updated);
    localStorage.setItem("savedRecipes", JSON.stringify(updated));
  };

  const healthBadge = result ? getHealthBadge(result.nutrients || []) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 px-6 py-12">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-green-100 p-8">

        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-green-700">
            Recipe Generator
          </h1>
          <p className="text-slate-500 mt-2">
            Enter ingredients & get instant recipes
          </p>
        </div>

        {/* INPUT */}
        <div className="flex gap-3">
          <input
            className="flex-1 px-4 py-3 rounded-xl border border-green-200
              focus:ring-2 focus:ring-green-400 outline-none"
            placeholder="e.g. tomato, onion, rice"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && getRecipe()}
          />
          <button
            onClick={getRecipe}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-green-600 text-white font-bold
              hover:bg-green-700 transition disabled:opacity-60"
          >
            {loading ? "Loading..." : "Generate"}
          </button>
        </div>

        {error && (
          <p className="mt-4 text-center text-red-500 font-medium">{error}</p>
        )}

        {loading && <Skeleton />}

        {!loading && !result && !error && (
          <div className="mt-8 text-center text-slate-400">
            Enter ingredients to see magic ✨
          </div>
        )}

        {/* RESULT */}
        {result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-10 space-y-8"
          >

            {/* TITLE CARD */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="p-6 rounded-2xl bg-gradient-to-r from-green-100 to-green-50 border border-green-200 shadow"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-green-800">
                    {capitalize(result.recipe_name)}
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    ⏱ {result.cook_time_minutes} minutes
                  </p>
                </div>
                <button
                  onClick={toggleSave}
                  className="text-green-700 font-semibold hover:scale-105 transition"
                >
                  {isSaved ? "💚 Saved" : "♡ Save"}
                </button>
              </div>
            </motion.div>

            {/* NUTRITION BADGES */}
            {result.nutrients && (
              <div className="flex flex-wrap gap-2">
                {result.nutrients.map((nutrient, idx) => (
                  <motion.span
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="px-3 py-1 bg-green-50 border border-green-200 rounded-full text-sm font-semibold text-green-800 shadow-sm"
                  >
                    {capitalize(nutrient.name)}: {nutrient.value}
                  </motion.span>
                ))}
              </div>
            )}

            {/* AI Health Score */}
            {healthBadge && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`inline-block px-4 py-2 rounded-full font-bold mt-2
                  ${healthBadge.color === "green" ? "bg-green-100 text-green-800" : ""}
                  ${healthBadge.color === "orange" ? "bg-orange-100 text-orange-800" : ""}
                  ${healthBadge.color === "red" ? "bg-red-100 text-red-800" : ""}`}
              >
                Health: {healthBadge.label}
              </motion.div>
            )}

            {/* INGREDIENTS */}
            <div>
              <h3 className="font-bold text-lg text-slate-800 mb-3">
                🧂 Ingredients
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.ingredients.map((i, idx) => (
                  <motion.span
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="px-4 py-2 bg-white border border-green-200
                      rounded-full text-sm shadow-sm hover:shadow-green-200 transition"
                  >
                    {i}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* STEPS */}
            <div>
              <h3 className="font-bold text-lg text-slate-800 mb-4">
                👩‍🍳 Cooking Steps
              </h3>

              <div className="space-y-4">
                {result.steps.map((step, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-xl p-5 border border-green-200
                      shadow-md shadow-green-100 hover:shadow-green-200 transition"
                  >
                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 flex items-center justify-center
                        rounded-full bg-green-600 text-white font-bold">
                        {idx + 1}
                      </div>
                      <p className="text-slate-700 leading-relaxed">{step}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

          </motion.div>
        )}

      </div>
    </div>
  );
}
