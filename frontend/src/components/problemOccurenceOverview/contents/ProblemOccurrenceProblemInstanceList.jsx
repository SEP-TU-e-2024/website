import React, {useState} from "react"
import { Container, Row, Col } from "reactstrap";
import InstanceLeaderboard from "../../leaderboards/InstanceLeaderboard";

import "./ProblemOccurrenceProblemInstanceList.scss";

/**
 * A component for listing the problem instances included in a problem occurence.
 */
function ProblemOccurrenceProblemInstanceList({problemData, leaderboardData}) {
  // const [selectedInstance, setSelectedInstance] = useState(0);

  // const handleInstanceChange = (event) => {
  //   setSelectedInstance(event.target.value);
  // };

  return (
    <Container className="ps-0 pt-2">
        <Row className="">
          <Col>
            {/* <select onChange={handleInstanceChange} value={selectedInstance}>
              {problemData.benchmark_instances.map((instance, index) => (
                <option key={index} value={index}> {instance.id} </option>
              ))}
            </select>
            <InstanceLeaderboard instance={selectedInstance} leaderboardData={leaderboardData} problemData={problemData}/> */}
            <Container fluid className="justify-content-center">
              <table id="problem-instance-table">
                <thead>
                  <tr>
                    <th>Problem instance name</th>
                  </tr>
                </thead>
                <tbody>
                  {problemData.benchmark_instances.length == 0 ? 
                  <tr><td align="center" className="text-danger">No entries found</td></tr>
                  :
                  problemData.benchmark_instances.map((instance, index) => (
                    // The console cries about this being a div in a table but just ignore that.
                    <InstanceLeaderboardInstanceEntry instance={instance} instanceIndex={index} leaderboardData={leaderboardData} problemData={problemData}/>
                    ))}
                </tbody>
              </table>
            </Container>
          </Col>
        </Row>
    </Container>
  )
};

function InstanceLeaderboardInstanceEntry({instance, instanceIndex, leaderboardData, problemData}) {
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  
  const handleLeaderboardToggle = (event) => {
    setLeaderboardOpen(!leaderboardOpen);
  };
  
  return (
    <>
      <tr className="instance-button" onClick={handleLeaderboardToggle} role="button">
        <td>{instance.id}</td>
      </tr>
      <tr className="instance-container" style={leaderboardOpen ? {display:"table-row"} : {display:"none"}}>
        <td>
          <InstanceLeaderboard instance={instanceIndex} leaderboardData={leaderboardData} problemData={problemData} />
        </td>
      </tr>
    </>
  )
};

export default ProblemOccurrenceProblemInstanceList;
