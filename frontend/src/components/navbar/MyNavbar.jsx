import React, { useContext, useState } from 'react'
import {
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    NavbarToggler,
    Collapse
} from 'reactstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import AuthContext from "../../context/AuthContext";
import './navbar.scss';

/**
 * Our custom navbar component.
 * Named so as to not conflict with the reactstrap Navbar component
 * 
 * @returns MyNavbar component
 */
function MyNavbar() {
    let location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    let {user} = useContext(AuthContext)
    let {logout_user} = useContext(AuthContext)
    const navigate = useNavigate();
    
    const toggle = () => setIsOpen(!isOpen); //toggle the isOpen state variable
    
    //TODO update this to work with dynamic paths (ie /leaderboard/PROBLEM_NAME/1)
    const routeStrings = {
        BESTKNOWNSOLUTIONS : '/bestknownsolutions',
        REGISTER: '/register',
        LOGIN: '/login',
        LOGOUT: '/logout',
        HOME: '/home',
        ROOT: '/',
        DEVELOPMENT : '/in_development',
        ACCOUNT: '/account',
        ABOUT: '/about'
    }
    
    
    return (

        <Navbar expand="md" container="md" className="mynavbar">
            <NavbarBrand onClick={() => {navigate(routeStrings.ROOT)}} href="">
                <img alt="logo" src="/assets/LOGO.svg" style={{ width: 120 }} />
            </NavbarBrand>
            <NavbarToggler onClick={toggle} data-testid="toggler"/>
            <Collapse isOpen={isOpen} navbar data-testid="collapse">
                <Nav navbar className="me-auto navbar-left">
                    <NavItem className="route-button">
                        <NavLink active={routeStrings.BESTKNOWNSOLUTIONS === location.pathname} href={routeStrings.DEVELOPMENT}> {/* TODO: change link to BESTKNOWNSOLUTIONS if that page is implemented */}
                            Best Known Solutions
                        </NavLink>
                    </NavItem>
                </Nav>
                <Nav navbar className="ms-auto navbar-right d-flex flex-row">
                    <NavItem className="information-button">
                        <a href={routeStrings.ABOUT}>
                            <img src="/assets/question_mark.svg"/>
                        </a>
                    </NavItem>
                    {user ? (
                        <>
                        <NavItem className="login-logout-button">
                            <a onClick={logout_user} href="">Logout</a>
                        </NavItem>
                        <NavItem className="register-button">
                            <a href={routeStrings.ACCOUNT}>Account</a>
                        </NavItem>
                        </>
                    ) : (
                        <>
                        <NavItem className="login-logout-button">
                            <a onClick={() => {navigate(routeStrings.LOGIN)}} href="">Login</a>
                        </NavItem>
                        <NavItem className="register-button">
                            <a onClick={() => {navigate(routeStrings.REGISTER)}} href="">Registration</a>
                        </NavItem>
                        </>
                    )}
                </Nav>
            </Collapse>
        </Navbar>
    );
}

export default MyNavbar;