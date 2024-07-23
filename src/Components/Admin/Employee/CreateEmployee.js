import React, { useState, useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import NavPages from "../NavPages";
import { getLastEnteredEmployee, addEmployeeData, updateEmployeeData } from "../Employee/EmployeeService"; // Assuming you have functions for adding and updating employees
import '../../css/style.css';

const AddEmployeeData = () => {
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
    const fetchEmployeeData = async () => {
      const lastEntered = await getLastEnteredEmployee();
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
    };

    fetchEmployeeData();
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

  const handleSave = () => {
    const validationError = validate(formValues);
    if (Object.keys(validationError).length > 0) {
      setFormErrors(validationError);
    } else {
      setSuccessModalOpen(true);
    }
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode) {
        await updateEmployeeData(lastEnteredEmployee.employeeId, formValues);
      } else {
        await addEmployeeData(formValues);
      }
      setSuccessModalOpen(false);
      handleSuccess(); // Call handleSuccess after successful form submission
      navigate("/admin/employeeprofile");
    } catch (error) {
      console.error("Error while saving data:", error);
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

  const handleSuccess = async () => {
    try {
      setSuccessModalOpen(false);
      navigate("/admin/employeeprofile");
    } catch (error) {
      console.error("Error while navigating:", error);
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
        <form>
          <div>
            <h3> Create Profile </h3>
            <div className="container employee-form">
              <div className="row">
                <div className="col-md-6 form-group ">
                  <label className="label">Firstname<span className="required">*</span></label>
                  <input
                    type="text"
                    name="firstName"
                    className={`form-control ${formErrors.firstName ? 'is-invalid' : ''}`}
                    value={formValues.firstName}
                    onChange={handleChange}
                  />
                  {formErrors.firstName && <div className="invalid-feedback">{formErrors.firstName}</div>}
                </div>
                <div className="col-md-6 form-group">
                  <label className="label">Lastname<span className="required">*</span></label>
                  <input
                    type="text"
                    name="lastName"
                    className={`form-control ${formErrors.lastName ? 'is-invalid' : ''}`}
                    value={formValues.lastName}
                    onChange={handleChange}
                  />
                  {formErrors.lastName && <div className="invalid-feedback">{formErrors.lastName}</div>}
                </div>
                <div className="col-md-6 form-group">
                  <label className="label">Mobile Number<span className="required">*</span></label>
                  <input
                    type="text"
                    name="mobileNumber"
                    className={`form-control ${formErrors.mobileNumber ? 'is-invalid' : ''}`}
                    minLength={10}
                    maxLength={10}
                    value={formValues.mobileNumber}
                    onChange={handleChange}
                  />
                  {formErrors.mobileNumber && <div className="invalid-feedback">{formErrors.mobileNumber}</div>}
                </div>
                <div className="col-md-6 form-group">
                  <label className="label">Email Id<span className="required">*</span></label>
                  <input
                    type="text"
                    name="emailId"
                    className={`form-control ${formErrors.emailId ? 'is-invalid' : ''}`}
                    value={formValues.emailId}
                    onChange={handleChange}
                  />
                  {formErrors.emailId && <div className="invalid-feedback">{formErrors.emailId}</div>}
                </div>
                <div className="col-md-6 form-group">
                  <label className="label">Aadhar Number<span className="required">*</span></label>
                  <input
                    type="text"
                    name="aadharNumber"
                    className={`form-control ${formErrors.aadharNumber ? 'is-invalid' : ''}`}
                    minLength={12}
                    maxLength={12}
                    value={formValues.aadharNumber}
                    onChange={handleChange}
                  />
                  {formErrors.aadharNumber && <div className="invalid-feedback">{formErrors.aadharNumber}</div>}
                </div>
                <div className="col-md-6 form-group">
                  <label className="label">Pan Number<span className="required">*</span></label>
                  <input
                    type="text"
                    name="panNumber"
                    className={`form-control ${formErrors.panNumber ? 'is-invalid' : ''}`}
                    maxLength={10}
                    value={formValues.panNumber}
                    onChange={handleChange}
                  />
                  {formErrors.panNumber && <div className="invalid-feedback">{formErrors.panNumber}</div>}
                </div>
                <div className="col-md-12 form-group">
                  <label className="address">Address<span className="required">*</span></label>
                  <textarea
                    name="address"
                    className={`form-control ${formErrors.address ? 'is-invalid' : ''}`}
                    rows="5"
                    cols="50"
                    value={formValues.address}
                    onChange={handleChange}
                  ></textarea>
                  {formErrors.address && <div className="invalid-feedback">{formErrors.address}</div>}
                </div>
              </div>
            </div>
            <div className="buttons">
              <button type="button" className="btn btn-success mx-2" onClick={handleSave}>
                Save
              </button>
              <button type="button" className="btn btn-secondary mx-2" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        </form>

        <Modal show={isSuccessModalOpen} onHide={handleClose}>
          <Modal.Body>Do you want to Save?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmit}>Save</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default AddEmployeeData;
