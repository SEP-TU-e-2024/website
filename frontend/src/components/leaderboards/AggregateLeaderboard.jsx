// leaderboard.jsx

import React from "react";
import './Leaderboard.scss';
import MetricColumn from './MetricColumn';
import LeaderboardColumn from './LeaderboardColumn';
import api from "../../api";
import Leaderboard from "./Leaderboard";

/**
 * Leaderboard component.
 * 
 * @param {JSON} problemData the problem data 
 * @param {JSON} leaderboardData data for the leaderboard
 * @param {int} rowLimit the limit to the amount of displayed rows 
 * @param {bool} showPagination whether to show a pagination component (not implemented yet)
 * 
 * @returns the component
 */
function AggregateLeaderboard({problemData, leaderboardData, rowLimit, showPagination}) {
  const columns = createColumns(problemData);
  return <Leaderboard problemData={problemData} columns={columns} leaderboardData={leaderboardData} LeaderboardRow={LeaderboardRow}/>
}

/**
 * 
 * @param {Array} columns the columns of the leaderboard
 * @param {JSON} entry a single entry in the leaderboard
 * @param {JSON} problemData the problem of the leaderboard
 * @param {UUID} parentPrefix prefix for dyamic keys
 * @returns 
 */
function LeaderboardRow({columns, entry, problemData, parentPrefix}) {
  // Prefix strings for the id's of submission entries and collapsables
  const PROBLEM_INSTANCES_ID_PREFIX = "problem-instances-" + parentPrefix + "-";
  
  // Handle toggling the problem instances for a single submission
  function handleToggleSubmissionRow(e) {
    const foldContainer = document.getElementById(PROBLEM_INSTANCES_ID_PREFIX + entry.submission.id);
    
    // Toggle the display classes
    foldContainer.classList.toggle("fold-open");
    foldContainer.classList.toggle("fold-closed");
  }

  const instance_columns = createInstanceColumns(problemData, entry.submission);

  if (instance_columns.length === 0) {
    console.error("Error: createInstanceColumns didn't find any columns to create");
    return (
      <p className="text-danger">Error: no column names found</p>
    );
  }
  
  return (
    <>
      <tr onClick={problemData.category.style != 0 ? handleToggleSubmissionRow : null} className="view">
        {/* // Add column data cell for the leaderboard entry  */}
        {columns.map(column => (
            <td key={column.name}>{column.getData(entry)}</td>
        ))}        
      </tr>
      
      {problemData.category.style != 0 ? 
      <tr id={PROBLEM_INSTANCES_ID_PREFIX + entry.submission.id} className="fold-closed">
        <td colSpan="8" className="fold-container">
          <div className="fold-content">
              <Leaderboard problemData={problemData} columns={instance_columns} leaderboardData={entry.instance_entries} LeaderboardRow={InstanceRow}/>
          </div>
        </td>
      </tr>
      :
      <></>}
    </>
  )
};

/**
 * Create the leaderboard columns for a problem
 * 
 * @param {JSON} problem to create leaderboard columns for
 * @returns {List} columns that were created for the specified problem
 */
function createColumns(problem) {
  let columns = [];

  columns.push(new LeaderboardColumn("#", 
    (entry) => { return entry.rank == 0 ? '~' : entry.rank }));

  columns.push(new MetricColumn(problem.scoring_metric));

  columns.push(new LeaderboardColumn("Submission name", 
    (entry) => { return entry.submission.name }));
  columns.push(new LeaderboardColumn("Submitted by", 
    (entry) => { return entry.submitter.name }));
  columns.push(new LeaderboardColumn("Submitted date", 
    (entry) => { return entry.submission.created_at.slice(0,10) })); //the slice is to format the date
  
    problem.metrics.forEach((metric) => {
    if (metric.name != problem.scoring_metric.name) {
      columns.push(new MetricColumn(metric));
    }
  });

  columns.push(new LeaderboardColumn("Download Solver", 
    (entry) => { 
      return (
        <div className="download-cell"><i 
          role="button" 
          onClick={entry.submission.is_downloadable ? (event) => handleDownloadSolverClick(event, entry.submission.filepath) : null} 
          className={entry.submission.is_downloadable ? "bi-download" : "bi-download disabled"} 
        /></div>
      )
    },
    <div className="download-cell">Download Solver</div>
  ));
  columns.push(new LeaderboardColumn("Download Solutions", 
    (entry) => { return <div className="download-cell"><i role="button" onClick={handleDownloadSolutionsClick} className="bi-download" /></div> },
    <div className="download-cell">Download Solutions</div>
  ));
  columns.push(new LeaderboardColumn("Download Scores", 
    (entry) => { return <div className="download-cell"><i role="button" onClick={handleDownloadScoresClick} className="bi-download" /></div> },
    <div className="download-cell">Download Scores</div>
  ));
  
  return columns;
}


// Download submission handler
async function handleDownloadSolverClick(event, filepath) {
  event.stopPropagation()
  try {
    const response = await api.get('/download/download_solver/', {
      params: { filepath: filepath },
      responseType: 'blob'
    });

    // Create a Blob from the response data
    downloadBlob(response)
  } catch (err) {
    console.error(err);
  }
}


function downloadBlob(response) {
  // Create blob
  const fileBlob = new Blob([response.data], { type: response.headers['content-type'] });
  const blobUrl = URL.createObjectURL(fileBlob);
  let filename = 'submission.zip';

  // Create a temporary anchor element to trigger the download
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  // Clean up and revoke the object URL
  URL.revokeObjectURL(blobUrl);
  link.remove();
}


// Download solutions handler
function handleDownloadSolutionsClick(e) {
  e.stopPropagation();
  alert("download solutions");
}

// Download scores handler
function handleDownloadScoresClick(e) {
  e.stopPropagation();
  alert("download scores");
}


/**
 * Create the instance columns for a leaderboard entry
 * 
 * @param {JSON} problem to create instance columns for
 * @param {JSON} submission to create instance columns for
 * @returns {List} instance columns that were created for the specified problem
 */
function createInstanceColumns(problem, submission) {
  let columns = [];

  columns.push(new MetricColumn(problem.scoring_metric));
  
  problem.metrics.forEach((metric) => {
    if (metric.name != problem.scoring_metric.name) {
      columns.push(new MetricColumn(metric));
    }
  });

  columns.push(new LeaderboardColumn("Download solution", 
    (entry) => { return <div className="download-cell"><i onClick={(event) => handleVisualizePi(event)} role="button" className="bi-download"/></div> }, 
    <div className="download-cell">Download<br/>Solution</div>
  ));
  columns.push(new LeaderboardColumn("Visualize", 
    (entry) => { return <div className="download-cell"><i onClick={(event) => handleDownloadSingleSolution(event)} role="button" className="bi-eye"/></div> },
    <div className="download-cell">Visualize</div>
  ));
  
  return columns;
}

/**
 * 
 * @param {Array} columns the columns of the leaderboard
 * @param {JSON} entry a single entry in the leaderboard
 * @returns 
 */
function InstanceRow({columns, entry}) {
  return (
    <tr className="view">{
      // Add column data for each instance column
      columns.map(column => (
        <th key={column.name}>{column.getData(entry)}</th>
      ))
    }</tr>
  )
};


// Create download specific solution click handler
function handleDownloadSingleSolution(event) {
  event.stopPropagation();
  alert("download single solution");
}

// Create visualize problem instance click handler
function handleVisualizePi(event) {
  event.stopPropagation();
  alert("visualize");
}

export default AggregateLeaderboard;