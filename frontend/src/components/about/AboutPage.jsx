import React from "react"
import { Container, Row } from "reactstrap"

/**
 * Benchlab about page.
 * 
 * @returns About page component
 */
function Aboutpage() {
  
  const devContactInfo = [
    {name:"Thijs Egberts", email:"t.t.a.egberts@student.tue.nl"},
    {name:"Dev 2", email:"dev2@student.tue.nl"},
    {name:"Dev 3", email:"dev3@student.tue.nl"},
    {name:"Dev 4", email:"dev4@student.tue.nl"},
    {name:"Dev 5", email:"dev5@student.tue.nl"},
    {name:"Dev 6", email:"dev6@student.tue.nl"},
    {name:"Dev 7", email:"dev7@student.tue.nl"},
    {name:"Dev 8", email:"dev8@student.tue.nl"},
    {name:"Dev 9", email:"dev9@student.tue.nl"},
    {name:"Dev 10", email:"dev10@student.tue.nl"},
    {name:"Dev 11", email:"dev11@student.tue.nl"},
  ];
  
  return (
    <Container className="pt-4">
      <Row>
        <h1 className="text-primary">About</h1>
      </Row>
      <Row>
        <p>Benchlab is a platform where researchers can benchmark their optimization problem algorithms. Benchlab has been developed as part of a computer science and engineering bachelor end project at the Eindhoven university of technology.</p>
      </Row>
      
      <Row>
        <h3 className="text-primary">Platform</h3>
      </Row>
      <Row>
        <p>Platform description here (ask backend team)</p>
      </Row>
      
      <Row>
        <h3 className="text-primary">Runtime Environment</h3>
      </Row>
      <Row>
        <p>Runtime Environment description here (ask backend team)</p>
      </Row>
      
      <Row>
        <h3 className="text-primary">Contact</h3>
      </Row>
      <Row>
        <p>If you have any request, remarks or bug reports, please make an issue on the <a>github repository</a> or contact one of the developers below:
        <br /> <br />
        <ul className="text-primary">
          {devContactInfo.map((dev) => (<ContactListing name={dev.name} email={dev.email} />))}
        </ul>
        Elsewise it is also possible to contact the client, ORTEC via their <a href="https://ortec.com/" target="_blank">website</a>.
        </p>
      </Row>
    </Container>
  )
};

export default Aboutpage;

/**
 * Listing of a name and email address.
 * 
 * @param {email,name} param0 Email address and name of the person in the listing
 * @returns <li> element with the name and an mailto: link
 */
function ContactListing({email, name}) {
  return (
    <li className="text-black">{name} <a href={"mailto:" + email + "?subject=Benchlab"}>{email}</a></li>
  )
};