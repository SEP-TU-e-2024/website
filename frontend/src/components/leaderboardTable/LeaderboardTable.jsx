import { useState, useEffect, useContext, Component} from 'react'
import {Pagination, PaginationItem, PaginationLink, Table, Container, Row, Col} from 'reactstrap'
    
/**
 * Leaderboard table component.
 * 
 * @param {columnNames, columnKeys, rows} param0 a dict with column labels, column keys in the row list, and a list of rows
 * @returns component
 */
function LeaderboardTable({columnNames, columnKeys, rows}) {
    
    //TODO move this to a settings file
    const MAX_DISPLAYED_ROWS = rows.length;
    
    //sorting logic
    //TODO maybe this is not the most optimal place to sort but I don't really know where to do it better
    let displayRows = rows.sort((a,b) => a[columnKeys.colKeys[0]] > b[columnKeys.colKeys[0]]); 
    
    displayRows = displayRows.slice(0, MAX_DISPLAYED_ROWS);
    
    //TODO add check for id in rows
    //TODO add check/sorting of the rows
    const nrCols = 6;
    //TODO throw error if size of a row doesn't match the number of columns
    
    return (
        <Container fluid className='justify-content-center'>
            <Table striped responsive hover>
                <thead>
                    <tr>
                        {/* This column is always there */}
                        <th>#</th>
                        
                        {/* If there are column names provided, render them */}
                        {!columnNames || columnNames.length <= 0 ? (
                            <th>No column names where specified</th>
                        ) : (
                            columnNames.map(colName => (
                                //maybe add a check somewhere that colname is a string
                                <th>{colName}</th>
                            ))
                        )}
                    </tr>
                </thead>
                <tbody>
                    {!displayRows || displayRows.length <= 0 ? (
                        <tr>
                            {/* the +1 is because there is always the rank column */}
                            <td colSpan={columnNames.length + 1} align='center'>
                                <b>Oops no one here</b>
                            </td>
                        </tr>
                    ) : (
                        displayRows.map(row => (
                            <tr key={row[columnKeys.idKey]}>
                                {!columnKeys.colKeys || columnKeys.colKeys.length <= 0 ? (
                                    <td colSpan={columnNames.length + 1} align='center'>Error: no column keys</td>
                                ) : (
                                    columnKeys.colKeys.map(key => (
                                        <td>{row[key]}</td>
                                    ))
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
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