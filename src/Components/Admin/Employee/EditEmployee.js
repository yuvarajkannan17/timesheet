import React, { useState, useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { getEmployeeData, addEmployeeData  } from "../Employee/EmployeeService";
import { useParams, useNavigate } from "react-router-dom"
import '../../css/style.css'
import successCheck from '../../Image/checked.png'

export default function EditEmployee() {
  const { id } = useParams(); // Get the employee id from the route parameters
  const navigate = useNavigate();
  const employeeData = getEmployeeData();   
  const userData = employeeData.find((employee) => employee.id === parseInt(id, 10));
  const [formValues, setFormValues] = useState(userData || {});
  const [formErrors, setFormErrors] = useState({});
  const [SuccessConfirmation, setSuccessConfirmation] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState({});

  useEffect(() => {
    setInitialFormValues(userData || {});
  }, [userData]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validate(formValues);
    if (Object.keys(validationError).length > 0) {
      setFormErrors(validationError);
      return;
    } 

    // Check for duplicate mobile number, PAN number, Aadhar number, and email ID
    const existingEmployee = getEmployeeData().find(employee => (
      employee.id !== formValues.id && (
        employee.mobilenumber === formValues.mobilenumber ||
        employee.pannumber === formValues.pannumber ||
        employee.aadharnumber === formValues.aadharnumber ||
        employee.emailid === formValues.emailid
      )
    ));

    // Accumulate errors for duplicate fields
    const duplicateErrors = {};
    if (existingEmployee) {
      if (existingEmployee.mobilenumber === formValues.mobilenumber) {
        duplicateErrors.mobilenumber = "Mobile number already exists";
      }
      if (existingEmployee.pannumber === formValues.pannumber) {
        duplicateErrors.pannumber = "PAN number already exists";
      }
      if (existingEmployee.aadharnumber === formValues.aadharnumber) {
        duplicateErrors.aadharnumber = "Aadhar number already exists";
      }
      if (existingEmployee.emailid === formValues.emailid) {
        duplicateErrors.emailid = "Email ID already exists";
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
    addEmployeeData(formValues);
    setSuccessConfirmation(true);
  };

  const validate = (values) => {
    const errors = {};
   
    if (!values.firstname) {
      errors.firstname = "Firstname is required!";
    } else if (values.firstname.length > 50) {
      errors.firstname = "Firstname cannot exceed more than 50 characters";
    }

    if (!values.lastname) {
      errors.lastname = "Lastname is required!";
    } else if (values.lastname.length > 50) {
      errors.lastname = "Lastname cannot exceed more than 50 characters";
    }

    if (!values.address) {
      errors.address = "Address is required!";
    } else if (values.address.length > 100) {
      errors.address = "Address cannot exceed more than 100 characters";
    }

    if (!values.mobilenumber) {
      errors.mobilenumber = "Mobile Number is required!";
    } else if (values.mobilenumber.length !== 10) {
      errors.mobilenumber = "Mobile Number should be 10 characters";
    }

    if (!values.emailid) {
      errors.emailid = "Email Id is required!";
    } else if (!isValidEmail(values.emailid)) {
      errors.emailid = "This is not a valid email format";
    }

    if (!values.projectid) {
      errors.projectid = "Project Id is required!";
    } else if (!isValidProject(values.projectid)) {
      errors.projectid = "This is not a valid Project Id";
    }

    if (!values.aadharnumber) {
      errors.aadharnumber = "Aadhar Number is required!";
    } else if (values.aadharnumber.length !== 12) {
      errors.aadharnumber = "Aadhar Number should be 12 characters";
    }

    if (!values.pannumber) {
      errors.pannumber = "Pan Number is required!";
    } else if (!isValidPan(values.pannumber)) {
      errors.pannumber = "This is not a valid Pan Number";
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
    setSuccessConfirmation(false);
  };

  const handleConfirmCancel = () => {
    navigate('/admin/searchemployee');
  };

  const isFormChanged = () => {
    return (
      initialFormValues.firstname !== formValues.firstname ||
      initialFormValues.lastname !== formValues.lastname ||
      initialFormValues.address !== formValues.address ||
      initialFormValues.mobilenumber !== formValues.mobilenumber ||
      initialFormValues.emailid !== formValues.emailid ||
      initialFormValues.projectid !== formValues.projectid ||
      initialFormValues.aadharnumber !== formValues.aadharnumber ||
      initialFormValues.pannumber !== formValues.pannumber
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
                <label className="label"> Firstname: </label>
                <input
                  type="text"
                  name="firstname"
                  className="form-control"
                  value={formValues.firstname}
                  onChange={handleChange}/>
                <p className="text-danger"> {formErrors.firstname} </p>
              </div>
              <div className="col-md-6 form-group">
                <label className="label"> Lastname: </label>
                <input
                  type="text"
                  name="lastname"
                  className="form-control"
                  value={formValues.lastname}
                  onChange={handleChange}/>
                <p className="text-danger"> {formErrors.lastname} </p>
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
                  name="mobilenumber"
                  className="form-control"
                  value={formValues.mobilenumber}
                  onChange={handleChange}/>
                <p className="text-danger"> {formErrors.mobilenumber} </p>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 form-group">
                <label className="label"> Email Id: </label>
                <input
                  type="text"
                  name="emailid"
                  className="form-control"
                  value={formValues.emailid}
                  onChange={handleChange}/>
                <p className="text-danger"> {formErrors.emailid} </p>
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
                  name="aadharnumber"
                  className="form-control"
                  value={formValues.aadharnumber}
                  onChange={handleChange}/>
                <p className="text-danger"> {formErrors.aadharnumber} </p>
              </div>
              <div className="col-md-6 form-group">
                <label className="label"> Pan Number: </label>
                <input
                  type="text"
                  name="pannumber"
                  className="form-control"
                  value={formValues.pannumber}
                  onChange={handleChange}/>
                <p className="text-danger"> {formErrors.pannumber} </p>
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