import React from "react";
import Location from "./Location";
import Salary from "./Salary";
import JobPostingDate from "./JobPostingDate";
import EmploymentType from "./EmploymentType";

const Sidebar = ({
  handleProvinceChange,
  handleSalaryChange,
  handleEmploymentTypeChange,
  handleDateChange,
}) => {
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-bold mb-2">Filters</h3>
      <Location handleProvinceChange={handleProvinceChange} />
      <Salary handleSalaryChange={handleSalaryChange} />
      <EmploymentType handleEmploymentTypeChange={handleEmploymentTypeChange} />
      <JobPostingDate handleDateChange={handleDateChange} />
    </div>
  );
};

export default Sidebar;
