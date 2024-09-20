import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/authContext';
import { Navigate, Link } from 'react-router-dom';

const MyProfile = () => {
  const { currentUser, userDetails } = useAuth();
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    if (userDetails) {
      setProfileData(userDetails);
    }
  }, [userDetails]);

  // prevent force url path without loggin in
  if (!currentUser) {
    return <Navigate to={'/'} replace={true} />;
  }

  return (
    <div className="bg-[#FAFAFA] flex justify-center lg:px-24 px-4 py-12">
      <div className="w-full max-w-lg bg-white shadow-sm rounded-lg p-6">
        <div className="flex flex-col items-center mb-6">
          <img
            src="https://via.placeholder.com/150"
            alt="Profile"
            className="w-32 h-32 rounded-full mb-4"
          />
          <h3 className="text-lg font-medium">{currentUser.displayName || 'Your Name'}</h3>
          <p className="text-gray-600">{currentUser.email}</p>
          {profileData && (
            <>
              <p className="text-gray-600">{profileData.location}</p>
              <p className="text-gray-600">{profileData.jobTitle}</p>
            </>
          )}
        </div>
        <div className="mb-6">
          <div className="flex items-baseline">
            <h3 className="text-lg font-medium">About Me</h3>
            <Link
              to="/edit-profile"
              className="text-sm text-blue hover:underline ml-2"
            >
              Edit
            </Link>
          </div>
          <p className="text-gray-600 mt-2">
            {profileData?.aboutMe || 'Add a brief description about yourself.'}
          </p>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-medium">Resumes</h3>
          <Link
            to="/resumes"
            className="text-blue-500 hover:underline"
          >
            Manage Resumes
          </Link>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-medium">Saved Jobs</h3>
          <Link
            to="/saved-jobs"
            className="text-blue-500 hover:underline"
          >
            View Saved Jobs
          </Link>
        </div>
        <div>
          <h3 className="text-lg font-medium">Settings</h3>
          <Link
            to="/settings"
            className="text-blue-500 hover:underline"
          >
            Account Settings
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
