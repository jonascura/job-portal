import React from "react";

const EmploymentType = ({ handleEmploymentTypeChange }) => {
  const employmentTypes = ["All", "Full-time", "Part-time", "Temporary", "Contract"];

  return (
    <div>
      <h4 className="text-lg font-medium mb-2">Employment Type</h4>
      {employmentTypes.map((type) => (
        <label key={type} className="sidebar-label-container">
          <input
            type="radio"
            name="employmentType"
            value={type}
            onChange={(e) => handleEmploymentTypeChange(e.target.value)}
          />
          <span className="checkmark"></span> {type}
        </label>
      ))}
    </div>
  );
};

export default EmploymentType;
