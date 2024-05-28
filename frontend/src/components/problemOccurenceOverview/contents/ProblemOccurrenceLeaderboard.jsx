import React from "react"
import { Container, Row, Col } from "reactstrap";
import TSPLeaderboard from "../../leaderboards/TSPLeaderboard";

/**
 * A component that includes the leaderboard of a problem occurence.
 */
function ProblemOccurrenceLeaderboard({problemData}) {
  return (
    <Container className="ps-0 pt-2">
        <Row className="">
          <Col>
            <TSPLeaderboard problemData={problemData}/>
          </Col>
        </Row>
    </Container>
  )
};

export default ProblemOccurrenceLeaderboard;
