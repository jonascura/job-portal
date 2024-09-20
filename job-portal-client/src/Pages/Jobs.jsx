import React from 'react'

const Jobs = ({ result }) => {
  // Check if result is undefined or empty, then display "No jobs found."
  if (!result || result.length === 0) {
    return <p>No jobs found.</p>;
  }

  return (
    <>
      <div>
        <h3 className="text-lg font-bold mb-2">{result.length} Jobs</h3>
      </div>
      <section>{result}</section>
    </>
  );
}

export default Jobs
