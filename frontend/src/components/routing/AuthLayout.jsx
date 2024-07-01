import React from "react"
import { AuthProvider } from "../../context/AuthContext";
import { AlertProvider } from "../../context/AlertContext";
import { Outlet } from "react-router-dom";

/**
 * Wrapper to child elements access to the authprovider context.
 */
function AuthLayout() {
  return (
    <AlertProvider data-testId="alert-provider">
      <AuthProvider data-testId="auth-provider">
        <Outlet data-testId="outlet"/>
      </AuthProvider>
    </AlertProvider>
    
  )
};

export default AuthLayout;
