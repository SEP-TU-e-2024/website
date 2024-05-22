import React from "react"
import { Container, Row, Col } from "reactstrap";

/**
 * A component for giving more details about a problem occurrence.
 */
function ProblemOccurrenceDetails() {
  return (
    <Container className="ps-0 pt-2">
        <Row className="">
          <Col>
            <p>More details about the problem and the run settings</p>
          </Col>
        </Row>
    </Container>
  )
};

export default ProblemOccurrenceDetails;
