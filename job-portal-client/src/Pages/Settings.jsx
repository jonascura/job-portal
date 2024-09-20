import React, { useState } from 'react';
import { useAuth } from '../contexts/authContext';
import { Navigate } from 'react-router-dom';
import { updateProfile, updateEmail, updatePassword } from "firebase/auth";

const Settings = () => {
  const { currentUser, userDetails, updateUserDetails } = useAuth();
  const [firstName, setFirstName] = useState(userDetails?.firstName || '');
  const [lastName, setLastName] = useState(userDetails?.lastName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [newPassword, setNewPassword] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();

    // construct the updated user details
    const updatedDetails = {
      firstName,
      lastName,
      email,
    };

    try {
      // update Firebase Authentication profile
      if (currentUser) {
        await updateProfile(currentUser, {
          displayName: `${firstName} ${lastName}`,
        });

        // functions don't work yet
        // if (email !== currentUser.email) {
        //   await updateEmail(currentUser, email);
        // }

        // if (newPassword) {
        //   await updatePassword(currentUser, newPassword);
        // }
      }

      // call the update function from the auth context
      await updateUserDetails(updatedDetails);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };

  // prevent force url path without loggin in
  if (!currentUser) {
    return <Navigate to={'/'} replace={true} />;
  }

  return (
    <div className="bg-[#FAFAFA] flex justify-center lg:px-24 px-4 py-12">
    <div className="w-full max-w-lg bg-white shadow-sm rounded-lg p-6">
      <h2 className="text-2xl font-medium mb-6">Account Settings</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-gray-700">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700">Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        {/* <div>
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />
        </div> */}
        {/* <div>
          <label className="block text-gray-700">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />
        </div> */}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Update
        </button>
      </form>
    </div>
  </div>
  );
};

export default Settings;
