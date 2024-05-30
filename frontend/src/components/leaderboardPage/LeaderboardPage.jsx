import { useState, useEffect, useContext} from 'react';
import { useLoaderData } from "react-router-dom";
import LeaderboardTable from '../leaderboardTable/LeaderboardTable';
import api from '../../api';

class Column {
  /** Column name that can be used as key or header display */
  #name;
  
  /** Private method to get cell data for the column from an entry */
  #getDataFromEntry;

  /**
   * Construct column for a leaderboard
   * 
   * @param {string} name of column that is unique and displayable
   * @param {function(JSON)} getDataFromEntry function to get cell data from an entry
   */
  constructor(name, getDataFromEntry) {
    this.#name = name;
    this.#getDataFromEntry = getDataFromEntry;
  }

  /**
   * Get column data from the specified entry data
   * 
   * @param {JSON} entry data to retrieve column data from
   * @return {*} data to display in the column entry cell
   */
  getData(entry) {
    return this.#getDataFromEntry(entry);
  }

  /**
   * Get the name of the column
   * 
   * @return {string} Name of the column
   */
  get name() {
    return this.#name;
  }
}

class MetricColumn extends Column {
  // TODO remove when metric model has been added:
  // Assuming metric JSON has format {key:'scoring_metric', label:'Scoring metric', unit:'s'}

  /**
   * Construct column for a metric.
   * 
   * @param {JSON} metric to create column for.
   */
  constructor(metric) {
    // Construct the column based on the metric values
    super(metric.label, (entry) => {

      // Format the data of the scoring metric with score and unit
      return `${entry.results[metric.key]} ${metric.unit}`
    })
  }
}

/**
 * Create the leaderboard columns for a problem
 * 
 * @param {JSON} problem to create leaderboard columns for
 * @returns {List} columns that were created for the specified problem
 */
function createColumns(problem) {
  let columns = [];
  columns.push(new Column("#", 
    (entry) => { return entry.rank }));

  // TODO replace hard coded scorign metric array with that from problem.
  let problem_scoring_metrics = [{key:'scoring_metric', label:'Scoring metric', unit:'s'}]
  
  // Loop over scoring metrics of the problem to add them as columns.
  problem_scoring_metrics.forEach((scoring_metric) => {
    columns.push(new MetricColumn(scoring_metric));
  });

  columns.push(new Column("Submission name", 
    (entry) => { return entry.submission.name }));
  columns.push(new Column("Submitted by", 
    (entry) => { return entry.submitter.name }));
  columns.push(new Column("Submitted date", 
    (entry) => { return entry.submission.created_at }));

  // TODO replace hard coded metric array with that from problem.
  let problem_metrics = []

  // Loop over metrics of the problem to add them as columns.
  problem_metrics.forEach((metric) => {
    columns.push(new MetricColumn(metric));
  });
  
  return columns;
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
        columns={createColumns(leaderboardData.problem)}
        entries={leaderboardData.entries}
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