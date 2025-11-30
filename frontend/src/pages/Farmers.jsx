export default function Farmers() {
  const farmers = [
    { name: "Ramesh Kumar", crops: "Wheat, Rice", location: "Village A" },
    { name: "Suresh Naidu", crops: "Maize, Tomato", location: "Village B" },
    { name: "Lakshmi Devi", crops: "Sugarcane", location: "Village C" },
  ];

  return (
    <div className="px-10 py-10">
      <h1 className="text-4xl font-bold text-green-700 mb-6">Farmers</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {farmers.map((farmer, i) => (
          <div key={i} className="p-6 bg-white shadow rounded-lg">
            <h2 className="text-2xl font-semibold text-green-700">{farmer.name}</h2>
            <p className="mt-2 text-gray-700">Crops: {farmer.crops}</p>
            <p className="mt-2 text-gray-700">Location: {farmer.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
