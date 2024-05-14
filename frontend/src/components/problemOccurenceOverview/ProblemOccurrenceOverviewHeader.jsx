import React from "react"
import { Container, Row, Col } from 'reactstrap'

function ProblemOccurrenceOverviewHeader() {
  return (
    <Container fluid className="bg-primary mt-4">
        <Row className="justify-content-center">
          <Col className='text-light' xs="1"></Col> {/* Intentionally empty col */}
          <Col className='text-light align-self-start' xs="1"><p>Contest</p></Col>
          <Col className='text-light text-center py-5' xs="8">
            <h1>Traveling Salesman Problem</h1>
          </Col>
          <Col className='text-light align-self-end' xs="1"><p>time stuff</p></Col>
          <Col className='text-light' xs="1"></Col> {/* Intentionally empty col */}
        </Row>
        <Row className="align-items-center">
          <Col className='text-light' xs="1">
            <p>Description</p>
          </Col>
          <Col className='bg-light text-dark text-center'>
            <p>1 second variant</p>
          </Col>
          <Col className='text-light' xs="1">
            <p>upload</p>
          </Col>
        </Row>
    </Container>
  )
};

export default ProblemOccurrenceOverviewHeader;
