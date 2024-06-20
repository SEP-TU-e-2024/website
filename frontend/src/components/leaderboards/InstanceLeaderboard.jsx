// leaderboard.jsx

import React from "react";
import './Leaderboard.scss';
import LeaderboardColumn from './LeaderboardColumn';
import Leaderboard from "./Leaderboard";
import MetricColumn from "./MetricColumn";

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
  // Copy is to we only affect this leaderboard when ranking the instance entries.
  const instanceLeaderboardData = [...leaderboardData];
  rankInstanceEntries(problemData, instanceLeaderboardData, instance);
  return <Leaderboard problemData={problemData} columns={columns} leaderboardData={instanceLeaderboardData} LeaderboardRow={LeaderboardRow}/>
}

/**
 * 
 * @param {Array} columns the columns of the leaderboard
 * @param {JSON} entry a single entry in the leaderboard
 * @returns 
 */
function LeaderboardRow({columns, entry}) {
  return (
    <>
      <tr className="view">
        {/* // Add column data cell for the leaderboard entry  */}
        {columns.map(column => (
            <td key={column.name}>{column.getData(entry)}</td>
        ))}        
      </tr>
    </>
  )
};

/**
 * Create the leaderboard columns for a problem
 * 
 * @param {JSON} problem to create leaderboard columns for
 * @returns {List} columns that were created for the specified problem
 */
function createColumns(problem, instance) {
  let columns = [];

  columns.push(new LeaderboardColumn("#", 
    (entry) => { return entry.instance_entries[instance].rank === 0 ? 
      '~' : entry.instance_entries[instance].rank }));

  columns.push(new MetricColumn(problem.scoring_metric, 
    (entry) => { return entry.instance_entries[instance].results; }))

  columns.push(new LeaderboardColumn("Submission name", 
    (entry) => { return entry.submission.name }));
  columns.push(new LeaderboardColumn("Submitted by", 
    (entry) => { return entry.submitter.name != null && entry.submitter.name != "" ?  entry.submitter.name : "Anonymous user" }));
  columns.push(new LeaderboardColumn("Submission date", 
    (entry) => { return entry.submission.created_at.slice(0,10) })); //the slice is to format the date

  problem.metrics.forEach((metric) => {
    if (metric.name != problem.scoring_metric.name) {
      columns.push(new MetricColumn(metric, (entry) => { return entry.instance_entries[instance].results; }))
    }
  });

  // columns.push(new LeaderboardColumn("Download Solution", 
  //   (entry) => { return <div className="download-cell"><i role="button" onClick={handleDownloadSolutionsClick} className="bi-download" /></div> },
  //   <div className="download-cell">Download Solutions</div>
  // ));
  // columns.push(new LeaderboardColumn("Download Scores", 
  //   (entry) => { return <div className="download-cell"><i role="button" onClick={handleDownloadScoresClick} className="bi-download" /></div> },
  //   <div className="download-cell">Download Scores</div>
  // ));

  return columns;
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
 * Ranks the instance entries based on the scoring metric
 * 
 * @param {JSON} problemData the problem data 
 * @param {int} rowLimit the limit to the amount of displayed rows 
 * @param {bool} showPagination whether to show a pagination component (not implemented yet)
 */
function rankInstanceEntries(problemData, leaderboardData, instance) {
  const rankableInstanceEntries = [];
  
  for (let entry of leaderboardData) {
    let instanceEntry = entry.instance_entries[instance];
    if (!(problemData.scoring_metric.name in instanceEntry.results)) {
      instanceEntry['rank'] = 0;
      continue;
    }
    rankableInstanceEntries.push(instanceEntry);
  }

  let getScoreFromEntry = (instanceEntry) => { return instanceEntry.results[problemData.scoring_metric.name]; };

  if (problemData.scoring_metric.order === 0) {
    rankableInstanceEntries.sort((a, b) => {return getScoreFromEntry(a) - getScoreFromEntry(b); })
  } else {
    rankableInstanceEntries.sort((a, b) => {return getScoreFromEntry(b) - getScoreFromEntry(a); })
  }

  let rank = 1;
  for (let entry of rankableInstanceEntries) {
    entry['rank'] = rank++;
  }

  let getRankFromEntry = (entry) => { return entry.instance_entries[instance].rank; };

  leaderboardData.sort((a, b) => {
    return (getRankFromEntry(b) === 0 ? -1 : getRankFromEntry(a)) - 
    (getRankFromEntry(a) === 0 ? -1 : getRankFromEntry(b));
  })
}

export default InstanceLeaderboard;