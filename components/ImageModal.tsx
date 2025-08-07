"use client";

import React from "react";
import Image from "next/image";

interface Property {
  title: string;
  district: string;
  price: number;
  manager: string;
  contact: number;
}

interface ImageModalProps {
  images: string[];
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  closeModal: () => void;
  property: Property | null;
}

export default function ImageModal({
  images,
  currentIndex,
  setCurrentIndex,
  closeModal,
  property,
}: ImageModalProps) {
  return (
    <div className="modal-overlay fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4" onClick={closeModal} role="dialog" aria-modal="true">
      <div className="modal-content relative max-w-4xl w-full bg-white rounded-lg shadow-lg p-4" onClick={(e) => e.stopPropagation()}>
        <button
          className="close-btn absolute top-3 right-3 text-3xl font-bold text-gray-700 hover:text-gray-900"
          onClick={closeModal}
          aria-label="Close modal"
        >
          &times;
        </button>

        {images.length > 0 ? (
          <>
            <div className="slider-container flex items-center justify-between gap-4">
              <button
                className="nav-btn text-4xl font-bold text-indigo-600 disabled:text-gray-300"
                onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)}
                disabled={images.length <= 1}
                aria-label="Previous image"
              >
                ‹
              </button>

              <Image
                src={images[currentIndex] || "/img/default.jpg"}
                alt={`Slide ${currentIndex + 1}`}
                width={800}
                height={480}
                className="max-h-[60vh] object-contain rounded-lg mx-auto"
              />

              <button
                className="nav-btn text-4xl font-bold text-indigo-600 disabled:text-gray-300"
                onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
                disabled={images.length <= 1}
                aria-label="Next image"
              >
                ›
              </button>
            </div>

            {property && (
              <div className="property-info mt-4 space-y-1 text-gray-700">
                <p>
                  <strong>Title:</strong> {property.title}
                </p>
                <p>
                  <strong>District:</strong> {property.district}
                </p>
                <p>
                  <strong>Price:</strong> Rs. {property.price}
                </p>
                <p>
                  <strong>Manager:</strong> {property.manager}
                </p>
                <p>
                  <strong>Contact:</strong> {property.contact}
                </p>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-gray-600">No images to display</p>
        )}
      </div>
    </div>
  );
}