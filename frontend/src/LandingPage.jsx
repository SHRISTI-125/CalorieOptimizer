import React, { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import "./index.css";

function LandingPage() {
  const [page, setPage] = useState(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white relative overflow-hidden font-poppins px-4">
      
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full bg-green-100 blur-[150px] z-0" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] rounded-full bg-green-200 blur-[150px] z-0" />

      <div className="relative z-10 flex flex-col items-center max-w-2xl w-full text-center">
        {!page && (
          <>
            <div className="mb-3 px-4 py-1 bg-green-100 text-green-800 text-xs font-bold uppercase tracking-widest rounded-full">
              Health & Sustainability
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">Calorie{" "}<span className="relative text-green-600">Optimizer<span className="absolute left-0 -bottom-2 w-full h-1 bg-green-300 rounded-full"></span></span></h1>

            <p className="text-slate-500 text-lg sm:text-xl mb-10 max-w-md leading-relaxed">
              Smart tracking for your health. Compassionate giving for the world.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center">
              <button
                onClick={() => setPage("login")}
                className="w-full sm:w-48 px-8 py-4 bg-green-600 text-white font-bold rounded-2xl shadow-lg shadow-green-200 hover:bg-green-700 hover:-translate-y-1 transition-all duration-200"
              >
                Login
              </button>
              <button
                onClick={() => setPage("signup")}
                className="w-full sm:w-48 px-8 py-4 bg-white text-green-600 font-bold rounded-2xl border border-green-300 shadow-sm hover:bg-green-50 hover:border-green-400 transition-all duration-200"
              >
                Join Now
              </button>
            </div>

            <p className="mt-8 text-slate-400 text-sm">
              Helping you balance health and community.
            </p>
          </>
        )}

        {page === "login" && (
          <div className="w-full animate-in fade-in zoom-in duration-300">
            <Login onBack={() => setPage(null)} />
          </div>
        )}
        {page === "signup" && (
          <div className="w-full animate-in fade-in zoom-in duration-300">
            <Signup onBack={() => setPage(null)} />
          </div>
        )}
      </div>
    </div>
  );
}

export default LandingPage;
