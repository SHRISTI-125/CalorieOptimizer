import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import CaloriePredictor from './CaloriePredictor';
import Signup from "./Signup";
import PageOne from './PageOne';
import RecipeCard from './RecipeCard';
import Test2 from './Test2';
import NGOCard from './NGOCard';
import Login from './Login';
import LandingPage from './LandingPage';
import Profile from "./Profile";
import Test from './Test';



function App() {
  return (
    <BrowserRouter>
      <nav style={{ background: 'rgba(17, 24, 39, 0.7)', backdropFilter: 'blur(10px)', color:"White", padding: '16px 40px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
                   borderBottom: '1px solid rgba(127, 162, 231, 1)', position: 'sticky', top: 0, zIndex: 1, width: '100%', boxSizing: 'border-box', alignItems: 'center'
                  }}>
        <ul style={{ listStyle: 'none', display: 'flex', gap: '40px', margin: 0, padding: 0, justifyContent: 'flex-start', alignItems: 'center'}}>
          {/*<li style={{ fontSize: '1rem', fontWeight: 600 }}>
        <a href="/" style={{ color: '#60a5fa', textDecoration: 'none', transition: 'color 0.3s' }}>
            Home
        </a>
    </li>
    */}
          <li>
            <Link to="/PageOne" style={{ textDecoration: "none", color: "inherit" }}>Home</Link>
          </li>
          <li>
            <Link to="/Test2" style={{ textDecoration: "none", color: "inherit" }}>Calorie Predictor</Link>
          </li>
          <li><Link to="/RecipeCard" style={{ textDecoration: "none", color: "inherit" }}>Recipe Generator</Link></li>
          <li><Link to="/NGOCard" style={{ textDecoration: "none", color: "inherit" }}>Donation</Link></li>
          <li><Link to="/Profile" style={{ textDecoration: "none", color: "inherit" }}>Profile</Link></li>
        </ul>
      </nav>

      <Routes>
      <Route path="/" element={<LandingPage/>}/>
      <Route path="/Signup" element={<Signup/>}/>
      <Route path="/Login" element={<Login/>}/>
        <Route path="/PageOne" element={<PageOne />} />
        <Route path="/CaloriePredictor" element={<CaloriePredictor />} />
        <Route path="/Test" element={<Test />} />
        <Route path="/Test2" element={<Test2 />} />
        <Route path="/NGOCard" element={<NGOCard/>}/>
        <Route path="/profile" element={<Profile />} />
        <Route path="/RecipeCard" element={<RecipeCard />} />
        

      </Routes>
    </BrowserRouter>
  );
}

export default App;
