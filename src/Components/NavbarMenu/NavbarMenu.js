
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import chiselonLogo from '../Image/logochiselon.png'
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import './navbarMenu.css'
function NavbarMenu() {

    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    useEffect(() => {
        // Update the currentDateTime state every second
        const intervalId = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        // Clean up the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, []); // Empty dependency array ensures the effect runs only once after initial render

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' }; const formattedDateTime = currentDateTime.toLocaleDateString(undefined, options);

    return (
        <>
{/* super admin header */}

            <div className='navbar-bg'>
                <div className='navbar-header d-flex text-white'>

                    <div className='first-half d-flex justify-content-between align-items-center '>
                        <div>
                            <Navbar.Brand href="#home">
                                <img
                                    src={chiselonLogo}
                                    width="35"
                                    height="35"
                                    className="d-inline-block align-top"
                                    alt="chiselon logo" />

                            </Navbar.Brand>
                        </div>
                        <div className='h2'>
                            Timesheet
                        </div>

                    </div>
                    <div className='seconds-half d-flex justify-content-end align-items-center '>
                        <div className='time text-warning'>
                            {formattedDateTime}
                        </div>
                        <div className='h3 sign-in'>
                            <a href='#' className='nav-link'>Y</a>
                        </div>
                    </div>

                </div>

            </div>
            {/*  superadmin navigation to create admin and search admin */}
            <div className="superadmin-navigation">
                <Container >
                    <div>
                        <ul className='nav d-flex justify-content-end'>
                            <li className='nav-item'>
                                <NavLink to={'/'} className='nav-link superadmin-navigation-link' activeclassname='active'>Create Admin User</NavLink>
                            </li>
                            <li className='nav-item'>
                                <NavLink to={'/searchadmin'} className='nav-link superadmin-navigation-link' activeclassname='active'>Search Admin User</NavLink>
                            </li>
                        </ul>
                    </div>
                </Container>
            </div>


        </>
    )

}

export default NavbarMenu;



