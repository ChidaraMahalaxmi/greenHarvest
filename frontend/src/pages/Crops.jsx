export default function Crops() {
  const crops = [
    { name: "Wheat", status: "Healthy", moisture: "22%" },
    { name: "Rice", status: "Moderate", moisture: "28%" },
    { name: "Tomato", status: "Critical", moisture: "14%" },
  ];

  return (
    <div className="px-10 py-10">
      <h1 className="text-4xl font-bold text-green-700 mb-6">Crop Monitoring</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {crops.map((crop, i) => (
          <div key={i} className="p-6 bg-white shadow rounded-lg">
            <h2 className="text-2xl font-semibold text-green-700">{crop.name}</h2>
            <p className="mt-2 text-gray-700">Status: {crop.status}</p>
            <p className="mt-2 text-gray-700">Moisture: {crop.moisture}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
