import React from "react"
import { Container, Row, Col } from "reactstrap";
import Submit from "../../submit/Submit";
import '../ProblemOccurrrenceOverviewBody.scss'

/**
 * A component for giving more details about a problem occurrence.
 */
function ProblemOccurrenceSubmission({problemData}) {
  return (
    <Container className="ps-0 pt-2">
        <Row className="justify-content-center">
          <Col className='text-center' xs="8">
            { 
              problemData.category.example_submission_url ? 
              <p>{problemData.category.name} <a href={problemData.category.example_submission_url}>Example Submission</a></p> : <></>  
            }
            <Submit/>
          </Col>
        </Row>
    </Container>
  )
};

export default ProblemOccurrenceSubmission;
