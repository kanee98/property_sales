"use client";

import { useEffect, useState } from "react";
import Image from 'next/image';
import Logo from "../src/img/Propwise Logo No BG.png";
import { Italic } from "lucide-react";

interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  area: number;
  images: string;
  latitude: number;
  longitude: number;
  district: string;
  category: string; 
  type: string;
  manager: string;
  contact: number;
  status: number;
}

const itemsPerPage = 6;

export default function ListingsPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState<number | null>(100000000);
  const [currentPage, setCurrentPage] = useState(1);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [minArea, setMinArea] = useState(0);
  const [maxArea, setMaxArea] = useState<number | null>(null);


  const [stats, setStats] = useState({
    totalProperties: 0,
    corporate: 0,
    retail: 0,
    residential: 0,
    for_sale: 0,
    for_rent: 0,
    for_lease: 0,
    wanted: 0
  });

  useEffect(() => {
    fetch("/api/properties")
      .then((res) => res.json())
      .then((data: Property[]) => {
        const activeProperties = data.filter((p) => p.status === 1);
        setProperties(activeProperties);
        calculateStats(activeProperties);
      });
  }, []);

  useEffect(() => {
    setCurrentPage(1); 
  }, [searchQuery, selectedCategory, selectedTypes, selectedDistrict, minPrice, maxPrice]);

  const calculateStats = (data: Property[]) => {
    setStats({
      totalProperties: data.length,
      corporate: data.filter(p => p.category === "Corporate").length,
      retail: data.filter(p => p.category === "Retail").length,
      residential: data.filter(p => p.category === "Residential").length,
      for_sale: data.filter(p => p.type === "For Sale").length,
      for_rent: data.filter(p => p.type === "For Rent").length,
      for_lease: data.filter(p => p.type === "For Lease").length,
      wanted: data.filter(p => p.type === "Wanted").length,
    });
  };

  const filteredProperties = properties.filter((property) => {
    const matchesTitle = property.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "" || property.category === selectedCategory;
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(property.type);
    const matchesDistrict = selectedDistrict === "" || property.district === selectedDistrict;
    const matchesPrice =
      (property.price === 0 && minPrice === 0) ||
      (property.price >= minPrice && (maxPrice === null || property.price <= maxPrice));
    const matchesArea =
      (property.area === 0 && minArea === 0) ||
      (property.area >= minArea && (maxArea === null || property.area <= maxArea)); 

    return matchesTitle && matchesCategory && matchesType && matchesDistrict && matchesPrice && matchesArea;
  });

  const redirectToLogin = () => {
    window.location.href = "/login";
  };

  const redirectToInquiries = () => {
    window.location.href = "/inquiries";
  };

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
      <header className="header">
        {/* Logo + Name container */}
        <div className="brand">
          <Image src={Logo} width={60} height={60} alt="Logo" className="logo-image" />
          <h1 className="text-3xl font-bold">PROPWISE</h1>
        </div>

        {/* Navigation */}
        <nav className="nav-links">
          <button type="button" onClick={redirectToInquiries}>
            Inquiries
          </button>
          <button type="button" onClick={redirectToLogin}>
            Login
          </button>
        </nav>
      </header>
    
      <div className="landing-message">
        <h3 className="text-2xl font-semibold">Relax, Finding Properties Just Got Easier</h3><br></br>
        <p className="text-lg mt-2">Discover the best properties for sale or rent</p>
        <form className="search-form">
          <div className="search-form-container">
            <input
              type="text"
              placeholder="Search properties..."
              className="border p-2 rounded w-full"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select onChange={(e) => setSelectedCategory(e.target.value)} style={{width:"45%"}}>
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
        
        <div className="stat">
          <h2 className="text-3xl font-bold">{stats.for_rent}</h2>
          <p>For Rent</p>
        </div>
        <div className="stat right-corner">
          <h2 className="text-3xl font-bold">{stats.for_lease}</h2>
          <p>For Lease</p>
        </div>
        <div className="stat left-corner">
          <h2 className="text-3xl font-bold">{stats.for_sale}</h2>
          <p>For Sale</p>
        </div>
        <div className="stat">
          <h2 className="text-3xl font-bold">{stats.wanted}</h2>
          <p>Wanted</p>
        </div>      
      </div>
    </section>

    <div className="property-page-wrapper">
      {/* Filters Section */}
      <div className="property-filters">
        <h2><i className="fa fa-filter"></i> Filters</h2>
        <hr />

        {/* Filter by Category */}
        <h4 className="font-semibold">By category:</h4>
        <div className="space-y-2">
          {["For Sale", "For Rent", "For Lease", "Wanted"].map((type) => (
            <div className="filter-checkbox-group" style={{width:"1rem", flexWrap:"nowrap"}} key={type}>
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

          <optgroup label="Greater Colombo">
            {[
              "Colombo 1", "Colombo 2", "Colombo 3", "Colombo 4", "Colombo 5", 
              "Colombo 6", "Colombo 7", "Colombo 8", "Colombo 9", "Colombo 10",
              "Colombo 11", "Colombo 12", "Colombo 13", "Colombo 14", "Colombo 15"
            ].map((colombo) => (
              <option key={colombo} value={colombo}>
                {colombo}
              </option>
            ))}
          </optgroup>

          {[
            "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle", "Gampaha", 
            "Hambantota", "Jaffna", "Kalutara", "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", 
            "Mannar", "Matale", "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya", 
            "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"
          ].map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}

        </select>

        {/* Filter by Price */}
        <h4 className="mt-4 font-semibold">By price:</h4>
        <div className="filter-number-group">
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

        {/* Filter by Area Extent */}
        <h4 className="mt-4 font-semibold">By Area (sq ft):</h4>
        <div className="filter-number-range">
          <input
            type="number"
            min={0}
            value={minArea}
            onChange={(e) => setMinArea(Number(e.target.value))}
            placeholder="Min Area"
            className="border p-2 rounded w-full"
          />
          <span>to</span>
          <input
            type="number"
            min={0}
            value={maxArea === null ? "" : maxArea}
            onChange={(e) => {
              const value = e.target.value;
              setMaxArea(value === "" ? null : Number(value));
            }}
            placeholder="Max Area"
            className="border p-2 rounded w-full"
          />
        </div>
      </div>
      
      {/* Property Cards Section */}
      <div className="property-listings">
        {propertiesToDisplay.map((property) => (
          <div key={property.id} className="property-card">
            {(() => {
              let imageSrc = "";
              try {
                const images = JSON.parse(property.images);
                if (Array.isArray(images) && images.length > 0) {
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  imageSrc = images[0];
                }
              } catch (err) {
                console.error("Failed to parse images:", err);
              }

              return (
                <div
                  className="property-image-wrapper"
                  onClick={() => {
                    try {
                      const imgs = JSON.parse(property.images);
                      if (Array.isArray(imgs)) {
                        setSelectedImages(imgs);
                        setSelectedProperty(property);  
                        setCurrentImageIndex(0);        
                        setIsImageModalOpen(true);
                      }
                    } catch (err) {
                      console.error("Failed to parse images:", err);
                    }
                  }}
                >
                  <Image
                    src={
                      (() => {
                        try {
                          const imgs = JSON.parse(property.images);
                          return imgs?.[0] || "/img/default.jpg";
                        } catch {
                          return "/img/default.jpg";
                        }
                      })()
                    }
                    alt={property.title}
                    width={400}  
                    height={192} 
                    style={{
                      objectFit: "cover",
                      borderRadius: "0.375rem", 
                      width: "100%",
                      height: "auto",
                    }}
                    sizes="100vw"
                  />
                  <div className="property-hover-overlay">
                    Click here to view more
                  </div>
                </div>
              );
            })()}

            <h2 className="text-lg font-semibold mt-2">{property.title}</h2>
            <p>{property.area != null ? `${property.area} sq ft` : "N/A"}</p>
            <p>{property.description}</p>
            <p className="font-bold text-green-600">{property.price != null ? `Rs. ${property.price}` : "N/A"}</p>

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

    {isImageModalOpen && (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="close-btn" onClick={() => setIsImageModalOpen(false)}>✕</button>

          {selectedImages.length > 0 ? (
            <>
              <div className="slider-container">
                <button
                  className="nav-btn prev"
                  onClick={() =>
                    setCurrentImageIndex(
                      (prev) => (prev - 1 + selectedImages.length) % selectedImages.length
                    )
                  }
                  disabled={selectedImages.length <= 1}
                  style={{ opacity: selectedImages.length <= 1 ? 0.4 : 1, cursor: selectedImages.length <= 1 ? "not-allowed" : "pointer" }}
                >
                  ‹
                </button>

                <Image
                  src={selectedImages[currentImageIndex] || "/img/default.jpg"}
                  alt={`Slide ${currentImageIndex + 1}`}
                  width={600} 
                  height={400}
                  style={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "60vh",
                    objectFit: "cover",
                    borderRadius: "0.5rem",
                    border: "1px solid #ccc",
                    margin: "0 auto",
                    display: "block",
                  }}
                />

                <button
                  className="nav-btn next"
                  onClick={() =>
                    setCurrentImageIndex((prev) => (prev + 1) % selectedImages.length)
                  }
                  disabled={selectedImages.length <= 1}
                  style={{ opacity: selectedImages.length <= 1 ? 0.4 : 1, cursor: selectedImages.length <= 1 ? "not-allowed" : "pointer" }}
                >
                  ›
                </button>
              </div>

              {/* Property Info Block */}
              {selectedProperty && (
                <div className="property-info">
                  <p><strong>Title:</strong> {selectedProperty.title}</p>
                  <p><strong>District:</strong> {selectedProperty.district}</p>
                  <p><strong>Price:</strong> Rs. {selectedProperty.price}</p>
                  <p><strong>Manager:</strong> {selectedProperty.manager}</p>
                  <p><strong>Contact:</strong> {selectedProperty.contact}</p>
                </div>
              )}
            </>
          ) : (
            <p>No images to display</p>
          )}
        </div>
      </div>
    )}

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