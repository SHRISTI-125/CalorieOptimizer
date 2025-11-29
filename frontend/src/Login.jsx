import React, { useState } from "react";
import axios from "axios";
import "./Login.css";

function Login() {
 const [formData, setFormData] = useState({
  name: "",
  password: "",
  remember: false
 });

 const [message, setMessage] = useState("");
 const [errors, setErrors] = useState({});

 const handleChange = (e) => {
  const { name, value, type, checked } = e.target;
  setFormData({
   ...formData,
   [name]: type === "checkbox" ? checked : value
  });
 };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage(""); 
  setErrors({});

  try {
   const res = await axios.post("http://localhost:5000/login", formData);

   console.log("Login Response:", res.data);

   if (res.data.user) {
    localStorage.setItem("user", JSON.stringify(res.data.user));
   }

   setMessage("Login successful!");

   setTimeout(() => {
    window.location.href = "/profile";
   }, 700);

  } catch (err) {
   console.log("Login error:", err);
      
      const genericErrorMessage = "Login failed. Please check your credentials.";

   if (err.response) {
    if (err.response.data.errors) {
     setErrors(err.response.data.errors);
          setMessage(""); 
        } else if (err.response.data.message) {
          setMessage(err.response.data.message);
        } else {
          setMessage(genericErrorMessage);
        }
   } else {
    setMessage("Network error. Could not connect to the server.");
   }
  }
 };


 return (
  <div className="login-container">
      <div className="login-card">
     <h2>Sign In 👋</h2>

     <form onSubmit={handleSubmit} className="login-form">
      <input 
              name="name" 
              type="text"
              placeholder="Username" 
              value={formData.name} 
              onChange={handleChange}
      />
      {errors.name && <p className="error-text">{errors.name}</p>}

      <input 
              name="password" 
              type="password" 
              placeholder="Password" 
              value={formData.password} 
              onChange={handleChange}
      />
      {errors.password && <p className="error-text">{errors.password}</p>}

      <label className="remember-label">
       <input 
                type="checkbox" 
                name="remember" 
                checked={formData.remember} 
                onChange={handleChange}
       />
       Keep me logged in
      </label>

      <button type="submit" className="login-btn">
              Login
          </button>
     </form>

     {message && (
            <p className={`status-message ${message.toLowerCase().includes("fail") || message.toLowerCase().includes("error") || message.toLowerCase().includes("check") ? 'error' : ''}`}>
                {message}
            </p>
        )}
    </div>
  </div>
 );
}


export default Login;
