import React from "react"
import { Container, Row, Col } from "reactstrap";

/**
 * A component that includes the leaderboard of a problem occurence.
 */
function ProblemOccurrenceLeaderboard() {
  return (
    <Container className="ps-0 pt-2">
        <Row className="">
          <Col>
            <p>The leaderboard can go here.</p>
          </Col>
        </Row>
    </Container>
  )
};

export default ProblemOccurrenceLeaderboard;
