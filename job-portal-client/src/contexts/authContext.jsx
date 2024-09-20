import React, { useContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged, getIdTokenResult } from "firebase/auth";
import { updateUserEmail } from "../firebase/auth";


const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [isEmailUser, setIsEmailUser] = useState(false);
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [token, setToken] = useState(null);
  const [isUserRole, setIsUserRole] = useState(false);
  const [isEmployer, setIsEmployer] = useState(false);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const tokenResult = await getIdTokenResult(user);
        setToken(tokenResult.token);

        setCurrentUser(user);
        setUserLoggedIn(true);

        console.log("in useEffect", user);

        // check if the user has admin claim
        setIsAdmin(tokenResult.claims.admin || false); 
        // setIsUserRole(tokenResult.claims.role === 'user');

        setIsEmployer(tokenResult.claims.role === 'employer');
        
        // fetch user details for regular users
        if (!tokenResult.claims.role) {
          await fetchUserDetails(tokenResult.token);
        }

      } else {
        setCurrentUser(null);
        setUserLoggedIn(false);
        setIsAdmin(false);
        setIsUserRole(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const fetchUserDetails = async (token) => {
    try {
      console.log('Bearer Token:', `Bearer ${token}`);
      const response = await fetch('http://localhost:3000/userDetails', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        console.log('User Details from fetchUserDetails authContext:', data);
        setUserDetails(data);
      } else {
        throw new Error('Failed to fetch user details');
      }
    } catch (error) {
      console.log('Error fetching user details:', error);
    }
  };

  const registerUser = async (userData, token) => {
    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });
      const data = await response.json();
      if (response.ok) {
        console.log('User registered successfully:', data);
        // Optionally, you can update the user details or state here
      } else {
        throw new Error('Failed to register user');
      }
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  const updateUserDetails = async (updatedDetails) => {
    try {
      console.log('Token being sent for update:', token);  // log the token being sent
      const response = await fetch('http://localhost:3000/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`  // ensure token is passed correctly
        },
        body: JSON.stringify(updatedDetails)
      });
      const data = await response.json();
      if (response.ok) {
        console.log('User details updated successfully:', data);
        setUserDetails(prevDetails => ({ ...prevDetails, ...updatedDetails }));

        // set email if updated
        if (updatedDetails.email) {
          await updateUserEmail(updatedDetails.email);
        }

      } else {
        console.error('Error response from server:', data);
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error updating user details:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    userLoggedIn,
    isAdmin,
    isUserRole,
    isEmployer,
    loading,
    userDetails,
    fetchUserDetails,
    registerUser,
    updateUserDetails,
    setUserLoggedIn,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}