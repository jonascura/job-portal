import React from 'react';
import { useNavigate } from 'react-router-dom';

const AuthModal = ({ showPopup, setShowPopup, handleSubmitWithoutAccount, header, message, info }) => {
  const navigate = useNavigate();

  const handlePopupChoice = (choice) => {
    setShowPopup(false);
    if (choice === 'login') {
      navigate('/login');
    } else if (choice === 'signup') {
      navigate('/register');
    } else if (choice === 'submit') {
      handleSubmitWithoutAccount();
    }
  };

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">{header}</h2>
        <p className="mb-4" style={{ whiteSpace: 'pre-line' }}>
          {message}
          <br />
          <span className='text-sm font-semibold'style={{ whiteSpace: 'pre-line' }}>{info}</span>
        </p>
        <div className="flex justify-end space-x-2">
          <button onClick={() => handlePopupChoice('login')} className="bg-blue text-white px-4 py-2 rounded">Log In</button>
          <button onClick={() => handlePopupChoice('signup')} className="bg-blue text-white px-4 py-2 rounded">Sign Up</button>
          <button onClick={() => handlePopupChoice('submit')} className="bg-green text-white px-4 py-2 rounded">Submit Without Account</button>
          <button onClick={() => setShowPopup(false)} className="bg-red-500 text-white px-4 py-2 rounded">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
