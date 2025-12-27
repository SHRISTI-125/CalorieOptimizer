import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function PageOne() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-green-50 to-white text-slate-800">

      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.18),transparent_60%)]" />

        <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">

          {/* TITLE */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-6xl font-extrabold tracking-tight"
          >
            Calorie{" "}
            <span className="text-green-600">Optimizer</span>
          </motion.h1>

          {/* SUBTITLE */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-slate-600"
          >
            Smart food intelligence for healthier living, reduced waste, and
            meaningful impact.
          </motion.p>

          {/* PROBLEM CARDS */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.2 }
              }
            }}
            className="mt-16 grid md:grid-cols-2 gap-8"
          >
            {[
              {
                title: "The Health Challenge",
                text:
                  "For millions with conditions like diabetes, precise dietary tracking is essential but difficult. We bring clarity and control."
              },
              {
                title: "The Global Paradox",
                text:
                  "1.3B tons of food wasted yearly, while 828M face hunger. We connect surplus food to real impact."
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="bg-white/80 backdrop-blur-xl border border-green-100 rounded-3xl p-8 shadow-lg"
              >
                <h3 className="text-xl font-bold text-green-700 mb-3">
                  {item.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-14 flex flex-col sm:flex-row gap-5 justify-center"
          >
            <Link
              to="/Test2"
              className="px-10 py-4 rounded-2xl bg-green-600 text-white font-bold text-lg shadow-lg hover:bg-green-700 transition"
            >
              Start Optimizing Food
            </Link>

            <Link
              to="/RecipeCard"
              className="px-10 py-4 rounded-2xl border border-green-300 text-green-700 font-semibold text-lg hover:bg-green-50 transition"
            >
              Generate Recipe
            </Link>

            <Link
              to="/NGOCard"
              className="px-10 py-4 rounded-2xl border border-green-300 text-green-700 font-semibold text-lg hover:bg-green-50 transition"
            >
              NGOs Nearby
            </Link>
          </motion.div>
        </div>
      </section>

      {/* MISSION BADGE */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto px-6 -mt-10"
      >
        <div className="bg-white border border-green-200 rounded-2xl shadow-md px-8 py-5 text-center">
          <span className="font-bold text-green-700">Our Mission:</span>
          <span className="ml-2 text-slate-600">
            Promoting Health • Preventing Food Waste • Powering Hope Through Technology
          </span>
        </div>
      </motion.div>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.2 }
            }
          }}
          className="grid md:grid-cols-3 gap-10"
        >
          {[
            {
              icon: "⚖️",
              title: "Calorie Predictor",
              text: "Upload food images or names to instantly get calories, nutrients, and health insights."
            },
            {
              icon: "👨‍🍳",
              title: "Instant Recipe Creation",
              text: "Turn available ingredients into creative recipes and reduce food waste."
            },
            {
              icon: "🤝",
              title: "Donate Surplus Food",
              text: "Find nearby NGOs and ensure surplus food reaches those in need."
            }
          ].map((f, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-3xl border border-green-100 p-8 shadow-lg"
            >
              <div className="text-5xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-slate-600 leading-relaxed">{f.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
