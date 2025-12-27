# CalorieOptimizer 

![Status](https://img.shields.io/badge/status-active-success)
![Tech](https://img.shields.io/badge/tech-AI%20%7C%20DeepLearning%20%7C%20ML%20%7C%20React%20%7C%20Flask-blue)
![License](https://img.shields.io/badge/license-MIT-blue)

> **CalorieOptimizer** is an intelligent health-focused web application that uses **Deep Learning and Machine Learning** to analyze food, estimate calories and nutrients, detect potential health risks, generate recipes, suggest healthier alternatives, provide NGO donation options, and track **daily calorie intake** — helping users make *smarter and healthier* food decisions in real-time.

---

## 📌 Problem Statement

In today’s society, people often consume food without understanding its true nutritional impact. This results in:

- Obesity  
- Diabetes  
- Heart diseases  
- Poor eating habits  
- Increased food waste  

**CalorieOptimizer solves this problem** by using image recognition and machine learning to provide instant, personalized, and actionable nutritional insights.

---

## 🎯 Objectives

The main goals of **CalorieOptimizer** are to:

- Predict **calorie count and nutrient composition** of food items  
- Suggest **healthier alternatives** for unhealthy foods  
- Generate **recipes** using available ingredients  
- Provide **NGO donation options** to reduce food wastage  
- Track **daily calorie intake** of users  
- Promote **balanced nutrition and sustainable eating habits**

---

## ✨ Key Features

- 🍔 **Image-Based Food Recognition**  
  Upload food images to instantly identify the dish.

- 🧠 **AI-Powered Nutritional Analysis**  
  Predicts calories, macros and micronutrients using ML models.

- 🥗 **Healthier Food Alternatives**  
  Suggests better options with lower calories & higher nutrition.

- #### 📊 Detailed Nutritional Breakdown
  Calories | Sugar | Fat | Cholestrol

- 🍳 **AI Recipe Generator**  
  Generates recipes from:
  - User-entered ingredients

- 🩺 **Health Risk Detection**
  Identifies foods linked to:
  - Obesity
  - Diabetes
  - Heart Disease

- ♻️ **NGO Donation Support**
  Suggests nearby NGOs where extra food can be donated.

- 📜 **Daily Intake Tracking**
  Tracks: Daily calorie consumption | Food history | Weekly reports  

- 🌍 **Sustainability Focus**
  Encourages **zero food waste** and mindful eating.

---

## 🛠️ Tech Stack

### 🎨 Frontend
<p>
  <img src="https://skillicons.dev/icons?i=html,css,js,react" />
</p>


---

### 🧠 Backend
<p>
  <img src="https://skillicons.dev/icons?i=python,tensorflow,flask,scikitlearn,mongodb,jupyter" />
</p>

---

## 📚 Datasets Used

- **Food101 Dataset (Kaggle)**  
  https://www.kaggle.com/datasets/dansbecker/food-101

- **Food.com Recipes Dataset (Kaggle)**  
  https://www.kaggle.com/datasets/recipe

These datasets were used for **food classification, nutrition estimation, and recipe generation**.

---

## 🧩 System Architecture

```
User
   ↓
React Frontend
   ↓
Flask API
   ↓
Machine Learning Model
   ↓
MongoDB Database
```

---

## ⚙️ How To Run This Project Locally

### Clone the Repository

```bash
git clone https://github.com/SHRISTI-125/CalorieOptimizer.git
cd CalorieOptimizer
```

---

## 🔧 Backend Setup

Follow these steps to set up and run the backend locally.

### 📁 Step 1: Create backend folder
Create a folder named **`backend`** in your project directory.

### 📄 Step 2: Add required files
Move the following files into the `backend` folder:
- app4.py
- food_embeddings.pkl
- food_prediction_10epoches.h5
- ingredients_embeddings.npy
- labels.json
- ngo_routes.py
- nlp_for_foodname.py
- predictimage_fromtext.py
- predictimagename.py
- recipe_routes.py
- recipes.index
- requirements.txt
- unified_backend.py
- update.py
  
Open your terminal in the backend folder and install all required packages:

```bash
cd backend
pip install -r requirements.txt
python unified_backend.py
```

Server will start on:
```
http://127.0.0.1:5000
```

---

### 🧩 Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend will start on:
```
http://localhost:3000
```

---

## 🌟 Why This Project Matters

- Helps people make informed food choices
- Supports healthy lifestyle habits
- Reduces food waste
- Enables smarter nutrition tracking
- Supports NGOs and food donation programs  

## ✔ Useful for:
Dieticians | Fitness trainers | Health-conscious people | Students & researchers | NGOs | Health organizations

## 🎯 Created For
This project is created for:
- Individuals who want to maintain a healthy lifestyle  
- People managing conditions like obesity, diabetes, and heart disease  
- Dieticians and fitness professionals  
- Students & researchers in AI and health-tech  
- NGOs and community nutrition programs  
- Anyone who believes in mindful and sustainable eating


---

# 🖼️ UI Snapshots
<p float="left"> <img src="https://raw.githubusercontent.com/SHRISTI-125/CalorieOptimizer/main/img/img.png" width="440"/> <img src="https://raw.githubusercontent.com/SHRISTI-125/CalorieOptimizer/main/img/img1.png" width="380"/> </p>
<p float="left"> <img src="https://raw.githubusercontent.com/SHRISTI-125/CalorieOptimizer/main/img/img3.png" width="420"/> <img src="https://raw.githubusercontent.com/SHRISTI-125/CalorieOptimizer/main/img/img7.png" width="440"/> </p>
<p float="left"> <img src="https://raw.githubusercontent.com/SHRISTI-125/CalorieOptimizer/main/img/img4.png" width="425"/> <img src="https://raw.githubusercontent.com/SHRISTI-125/CalorieOptimizer/main/img/img5.png" width="435"/> </p>

## 🔮 Future Scope

<ul>
  <li>Barcode scanner for packaged foods  </li>
  <li>Mobile App (React Native)  </li>
  <li>AI-based meal planner </li>
  <li>Fitness & activity tracking  </li>
  <li>Doctor & nutritionist consultation  </li>
</ul>

---

## 👩‍💻 Author

Built with the vision to empower healthier choices and minimize food waste using technology.🌱<br>
<br>
[Shristi Kumari](https://github.com/SHRISTI-125) | 


---

## ⭐ Support

If you like this project, **⭐ star the repository** .

---

<h3 align="center"> 🌍 Promoting Health • Preventing Food Waste • Powering Hope Through Technology 🍃 </h3>
