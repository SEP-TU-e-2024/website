import React from "react"
import { Container, Row, Col } from "reactstrap";
import Leaderboard from "../../leaderboards/Leaderboard";

/**
 * A component that includes the leaderboard of a problem occurence.
 */
function ProblemOccurrenceLeaderboard({problemData, leaderboardData}) {
  return (
    <Container fluid className="ps-0 pt-2">
        <Row className="">
          <Col>
            <Leaderboard problemData={problemData} leaderboardData={leaderboardData}/>
          </Col>
        </Row>
    </Container>
  )
};

export default ProblemOccurrenceLeaderboard;
