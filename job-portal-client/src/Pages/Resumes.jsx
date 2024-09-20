import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

const Resumes = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const { currentUser, userDetails } = useAuth();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    if (selectedFile && validTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      setError('');
    } else {
      setFile(null);
      setError('Please upload a valid PDF or Word document');
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    // logic to handle file upload
    if (file) {
      console.log('File uploaded:', file);
      // add your upload logic here
    }
  };

  // prevent force url path without loggin in
  if (!currentUser) {
    return <Navigate to={'/'} replace={true} />;
  }

  return (
    <div className="bg-[#FAFAFA] flex justify-center py-8">
      <div className="w-full max-w-lg bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-2xl font-medium mb-6">Upload Your Resume</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-gray-700">Resume (PDF or Word)</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border rounded"
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Upload
          </button>
        </form>
      </div>
    </div>
  );
};

export default Resumes;
