import React, { useState } from "react";
import { FiMapPin, FiSearch } from "react-icons/fi";

const Banner = ({ query, handleInputChange, updateJobs }) => {
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Building the URL dynamically based on input
    const baseUrl = "http://localhost:3000/search";
    const queryParts = [];
    if (jobTitle) {
      queryParts.push(`jobTitle=${encodeURIComponent(jobTitle)}`);
    }
    if (location) {
      queryParts.push(`jobLocation=${encodeURIComponent(location)}`);
    }
    const url = `${baseUrl}?${queryParts.join("&")}`;

    try {
      const response = await fetch(url);
      const jobs = await response.json();
      updateJobs(jobs); // Update the jobs in Home component
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      // Reset input fields after the fetch operation
      setJobTitle("");
      setLocation("");
    }
  };

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4 md:py-20 py-14">
      <h1 className="text-5xl font-bold text-primary mb-3">
        Find your <span className="text-blue">new job</span> today
      </h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row justify-start gap-4"
      >
        <div className="relative flex flex-1 items-center bg-white shadow-lg rounded-md">
          <FiSearch className="absolute left-3 text-lg text-gray-400" />
          <input
            type="text"
            placeholder="What position are you looking for?"
            className="form-input w-full pl-10 pr-3 py-2 border-0 focus:ring-2 focus:ring-blue-500 rounded-md"
            onChange={(e) => setJobTitle(e.target.value)}
            value={jobTitle}
          />
        </div>
        <div className="relative flex flex-1 items-center bg-white shadow-lg rounded-md">
          <FiMapPin className="absolute left-3 text-lg text-gray-400" />
          <input
            type="text"
            placeholder="Type location..."
            className="form-input block w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md shadow-sm"
            onChange={(e) => setLocation(e.target.value)}
            value={location}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-md shadow-lg"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default Banner;
