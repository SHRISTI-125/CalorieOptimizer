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
import Navbar from './Navbar';



function App() {
  return (
    <BrowserRouter>
    {<Navbar/>}
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
