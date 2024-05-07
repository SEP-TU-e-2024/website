import { useState, useEffect, useContext, Component} from 'react'
import {Pagination, PaginationItem, PaginationLink, Table, Container, Row, Col} from 'reactstrap'
    
    /*
    rank
    name/email
    submission name
    submission date
    
    */
    

function LeaderboardTable({columnNames, columnKeys, rows}) {
    
    //TODO sorting logic
    //TODO add check for id in rows
    //TODO add check/sorting of the rows
    const nrCols = 6;
    //TODO throw error if size of a row doesn't match the number of columns
    const firstPageActiveProps = {};
    firstPageActiveProps['disabled'] = true;
    const lastPageActiveProps = {};
    lastPageActiveProps['disabled'] = false;
    
    return (
        <Container fluid className='justify-content-center'>
            {/* <Row>
                <Col> */}
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
                        
                        {/* <th>Metric</th>
                        <th>Submission name</th>
                        <th>Submitted by</th>
                        <th>Submission date</th>
                    <th>Other metrics</th> */}
                    </tr>
                </thead>
                <tbody>
                    {!rows || rows.length <= 0 ? (
                        <tr>
                            {/* the +1 is because there is always the rank column */}
                            <td colSpan={columnNames.length + 1} align='center'>
                                <b>Oops no one here</b>
                            </td>
                        </tr>
                    ) : (
                        rows.map(row => (
                            <tr key={row[columnKeys.idKey]}>
                                {!columnKeys.colKeys || columnKeys.colKeys.length <= 0 ? (
                                    <td colSpan={columnNames.length + 1} align='center'>Error: no column keys</td>
                                ) : (
                                    columnKeys.colKeys.map(key => (
                                        <td>{row[key]}</td>
                                    ))
                                )}
                                {/* <td>{row.rank}</td>
                                <td>{row.metric}</td>
                                <td>{row.submissionName}</td>
                                <td>{row.submittedBy}</td>
                                <td>{row.submissionDate}</td>
                            <td>{row["otherMetrics"]}</td> */}
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>
            
            <Pagination className='d-flex justify-content-center'>
                <PaginationItem disabled>
                    <PaginationLink first href='#' />
                </PaginationItem>
                <PaginationItem disabled>
                    <PaginationLink previous href='#' />
                </PaginationItem>
                
                <PaginationItem active>
                    <PaginationLink href='#' > 1 </PaginationLink>
                </PaginationItem>
                
                <PaginationItem >
                    <PaginationLink previous href='#' />
                </PaginationItem>
                <PaginationItem >
                    <PaginationLink last href='#' />
                </PaginationItem>
            </Pagination>
                    {/* </Col>
                </Row> */}
        </ Container>
    )
}

export default LeaderboardTable