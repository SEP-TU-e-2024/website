import {Container} from 'reactstrap'
import './HomePage.scss';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { useState, useEffect } from 'react';

/**
 * React component to render a table of problem occurences
 * @param {JSON} rows, data to render 
 * @returns HTML Table
 */
function ProblemOccurenceTable({rows}) {
    const navigate = useNavigate();
    let handleRowClick = (id)=> {
        navigate("/problemoccurrence/" + id);
    }    
    
    // Robustness checks
    if (!rows || rows.length <= 0) {
        return (<div>No data found</div>);
    }

    // Can be used in the future for page numbers
    const MAX_DISPLAYED_ROWS = rows.length;

    // Sorting logic
    const filterKey = "id";
    let displayRows = rows.sort((a,b) => a[filterKey] > b[filterKey]); 
    displayRows = displayRows.slice(0, MAX_DISPLAYED_ROWS);

    return (
        <table className='problem-occurence-table'>
            <thead>
                <tr>
                    <th>Type</th>
                    <th>Problem Name</th>
                    <th>Style</th>
                    <th>Submissions</th>
                </tr>
            </thead>
            <tbody>
                {displayRows.map(row => (
                    // Hard coding to allow easier access to static values
                    <tr key={row.id} onClick={()=>handleRowClick(row.id)}>
                        <td key={"type"}>{row["type"]}</td>
                        <td key={"name"}>{row["category"]["name"]}</td>
                        <td key={"style"}>{row["style"]}</td>
                        <td key={"submission_count"}>{row["submission_count"]}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
/**
 * Fetches problem occurences from the backend
 * @returns data, array
 */
async function getRows() {
    const response = await api.get('/problems/occurence_overview');
    return response.data
}

/**
 * React component for rending the homepage
 * @returns Problem occurence table
 */
function HomePage() {
    const [rows, setRows] = useState([]);

    useEffect(() => {
        const fetchRows = async () => {
        try {
            const data = await getRows();
            console.log(data);
            setRows(data);
        } catch(error) {
            // TODO, proper handling
            console.log(error)
        }}

        fetchRows();
    }, []);

    return (
        <div className='table-wrapper'>
            <Container fluid className='justify-content-center'>
                <ProblemOccurenceTable rows={rows}/>
            </Container>
        </div>
        
    );
};
  
export default HomePage


