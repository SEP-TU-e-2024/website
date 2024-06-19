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
    {name:"Cristian Fildan", email:"c.fildan@student.tue.nl"},
    {name:"Vlad Haţegan", email:"v.hategan@student.tue.nl"},
    {name:"Tom Nagel", email:"t.m.j.nagel@student.tue.nl"},
    {name:"Marnik den Ouden", email:"m.r.d.ouden@student.tue.nl"},
    {name:"Ronald den Ouden", email:"r.m.d.ouden@student.tue.nl"},
    {name:"Teun Peters", email:"t.peters1@student.tue.nl"},
    {name:"Rijkman Pilaar", email:"r.pilaar@student.tue.nl"},
    {name:"Andrei Tudor Popescu", email:"a.popescu1@student.tue.nl"},
    {name:"Boris Sanders", email:"b.n.c.sanders@student.tue.nl"},
    {name:"Evy Zandbelt", email:"e.t.s.zandbelt@student.tue.nl"},
  ];
  
  return (
    <Container className="pt-4">
      <Row>
        <h1 className="text-primary">About</h1>
      </Row>
      <Row>
        <p>BenchLab is a platform where researchers can benchmark their optimization problem algorithms and 
          solutions. BenchLab has been developed for ORTEC as part of a bachelor end project for Computer Science and 
          Engineering at the Eindhoven University of Technology. 
          <br/><br/> {/* Double break to separate paragraphs for improved readability */}
          The platform shows a range of specified problems to view or submit to. An account is not required 
          to make submissions; it is also possible to only enter an email address for validation when making 
          a submission. There are two types of specified problems: problem instances, consisting of a single 
          benchmark instance, and problem occurrences, consisting of a set of problem instances. Users can 
          evaluate their algorithms by making code submissions to problem occurrences, or make solution 
          submissions to a specific problem instance if they think they found a new Best Known Solution for 
          that instance. BenchLab provides an environment for these evaluations to be run by validators and 
          display their results. A submission must adhere to the problem's evaluation settings, such as number 
          of CPUs, runtime or memory limit.
          <br/><br/>
          Submissions are ranked on leaderboards based on their score, which is computed during evaluation. Some 
          submissions and their results can be downloaded for manual evaluation as well. That way, BenchLab facilitates 
          easy and transparent benchmarking and comparison of algorithms and solutions. 
          <br/><br/>
          It is also possible to use the platform to host competitions, in which case certain data on its
          submissions' performance is hidden but the leaderboard is still shown. New specified problems can be 
          added to the platform by admins, providing info on the problem, evaluation settings and the code to 
          evaluate submissions for this specified problem.
        </p>
      </Row>
      
      <Row>
        <h3 className="text-primary">Evaluation Environment</h3>
      </Row>
      <Row>
        <p>When the user uploads code to BenchLab, the system will spin up an isolated docker container. Thus, 
          the submission will be run in a controlled environment. Using the custom-developed IOModule, both static 
          and interactive validators can communicate with the code submission. For further information on the setup 
          of a submission, check the example submission found on the submission tab of a specified problem.
          category page.</p>
      </Row>
      
      <Row>
        <h3 className="text-primary">Contact</h3>
      </Row>
      <Row>
        <p>If you have any request, remarks or bug reports, please make an issue on the <a href="https://github.com/SEP-TU-e-2024/website" target="_blank">GitHub repository</a>
        <br></br>
        The platform is maintained by <a href="mailto:wouter.kool@ortec.com?subject=BenchLab" target="_blank">Wouter Kool</a> (2024-present).
        </p>
      </Row>
      <Row>
        <p> The platform was set up in 2024 by:
        <ul className="text-primary">
          {devContactInfo.map((dev) => (<ContactListing name={dev.name} />))}
        </ul>
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