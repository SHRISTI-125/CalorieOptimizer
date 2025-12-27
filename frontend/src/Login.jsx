import React, { useState } from "react";
import axios from "axios";
import "./index.css";

function Login({ onBack }) {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    remember: false,
  });

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrors({});

    try {
      const res = await axios.post("http://localhost:5000/login", formData);

      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      setMessage("Login successful!");

      setTimeout(() => {
        window.location.href = "/profile";
      }, 700);
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setMessage("Invalid credentials. Please try again.");
      }
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-green-100">
        
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900">
            Welcome Back 🌱
          </h2>
          <p className="text-slate-500 mt-2">
            Login to continue your journey
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              name="name"
              type="text"
              placeholder="Username"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-slate-600">
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
                className="accent-green-600"
              />
              Remember me
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-200 hover:bg-green-700 hover:-translate-y-0.5 transition-all"
          >
            Login
          </button>
        </form>

        {/* Message */}
        {message && (
          <p
            className={`mt-4 text-center text-sm font-medium ${
              message.toLowerCase().includes("success")
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        {/* Back */}
        {onBack && (
          <button
            onClick={onBack}
            className="mt-6 w-full text-sm text-green-600 hover:underline"
          >
            ← Back to Home
          </button>
        )}
      </div>
    </div>
  );
}

export default Login;
