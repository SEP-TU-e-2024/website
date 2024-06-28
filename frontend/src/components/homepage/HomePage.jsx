import {Container} from 'reactstrap'
import './HomePage.scss';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { useState, useEffect } from 'react';
import { useAlert } from '../../context/AlertContext';

/**
 * React component to render a table of problem occurences
 * @param {JSON} rows, data to render 
 * @returns HTML Table
 */
function ProblemOccurenceOverview({rows}) {
    const navigate = useNavigate();
    const styleMapping = {"1" : "Scientific", "0" : "Competition"}


    let handleRowClick = (id)=> {
        navigate("/problemoccurrence/" + id);
    }    
    
    // Robustness checks
    if (!rows || rows.length <= 0) {
        return (<div>No data found</div>);
    }
 
    return (
        <div className='problem_container'>
            {rows.map(row => (
                // Hard coding to allow easier access to static values
                <div className={`problem_card ${styleMapping[row["style"]]}`} key={row.id}>
                    <div className='card_title'> 
                        {styleMapping[row["style"]]} 
                    </div>
                    <div className='card_content'>
                        <h5>
                            {row['name']}
                        </h5>
                        <ul>
                            {/* Adding all specified problems for this problem category */}
                           {row['specified_problems'].map(
                                (problem) => (
                                    <li onClick={() => handleRowClick(problem.id)} key={problem.id} role='button'>{problem['name']}</li>
                                )
                            )
                            }
                        </ul>
                    </div> 
                    <div className='card_footer'>
                        
                    </div>
                </div>
            ))}
        </div>
    )
}

/**
 * Fetches problem occurrences from the backend
 * @returns data, array
 */
async function getRows(showAlert) {
    try {
        const response = await api.post('/problems/occurrence_overview', {});
        return response.data
    } catch(error) {
        if (error.response.status == 401) {
            showAlert("Unauthorized to access this content", "error");
        } else if (error.response.status == 404) {
            showAlert("No problems found", "error");
        } else {
            showAlert("Something went wrong", "error");
        }
    }
}

/**
 * React component for rending the homepage
 * @returns Problem occurrence table
 */
function HomePage() {
    const [rows, setRows] = useState([]);
    let {showAlert} = useAlert();

    useEffect(() => {
        const fetchRows = async () => {
        try {
            const data = await getRows(showAlert);
            setRows(data);
        } catch(error) {
            showAlert("Something went wrong", "error")
            console.error(error)
        }}

        fetchRows();
    }, []);

    return (
        <div className='home_page'>  
            <div>
                <p>
                BenchLab is a tool to benchmark algorithms and solutions for optimization problems. It shows a range of specified problems 
                to view or submit to. Users can evaluate their algorithms by making code submissions to problem occurrences, or make solution 
                submissions to a specific problem instance if they think they found a new Best Known Solution for that instance. 
                BenchLab provides an environment for these evaluations to run in and display their results. Submissions are ranked on leaderboards
                based on scoring metrics. That way, it facilitates easy and transparent benchmarking of algorithms and solutions. 
                It is also possible to use the platform to host competitions, in which case certain data on a submission’s performance
                is hidden but the leaderboard is still shown. New specified problems can be added to the platform by admins, providing info on the problem and
                the code to evaluate submissions for this specified problem.
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


