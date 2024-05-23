import React from "react"
import { Container, Row, Col } from 'reactstrap'

/**
 * Component of the header of a problem occurence overview page.
 * This UI might change quite a bit depending on what wouter likes
 */
function ProblemOccurrenceOverviewHeader({problemData}) {
  
  return (
    <Container fluid className="bg-primary mt-4">
        <Row className="justify-content-center">
          <Col xs="2"></Col> {/* Intentionally empty col */}
          <Col className='text-light text-center py-5' xs="8">
            <h1 className="fw-bold">{problemData.category.name}</h1>
          </Col>
          <Col xs="2" className="align-self-end text-end text-light fw-bold">
            <Row><Col>1/day <i className="bi-cloud-upload" /></Col></Row>
            <Row><Col>1d 20h 40m <i className="bi-clock" /></Col></Row>
          </Col> 
        </Row>
        <Row className="align-items-center">
          {/* <Col className='text-light' xs="1">
            <p>Description</p>
          </Col> */}
          <Col className='bg-white border-dark border text-dark text-center'>
            <h5 className="fw-bold">{problemData.evaluation_settings.time_limit} second, {problemData.evaluation_settings.cpu} CPU variation</h5>
          </Col>
          {/* <Col className='text-light' xs="1">
            <p>upload</p>
          </Col> */}
        </Row>
    </Container>
  )
};

export default ProblemOccurrenceOverviewHeader;
