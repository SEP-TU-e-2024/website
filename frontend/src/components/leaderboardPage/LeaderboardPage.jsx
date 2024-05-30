import { useState, useEffect, useContext} from 'react';
import { useLoaderData } from "react-router-dom";
import LeaderboardTable from '../leaderboardTable/LeaderboardTable';
import api from '../../api';


/**
 * Create column names based on the specified problem
 * @param {JSON} problem from leaderboard object
 * @returns Array of column names to display on a leaderboard
 */
function createColumnNames(problem) {
  // TODO crate column names based on problems (scoring) metrics
  return ["Submission name", "Submitted by", "Submission date", "Scoring Metric"];
}

/**
 * Create column keys based on the specified problem
 * @param {JSON} problem from leaderboard object
 * @returns Array of column keys to display on a leaderboard
 */
function createColumnKeys(problem) {
  // TODO crate column keys based on problems (scoring) metrics
  return {idKey: "rank", colKeys: ["rank", "submissionName", "submittedBy", "submissionDate", "scoring_metric"]};
}

/**
 * Create the leaderboard rows for the specified entries
 * @param {JSON} entries from a leaderboard object
 * @returns Array of rows that can be displayed on a leaderboard
 */
function createLeaderboardRows(entries) {
  // Initialize required variables
  let rows = [];
  
  entries.forEach(entry => {
    let fields = {};

    // Add the results dict to the fields
    Object.assign(fields, entry.results);

    // Add rank that numbers the leaderboard entries
    fields['rank'] = entry.rank;

    // Add additonal fields based on entry submission and user
    fields['submissionName'] = entry.submission.name;
    fields['submittedBy'] = entry.submitter.name;
    fields['submissionDate'] = entry.submission.created_at;

    // Combine all fields in the rows array
    rows.push(fields);
  });

  // Return the rows array that has been created
  return rows;
}

/**
 * Example page component for a leaderboard
 */
function LeaderboardPage() {  
  const leaderboardData = useLoaderData();
  if (leaderboardData == null) {
    throw new Error("Problem with fetching the requested data from the database.");
  }
  
  return (
    <div>
      <div>
        <h2 className='text-primary'>Leaderboard</h2>
      </div>
      <div>
        <p>Here is a subtitle that can talk about the benchmark instance/set</p>
      </div>
      <LeaderboardTable 
        columnNames={createColumnNames(leaderboardData.problem)} 
        columnKeys={createColumnKeys(leaderboardData.problem)} 
        rows={createLeaderboardRows(leaderboardData.entries)} 
      />
    </div>
  );
}

/**
 * Async function to fetch the leaderboard data from the backend
 * @returns response data
 */
export async function getLeaderboardData(problemId) {
  try {
    const response = await api.get(`/leaderboard/${problemId}`);
    return response.data;
  } catch(err) {
    console.error(err);
  }
}

export default LeaderboardPage