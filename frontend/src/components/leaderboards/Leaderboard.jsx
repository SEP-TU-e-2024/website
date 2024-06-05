import {React, useEffect, useState} from "react"
import { Container } from "reactstrap";
import './Leaderboard.scss'
import MetricColumn from './MetricColumn'
import LeaderboardColumn from './LeaderboardColumn'
import api from "../../api";
import {v4 as uuidv4} from 'uuid';

/**
 * Async function to fetch the leaderboard data from the backend
 * @returns response data
 */
async function getLeaderboardData(problemId) {
  try {
    const response = await api.get(`/leaderboard/${problemId}`);
    return response.data;
  } catch(err) {
    console.error(err);
  }
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

/**
 * Create the leaderboard columns for a problem
 * 
 * @param {JSON} problem to create leaderboard columns for
 * @returns {List} columns that were created for the specified problem
 */
function createColumns(problem) {
  let columns = [];
  columns.push(new LeaderboardColumn("#", 
    (entry) => { return entry.rank }));

  // TODO replace hard coded scorign metric array with that from problem.
  let problem_scoring_metrics = [{key:'scoring_metric', label:'Scoring metric', unit:'s'}]
  
  // Loop over scoring metrics of the problem to add them as columns.
  problem_scoring_metrics.forEach((scoring_metric) => {
    columns.push(new MetricColumn(scoring_metric));
  });

  columns.push(new LeaderboardColumn("Submission name", 
    (entry) => { return entry.submission.submission_name }));
  columns.push(new LeaderboardColumn("Submitted by", 
    (entry) => { return entry.submitter.name }));
  columns.push(new LeaderboardColumn("Submitted date", 
    (entry) => { return entry.submission.created_at }));
  columns.push(new LeaderboardColumn("Download Solver", 
    (entry) => { return <i role="button" onClick={entry.submission.is_downloadable ? handleDownloadSolverClick : null} className={entry.submission.is_downloadable ? "bi-download" : "bi-download disabled"} />}));
  columns.push(new LeaderboardColumn("Download Solutions", 
    (entry) => { return <i role="button" onClick={handleDownloadSolutionsClick} className="bi-download" />}));
  columns.push(new LeaderboardColumn("Download Scores", 
    (entry) => { return <i role="button" onClick={handleDownloadScoresClick} className="bi-download" />}));

  // TODO replace hard coded metric array with that from problem.
  let problem_metrics = []

  // Loop over metrics of the problem to add them as columns.
  problem_metrics.forEach((metric) => {
    columns.push(new MetricColumn(metric));
  });
  
  return columns;
}

/**
 * Leaderboard component.
 * 
 * @param {JSON} problemData the problem data 
 * @param {int} rowLimit the limit to the amount of displayed rows 
 * @param {bool} showPagination whether to show a pagination component (not implemented yet)
 * 
 * @returns the component
 */
function Leaderboard({problemData, rowLimit, showPagination}) {
  const [entries, setEntries] = useState([]);
  const uuidPrefix = uuidv4();
  
  //data fetching code
  useEffect(() => {
    
    const fetchRows = async () => {
      try {
        const data = await getLeaderboardData(problemData.id);
        //TODO do this limiting in the backend later (not now because of time constraints)
        setEntries(rowLimit ? data.entries.slice(0, rowLimit) : data.entries);
      } catch(err) {
        console.error(err);
        //TODO proper error handling
      }
    }
    
    fetchRows();
  }, []);
  
  const columns = createColumns(problemData);
  if (columns.length == 0) {
    console.error("Error: createcolumns didn't find any columns to create");
    return (
      <p className="text-danger">Error: no column names found</p>
    )
  }
  
  return (
    <Container fluid className='justify-content-center'>
      <table className='leaderboard-table'>
          <thead>
            <tr>{

              // Add column name for each column 
              columns.map(column => (
                <th key={column.name}>{column.getHeader()}</th>
              ))

            }</tr>
          </thead>
          <tbody>{
            // Display message if no leaderboard entries exist
            entries.length==0 ? 
            <tr><td colSpan={columns.length} align='center' className="text-danger">
                No leaderboard entries
            </td></tr> :

            // Add existing leaderboard entries
            entries.map(entry => (
              <LeaderboardRow columns={columns} entry={entry} key={entry.rank} parentPrefix={uuidPrefix}/>
            ))}
            
          </tbody>  
      </table>
    </Container>
  )
};

/**
 * 
 * @param {Array} columns the columns of the leaderboard
 * @param {JSON} entry a single entry in the leaderboard
 * @returns 
 */
function LeaderboardRow({columns, entry, parentPrefix}) {
  //prefix strings for the id's of submission entries and collapsables
  const SUBMISSION_ID_PREFIX = "submission-";
  const PROBLEM_INSTANCES_ID_PREFIX = "problem-instances-" + parentPrefix + "-";
  
  console.log(entry);
  
  //handle toggling the problem instances for a single submission
  function handleToggleSubmissionRow(e) {
    const foldContainer = document.getElementById(PROBLEM_INSTANCES_ID_PREFIX + entry.submission.id);
    
    //toggle the display classes
    foldContainer.classList.toggle("fold-open");
    foldContainer.classList.toggle("fold-closed");
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
      <tr onClick={handleToggleSubmissionRow} id={SUBMISSION_ID_PREFIX + entry.submission.id} className="view">
        {/* // Add column data cell for the leaderboard entry  */}
        {columns.map(column => (
            <td key={column.name}>{column.getData(entry)}</td>
        ))}        
      </tr>
      
      <tr id={PROBLEM_INSTANCES_ID_PREFIX + entry.submission.id} className="fold-closed">
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