import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { debounce } from "lodash";
import CreatableSelect from "react-select/creatable";
import { useAuth } from '../contexts/authContext';
import AuthModal from '../component/AuthModal';
import "../styles/globals.css";

const CreateJob = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const [selectedOption, setSelectedOption] = useState(null);
  const [locationInput, setLocationInput] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const locationRef = useRef(null);
  const [jobTags, setJobTags] = useState([]);
  const { userLoggedIn } = useAuth();
  const [showPopup, setShowPopup] = useState(false);

  // save form elements for non-logged-in users (after log in, form is filled in with prior information. Cleared after one reload)
  useEffect(() => {
    // load form data from local storage if available
    const savedFormData = JSON.parse(localStorage.getItem('formData'));
    if (savedFormData) {
      Object.keys(savedFormData).forEach((key) => {
        setValue(key, savedFormData[key]);
      });
      setSelectedOption(savedFormData.skills || []);
      setLocationInput(savedFormData.jobLocation || "");
      setJobTags(savedFormData.jobTags || []);
    }
    // clear local storage
    localStorage.removeItem('formData');
  }, [setValue]);

  const debouncedFetchLocationSuggestions = debounce((inputText) => {
    if (!inputText.trim()) return setLocationSuggestions([]);
    fetch(`http://localhost:3000/autocomplete-location?term=${inputText}`)
      .then((response) => response.json())
      .then((data) => setLocationSuggestions(data))
      .catch((error) => console.error("Error fetching locations:", error));
  }, 300);

  const handleLocationSelect = (location) => {
    setLocationInput(location);
    setValue("jobLocation", location, { shouldValidate: true });
    setLocationSuggestions([]);
  };

  const onSubmit = (data) => {
    data.jobLocation = locationInput; // change location to jobLocation
    const formData = {
      ...data,
      jobLocation: locationInput,
      skills: selectedOption
        ? selectedOption.map((option) => option.value)
        : [],
      tags: jobTags.map((tag) => tag.value),
      isApproved: false,
    };


    if (!userLoggedIn) {
      setShowPopup(true);
      // save form data to local storage before redirecting login or signup
      localStorage.setItem('formData', JSON.stringify({ ...data, skills: selectedOption, jobLocation: locationInput, jobTags}));
      return;
    }

    fetch("http://localhost:3000/post-job", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.acknowledged) {
          alert("Job posted successfully!");
          reset();
          setLocationInput("");
          setSelectedOption(null);
          setJobTags([]);
          setSelectedOption([]);
          setLocationInput("");
        }
      });
  };

  const handleSubmitWithoutAccount = () => {
    handleSubmit((data) => {
      data.jobLocation = locationInput;
      data.skills = selectedOption;
      data.isApproved = false;
      data.tags = jobTags.map((tag) => tag.value);

      fetch("http://localhost:3000/post-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.acknowledged) {
            alert("Job posted successfully!");
            reset();
          }
        });
    })();
  };

  const options = [
    { value: "JavaScript", label: "JavaScript" },
    { value: "C++", label: "C++" },
    { value: "HTML", label: "HTML" },
    { value: "CSS", label: "CSS" },
    { value: "React", label: "React" },
    { value: "Node", label: "Node" },
    { value: "MongoDB", label: "MongoDB" },
    { value: "Redux", label: "Redux" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setLocationSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="max-w-screen-xl mx-auto p-5">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-white p-8 shadow rounded"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/** Detailed error checking and form setup for each input field **/}
          <div>
            <label className="block text-lg font-semibold mb-2">
              Job Title
            </label>
            <input
              type="text"
              {...register("jobTitle", { required: "Job title is required" })}
              placeholder="Web Developer"
              className="form-input block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            {errors.jobTitle && (
              <p className="text-red-500 text-xs mt-2">
                {errors.jobTitle.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-lg font-semibold mb-2">
              Company Name
            </label>
            <input
              type="text"
              {...register("companyName", {
                required: "Company name is required",
              })}
              placeholder="Ex: Microsoft"
              className="form-input block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            {errors.companyName && (
              <p className="text-red-500 text-xs mt-2">
                {errors.companyName.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-lg font-semibold mb-2">
              Minimum Salary
            </label>
            <input
              type="text"
              {...register("minPrice", {
                required: "Minimum salary is required",
              })}
              placeholder="$20k"
              className="form-input block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            {errors.minPrice && (
              <p className="text-red-500 text-xs mt-2">
                {errors.minPrice.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-lg font-semibold mb-2">
              Maximum Salary
            </label>
            <input
              type="text"
              {...register("maxPrice", {
                required: "Maximum salary is required",
              })}
              placeholder="$120k"
              className="form-input block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            {errors.maxPrice && (
              <p className="text-red-500 text-xs mt-2">
                {errors.maxPrice.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-lg font-semibold mb-2">
              Salary Type
            </label>
            <select
              {...register("salaryType", {
                required: "Please select a salary type",
              })}
              className="form-select block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Select Salary Type</option>
              <option value="Hourly">Hourly</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>
            {errors.salaryType && (
              <p className="text-red-500 text-xs mt-2">
                {errors.salaryType.message}
              </p>
            )}
          </div>
          <div ref={locationRef}>
            <label className="block text-lg font-semibold mb-2">
              Job Location
            </label>
            <input
              type="text"
              {...register("jobLocation", {
                required: "Job location is required",
              })}
              value={locationInput}
              onChange={(e) => {
                setLocationInput(e.target.value);
                debouncedFetchLocationSuggestions(e.target.value);
              }}
              placeholder="Type location..."
              className="form-input block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            {errors.jobLocation && (
              <p className="text-red-500 text-xs mt-2">
                {errors.jobLocation.message}
              </p>
            )}
            {locationSuggestions.length > 0 && (
              <ul className="absolute z-10 list-disc bg-white border border-gray-200 mt-1 rounded-md shadow-lg max-h-60 overflow-auto">
                {locationSuggestions.map((location, index) => (
                  <li
                    key={index}
                    onClick={() => handleLocationSelect(location)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {location}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <label className="block text-lg font-semibold mb-2">
              Job Posting Date
            </label>
            <input
              type="date"
              {...register("postingDate", {
                required: "Posting date is required",
              })}
              className="form-input block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            {errors.postingDate && (
              <p className="text-red-500 text-xs mt-2">
                {errors.postingDate.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-lg font-semibold mb-2">
              Experience Level
            </label>
            <select
              {...register("experienceLevel", {
                required: "Experience level is required",
              })}
              className="form-select block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Select experience level</option>
              <option value="NoExperience">No Experience</option>
              <option value="Internship">Internship</option>
              <option value="Work remotely">Work remotely</option>
            </select>
            {errors.experienceLevel && (
              <p className="text-red-500 text-xs mt-2">
                {errors.experienceLevel.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-lg font-semibold mb-2">
              Required Skill Sets
            </label>
            <CreatableSelect
              isMulti
              onChange={(value) => {
                setSelectedOption(value);
                setValue("skills", value ? value.map((v) => v.value) : [], {
                  shouldValidate: true,
                });
              }}
              value={selectedOption}
              options={options}
              className="basic-multi-select"
              classNamePrefix="select"
            />
            {errors.skills && (
              <p className="text-red-500 text-xs mt-2">
                At least one skill is required
              </p>
            )}
          </div>
          <div>
            <label className="block text-lg font-semibold mb-2">
              Company Logo
            </label>
            <input
              type="url"
              {...register("companyLogo")}
              placeholder="https://example.com/logo.png"
              className="form-input block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-lg font-semibold mb-2">
              Employment Type
            </label>
            <select
              {...register("employmentType", {
                required: "Required skill is required",
              })}
              className="form-select block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Select employment type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Temporary">Temporary</option>
            </select>
            {errors.employmentType && (
              <p className="text-red-500 text-xs mt-2">
                {errors.employmentType.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-lg font-semibold mb-2">Job Tags</label>
            <CreatableSelect
              isMulti
              onChange={(value) => setJobTags(value || [])} // Ensure null or undefined doesn't break the state
              value={jobTags}
              placeholder="Type and press enter to add tags..."
              className="basic-multi-select"
              classNamePrefix="select"
              isClearable={true} // Allows users to remove all tags at once
              formatCreateLabel={(inputValue) => `Add "${inputValue}"`} // Customizes the prompt for creating a new tag
            />
          </div>

          <div className="col-span-2">
            <label className="block text-lg font-semibold mb-2">
              Job Description
            </label>
            <textarea
              {...register("description", {
                required: "Job description is required",
              })}
              className="form-textarea block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              rows="6"
              placeholder="Describe the role and responsibilities..."
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-xs mt-2">
                {errors.description.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-lg font-semibold mb-2">
              Job Posted By
            </label>
            <input
              type="email"
              {...register("postedBy", { required: "Email is required" })}
              placeholder="your-email@example.com"
              className="form-input block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            {errors.postedBy && (
              <p className="text-red-500 text-xs mt-2">
                {errors.postedBy.message}
              </p>
            )}
          </div>
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="bg-blue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Send Job Request
            </button>
          </div>
        </div>
      </form>
      <AuthModal
        showPopup={showPopup}
        setShowPopup={setShowPopup}
        handleSubmitWithoutAccount={handleSubmitWithoutAccount}
        header="Do you want to keep track of this job?"
        message="Log in or sign up to unlock more features!"
        info="*This job will not appear on account unless logged in prior to submission*"
      />
    </div>
  );
};

export default CreateJob;
