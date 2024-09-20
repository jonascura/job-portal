// Location.jsx
import React from "react";

const Location = ({ handleProvinceChange }) => {
  const provinces = [
    "All",
    "Ontario",
    "Quebec",
    "British Columbia",
    "Alberta",
    "Manitoba",
    "Saskatchewan",
  ];

  return (
    <div>
      <h4 className="text-lg font-medium mb-2">Location</h4>
      {provinces.map((province) => (
        <label key={province} className="sidebar-label-container">
          <input
            type="radio"
            name="location"
            value={province}
            onChange={() => handleProvinceChange(province)}
          />
          <span className="checkmark"></span> {province}
        </label>
      ))}
    </div>
  );
};

export default Location;
