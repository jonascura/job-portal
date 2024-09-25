import React, { useState, useEffect } from "react";
import Banner from "../component/Banner";
import Card from "../component/Card";
import VideoList from "../component/VideoList";
import Jobs from "./Jobs";
import Sidebar from "../sidebar/Sidebar";
import JobPreview from "../component/JobPreview";

const Home = () => {
  // States for job data and UI control
  const [selectedProvince, setSelectedProvince] = useState("All");
  const [selectedSalary, setSelectedSalary] = useState("All");
  const [selectedEmploymentType, setSelectedEmploymentType] = useState("All");
  const [selectedDate, setSelectedDate] = useState("All time");
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetching job listings
  useEffect(() => {
    setIsLoading(true);
    fetch(`http://localhost:3000/all-jobs?sort=postingDate`)
      .then((res) => res.json())
      .then((data) => {
        const approvedJobs = Array.isArray(data)
          ? data.filter((job) => job.isApproved)
          : [];
        setJobs(approvedJobs);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load jobs:", error);
        setJobs([]);
        setIsLoading(false);
    });
  },[]);

  // Input change handlers for each filter
  const handleProvinceChange = (province) => setSelectedProvince(province);
  const handleSalaryChange = (salary) => setSelectedSalary(salary);
  const handleEmploymentTypeChange = (type) => setSelectedEmploymentType(type);
  const handleDateChange = (date) => setSelectedDate(date);

  // Filtering logic
  const filteredJobs = jobs.filter((job) => {
    const salaryThreshold =
      selectedSalary === "All"
        ? 0
        : parseInt(selectedSalary.match(/\d+/)[0], 10);

    const today = new Date();
    let dateLimit = new Date();

    switch (selectedDate) {
      case "1": // Last 24 hours
        dateLimit.setDate(today.getDate() - 1);
        break;
      case "7": // Last 7 days
        dateLimit.setDate(today.getDate() - 7);
        break;
      case "30": // Last month
        dateLimit.setMonth(today.getMonth() - 1);
        break;
      default: // All time or any non-matching case
        dateLimit = new Date("1970-01-01"); // Use epoch as lower bound for "all time"
    }

    return (
      (selectedProvince === "All" ||
        job.jobLocation.includes(selectedProvince)) &&
      (selectedSalary === "All" ||
        (job.minPrice && parseInt(job.minPrice) >= salaryThreshold)) &&
      (selectedEmploymentType === "All" ||
        job.employmentType === selectedEmploymentType) &&
      (selectedDate === "All time" || new Date(job.postingDate) >= dateLimit)
    );
  });

  // Pagination logic
  const calculatePageRange = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return { startIndex, endIndex };
  };

  const nextPage = () =>
    currentPage < Math.ceil(filteredJobs.length / itemsPerPage) &&
    setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  // Render filtered jobs as card components
  const jobCards = filteredJobs
    .slice(...Object.values(calculatePageRange()))
    .map((job, index) => (
      <div key={index} onClick={() => setSelectedJob(job)}>
        <Card data={job}/>
      </div>
  ));

  return (
    <div>
      <Banner
        handleInputChange={(e) => handleProvinceChange(e.target.value)}
        updateJobs={setJobs}
      />

      {/* main content */}
      <div className="bg-[#FAFAFA] md:grid grid-cols-12 gap-8 lg:px-24 px-4 py-12">
        {/* Left side for Sidebar (2/12 of total width) */}
        <div className="col-span-2 bg-white p-4 rounded-2xl">
          <Sidebar
            handleProvinceChange={handleProvinceChange}
            handleSalaryChange={handleSalaryChange}
            handleEmploymentTypeChange={handleEmploymentTypeChange}
            handleDateChange={handleDateChange}
          />
        </div>

        {/* Middle column (6/12 of total width) */}
        <div className="col-span-6 bg-white p-4 rounded-2xl">
          {isLoading ? (
            <p>Loading...</p>
          ) : jobCards.length ? (
            <Jobs result={jobCards} />
          ) : (
            <p>No jobs found.</p>
          )}

          {/* Pagination */}
          {jobCards.length > 0 ? (
            <div className="flex justify-center mt-4 space-x-8">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="hover:underline"
              >
                Previous
              </button>
              <span>
                Page {currentPage} of{" "}
                {Math.ceil(filteredJobs.length / itemsPerPage)}
              </span>
              <button
                onClick={nextPage}
                disabled={
                  currentPage === Math.ceil(filteredJobs.length / itemsPerPage)
                }
                className="hover:underline"
              >
                Next
              </button>
            </div>
          ) : null}
        </div>

        {/* Job preview on the right side (4/12 of total width) */}
        <div className="col-span-4 bg-white p-4 rounded-2xl sticky right-20 top-24">
          <JobPreview job={selectedJob} />
        </div>
      </div>

    </div>
  );
};

export default Home;
