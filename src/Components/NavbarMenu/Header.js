
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import chiselonLogo from '../Image/logochiselon.png'

import "./Header.css"

import React, { useState, useEffect } from 'react';
function Header() {

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
    <div className='' style={{backgroundColor:"#1C2FBA"}}>
      <div className='container'>
        <div className='d-flex justify-content-between align-items-center flex-wrap text-white '>
          <div className='m-1'>
            <Navbar.Brand href="#home">
              <img
                src={chiselonLogo}
                width="35"
                height="35"
                className="img-fluid d-inline-block align-top "
                alt="chiselon logo" />
            </Navbar.Brand>
          </div>

          <div className='h2 m-1 '>
            Timesheet
          </div>

          <div className='h4 m-1 ti-sign-in'>
            <a href='#' className='nav-link '>C</a>
          </div>


        </div>
        <div className='d-and-t '>
          <div className='text-warning pb-1'>
            {formattedDateTime}
          </div>
        </div>

      </div>

    </div>
  )
}

export default Header;