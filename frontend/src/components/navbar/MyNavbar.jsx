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
import { useLocation } from 'react-router-dom'
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
    
    const toggle = () => setIsOpen(!isOpen); //toggle the isOpen state variable
    
    //TODO update this to work with dynamic paths (ie /leaderboard/PROBLEM_NAME/1)
    const routeStrings = {
        BESTKNOWNSOLUTIONS : '/bestknownsolutions',
        REGISTER: '/register',
        LOGIN: '/login',
        LOGOUT: '/logout',
        HOME: '/home',
        ROOT: '/'
    }
    
    
    return (
        <Navbar expand={'md'} container='md' className='navbar'>
            <NavbarBrand href='/'>
                <img alt='logo' src='/src/assets/LOGO.svg' style={{width:120}} />
            </NavbarBrand>
            {/* Navbar left aligned items */}
            <Nav navbar className='me-auto' pills>
                <NavItem className='route-button'>
                    <NavLink active={routeStrings.BESTKNOWNSOLUTIONS == location.pathname} href={routeStrings.BESTKNOWNSOLUTIONS}>Best Known Solutions</NavLink>
                </NavItem>
            </Nav>
                
            {/* Navbar right aligned items */}
            <Nav navbar className='test' >
                <NavItem  className='information-button'>
                    <a onClick={logout_user}>?</a>
                </NavItem>
                {user ? (
                <NavItem  className='login-logout-button'>
                    <a onClick={logout_user} href=''>Logout</a>
                </NavItem>
            ) : (
                <NavItem  className='login-logout-button'>
                    <a href={routeStrings.LOGIN}>Login</a>
                </NavItem>
            )}
                <NavItem className='register-button'>
                    <a href={routeStrings.REGISTER} >Registration</a>
                </NavItem>
            </Nav>
        </Navbar>
    )
}

export default MyNavbar;