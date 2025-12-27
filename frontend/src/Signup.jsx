import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function Signup() {
  const food101List = [
    "apple_pie", "baby_back_ribs", "baklava", "beef_carpaccio", "beef_tartare",
    "beet_salad", "beignets", "bibimbap", "bread_pudding", "breakfast_burrito",
    "bruschetta", "caesar_salad", "cannoli", "caprese_salad", "carrot_cake",
    "ceviche", "cheese_plate", "cheesecake", "chicken_curry", "chicken_quesadilla",
    "chicken_wings", "chocolate_cake", "chocolate_mousse", "churros", "clam_chowder",
    "club_sandwich", "crab_cakes", "creme_brulee", "croque_madame", "cup_cakes",
    "deviled_eggs", "donuts", "dumplings", "edamame", "eggs_benedict",
    "escargots", "falafel", "filet_mignon", "fish_and_chips", "foie_gras",
    "french_fries", "french_onion_soup", "french_toast", "fried_calamari", "fried_rice",
    "frozen_yogurt", "garlic_bread", "gnocchi", "greek_salad", "grilled_cheese_sandwich",
    "grilled_salmon", "guacamole", "gyoza", "hamburger", "hot_and_sour_soup",
    "hot_dog", "huevos_rancheros", "hummus", "ice_cream", "lasagna",
    "lobster_bisque", "lobster_roll_sandwich", "macaroni_and_cheese", "macarons", "miso_soup",
    "mussels", "nachos", "omelette", "onion_rings", "oysters",
    "pad_thai", "paella", "pancakes", "panna_cotta", "peking_duck",
    "pho", "pizza", "pork_chop", "poutine", "prime_rib",
    "pulled_pork_sandwich", "ramen", "ravioli", "red_velvet_cake", "risotto",
    "samosa", "sashimi", "scallops", "seaweed_salad", "shrimp_and_grits",
    "spaghetti_bolognese", "spaghetti_carbonara", "spring_rolls", "steak", "strawberry_shortcake",
    "sushi", "tacos", "takoyaki", "tiramisu", "tuna_tartare",
    "waffles"
];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    weight: "",
    height: "",
    activity_level: "Sedentary",
    goal: "",
    today_food_intake: ""
  });

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [isSuccessful, setIsSuccessful] = useState(false);

  const handleChange = (e) => {
    const { name, value, selectedOptions } = e.target;

    if (name === "today_food_intake") {
      const selected = Array.from(selectedOptions, o => o.value);
      setFormData({ ...formData, [name]: selected.join(",") });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/signup", formData);
      setMessage(
        `Account created! Daily target: ${res.data.daily_calorie_target} kcal`
      );
      setIsSuccessful(true);
    } catch (err) {
      setMessage("Signup failed. Please check details.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8"
      >
        <h2 className="text-2xl font-bold text-emerald-600 text-center mb-6">
          Create Your Account 🌿
        </h2>

        {!isSuccessful ? (
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            {["name", "email", "password"].map((field) => (
              <div key={field} className="col-span-2">
                <label className="text-sm font-medium text-slate-600 capitalize">
                  {field}
                </label>
                <input
                  type={field === "password" ? "password" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-400 outline-none"
                />
              </div>
            ))}

            {["age", "weight", "height"].map((field) => (
              <div key={field}>
                <label className="text-sm text-slate-600 capitalize">
                  {field}
                </label>
                <input
                  type="number"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-400"
                />
              </div>
            ))}

            <div>
              <label className="text-sm text-slate-600">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-slate-600">Activity</label>
              <select
                name="activity_level"
                value={formData.activity_level}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200"
              >
                <option>Sedentary</option>
                <option>Lightly Active</option>
                <option>Moderately Active</option>
                <option>Very Active</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="text-sm text-slate-600">Goal</label>
              <input
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                placeholder="Lose weight / Maintain"
                className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <div className="col-span-2">
              <label className="text-sm text-slate-600">
                Today's Food Intake
              </label>
              <select
                multiple
                name="today_food_intake"
                onChange={handleChange}
                className="w-full mt-1 h-32 px-3 py-2 rounded-xl border border-slate-200"
              >
                {food101List.map((food) => (
                  <option key={food} value={food}>
                    {food.replace(/_/g, " ").toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="col-span-2 mt-4 bg-emerald-500 text-white py-3 rounded-xl font-semibold shadow-md"
            >
              Save Details
            </motion.button>
          </form>
        ) : (
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-center"
          >
            <p className="bg-emerald-50 text-emerald-700 p-4 rounded-xl">
              {message}
            </p>
            <button
              onClick={() => (window.location.href = "/login")}
              className="mt-6 bg-emerald-500 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Go to Login
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default Signup;
