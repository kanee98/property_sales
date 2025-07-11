"use client";

import { useEffect, useState } from "react";
import Image from 'next/image';
import "../components/styles.css";
import Logo from "../src/img/Propwise Logo No BG.png";

interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  images: string;
  latitude: number;
  longitude: number;
  district: string;
  category: string; // Corporate or Retail
  type: string;
}

const itemsPerPage = 6;

export default function ListingsPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [stats, setStats] = useState({
    totalProperties: 0,
    corporate: 0,
    retail: 0,
    residential: 0,
  });

  useEffect(() => {
    fetch("/api/properties")
      .then((res) => res.json())
      .then((data) => {
        setProperties(data);
        calculateStats(data);
      });
  }, []);

  const calculateStats = (data: Property[]) => {
    const totalProperties = data.length;
    const corporate = data.filter(property => property.category === "Corporate").length;
    const retail = data.filter(property => property.category === "Retail").length;
    const residential = data.filter(property => property.category === "Residential").length;

    setStats({
      totalProperties,
      corporate,
      retail,
      residential,
    });
  };

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState<number | null>(100000000);
  
  const filteredProperties = properties.filter((property) => {
    const matchesTitle = property.title.toLowerCase().includes(searchQuery.toLowerCase());
  
    const matchesCategory = selectedType === "" || property.category === selectedType;
  
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(property.type);
  
    const matchesDistrict = selectedDistrict === "" || property.district === selectedDistrict;
  
    const matchesPrice = (!property.price || (property.price >= minPrice && (maxPrice === null || property.price <= maxPrice)));
  
    return matchesTitle && matchesCategory && matchesType && matchesDistrict && matchesPrice;
  });  

  const redirectToLogin = () => {
    window.location.href = "/login";
  };

  const redirectToInquiries = () => {
    window.location.href = "/inquiries";
  };

  const [currentPage, setCurrentPage] = useState(1); // Track the current page

  // Calculate the start and end indices for slicing the properties array
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const propertiesToDisplay = filteredProperties.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
    <section className="landing">
      <div className="landing-bg"></div>     
      <header className="relative z-10 flex justify-between items-center px-10 py-5">
        {/* Logo + Name container */}
        <div className="flex items-center space-x-3">
          <Image src={Logo} width={60} height={60} alt="Logo" className="logo-image" />
          <h1 className="text-3xl font-bold">PROPWISE</h1>
        </div>

        {/* Navigation */}
        <nav className="space-x-4">
          <button type="button" className="border p-2 rounded w-20" onClick={redirectToInquiries}>
            Inquiries
          </button>
          <button type="button" className="border p-2 rounded w-15" onClick={redirectToLogin}>
            Login
          </button>
        </nav>
      </header>
    
      <div className="landing-message">
        <h3 className="text-2xl font-semibold">Relax, Finding Properties Just Got Easier</h3>
        <p className="text-lg mt-2">Discover the best properties for sale or rent</p>
        <form className="mt-5 flex justify-center pb-[10%]">
          <div className="flex mb-6 space-x-1 w-[500px]">
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
              <option value="" style={{ color: "black" }}>All Types</option>
              <option value="Corporate" style={{ color: "black" }}>Corporate</option>
              <option value="Retail" style={{ color: "black" }}>Retail</option>
              <option value="Residential" style={{ color: "black" }}>Residential</option>
            </select>
          </div>
        </form>
      </div>
      
      <div className="stats">
        <div className="stat left-corner">
          <h2 className="text-3xl font-bold">{stats.totalProperties}</h2>
          <p>Total Properties</p>
        </div>
        <div className="stat">
          <h2 className="text-3xl font-bold">{stats.corporate}</h2>
          <p>Corporate</p>
        </div>
        <div className="stat">
          <h2 className="text-3xl font-bold">{stats.retail}</h2>
          <p>Retail</p>
        </div>
        <div className="stat right-corner">
          <h2 className="text-3xl font-bold">{stats.residential}</h2>
          <p>Residential</p>
        </div>
      </div>
    </section>

    <div className="container mx-auto p-4 flex">
      {/* Filters Section */}
      <div className="w-1/4 p-4 border-r">
        <h2 className="text-xl font-bold"><i className="fa fa-filter"></i> Filters</h2>
        <hr className="mb-4"/>

        {/* Filter by Category */}
        <h4 className="font-semibold">By category:</h4>
        <div className="space-y-2">
          {["For Sale", "For Rent", "Wanted"].map((type) => (
            <div className="flex items-center space-x-2" key={type}>
              <input
                type="checkbox"
                className="icheck"
                checked={selectedTypes.includes(type)} // FIXED HERE
                onChange={(e) => {
                  const newSelection = [...selectedTypes]; // FIXED HERE
                  if (e.target.checked) {
                    newSelection.push(type);
                  } else {
                    const index = newSelection.indexOf(type);
                    if (index > -1) newSelection.splice(index, 1);
                  }
                  setSelectedTypes(newSelection); // FIXED HERE
                }}
              />
              <label>{type}</label>
            </div>
          ))}
        </div>

        {/* Filter by Location */}
        <h4 className="mt-4 font-semibold">By location</h4>
        <label className="block">Select District</label>
        <select
          className="w-full border p-2 rounded"
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
        >
          <option value="">All Districts</option>
          {[
            "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle", "Gampaha", "Hambantota", "Jaffna",
            "Kalutara", "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar", "Matale", "Matara", "Monaragala",
            "Mullaitivu", "Nuwara Eliya", "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"
          ].map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>

        {/* Filter by Price */}
        <h4 className="mt-4 font-semibold">By price:</h4>
        <div className="flex space-x-2 items-center">
          <input
            type="number"
            min={0}
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
            placeholder="Min Price"
            className="border p-2 rounded w-full"
          />
          <span>to</span>
          <input
            type="number"
            min={0}
            value={maxPrice === null ? "" : maxPrice}
            onChange={(e) => {
              const value = e.target.value;
              setMaxPrice(value === "" ? null : Number(value));
            }}
            placeholder="Max Price"
            className="border p-2 rounded w-full"
          />
        </div>
      </div>
      
      {/* Property Cards Section */}
      <div className="w-3/4 grid grid-cols-2 gap-6 p-4">
        {propertiesToDisplay.map((property) => (
          <div key={property.id} className="border p-4 rounded-lg shadow-lg">
            {(() => {
              let imageSrc = "";
              try {
                const images = JSON.parse(property.images);
                if (Array.isArray(images) && images.length > 0) {
                  imageSrc = images[0];
                }
              } catch (err) {
                console.error("Failed to parse images:", err);
              }

              return (
                <img
                  src={imageSrc || "/img/default.jpg"} // fallback image if none found
                  alt={property.title}
                  className="w-full h-48 object-cover rounded-md"
                />
              );
            })()}

            <h2 className="text-lg font-semibold mt-2">{property.title}</h2>
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
    {/* BEGIN PAGINATION */}
    <ul className="pagination flex space-x-2">
          <li className={`pagination-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded"
            >
              «
            </button>
          </li>
          
          {[...Array(totalPages).keys()].map((page) => (
            <li key={page} className={`pagination-item ${currentPage === page + 1 ? 'active' : ''}`}>
              <button
                onClick={() => handlePageChange(page + 1)}
                className={`px-3 py-1 border rounded ${currentPage === page + 1 ? 'bg-blue-500 text-white' : ''}`}
              >
                {page + 1}
              </button>
            </li>
          ))}
          
          <li className={`pagination-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded"
            >
              »
            </button>
          </li>
        </ul>
        {/* END PAGINATION */}
        <footer className="footer">
          <p>
              &copy; {new Date().getFullYear()} <a href="https://fusionlabz.lk" target="_blank" rel="noopener noreferrer">FusionLabz</a>. All Rights Reserved.
          </p>
        </footer>
    </>
  );
}