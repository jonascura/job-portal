import React from 'react'

const Salary = ({ handleSalaryChange }) => {
  const hourlyWages = ["All", "20", "30", "40"]; // Using integers to easily parse for comparison
  return (
    <div>
      <h4 className="text-lg font-medium mb-2">Pay</h4>
      {hourlyWages.map((pay) => (
        <label key={pay} className="sidebar-label-container">
          <input
            type="radio"
            name="pay"
            value={pay === "All" ? "All" : `${pay}.00+/hour`} // Display "$20.00+/hour" but value is "20"
            onChange={(e) => handleSalaryChange(e.target.value)}
          />
          <span className="checkmark"></span>{" "}
          {pay === "All" ? "All" : `$${pay}.00+/hour`}
        </label>
      ))}
    </div>
  );
};


export default Salary
