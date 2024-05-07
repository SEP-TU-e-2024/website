import { useState, useEffect, useContext } from 'react'
import axios from 'axios';
import './Form.css';
import { useNavigate } from "react-router-dom";
import AuthContext from '../../context/AuthContext';


function LoginForm() {

    const navigate = useNavigate();
    let {loginUser} = useContext(AuthContext)
    let {emailLogin} = useContext(AuthContext)

    const handleRegister = (event) => {
        navigate("/register")
    };

    const PasswordForm = () => {
        return (
            <div className='form_container'>
                <form onSubmit={loginUser} method='post'>
                    <div>
                        <input
                            name="email"
                            type="text"
                            placeholder={"Email"}
                            required/>
                    </div>
                    <div>
                        <input
                            name="password"
                            type="password"
                            placeholder={"Password"}
                            required
                        />
                    </div>
                    <button type="submit">Login</button>
                </form>
                <p onClick={handleRegister}> Or register here! </p>
            </div>
        )
    }

    const EmailForm = () => {
        return (
            <div className='form_container'>
                <form onSubmit={emailLogin} method='post'>
                    <div>
                        <input
                            name="email"
                            type="text"
                            placeholder={"Email"}
                            required/>
                    </div>
                    <button type="submit"> Send email </button>
                </form>
            </div>
        )
    }

    return (
        <div className='login_page'>
            <h2> Email login option</h2>
            <EmailForm/>
            <h2> Password login option</h2>
            <PasswordForm/>
        </div>
    );
};
  


export default LoginForm