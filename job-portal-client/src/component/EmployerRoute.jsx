import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

const EmployerRoute = ({ children }) => {
  const { userLoggedIn, isEmployer } = useAuth();

  if (!userLoggedIn) {
    return <Navigate to="/employer-login" />;
  }

  if (!isEmployer) {
    return <Navigate to="/" />;
  }

  return children;
};

export default EmployerRoute;
