import React, { useState, useEffect } from "react";

const HEADER_IMAGE = "/mnt/data/0c454720-ef2e-4504-b8ef-4c9cea6503b5.png";

const capitalizeFirst = (str = "") => (str ? str.charAt(0).toUpperCase() + str.slice(1) : "");

// Skeleton component
const SkeletonLoader = () => (
  <div style={styles.resultBox}>
    <div style={styles.skeletonHeader}></div>
    <div style={styles.skeletonTitle}></div>
    <div style={styles.skeletonTime}></div>
    <div style={styles.skeletonSection}>
      <div style={styles.skeletonText}></div>
      <div style={styles.skeletonText}></div>
    </div>
  </div>
);

export function RecipeCard() {
  const [ingredients, setIngredients] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [savedRecipes, setSavedRecipes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("savedRecipes")) || [];
    } catch {
      return [];
    }
  });
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (result) {
      setIsSaved(savedRecipes.some((r) => r.recipe_name === result.recipe_name));
    } else {
      setIsSaved(false);
    }
  }, [result, savedRecipes]);

  
  useEffect(() => {
    const fontLink = document.createElement("link");
    fontLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap";
    fontLink.rel = "stylesheet";
    document.head.appendChild(fontLink);

    
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes cardSlide { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes pop { 0% { transform: scale(0.9); opacity: 0 } 100% { transform: scale(1); opacity: 1 } }
      @keyframes fadeInUp { 0% { opacity: 0; transform: translateY(12px) } 100% { opacity: 1; transform: translateY(0) } }
      /* subtle background animation */
      @keyframes bgPulse { 0% { transform: scale(1); } 50% { transform: scale(1.02); } 100% { transform: scale(1); } }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(fontLink);
      document.head.removeChild(style);
    };
  }, []);

  const getRecipe = async () => {
    if (!ingredients.trim()) {
      setError("Please enter ingredients first.");
      return;
    }

    setLoading(true);
    setResult(null);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:5000/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setResult(data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Cannot connect to backend. Make sure Flask is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!result) return;
    const updated = isSaved
      ? savedRecipes.filter((r) => r.recipe_name !== result.recipe_name)
      : [...savedRecipes, result];
    setSavedRecipes(updated);
    try {
      localStorage.setItem("savedRecipes", JSON.stringify(updated));
    } catch (e) {
      console.warn("Unable to save to localStorage", e);
    }
    setIsSaved(!isSaved);
  };

  const handleShare = () => {
    if (!result) return;
    if (navigator.share) {
      navigator
        .share({
          title: result.recipe_name,
          text: `Check out this recipe: ${result.recipe_name}`,
          url: window.location.href,
        })
        .catch((e) => console.warn("Share failed", e));
    } else {
      try {
        navigator.clipboard.writeText(`${window.location.href} - ${result.recipe_name}`);
        alert("Link copied to clipboard.");
      } catch {
        alert("Sharing not supported on this device.");
      }
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        <header style={styles.headerRow}>
          <div>
            <h2 style={styles.title}>Recipe Generator</h2>
            <p style={styles.subtitle}>Type ingredients and fetch a recipe instantly</p>
          </div>
        </header>

        {/* input */}
        <div style={styles.inputGroup}>
          <input
            aria-label="ingredients"
            type="text"
            placeholder="e.g., garlic, wheat, sugar"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            style={styles.input}
            onKeyDown={(e) => {
              if (e.key === "Enter") getRecipe();
            }}
          />
          <button
            onClick={getRecipe}
            disabled={loading}
            style={styles.button}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
            }}
          >
            {loading ? "Searching..." : "Fetch Recipe"}
          </button>
        </div>

        <p style={styles.helperText}>Separate ingredients with or without commas. Press Enter to fetch.</p>

        {error && <div style={styles.error}>{error}</div>}

        {/* loading */}
        {loading && <SkeletonLoader />}

        {/* empty */}
        {!loading && !result && !error && (
          <div style={styles.emptyState}>Enter ingredients to fetch a recipe</div>
        )}

        {/* result card */}
        {result && !loading && (
          <article style={styles.resultBox}>
            {/* Glass header with subtle image texture + fetched title */}
            <div style={{ ...styles.glassHeader, backgroundImage: `linear-gradient(135deg, rgba(79,70,229,0.35), rgba(34,211,238,0.2)), url("${HEADER_IMAGE}")` }}>
              <div style={styles.glassHeaderOverlay}>
                <h3 style={styles.headerRecipeTitle}>
                  {capitalizeFirst(result.recipe_name) || "Fetched recipe"}
                </h3>
                <div style={styles.headerMeta}>
                  <span style={styles.timeBadge}>⏱ {result.cook_time_minutes} mins</span>
                  <div style={styles.smallBadges}>
                    <span style={styles.smallBadge}>Easy</span>
                    <span style={styles.smallBadge}>Quick</span>
                  </div>
                </div>
              </div>
            </div>

            {/* actions */}
            <div style={styles.actionButtons}>
              <button onClick={handleSave} style={styles.iconButton}>
                {isSaved ? "💜 Saved" : "♡ Save"}
              </button>
              <button onClick={handleShare} style={styles.iconButton}>
                🔗 Share
              </button>
            </div>

            {/* ingredients */}
            <section style={styles.section}>
              <h4 style={styles.sectionTitle}>🧂 Ingredients</h4>
              <div style={styles.ingredientsGrid}>
                {result.ingredients.map((ing, i) => (
                  <div
                    key={i}
                    style={{
                      ...styles.ingredientChip,
                      animationDelay: `${i * 80}ms`,
                    }}
                  >
                    {ing}
                  </div>
                ))}
              </div>
            </section>

            {/* steps */}
            <section style={styles.section}>
              <h4 style={styles.sectionTitle}>Steps</h4>
              <ol style={styles.stepsList}>
                {result.steps.map((step, i) => (
                  <li
                    key={i}
                    style={{
                      ...styles.stepItem,
                      animationDelay: `${i * 100}ms`,
                    }}
                  >
                    {step}
                  </li>
                ))}
              </ol>
            </section>
          </article>
        )}
      </div>
    </div>
  );
}

