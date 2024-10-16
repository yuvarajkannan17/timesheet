import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutEmployee } from '../features/employeeLogin';
import { logoutAdmin } from '../features/adminLogin';
import { logoutSupervisor } from '../features/supervisorLogin';
import { logoutSuperadmin } from '../features/superadminLogin';
import { useNavigate } from 'react-router-dom';
import chiselonLogo from '../Image/logochiselon.png';
import './Header.css';
import { Modal, Button } from 'react-bootstrap'; // Importing react-bootstrap components

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
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Open and close modal
  const handleOpen = () => setIsLogoutModalOpen(true);
  const handleClose = () => setIsLogoutModalOpen(false);

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
    navigate('/login'); // Redirect to login page after logout
    handleClose(); // Close the modal
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
        <div className='second-half d-flex justify-content-end align-items-center'>
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
          </div>
          <div className='ti-sign-in d-flex align-items-center'>
          <button className="nav-item btn ms-3" onClick={handleOpen}>Logout</button>
          </div>

          {/* Logout Confirmation Modal */}
          <Modal show={isLogoutModalOpen} onHide={handleClose} centered>
            <Modal.Body>Are you sure you want to log out?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleLogout}>
                Logout
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default Header;
