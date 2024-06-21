import { useState, useEffect, useContext } from 'react'
import AuthContext from '../../context/AuthContext';
import { Navigate } from "react-router-dom";


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
    
    /**
     * Retrieves the value of a URL parameter by its name.
     * 
     * This function parses the URL to extract the value of a specific parameter specified by its name.
     * If the parameter is found in the URL, its decoded value is returned. If the parameter is not found,
     * null is returned.
     * 
     * @param {string} name - The name of the parameter to retrieve.
     * @param {string} [url=window.location.href] - The URL from which to retrieve the parameter. If not provided,
     *                                                the current window's URL is used.
     * @returns {string|null} - The value of the parameter specified by `name`, or `null` if the parameter is not found.
     */
    const getParameterByName = (name, url) => {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    /**
     * Handles the retrieval of authentication tokens from the URL parameters and sets them in the application state.
     * 
     * It extracts the refresh token and access token from the URL parameters, sets them as authentication tokens in the 
     * application using the `setTokens` function from the `AuthContext`, and updates the `tokensSet` state to indicate that tokens are set.
     */
    useEffect(() => {
        const refresh_token = getParameterByName('refresh_token', location.search);
        const access_token = getParameterByName('access_token', location.search);

        if (refresh_token && access_token) {
            const tokens = {
                refresh: refresh_token,
                access: access_token
            };
            set_tokens(tokens);
            setTokensSet(true);
        }
    }, [tokensSet])

    const error_message = getParameterByName('error', location.search);
    if (error_message) {
        alert(error_message);
        return <Navigate to="/login" />
    }
    return tokensSet ? <Navigate to="/home" /> : null;
};
  
export default TokenAuthenticator