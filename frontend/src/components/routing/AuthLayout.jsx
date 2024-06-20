import React from "react"
import { AuthProvider } from "../../context/AuthContext";
import { Outlet } from "react-router-dom";

/**
 * Wrapper to child elements access to the authprovider context.
 */
function AuthLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  )
};

export default AuthLayout;
