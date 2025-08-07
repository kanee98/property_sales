"use client";

import React from "react";

interface FilterMenuProps {
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

export default function FilterMenu({
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
}: FilterMenuProps) {
  return (
    <div className="property-filters">
      <h2><i className="fa fa-filter"></i> Filters</h2>
      <hr />

      <h4 className="font-semibold">By category:</h4>
      <div className="space-y-2">
        {["For Sale", "For Rent", "For Lease", "Wanted"].map((type) => (
          <div className="filter-checkbox-group" style={{ width: "1rem", flexWrap: "nowrap" }} key={type}>
            <input
              type="checkbox"
              className="icheck"
              checked={selectedTypes.includes(type)}
              onChange={(e) => {
                const newSelection = [...selectedTypes];
                if (e.target.checked) {
                  newSelection.push(type);
                } else {
                  const index = newSelection.indexOf(type);
                  if (index > -1) newSelection.splice(index, 1);
                }
                setSelectedTypes(newSelection);
              }}
            />
            <label>{type}</label>
          </div>
        ))}
      </div>

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

      <h4 className="mt-4 font-semibold">By price:</h4>
      <div className="filter-number-group flex gap-2">
        <input
          type="number"
          min={0}
          value={minPrice}
          onChange={(e) => setMinPrice(Number(e.target.value))}
          placeholder="Min Price"
          className="border p-2 rounded w-full"
        />
        <span className="self-center">to</span>
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

      <h4 className="mt-4 font-semibold">By Area (sq ft):</h4>
      <div className="filter-number-range flex gap-2">
        <input
          type="number"
          min={0}
          value={minArea}
          onChange={(e) => setMinArea(Number(e.target.value))}
          placeholder="Min Area"
          className="border p-2 rounded w-full"
        />
        <span className="self-center">to</span>
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
  );
}