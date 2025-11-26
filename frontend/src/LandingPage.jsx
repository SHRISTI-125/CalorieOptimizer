import React, { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";

function LandingPage() {
 const [page, setPage] = useState(null); 


 const containerStyle = {
  maxWidth: "2000px",
  margin: "auto",
  textAlign: "center",
  minHeight: "100vh",
  padding: "50px 20px",
  fontFamily: 'Poppins, sans-serif',
  color: "#e2e8f0", 
  background: "#020617", 
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
 };

 const headingStyle = {
  fontSize: "2.5rem",
  color: "#60a5fa", 
  marginBottom: "30px",
  fontWeight: 700,
  textShadow: "0 0 10px rgba(96, 165, 250, 0.4)",
 };

 const buttonContainerStyle = {
  display: "flex",
  gap: "20px",
  marginTop: "20px",
  width: "100%",
  justifyContent: "center",
 };

 const buttonStyle = {
  padding: "14px 30px",
  borderRadius: "12px",
  border: "none",
  fontSize: "1.1rem",
  fontWeight: 600,
  cursor: "pointer",
  background: "#3b82f6",
  color: "white",
  boxShadow: "0 6px 20px rgba(59, 130, 246, 0.4)",
  transition: "all 0.3s ease",
 };


 return (
  <div style={containerStyle}>
   {!page && (
    <>
     <h1 style={headingStyle}>Welcome to Calorie Optimizer </h1>


     <h3>Track your food intake and donate surplus to needy one!</h3>
     <br/>
     
     <div style={buttonContainerStyle}>
      <button 
       onClick={() => setPage("login")} 
       style={buttonStyle}
      >
       Login
      </button>
      
      <button 
       onClick={() => setPage("signup")} 
       style={{
                ...buttonStyle,
                background: "#475569", 
                boxShadow: "0 4px 15px rgba(71, 85, 105, 0.4)",
       }}
      >
       Sign Up
      </button>
     </div>
    </>
   )}
   {page === "login" && <Login />}
   {page === "signup" && <Signup />}
  </div>
 );
}

export default LandingPage;