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
                body: JSON.stringify({"email":e.target.email.value, "password":e.target.password.value})    
            })

            // Check if the fetch request was successful
            if (!response.ok) {
                throw new Error('Failed to login user');
            }

            // Receives login reponse data
            let data = await response.json()

            // Sets session tokens and redirects to home page;
            setTokens(data);
            navigate('/home');

        } catch (error) {
            // Handle errors
            console.error('Login error:', error.message);
            alert("An unknown error occurred");
        }
    }

    let emailLogin = async (e)=> {
        // Prevents default form submission
        e.preventDefault()
        
        try {
            // Submits login data to the backend API
            let response = await fetch('http://127.0.0.1:8000/api/auth/loginEmail/', {
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

            console.log(response)

            // Check if the fetch request was successful
            if (!response.ok) {
                logoutUser();
                throw new Error('Failed to update authentication tokens');
            }
    
            // Gets data from the response
            let data = await response.json()

            let tokens = authTokens
            tokens.access = data.access
            setTokens(tokens)
            
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
        loading ? updateToken() : undefined;

        let intervalTime = 1000 * 4 * 60
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
        setTokens:setTokens,
        loginUser:loginUser,
        logoutUser:logoutUser,
        registerUser:registerUser,
        emailLogin:emailLogin,
    }

    return(
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    )
}