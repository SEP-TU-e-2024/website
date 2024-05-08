import React, { useState } from 'react'
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

/**
 * Our custom navbar component.
 * Named so as to not conflict with the reactstrap Navbar component
 * 
 * @returns MyNavbar component
 */
function MyNavbar() {
    let location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    
    const toggle = () => setIsOpen(!isOpen); //toggle the isOpen state variable
    
    //TODO update this to work with dynamic paths (ie /leaderboard/PROBLEM_NAME/1)
    const routeStrings = {
        LEADERBOARD: '/leaderboard', 
        PROBLEM_INSTANCES: '/probleminstances',
        PROBLEM_OCCURENCES: '/problemoccurences',
        REGISTER: '/register',
        LOGIN: '/login',
        HOME: '/home',
        ROOT: '/'
    }
    
    
    return (
        <Navbar expand={'md'} /*fixed='top'*/ container='md' color='dark' dark>
            <NavbarBrand href='/'>
                <img alt='logo' src='/src/assets/react.svg' style={{height:40, width:40}} />
            </NavbarBrand>
            <NavbarToggler onClick={toggle} />
            <Collapse isOpen={isOpen} navbar>
                
                {/* Navbar left aligned items */}
                <Nav navbar className='me-auto' pills>
                    <NavItem>
                        <NavLink active={routeStrings.HOME == location.pathname || routeStrings.ROOT == location.pathname} href={routeStrings.HOME}>home</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink active={routeStrings.LEADERBOARD == location.pathname} href={routeStrings.LEADERBOARD}>Leaderboard</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink active={routeStrings.PROBLEM_INSTANCES == location.pathname} href={routeStrings.PROBLEM_INSTANCES}>Problem instances</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink active={routeStrings.PROBLEM_OCCURENCES == location.pathname} href={routeStrings.PROBLEM_OCCURENCES}>Problem occurences</NavLink>
                    </NavItem>
                </Nav>
                    
                {/* Navbar right aligned items */}
                <Nav navbar className='ms-auto' pills>
                    <NavItem>
                        <NavLink active={routeStrings.REGISTER == location.pathname} href={routeStrings.REGISTER}>Registration</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink active={routeStrings.LOGIN == location.pathname} href={routeStrings.LOGIN}>Login</NavLink>
                    </NavItem>
                </Nav>
                
            </Collapse>
        </Navbar>
    )
}

export default MyNavbar;