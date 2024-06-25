import { useState, useEffect, useContext } from 'react'
import { Navigate } from "react-router-dom";
import axios from 'axios';
import './Form.scss';
import { useNavigate } from "react-router-dom";
import AuthContext from '../../context/AuthContext';
import { Container, Row, Col, TabContent, TabPane } from 'reactstrap'

function LoginForm() {
    let { user } = useContext(AuthContext);
    const [passwordVisiblity, setPasswordVisibility] = useState(false); 
    const navigate = useNavigate();
    let {login_user} = useContext(AuthContext)
    let {send_email_login} = useContext(AuthContext)

    if (user) {
        return <Navigate to="/home" />;
    }

    const togglePasswordVisibility = (event) => {
        setPasswordVisibility(!passwordVisiblity)
    };

    const PasswordForm = () => {
        return (
            <>
            <h5 className='text_banner'>
                Please enter your credentials down below, you will receive a session afterwards.
            </h5>
            <div className='form_container'>
                <form onSubmit={login_user} method='post'>
                    
                    <div className='field_container'>
                        <p>Email</p>
                        <input
                            name="email"
                            type="text"
                            required/>
                    </div>
                    <div className='field_container'>
                        <p>Password</p>
                        <input
                            name="password"
                            type="password"
                            required
                        />
                    </div>
                    <button type="submit">Login</button>
                </form>
                <p onClick={togglePasswordVisibility} style={{cursor:'pointer'}}> Or login with email </p>
            </div>
            </>
        )
    }

    const EmailForm = () => {
        return (
            <>
            <h5 className='text_banner'>
                Please enter your email. You will promptly receive an email with a link that grants you a session.
            </h5>
            <div className='form_container'>
                <form onSubmit={send_email_login} method='post'>
                    <div className='field_container'>
                        <p>Email</p>
                        <input
                            name="email"
                            type="text"
                            required/>
                    </div>
                    <button type="submit"> Send email </button>
                </form>
                <p onClick={togglePasswordVisibility} style={{cursor:'pointer'}}> Or login with password </p>
            </div>
            </>
        )
    }

    return (
        <div className='login_page'>
            <Container fluid className="bg-primary mt-4">
                <Row className="justify-content-center">
                    <Col className='text-light text-center py-5' xs="8">
                        <h1 className="fw-bold">Login</h1>
                    </Col>
                </Row>
            </Container>
            {passwordVisiblity ? (
                <PasswordForm/>
            ) :
            (
                <EmailForm/>
            )}
        </div>
    );
};
  


export default LoginForm