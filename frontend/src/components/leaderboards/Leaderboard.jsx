import {React, useEffect, useState} from "react"
import { Container } from "reactstrap";
import './leaderboard.scss'

async function getRows() {
  return [
    { id:"1", rank:"1", userName:"John Doe", submissionName:"Foo Bar", metrics: {walkingTime:"1"}, submissionDate:"28-5-2024"},
    { id:"2", rank:"2", userName:"Jain Doe", submissionName:"Boe Bar", metrics: {walkingTime:"15"}, submissionDate:"28-5-2024"},
    { id:"3", rank:"3", userName:"John Smith", submissionName:"Foo Broom", metrics: {walkingTime:"0.3"}, submissionDate:"28-5-2024"}
  ];
}

function Leaderboard({problemData, rowLimit, showPagination}) {
  const [rows, setRows] = useState([]);
  
  //data fetching code
  useEffect(() => {
    
    const fetchRows = async () => {
      try {
        const data = await getRows();
        setRows(data);
      } catch(err) {
        console.error(err);
        //TODO proper error handling
      }
    }
    
    fetchRows();
  }, []);
  
  const scoringMetrics = [problemData.metrics]; //TODO this will be a list later but the backend isn't updated yet
  
  return (
    <Container fluid className='justify-content-center'>
      <table className='leaderboard-table'>
          <thead>
              <tr>
                  {/* These columns are always there */}
                  <th>Rank</th>
                  <th>User Name</th>
                  <th>Submission Name</th>
                  
                  {/* scoring metric columns */}
                  {scoringMetrics.map(scoringMetric => <th key={scoringMetric}>{scoringMetric}</th>)}
                  
                  {/* Other standard columns */}
                  <th>Submission Date</th>
                  <th className="download-cell">Download<br/>Solver</th>
                  <th className="download-cell">Download<br/>Solutions</th>
                  <th className="download-cell">Download<br/>Scores</th>
              </tr>
          </thead>
          <tbody>
            
            {rows.map(row => <LeaderboardRow data={row} key={row.id} />)}
              
          </tbody>
      </table>
    </Container>
  )
};

/**
 * Component for a single row in the leaderboard
 * 
 * @param {data} param0 data prop
 * @returns component for a single row in the leaderboard
 */
function LeaderboardRow({data}) {
  //prefix strings for the id's of submission rows and collapsables
  const SUBMISSION_ID_PREFIX = "submission-";
  const PROBLEM_INSTANCES_ID_PREFIX = "problem-instances-";
  
  //handle toggling the problem instances for a single submission
  function handleToggleSubmissionRow(e) {
    const foldContainer = document.getElementById(PROBLEM_INSTANCES_ID_PREFIX + data.id);
    
    //toggle the display classes
    foldContainer.classList.toggle("fold-open");
    foldContainer.classList.toggle("fold-closed");
  }
  
  //download submission handler
  function handleDownloadSolverClick(e) {
    e.stopPropagation();
    alert("download solver");
  }
  
  //download solutions handler
  function handleDownloadSolutionsClick(e) {
    e.stopPropagation();
    alert("download solutions");
  }
  
  //download scores handler
  function handleDownloadScoresClick(e) {
    e.stopPropagation();
    alert("download scores");
  }
  
  //download specific solution handler
  function handleDownloadSingleSolutionClick(e) {
    e.stopPropagation();
    alert("download single solution");
  }
  
  //visualize problem instance handler
  function handleVisualizePiClick(e) {
    e.stopPropagation();
    alert("visualize");
  }
  
  return (
    <>
      <tr onClick={handleToggleSubmissionRow} id={SUBMISSION_ID_PREFIX + data.id} className="view">
        <td>{data.rank}</td>
        <td>{data.userName}</td>
        <td>{data.submissionName}</td>
        
        {/* TODO map metrics to columns */}
        <td className="seconds">{data.metrics.walkingTime}</td>
        
        
        {/* <td className="seconds">1.00</td> */}
        <td>{data.submissionDate}</td>
        <td className="download-cell"><i role="button" onClick={handleDownloadSolverClick} className="bi-download" /></td>
        <td className="download-cell"><i role="button" onClick={handleDownloadSolutionsClick} className="bi-download" /></td>
        <td className="download-cell"><i role="button" onClick={handleDownloadScoresClick} className="bi-download" /></td>
      </tr>
      
      <tr id={PROBLEM_INSTANCES_ID_PREFIX + data.id} className="fold-closed">
        <td colSpan="8" className="fold-container">
          <div className="fold-content">
            <table className="pi-table">
              <thead>
                <tr>
                  {/* TODO: do this stuff once we know how the problem instances are done etc */}
                  <th>Instance Name</th>
                  <th>Walking Time</th>
                  <th>N</th>
                  <th>K</th>
                  <th>Q</th>
                  <th className="download-cell">Download<br/>Solution</th>
                  <th className="download-cell">Visualize</th>
                </tr>
              </thead>
              <tbody>
                <tr className="view">
                  <td>A-n32-k5</td>
                  <td className="seconds">15</td>
                  <td>4</td>
                  <td>121</td>
                  <td>430</td>
                  <td className="download-cell"><i onClick={handleDownloadSingleSolutionClick} role="button" className="bi-download"/></td>
                  <td className="download-cell"><i onClick={handleVisualizePiClick} role="button" className="bi-eye"/></td>
                </tr>
                <tr className="view">
                  <td>A-n64-k3</td>
                  <td className="seconds">5</td>
                  <td>4</td>
                  <td>121</td>
                  <td>43</td>
                  <td className="download-cell"><i onClick={handleDownloadSingleSolutionClick} role="button" className="bi-download"/></td>
                  <td className="download-cell"><i onClick={handleVisualizePiClick} role="button" className="bi-eye"/></td>
                </tr>
              </tbody>
            </table>
          </div>
        </td>
      </tr>
    </>
  )
};



export default Leaderboard;