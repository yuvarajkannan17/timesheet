import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { getEmployeeDetails, deleteEmployeeData } from './EmployeeService';
import successCheck from '../../Image/checked.png';

export default function EmployeeDetails() {
  const { id } = useParams(); // Get the employee id from the route parameters
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [successConfirmation, setSuccessConfirmation] = useState(false);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const data = await getEmployeeDetails(id);
        setUserData(data);
      } catch (error) {
        console.error('Error fetching employee details:', error);
        // Handle error (e.g., show error message)
      }
    };

    fetchEmployeeData();
  }, [id]);

  const handleEdit = () => {
    navigate(`/admin/editemployee/${id}`);
  };

  const handleDeleteConfirm = () => {
    setDeleteModalOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteModalOpen(false);
  };

  const handleDeleteSuccess = async () => {
    try {
      await deleteEmployeeData(id); // Call delete employee data API
      setSuccessConfirmation(true);
    } catch (error) {
      console.error('Error deleting employee:', error);
      // Handle error (e.g., show error message)
    }
  };

  const handleCloseConfirmation = () => {
    setSuccessConfirmation(false);
    navigate('/admin/searchemployee');
  };

  const handleSuccessClick = () => {
    navigate('/admin/searchemployee');
  };

  const handleSuccess = () => {
    setSuccessModalOpen(true);
  };

  const handleCloseSuccessModal = () => {
    setSuccessModalOpen(false);
  };

  return (
    <div className="background-clr">
      <h3>Employee Details</h3>
      {userData ? (
        <div className="container employee-form">
          <div className="row">
            <div className="col-md-6 form-group">
              <label className="label col-md-4">Employee Id :</label>
              <label className="label col-md-8">{userData.employeeId}</label>
            </div>
            <div className="col-md-6 form-group">
              <label className="label col-md-4">Firstname :</label>
              <label className="label col-md-8">{userData.firstName}</label>
            </div>
            <div className="col-md-6 form-group">
              <label className="label col-md-4">Lastname :</label>
              <label className="label col-md-8">{userData.lastName}</label>
            </div>
            <div className="col-md-6 form-group">
              <label className="label col-md-4">Address :</label>
              <label className="label col-md-8">{userData.address}</label>
            </div>
            <div className="col-md-6 form-group">
              <label className="label col-md-4">Mobile Number :</label>
              <label className="label col-md-8">{userData.mobileNumber}</label>
            </div>
            <div className="col-md-6 form-group">
              <label className="label col-md-4">Email Id :</label>
              <label className="label col-md-8">{userData.emailId}</label>
            </div>
            <div className="col-md-6 form-group">
              <label className="label col-md-4">Project Id :</label>
              <label className="label col-md-8">{userData.projectId}</label>
            </div>
            <div className="col-md-6 form-group">
              <label className="label col-md-4">Aadhar Card :</label>
              <label className="label col-md-8">{userData.aadharNumber}</label>
            </div>
            <div className="col-md-6 form-group">
              <label className="label col-md-4">Pan Card :</label>
              <label className="label col-md-8">{userData.panNumber}</label>
            </div>
            <div className="col-md-6 form-group">
              <label className="label col-md-4">Password :</label>
              <label className="label col-md-8">{userData.password}</label>
            </div>
          </div>

          <div className="buttons">
            <button type="button" className="btn-edit btn-sm" onClick={handleSuccess}>
              Edit
            </button>
            <button type="button" className="btn-delete btn-sm" onClick={handleDeleteConfirm}>
              Delete
            </button>
            <button type="button" className="btn-cancel btn-sm" onClick={handleSuccessClick}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}

      {/* Modals */}
      <Modal show={isSuccessModalOpen} onHide={handleCloseSuccessModal}>
        <Modal.Body>Do you want to Edit?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSuccessModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEdit}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={isDeleteModalOpen} onHide={handleDeleteClose}>
        <Modal.Body>Do you want to Delete?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleDeleteSuccess}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal centered size="sm" show={successConfirmation} onHide={handleCloseConfirmation}>
        <Modal.Body>
          <div className="d-flex flex-column modal-success p-4 align-items-center">
            <img src={successCheck} className="img-fluid mb-4" alt="successCheck" />
            <p className="mb-4 text-center">Employee Profile Deleted Successfully</p>
            <button className="btn w-100 text-white" onClick={handleCloseConfirmation} style={{ backgroundColor: '#5EAC24' }}>
              Close
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
