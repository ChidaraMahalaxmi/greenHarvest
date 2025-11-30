import backgroundImg from "./assets/background.jpg";
import heroImg from "./assets/sideee.jpg";

export default function Home() {
  return (
    <div
      className="min-h-screen text-gray-900 relative"
      style={{
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* LIGHT OVERLAY */}
      <div className="min-h-screen bg-white/80 backdrop-blur-sm">

        {/* Hero Section */}
        <section className="flex flex-col-reverse lg:flex-row items-center justify-between px-12 py-20">

          {/* Left Text Section */}
          <div className="max-w-xl space-y-6">
            <h2 className="text-5xl font-extrabold leading-tight text-green-800 drop-shadow">
              Agriculture Reimagined with Intelligence
            </h2>

            <p className="text-xl text-gray-700">
              Empowering farmers with real-time tracking, smart analytics, and full transparency.
              GreenHarvest transforms traditional farming into a connected smart ecosystem.
            </p>

            <button className="px-8 py-3 bg-green-700 text-white rounded-lg text-lg shadow-lg hover:bg-green-800 transition">
              Explore Dashboard
            </button>
          </div>

          {/* RIGHT HERO IMAGE — YOUR SIDE IMAGE */}
          <div className="lg:w-[500px] flex justify-center">
            <img
              src={heroImg}
              alt="GreenHarvest"
              className="rounded-2xl shadow-2xl border-4 border-white/60 object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

        </section>

        {/* Features Section */}
        <section className="px-10 py-20">
          <h3 className="text-4xl font-bold text-center text-green-800 mb-12">
            What GreenHarvest Offers
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

            <div className="p-7 bg-white/90 backdrop-blur shadow-lg rounded-xl hover:-translate-y-2 transition">
              <h4 className="text-2xl font-semibold text-green-700">Crop Monitoring</h4>
              <p className="mt-3 text-gray-700">
                Monitor crop health, detect issues early, and optimize growth with intelligent insights.
              </p>
            </div>

            <div className="p-7 bg-white/90 backdrop-blur shadow-lg rounded-xl hover:-translate-y-2 transition">
              <h4 className="text-2xl font-semibold text-green-700">Smart Dashboard</h4>
              <p className="mt-3 text-gray-700">
                Access all essential farm and produce data in one unified smart dashboard.
              </p>
            </div>

            <div className="p-7 bg-white/90 backdrop-blur shadow-lg rounded-xl hover:-translate-y-2 transition">
              <h4 className="text-2xl font-semibold text-green-700">Quality Tracking</h4>
              <p className="mt-3 text-gray-700">
                Maintain consistency and monitor the quality of every harvest with transparent metrics.
              </p>
            </div>

          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-6 bg-green-700 text-white text-lg mt-10 backdrop-blur">
          © {new Date().getFullYear()} GreenHarvest. Growing Smarter 🌱
        </footer>

      </div>
    </div>
  );
}
