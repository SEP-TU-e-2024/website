import { useState, useEffect, useContext } from 'react'
import axios from 'axios';
import './Form.scss';
import './Form.scss';
import { useNavigate } from "react-router-dom";
import AuthContext from '../../context/AuthContext';
import { Container, Row, Col, TabContent, TabPane } from 'reactstrap'
import { Container, Row, Col, TabContent, TabPane } from 'reactstrap'


function RegisterForm() {
    const [passwordVisiblity, setPasswordVisibility] = useState(false); 
    const [passwordVisiblity, setPasswordVisibility] = useState(false); 
    let {register_user} = useContext(AuthContext)

    const handlePassword = (event) => {
        setPasswordVisibility(true);
    const handlePassword = (event) => {
        setPasswordVisibility(true);
    };

    return (


        <div className='register_page'>
            <Container fluid className="bg-secondary mt-4">
                <Row className="justify-content-center">
                    <Col className='text-light text-center py-5' xs="8">
                        <h1 className="fw-bold">Registration</h1>
                    </Col>
                </Row>
            </Container>
            <h5 className='text_banner'>
                Please enter your credentials down below, note that creating an account is not mandatory for submissions.
            </h5>

            <div className='form_container'>    
            <Container fluid className="bg-secondary mt-4">
                <Row className="justify-content-center">
                    <Col className='text-light text-center py-5' xs="8">
                        <h1 className="fw-bold">Registration</h1>
                    </Col>
                </Row>
            </Container>
            <h5 className='text_banner'>
                Please enter your credentials down below, note that creating an account is not mandatory for submissions.
            </h5>

            <div className='form_container'>    
                <form onSubmit={register_user} method='post'>
                    <div className='field_container'>
                        <p>Username</p>
                    <div className='field_container'>
                        <p>Username</p>
                        <input
                            name="username"
                            name="username"
                            type="text"
                            required
                        />
                    </div>
                    <div className='field_container'>
                        <p>Email</p>
                    <div className='field_container'>
                        <p>Email</p>
                        <input
                            name="email"
                            type="text"
                            required
                        />
                    </div>
                    <div className='field_container'>
                        <p>Confirm Email</p>
                    <div className='field_container'>
                        <p>Confirm Email</p>
                        <input
                            name="confirm_email"
                            type="text"
                            required
                        />
                    </div>
                    {passwordVisiblity ? (
                        <>
                        <div className='field_container'>
                            <p>Password (Optional)</p>
                            <input
                                name="password"
                                type="password"
                            />
                        </div>
                        <div className='field_container'>
                            <p>Confirm password (Optional)</p>
                            <input
                                name="confirm_password"
                                type="password"
                            />
                        </div>
                        </>
                    ) :
                    (
                        <></>
                    )}
                    <button type="submit">Register</button>
                </form>
                <p onClick={handlePassword}> Want to login through password? Click here </p>
                <p onClick={handlePassword}> Want to login through password? Click here </p>
            </div>
        </div>
    );
};
  


export default RegisterForm