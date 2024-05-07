import { useState, useEffect, useContext } from 'react'
import axios from 'axios';
import './Form.css';
import { useNavigate } from "react-router-dom";
import AuthContext from '../../context/AuthContext';


function RegisterForm() {

    const navigate = useNavigate();
    let {register_user} = useContext(AuthContext)

    const handleLogin = (event) => {
        navigate("/login")
    };

    return (
        <div className='register_page'>
            <div className='form_container'>
                <form onSubmit={register_user} method='post'>
                    <div>
                        <input
                            name="email"
                            type="text"
                            placeholder={"Email"}
                            required
                        />
                    </div>
                    <div>
                        <input
                            name="password"
                            type="password"
                            placeholder={"Password"}
                            required
                        />
                    </div>
                    <div>
                        <input
                            name="confirm_password"
                            type="password"
                            placeholder={"Confirm password"}
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