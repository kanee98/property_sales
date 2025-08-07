"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Logo from "../src/img/Propwise Logo No BG.png";
import { Property } from "../types";
import FilterMenu from "../components/FilterMenu";
import PropertyCard from "../components/PropertyCard";
import ImageModal from "../components/ImageModal";
import Pagination from "../components/Pagination";
import Footer from "../components/Footer";

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
    wanted: 0,
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
      corporate: data.filter((p) => p.category === "Corporate").length,
      retail: data.filter((p) => p.category === "Retail").length,
      residential: data.filter((p) => p.category === "Residential").length,
      for_sale: data.filter((p) => p.type === "For Sale").length,
      for_rent: data.filter((p) => p.type === "For Rent").length,
      for_lease: data.filter((p) => p.type === "For Lease").length,
      wanted: data.filter((p) => p.type === "Wanted").length,
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

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const propertiesToDisplay = filteredProperties.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const openImageModal = (images: string[], property: Property) => {
    setSelectedImages(images);
    setSelectedProperty(property);
    setCurrentImageIndex(0);
    setIsImageModalOpen(true);
  };

  const redirectToLogin = () => {
    window.location.href = "/login";
  };

  const redirectToInquiries = () => {
    window.location.href = "/inquiries";
  };

  return (
    <>
      <section className="landing">
        <div className="landing-bg"></div>
        <header className="header flex justify-between items-center p-4">
          <div className="brand flex items-center gap-3">
            <Image src={Logo} width={60} height={60} alt="Logo" className="logo-image" />
            <h1 className="text-3xl font-bold">PROPWISE</h1>
          </div>

          <nav className="nav-links flex gap-4">
            <button type="button" onClick={redirectToInquiries} className="btn">
              Inquiries
            </button>
            <button type="button" onClick={redirectToLogin} className="btn">
              Login
            </button>
          </nav>
        </header>

        <div className="landing-message text-center p-6">
          <h3 className="text-2xl font-semibold">Relax, Finding Properties Just Got Easier</h3>
          <p className="text-lg mt-2">Discover the best properties for sale or rent</p>
          <form className="search-form mt-4 max-w-xl mx-auto flex gap-4">
            <input
              type="text"
              placeholder="Search properties..."
              className="border p-2 rounded flex-grow"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ width: "45%" }}
              className="border p-2 rounded"
            >
              <option value="" style={{ color: "black" }}>
                All Types
              </option>
              <option value="Corporate" style={{ color: "black" }}>
                Corporate
              </option>
              <option value="Retail" style={{ color: "black" }}>
                Retail
              </option>
              <option value="Residential" style={{ color: "black" }}>
                Residential
              </option>
            </select>
          </form>
        </div>

        <div className="stats grid grid-cols-4 gap-4 px-6">
          <div className="stat text-center p-4 bg-gray-100 rounded shadow">
            <h2 className="text-3xl font-bold">{stats.totalProperties}</h2>
            <p>Total Properties</p>
          </div>
          <div className="stat text-center p-4 bg-gray-100 rounded shadow">
            <h2 className="text-3xl font-bold">{stats.corporate}</h2>
            <p>Corporate</p>
          </div>
          <div className="stat text-center p-4 bg-gray-100 rounded shadow">
            <h2 className="text-3xl font-bold">{stats.retail}</h2>
            <p>Retail</p>
          </div>
          <div className="stat text-center p-4 bg-gray-100 rounded shadow">
            <h2 className="text-3xl font-bold">{stats.residential}</h2>
            <p>Residential</p>
          </div>
          <div className="stat text-center p-4 bg-gray-100 rounded shadow">
            <h2 className="text-3xl font-bold">{stats.for_rent}</h2>
            <p>For Rent</p>
          </div>
          <div className="stat text-center p-4 bg-gray-100 rounded shadow">
            <h2 className="text-3xl font-bold">{stats.for_lease}</h2>
            <p>For Lease</p>
          </div>
          <div className="stat text-center p-4 bg-gray-100 rounded shadow">
            <h2 className="text-3xl font-bold">{stats.for_sale}</h2>
            <p>For Sale</p>
          </div>
          <div className="stat text-center p-4 bg-gray-100 rounded shadow">
            <h2 className="text-3xl font-bold">{stats.wanted}</h2>
            <p>Wanted</p>
          </div>
        </div>
      </section>

      <div className="property-page-wrapper flex gap-8 px-6 mt-8">
        <FilterMenu
          selectedTypes={selectedTypes}
          setSelectedTypes={setSelectedTypes}
          selectedDistrict={selectedDistrict}
          setSelectedDistrict={setSelectedDistrict}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          minArea={minArea}
          setMinArea={setMinArea}
          maxArea={maxArea}
          setMaxArea={setMaxArea}
        />

        <div className="property-listings grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-grow">
          {propertiesToDisplay.map((property) => (
            <PropertyCard key={property.id} property={property} openImageModal={openImageModal} />
          ))}
        </div>
      </div>

      {isImageModalOpen && selectedProperty && (
        <ImageModal
          images={selectedImages}
          currentIndex={currentImageIndex}
          setCurrentIndex={setCurrentImageIndex}
          closeModal={() => setIsImageModalOpen(false)}
          property={selectedProperty}
        />
      )}

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />

      <Footer />
    </>
  );
}
