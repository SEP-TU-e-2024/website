import api from '../../api';
import { useState, useEffect } from 'react';
import './AccountPage.scss'
import { useNavigate } from "react-router-dom";
import { useAlert } from '../../context/AlertContext';

/**
 * Fetches account information from the backend
 * @returns data
 */
async function getAccount(showAlert) {
    try {
        const response = await api.get('/account', {});
        return response.data
    } catch(error) {
        if (error.response.status == 401) {
            showAlert("Unauthorized to access this content", "error");
        } else if (error.response.status == 404) {
            showAlert("Account data not found", "error")
        } else if (error.response.status == 500) {
            showAlert("Something went wrong on the server", "error")
        }
        console.error(error)
        return null;
    }
}

/**
 * Fetches submisisons for a user
 * @returns data, array
 */
async function getSubmissions(showAlert) {
    try {
        const response = await api.get('/submissions', {});
        return response.data
    } catch(error) {
        if (error.response.status == 401) {
            showAlert("Unauthorized to access this content", "error");
        } else if (error.response.status == 404) {
            showAlert("Account data not found", "error")
        } else if (error.response.status == 500) {
            showAlert("Something went wrong on the server", "error")
        }
        console.error(error)
        return []
    }
}

/**
 * React component for rending the homepage
 * @returns Problem occurence table
 */
function AccountPage() {
    const [account, setAccount] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const navigate = useNavigate();
    let {showAlert} = useAlert();

    useEffect(() => {
        const fetchData = async () => {
            const accountData = await getAccount(showAlert);
            const submissionData = await getSubmissions(showAlert);
            setAccount(accountData);
            setSubmissions(submissionData);
        }

        fetchData();
    }, []);

    const handleRowClick = (problem) => {
        navigate("/problemoccurrence/" + problem)
    };

    return (
        <div className='account_page'>
            <div className='account_container'>
                <h4>My profile</h4>
                <hr></hr>
                {account ? 
                    <div>
                        <h5>{account.name ? account.name : "Anonymous"}</h5>
                        <div className='account_details'>
                            <p>{account.email ? account.email : "Unknown email"}</p>
                        </div> 
                    </div> 
                    : 
                    undefined
                }

                <hr></hr>

                <h4>Submissions</h4>
                <p>
                    All your submissions can be found below, more information about the problems can be found by pressing the submissions name
                </p>
                <div className='center'>
                    <table>
                        <thead>
                            <tr>
                                <th> Created at </th>
                                <th> Submission name </th>
                            </tr> 
                        </thead>
                        {submissions.map(submission => (
                            <tr onClick={() => handleRowClick(submission.problem)} key={submission.id}>
                                <td>{submission.created_at.slice(0,10)}</td>
                                <td> {submission.name}</td>
                            </tr>
                        ))}
                    </table>
                </div>
                
            </div>
        </div>
    );
};
  
export default AccountPage


