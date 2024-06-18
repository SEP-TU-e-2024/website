import React from "react"
import "./Footer.scss";
import { Container, Row, Col } from "reactstrap";
import { Navigate, useNavigate } from "react-router-dom";

/**
 * Footer component with a link to the about page.
 * 
 * @returns Footer component
 */
function Footer() {
  const navigate = useNavigate();
  
  return (
    <footer>
      <Container className="justify-content-end">
        <a role="button" onClick={() => navigate("/about")}><i className="bi-info-circle" /> About</a>
      </Container>
    </footer>
  )
};

export default Footer;
