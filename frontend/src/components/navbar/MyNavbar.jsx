import React from 'react'
import {
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink
} from 'reactstrap'

/**
 * Our custom navbar component.
 * Named so as to not conflict with the reactstrap Navbar component
 * 
 * @returns MyNavbar component
 */
function MyNavbar() {
    
    return (
        <Navbar expand full /*fixed='top'*/ container='sm' color='dark' dark>
            <NavbarBrand href='/'>
                <img alt='logo' src='../../../assets/react.svg' style={{height:40, width:40}} />
            </NavbarBrand>
            <Nav navbar className='me-auto' pills>
                <NavItem>
                    <NavLink active href='/scoreboard/1'>Scoreboard</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink href='/probleminstances/'>Problem instances</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink href='/problemoccurences/'>Problem occurences</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink href='/register/'>Registration</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink href='/login/'>Login</NavLink>
                </NavItem>
            </Nav>
        </Navbar>
    )
}

export default MyNavbar;