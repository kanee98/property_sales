"use client";

import { Property } from "../types";
import React, { useState } from "react";
import FilterMenu from "../components/FilterMenu";
import PropertyCard from "../components/PropertyCard";
import ImageModal from "../components/ImageModal";
import Pagination from "../components/Pagination";
import Footer from "../components/Footer";
import {
  Settings2
} from "lucide-react";

interface ListingsSectionProps {
  propertiesToDisplay: Property[];
  openImageModal: (images: string[], property: Property) => void;
  isImageModalOpen: boolean;
  selectedProperty: Property | null;
  selectedImages: string[];
  currentImageIndex: number;
  setCurrentImageIndex: React.Dispatch<React.SetStateAction<number>>;
  closeModal: () => void;
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;

  selectedTypes: string[];
  setSelectedTypes: React.Dispatch<React.SetStateAction<string[]>>;
  selectedDistrict: string;
  setSelectedDistrict: React.Dispatch<React.SetStateAction<string>>;
  minPrice: number;
  setMinPrice: React.Dispatch<React.SetStateAction<number>>;
  maxPrice: number | null;
  setMaxPrice: React.Dispatch<React.SetStateAction<number | null>>;
  minArea: number;
  setMinArea: React.Dispatch<React.SetStateAction<number>>;
  maxArea: number | null;
  setMaxArea: React.Dispatch<React.SetStateAction<number | null>>;
}

export default function ListingsSection({
  propertiesToDisplay,
  openImageModal,
  isImageModalOpen,
  selectedProperty,
  selectedImages,
  currentImageIndex,
  setCurrentImageIndex,
  closeModal,
  currentPage,
  totalPages,
  handlePageChange,
  selectedTypes,
  setSelectedTypes,
  selectedDistrict,
  setSelectedDistrict,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  minArea,
  setMinArea,
  maxArea,
  setMaxArea,
}: ListingsSectionProps) {
  const [showFilter, setShowFilter] = useState(false);

  return (
    <>
      {/* Filter Button for Mobile */}
      <div className="mobile-filter-btn">
        <button onClick={() => setShowFilter(true)}>
          <Settings2 />
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div className={`filter-sidebar ${showFilter ? "show" : ""}`}>
        <div className="filter-close" onClick={() => setShowFilter(false)}>
          &times;
        </div>
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
      </div>

      {/* Overlay */}
      <div
        className={`filter-overlay ${showFilter ? "show" : ""}`}
        onClick={() => setShowFilter(false)}
      ></div>

      {/* Desktop Layout */}
      <div className="property-page-wrapper">
        <div className="desktop-sidebar">
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
        </div>

        <div className="property-listings">
          {propertiesToDisplay.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              openImageModal={openImageModal}
            />
          ))}
        </div>
      </div>

      {isImageModalOpen && selectedProperty && (
        <ImageModal
          images={selectedImages}
          currentIndex={currentImageIndex}
          setCurrentIndex={setCurrentImageIndex}
          closeModal={closeModal}
          property={selectedProperty}
        />
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <Footer />
    </>
  );
}