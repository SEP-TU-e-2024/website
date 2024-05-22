import React from "react"
import { Container, Row, Col } from "reactstrap";
import Submit from '../../submit/Submit';

/**
 * A component for the description/overview of a single problem occurence. 
 * This component will include a short description of the problem, the run settings, a top x leaderboard and a submission form.
 */
function ProblemOccurrenceDescription() {
  return (
    <Container className="ps-0 pt-2">
        <Row className="border">
          <Col>
            <p>The Traveling Salesman Problem is graph problem where the objective is to find a minimal cost simple tour of the vertices.</p>
          </Col>
        </Row>
        <Row className="border">
          <Col>
            <p>The run settings are: ...</p>
          </Col>
        </Row>
        <Row className="border">
          <Col>
            <p>Imagine some cool submit from here</p>
            <Submit />
          </Col>
        </Row>
        <Row className="border">
          <Col>
            <p>Imagine a super cool leaderboard here</p>
          </Col>
        </Row>
    </Container>
  )
};

export default ProblemOccurrenceDescription;
