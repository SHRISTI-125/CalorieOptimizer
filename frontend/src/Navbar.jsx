import { Link, useLocation } from "react-router-dom";
import "./index.css";

function Navbar() {
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/PageOne" },
    { name: "Calorie Predictor", path: "/Test2" },
    { name: "Recipe Generator", path: "/RecipeCard" },
    { name: "Donation", path: "/NGOCard" },
    { name: "Profile", path: "/Profile" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-green-200 shadow-sm animate-[slideDown_0.4s_ease-out]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-10">

        <h1 className="text-xl font-extrabold text-green-600">
          Calorie Optimizer
        </h1>

        {/* Links */}
        <ul className="flex gap-8 items-center text-slate-700 font-semibold">
          {navItems.map((item) => (
            <li key={item.path} className="relative group">
              <Link
                to={item.path}
                className={`transition-colors duration-200 ${
                  location.pathname === item.path
                    ? "text-green-600"
                    : "hover:text-green-600"
                }`}
              >
                {item.name}
              </Link>

              <span
                className={`absolute left-0 -bottom-1 h-[2px] bg-green-500 transition-all duration-300
                ${
                  location.pathname === item.path
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                }`}
              ></span>
            </li>
          ))}
        </ul>

      </div>
    </nav>
  );
}

export default Navbar;
