import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css"; 

function Profile() {
const [user, setUser] = useState(null);
const [editMode, setEditMode] = useState(false);
const [form, setForm] = useState({});
const [message, setMessage] = useState("");
//const [recentOptimizations, setRecentOptimizations] = useState([]); 

// --- Food List extracted from backend (Used for dropdown options) ---
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


useEffect(() => {
  const savedUser = localStorage.getItem("user");
  if (savedUser) {
    const parsed = JSON.parse(savedUser);
    setUser(parsed);
    const initialFoodNames = (parsed.today_food || []).map(item => item.foodname).join(',');
    
    setForm({
        ...parsed,
        total_calories: parsed.total_calories || 0,
        today_food_intake: initialFoodNames 
    });
  }
}, []);

if (!user) return <h2 className="profile-container">No user logged in</h2>;

const handleChange = (e) => {
  const { name, value, selectedOptions } = e.target;
  
  if (name === 'today_food_intake') {
      const selectedValues = Array.from(selectedOptions, option => option.value);
      setForm({ ...form, [name]: selectedValues.join(',') });
  } else {
    setForm({ ...form, [name]: value });
  }
};


const updateUser = async () => {
  try {
    const updatesToSend = {
      age: form.age,
      gender: form.gender,
      weight: form.weight,
      height: form.height,
      activity_level: form.activity_level,
      goal: form.goal,
      email: form.email,
      today_food_intake: form.today_food_intake,
    };

    const res = await axios.put("http://localhost:5000/update_user", {
      name: user.name, 
      updates: updatesToSend,
    });

    // The backend returns the user object with recalculated metrics and food log
    setUser(res.data.user);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    setEditMode(false);
    setMessage("Profile updated successfully! Metrics and food log updated.");
  } catch (err) {
    console.log(err);
    setMessage("Update failed. Please try again.");
  }
};

// --- Calorie and Food Display Logic (Remains the same) ---
const totalCaloriesConsumed = user.total_calories || 0;
const dailyTarget = user.daily_calorie_target || 0;
const remainingCalories = dailyTarget - totalCaloriesConsumed;
const foodConsumed = user.today_food || []; 
const isOverBudget = remainingCalories < 0;

// --- Styles for Multi-Select Dropdown (Copied for consistency) ---
const inputStyle = {
  width: "100%", padding: "12px 15px", border: "none", borderRadius: "10px",
  backgroundColor: "#0f172a", color: "#e2e8f0", fontSize: "0.95rem",
  boxShadow: "inset 4px 4px 8px #020617, inset -4px -4px 8px #1f2937",
  transition: "box-shadow 0.3s ease",
};
const multiSelectStyle = {
    ...inputStyle,
    height: '150px',
    padding: '10px',
    appearance: 'auto',
};
const labelStyle = {display: 'block', color: '#94a3b8', marginBottom: '5px'};


return (
  <div className="profile-container">
  {message && <p className="message-success">{message}</p>}

  {!editMode ? (
    <div className="profile-card">
    <h2 className="welcome-heading">Welcome, {user.name} !</h2>


    <div className="data-section">
      <div className="data-item"><strong>Email:</strong> {user.email || "Not set"}</div>
      <div className="data-item"><strong>Age:</strong> {user.age || "Not set"}</div>
      <div className="data-item"><strong>Gender:</strong> {user.gender || "Not set"}</div>
      <div className="data-item"><strong>Weight:</strong> {user.weight || "Not set"} kg</div>
      <div className="data-item"><strong>Height:</strong> {user.height || "Not set"} cm</div>
      <div className="data-item"><strong>Activity Level:</strong> {user.activity_level || "Not set"}</div>
      <div className="data-item"><strong>Goal:</strong> {user.goal || "Not set"}</div>
    </div>

    {/* --- METRIC SECTION: CALORIE TRACKING SUMMARY --- */}
    <div className="metric-section">
      <p>Basal Metabolic Rate (BMR):<strong> {user.bmr || 0}</strong> kcal</p>
      <p>Total Daily Energy Expenditure (TDEE):<strong> {user.tdee || 0}</strong> kcal</p>
      
      <hr style={{ margin: '10px 0', borderTop: '1px solid #334155' }} />
      
      <p style={{ fontWeight: 700, color: '#60a5fa' }}>Daily Calorie Target:<strong> {dailyTarget}</strong> kcal</p>
      
      {/* Total Calories Consumed */}
      <p style={{ color: isOverBudget ? '#f87171' : '#10b981', fontWeight: 700 }}>
        CALORIES CONSUMED TODAY:<strong> {totalCaloriesConsumed}</strong> kcal
      </p>
      
      {/* Remaining Calories */}
      <p style={{ color: isOverBudget ? '#f87171' : '#10b981' }}>
        {isOverBudget ? 'OVER BUDGET BY' : 'REMAINING'}:
        <strong> {Math.abs(remainingCalories)}</strong> kcal
      </p>
    </div>
    
    {/* --- TODAY'S FOOD INTAKE LOG --- */}
    <div className="food-intake-section" style={{ marginTop: 30 }}>
        <h3 style={{ color: '#60a5fa', borderBottom: '1px solid #334155', paddingBottom: '10px', marginBottom: '15px' }}>
            Today's Food Log 
        </h3>
        
        {foodConsumed.length > 0 ? (
            foodConsumed.slice().reverse().map((item, index) => ( 
                <div key={index} className="food-item-log" style={{
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    padding: '8px 0', 
                    borderBottom: '1px dotted #475569',
                    fontSize: '0.9rem'
                }}>
                    <span style={{color: 'white', fontWeight: 600, flexGrow: 1}}>
                        {item.foodname} (x{item.quantity})
                    </span>
                    <span style={{color: '#94a3b8', width: '80px', textAlign: 'right'}}>
                        {item.calories} kcal
                    </span>
                    <span style={{color: '#64748b', fontSize: '0.85rem', marginLeft: '10px'}}>
                        {new Date(item.timestamp).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})}
                    </span>
                </div>
            ))
        ) : (
            <p style={{ color: '#94a3b8', textAlign: 'center', padding: '15px' }}>
                No food logged today! Log your first meal to start tracking.
            </p>
        )}
    </div>


    <button onClick={() => { setEditMode(true); setMessage(""); }} className="button-primary" style={{ marginTop: 20 }}>
      Edit Profile
    </button>
    </div>
  ) : (
    <div className="profile-card edit-form-container">
    <h2 className="welcome-heading">Edit Profile Details</h2>
    <input name="email" type="email" value={form.email || ""} onChange={handleChange} placeholder="Email"/>
    <input name="age" type="number" value={form.age || ""} onChange={handleChange} placeholder="Age"/>
    <input name="gender" value={form.gender || ""} onChange={handleChange} placeholder="Gender (Male/Female)"/>
    <input name="weight" type="number" value={form.weight || ""} onChange={handleChange} placeholder="Weight (kg)"/>
    <input name="height" type="number" value={form.height || ""} onChange={handleChange} placeholder="Height (cm)"/>
    <input name="activity_level" value={form.activity_level || ""} onChange={handleChange} placeholder="Activity Level (e.g., Sedentary, Lightly Active)"/>
    <input name="goal" value={form.goal || ""} onChange={handleChange} placeholder="Goal (e.g., Maintain, Lose Weight, Gain Muscle)"/>
    
    <hr style={{ margin: '20px 0', borderTop: '1px solid #334155' }} />
    
    {/* --- Food Intake Edit/Reset Dropdown --- */}
    <label className="edit-hint" style={labelStyle}>
        Edit Today's Food Log (Changes reset the log and recalculate total consumed)
    </label>
    <select 
        name="today_food_intake" 
        onChange={handleChange} 
        style={multiSelectStyle}
        multiple={true} // Allow multiple selections
        // Use the helper to determine which items are currently selected
        value={(form.today_food_intake || '').split(',').filter(f => f)} 
    >
        <option value="" disabled>Select food items (Ctrl/Cmd + click)</option>
        {food101List.map(food => (
            <option key={food} value={food}>
                {food.replace(/_/g, ' ').toUpperCase()}
            </option>
        ))}
    </select>
    <p className="edit-hint" style={{marginTop: '15px'}}>
      *Hold Ctrl or Cmd to select multiple items. Calories will be recalculated for one serving of each item selected.
    </p>


    <p className="edit-hint" style={{marginTop: '15px'}}>
      (BMR, TDEE, and Daily Calorie Target will be recalculated automatically upon saving if metrics change.)
    </p>

    <button onClick={updateUser} className="button-primary">
      Save Changes
    </button>

    <button onClick={() => {
        setEditMode(false);
        // Reset form to the last saved user state upon cancel
        setForm(user); 
    }} className="button-secondary">
      Cancel
    </button>
    </div>
  )}
  </div>
);
}

export default Profile;