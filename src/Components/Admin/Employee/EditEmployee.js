import React, { useState, useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { getEmployeeData, getEmployeeDetails, updateEmployeeData, addEmployeeData  } from "../Employee/EmployeeService";
import { useParams, useNavigate } from "react-router-dom"
import '../../css/style.css'
import successCheck from '../../Image/checked.png'
import axios from 'axios';

export default function EditEmployee() {
  const { id } = useParams(); // Get the employee id from the route parameters
 
  const navigate = useNavigate();
  // const employeeData = getEmployeeDetails();   
  // const userData = employeeData.find((employee) => employee.id === parseInt(id, 10));
  const [formValues, setFormValues] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [SuccessConfirmation, setSuccessConfirmation] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState({});

  // 
  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const userData = await getEmployeeDetails(id);
        setFormValues(userData);
        setInitialFormValues(userData);
      } catch (error) {
        console.error("Error fetching employee details:", error);
        // Handle error as needed
      }
    };
    fetchEmployeeDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Clear the error message when the user starts typing
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    // e.preventDefault();
    e.preventDefault();
  console.log("Submitting form with data:", formValues); // Log the form values being submitted
  try {
    const validationError = validate(formValues);
    if (Object.keys(validationError).length > 0) {
      setFormErrors(validationError);
      return;
    } 

    // Check for duplicate mobile number, PAN number, Aadhar number, and email ID
    const existingEmployee = getEmployeeData().find(employee => (
      employee.id !== formValues.id && (
        employee.mobileNumber === formValues.mobileNumber ||
        employee.panNumber === formValues.panNumber ||
        employee.aadharNumber === formValues.aadharNumber ||
        employee.emailId === formValues.emailId
      )
    ));

    // Accumulate errors for duplicate fields
    const duplicateErrors = {};
    if (existingEmployee) {
      if (existingEmployee.mobileNumber === formValues.mobileNumber) {
        duplicateErrors.mobileNumber = "Mobile number already exists";
      }
      if (existingEmployee.panNumber === formValues.panNumber) {
        duplicateErrors.panNumber = "PAN number already exists";
      }
      if (existingEmployee.aadharNumber === formValues.aadharNumber) {
        duplicateErrors.aadharNumber = "Aadhar number already exists";
      }
      if (existingEmployee.emailId === formValues.emailId) {
        duplicateErrors.emailId = "Email ID already exists";
      }
    }

    // If there are duplicate errors, merge them with the validation errors and set them all at once
    if (Object.keys(duplicateErrors).length > 0) {
      setFormErrors(prevErrors => ({
        ...prevErrors,
        ...duplicateErrors,
      }));
      return;
    }

    // Update the employee data
    // updateEmployeeData(id, formValues);
    // setSuccessConfirmation(true);
    
      // Update the employee data
      addEmployeeData(formValues)
      const updatedEmployee = await updateEmployeeData(formValues.id, formValues); // Pass the updated formValues to the API

    console.log("Employee data updated successfully with API:", updatedEmployee);
      setSuccessConfirmation(true);
    } catch (error) {
      // Handle error as needed
      console.error('Error updating employee:', error);
    }
  };

  const validate = (values) => {
    const errors = {};
   
    if (!values.firstName) {
      errors.firstName = "firstName is required!";
    } else if (values.firstName.length > 50) {
      errors.firstName = "firstName cannot exceed more than 50 characters";
    }

    if (!values.lastName) {
      errors.lastName = "lastName is required!";
    } else if (values.lastName.length > 50) {
      errors.lastName = "lastName cannot exceed more than 50 characters";
    }

    if (!values.address) {
      errors.address = "Address is required!";
    } else if (values.address.length > 100) {
      errors.address = "Address cannot exceed more than 100 characters";
    }

    if (!values.mobileNumber) {
      errors.mobileNumber = "Mobile Number is required!";
    } else if (values.mobileNumber.length < 10) {
      errors.mobileNumber = "Mobile Number should be 10 characters";
    }

    if (!values.emailId) {
      errors.emailId = "Email Id is required!";
    } else if (!isValidEmail(values.emailId)) {
      errors.emailId = "This is not a valid email format";
    }

    if (!values.projectid) {
      errors.projectid = "Project Id is required!";
    } else if (!isValidProject(values.projectid)) {
      errors.projectid = "This is not a valid Project Id";
    }

    if (!values.aadharNumber) {
      errors.aadharNumber = "Aadhar Number is required!";
    } else if (values.aadharNumber.length < 12) {
      errors.aadharNumber = "Aadhar Number should be 12 characters";
    }

    if (!values.panNumber) {
      errors.panNumber = "Pan Number is required!";
    } else if (!isValidPan(values.panNumber)) {
      errors.panNumber = "This is not a valid Pan Number";
    }

    return errors;
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPan = (pan) => {
    const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
    return panRegex.test(pan);
  };

  const isValidProject = (project) => {
    const projectRegex = /^CTPL\d{5}$/;
    return projectRegex.test(project);
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
    
    setSuccessConfirmation(true);
    console.log(formValues)
  };

  const handleConfirmCancel = () => {
    navigate('/admin/searchemployee');
  };

  const isFormChanged = () => {
    return (
      initialFormValues.firstName !== formValues.firstName ||
      initialFormValues.lastName !== formValues.lastName ||
      initialFormValues.address !== formValues.address ||
      initialFormValues.mobileNumber !== formValues.mobileNumber ||
      initialFormValues.emailId !== formValues.emailId ||
      initialFormValues.projectid !== formValues.projectid ||
      initialFormValues.aadharNumber !== formValues.aadharNumber ||
      initialFormValues.panNumber !== formValues.panNumber
    );
  };

  return (
    <div className="background-clr">
      <form onSubmit={handleSubmit}>
        <div>
          <h3> Edit Employee Details </h3>
          <div className="container employee-form">
            <div className="row">
              <div className="col-md-6 form-group">
                <label className="label"> firstName: </label>
                <input
                  type="text"
                  name="firstName"
                  className="form-control"
                  value={formValues.firstName}
                  onChange={handleChange}/>
                <p className="text-danger"> {formErrors.firstName} </p>
              </div>
              <div className="col-md-6 form-group">
                <label className="label"> lastName: </label>
                <input
                  type="text"
                  name="lastName"
                  className="form-control"
                  value={formValues.lastName}
                  onChange={handleChange}/>
                <p className="text-danger"> {formErrors.lastName} </p>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 form-group">
                <label className="label"> Address: </label>
                <textarea                 
                  name="address"
                  className="form-control"
                  rows="5"
                  cols="50"
                  value={formValues.address}
                  onChange={handleChange}></textarea>
                <p className="text-danger"> {formErrors.address} </p>
              </div>
              <div className="col-md-6 form-group">
                <label className="label"> Mobile Number: </label>
                <input
                  type="text"
                  name="mobileNumber"
                  className="form-control" maxLength={10}
                  value={formValues.mobileNumber}
                  onChange={handleChange}/>
                <p className="text-danger"> {formErrors.mobileNumber} </p>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 form-group">
                <label className="label"> Email Id: </label>
                <input
                  type="text"
                  name="emailId"
                  className="form-control"
                  value={formValues.emailId}
                  onChange={handleChange}/>
                <p className="text-danger"> {formErrors.emailId} </p>
              </div>
              <div className="col-md-6 form-group">
                <label className="label"> Project Id: </label>
                <input
                  type="text"
                  name="projectid"
                  className="form-control"
                  value={formValues.projectid}
                  onChange={handleChange}/>
                {/* <p className="text-danger"> {formErrors.projectid} </p> */}
              </div>
              <div className="col-md-6 form-group">
                <label className="label"> Aadhar Number: </label>
                <input
                  type="text"
                  name="aadharNumber"
                  className="form-control" maxLength={12}
                  value={formValues.aadharNumber}
                  onChange={handleChange}/>
                <p className="text-danger"> {formErrors.aadharNumber} </p>
              </div>
              <div className="col-md-6 form-group">
                <label className="label"> Pan Number: </label>
                <input
                  type="text"
                  name="panNumber"
                  className="form-control"
                  value={formValues.panNumber}
                  onChange={handleChange}/>
                <p className="text-danger"> {formErrors.panNumber} </p>
              </div>
            </div>
          </div>
          <div className="buttons">              
            <button type="submit" className="btn btn-success mx-2" onClick={handleSubmitClick}>                
              Submit
            </button>
            <button type="button" className="btn btn-secondary mx-2" onClick={handleConfirmCancel}>                
              Cancel
            </button>
          </div>
        </div>
      </form>

      <Modal centered size='sm' show={SuccessConfirmation} onHide={handleConfirmClose}>          
        <Modal.Body>
          <div className="d-flex flex-column modal-success p-4 align-items-center ">
            <img src={successCheck} className="img-fluid mb-4" alt="successCheck" />                        
            <p className="mb-4 text-center">Employee Profile Updated Successfully</p>
            <button className="btn  w-100 text-white" onClick =  {handleConfirmClose} style={{ backgroundColor: '#5EAC24' }}>Close</button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

