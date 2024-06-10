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
function ProblemOccurenceOverview({rows}) {
    const navigate = useNavigate();
    const styleMapping = {"0" : "Scientific", "1" : "Competition"}


    let handleRowClick = (id)=> {
        navigate("/problemoccurrence/" + id);
    }    
    
    // Robustness checks
    if (!rows || rows.length <= 0) {
        return (<div>No data found</div>);
    }
 
    // Assemble a list of all specified problems per problem category
    const problemOccurences = rows.map((problem_cat) => (
            problem_cat['specified_problems'].map((problem_occurence)  => (
                <li >{problem_occurence['name']}</li>
            ))
        )
    );

    return (
        <div className='problem_container'>
            {rows.map(row => (
                // Hard coding to allow easier access to static values
                <div className={`problem_card ${styleMapping[row["type"]]}`} key={row.id}>
                    <div className='card_title'> 
                        {styleMapping[row["type"]]} 
                    </div>
                    <div className='card_content'>
                        <h5>
                            {row['name']}
                        </h5>
                        <ul>
                            {/* Adding all specified problems for this problem category */}
                           {row['specified_problems'].map(
                                (problem) => (
                                    <li onClick={() => handleRowClick(problem.id)} key={problem.id}>{problem['name']}</li>
                                )
                            )
                            }
                        </ul>
                    </div> 
                    <div className='card_footer'>
                        <p>1D 20H 40M</p>
                    </div>
                </div>
            ))}
        </div>
    )
}
/**
 * Fetches problem occurences from the backend
 * @returns data, array
 */
async function getRows() {
    try {
        const response = await api.post('/problems/occurrence_overview', {});
        return response.data
    } catch(err) {
        if (err.response.status == 401) {
            throw new Error("Unauthorized to access this content");
            //TODO maybe redirect here or something
        } else if (err.response.status == 404) {
            throw new Error("No problem instances found in the database");
        } else {
            throw err;
        }
    }
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
            setRows(data);
        } catch(error) {
            // TODO, proper handling
            alert(error.message)
            console.error(error)
        }}

        fetchRows();
    }, []);

    return (
        <div className='home_page'>  
            <div>
                <p>
                    Benchlab is a tool Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla non augue dolor. 
                    Aliquam at egestas quam, non varius metus. Nam sed risus vel dui tincidunt pulvinar. Proin auctor 
                    magna vitae erat consectetur, at malesuada augue sodales. Nam et rutrum ante. Mauris et commodo sem. 
                    Donec dapibus hendrerit enim, sit amet cursus magna suscipit ornare. Vivamus venenatis dui sit amet dolor 
                    eleifend, sit amet lacinia velit hendrerit.
                </p>
            </div>
            <div>
                <h3> Problems </h3>
                <hr></hr>
            </div>
            <div>
                <Container fluid className='justify-content-center'>
                    <ProblemOccurenceOverview rows={rows}/>
                </Container>
            </div>
        </div>
        
        
    );
};
  
export default HomePage


