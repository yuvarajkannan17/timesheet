import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLastEnteredEmployee } from './EmployeeService';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import successCheck from '../../Image/checked.png';
import '../../css/style.css';

export default function EmployeeProfile() {
  const [lastEnteredEmployee, setLastEnteredEmployee] = useState(null);
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
  const [successConfirmation, setSuccessConfirmation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployeeData = async () => {
      const employeeData = await getLastEnteredEmployee();
      setLastEnteredEmployee(employeeData);
    };

    fetchEmployeeData();
  }, []);

  const handleEditConfirm = () => {
    navigate('/admin/createemployee?editMode=true');
  };

  const handleSuccessClick = () => {
    setSuccessModalOpen(true);
  };

  const handleClose = () => {
    setSuccessModalOpen(false);
  };

  const handleSubmitClick = () => {
    setSuccessConfirmation(true);
  };

  const handleConfirmClose = () => {
    setSuccessConfirmation(false);
    navigate('/admin/createemployee');
  };

  return (
    <div className='background-clr'>
      <h3> Employee Profile </h3>
      {lastEnteredEmployee ? (
        <div className='container employee-form'>
          <div className='col-md-6 form-group'>
            <label className='label col-md-4'> Firstname : </label>
            <label className='label col-md-8'> {lastEnteredEmployee.firstName} </label>
          </div>

          <div className='col-md-6 form-group'>
            <label className='label col-md-4'> Lastname : </label>
            <label className='label col-md-8'> {lastEnteredEmployee.lastName} </label>
          </div>

          <div className='col-md-6 form-group'>
            <label className='label col-md-4'> Address : </label>
            <label className='label col-md-8'> {lastEnteredEmployee.address} </label>
          </div>

          <div className='col-md-6 form-group'>
            <label className='label col-md-4'> Mobile Number : </label>
            <label className='label col-md-8'> {lastEnteredEmployee.mobileNumber} </label>
          </div>

          <div className='col-md-6 form-group'>
            <label className='label col-md-4'> Email Id : </label>
            <label className='label col-md-8'> {lastEnteredEmployee.emailId} </label>
          </div>

          <div className='col-md-6 form-group'>
            <label className='label col-md-4'> Employee Id : </label>
            <label className='label col-md-8'> {lastEnteredEmployee.employeeId} </label>
          </div>

          <div className='col-md-6 form-group'>
            <label className='label col-md-4'> Project Id : </label>
            <label className='label col-md-8'> {lastEnteredEmployee.projectId} </label>
          </div>

          <div className='col-md-6 form-group'>
            <label className='label col-md-4'> Aadhar Card : </label>
            <label className='label col-md-8'> {lastEnteredEmployee.aadharNumber} </label>
          </div>

          <div className='col-md-6 form-group'>
            <label className='label col-md-4'> Pan Card :</label>
            <label className='label col-md-8'> {lastEnteredEmployee.panNumber} </label>
          </div>
        </div>
      ) : (
        <></>
      )}

      <div className='my-5 text-center'>
        <button type='button' className='btn btn-secondary mx-2' onClick={handleEditConfirm}>
          Edit
        </button>
        <button type='submit' className='btn btn-success mx-2' onClick={handleSubmitClick}>
          Submit
        </button>
      </div>

      {/* Success Modal */}
      <Modal show={isSuccessModalOpen} onHide={handleClose}>
        <Modal.Body>Do you want to go back?</Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Cancel
          </Button>
          <Button variant='primary' onClick={handleSuccessClick}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirmation Modal */}
      <Modal centered size='sm' show={successConfirmation} onHide={handleConfirmClose}>
        <Modal.Body>
          <div className='d-flex flex-column modal-success p-4 align-items-center '>
            <img src={successCheck} className='img-fluid mb-4' alt='successCheck' />
            <p className='mb-4 text-center'>Employee Profile Created Successfully</p>
            <button className='btn w-100 text-white' onClick={handleConfirmClose} style={{ backgroundColor: '#5EAC24' }}>
              Close
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
