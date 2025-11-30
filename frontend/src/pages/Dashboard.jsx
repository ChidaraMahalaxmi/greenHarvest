export default function Dashboard() {
  return (
    <div className="px-10 py-10">

      <h1 className="text-4xl font-bold text-green-700 mb-10">
        Dashboard Overview
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        <div className="p-6 bg-white shadow-lg rounded-xl hover:-translate-y-2 transition-all">
          <h2 className="text-lg font-semibold text-gray-600">Total Crops</h2>
          <p className="text-4xl font-bold text-green-700 mt-4">32</p>
        </div>

        <div className="p-6 bg-white shadow-lg rounded-xl hover:-translate-y-2 transition-all">
          <h2 className="text-lg font-semibold text-gray-600">Active Farmers</h2>
          <p className="text-4xl font-bold text-green-700 mt-4">18</p>
        </div>

        <div className="p-6 bg-white shadow-lg rounded-xl hover:-translate-y-2 transition-all">
          <h2 className="text-lg font-semibold text-gray-600">Harvest Cycles</h2>
          <p className="text-4xl font-bold text-green-700 mt-4">74</p>
        </div>

      </div>

      {/* Crop Health Section */}
      <div className="mt-14">
        <h2 className="text-2xl font-bold text-green-700 mb-6">
          Crop Health Status
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="p-6 bg-green-50 border-l-4 border-green-600 rounded-lg shadow">
            <h3 className="text-xl font-bold text-green-700">Wheat</h3>
            <p className="text-gray-600 mt-2">Healthy</p>
          </div>

          <div className="p-6 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg shadow">
            <h3 className="text-xl font-bold text-yellow-700">Rice</h3>
            <p className="text-gray-600 mt-2">Moderate</p>
          </div>

          <div className="p-6 bg-red-50 border-l-4 border-red-600 rounded-lg shadow">
            <h3 className="text-xl font-bold text-red-700">Tomato</h3>
            <p className="text-gray-600 mt-2">Critical</p>
          </div>

        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-14">
        <h2 className="text-2xl font-bold text-green-700 mb-6">
          Recent Activities
        </h2>

        <ul className="space-y-4">

          <li className="p-4 bg-white shadow rounded-xl border-l-4 border-green-600">
            🌾 New crop data added for Wheat Field A
          </li>

          <li className="p-4 bg-white shadow rounded-xl border-l-4 border-blue-600">
            👨‍🌾 Farmer Ramesh completed harvest cycle
          </li>

          <li className="p-4 bg-white shadow rounded-xl border-l-4 border-yellow-600">
            📈 Soil moisture alert detected in Zone B
          </li>

        </ul>
      </div>
    </div>
  );
}
