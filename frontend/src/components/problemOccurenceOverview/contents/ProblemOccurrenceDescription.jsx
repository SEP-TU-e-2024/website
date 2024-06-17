import React from "react"
import { Container, Row, Col } from "reactstrap";
import AggregateLeaderboard from "../../leaderboards/AggregateLeaderboard";

/**
 * A component for the description/overview of a single problem occurence. 
 * This component will include a short description of the problem, the run settings, a top x leaderboard and a submission form.
 */
function ProblemOccurrenceDescription({problemData, leaderboardData}) {
  return (
    <Container className="ps-0 pt-2">
        <Row className="">
          <Col>
            <p>{problemData.category.description}</p>
            <AggregateLeaderboard problemData={problemData} leaderboardData={leaderboardData} rowLimit={5}/>
          </Col>
        </Row>
    </Container>
  )
};

export default ProblemOccurrenceDescription;