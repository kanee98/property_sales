"use client";

import React from "react";
import Image from "next/image";
import { Property } from "../types";

interface PropertyCardProps {
  property: Property;
  openImageModal: (images: string[], property: Property) => void;
}

export default function PropertyCard({ property, openImageModal }: PropertyCardProps) {
  let imageSrc = "/img/default.jpg";
  try {
    const imgs = JSON.parse(property.images);
    if (Array.isArray(imgs) && imgs.length > 0) {
      imageSrc = imgs[0];
    }
  } catch {}

  return (
    <div className="property-card">
      <div
        className="property-image-wrapper cursor-pointer relative"
        onClick={() => {
          try {
            const imgs = JSON.parse(property.images);
            if (Array.isArray(imgs)) {
              openImageModal(imgs, property);
            }
          } catch {}
        }}
      >
        <Image
          src={imageSrc}
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
        <div className="property-hover-overlay absolute inset-0 bg-black bg-opacity-25 flex justify-center items-center opacity-0 hover:opacity-100 text-white font-semibold rounded-md transition">
          Click here to view more
        </div>
      </div>

      <h2 className="text-lg font-semibold mt-2">{property.title}</h2>
      <p>{property.area != null ? `${property.area} sq ft` : "N/A"}</p>
      <p>{property.description}</p>
      <p className="font-bold text-green-600">{property.price != null ? `Rs. ${property.price}` : "N/A"}</p>

      <iframe
        src={`https://maps.google.com/maps?q=${property.latitude},${property.longitude}&z=15&output=embed`}
        width="100%"
        height="200"
        className="mt-2 rounded-md"
        loading="lazy"
        title={`Map for ${property.title}`}
      ></iframe>
    </div>
  );
}