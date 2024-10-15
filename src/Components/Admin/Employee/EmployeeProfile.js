import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import successCheck from '../../Image/checked.png';
import '../../css/style.css';
import { addEmployeeData } from './EmployeeService';
import { useSelector } from 'react-redux';

export default function EmployeeProfile() {
  const [employeeData, setEmployeeData] = useState(null);
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
  const [successConfirmation, setSuccessConfirmation] = useState(false);
  const [error, setError] = useState(null);
  const [isEditConfirmationOpen, setEditConfirmationOpen] = useState(false);
  const [createdEmployeeId, setCreatedEmployeeId] = useState(null); // New state to hold the created employee ID
  const adminValue = useSelector(state => state.adminLogin.value);
  const adminId = adminValue.adminId;

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.employee) {
      setEmployeeData(location.state.employee);
    } else {
      // Implement fetching logic if not passed through state
    }
  }, [location.state]);

  const handleEditConfirm = () => {
    setEditConfirmationOpen(true);
  };

  const handleEditConfirmClose = () => {
    setEditConfirmationOpen(false);
  };

  const handleEditYes = () => {
    setEditConfirmationOpen(false);
    navigate('/admin/createemployee?editMode=true', { state: { employee: employeeData } });
  };

  const handleSubmitClick = async () => {
    try {
      const response = await addEmployeeData(employeeData, adminId); // Await the backend response      
      setCreatedEmployeeId(response.employeeId); // Set the created employee ID from the response
      console.log(response)
      setSuccessConfirmation(true);
    } catch (error) {
      setError('Error submitting employee data. Please try again.');
    }
  };
  console.log(employeeData)

  const handleSuccessClick = () => {
    setSuccessModalOpen(true);
  };

  const handleClose = () => {
    setSuccessModalOpen(false);
  };

  const handleConfirmClose = () => {
    setSuccessConfirmation(false);
    navigate('/admin');
  };

  if (!employeeData) {
    return <div>Loading...</div>;
  }

  return (
    <div className='background-clr'>
      <h3>Employee Profile</h3>
      {employeeData && (
        <div className='container employee-form'>
          <div className='row'>
            <div className='col-md-6 form-group'>
              <label className='label col-md-4'>Firstname:</label>
              <label className='label col-md-8'>{employeeData.firstName}</label>
            </div>

            <div className='col-md-6 form-group'>
              <label className='label col-md-4'>Lastname:</label>
              <label className='label col-md-8'>{employeeData.lastName}</label>
            </div>

            <div className='col-md-6 form-group'>
              <label className='label col-md-4'>Address:</label>
              <label className='label col-md-8'>{employeeData.address}</label>
            </div>

            <div className='col-md-6 form-group'>
              <label className='label col-md-4'>Mobile Number:</label>
              <label className='label col-md-8'>{employeeData.mobileNumber}</label>
            </div>

            <div className='col-md-6 form-group'>
              <label className='label col-md-4'>Email Id:</label>
              <label className='label col-md-8'>{employeeData.emailId}</label>
            </div>

            {/* <div className='col-md-6 form-group'>
              <label className='label col-md-4'>Employee Id:</label>
              <label className='label col-md-8'>{employeeData.employeeId}</label>
            </div> */}

            {/* <div className='col-md-6 form-group'>
              <label className='label col-md-4'>Project Id:</label>
              <label className='label col-md-8'>{employeeData.projectId}</label>
            </div> */}

            <div className='col-md-6 form-group'>
              <label className='label col-md-4'>Aadhar Card:</label>
              <label className='label col-md-8'>{employeeData.aadharNumber}</label>
            </div>

            <div className='col-md-6 form-group'>
              <label className='label col-md-4'>Pan Card:</label>
              <label className='label col-md-8'>{employeeData.panNumber}</label>
            </div>

            <div className='col-md-6 form-group'>
              <label className='label col-md-4'>Password:</label>
              <label className='label col-md-8'>{employeeData.password}</label>
            </div>
          </div>
        </div>
      )}

      <div className='my-5 text-center'>
        <button type='button' className='btn btn-secondary mx-2' onClick={handleEditConfirm}>
          Edit
        </button>
        <button type='button' className='btn btn-success mx-2' onClick={handleSubmitClick}>
          Submit
        </button>
      </div>

      {/* Edit Confirmation Modal */}
      <Modal show={isEditConfirmationOpen} onHide={handleEditConfirmClose}>
        <Modal.Body>Do you want to navigate to the edit page?</Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleEditConfirmClose}>Cancel</Button>
          <Button variant='primary' onClick={handleEditYes}>Yes</Button>
        </Modal.Footer>
      </Modal>

      {/* Success Modal */}
      <Modal show={isSuccessModalOpen} onHide={handleClose}>
        <Modal.Body>Do you want to go back?</Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>Cancel</Button>
          <Button variant='primary' onClick={handleSuccessClick}>Yes</Button>
        </Modal.Footer>
      </Modal>

      {/* Confirmation Modal */}
      <Modal centered size='sm' show={successConfirmation} onHide={handleConfirmClose}>
        <Modal.Body>
          <div className='d-flex flex-column modal-success p-4 align-items-center'>
            <img src={successCheck} className='img-fluid mb-4' alt='successCheck' />
            <p className='mb-4 text-center'>Employee Profile Created Successfully</p>
            {createdEmployeeId && ( // Conditionally render employee ID
              <p className='mb-4 text-center'>Employee ID: {createdEmployeeId}</p>
            )}
            <p className='mb-4 text-center'>Employee Name: {employeeData.firstName}</p>
            <button className='btn w-100 text-white' onClick={handleConfirmClose} style={{ backgroundColor: '#5EAC24' }}>
              Close
            </button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Error Modal */}
      {error && (
        <Modal centered size='sm' show={Boolean(error)} onHide={() => setError(null)}>
          <Modal.Body>
            <div className='d-flex flex-column modal-error p-4 align-items-center'>
              <p className='mb-4 text-center'>{error}</p>
              <button className='btn w-100 text-white' onClick={() => setError(null)} style={{ backgroundColor: '#d9534f' }}>
                Close
              </button>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}
