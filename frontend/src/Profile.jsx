import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function Profile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [message, setMessage] = useState("");

  // Food list
  const food101List = [
    "apple_pie","baby_back_ribs","baklava","beef_carpaccio","beef_tartare",
    "beet_salad","beignets","bibimbap","bread_pudding","breakfast_burrito",
    "bruschetta","caesar_salad","cannoli","caprese_salad","carrot_cake",
    "ceviche","cheese_plate","cheesecake","chicken_curry","chicken_quesadilla",
    "chicken_wings","chocolate_cake","chocolate_mousse","churros","clam_chowder",
    "club_sandwich","crab_cakes","creme_brulee","croque_madame","cup_cakes",
    "deviled_eggs","donuts","dumplings","edamame","eggs_benedict","escargots",
    "falafel","filet_mignon","fish_and_chips","foie_gras","french_fries",
    "french_onion_soup","french_toast","fried_calamari","fried_rice",
    "frozen_yogurt","garlic_bread","gnocchi","greek_salad",
    "grilled_cheese_sandwich","grilled_salmon","guacamole","gyoza","hamburger",
    "hot_and_sour_soup","hot_dog","huevos_rancheros","hummus","ice_cream",
    "lasagna","lobster_bisque","lobster_roll_sandwich",
    "macaroni_and_cheese","macarons","miso_soup","mussels","nachos","omelette",
    "onion_rings","oysters","pad_thai","paella","pancakes","panna_cotta",
    "peking_duck","pho","pizza","pork_chop","poutine","prime_rib",
    "pulled_pork_sandwich","ramen","ravioli","red_velvet_cake","risotto",
    "samosa","sashimi","scallops","seaweed_salad","shrimp_and_grits",
    "spaghetti_bolognese","spaghetti_carbonara","spring_rolls","steak",
    "strawberry_shortcake","sushi","tacos","takoyaki","tiramisu",
    "tuna_tartare","waffles"
  ];

  // Loading user
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      setForm({
        ...parsed,
        today_food_intake: (parsed.today_food || [])
          .map(f => f.foodname)
          .join(","),
      });
    }
  }, []);

  if (!user) return <div className="p-10 text-center">No user logged in</div>;

  //Calculations 
  const totalCalories = user.total_calories || 0;
  const dailyTarget = user.daily_calorie_target || 0;
  const remaining = dailyTarget - totalCalories;
  const foodConsumed = user.today_food || [];
  const isOver = remaining < 0;

  // HEALTH SCORE
  const calorieRatio = dailyTarget
    ? Math.min(totalCalories / dailyTarget, 1.5)
    : 0;

  let score = 100;
  score -= Math.abs(1 - calorieRatio) * 40;

  const uniqueFoods = new Set(foodConsumed.map(f => f.foodname)).size;
  score += Math.min(uniqueFoods * 3, 15);

  if (foodConsumed.length === 0) score -= 30;

  const healthScore = Math.max(0, Math.min(100, Math.round(score)));

  let healthLabel = "Excellent";
  if (healthScore < 80) healthLabel = "Good";
  if (healthScore < 60) healthLabel = "Needs Improvement";
  if (healthScore < 40) healthLabel = "Unhealthy";

  // --- Handlers ---
  const handleChange = e => {
    const { name, value, selectedOptions } = e.target;
    if (name === "today_food_intake") {
      const vals = Array.from(selectedOptions, o => o.value);
      setForm({ ...form, [name]: vals.join(",") });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const updateUser = async () => {
    try {
      const res = await axios.put("http://localhost:5000/update_user", {
        name: user.name,
        updates: {
          age: form.age,
          gender: form.gender,
          weight: form.weight,
          height: form.height,
          activity_level: form.activity_level,
          goal: form.goal,
          email: form.email,
          today_food_intake: form.today_food_intake,
        },
      });

      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setEditMode(false);
      setMessage("Profile updated successfully!");
    } catch {
      setMessage("Update failed.");
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-8">

        {message && (
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-xl">
            {message}
          </div>
        )}

        {/* PROFILE CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-lg p-8"
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Welcome, {user.name} 👋
          </h2>

          {!editMode ? (
            <>
              {/* USER INFO */}
              <div className="grid md:grid-cols-2 gap-4 text-slate-700">
                <p><b>Email:</b> {user.email}</p>
                <p><b>Age:</b> {user.age}</p>
                <p><b>Gender:</b> {user.gender}</p>
                <p><b>Weight:</b> {user.weight} kg</p>
                <p><b>Height:</b> {user.height} cm</p>
                <p><b>Activity:</b> {user.activity_level}</p>
                <p><b>Goal:</b> {user.goal}</p>
              </div>

              {/* METRICS */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
  
  {/* BMR */}
  <div className="bg-white rounded-2xl shadow-md p-5 border-l-4 border-emerald-500">
    <p className="text-sm text-slate-500">BMR</p>
    <p className="text-2xl font-bold text-slate-900">
      {user.bmr?.toFixed(2)} kcal
    </p>
  </div>

  {/* TDEE */}
  <div className="bg-white rounded-2xl shadow-md p-5 border-l-4 border-green-500">
    <p className="text-sm text-slate-500">TDEE</p>
    <p className="text-2xl font-bold text-slate-900">
      {user.tdee?.toFixed(2)} kcal
    </p>
  </div>

  {/* Daily Target */}
  <div className="bg-white rounded-2xl shadow-md p-5 border-l-4 border-blue-500">
    <p className="text-sm text-slate-500">Daily Target</p>
    <p className="text-2xl font-bold text-slate-900">
      {dailyTarget} kcal
    </p>
  </div>

  {/* Remaining */}
  <div
    className={`rounded-2xl shadow-md p-5 border-l-4 ${
      remaining < 0
        ? "bg-red-50 border-red-500"
        : "bg-emerald-50 border-emerald-600"
    }`}
  >
    <p className="text-sm text-slate-500">
      {remaining < 0 ? "Over Budget" : "Remaining"}
    </p>
    <p
      className={`text-2xl font-bold ${
        remaining < 0 ? "text-red-600" : "text-emerald-700"
      }`}
    >
      {Math.abs(remaining)} kcal
    </p>
  </div>

</div>


              {/* HEALTH SCORE */}
              <div className="mt-8 bg-white border border-emerald-200 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-2">Health Score</h3>
                <p className="text-4xl font-bold text-emerald-600">{healthScore}/100</p>
                <p className="text-slate-600">{healthLabel}</p>
              </div>
              <div className="mt-8 bg-white rounded-2xl shadow-md p-6">
  <h3 className="text-lg font-semibold text-slate-800 mb-4">
    Today’s Food Log
  </h3>

  {foodConsumed.length > 0 ? (
    <div className="space-y-3">
      {foodConsumed
        .slice()
        .reverse()
        .map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between border-b last:border-none pb-2"
          >
            {/* Food Name */}
            <div>
              <p className="font-medium text-slate-800">
                {item.foodname.replace(/_/g, " ")} {/*{item.quantity}*/}
              </p>
              {/*<p className="text-xs text-slate-500">
                {new Date(item.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>*/}
            </div>

            {/* Calories */}
            <span className="text-sm font-semibold text-slate-700">
              {item.calories} kcal
            </span>
          </div>
        ))}
    </div>
  ) : (
    <p className="text-sm text-slate-500 text-center py-6">
      No food logged today. Start by adding your first meal 🍎
    </p>
  )}
</div>


              <button
                onClick={() => setEditMode(true)}
                className="mt-6 px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700"
              >
                Edit Profile
              </button>
            </>
          ) : (
            <>
              {/* EDIT FORM */}
              <div className="grid md:grid-cols-2 gap-4">
                {["email","age","gender","weight","height","activity_level","goal"].map(f => (
                  <input
                    key={f}
                    name={f}
                    value={form[f] || ""}
                    onChange={handleChange}
                    placeholder={f.replace("_"," ")}
                    className="p-3 rounded-xl border"
                  />
                ))}
              </div>

              <select
                multiple
                name="today_food_intake"
                value={(form.today_food_intake || "").split(",").filter(Boolean)}
                onChange={handleChange}
                className="w-full mt-4 p-3 rounded-xl border h-40"
              >
                {food101List.map(food => (
                  <option key={food} value={food}>
                    {food.replace(/_/g," ").toUpperCase()}
                  </option>
                ))}
              </select>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={updateUser}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-xl"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="px-6 py-2 bg-slate-300 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default Profile;
