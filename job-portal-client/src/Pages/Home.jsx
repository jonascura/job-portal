import React, { useState, useEffect } from "react";
import Banner from "../component/Banner";
import Card from "../component/Card";
import VideoList from "../component/VideoList";
import Jobs from "./Jobs";
import Sidebar from "../sidebar/Sidebar";

const Home = () => {
  // States for job data and UI control
  const [selectedProvince, setSelectedProvince] = useState("All");
  const [selectedSalary, setSelectedSalary] = useState("All");
  const [selectedEmploymentType, setSelectedEmploymentType] = useState("All");
  const [selectedDate, setSelectedDate] = useState("All time");
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [videos, setVideos] = useState([]); // setting videos can improve load time

  // Fetching videos
  // const fetchVideos = async () => {
  //   // Fetching videos from the MongoDB
  //   const mongoResponse = await fetch("http://localhost:3000/all-videos");
  //   const mongoVideos = mongoResponse.ok ? await mongoResponse.json() : [];
    

  //   // Fetching videos from S3
  //   const s3Response = await fetch("http://localhost:3000/s3-videos");
  //   const s3Videos = s3Response.ok ? await s3Response.json() : [];
  //   const formattedS3Videos = s3Videos.map((url, index) => ({
  //     id: `s3-${index}`, // Creating a unique ID for each S3 video
  //     url,
  //   }));

    // Combine both video arrays
    // const combinedVideos = [...formattedS3Videos, ...mongoVideos];

    // Update state with combined video list
  //   setVideos(combinedVideos);

  //   if (!mongoResponse.ok || !s3Response.ok) {
  //     console.error("Failed to fetch videos from one or both sources");
  //   }
  // };


  // useEffect(() => {
  //   fetchVideos();
  // }, []); // Ensure this runs only once when the component mounts

  // Enhanced version with feedback and error handling
  // const handleVideoUpload = async (event) => {
  //   const file = event.target.files[0];
  //   console.log(file.type); // Log the MIME type of the file
  //   if (!file) return;

  //   if (!file.type.startsWith("video/")) {
  //     alert("Please select a valid video file.");
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append("file", file);

  //   setIsLoading(true); // Show loading indicator during upload
  //   try {
  //     const response = await fetch("http://localhost:3000/upload", {
  //       method: "POST",
  //       body: formData,
  //     });
  //     if (!response.ok) throw new Error("Upload failed");
  //     const data = await response.json();
  //     setVideos([...videos, data]); // Update the video list with the new video
  //     alert("Video uploaded successfully!");
  //   } catch (error) {
  //     console.error("Error uploading video:", error);
  //     alert("Failed to upload video."); // User-friendly error message
  //   } finally {
  //     setIsLoading(false); // Hide loading indicator regardless of the outcome
  //   }
  // };

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

  // get videos
  // useEffect(() => {
  //   setIsLoading(true);
  //   fetch(`http://localhost:3000/all-videos`)
  //   .then((res) => res.json())
  //   .then((data) => {
  //     setVideos(data);
  //     setIsLoading(false);
  //   });
  // },[]);

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
    .map((job, index) => <Card key={index} data={job} />);

  return (
    <div>
      <Banner
        handleInputChange={(e) => handleProvinceChange(e.target.value)}
        updateJobs={setJobs}
      />

      {/* main content */}
      <div className="bg-[#FAFAFA] md:grid grid-cols-4 gap-8 lg:px-24 px-4 py-12">
        {/* Left side for Sidebar (1/5 of total width) */}
        <div className="bg-white p-4 rounded-2xl">
          <Sidebar
            handleProvinceChange={handleProvinceChange}
            handleSalaryChange={handleSalaryChange}
            handleEmploymentTypeChange={handleEmploymentTypeChange}
            handleDateChange={handleDateChange}
          />
        </div>

        {/* Middle */}
        <div className="col-span-2 bg-white p-4 rounded-2xl">
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

        {/* Right */}
        <div className="bg-white p-4 rounded-2xl">
        </div>

        

      </div>
    </div>
  );
};

export default Home;
