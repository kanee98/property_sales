"use client";

import { useEffect, useState } from "react";
import Image from 'next/image';
import "../components/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTag, faSyncAlt, faUser, faClipboardList, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import Logo from "../src/img/Prime Ceylon Logo No BG.png";

interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  images: string;
  latitude: number;
  longitude: number;
  type: string; // Corporate or Retail
}

const itemsPerPage = 6;

export default function ListingsPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
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
    const corporate = data.filter(property => property.type === "Corporate").length;
    const retail = data.filter(property => property.type === "Retail").length;
    const residential = data.filter(property => property.type === "Residential").length;

    setStats({
      totalProperties,
      corporate,
      retail,
      residential,
    });
  };

  const filteredProperties = properties.filter(
    (property) =>
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedType === "" || property.type === selectedType)
  );

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
          <h1 className="text-3xl font-bold">Prime Ceylon</h1>
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
          {["For Sale", "For Rent", "Wanted"].map((category) => (
            <div className="flex items-center space-x-2" key={category}>
              <input type="checkbox" className="icheck"/>
              <label>{category}</label>
            </div>
          ))}
        </div>

        {/* Filter by Location */}
        <h4 className="mt-4 font-semibold">By location</h4>
        <label className="block">Select District</label>
        <select className="w-full border p-2 rounded">
          <option value="">All Districts</option>
          {[ "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara", "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar", "Matale", "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya", "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya" ].map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>

        {/* Filter by Price */}
        <h4 className="mt-4 font-semibold">By price:</h4>
        <p>Between <span className="font-bold">Rs.1,000</span> to <span className="font-bold">Rs.100,000,000</span></p>
        <input type="range" className="w-full mt-2" min="0" max="1000" step="1"/>
      </div>
      
      {/* Property Cards Section */}
      <div className="w-3/4 grid grid-cols-2 gap-6 p-4">
        {propertiesToDisplay.map((property) => (
          <div key={property.id} className="border p-4 rounded-lg shadow-lg">
            <img
              src={property.images}
              alt={property.title}
              className="w-full h-48 object-cover rounded-md"
            />
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
    </>
  );
}

{/* <section className="whyChooseUs">
      <h4 className="title">Why Choose Us?</h4>
      <hr className="titleMark"/>
      <div className="reasons">
        <div className="reason">
          <FontAwesomeIcon icon={faCheck} size="2x" />
          <div className="reason-text">
            <h3>Quick</h3>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum ipsa, a fuga sed maxime beatae earum tenetur possimus dignissimos ea.</p>
          </div>
        </div>
        <div className="reason">
          <FontAwesomeIcon icon={faTag} size="2x" />
          <div className="reason-text">
            <h3>Free</h3>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laborum obcaecati sit nihil porro molestias consectetur dolore, laudantium recusandae iure quasi!</p>
          </div>
        </div>
        <div className="reason">
          <FontAwesomeIcon icon={faSyncAlt} size="2x" />
          <div className="reason-text">
            <h3>Easy</h3>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda veritatis commodi officia tempore nulla doloribus officiis cupiditate ducimus consequatur ut?</p>
          </div>
        </div>
        <div className="reason">
          <FontAwesomeIcon icon={faUser} size="2x" />
          <div className="reason-text">
            <h3>Independent</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsa voluptate culpa sunt itaque minima harum explicabo placeat dolores maiores consequuntur?</p>
          </div>
        </div>
    
        <div className="reason">
          <FontAwesomeIcon icon={faThumbsUp} size="2x" />
          <div className="reason-text">
            <h3>Awesome</h3>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi quia, illum et deserunt temporibus omnis neque similique aut inventore in!</p>
          </div>
        </div>
      </div>
    </section> */}