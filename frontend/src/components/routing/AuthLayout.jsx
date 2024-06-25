import React from "react"
import { AuthProvider } from "../../context/AuthContext";
import { AlertProvider } from "../../context/AlertContext";
import { Outlet } from "react-router-dom";

/**
 * Wrapper to child elements access to the authprovider context.
 */
function AuthLayout() {
  return (
    <AlertProvider>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </AlertProvider>
    
  )
};

export default AuthLayout;
