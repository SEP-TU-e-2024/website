import { Navigate } from "react-router-dom";
import { useContext } from "react";
import React from 'react';
import AuthContext from "../context/AuthContext";

/**
 * This component protects a route by checking user authentication status.
 * If the user is not authenticated, redirects to the login page.
 * 
 * @param {ReactNode} children - Child components to be rendered if user is authenticated.
 * @returns {ReactNode} - Renders the child components if user is authenticated, otherwise redirects to login page.
 */
const ProtectedRoute = ({ children }) => {
    let {user} = useContext(AuthContext)

    if (!user) {
      return <Navigate to="/login" />;
    }
    return children;
  };

export default ProtectedRoute;
