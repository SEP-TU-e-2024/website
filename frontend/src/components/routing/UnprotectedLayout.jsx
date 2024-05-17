import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import React from 'react';
import AuthContext from "../../context/AuthContext";
import MyNavbar from "../navbar/MyNavbar";
import { Container } from "reactstrap";

/**
 * This component is a wrapper for the pages that you don't need to be logged in for
 */
const UnProtectedLayout = () => {
    return (
        <>
          <MyNavbar />
          <Container>
            <Outlet />
          </Container>
        </>
    )
  };

export default UnProtectedLayout;
