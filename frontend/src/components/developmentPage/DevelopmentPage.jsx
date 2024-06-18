import { Container, Row, Col } from 'reactstrap'

function DevelopmentPage() {
    return (
        <div>
            <Container fluid className="bg-primary mt-4">
                <Row className="justify-content-center">
                    <Col xs="2"></Col> {/* Intentionally empty col */}
                    <Col className='text-light text-center py-5' xs="8">
                        <h1 className="fw-bold">In development</h1>
                    </Col>
                    <Col xs="2"></Col> {/* Intentionally empty col */}
                </Row>
                <Row className="align-items-center">
                    <Col className='bg-white border-dark border text-dark text-center'>
                        <h5 className="fw-bold">This is a feature that is still being worked on</h5>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default DevelopmentPage;

