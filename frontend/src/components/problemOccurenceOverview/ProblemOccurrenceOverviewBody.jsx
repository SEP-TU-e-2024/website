import {React, useState } from "react"
import { Container, Nav, NavItem, NavLink, TabContent, TabPane, Col, Row } from "reactstrap"

function ProblemOccurrenceOverviewBody() {
  const [currentTab, setCurrentTab] = useState("2");
  
  function handleTabSwitch(e) {
    setCurrentTab(e.target.id);
    // e.target.classList.add("active");
    console.log(e.target.id);
  }
  
  return (
    <Container fluid className="py-3">
      
      <ul id="bootstrap-override" className="nav nav-underline">
        <NavItem>
          <NavLink active={currentTab == "1"} id="1" onClick={handleTabSwitch}>
            Overview
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={currentTab == "2"} id="2" onClick={handleTabSwitch}>
            Full leaderboard
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={currentTab == "3"} id="3" onClick={handleTabSwitch}>
            Detailed description
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={currentTab == "4"} id="4" onClick={handleTabSwitch}>
            Problem instances
          </NavLink>
        </NavItem>
      </ul>
      {/* <Nav tabs vertical={false}>
        <NavItem>
          <NavLink active={currentTab == "1"} id="1" onClick={handleTabSwitch}>
            Description
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={currentTab == "2"} id="2" onClick={handleTabSwitch}>
            Leaderboard
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={currentTab == "3"} id="3" onClick={handleTabSwitch}>
            Submission
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={currentTab == "4"} id="4" onClick={handleTabSwitch}>
            Problem instances
          </NavLink>
        </NavItem>
      </Nav> */}
      
      <TabContent activeTab={currentTab}>
        <TabPane tabId="1">
          <Row>
            <Col sm="12">
              <p>The description of TSP will go here</p>
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId="2">
          <Row>
            <Col sm="12">
              <p>Imagine a very nice leaderboard here</p>
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId="3">
          <Row>
            <Col sm="12">
              <p>Submission can be done here</p>
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId="4">
          <Row>
            <Col sm="12">
              <p>An overview of the problem instances in this problem occurence</p>
            </Col>
          </Row>
        </TabPane>
      </TabContent>
    </Container>
  )
};

export default ProblemOccurrenceOverviewBody;
