import React from "react";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faDollarSign,
  faBriefcase,
  faCalendarAlt,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import PageHeader from "../component/PageHeader";
import "../styles/globals.css";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [relatedJobs, setRelatedJobs] = useState([]); // State for related jobs
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`http://localhost:3000/all-jobs/${id}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setJob(data);
        fetchRelatedJobs(data.tags); // Fetch related jobs based on tags of the current job
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchRelatedJobs = async (tags) => {
      try {
        const response = await fetch(
          `http://localhost:3000/related-jobs?tags=${tags.join(
            ","
          )}&excludeId=${id}`
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setRelatedJobs(data);
      } catch (err) {
        console.error("Error fetching related jobs:", err);
      }
    };

    fetchJob();
  }, [id]);

  const handleApply = async () => {
    alert("Application submitted!");
  };

  if (error)
    return <div className="text-red-500 text-center mt-4">Error: {error}</div>;
  if (!job) return <div className="text-center mt-4">Loading...</div>;

  // Function to render related job cards
  const renderRelatedJobs = () => {
    return relatedJobs.map((relatedJob) => (
      <Link
        to={`/job/${relatedJob._id}`}
        key={relatedJob._id}
        className="bg-white shadow-md rounded-lg p-4 mb-6 w-full sm:w-1/2 lg:w-1/3 transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
      >
        <h3 className="text-lg font-bold text-gray-800">
          {relatedJob.jobTitle}
        </h3>
        <p className="text-gray-600 mb-2">{relatedJob.companyName}</p>
        <p className="text-gray-500 flex items-center mb-1">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />{" "}
          {relatedJob.jobLocation}
        </p>
        <p className="text-gray-500 mb-4">
          <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />{" "}
          {new Date(relatedJob.postingDate).toLocaleDateString()}
        </p>
        <button className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600">
          View Job
        </button>
      </Link>
    ));
  };

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
      <PageHeader title="Job Details" path="single job" />
      <div className="bg-white shadow-md rounded-lg p-6 mt-6">
        <div className="job-header mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{job.jobTitle}</h1>
          <div className="flex items-center mb-4">
            <img
              src={job.companyLogo}
              alt={`${job.companyName} logo`}
              className="w-10 h-10 rounded-full mr-3"
            />
            <p className="text-gray-600 text-lg">{job.companyName}</p>
            <span className="text-gray-500 mx-2">•</span>
            <span className="text-gray-500 flex items-center">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />{" "}
              {job.jobLocation}
            </span>
          </div>
          <p className="text-gray-500 mb-4">
            <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />{" "}
            {new Date(job.postingDate).toLocaleDateString()}
          </p>
          <div className="flex justify-start">
            <button className="button-primary mr-3" onClick={handleApply}>
              Apply Now
            </button>
            <button className="button-secondary mr-3">Save</button>
            <button className="button-secondary">Not Interested</button>
          </div>
        </div>

        {/* Job Details Section */}
        <div className="job-info mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Job Details
          </h2>
          <div className="mb-2">
            <FontAwesomeIcon
              icon={faBriefcase}
              className="text-gray-500 mr-2"
            />
            <span>
              <strong>Experience Level:</strong> {job.experienceLevel}
            </span>
          </div>
          <div className="mb-2">
            <FontAwesomeIcon
              icon={faDollarSign}
              className="text-gray-500 mr-2"
            />
            <span>
              <strong>Salary:</strong> ${job.minPrice} - ${job.maxPrice}{" "}
              {job.salaryType}
            </span>
          </div>
          <div className="mb-2">
            <FontAwesomeIcon icon={faClock} className="text-gray-500 mr-2" />
            <span>
              <strong>Employment Type:</strong> {job.employmentType}
            </span>
          </div>
        </div>

        {/* Job Description Section */}
        <div className="job-description mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Job Description
          </h2>
          <p className="text-gray-700">{job.description}</p>
        </div>

        {/* Skills Required Section */}
        <div className="job-skills mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Skills Required
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            {job.skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </div>

        {/* Tags Section */}
        <div className="job-tags mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Tags</h2>
          <div className="flex flex-wrap">
            {job.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 rounded-full px-4 py-1 text-sm font-semibold mr-2 mb-2"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Related Jobs Section */}
      <div className="related-jobs bg-gray-50 shadow-inner p-6 mt-10 rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
          Related Jobs
        </h2>
        <div className="flex flex-wrap -mx-2">{renderRelatedJobs()}</div>
      </div>
    </div>
  );
};

export default JobDetails;
