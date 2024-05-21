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
                <NavItem>
                    <NavLink active={routeStrings.BESTKNOWNSOLUTIONS == location.pathname} href={routeStrings.BESTKNOWNSOLUTIONS}>Best Known Solutions</NavLink>
                </NavItem>
            </Nav>
                
            {/* Navbar right aligned items */}
            <Nav navbar className='ms-auto' pills>
                <NavItem  className='information-button'>
                    <NavLink onClick={logout_user}>?</NavLink>
                </NavItem>
                {user ? (
                <NavItem  className='login-logout-button'>
                    <NavLink onClick={logout_user}>Logout</NavLink>
                </NavItem>
            ) : (
                <NavItem  className='login-logout-button'>
                    <NavLink active={routeStrings.LOGIN === location.pathname} href={routeStrings.LOGIN}>Login</NavLink>
                </NavItem>
            )}
                <NavItem className='register-button'>
                    <NavLink active={routeStrings.REGISTER == location.pathname} href={routeStrings.REGISTER} >Registration</NavLink>
                </NavItem>
            </Nav>
        </Navbar>
    )
}

export default MyNavbar;