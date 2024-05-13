import {Container} from 'reactstrap'
import './HomePage.scss';
import { useNavigate } from 'react-router-dom';

function ProblemOccurenceTable({columnNames, columnKeys, rows}) {
    // Can be used in the future for page numbers
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
                    <th>Type</th>
                    <th>Problem Name</th>
                    <th>Style</th>
                    <th>Submissions</th>
                    <th>Aggregate Upper Bound</th>
                    <th>Benchmark Instances</th>
                </tr>
            </thead>
            <tbody>
                {!displayRows || displayRows.length <= 0 ? (
                    <tr>
                        {/* the +1 is because there is always the rank column */}
                        <td colSpan={columnNames.length + 1} align='center'>
                            <b>No data found</b>
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
    const ProblemTypes = {
        Scientific: "Scientific",
        Competition: "Competition"
    }

    let rows = [
        {id: "1", scientific: ProblemTypes.Scientific, problemName: 'Bin Packing', problemStyle: 'Dynamic', submissions: '5203', upperBound: '89%', benchmarkInstances: '30'},
        {id: "2", scientific: ProblemTypes.Competition, problemName: 'Knapsack Problem', problemStyle: 'Static', submissions: '8391', upperBound: '78%', benchmarkInstances: '50'},
        {id: "3", scientific: ProblemTypes.Scientific, problemName: 'Vehicle Routing', problemStyle: 'Dynamic', submissions: '6215', upperBound: '92%', benchmarkInstances: '35'},
        {id: "4", scientific: ProblemTypes.Competition, problemName: 'Graph Coloring', problemStyle: 'Static', submissions: '4380', upperBound: '85%', benchmarkInstances: '45'},
        {id: "5", scientific: ProblemTypes.Scientific, problemName: 'Job Scheduling', problemStyle: 'Dynamic', submissions: '7132', upperBound: '87%', benchmarkInstances: '40'},
        {id: "6", scientific: ProblemTypes.Competition, problemName: 'Set Covering', problemStyle: 'Static', submissions: '5724', upperBound: '91%', benchmarkInstances: '55'},
        {id: "7", scientific: ProblemTypes.Scientific, problemName: 'Facility Location', problemStyle: 'Dynamic', submissions: '6698', upperBound: '93%', benchmarkInstances: '30'},
        {id: "8", scientific: ProblemTypes.Competition, problemName: 'Partition Problem', problemStyle: 'Static', submissions: '3946', upperBound: '82%', benchmarkInstances: '40'},
        {id: "9", scientific: ProblemTypes.Scientific, problemName: 'Network Flow', problemStyle: 'Dynamic', submissions: '5873', upperBound: '88%', benchmarkInstances: '35'},
        {id: "10", scientific: ProblemTypes.Competition, problemName: 'Vertex Cover', problemStyle: 'Static', submissions: '4521', upperBound: '79%', benchmarkInstances: '50'},
        {id: "11", scientific: ProblemTypes.Scientific, problemName: 'Integer Programming', problemStyle: 'Dynamic', submissions: '7264', upperBound: '95%', benchmarkInstances: '45'},
        {id: "12", scientific: ProblemTypes.Competition, problemName: 'Shortest Path', problemStyle: 'Static', submissions: '5102', upperBound: '86%', benchmarkInstances: '40'},
        {id: "13", scientific: ProblemTypes.Scientific, problemName: 'Flow Shop Scheduling', problemStyle: 'Dynamic', submissions: '6410', upperBound: '90%', benchmarkInstances: '35'},
        {id: "14", scientific: ProblemTypes.Competition, problemName: 'Minimum Spanning Tree', problemStyle: 'Static', submissions: '4923', upperBound: '83%', benchmarkInstances: '50'},
        {id: "15", scientific: ProblemTypes.Scientific, problemName: 'Portfolio Optimization', problemStyle: 'Dynamic', submissions: '6785', upperBound: '94%', benchmarkInstances: '30'},
        {id: "16", scientific: ProblemTypes.Competition, problemName: 'Linear Programming', problemStyle: 'Static', submissions: '5506', upperBound: '90%', benchmarkInstances: '40'},
        {id: "17", scientific: ProblemTypes.Scientific, problemName: 'Job Shop Scheduling', problemStyle: 'Dynamic', submissions: '6582', upperBound: '91%', benchmarkInstances: '35'}
    ];
    return rows;
};

function generatePlaceholderColumnKeys() {
    return {idKey: "id", colKeys: ["scientific", "problemName", "problemStyle", "submissions", "upperBound", "benchmarkInstances"]};
};

function HomePage() {
    let rows = generatePlaceholderRows();
    let columnKeys = generatePlaceholderColumnKeys();

    return (
        <div className='table-wrapper'>
            <Container fluid className='justify-content-center'>
                <ProblemOccurenceTable columnKeys={columnKeys} rows={rows}/>
            </Container>
        </div>
        
    );
};
  
export default HomePage


