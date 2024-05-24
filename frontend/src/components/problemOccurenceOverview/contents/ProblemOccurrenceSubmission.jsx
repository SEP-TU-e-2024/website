import React from "react"
import { Container, Row, Col } from "reactstrap";
import Submit from "../../submit/Submit";

/**
 * A component for giving more details about a problem occurrence.
 */
function ProblemOccurrenceSubmission() {
  return (
    <Container className="ps-0 pt-2">
        <Row className="">
          <Col>
            <Submit/>
          </Col>
        </Row>
    </Container>
  )
};

export default ProblemOccurrenceSubmission;
