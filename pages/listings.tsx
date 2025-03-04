"use client"; 

import { useEffect, useState } from "react";

interface Property {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  latitude: number;
  longitude: number;
  type: string; // Corporate or Retail
}

export default function ListingsPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    fetch("/api/properties")
      .then((res) => res.json())
      .then((data) => setProperties(data));
  }, []);

  const filteredProperties = properties.filter(
    (property) =>
      property.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedType === "" || property.type === selectedType)
  );

  const redirectToLogin = () => {
    window.location.href = "/login";
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Property Listings</h1>
      <form>
        <button type="button" className="border p-2 rounded w-15" onClick={redirectToLogin}>
          Login
        </button>
      </form>
      {/* Search & Filter */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search properties..."
          className="border p-2 rounded w-full"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="Corporate">Corporate</option>
          <option value="Retail">Retail</option>
        </select>
      </div>

      {/* Property Cards */}
      <div className="grid grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <div key={property.id} className="border p-4 rounded-lg shadow-lg">
            <img
              src={property.image}
              alt={property.name}
              className="w-full h-48 object-cover rounded-md"
            />
            <h2 className="text-lg font-semibold mt-2">{property.name}</h2>
            <p>{property.description}</p>
            <p className="font-bold text-green-600">${property.price}</p>

            {/* Google Maps */}
            <iframe
              src={`https://maps.google.com/maps?q=${property.latitude},${property.longitude}&z=15&output=embed`}
              width="100%"
              height="200"
              className="mt-2 rounded-md"
            ></iframe>
          </div>
        ))}
      </div>
    </div>
  );
}
