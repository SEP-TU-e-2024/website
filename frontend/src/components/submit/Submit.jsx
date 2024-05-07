import { useState, useEffect, useContext } from 'react'
import './Submit.css';
import AuthContext from '../../context/AuthContext';

function Submit() {
    let {logout_user} = useContext(AuthContext)

    return (
        <div >
            <h2> Submit page </h2>
            <button onClick={logout_user}> Log out </button>
        </div>
    );
};
  
export default Submit