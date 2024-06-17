import React from "react"
import { Container, Row, Col } from "reactstrap";
import AggregateLeaderboard from "../../leaderboards/AggregateLeaderboard";

/**
 * A component that includes the leaderboard of a problem occurence.
 */
function ProblemOccurrenceLeaderboard({problemData, leaderboardData}) {
  return (
    <Container fluid className="ps-0 pt-2">
        <Row className="">
          <Col>
            <AggregateLeaderboard problemData={problemData} leaderboardData={leaderboardData}/>
          </Col>
        </Row>
    </Container>
  )
};

export default ProblemOccurrenceLeaderboard;
