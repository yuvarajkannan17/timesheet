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
  const employeeId = employeeValue.employeeId;

  const adminValue = useSelector(state => state.adminLogin.value);
  const adminId = adminValue.adminId;

  const supervisorValue = useSelector(state => state.supervisorLogin.value);
  const supervisorId = supervisorValue.supervisorId;

  const superadminValue = useSelector(state => state.superadminLogin.value);
  const superadminId = superadminValue.superadminId;

  const [currentDateTime, setCurrentDateTime] = useState(new Date());

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
      navigate('/');
      console.log('Navigating to login...')
    } else if (adminId) {
      dispatch(logoutAdmin());
      navigate('/');
    } else if (supervisorId) {
      dispatch(logoutSupervisor());
      navigate('/');
    } else if (superadminId) {
      dispatch(logoutSuperadmin());
      navigate('/');
    }
  };

  return (
    <div className='ti-navbar-bg'>
      <div className='ti-navbar-header d-flex text-white'>
        <div className='first-half d-flex justify-content-between align-items-center '>
          <div>
            <img src={chiselonLogo} width="35" height="35" alt="chiselon logo" />
          </div>
          <div className='h2'>Timesheet</div>
        </div>
        <div className='seconds-half d-flex justify-content-end align-items-center'>
          <div className='ti-time text-warning'>
            {formattedDateTime}
          </div>
          <div className='ti-sign-in d-flex align-items-center'>
  {/* Displaying the user ID */}
  {employeeId && <span className='nav-item'>{employeeId}</span>}
  {adminId && <span className='nav-item'>{adminId}</span>}
  {supervisorId && <span className='nav-item'>{supervisorId}</span>}
  {superadminId && <span className='nav-item'>{superadminId}</span>}

  {/* Logout button */}
  {/* {(employeeId || adminId || supervisorId || superadminId) && (
    
  )} */}
  
</div>
<div className='ti-sign-in d-flex align-items-center'>
<button
      className="nav-item btn ms-3"
      onClick={handleLogout}
    >
      Logou
    </button>
    </div>

        </div>
      </div>
    </div>
  );
}

export default Header;
