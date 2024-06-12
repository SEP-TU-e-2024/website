// leaderboard.jsx

import React, { useEffect, useState } from "react";
import { Container } from "reactstrap";
import './Leaderboard.scss';
import MetricColumn from './MetricColumn';
import LeaderboardColumn from './LeaderboardColumn';
import api from "../../api";
import { v4 as uuidv4 } from 'uuid';

function downloadBlob(response) {
  // Create blob
  const fileBlob = new Blob([response.data], { type: response.headers['content-type'] });
  const blobUrl = URL.createObjectURL(fileBlob);

  // Extract filename from response headers or use a default name
  const contentDisposition = response.headers['Content-Disposition'];
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

// Download submission handler
async function handleDownloadSolverClick(filepath) {
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
  columns.push(new LeaderboardColumn("Download Solver", 
    (entry) => { 
      return (
        <div className="download-cell"><i 
          role="button" 
          onClick={entry.submission.is_downloadable ? () => handleDownloadSolverClick(entry.submission.filepath) : null} 
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

  problem.metrics.forEach((metric) => {
    if (metric.name != problem.scoring_metric.name) {
      columns.push(new MetricColumn(metric));
    }
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
function Leaderboard({problemData, leaderboardData, rowLimit, showPagination}) {
  const uuidPrefix = uuidv4();

  const columns = createColumns(problemData);
  if (columns.length === 0) {
    console.error("Error: createColumns didn't find any columns to create");
    return (
      <p className="text-danger">Error: no column names found</p>
    );
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
          leaderboardData.length === 0 ? 
          <tr><td colSpan={columns.length} align='center' className="text-danger">
              No leaderboard entries
          </td></tr> :

          // Add existing leaderboard entries
          leaderboardData.map(entry => (
            <LeaderboardRow columns={columns} entry={entry} problem={problemData} key={entry.submission.id} parentPrefix={uuidPrefix}/>
          ))
        }
        </tbody>  
      </table>
    </Container>
  );
}

// Create download specific solution click handler
function getDownloadSingleSolutionOnClickHandler(submission, instance_entry) {
  return function onClickHandler(event) {
    event.stopPropagation();
    alert("download single solution");
  }
}

// Create visualize problem instance click handler
function getHandleVisualizePiOnClickHandler(submission, instance_entry) {
  return function onClickHandler(event) {
    event.stopPropagation();
    alert("visualize");
  }
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
    (entry) => { return <div className="download-cell"><i onClick={getDownloadSingleSolutionOnClickHandler(submission, entry)} role="button" className="bi-download"/></div> }, 
    <div className="download-cell">Download<br/>Solution</div>
  ));
  columns.push(new LeaderboardColumn("Visualize", 
    (entry) => { return <div className="download-cell"><i onClick={getHandleVisualizePiOnClickHandler(submission, entry)} role="button" className="bi-eye"/></div> },
    <div className="download-cell">Visualize</div>
  ));
  
  return columns;
}

/**
 * 
 * @param {Array} columns the columns of the leaderboard
 * @param {JSON} entry a single entry in the leaderboard
 * @param {JSON} problem of the leaderboard
 * @returns 
 */
function LeaderboardRow({columns, entry, problem, parentPrefix}) {
  // Prefix strings for the id's of submission entries and collapsables
  const SUBMISSION_ID_PREFIX = "submission-";
  const PROBLEM_INSTANCES_ID_PREFIX = "problem-instances-" + parentPrefix + "-";
  
  // Handle toggling the problem instances for a single submission
  function handleToggleSubmissionRow(e) {
    const foldContainer = document.getElementById(PROBLEM_INSTANCES_ID_PREFIX + entry.submission.id);
    
    // Toggle the display classes
    foldContainer.classList.toggle("fold-open");
    foldContainer.classList.toggle("fold-closed");
  }

  const instance_columns = createInstanceColumns(problem, entry.submission);
  if (instance_columns.length === 0) {
    console.error("Error: createInstanceColumns didn't find any columns to create");
    return (
      <p className="text-danger">Error: no column names found</p>
    );
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
                <tr>{
                  // Add column name for each column 
                  instance_columns.map(column => (
                    <th key={column.name}>{column.getHeader()}</th>
                  ))
                }</tr>
              </thead>
              <tbody>{
                // Display message if no leaderboard entries exist
                entry.instance_entries.length === 0 ?
                <tr><td colSpan={instance_columns.length} align='center' className="text-danger">
                  No instances available.
                </td></tr>
                :
                entry.instance_entries.map(instance_entry => (
                  <tr key={instance_entry.benchmark_instance.id} className="view">{
                    // Add column data for each instance column
                    instance_columns.map(column => (
                      <th key={column.name}>{column.getData(instance_entry)}</th>
                    ))
                  }</tr>
                ))
              }</tbody>  
            </table>
          </div>
        </td>
      </tr>
    </>
  )
};
export default Leaderboard;