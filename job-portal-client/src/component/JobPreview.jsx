import React from "react";
import { Link } from "react-router-dom";

const JobPreview = ({ job }) => {
  if (!job) {
    return <p>Select a job to see the details here.</p>;
  }

  const { _id, companyName, companyLogo, jobTitle, minPrice, maxPrice, salaryType, jobLocation,employmentType, postingDate, description } = job;

  const characterLimit = 1500;
  const truncateText = (text) => {
    if (text.length >characterLimit) {
      return text.substring(0, characterLimit) + '...';
    }
    return text;
  }

  return (
    <div className="job-preview p-4">
      <img src={companyLogo} alt={`${companyName} logo`} className="mb-4" />
      <h2 className="text-xl font-bold mb-2">{jobTitle}</h2>
      <h3 className="text-lg mb-2">{companyName}</h3>
      <p className="mb-4">{truncateText(description)}</p>
      <div className="flex flex-col gap-2">
        <p>Location: {jobLocation}</p>
        <p>Employment Type: {employmentType}</p>
        <p>Salary: {minPrice}-{maxPrice} {salaryType}</p>
        <p>Posting Date: {new Date(postingDate).toLocaleDateString()}</p>
      </div>
      
      {/* button to JobDetails page */}
      <div className="mt-4 ">
        <Link to={`/job/${_id}`}>
          <button className="bg-blue text-white py-2 px-4 rounded hover:bg-midnight-green">
            View Full Details
          </button>
        </Link>
      </div>
    </div>
  );
};

export default JobPreview;
