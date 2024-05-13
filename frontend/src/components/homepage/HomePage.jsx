import { useState, useEffect, useContext } from 'react'
import {Table, Container, Row, Col} from 'reactstrap'
import './HomePage.css';
import AuthContext from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function ProblemOccurenceTable({columnNames, columnKeys, rows}) {
    const MAX_DISPLAYED_ROWS = rows.length;
    let displayRows = rows.sort((a,b) => a[columnKeys.colKeys[0]] > b[columnKeys.colKeys[0]]); 
    displayRows = displayRows.slice(0, MAX_DISPLAYED_ROWS);

    const navigate = useNavigate();
    let handleRowClick = ()=> {
        navigate("/temporary");
    }    

    return (
        <table className='problem-occurence-table'>
            <thead>
                <tr>
                    {/* If there are column names provided, render them */}
                    {!columnNames || columnNames.length <= 0 ? (
                        <th>No column names where specified</th>
                    ) : (
                        columnNames.map(colName => (
                            //maybe add a check somewhere that colname is a string
                            <th key={colName}>{colName}</th>
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
                        <tr key={row.id} onClick={handleRowClick}>
                            {!columnKeys.colKeys || columnKeys.colKeys.length <= 0 ? (
                                <td colSpan={columnNames.length + 1} align='center'>Error: no column keys</td>
                            ) : (
                                columnKeys.colKeys.map(key => (
                                    <td key={key}>{row[key]}</td>
                                ))
                            )}
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    )
}

function generatePlaceholderRows() {
    let rows = [
        {id: "1", scientific: "true", problemName: 'Bin Packing', problemStyle: 'Dynamic', submissions: '5203', upperBound: '89%', benchmarkInstances: '30'},
        {id: "2", scientific: "false", problemName: 'Knapsack Problem', problemStyle: 'Static', submissions: '8391', upperBound: '78%', benchmarkInstances: '50'},
        {id: "3", scientific: "true", problemName: 'Vehicle Routing', problemStyle: 'Dynamic', submissions: '6215', upperBound: '92%', benchmarkInstances: '35'},
        {id: "4", scientific: "false", problemName: 'Graph Coloring', problemStyle: 'Static', submissions: '4380', upperBound: '85%', benchmarkInstances: '45'},
        {id: "5", scientific: "true", problemName: 'Job Scheduling', problemStyle: 'Dynamic', submissions: '7132', upperBound: '87%', benchmarkInstances: '40'},
        {id: "6", scientific: "false", problemName: 'Set Covering', problemStyle: 'Static', submissions: '5724', upperBound: '91%', benchmarkInstances: '55'},
        {id: "7", scientific: "true", problemName: 'Facility Location', problemStyle: 'Dynamic', submissions: '6698', upperBound: '93%', benchmarkInstances: '30'},
        {id: "8", scientific: "false", problemName: 'Partition Problem', problemStyle: 'Static', submissions: '3946', upperBound: '82%', benchmarkInstances: '40'},
        {id: "9", scientific: "true", problemName: 'Network Flow', problemStyle: 'Dynamic', submissions: '5873', upperBound: '88%', benchmarkInstances: '35'},
        {id: "10", scientific: "false", problemName: 'Vertex Cover', problemStyle: 'Static', submissions: '4521', upperBound: '79%', benchmarkInstances: '50'},
        {id: "11", scientific: "true", problemName: 'Integer Programming', problemStyle: 'Dynamic', submissions: '7264', upperBound: '95%', benchmarkInstances: '45'},
        {id: "12", scientific: "false", problemName: 'Shortest Path', problemStyle: 'Static', submissions: '5102', upperBound: '86%', benchmarkInstances: '40'},
        {id: "13", scientific: "true", problemName: 'Flow Shop Scheduling', problemStyle: 'Dynamic', submissions: '6410', upperBound: '90%', benchmarkInstances: '35'},
        {id: "14", scientific: "false", problemName: 'Minimum Spanning Tree', problemStyle: 'Static', submissions: '4923', upperBound: '83%', benchmarkInstances: '50'},
        {id: "15", scientific: "true", problemName: 'Portfolio Optimization', problemStyle: 'Dynamic', submissions: '6785', upperBound: '94%', benchmarkInstances: '30'},
        {id: "16", scientific: "false", problemName: 'Linear Programming', problemStyle: 'Static', submissions: '5506', upperBound: '90%', benchmarkInstances: '40'},
        {id: "17", scientific: "true", problemName: 'Job Shop Scheduling', problemStyle: 'Dynamic', submissions: '6582', upperBound: '91%', benchmarkInstances: '35'}
    ];
    return rows;
};

function generatePlaceholderColumnKeys() {
    //important that rank is the first string here
    return {idKey: "id", colKeys: ["scientific", "problemName", "problemStyle", "submissions", "upperBound", "benchmarkInstances"]};
};

function generatePlaceholderColumnNames() {
    return ["Type", "Problem Name", "Style", "Submissions", "Aggregate Upper Bound", "Benchmark Instances"];
}

function HomePage() {
    let {logout_user} = useContext(AuthContext)

    let rows = generatePlaceholderRows();
    let columnNames = generatePlaceholderColumnNames();
    let columnKeys = generatePlaceholderColumnKeys();

    return (
        <div className='table-wrapper'>
            <Container fluid className='justify-content-center'>
                <ProblemOccurenceTable columnNames={columnNames} columnKeys={columnKeys} rows={rows}/>
            </Container>
        </div>
        
    );
};
  
export default HomePage


