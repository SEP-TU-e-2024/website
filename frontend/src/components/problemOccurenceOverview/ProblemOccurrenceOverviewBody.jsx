import {React, useState } from "react"
import { Container, Nav, NavItem, NavLink, TabContent, TabPane, Col, Row } from "reactstrap"
import ProblemOccurrenceDescription from "./contents/ProblemOccurrenceDescription";
import ProblemOccurrenceLeaderboard from "./contents/ProblemOccurrenceLeaderboard";
import ProblemOccurrenceProblemInstanceList from "./contents/ProblemOccurrenceProblemInstanceList";
import ProblemOccurrenceDetails from "./contents/ProblemOccurrenceDetails";

/**
 * A component of the body of a problem occurence overview page.
 * Contains tabs for different parts of the overview
 */
function ProblemOccurrenceOverviewBody() {
  const [currentTab, setCurrentTab] = useState("1");
  
  //Handle the tab switch by setting the currentTab state to the id of the tab that is clicked
  function handleTabSwitch(e) {
    setCurrentTab(e.target.id);
  }
  
  return (
    <Container fluid className="py-3 px-0">
      
      {/* Used a normal ul instead of a reactstrap Nav component because reactstrap doesn't support underlined nav */}
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
      
      {/* Actual content of the tabs */}
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
