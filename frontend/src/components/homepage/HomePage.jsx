import { useState, useEffect, useContext } from 'react'
import './HomePage.css';
import AuthContext from '../../context/AuthContext';

function HomePage() {
    let {logout_user} = useContext(AuthContext)

    return (
        <div >
            <h2> Home page </h2>
            <button onClick={logout_user}> Log out </button>
        </div>
    );
};
  
export default HomePage