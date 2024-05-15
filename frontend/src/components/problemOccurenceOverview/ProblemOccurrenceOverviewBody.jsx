import {React, useState } from "react"
import { Container, Nav, NavItem, NavLink, TabContent, TabPane, Col, Row } from "reactstrap"
import ProblemOccurrenceDescription from "./contents/ProblemOccurrenceDescription";
import ProblemOccurrenceLeaderboard from "./contents/ProblemOccurrenceLeaderboard";
import ProblemOccurrenceProblemInstanceList from "./contents/ProblemOccurrenceProblemInstanceList";
import ProblemOccurrenceDetails from "./contents/ProblemOccurrenceDetails";

function ProblemOccurrenceOverviewBody() {
  const [currentTab, setCurrentTab] = useState("2");
  
  function handleTabSwitch(e) {
    setCurrentTab(e.target.id);
    // e.target.classList.add("active");
    console.log(e.target.id);
  }
  
  return (
    <Container fluid className="py-3 px-0">
      
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
      
      <TabContent activeTab={currentTab}>
        <TabPane tabId="1">
          <ProblemOccurrenceDescription />
        </TabPane>
        <TabPane tabId="2">
          <ProblemOccurrenceLeaderboard />
        </TabPane>
        <TabPane tabId="3">
          <ProblemOccurrenceDetails />
        </TabPane>
        <TabPane tabId="4">
          <ProblemOccurrenceProblemInstanceList />
        </TabPane>
      </TabContent>
    </Container>
  )
};

export default ProblemOccurrenceOverviewBody;
