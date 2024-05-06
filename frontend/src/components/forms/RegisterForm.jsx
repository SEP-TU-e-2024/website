import { useState, useEffect, useContext } from 'react'
import axios from 'axios';
import './Form.css';
import { useNavigate } from "react-router-dom";
import AuthContext from '../../context/AuthContext';


function RegisterForm() {

    const navigate = useNavigate();
    let {registerUser} = useContext(AuthContext)

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirm_password, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleLogin = (event) => {
        navigate("/login")
    };

    return (
        <div className='register_page'>
            <div className='form_container'>
                <form onSubmit={registerUser} method='post'>
                    <div>
                        <input
                            name="username"
                            type="text"
                            placeholder={"Username"}
                            onChange={handleUsernameChange}
                            required/>
                    </div>
                    <div>
                        <input
                            name="email"
                            type="text"
                            placeholder={"Email"}
                            onChange={handleEmailChange}
                            required
                        />
                    </div>
                    <div>
                        <input
                            name="password"
                            type="password"
                            placeholder={"Password"}
                            onChange={handlePasswordChange}
                            required
                        />
                    </div>
                    <div>
                        <input
                            name="confirm_password"
                            type="password"
                            placeholder={"Confirm password"}
                            onChange={handleConfirmPasswordChange}
                            required
                        />
                    </div>
                    <button type="submit">Register</button>
                </form>
                <p onClick={handleLogin}> Already have an account? Login here! </p>
            </div>
        </div>
    );
};
  


export default RegisterForm