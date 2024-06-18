import React, {useState} from "react"
import { Container, Row, Col } from "reactstrap";
import InstanceLeaderboard from "../../leaderboards/InstanceLeaderboard";
/**
 * A component for listing the problem instances included in a problem occurence.
 */
function ProblemOccurrenceProblemInstanceList({problemData, leaderboardData}) {
  const [selectedInstance, setSelectedInstance] = useState(0);

  const handleInstanceChange = (event) => {
    setSelectedInstance(event.target.value);
  };

  return (
    <Container className="ps-0 pt-2">
        <Row className="">
          <Col>
            <select onChange={handleInstanceChange} value={selectedInstance}>
              {problemData.benchmark_instances.map((instance, index) => (
                <option key={index} value={index}> {instance.id} </option>
              ))}
            </select>
            <InstanceLeaderboard instance={selectedInstance} leaderboardData={leaderboardData} problemData={problemData}/>
          </Col>
        </Row>
    </Container>
  )
};

export default ProblemOccurrenceProblemInstanceList;
