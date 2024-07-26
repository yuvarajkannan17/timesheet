import React, { useState, useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useParams, useNavigate } from "react-router-dom";
import { getEmployeeDetails, updateEmployeeData } from './EmployeeService'; // Adjusted import for update

import successCheck from '../../Image/checked.png';

export default function EditEmployee() {
  const { id } = useParams(); // Get the employee id from the route parameters
  const navigate = useNavigate();

  // State for form values, initial values, errors, and success modal
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    address: '',
    mobileNumber: '',
    emailId: '',
    projectId: '',
    aadharNumber: '',
    panNumber: ''
  });
  const [initialFormValues, setInitialFormValues] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [successConfirmation, setSuccessConfirmation] = useState(false);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const data = await getEmployeeDetails(id); // Fetch employee details based on id
        setFormValues(data);
        setInitialFormValues(data);
      } catch (error) {
        console.error('Error fetching employee details:', error);
        // Handle error (e.g., show error message)
      }
    };

    fetchEmployeeData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
    // Clear the error message when the user starts typing
    setFormErrors({
      ...formErrors,
      [name]: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate(formValues);
    if (Object.keys(validationError).length > 0) {
      setFormErrors(validationError);
      return;
    }

    try {
      await updateEmployeeData(id, formValues); // Update employee data
      setSuccessConfirmation(true); // Show success modal
    } catch (error) {
      console.error('Error updating employee:', error);
      // Handle error (e.g., show error message)
    }
  };

  const validate = (values) => {
    const errors = {};

    // Validate each field as per your requirements
    if (!values.firstName) {
      errors.firstName = "Firstname is required!";
    }
    // Add similar validations for other fields

    return errors;
  };

  const handleConfirmClose = () => {
    if (isFormChanged()) {
      setFormValues(initialFormValues);
    } else {
      navigate('/admin/searchemployee');
    }
  };

  const handleCancelSuccess = () => {
    navigate('/admin/searchemployee');
  };

  const handleSubmitClick = () => {
    setSuccessConfirmation(false);
  };

  const isFormChanged = () => {
    // Check if any form values have changed from initialFormValues
    return (
      initialFormValues.firstName !== formValues.firstName ||
      initialFormValues.lastName !== formValues.lastName ||
      initialFormValues.address !== formValues.address ||
      initialFormValues.mobileNumber !== formValues.mobileNumber ||
      initialFormValues.emailId !== formValues.emailId ||
      initialFormValues.projectId !== formValues.projectId ||
      initialFormValues.aadharNumber !== formValues.aadharNumber ||
      initialFormValues.panNumber !== formValues.panNumber
      // Add similar checks for other fields
    );
  };

  return (
    <div className="background-clr">
      <form onSubmit={handleSubmit}>
        <h3>Edit Employee Details</h3>
        <div className="container employee-form">
          <div className="row">
            <div className="col-md-6 form-group">
              <label className="label">Firstname:</label>
              <input
                type="text"
                name="firstName"
                className="form-control"
                value={formValues.firstName || ''}
                onChange={handleChange}/>
              <p className="text-danger">{formErrors.firstName}</p>
            </div>
            <div className="col-md-6 form-group">
              <label className="label">Lastname:</label>
              <input
                type="text"
                name="lastName"
                className="form-control"
                value={formValues.lastName || ''}
                onChange={handleChange}/>
              <p className="text-danger">{formErrors.lastName}</p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 form-group">
              <label className="label">Address:</label>
              <textarea
                name="address"
                className="form-control"
                rows="5"
                value={formValues.address || ''}
                onChange={handleChange}></textarea>
              <p className="text-danger">{formErrors.address}</p>
            </div>
            <div className="col-md-6 form-group">
              <label className="label">Mobile Number:</label>
              <input
                type="text"
                name="mobileNumber"
                className="form-control"
                value={formValues.mobileNumber || ''}
                onChange={handleChange}/>
              <p className="text-danger">{formErrors.mobileNumber}</p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 form-group">
              <label className="label">Email Id:</label>
              <input
                type="text"
                name="emailId"
                className="form-control"
                value={formValues.emailId || ''}
                onChange={handleChange}/>
              <p className="text-danger">{formErrors.emailId}</p>
            </div>
            <div className="col-md-6 form-group">
              <label className="label">Project Id:</label>
              <input
                type="text"
                name="projectId"
                className="form-control"
                value={formValues.projectId || ''}
                onChange={handleChange}/>
              {/* <p className="text-danger">{formErrors.projectId}</p> */}
            </div>
            <div className="col-md-6 form-group">
              <label className="label">Aadhar Number:</label>
              <input
                type="text"
                name="aadharNumber"
                className="form-control"
                value={formValues.aadharNumber || ''}
                onChange={handleChange}/>
              <p className="text-danger">{formErrors.aadharNumber}</p>
            </div>
            <div className="col-md-6 form-group">
              <label className="label">Pan Number:</label>
              <input
                type="text"
                name="panNumber"
                className="form-control"
                value={formValues.panNumber || ''}
                onChange={handleChange}/>
              <p className="text-danger">{formErrors.panNumber}</p>
            </div>
          </div>
        </div>
        <div className="buttons">
          <button type="submit" className="btn btn-success mx-2">
            Submit
          </button>
          <button type="button" className="btn btn-secondary mx-2" onClick={handleCancelSuccess}>
            Cancel
          </button>
        </div>
      </form>

      {/* Success Confirmation Modal */}
      <Modal centered size='sm' show={successConfirmation} onHide={handleConfirmClose}>
        <Modal.Body>
          <div className="d-flex flex-column modal-success p-4 align-items-center ">
            <img src={successCheck} className="img-fluid mb-4" alt="successCheck" />
            <p className="mb-4 text-center">Employee Profile Updated Successfully</p>
            <button className="btn w-100 text-white" onClick={handleSubmitClick} style={{ backgroundColor: '#5EAC24' }}>Close</button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
