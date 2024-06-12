// leaderboard.jsx

import React, { useEffect, useState } from "react";
import { Container } from "reactstrap";
import './Leaderboard.scss';
import LeaderboardColumn from './LeaderboardColumn';
import api from "../../api";
import Leaderboard from "./Leaderboard";

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
function createColumns(problem, instance) {
  let columns = [];

  columns.push(new LeaderboardColumn("#", 
    (entry) => { return entry.rank == 0 ? '~' : entry.rank }));
  columns.push(new LeaderboardColumn(problem.scoring_metric.name,
    (entry) => { return entry.instance_entries[instance].results[problem.scoring_metric.name] }));

  columns.push(new LeaderboardColumn("Submission name", 
    (entry) => { return entry.submission.name }));
  columns.push(new LeaderboardColumn("Submitted by", 
    (entry) => { return entry.submitter.name }));
  columns.push(new LeaderboardColumn("Submitted date", 
    (entry) => { return entry.submission.created_at.slice(0,10) })); //the slice is to format the date
  columns.push(new LeaderboardColumn("Download Solution", 
    (entry) => { return <div className="download-cell"><i role="button" onClick={handleDownloadSolutionsClick} className="bi-download" /></div> },
    <div className="download-cell">Download Solutions</div>
  ));
  columns.push(new LeaderboardColumn("Download Scores", 
    (entry) => { return <div className="download-cell"><i role="button" onClick={handleDownloadScoresClick} className="bi-download" /></div> },
    <div className="download-cell">Download Scores</div>
  ));

  problem.metrics.forEach((metric) => {
    if (metric.name != problem.scoring_metric.name) {
        columns.push(new LeaderboardColumn(metric.name,
            (entry) => { return entry.instance_entries[instance].results[metric.name] }));
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
function InstanceLeaderboard({problemData, leaderboardData, instance}) {
  const columns = createColumns(problemData, instance);
  return Leaderboard(problemData, columns, leaderboardData, LeaderboardRow);
}

/**
 * 
 * @param {Array} columns the columns of the leaderboard
 * @param {JSON} entry a single entry in the leaderboard
 * @param {JSON} problem of the leaderboard
 * @returns 
 */
function LeaderboardRow({columns, entry}) {
  // Prefix strings for the id's of submission entries and collapsables
  const SUBMISSION_ID_PREFIX = "submission-";
  return (
    <>
      <tr id={SUBMISSION_ID_PREFIX + entry.submission.id} className="view">
        {/* // Add column data cell for the leaderboard entry  */}
        {columns.map(column => (
            <td key={column.name}>{column.getData(entry)}</td>
        ))}        
      </tr>
    </>
  )
};
export default InstanceLeaderboard;