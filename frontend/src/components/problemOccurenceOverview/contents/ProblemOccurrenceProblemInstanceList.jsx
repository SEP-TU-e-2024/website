import React, {useState} from "react"
import { Container, Row, Col } from "reactstrap";
import InstanceLeaderboard from "../../leaderboards/InstanceLeaderboard";
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
            
            <table>
              <tbody>
                {problemData.benchmark_instances.map((instance, index) => (
                  
                  // The console cries about this being a div in a table but just ignore that.
                  <InstanceLeaderboardInstanceEntry instance={instance} instanceIndex={index} leaderboardData={leaderboardData} problemData={problemData}/>
                ))}
              </tbody>
            </table>
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
      <tr onClick={handleLeaderboardToggle}>
        <td>{"Instance name will come here " + instance.id}</td>
      </tr>
      <tr style={leaderboardOpen ? {display:"table-row"} : {display:"none"}}>
        <InstanceLeaderboard instance={instanceIndex} leaderboardData={leaderboardData} problemData={problemData} />
      </tr>
    </>
  )
};

export default ProblemOccurrenceProblemInstanceList;
