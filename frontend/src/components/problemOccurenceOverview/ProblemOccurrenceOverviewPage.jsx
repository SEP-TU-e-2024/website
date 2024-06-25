import {React, useState, useEffect} from "react"
import api from "../../api";
import { useLoaderData } from "react-router-dom";
import { Container, Row, Col, TabContent, TabPane } from 'reactstrap'
import ProblemOccurrenceDescription from "./contents/ProblemOccurrenceDescription";
import ProblemOccurrenceLeaderboard from "./contents/ProblemOccurrenceLeaderboard";
import ProblemOccurrenceProblemInstanceList from "./contents/ProblemOccurrenceProblemInstanceList";
import ProblemOccurrenceSubmission from "./contents/ProblemOccurrenceSubmission";
import './ProblemOccurrrenceOverviewBody.scss';
import { useAlert } from "../../context/AlertContext";

/**
 * Async function to fetch the leaderboard data from the backend
 * @returns response data
 */
async function getLeaderboardData(problemId, showAlert) {
  try {
    const response = await api.get(`/leaderboard/${problemId}`);
    return response.data;
  } catch (error) {
    if (error.response.status == 401) {
      showAlert("Unauthorized to access this content", "error");
    } else if (error.response.status == 404) {
      showAlert("Problem not found", "error")
    } else if (error.response.status == 500) {
      showAlert("Something went wrong on the server", "error")
    }
    console.error(error);
  }
}

/**
 * Page component for a problem occurence overview.
 */
function ProblemOccurrenceOverviewPage() {
  const problemData = useLoaderData();//it returns an array because we use the same endpoint as for the list of problem occurrences
  const [currentTab, setCurrentTab] = useState("1");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  let { showAlert } = useAlert();
  
  useEffect(() => {
    
    const fetchLeaderboardData = async () => {
      try {
        const data = await getLeaderboardData(problemData.id, showAlert);
        const entries = data.entries.concat(data.unranked_entries)        
        setEntries(entries);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
      //TODO proper error handling
    }
    fetchLeaderboardData();
  }, []);

  if (problemData == null) {
    //somewhat janky error handling but there isn't really any other exception that is thrown somewhere
    showAlert("Problem with fetching the requested data from db");
    return <div>No data found</div>
  }
  
  //Handle the tab switch by setting the currentTab state to the id of the tab that is clicked
  function handleTabSwitch(e) {
    setCurrentTab(e.target.id);
  }
  
  return (
    <div>
      <Container fluid className="bg-primary mt-4">
        <Row className="justify-content-center">
          <Col xs="2"></Col> {/* Intentionally empty col */}
          <Col className='text-light text-center py-5' xs="8">
            <h1 className="fw-bold">{problemData.name}</h1>
          </Col>
          <Col xs="2" className="align-self-end text-end text-light fw-bold">
            {/* TODO: Implement 
            <Row><Col>1/day<i className="bi-cloud-upload" /></Col></Row>
            <Row><Col>1d 20h 40m <i className="bi-clock" /></Col></Row> 
            */}
          </Col> 
        </Row>
        <Row className="align-items-center">
          <Col className='bg-white border-dark border text-dark text-center'>
            <h5 className="fw-bold">{problemData.category.name} :  {problemData.evaluation_settings.time_limit} second, {problemData.evaluation_settings.memory} MB Memory, {problemData.evaluation_settings.cpu} CPU variation</h5>
          </Col>
        </Row>
      </Container>
    
      <Container fluid className="py-3">
      <Row>
        <Col xs="1"></Col> {/* Intentionally empty col */}
        <Col>
          <ul id="" className="tab-selector">
            <li className="tab-selector-item">
              <a role="button" className={currentTab == "1" ? "active tab-selector-link": "tab-selector-link"} /*active={currentTab == "1"}*/ id="1" onClick={handleTabSwitch}>
                Overview
              </a>
            </li>
            <li className="tab-selector-item">
              <a role="button" className={currentTab == "2" ? "active tab-selector-link": "tab-selector-link"} /*active={currentTab == "2"}*/ id="2" onClick={handleTabSwitch}>
                Leaderboard
              </a>
            </li>
            <li className="tab-selector-item">
              <a role="button" className={currentTab == "3" ? "active tab-selector-link": "tab-selector-link"} /*active={currentTab == "3"}*/ id="3" onClick={handleTabSwitch}>
                Submission
              </a>
            </li>
            
            {/* Hide this tab if the problem is a competition style problem */}
            {problemData.category.style != 0 ? 
              <li className="tab-selector-item">
                <a role="button" className={currentTab == "4" ? "active tab-selector-link": "tab-selector-link"} /*active={currentTab == "4"}*/ id="4" onClick={handleTabSwitch}>
                  Problem instances
                </a>
              </li>
            : 
              <></>}
          </ul>
          
          {/* Actual content of the tabs */}
          <TabContent activeTab={currentTab}>
            <TabPane tabId="1">
              {!loading ? (<ProblemOccurrenceDescription problemData={problemData} leaderboardData={entries}/>) : <div>Loading...</div>}
            </TabPane>
            <TabPane tabId="2">
              {!loading ? (<ProblemOccurrenceLeaderboard problemData={problemData} leaderboardData={entries}/>) : <div>Loading...</div>}
            </TabPane>
            <TabPane tabId="3">
              <ProblemOccurrenceSubmission problemData={problemData}/>
            </TabPane>
            
            {/* if category.style is 0 it is a comp problem */}
            {problemData.category.style != 0 ? 
              <TabPane tabId="4">
                {!loading ? (<ProblemOccurrenceProblemInstanceList problemData={problemData} leaderboardData={entries}/>) : <div>Loading...</div>} 
              </TabPane>
            :
              <></>
            }   
          </TabContent>
        </Col>
        
        <Col xs="1"></Col> {/* Intentionally empty col */}
      </Row>
    </Container>
    </div>
  )
};


/**
 * Async function to fetch the problem occurrence data from the backend
 * @returns response data
 */
export async function getPOInfo(problemOccurrenceID) {
  try {
    const response = await api.get(`problems/problem_occurrence/${problemOccurrenceID}`);
    return response.data; 
  } catch(error) {
    // Can not change alerts to showAlert due to this not being react component
    if (error.response.status == 401) {
      alert("Unauthorized to access this content", "error");
    } else if (error.response.status == 404) {
      alert("No problem categories not found", "error")
    } else if (error.response.status == 500) {
      alert("Something went wrong on the server", "error")
    }
    console.log(error)
  }
}

export default ProblemOccurrenceOverviewPage;
