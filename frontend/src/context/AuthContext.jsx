import { createContext, useState, useEffect, Navigation} from 'react'
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export default AuthContext

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
     * @returns {boolean} Description of the return value.
     * @throws {Error} Description of possible exceptions thrown.
     */
    let setTokens = (data)=> {
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
    let registerUser = async (e)=> {
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
                body: JSON.stringify({"username":e.target.username.value, "email":e.target.email.value, "password":e.target.password.value})    
            })

            // Check if the fetch request was successful
            if (!response.ok) {
                throw new Error('Failed to register user');
            }

            // Receives submission status and notifies user adequately
            let data = await response.json();
            if (data.status === 201) {
                alert("Email sent successfully, please check your email");
                navigate('/login');
            } else {
                throw new Error('Failed to register user');
            }
        } catch {
            // Handle errors
            console.error('Registration error:', error.message);
            alert("An unknown error occurred, please try again");
        }
    }


    /**
     * Logs user into the backend
     * 
     * This function handles the submission event from a login form, sends the user data to the 
     * backend API for authentication, and sets authentication tokens.
     * 
     * @param {Event} e - The submission event from the registration form.
     */
    let loginUser = async (e)=> {
        // Prevents default form submission
        e.preventDefault()
        
        try {
            // Submits login data to the backend API
            let response = await fetch('http://127.0.0.1:8000/api/auth/token/', {
                method: 'POST',
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({"username":e.target.username.value, "password":e.target.password.value})    
            })

            // Check if the fetch request was successful
            if (!response.ok) {
                throw new Error('Failed to login user');
            }

            // Receives login reponse data
            let data = await response.json()
            if (response.status != 200) {
                throw new Error('Failed to login user');
            }

            // Sets session tokens and redirects to home page;
            setTokens(response, data);
            navigate('/home');
        } catch {
            // Handle errors
            console.error('Login error:', error.message);
            alert("An unknown error occurred, please try again");
        }
    }

    let logoutUser = ()=> {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem("authTokens")
        localStorage.removeItem("user")
        navigate("/")
    }

    // TODO Fix this on loading
    let updateToken = async ()=> {
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

            // Check if the fetch request was successful
            if (!response.ok) {
                throw new Error('Failed to update authentication tokens');
            }
    
            // Gets data from the response
            let data = await response.json()
            if (response.status != 200) {
                logoutUser();
                throw new Error('Failed to update authentication tokens');
            }

            // Sets session tokens
            setTokens(data)
            
            // Sets loading to false to stop the calling of this function
            if (loading) {
                setLoading(false)
            }
        } catch {
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
        loading ? updateToken() : undefined;

        let intervalTime = 1000 * 60 * 4
        let interval = setInterval(()=> {
            if (authTokens) {
                updateToken()
            }
        }, intervalTime)
        return ()=> clearInterval(interval)

    }, [authTokens, loading])

    /**
     * Data which elements in the context can accesss
     */
    let contextData = {
        user:user,
        loginUser:loginUser,
        logoutUser:logoutUser,
        registerUser:registerUser,
    }

    return(
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    )
}