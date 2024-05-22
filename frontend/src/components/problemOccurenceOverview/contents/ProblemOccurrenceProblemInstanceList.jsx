import React from "react"
import { Container, Row, Col } from "reactstrap";

/**
 * A component for listing the problem instances included in a problem occurence.
 */
function ProblemOccurrenceProblemInstanceList() {
  return (
    <Container className="ps-0 pt-2">
        <Row className="">
          <Col>
            <p>An interactive list of the included problem instances</p>
          </Col>
        </Row>
    </Container>
  )
};

export default ProblemOccurrenceProblemInstanceList;