/* Styles - glassmorphism + modern */
const styles = {
 page: {
  minHeight: "100vh",
  display: "flex",
  alignItems: "top",
  justifyContent: "center",
  padding: "40px 20px",
  background: "linear-gradient(135deg,#0a0e1a 0%, #151025 50%, #0a0e1a 100%)", 
  fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  color: "#f0f8ff", 
  animation: "bgPulse 12s ease-in-out infinite",
 },
 card: {
  width: "100%",
  maxWidth: "800px",
  borderRadius: "18px",
  padding: "28px",
  boxShadow: "0 10px 40px rgba(0,0,0,0.8)", 
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  background: "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))", 
  border: "1px solid rgba(255,255,255,0.05)",
  animation: "cardSlide 0.6s cubic-bezier(.16,.84,.44,1)",
 },
 headerRow: {
  display: "flex",
  justifyContent: "center",
  marginBottom: "18px",
  textAlign: "center",
 },
 title: {
  margin: 0,
  fontSize: "24px",
  color: "white",
  fontWeight: 700,
 },
 subtitle: {
  margin: "6px 0 0",
  color: "#e0e9f4", 
  fontSize: "13.5px",
  fontWeight: 400,
 },
 inputGroup: {
  display: "flex",
  gap: "12px",
  marginTop: "18px",
  marginBottom: "8px",
  alignItems: "center",
 },
 input: {
  flex: 1,
  padding: "12px 16px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.03)",
  color: "#f0f8ff", 
  fontSize: "15px",
  outline: "none",
  transition: "box-shadow 0.2s ease, transform 0.08s ease",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
 },
 button: {
  padding: "10px 18px",
  borderRadius: "999px",
  border: "none",
  background: "linear-gradient(90deg,#ffcc33,#ff8833)", 
  color: "#1a1200", 
  fontWeight: 700,
  cursor: "pointer",
  fontSize: "15px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.6), 0 6px 18px rgba(255,170,50,0.25)", 
  transform: "translateY(0)",
  transition: "transform 120ms ease, box-shadow 180ms ease",
 },
 helperText: {
  marginTop: "10px",
  fontSize: "13px",
  color: "#b0c4e7", 
 },
 error: {
  marginTop: "14px",
  padding: "12px",
  borderRadius: "10px",
  background: "linear-gradient(180deg, rgba(220,57,88,0.08), rgba(220,57,88,0.04))", 
  border: "1px solid rgba(220,57,88,0.14)",
  color: "#ffdfe8",
  fontSize: "14px",
  textAlign: "center",
 },
 emptyState: {
  marginTop: "20px",
  textAlign: "center",
  color: "#b0c4e7", 
  fontSize: "15px",
 },

 
 resultBox: {
  marginTop: "24px",
  borderRadius: "14px",
  overflow: "hidden",
  border: "1px solid rgba(255,255,255,0.06)",
  background: "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
  boxShadow: "0 6px 28px rgba(0,0,0,0.7)",
 },

 glassHeader: {
  height: "120px",
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "center",
  backgroundSize: "cover",
  backgroundPosition: "center",
  position: "relative",
 },
 glassHeaderOverlay: {
  width: "100%",
  padding: "16px 22px",
  backdropFilter: "blur(6px)",
  WebkitBackdropFilter: "blur(6px)",
  background: "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
  borderTop: "1px solid rgba(255,255,255,0.04)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  color: "#fff",
 },
 headerRecipeTitle: {
  margin: 0,
  fontSize: "20px",
  fontWeight: 700,
  color: "#ffffff",
  textShadow: "0 4px 22px rgba(0,0,0,0.45)",
 },
 headerMeta: {
  display: "flex",
  alignItems: "center",
  gap: "10px",
 },
 timeBadge: {
  padding: "6px 10px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.06)",
  color: "#eaf2ff", 
  border: "1px solid rgba(255,255,255,0.04)",
  fontSize: "13px",
  fontWeight: 600,
 },
 smallBadges: {
  display: "flex",
  gap: "8px",
  alignItems: "center",
 },
 smallBadge: {
  padding: "6px 8px",
  borderRadius: "8px",
  background: "rgba(255,255,255,0.03)",
  color: "#e0e9f4", 
  fontSize: "12px",
  border: "1px solid rgba(255,255,255,0.03)",
 },

 actionButtons: {
  display: "flex",
  gap: "10px",
  padding: "14px 18px 0 18px",
 },
 iconButton: {
  padding: "8px 12px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.04)",
  background: "transparent",
  color: "#ffdfa0", 
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: 600,
 },

 section: {
  padding: "14px 18px 22px 18px",
 },
 sectionTitle: {
  margin: 0,
  marginBottom: "10px",
  color: "#e0e9f4", 
  fontSize: "16px",
  fontWeight: 700,
 },

 ingredientsGrid: {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
 },
 ingredientChip: {
  background: "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02))",
  color: "#e0e9f4", 
  borderRadius: "999px",
  padding: "8px 14px",
  fontSize: "13px",
  border: "1px solid rgba(255,255,255,0.04)",
  animation: "pop 300ms ease forwards",
  opacity: 0,
  transform: "scale(0.92)",
 },

 stepsList: {
  marginTop: "8px",
  paddingLeft: "18px",
 },
 stepItem: {
  marginBottom: "12px",
  color: "#c8e0ff", 
  lineHeight: 1.65,
  fontSize: "15px",
  animation: "fadeInUp 420ms ease forwards",
  opacity: 0,
  transform: "translateY(8px)",
 },

 
 skeletonHeader: {
  height: "80px",
  background: "linear-gradient(90deg,#0a0e1a,#151025)", 
  borderRadius: "8px",
  marginBottom: "14px",
 },
 skeletonTitle: {
  height: "18px",
  width: "45%",
  background: "#151025", 
  borderRadius: "6px",
  marginBottom: "8px",
 },
 skeletonTime: {
  height: "14px",
  width: "120px",
  background: "#151025", 
  borderRadius: "6px",
  marginBottom: "14px",
 },
 skeletonSection: {
  marginBottom: "14px",
 },
 skeletonText: {
  height: "50px",
  width: "100%",
  background: "#151025", 
  borderRadius: "6px",
  marginBottom: "8px",
 },
};


export default RecipeCard;
