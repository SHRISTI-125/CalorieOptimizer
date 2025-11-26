import React, { useState } from "react";
import axios from "axios";

function Signup() {
// --- Food List extracted from your backend dictionary (used for dropdown options) ---
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
    
  if (name === 'today_food_intake') {
      const selectedValues = Array.from(selectedOptions, option => option.value);
      setFormData({ ...formData, [name]: selectedValues.join(',') });
  } else {
      setFormData({...formData, [name]: value });
  }
};


const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage("");
  setErrors({});
  setIsSuccessful(false); 

  try {
  const response = await axios.post("http://localhost:5000/signup", formData);
  
  const target = response.data.daily_calorie_target;
  const consumed = response.data.total_calories || 0;
  
  setMessage(`Account created successfully! Your Daily Calorie Target is: ${target} kcal. You logged ${consumed} kcal today.`);
  setIsSuccessful(true); 
  
  } catch (err) {
  if (err.response && err.response.data.error) {
    const backendErrors = err.response.data.error; 
    
    if (typeof backendErrors === 'object' && !Array.isArray(backendErrors)) {
        setErrors(backendErrors);
    } else {
        setMessage(backendErrors.email || "Signup failed. Please check the data.");
    }

  } else {
    setMessage("Signup failed. Please check your network or try again.");
  }
  }
};
  
  const handleLoginRedirect = () => {
    window.location.href = "/login"; 
  };


// --- Inline Styles Definitions ---

const containerStyle = {
  maxWidth: "450px",
  margin: "auto",
  padding: "40px",
  backgroundColor: "#111827", 
  borderRadius: "20px",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.6)",
  color: "#e2e8f0",
  fontFamily: 'Poppins, sans-serif',
};

const headingStyle = {
  fontSize: "1.8rem",
  color: "#60a5fa", 
  marginBottom: "25px",
  fontWeight: 700,
  textAlign: "center",
};

const formStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr", 
  gap: "15px",
};

const inputContainerStyle = {
  marginBottom: "0", 
  gridColumn: "span 2", 
};

const halfWidthStyle = {
  ...inputContainerStyle,
  gridColumn: "span 1", 
};


const inputStyle = {
  width: "100%",
  padding: "12px 15px",
  border: "none",
  borderRadius: "10px",
  backgroundColor: "#0f172a", 
  color: "#e2e8f0",
  fontSize: "0.95rem",
  boxShadow: "inset 4px 4px 8px #020617, inset -4px -4px 8px #1f2937",
  transition: "box-shadow 0.3s ease",
};

const selectStyle = {
    ...inputStyle,
    appearance: 'none', 
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 15px center',
    backgroundSize: '1em',
    paddingRight: '35px', 
};

const multiSelectStyle = {
    ...inputStyle,
    height: '150px', 
    padding: '10px',
    appearance: 'auto',
};

const labelStyle = {
  display: "block",
  marginBottom: "5px",
  color: "#94a3b8", 
  fontSize: "0.9rem",
  fontWeight: 500,
  textAlign: "left",
};

const errorStyle = {
  color: "#f87171", 
  fontSize: "0.8rem",
  marginTop: "5px",
  textAlign: "left",
};

const buttonStyle = {
  padding: "14px 25px",
  borderRadius: "12px",
  border: "none",
  fontSize: "1.1rem",
  fontWeight: 600,
  cursor: "pointer",
  marginTop: "20px",
  background: "#3b82f6", 
  color: "white",
  boxShadow: "0 6px 20px rgba(59, 130, 246, 0.4)",
  transition: "all 0.3s ease",
  width: "100%",
  gridColumn: "span 2", 
};

const messageStyle = {
  color: "#34d399", 
  backgroundColor: "#153e24",
  padding: "12px",
  borderRadius: "8px",
  marginTop: "25px",
  textAlign: "center",
  fontWeight: 500,
};

const loginButtonStyle = {
    ...buttonStyle,
    marginTop: "25px",
    background: "#10b981", 
    boxShadow: "0 6px 20px rgba(16, 185, 129, 0.5)",
}

// --- Dropdown Options ---
const genderOptions = ["Male", "Female", "Other"];
const activityOptions = [
    { value: "Sedentary", label: "Sedentary (little or no exercise)" },
    { value: "Lightly Active", label: "Lightly Active (1-3 days/week)" },
    { value: "Moderately Active", label: "Moderately Active (3-5 days/week)" },
    { value: "Very Active", label: "Very Active (6-7 days/week)" },
    { value: "Super Active", label: "Super Active (daily intense exercise)" },
];


