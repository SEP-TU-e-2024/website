import { useState, useEffect, useContext } from 'react'
import AuthContext from '../../context/AuthContext';
import { Navigate, useSearchParams } from "react-router-dom";
import { useAlert } from '../../context/AlertContext';

/**
 * Component responsible for authenticating users using authentication tokens retrieved from URL parameters.
 * 
 * This component handles the authentication process by extracting authentication tokens from the URL parameters,
 * setting them in the application state using the `setTokens` function from the `AuthContext`, and triggering
 * redirection to the home page upon successful authentication.
 */
function TokenAuthenticator() {
    let {set_tokens} = useContext(AuthContext)
    const [tokensSet, setTokensSet] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [searchParams] = useSearchParams();
    let { showAlert } = useAlert();
    
    /**
     * Handles the retrieval of authentication tokens from the URL parameters and sets them in the application state.
     * 
     * It extracts the refresh token and access token from the URL parameters, sets them as authentication tokens in the 
     * application using the `setTokens` function from the `AuthContext`, and updates the `tokensSet` state to indicate that tokens are set.
     */
    useEffect(() => {
        const refresh_token = searchParams.get('refresh_token');
        const access_token = searchParams.get('access_token');
        const error_message = searchParams.get('error');

        if (refresh_token && access_token) {
            const tokens = {
                refresh: refresh_token,
                access: access_token
            };
            set_tokens(tokens);
            setTokensSet(true);
        }

        if (error_message) {
            setErrorMessage(error_message);
        }

    }, [tokensSet])

    if (errorMessage) {
        console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeee")
        showAlert(errorMessage, "error");
        return <Navigate to="/login" />
    }
    return tokensSet ? <Navigate to="/home" /> : null;
};
  
export default TokenAuthenticator