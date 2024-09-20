import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

// css
import { FaBook, FaBookmark, FaFileArrowUp, FaGear  } from "react-icons/fa6";

const Dropdown = ({ isOpen, onClose, handleSignOut, currentUser }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div ref={dropdownRef} className="absolute right-0 mt-12 w-auto bg-white border rounded shadow-lg py-2 z-50">
      <div className="absolute right-2 -top-2 w-4 h-4 bg-white transform rotate-45 border-t border-l"></div>
      {currentUser && (
        <div className="block px-4 py-2 text-sm font-black text-gray-700">
          {currentUser.email}
        </div>
      )}
      <Link to="/my-profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
        <FaBook className="mr-2" />
        My Profile
      </Link>
      <Link to="/my-jobs" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
        <FaBookmark className="mr-2" />
        My Jobs
      </Link>
      <Link to="/resumes" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
        <FaFileArrowUp className="mr-2" />
        Resumes
      </Link>
      <Link to="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
        <FaGear className="mr-2" />
        Settings
      </Link>
      <div className="border-t my-2"></div>
      <button onClick={handleSignOut} className="block w-full text-center px-4 py-2 text-sm text-blue hover:bg-gray-100">
        Sign Out
      </button>
    </div>
  );
};

export default Dropdown;
