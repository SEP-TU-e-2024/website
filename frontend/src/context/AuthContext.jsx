import { createContext, useState, useEffect, Navigation} from 'react'
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export default AuthContext

/**
 * This react component provides data and authentication methods to child components
 * 
 * @param {ReactNode} children - child components to render 
 */
export const AuthProvider = ({children}) => {

    // Navigation object for multipage navigation
    const navigate = useNavigate();

    // Variables for storing the persisent authentiction tokens on load
    let initialTokens = ()=> localStorage.getItem("authTokens") ? JSON.parse(localStorage.getItem("authTokens")) : null 
    let initialUser = ()=> localStorage.getItem("authTokens") ? jwtDecode(localStorage.getItem("authTokens")) : null 

    // React states used to store data which changes with interaction
    let [authTokens, setAuthTokens] = useState(initialTokens)
    let [user, setUser] = useState(initialUser)
    let [loading, setLoading] = useState(true)

    /**
     * Sets authentication tokens.
     * 
     * @param {JSON} data - Data containing authentication tokens
     * @returns {boolean} - Description of the return value.
     * @throws {Error} - Description of possible exceptions thrown.
     */
    let set_tokens = (data)=> {
        setAuthTokens(data)
        setUser(jwtDecode(data.access))
        localStorage.setItem('authTokens', JSON.stringify(data))
    } 

    /**
     * Registers a user on the backend and sends a verification email.
     * 
     * This function handles the submission event from a registration form, validates the form input, 
     * sends the user data to the backend API for registration, and triggers the sending of a verification email.
     * 
     * @param {Event} e - The submission event from the registration form.
     */
    let register_user = async (e)=> {
        // Prevents default form submission
        e.preventDefault()

        // Checks if password is filled in correctly
        if (e.target.password.value != e.target.confirm_password.value) {
            alert("Passwords not equal")
            return
        }
        
        try {
            // Submits user data to API
            let response = await fetch('http://127.0.0.1:8000/api/auth/signup/', {
                method: 'POST',
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({"email":e.target.email.value, "password":e.target.password.value})    
            })

            let data = await response.json();

            // Check if the fetch request was successful
            if (!response.ok && data.error) {
                throw new Error(data.error);
            }

            // Receives submission status and notifies user adequately
            if (response.status === 201) {
                alert("Email sent successfully, please check your email");
                navigate('/login');
            } else {
                throw new Error('Failed to register user, unknown error');
            }
        } catch(error) {
            // Handle errors
            console.error('Registration error:', error.message);
            alert(error.message);
        }
    }

    /**
     * Logs user into the backend
     * 
     * This function handles the submission event from a login form, sends the user data to the 
     * backend API for authentication, and sets authentication tokens.
     * 
     * @param {Event} e - The submission event from the login form.
     */
    let login_user = async (e)=> {
        // Prevents default form submission
        e.preventDefault()
        
        try {
            // Submits login data to the backend API
            let response = await fetch('http://127.0.0.1:8000/api/auth/token/', {
                method: 'POST',
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({"email":e.target.email.value, "password":e.target.password.value})    
            })

            
            // Receives login reponse data
            let data = await response.json()

            // Check if the fetch request was successful
            if (!response.ok) {
                if (data.detail) {
                    throw new Error(data.detail);
                }
                throw new Error("Unkown error");
            }

            // Sets session tokens and redirects to home page;
            set_tokens(data);
            navigate('/home');

        } catch (error) {
            // Handle errors
            console.error('Login error:', error.message);
            alert(error.message);
        }
    }

    /**
     * Send login email to user
     * 
     * This function handles the submission event from a login form, sends the user data to the 
     * backend API to trigger an email send
     * 
     * @param {Event} e - The submission event from the login form.
     */
    let send_email_login = async (e)=> {
        // Prevents default form submission
        e.preventDefault()
        
        try {
            // Submits login data to the backend API
            let response = await fetch('http://127.0.0.1:8000/api/auth/send_login_email/', {
                method: 'POST',
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({"email":e.target.email.value})    
            })

            // Check if the fetch request was successful
            if (!response.ok) {
                throw new Error('Failed to send login email');
            }
            alert("Email sent succesfully")
        } catch(error) {
            console.error('Login error:', error.message);
        }
    }

    /**
     * Logs out the user
     * 
     * This function removes the authenticaton tokens from the local storage and resets all variables
     * 
     * @param {Event} e - The submission event from the login form.
     */
    let logout_user = ()=> {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem("authTokens")
        localStorage.removeItem("user")
        navigate("/")
    }

    /**
     * Updates the access token using the refresh token.
     * 
     * This function sends the refresh token to the api in order to get a new acess
     * token. If the token is not valid it will logout the user, if it is valid, then
     * it will set the tokens accordingly.
     * 
     * @param {Event} e - The submission event from the login form.
     */
    let update_token = async ()=> {
        if (authTokens == null) {
            setLoading(false)
            return
        }

        try {
            // Fetches access tokens from backend using refresh tokens
            let response = await fetch('http://127.0.0.1:8000/api/auth/token/refresh/', {
                method: 'POST',
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({"refresh": authTokens.refresh})    
            })

            console.log(response)

            // Check if the fetch request was successful
            if (!response.ok) {
                logout_user();
                throw new Error('Failed to update authentication tokens');
            }
    
            // Gets data from the response
            let data = await response.json()

            let tokens = authTokens
            tokens.access = data.access
            set_tokens(tokens)
            
            // Sets loading to false to stop the calling of this function
            if (loading) {
                setLoading(false)
            }
        } catch (error) {
            // Handle errors
            console.error('Update error:', error.message);
        }

    }

    /**
     * Runs an effect to periodically update authentication tokens based on the current state.
     * 
     * This effect function is invoked whenever either the `authTokens` or `loading` state changes.
     * If the `loading` state is true, it triggers the `updateToken` function to refresh the authentication tokens.
     * 
     * @param {boolean} authTokens - The current authentication tokens state.
     * @param {boolean} loading - The current loading state indicating whether data is being fetched.
     */
    useEffect(()=> {
        loading ? update_token() : undefined;

        let intervalTime = 1000 * 4 * 60
        let interval = setInterval(()=> {
            if (authTokens) {
                update_token()
            }
        }, intervalTime)
        return ()=> clearInterval(interval)

    }, [authTokens, loading])

    /**
     * Data which elements in the context can accesss
     */
    let contextData = {
        user:user,
        set_tokens:set_tokens,
        login_user:login_user,
        logout_user:logout_user,
        register_user:register_user,
        send_email_login:send_email_login,
    }

    return(
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    )
}