return (
  <div style={containerStyle}>
  <h2 style={headingStyle}>Create Your Account </h2>
  
    {!isSuccessful ? (
      <form onSubmit={handleSubmit} style={formStyle}>
        
        {/* Render standard input fields */}
        {['name', 'email', 'password', 'age', 'weight', 'height'].map((field) => {
          const label = field.charAt(0).toUpperCase() + field.slice(1).replace(/_level/, ' Level');
          const type = field === "password" || field === "email" ? field : (["age", "weight", "height"].includes(field) ? "number" : "text");
          const placeholder = (field === 'age' ? 'Years' : field === 'weight' ? 'kg' : field === 'height' ? 'cm' : label);
          
          const currentInputContainerStyle = (['age', 'weight', 'height'].includes(field)) ? halfWidthStyle : inputContainerStyle;

          return (
            <div key={field} style={currentInputContainerStyle}>
              <label style={labelStyle}>{label}</label>
              <input 
                type={type} 
                name={field} 
                value={formData[field]} 
                onChange={handleChange} 
                style={inputStyle}
                placeholder={placeholder}
                min={type === 'number' ? 1 : null} 
              />
              {errors[field] && <p style={errorStyle}>{errors[field]}</p>}
            </div>
          )
        })}

        {/* --- Gender Dropdown --- */}
        <div style={halfWidthStyle}>
            <label style={labelStyle}>Gender</label>
            <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                style={selectStyle}
            >
                <option value="" disabled>Select Gender</option>
                {genderOptions.map(option => (
                    <option key={option} value={option.toLowerCase()}>{option}</option>
                ))}
            </select>
            {errors['gender'] && <p style={errorStyle}>{errors['gender']}</p>}
        </div>

        {/* --- Activity Level Dropdown --- */}
        <div style={halfWidthStyle}>
            <label style={labelStyle}>Activity Level</label>
            <select
                name="activity_level"
                value={formData.activity_level}
                onChange={handleChange}
                style={selectStyle}
            >
                <option value="" disabled>Select Activity</option>
                {activityOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                ))}
            </select>
            {errors['activity_level'] && <p style={errorStyle}>{errors['activity_level']}</p>}
        </div>

        {/* --- Goal Input --- */}
        <div style={inputContainerStyle}>
            <label style={labelStyle}>Goal</label>
            <input 
                type="text" 
                name="goal" 
                value={formData.goal} 
                onChange={handleChange} 
                style={inputStyle}
                placeholder="e.g., Maintain Weight, Lose Weight"
            />
            {errors['goal'] && <p style={errorStyle}>{errors['goal']}</p>}
        </div>
        
        {/* ---Today's Food Intake MULTI-SELECT Dropdown --- */}
        <div style={inputContainerStyle}>
            <label style={labelStyle}>Today's Initial Food Intake (Optional)</label>
            <select 
                name="today_food_intake" 
                onChange={handleChange} 
                style={multiSelectStyle}
                multiple={true} 
            >
                <option value="" disabled>Select food items (Ctrl/Cmd + click)</option>
                {food101List.map(food => (
                    <option key={food} value={food}>
                        {food.replace(/_/g, ' ').toUpperCase()}
                    </option>
                ))}
            </select>
            <p style={{...errorStyle, color: '#94a3b8', marginTop: '10px'}}>
                *Hold Ctrl or Cmd to select multiple items. Calories will be calculated for one serving of each.
            </p>
            {errors['today_food_intake'] && <p style={errorStyle}>{errors['today_food_intake']}</p>}
        </div>

        <button type="submit" style={buttonStyle}>
          Save Details!
        </button>
      </form>
    ) : (
        <div style={{textAlign: "center"}}>
            {message && <p style={messageStyle}>{message}</p>}
            
            <p style={{color: "#94a3b8", fontSize: "1rem", marginTop: "20px"}}>
                Your account is ready! Please proceed to log in.
            </p>

            <button onClick={handleLoginRedirect} style={loginButtonStyle}>
                Go to Login Page 
            </button>
        </div>
    )}
  
  </div>
);
}

export default Signup;