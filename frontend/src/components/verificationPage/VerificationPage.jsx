import './VerificationPage.scss';
import { useState, useEffect } from 'react'

/**
 * React component for rending the verification page
 */
function VerificationPage() {
    const [uid, setUid] = useState("");
    const [token, setToken] = useState("");

    const backendURL = import.meta.env.VITE_API_URL

    useEffect(() => {
        const extractTokens = () => {
            // Split the URL by '/'
            const url = window.location.href;
            const segments = url.split('/');
    
            // Extract the last two parameters
            setUid(segments[segments.length - 2]);
            setToken(segments[segments.length - 1]);
        }
    
        extractTokens()
    }, [])
    
    return (
        <div className='verification-page'> 
            <div className='verification-container'>
                <img src='/assets/Mail.svg'/>
                <h3> Verify your email address</h3> 
                <p> To start using BenchLab, we need to verify your email address </p>
                <a href={backendURL + "/auth/activate/" + uid + "/" + token}>Click to verify</a>
            </div>
        </div>
    );
};
  
export default VerificationPage


