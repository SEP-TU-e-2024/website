import { useState, useEffect, useContext } from 'react'
import axios from 'axios';
import './Form.css';
import { useNavigate } from "react-router-dom";
import AuthContext from '../../context/AuthContext';


function LoginForm() {

    const navigate = useNavigate();
    let {loginUser} = useContext(AuthContext)

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleRegister = (event) => {
        navigate("/register")
    };

    return (
        <div className='login_page'>
            <div className='form_container'>
                <form onSubmit={loginUser} method='post'>
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
                            name="password"
                            type="password"
                            placeholder={"Password"}
                            onChange={handlePasswordChange}
                            required
                        />
                    </div>
                    <button type="submit">Login</button>
                </form>
                <p onClick={handleRegister}> Or register here! </p>
            </div>
        </div>
    );
};
  


export default LoginForm