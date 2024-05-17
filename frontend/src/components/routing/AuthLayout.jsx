import React from "react"
import { AuthProvider } from "../../context/AuthContext";
import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  )
};

export default AuthLayout;
