import { useState, useEffect, useContext } from 'react'
import { Navigate } from "react-router-dom";
import axios from 'axios';
import './Form.scss';
import { useNavigate } from "react-router-dom";
import AuthContext from '../../context/AuthContext';
import { Container, Row, Col, TabContent, TabPane } from 'reactstrap'


function RegisterForm() {
    let { user } = useContext(AuthContext);
    const [passwordVisiblity, setPasswordVisibility] = useState(false); 
    let {register_user} = useContext(AuthContext)

    const togglePasswordVisibility = (event) => {
        setPasswordVisibility(!passwordVisiblity);
    };
    
    if (user) {
        return <Navigate to="/home" />;
    }

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
                <form onSubmit={register_user} method='post'>
                    <div className='field_container'>
                        <p>Username (Optional)</p>
                        <input
                            name="username"
                            type="text"
                        />
                    </div>
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
                <p onClick={togglePasswordVisibility}  style={{cursor:'pointer'}}>{passwordVisiblity ? 
                    (
                        " Want to login through email? Click here "
                    ) :
                    (
                        " Want to login through password? Click here "
                    )
                }</p>
            </div>
        </div>
    );
};
  


export default RegisterForm