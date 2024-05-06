import { Navigate } from "react-router-dom";
import { useContext } from "react";
import React from 'react';
import AuthContext from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
    let {user} = useContext(AuthContext)

    if (!user) {
      return <Navigate to="/login" />;
    }
    return children;
  };

export default ProtectedRoute;
