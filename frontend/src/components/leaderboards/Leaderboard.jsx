import React, { useEffect, useState } from "react";
import { Container } from "reactstrap";
import './Leaderboard.scss';
import { v4 as uuidv4 } from 'uuid';

/**
 * Leaderboard component.
 * 
 * @param {JSON} problemData the problem data 
 * @param {int} rowLimit the limit to the amount of displayed rows 
 * @param {bool} showPagination whether to show a pagination component (not implemented yet)
 * 
 * @returns the component
 */
function Leaderboard(problemData, columns, leaderboardData, LeaderboardRow) {
    const uuidPrefix = uuidv4();  
  
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
          <tbody>
              {
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

export default Leaderboard;

