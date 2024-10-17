import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutEmployee } from '../features/employeeLogin';
import { logoutAdmin } from '../features/adminLogin';
import { logoutSupervisor } from '../features/supervisorLogin';
import { logoutSuperadmin } from '../features/superadminLogin';
import { useNavigate } from 'react-router-dom';
import chiselonLogo from '../Image/logochiselon.png';
import './Header.css';

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const employeeValue = useSelector(state => state.employeeLogin.value);
  const employeeId = employeeValue?.employeeId;

  const adminValue = useSelector(state => state.adminLogin.value);
  const adminId = adminValue?.adminId;

  const supervisorValue = useSelector(state => state.supervisorLogin.value);
  const supervisorId = supervisorValue?.supervisorId;

  const superadminValue = useSelector(state => state.superadminLogin.value);
  const superadminId = superadminValue?.superadminId;

  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const formattedDateTime = currentDateTime.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });

  // Logout handler based on role
  const handleLogout = () => {
    if (employeeId) {
      dispatch(logoutEmployee());
    } else if (adminId) {
      dispatch(logoutAdmin());
    } else if (supervisorId) {
      dispatch(logoutSupervisor());
    } else if (superadminId) {
      dispatch(logoutSuperadmin());
    }
    navigate('/'); // Redirect to login page after logout
    setIsDropdownOpen(false); // Close the dropdown
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  // Close the dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='ti-navbar-bg'>
      <div className='ti-navbar-header d-flex text-white'>
        <div className='first-half d-flex justify-content-between align-items-center '>
          <div>
            <img src={chiselonLogo} width="35" height="35" alt="chiselon logo" />
          </div>
          <div className='h2'>Timesheet</div>
        </div>
        <div className='second-half d-flex justify-content-end align-items-center'>
          <div className='ti-time text-warning'>
            {formattedDateTime}
          </div>
          <div className='ti-sign-in d-flex align-items-center position-relative dropdown-container'>
            {/* Displaying the user ID with dropdown toggle */}
            {(employeeId || adminId || supervisorId || superadminId) && (
              <div className='nav-item' onClick={toggleDropdown} style={{ cursor: 'pointer' }}>
                {employeeId || adminId || supervisorId || superadminId}
              </div>
            )}

            {/* Dropdown menu */}
            {isDropdownOpen && (
              <div className='dropdown-menu position-absolute mt-2'>
                <button className="dropdown-item" onClick={handleLogout}>Logout</button>
                <button className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>Cancel</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
