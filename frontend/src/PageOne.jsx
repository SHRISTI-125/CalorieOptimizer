import './pageone.css'; 
import { Link } from "react-router-dom";


function PageOne() {
 return (
  <div className="page-container">
   <section className="hero">
    <h1 className="hero-title">Calorie Optimizer</h1><br/>
    
    {/*<div className="problem-statement">
     
     <p className="hero-description">
      **THE HEALTH CHALLENGE:** For millions with conditions like **diabetes**, precise dietary tracking is critical, yet challenging. Our tool provides the **clarity** needed for informed health choices.
     </p>
     
     
     
    </div>*/}

   <div className="problem-statement-container">
     
     {/* HEALTH CHALLENGE CARD */}
     <div className="problem-card health-challenge-card">
      <h3>The Health Challenge</h3>
      <p className="problem-card-description">
       For millions with conditions like <b>diabetes</b>, precise dietary tracking is critical, yet challenging. Our tool provides the <b>clarity</b> needed for informed health choices.
      </p>
     </div>
     
     {/* GLOBAL PARADOX CARD */}
     <div className="problem-card global-paradox-card">
      <h3>The Global Paradox</h3>
      <p className="problem-card-description">
       While <b>~1.3 billion tons of food are wasted annually</b>, over <b>828 million</b> people face chronic hunger. We offer a bridge between surplus and need.
      </p>
     </div>
    </div>
    <div className="cta-buttons">
     <Link to="/Test2" className="cta-btn primary main-cta">
      Start Optimizing FOOD
     </Link>
     
     <button className="cta-btn secondary" ><Link to="/RecipeCard" style={{ textDecoration: 'none', color: 'black' }}>Generate Recipe</Link></button>
     <button className="cta-btn secondary"><Link to="/NGOCard" style={{ textDecoration: 'none', color: 'black' }}>NGO Nearby</Link></button>
    </div>
   </section>

  <br/>


   <div className="slogan-badge">
    <b className='mission-text'>Our Mission:</b><p className='mission-text'>Promoting Health • Preventing Food Waste • Powering Hope Through Technology </p>
   </div>

   {/* Features Section */}
   <section className="features">
    {/* Feature Card 1 (Health Clarity) */}
    <div className="feature-card" style={{animationDelay: '0.2s'}}>
     <div className="feature-icon">⚖️</div>
     <h3>Calorie Predictor</h3>
     <p>Upload food photos to get instant, precise nutrient and calorie breakdowns for better health management.</p>
    </div>
    {/* Feature Card 2 (Ingredient Optimization) */}
    <div className="feature-card" style={{animationDelay: '0.4s'}}>
     <div className="feature-icon">👨‍🍳</div>
     <h3>Instant Recipe Creation</h3>
     <p>Quickly generate creative recipes using only the ingredients you have available, reducing kitchen waste.</p>
    </div>
    {/* Feature Card 3 (Waste Reduction & Donation) */}
    <div className="feature-card" style={{animationDelay: '0.6s'}}>
     <div className="feature-icon">🤝</div>
     <h3>Donate Your Food</h3>
     <p>Easily locate the nearest NGOs and charities accepting surplus food, ensuring it reaches those in need.</p>
    </div>
   </section>
  </div>
 );
}

export default PageOne;