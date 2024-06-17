import React from "react"
import "./Footer.scss";
import { Container, Row, Col } from "reactstrap";

function Footer() {
  return (
    <footer>
      <Container>
        <Row>
          <Col className="ms-auto">
          <i className="bi-info-circle" /><a>About</a>
          </Col>
          <Col>
          </Col>
        </Row>
      </Container>
    </footer>
  )
};

export default Footer;
