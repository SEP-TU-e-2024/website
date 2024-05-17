import React from "react"
import { useRouteError } from "react-router-dom";

function ErrorPage() {
  const error = useRouteError();
  console.error(error);
  
  return (
    <Container fluid>
        <Row>
            <Col className='text-center'>
                <h1>Oops</h1>
                <p>Sorry, an unexpected error occured</p>
                <p>
                    <i>
                        {error.statusText || error.message}
                    </i>
                </p>
            </Col>
        </Row>
    </Container>
  )
};

export default ErrorPage;
