import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import React from 'react';
import AuthContext from "../../context/AuthContext";
import MyNavbar from "../navbar/MyNavbar";
import { Container } from "reactstrap";

/**
 * This component is a wrapper for the pages that you need to be logged in for
 * If the user is not authenticated, redirects to the login page.
 */
const ProtectedLayout = () => {
    let {user} = useContext(AuthContext)

    if (!user) {
      return <Navigate to="/login" />;
    }
    
    return (
        <>
          <MyNavbar />
          <Container>
            <Outlet />
          </Container>
        </>
    )
  };

export default ProtectedLayout;
