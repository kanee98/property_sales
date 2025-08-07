"use client";

import { useEffect, useState } from "react";
import { Property } from "../types";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ListingsSection from "../components/ListingsSection";

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
      <Navbar onLoginClick={redirectToLogin} onInquiriesClick={redirectToInquiries} />

      <Hero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        stats={stats}
      />

      <ListingsSection
        propertiesToDisplay={propertiesToDisplay}
        openImageModal={openImageModal}
        isImageModalOpen={isImageModalOpen}
        selectedProperty={selectedProperty}
        selectedImages={selectedImages}
        currentImageIndex={currentImageIndex}
        setCurrentImageIndex={setCurrentImageIndex}
        closeModal={() => setIsImageModalOpen(false)}
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
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
    </>
  );
}