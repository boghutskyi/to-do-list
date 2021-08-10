import React, { useContext } from 'react';
import {NavLink, useHistory} from 'react-router-dom';
import { AuthContext } from '../context/auth.context';

export const Navbar = () => {
    const history = useHistory();
    const auth = useContext(AuthContext);
    const logoutHandler = (event) => {
        event.preventDefault();
        auth.logout();
        history.push('/')
    }
    return (
        <nav>
            <div className="nav-wrapper blue darken-1" style={{padding: '0 2rem'}}>
                <span className="brand-logo">ToDo List</span>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    <li><NavLink to="tasks">Tasks</NavLink></li>
                    <li><a href="/" onClick={logoutHandler}>LogOut</a></li>
                </ul>
            </div>
        </nav>
    )
}