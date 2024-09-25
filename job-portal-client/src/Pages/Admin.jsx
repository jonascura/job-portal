import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import { useAuth } from '../contexts/authContext'; // Import the useAuth hook

const Admin = () => {
  const { isAdmin } = useAuth(); // Use the useAuth hook to get admin status

  // function will never trigger
  if (!isAdmin) {
    return <div>Access denied. You do not have permission to view this page.</div>;
  }
  
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  

  // set current page
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  //  get all jobs
  useEffect(() => {
    setIsLoading(true);
    fetch(`http://localhost:3000/all-jobs?sort=-postingDate`) // sorts by postingDate
      .then(res => res.json())
      .then(data => {
        setJobs(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Failed to load jobs", error);
        setIsLoading(false);
      });
  }, [searchText]);

  // filter jobs when searchText changes
  useEffect(() => {
    //  search logic
    const filteredItems = jobs.filter((job) => {
      // search by job
      const jobTitleMatch = job.jobTitle.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
      // search by company
      const companyNameMatch = job.companyName.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
      return jobTitleMatch || companyNameMatch;
    });
    setFilteredJobs(filteredItems);
  }, [jobs, searchText]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstItem, indexOfLastItem);

  // next button and prev btn
  const nextPage = () => {
    if(indexOfLastItem < filteredJobs.length) {
      setCurrentPage(currentPage + 1);
    };
  };

  const prevPage = () => {
    if(currentPage > 1) {
      setCurrentPage(currentPage - 1);
    };
  };

  // Handle change in items per page
  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to first page with new items per page
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:3000/job/${id}`, { method: "DELETE" })
      .then(res => res.json())
      .then(data => {
        // Check if the server responded with a success message.
        // Make sure the property you check matches what your server sends back.
        if (data.acknowledged === true || data.success === true) {
          alert("Job Deleted Successfully");
  
          // Update state to reflect the deletion
          const updatedJobs = jobs.filter(job => job._id !== id);
          setJobs(updatedJobs);

        } else {
          // Handle any errors or issues reported by the server
          alert("Failed to delete the job.");
        }
      })
      .catch(error => {
        console.error("Failed to delete job", error);
        alert("An error occurred while deleting the job.");
      });
  };

  // Function to toggle job approval
  const toggleJobApproval = (id) => {
    const updatedJobs = jobs.map(job => {
      if (job._id === id) {
        return { ...job, isApproved: !job.isApproved };
      }
      return job;
    });
    setJobs(updatedJobs); // Update state with updated jobs array

    // Update the backend with the new approval status
    fetch(`http://localhost:3000/job/${id}`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isApproved: updatedJobs.find(job => job._id === id).isApproved })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("Job approval status updated successfully");
      } else {
        alert("Failed to update job approval status.");
        // If the update fails, revert the state back to the previous state
        setJobs(jobs); // Restore the original state
      }
    })
    .catch(error => {
      console.error("Failed to update job approval status", error);
      alert("An error occurred while updating the job approval status.");
      // If there's an error, revert the state back to the previous state
      setJobs(jobs); // Restore the original state
    });
  };

    // -------------- Radio filtering ------------------
    const handleChange = (event) => {
      setSelectedCategory(event.target.value);
      console.log("Selected Category:", event.target.value);
    }
  
    // -------------- Button based filtering functions -
    const handleClick = (event) => {
      setSelectedCategory(event.target.value);
    }

  return (
    <div>
      <div className='max-w-2-2xl container mx-auto xl:px-24 px-4'>
        <h1 className='text-center p-4'>All Jobs</h1>
        <div className='search-box p-s text-center mb-2'>
          <input
            onChange={(e) => setSearchText(e.target.value)}
            type='text' name='search' id='search' className='py-2 pl-3 border focus:outline-none lg:w-6/12 mb-4 w-full' 
          />
          <button className='bg-blue text-white font-semibold px-8 py-2 rounded-sm mb-4' onClick={() => setSearchText(searchText)}>Search</button>
        </div>
      </div>

      <div className='bg-[#FAFAFA] flex flex-wrap gap-8 lg:px-24 px-4 py-12'>
        {/* left side */}

        {/* right: table */}
        <section className="flex-1 py-1 bg-blueGray-50">
          <div className="w-full mb-12 xl:mb-0 px-4 mx-auto"> {/*// "w-full xl:w-8/12 mb-12 xl:mb-0 px-4 mx-auto mt-5"*/}
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded ">
              <div className="rounded-t mb-0 px-4 py-3 border-0">
                <div className="flex flex-wrap items-center">
                  <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                    <h3 className="font-semibold text-base text-blueGray-700">Jobs</h3>
                  </div>
                  {/* <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                    <button className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">
                    <Link to={`/post-job`}>Post a Job</Link>
                    </button>
                  </div> */}
                  {/* Items per page selector */}
                  <div>
                    <label htmlFor="itemsPerPage" className="mr-2">Items per page:</label>
                    <select
                      id="itemsPerPage"
                      value={itemsPerPage}
                      onChange={handleItemsPerPageChange}
                      className="border py-2 px-3 text-grey-darkest"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="block w-full overflow-x-auto">
                <table className="items-center bg-transparent w-full border-collapse ">
                  <thead>
                    <tr>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Toggle
                      </th>
                      <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Status
                      </th>
                      <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Company
                      </th>
                      <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Job Title
                      </th>
                      <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Location
                      </th>
                      <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Salary
                      </th>
                      <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Date Created
                      </th>
                      <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Edit
                      </th>
                      <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Delete
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentJobs.map((job, index) => (
                      <tr key={index}>
                        {/* toggle */}
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left text-blueGray-700">
                          <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input
                              type="checkbox"
                              checked={job.isApproved}
                              onChange={() => toggleJobApproval(job._id)}
                              className={`toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-2 appearance-none cursor-pointer ${job.isApproved ? 'translate-x-4' : 'translate-x-0'}`}
                            />
                            <label className={`toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${job.isApproved ? 'bg-mint' : 'bg-gray-400 '}`}></label>
                          </div>
                        </td>
                        {/* Status */}
                        <td className={`border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 ${job.isApproved ? 'text-mint' : 'text-blueGray-700'}`}>
                          {
                          job.isApproved ? "Aprroved": "Pending"
                          }
                        </td>
                        <td className="border-t-0 px-6 align-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4 flex items-center">
                          <img src={job.companyLogo} alt="" style={{ width: '20px', height: 'auto' }} />
                          <span className="ml-2">{job.companyName}</span>
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 ">
                          {job.jobTitle}
                        </td> 
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 ">
                          {job.jobLocation}
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                          ${job.minPrice} - ${job.maxPrice}
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 ">
                          {job.postingDate}
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                          <button><Link to={`/edit-job/${job?._id}`}>Edit</Link></button>
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                          <button onClick={() => handleDelete(job._id)} className='bg-tomato py-2 px-6 text-white rounded-sm'>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Pagination */}
          {jobs.length > 0 ? (
            <div className="flex justify-center mt-4 space-x-8">
              <button onClick={prevPage} disabled={currentPage === 1} className="hover:underline">
                Previous
              </button>
              <span className='mx-2'>
                Page <b>{currentPage}</b> of {Math.ceil(jobs.length / itemsPerPage)}
              </span>
              <button onClick={nextPage} disabled={currentPage === Math.ceil(jobs.length / itemsPerPage)} className="hover:underline">
                Next
              </button>
            </div>
          ) : (
            ""
          )}
        </section>
      </div>
    </div>
  )
}

export default Admin