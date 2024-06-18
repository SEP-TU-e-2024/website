import React from "react"
import "./Footer.scss";
import { Container, Row, Col } from "reactstrap";
import { Navigate, useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();
  
  return (
    <footer>
      <Container className="justify-content-end">
        {/* <Row className="justify-content-end">
          <Col className=""> */}
            <a role="button" onClick={() => navigate("/about")}><i className="bi-info-circle" /> About</a>
          {/* </Col>
        </Row> */}
      </Container>
    </footer>
  )
};

export default Footer;
