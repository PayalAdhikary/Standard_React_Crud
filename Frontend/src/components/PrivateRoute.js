import React from 'react';
import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Correct named import

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Get token from localStorage

  // Check if token exists and is not expired
  const isTokenValid = () => {
    if (!token) return false;

    try {
      const decoded = jwtDecode(token); // Decode token to get expiry time
      const currentTime = Date.now() / 1000; // Get current time in seconds

      // If token is expired, return false
      if (decoded.exp < currentTime) {
        return false;
      }

      return true;
    } catch (error) {
      // If decoding fails, consider token invalid
      return false;
    }
  };

  return isTokenValid() ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
