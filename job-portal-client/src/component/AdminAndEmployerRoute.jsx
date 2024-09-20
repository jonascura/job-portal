import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

const AdminAndEmployerRoute = ({ children }) => {
  const { userLoggedIn, isAdmin, isEmployer } = useAuth();

  if (!userLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (!isAdmin && !isEmployer) {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminAndEmployerRoute;
