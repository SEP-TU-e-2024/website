import './Navbar.css';
import React, { useState } from 'react';

function Navbar() {

    const [isNavbarOpen, setIsNavbarOpen] = useState(false);

    const toggleNavbar = () => {
        setIsNavbarOpen(!isNavbarOpen);
    };

    const NavBarCollapse = () => (
        <div className={`navbar-collapse ${isNavbarOpen ? 'open' : ''}`}>
            <ul className="navbar-nav">
                <li className="nav-item">
                    <a className ="nav-link" href="#">Home</a>
                </li>
                <li className="nav-item">
                    <a className ="nav-link" href="#">About</a>
                </li>
                <li className="nav-item">
                    <a className ="nav-link" href="#">Contact</a>
                </li>
            </ul>
        </div>
      )

    return(    
        <div className="nav-wrapper">
            <nav className="navbar">
                <a className = "navbar-name" href="#">My Django App</a>
                <div 
                    className="navbar-toggler" 
                    onClick={toggleNavbar}
                >
                    <span className="navbar-toggler-icon"></span>
                    <span className="navbar-toggler-icon"></span>
                    <span className="navbar-toggler-icon"></span>
                </div>
                <NavBarCollapse />
            </nav>
        </div>
    );
}

export default Navbar