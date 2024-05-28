import {React, useEffect, useState} from "react"
import { Container } from "reactstrap";
import './leaderboard.scss'

async function getRows() {
  return [];
}

function TSPLeaderboard({problemData, rowLimit, showPagination}) {
  //prefix strings for the id's of submission rows and collapsables
  const SUBMISSION_ID_PREFIX = "submission-";
  const PROBLEM_INSTANCES_ID_PREFIX = "problem-instances-";
  
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
  
  //handle toggling the problem instances for a single submission
  function handleToggleSubmissionRow(e) {
    //extracting the id of the submission
    const submissionId = e.currentTarget.id.substring(SUBMISSION_ID_PREFIX.length);
    const foldContainer = document.getElementById(PROBLEM_INSTANCES_ID_PREFIX + submissionId);
    
    //toggle the display classes
    foldContainer.classList.toggle("fold-open");
    foldContainer.classList.toggle("fold-closed");
    return false;
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
    <Container fluid className='justify-content-center'>
      <table className='leaderboard-table'>
          <thead>
              <tr>
                  {/* These columns are always there */}
                  <th>Rank</th>
                  <th>User Name</th>
                  <th>Submission Name</th>
                  
                  {/* scoring metric columns */}
                  {/* <th>Walking Time</th> */}
                  {scoringMetrics.map(scoringMetric => <th key={scoringMetric}>{scoringMetric}</th>)}
                  
                  {/* Other standard columns */}
                  <th>Submission Date</th>
                  <th className="download-cell">Download<br/>Solver</th>
                  <th className="download-cell">Download<br/>Solutions</th>
                  <th className="download-cell">Download<br/>Scores</th>
                  
{/*                   
                  {/* If there are column names provided, render them *
                  {!columnNames || columnNames.length <= 0 ? (
                      <th className='border-0'>No column names where specified</th>
                  ) : (
                      columnNames.map(colName => (
                          //maybe add a check somewhere that colname is a string
                          <th className='text-primary border-0'>{colName}</th>
                      ))
                  )} */}
              </tr>
          </thead>
          <tbody>
              <tr onClick={handleToggleSubmissionRow} id={SUBMISSION_ID_PREFIX + "1"} className="view">
                <td>1</td>
                <td>guicimodo</td>
                <td>Test</td>
                <td className="seconds">1.00</td>
                {/* <td className="seconds">1.00</td> */}
                <td>27-5-2024</td>
                <td className="download-cell"><i role="button" onClick={handleDownloadSolverClick} className="bi-download" /></td>
                <td className="download-cell"><i role="button" onClick={handleDownloadSolutionsClick} className="bi-download" /></td>
                <td className="download-cell"><i role="button" onClick={handleDownloadScoresClick} className="bi-download" /></td>
              </tr>
              
              <tr id={PROBLEM_INSTANCES_ID_PREFIX + "1"} className="fold-closed">
                <td colSpan="8" className="fold-container">
                  <div className="fold-content">
                    <table className="pi-table">
                      <thead>
                        <tr>
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
                          <td>A-n32-k5</td>
                          <td className="seconds">15</td>
                          <td>4</td>
                          <td>121</td>
                          <td>43</td>
                          <td className="download-cell"><i onClick={handleDownloadSingleSolutionClick} role="button" className="bi-download"/></td>
                          <td className="download-cell"><i onClick={handleVisualizePiClick} role="button" className="bi-eye"/></td>
                        </tr>
                        <tr className="view">
                          <td>A-n32-k5</td>
                          <td className="seconds">15</td>
                          <td>4</td>
                          <td>121</td>
                          <td>43</td>
                          <td className="download-cell"><i onClick={handleDownloadSingleSolutionClick} role="button" className="bi-download"/></td>
                          <td className="download-cell"><i onClick={handleVisualizePiClick} role="button" className="bi-eye"/></td>
                        </tr>
                        <tr className="view">
                          <td>A-n32-k5</td>
                          <td className="seconds">15</td>
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
              
              <tr onClick={handleToggleSubmissionRow} id={SUBMISSION_ID_PREFIX + "2"} className="view">
                <td>1</td>
                <td>guicimodo</td>
                <td>Test</td>
                <td className="seconds">1.00</td>
                <td>27-5-2024</td>
                <td className="download-cell"><i role="button" onClick={handleDownloadSolverClick} className="bi-download" /></td>
                <td className="download-cell"><i role="button" onClick={handleDownloadSolutionsClick} className="bi-download" /></td>
                <td className="download-cell"><i role="button" onClick={handleDownloadScoresClick} className="bi-download" /></td>
              </tr>
              
              <tr id={PROBLEM_INSTANCES_ID_PREFIX + "2"} className="fold-closed">
                <td colSpan="8" className="fold-container">
                  <div className="fold-content">
                    <table className="pi-table">
                      <thead>
                        <tr>
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
                          <td>43</td>
                          <td className="download-cell"><i onClick={handleDownloadSingleSolutionClick} role="button" className="bi-download"/></td>
                          <td className="download-cell"><i onClick={handleVisualizePiClick} role="button" className="bi-eye"/></td>
                        </tr>
                        <tr className="view">
                          <td>A-n32-k5</td>
                          <td className="seconds">15</td>
                          <td>4</td>
                          <td>121</td>
                          <td>43</td>
                          <td className="download-cell"><i onClick={handleDownloadSingleSolutionClick} role="button" className="bi-download"/></td>
                          <td className="download-cell"><i onClick={handleVisualizePiClick} role="button" className="bi-eye"/></td>
                        </tr>
                        <tr className="view">
                          <td>A-n32-k5</td>
                          <td className="seconds">15</td>
                          <td>4</td>
                          <td>121</td>
                          <td>43</td>
                          <td className="download-cell"><i onClick={handleDownloadSingleSolutionClick} role="button" className="bi-download"/></td>
                          <td className="download-cell"><i onClick={handleVisualizePiClick} role="button" className="bi-eye"/></td>
                        </tr>
                        <tr className="view">
                          <td>A-n32-k5</td>
                          <td className="seconds">15</td>
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
              
              <tr onClick={handleToggleSubmissionRow} id={SUBMISSION_ID_PREFIX + "3"} className="view">
                <td>1</td>
                <td>guicimodo</td>
                <td>Test</td>
                <td className="seconds">1.00</td>
                <td>27-5-2024</td>
                <td className="download-cell"><i role="button" onClick={handleDownloadSolverClick} className="bi-download" /></td>
                <td className="download-cell"><i role="button" onClick={handleDownloadSolutionsClick} className="bi-download" /></td>
                <td className="download-cell"><i role="button" onClick={handleDownloadScoresClick} className="bi-download" /></td>
              </tr>
              
              <tr id={PROBLEM_INSTANCES_ID_PREFIX + "3"} className="fold-closed">
                <td colSpan="8" className="fold-container">
                  <div className="fold-content">
                    <table className="pi-table">
                      <thead>
                        <tr>
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
                          <td>43</td>
                          <td className="download-cell"><i onClick={handleDownloadSingleSolutionClick} role="button" className="bi-download"/></td>
                          <td className="download-cell"><i onClick={handleVisualizePiClick} role="button" className="bi-eye"/></td>
                        </tr>
                        <tr className="view">
                          <td>A-n32-k5</td>
                          <td className="seconds">15</td>
                          <td>4</td>
                          <td>121</td>
                          <td>43</td>
                          <td className="download-cell"><i onClick={handleDownloadSingleSolutionClick} role="button" className="bi-download"/></td>
                          <td className="download-cell"><i onClick={handleVisualizePiClick} role="button" className="bi-eye"/></td>
                        </tr>
                        <tr className="view">
                          <td>A-n32-k5</td>
                          <td className="seconds">15</td>
                          <td>4</td>
                          <td>121</td>
                          <td>43</td>
                          <td className="download-cell"><i onClick={handleDownloadSingleSolutionClick} role="button" className="bi-download"/></td>
                          <td className="download-cell"><i onClick={handleVisualizePiClick} role="button" className="bi-eye"/></td>
                        </tr>
                        <tr className="view">
                          <td>A-n32-k5</td>
                          <td className="seconds">15</td>
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
              
              <tr onClick={handleToggleSubmissionRow} id={SUBMISSION_ID_PREFIX + "4"} className="view">
                <td>1</td>
                <td>guicimodo</td>
                <td>Test</td>
                <td className="seconds">1.00</td>
                <td>27-5-2024</td>
                <td className="download-cell"><i role="button" onClick={handleDownloadSolverClick} className="bi-download" /></td>
                <td className="download-cell"><i role="button" onClick={handleDownloadSolutionsClick} className="bi-download" /></td>
                <td className="download-cell"><i role="button" onClick={handleDownloadScoresClick} className="bi-download" /></td>
              </tr>
              
              <tr id={PROBLEM_INSTANCES_ID_PREFIX + "4"} className="fold-closed">
                <td colSpan="8" className="fold-container">
                  <div className="fold-content">
                    <table className="pi-table">
                      <thead>
                        <tr>
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
                          <td>43</td>
                          <td className="download-cell"><i onClick={handleDownloadSingleSolutionClick} role="button" className="bi-download"/></td>
                          <td className="download-cell"><i onClick={handleVisualizePiClick} role="button" className="bi-eye"/></td>
                        </tr>
                        <tr className="view">
                          <td>A-n32-k5</td>
                          <td className="seconds">15</td>
                          <td>4</td>
                          <td>121</td>
                          <td>43</td>
                          <td className="download-cell"><i onClick={handleDownloadSingleSolutionClick} role="button" className="bi-download"/></td>
                          <td className="download-cell"><i onClick={handleVisualizePiClick} role="button" className="bi-eye"/></td>
                        </tr>
                        <tr className="view">
                          <td>A-n32-k5</td>
                          <td className="seconds">15</td>
                          <td>4</td>
                          <td>121</td>
                          <td>43</td>
                          <td className="download-cell"><i onClick={handleDownloadSingleSolutionClick} role="button" className="bi-download"/></td>
                          <td className="download-cell"><i onClick={handleVisualizePiClick} role="button" className="bi-eye"/></td>
                        </tr>
                        <tr className="view">
                          <td>A-n32-k5</td>
                          <td className="seconds">15</td>
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
function leaderboardRow({data}) {
  return (
    <>
      
    </>
  )
};



export default TSPLeaderboard;


// {!displayRows || displayRows.length <= 0 ? (
//   <tr>
//       {/* the +1 is because there is always the rank column */}
//       <td colSpan={columnNames.length + 1} align='center'>
//           <b>Oops no one here</b>
//       </td>
//   </tr>
// ) : (
//   displayRows.map(row => (
//       <tr key={row[columnKeys.idKey]}>
//           {!columnKeys.colKeys || columnKeys.colKeys.length <= 0 ? (
//               <td colSpan={columnNames.length + 1} align='center'>Error: no column keys</td>
//           ) : (
//               columnKeys.colKeys.map(key => (
//                   <td>{row[key]}</td>
//               ))
//           )}
//       </tr>
//   ))
// )}