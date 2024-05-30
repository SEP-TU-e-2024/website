import { useState, useEffect, useContext, Component} from 'react'
import {Pagination, PaginationItem, PaginationLink, Table, Container, Row, Col} from 'reactstrap'
import './LeaderboardTable.scss'
    
/**
 * Leaderboard table component.
 * 
 * @param {JSON} properties that should contain the following
 * - list of columns each with a name and method to retreive data from an entry.
 * - list of entries that contain data relevant to the leaderboard entry.
 * @returns component
 */
function LeaderboardTable({columns, entries}) {
    if (columns.length == 0) {
        console.error("Leaderboard table was created with zero columns");
        return;
    }

    return (
        <Container fluid className='justify-content-center'>
            <Table className='leaderboard-table'>
                {/* Add table header with single row of column names */}
                <thead>
                    <tr>{

                        // Add column name for each column 
                        columns.map(column => (
                            <td key={column.name}>{column.name}</td>
                        ))

                    }</tr>
                </thead>

                {/* Add table body with leaderboard entries */}
                <tbody>{
                    // Display message if no leaderboard entries exist
                    entries.length==0 ? 
                    <tr><td colSpan={columns.length} align='center'>
                        No leaderboard entries
                    </td></tr> :

                    // Add existing leaderboard entries
                    entries.map(entry => (
                    
                    // Add row for the leaderboard entry
                    <tr key={entry.rank}>{

                        // Add column data cell for the leaderboard entry 
                        columns.map(column => (
                            <td key={column.name}>{column.getData(entry)}</td>
                        ))
                    
                    }</tr>
                    
                ))}</tbody>
            </Table>
            {/* Possible code for a skeleton of a pagination if we want to add that */}
            {/* <Pagination className='d-flex justify-content-center'>
                <PaginationItem disabled>
                    <PaginationLink first href='#' />
                </PaginationItem>
                <PaginationItem disabled>
                    <PaginationLink previous href='#' />
                </PaginationItem>
                
                {/* For loop here *
                <PaginationItem active>
                    <PaginationLink href='#' > 1 </PaginationLink>
                </PaginationItem>
                
                <PaginationItem >
                    <PaginationLink previous href='#' />
                </PaginationItem>
                <PaginationItem >
                    <PaginationLink last href='#' />
                </PaginationItem>
            </Pagination> */}
        </ Container>
    )
}

export default LeaderboardTable