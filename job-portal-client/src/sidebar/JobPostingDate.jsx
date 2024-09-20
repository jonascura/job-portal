import React from "react";

const JobPostingDate = ({ handleDateChange }) => {
  const dateOptions = [
    { label: "All time", value: "All time" },
    { label: "Last 24 hours", value: "1" },
    { label: "Last 7 days", value: "7" },
    { label: "Last 30 days", value: "30" },
  ];

  return (
    <div>
      <h4 className="text-lg font-medium mb-2">Date of Posting</h4>
      {dateOptions.map((option) => (
        <label key={option.value} className="sidebar-label-container">
          <input
            type="radio"
            name="date"
            value={option.value}
            onChange={() => handleDateChange(option.value)}
          />
          <span className="checkmark"></span> {option.label}
        </label>
      ))}
    </div>
  );
};

export default JobPostingDate;
