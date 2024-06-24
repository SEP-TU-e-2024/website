import { createContext, useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import api from '../api';
import { useAlert } from './AlertContext';

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
    let {showAlert} = useAlert();

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

        // Checks if email is filled in correctly
        if (e.target.email.value != e.target.confirm_email.value) {
            showAlert("Emails are not equal", "error")
            return
        }

        // Checks if password is filled in correctly
        if (e.target.password && e.target.confirm_password) {
            if (e.target.password.value != e.target.confirm_password.value) {
                showAlert("Passwords not equal", "error")
                return
            }
        }
        
        try {
            let formData = {
                email: e.target.email.value,
                ...(e.target.password && e.target.password.value && { password: e.target.password.value }),
                ...(e.target.username && e.target.username.value && { username: e.target.username.value })
            };
            
            // Submits user data to API
            let response = await api.post('/auth/signup/', formData);
            
            // Receives submission status and notifies user adequately
            if (response.status === 201) {
                showAlert("Email sent successfully, please check your email", "success");
                navigate('/login');
            }
        } catch(error) {
            if (error.response.data.detail) {
                showAlert(error.response.data.detail, "error");
            } else if (error.response.status == 500) {
                showAlert("Something went wrong on the server", "error");
            } else {
                showAlert("Something went wrong", "error");
            }
            console.error('Signup error');
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
            // Submits user data to API
            let response = await api.post('/auth/token/', {
                email: e.target.email.value,
                password: e.target.password.value
            });

            // Sets session tokens and redirects to home page;
            set_tokens(response.data);
            navigate('/home');

        } catch (error) {
            if (error.response.data.detail) {
                showAlert(error.response.data.detail, "error");
            } else if (error.response.status == 404) {
                showAlert("Account not found", "error");
            } else if (error.response.status == 500) {
                showAlert("Something went wrong, maybe you don't have a password.", "error");
            } else {
                showAlert("Something went wrong", "error");
            }
            console.error('Login error');
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
            let response = await api.post('/auth/send_login_email/', {
                email: e.target.email.value,
            });

            showAlert("Email sent succesfully", "success")
        } catch(error) {
            // Handle errors
            if (error.response.data.detail) {
                showAlert(error.response.data.detail, "error");
            } else if (error.response.status == 404) {
                showAlert("Account with given email does not exists", "error")
            } else if (error.response.status == 500) {
                showAlert("Something went wrong on the server", "error")
            }
            
            console.error('Login error');
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
            let response = await api.post('/auth/token/refresh/', {
                refresh: authTokens.refresh
            });
    
            let tokens = authTokens
            tokens.access = response.data.access
            set_tokens(tokens)
            
            // Sets loading to false to stop the calling of this function
            if (loading) {
                setLoading(false)
            }
        } catch (error) {
            // Handle errors
            showAlert("Session expired", "error")
            logout_user();
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