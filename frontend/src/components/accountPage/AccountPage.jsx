import api from '../../api';
import { useState, useEffect } from 'react';
import './AccountPage.scss'
import { useNavigate } from "react-router-dom";

/**
 * Fetches account information from the backend
 * @returns data
 */
async function getAccount() {
    try {
        const response = await api.get('/account', {});
        return response.data
    } catch(error) {
        if (error.response.status == 401) {
            alert("Unauthorized to access this content");
        } else if (error.response.status == 404) {
            alert("Account data not found")
        } else if (error.response.status == 500) {
            alert("Something went wrong on the server")
        }
        console.error(error)
    }
}

/**
 * Fetches submisisons for a user
 * @returns data, array
 */
async function getSubmissions() {
    try {
        const response = await api.get('/submissions', {});
        console.log(response.data)
        return response.data
    } catch(error) {
        if (error.response.status == 401) {
            alert("Unauthorized to access this content");
        } else if (error.response.status == 404) {
            alert("Account data not found")
        } else if (error.response.status == 500) {
            alert("Something went wrong on the server")
        }
        console.error(error)
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

    useEffect(() => {
        const fetchData = async () => {
        try {
            const account = await getAccount();
            const submissions = await getSubmissions();
            setAccount(account);
            setSubmissions(submissions);
        } catch(error) {
            console.error(error)
        }}

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
                            <p>{account.email ? account.email : "Unkown email"}</p>
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
                            <th> Created at </th>
                            <th> Submission name </th>
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


