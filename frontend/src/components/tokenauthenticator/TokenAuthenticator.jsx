import { useState, useEffect, useContext } from 'react'
import AuthContext from '../../context/AuthContext';
import { Navigate } from "react-router-dom";

function TokenAuthenticator() {
    let {setTokens} = useContext(AuthContext)
    const [tokensSet, setTokensSet] = useState(false);
    
    // Function to extract URL parameters
    const getParameterByName = (name, url) => {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    // In your functional component body
    useEffect(() => {
        const refresh_token = getParameterByName('refresh_token', location.search);
        const access_token = getParameterByName('access_token', location.search);
        console.log(refresh_token)
        console.log(access_token)

        if (refresh_token && access_token) {
            const tokens = {
                refresh: refresh_token,
                access: access_token
            };
            setTokens(tokens);
            setTokensSet(true);
        }
    }, [tokensSet])

    return tokensSet ? <Navigate to="/home" /> : null;
};
  
export default TokenAuthenticator