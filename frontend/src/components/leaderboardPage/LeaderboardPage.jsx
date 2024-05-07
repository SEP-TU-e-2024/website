import { useState, useEffect, useContext} from 'react';
import LeaderboardTable from '../leaderboardTable/LeaderboardTable';

// Example function for fetching data from API
async function fetchData() {
    console.log(import.meta.env.VITE_API_URL)
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}example/`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        console.log(result);
        return result;
    } catch (error) {
      console.error('Error fething data:', error);
    }
};

//dummy function to generate a bit of data for testing the ui without needing the communication with the backend
function generatePlaceholderRows() {
  let rows = [
      {id: 0, rank: 0, submissionName: 'Foo', submittedBy: 'John Doe', metric: '1s', submissionDate: '1-1-2024', otherMetrics: 'placeholder'},
      {id: 1, rank: 1, submissionName: 'Joe', submittedBy: 'John Smith', metric: '1s', submissionDate: '1-1-2024', otherMetrics: 'placeholder'},
      {id: 2, rank: 2, submissionName: 'Bar', submittedBy: 'Jane Doe', metric: '2s', submissionDate: '1-1-2024', otherMetrics: 'placeholder'},
      {id: 3, rank: 3, submissionName: 'Foo', submittedBy: 'John Doe', metric: '1s', submissionDate: '1-1-2024', otherMetrics: 'placeholder'},
      {id: 4, rank: 4, submissionName: 'Joe', submittedBy: 'John Smith', metric: '1s', submissionDate: '1-1-2024', otherMetrics: 'placeholder'},
      {id: 5, rank: 5, submissionName: 'Bar', submittedBy: 'Jane Doe', metric: '2s', submissionDate: '1-1-2024', otherMetrics: 'placeholder'},
      {id: 6, rank: 6, submissionName: 'Foo', submittedBy: 'John Doe', metric: '1s', submissionDate: '1-1-2024', otherMetrics: 'placeholder'},
      {id: 7, rank: 7, submissionName: 'Joe', submittedBy: 'John Smith', metric: '1s', submissionDate: '1-1-2024', otherMetrics: 'placeholder'},
      {id: 8, rank: 8, submissionName: 'Bar', submittedBy: 'Jane Doe', metric: '2s', submissionDate: '1-1-2024', otherMetrics: 'placeholder'},
      {id: 9, rank: 9, submissionName: 'Foo', submittedBy: 'John Doe', metric: '1s', submissionDate: '1-1-2024', otherMetrics: 'placeholder'},
      {id: 10, rank: 10, submissionName: 'Joe', submittedBy: 'John Smith', metric: '1s', submissionDate: '1-1-2024', otherMetrics: 'placeholder'},
      {id: 11, rank: 11, submissionName: 'Bar', submittedBy: 'Jane Doe', metric: '2s', submissionDate: '1-1-2024', otherMetrics: 'placeholder'},
      {id: 12, rank: 12, submissionName: 'Bar', submittedBy: 'Jane Doe', metric: '2s', submissionDate: '1-1-2024', otherMetrics: 'placeholder'}
  ];
  return rows;
};

function generatePlaceholderColumnNames() {
  return ["Metric", "Submission name", "Submitted by", "Submission date", "Other metrics"];
}

function generatePlaceholderColumnKeys() {
  //important that rank is the first string here
  return {idKey: "id", colKeys: ["rank", "metric", "submissionName", "submittedBy", "submissionDate", "otherMetrics"]};
}

function LeaderboardPage() {
  return (
    <div>
      <div>
        <h2 class='text-primary'>Leaderboard</h2>
      </div>
      <div>
        <p>Here is a subtitle that can talk about the benchmark instance/set</p>
      </div>
      <LeaderboardTable columnNames={generatePlaceholderColumnNames()} columnKeys={generatePlaceholderColumnKeys()} rows={generatePlaceholderRows()} />
    </div>
  );
}

export default LeaderboardPage