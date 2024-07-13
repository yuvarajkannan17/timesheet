import React, { useState, useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getLastEnteredEmployee, addEmployeeData } from "../Employee/EmployeeService";
import { useLocation } from "react-router-dom";
import NavPages from "../NavPages";
import '../../css/style.css';

export default function AddEmployeeData() {
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    address: "",
    mobileNumber: "",
    emailId: "",
    aadharNumber: "",
    panNumber: "",
  });
  const [lastEnteredEmployee, setLastEnteredEmployee] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

   useEffect(() => {
    const lastEntered = getLastEnteredEmployee();
    setLastEnteredEmployee(lastEntered);
    setIsEditMode(location.search.includes("editMode=true"));
    
    if (lastEntered && location.search.includes("editMode=true")) {
      setFormValues({
        firstName: lastEntered.firstName,
        lastName: lastEntered.lastName,
        address: lastEntered.address,
        mobileNumber: lastEntered.mobileNumber,
        emailId: lastEntered.emailId,
        aadharNumber: lastEntered.aadharNumber,
        panNumber: lastEntered.panNumber,
      });
      setIsEditMode(true);
    } else {
      setFormValues({
        firstName: '',
        lastName: '',
        address: '',
        mobileNumber: '',
        emailId: '',
        aadharNumber: '',
        panNumber: '',
      });
      setIsEditMode(false);
    }
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate(formValues);
    if (Object.keys(validationError).length > 0) {
      setFormErrors(validationError);
      return;
    }

    
    try {
      const { data: existingData } = await axios.get(`http://localhost:8081/employee/getemployees?mobile=${formValues.mobileNumber}&email=${formValues.emailId}&aadhar=${formValues.aadharNumber}&pan=${formValues.panNumber}`);
      const errors = {};

      if (existingData.mobileNumber) {
        errors.mobileNumber = "Mobile number already exists";
      }

      if (existingData.emailId) {
        errors.emailId = "Email address already exists";
      }

      if (existingData.aadharNumber) {
        errors.aadharNumber = "Aadhar number already exists";
      }

      if (existingData.panNumber) {
        errors.panNumber = "PAN number already exists";
      }

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      setSuccessModalOpen(true);
    } catch (error) {
      console.error("Error while checking existing data:", error);
    }
  };

  const validate = (values) => {
    const errors = {};

    if (!values.firstName) {
      errors.firstName = "Firstname is required!";
    } else if (values.firstName.length > 50) {
      errors.firstName = "Firstname cannot exceed more than 50 characters";
    }

    if (!values.lastName) {
      errors.lastName = "Lastname is required!";
    } else if (values.lastName.length > 50) {
      errors.lastName = "Lastname cannot exceed more than 50 characters";
    }

    if (!values.address) {
      errors.address = "Address is required!";
    } else if (values.address.length > 100) {
      errors.address = "Address cannot exceed more than 100 characters";
    }

    if (!values.mobileNumber) {
      errors.mobileNumber = "Mobile Number is required!";
    } else if (values.mobileNumber.length !== 10) {
      errors.mobileNumber = "Mobile Number should be 10 characters";
    }

    if (!values.emailId) {
      errors.emailId = "Email Id is required!";
    } else if (!isValidEmail(values.emailId)) {
      errors.emailId = "This is not a valid email format";
    }

    // if (!values.projectid) {
    //   errors.projectid = "Project Id is required!";
    // } else if (!isValidProject(values.projectid)) {
    //   errors.projectid = "This is not a valid Project Id";
    // }

    if (!values.aadharNumber) {
      errors.aadharNumber = "Aadhar Number is required!";
    } else if (values.aadharNumber.length !== 12) {
      errors.aadharNumber = "Aadhar Number should be 12 characters";
    }

    if (!values.panNumber) {
      errors.panNumber = "Pan Number is required!";
    } else if (!isValidPan(values.panNumber)) {
      errors.panNumber = "This is not a valid Pan Number";
    }

    return errors;
  };

  const isValidEmail = (emailId) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailId);
  };

  const isValidPan = (panNumber) => {
    const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
    return panRegex.test(panNumber);
  };

  // const isValidProject = (project) => {
  //   const projectRegex = /^CTPL\d{5}$/;
  //   return projectRegex.test(project);
  // };

  // const navigate = useNavigate();

  const handleSuccess = async () => {
    try {
      if (isEditMode) {
        await axios.put(`http://localhost:8081/employee/${lastEnteredEmployee.employeeId}`, formValues);
        // Handle success update
      } else {
        await addEmployeeData(formValues);
        // Handle success creation
      }

      setFormValues({
        firstName: "",
        lastName: "",
        address: "",
        mobileNumber: "",
        emailId: "",
        aadharNumber: "",
        panNumber: "",
      });
      setSuccessModalOpen(false);
      navigate("/admin/employeeprofile");
    } catch (error) {
      console.error("Error while saving data:", error);
    }
  };

  const handleClose = () => {
    setSuccessModalOpen(false);
  };

  const handleCancel = () => {
    navigate('/admin');
  };


  return (
    <div className="background-clr">
      <NavPages />
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <h3> Create Profile </h3>
            <div className="container employee-form">
              <div className="row">
                <div className="col-md-6 form-group ">
                  <label className="label">Firstname<span className="required">*</span></label>
                  <input
                    type="text"
                    name="firstName"
                    className="form-control"
                    value={formValues.firstName}
                    onChange={handleChange}
                  />
                  <p className="text-danger"> {formErrors.firstName} </p>
                </div>
                <div className="col-md-6 form-group">
                  <label className="label">Lastname<span className="required">*</span></label>
                  <input
                    type="text"
                    name="lastName"
                    className="form-control"
                    value={formValues.lastName}
                    onChange={handleChange}
                  />
                  <p className="text-danger"> {formErrors.lastName} </p>
                </div>
                <div className="col-md-6 form-group">
                  <label className="label">Mobile Number<span className="required">*</span></label>
                  <input
                    type="text"
                    name="mobileNumber"
                    className="form-control"
                    minLength={10}
                    maxLength={10}
                    value={formValues.mobileNumber}
                    onChange={handleChange}
                  />
                  <p className="text-danger"> {formErrors.mobileNumber} </p>
                </div>
                <div className="col-md-6 form-group">
                  <label className="label">Email Id<span className="required">*</span></label>
                  <input
                    type="text"
                    name="emailId"
                    className="form-control"
                    value={formValues.emailId}
                    onChange={handleChange}
                  />
                  <p className="text-danger"> {formErrors.emailId} </p>
                </div>
                {/*  */}
               
                <div className="col-md-6 form-group">
                  <label className="label">Aadhar Number<span className="required">*</span></label>
                  <input
                    type="text"
                    name="aadharNumber"
                    className="form-control"
                    minLength={12}
                    maxLength={12}
                    value={formValues.aadharNumber}
                    onChange={handleChange}
                  />
                  <p className="text-danger"> {formErrors.aadharNumber} </p>
                  </div>
                  <div className="col-md-6 form-group">
                  <label className="label">Pan Number<span className="required">*</span></label>
                  <input
                    type="text"
                    name="panNumber"
                    className="form-control"
                    maxLength={10}
                    value={formValues.panNumber}
                    onChange={handleChange}
                  />
                  <p className="text-danger"> {formErrors.panNumber} </p>
                </div>
              
              
                <div className="col-md-12 form-group">
                  <label className="address">Address<span className="required">*</span></label>
                  <textarea
                    name="address"
                    className="form-control"
                    rows="5"
                    cols="50"
                    value={formValues.address}
                    onChange={handleChange}
                  ></textarea>
                  <p className="text-danger"> {formErrors.address} </p>
                </div>
                
              </div>
              
            </div>
            <div className="buttons">
              <button type="submit" className="btn btn-success mx-2">Save</button>
              <button type="button" className="btn btn-secondary mx-2" onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </form>
        <Modal show={isSuccessModalOpen} onHide={handleClose}>
          <Modal.Body>Do you want to Save?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Cancel</Button>
            <Button variant="primary" onClick={handleSuccess}>Save</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}