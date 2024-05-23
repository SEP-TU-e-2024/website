import React from "react"
import { Container, Row, Col } from "reactstrap";

/**
 * A component for the description/overview of a single problem occurence. 
 * This component will include a short description of the problem, the run settings, a top x leaderboard and a submission form.
 */
function ProblemOccurrenceDescription({problemData}) {
  return (
    <Container className="ps-0 pt-2">
        <Row className="">
          <Col>
            <p>{problemData.category.description}</p>
          </Col>
        </Row>
    </Container>
  )
};

export default ProblemOccurrenceDescription;
