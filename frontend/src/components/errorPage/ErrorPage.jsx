import React from "react"
import { useRouteError } from "react-router-dom";
import { Container } from "reactstrap";

function ErrorPage() {
  const error = useRouteError();
  console.error(error);
  
  return (
    <Container className="text-center">
      <h1>Oops</h1>
      <p>Sorry, an unexpected error occured</p>
      <p>
          <i>
              {error.statusText || error.message}
          </i>
      </p>
    </Container>
  )
};

export default ErrorPage;
