import React, { useState, useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useNavigate, useLocation } from "react-router-dom";
import { checkEmployeeDuplicates } from "../Employee/EmployeeService";
import { useSelector } from "react-redux";
import '../../css/style.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons from react-icons (or any other icon library)
 


const AddEmployeeData = () => {
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    address: "",
    mobileNumber: "",
    emailId: "",
    aadharNumber: "",
    panNumber: "",
    password: ""
  });
  const [formErrors, setFormErrors] = useState({});
  
  const [validationErrors, setValidationErrors] = useState({});
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const adminValue = useSelector(state=>state.adminLogin.value);
  const adminId=adminValue.adminId;
  

  useEffect(() => {
    if (location.state && location.state.employee) {
      setFormValues(location.state.employee);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear specific field errors on change
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    })); 
    

    // Clear duplicate errors for the field being edited
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validate = (values) => {
    const errors = {};
    if (!values.firstName) errors.firstName = "Firstname is required!";
    if (!values.lastName) errors.lastName = "Lastname is required!";
    if (!values.address) errors.address = "Address is required!";
    if (!values.mobileNumber || values.mobileNumber.length !== 10) errors.mobileNumber = "Mobile Number is required!";
    if (!values.emailId || !isValidEmail(values.emailId)) errors.emailId = "Email Id is required!";
    if (!values.aadharNumber || values.aadharNumber.length !== 12) errors.aadharNumber = "Aadhar Number is required!";
    if (!values.panNumber || !isValidPan(values.panNumber)) errors.panNumber = "Pan Number is required!";
    if (!values.password || !isValidPassword(values.password)) errors.password = "Password is required!";

    return errors;
  };

  const isValidEmail = (emailId) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailId);
  const isValidPan = (panNumber) => /[A-Z]{5}[0-9]{4}[A-Z]{1}/.test(panNumber);
  const isValidPassword = (password) => /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(password);

  const handleSave = async () => {
    const errors = validate(formValues);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      // Check for duplicates
      try {
        const duplicates = await checkEmployeeDuplicates(formValues);

        const newValidationErrors = {};

        // Check each field for duplicates and set validation errors if any
        if (duplicates.emailId) {
          newValidationErrors.emailId = 'Email ID already exists';
        }
        if (duplicates.panNumber) {
          newValidationErrors.panNumber = 'PAN Number already exists';
        }
        if (duplicates.mobileNumber) {
          newValidationErrors.mobileNumber = 'Mobile Number already exists';
        }
        if (duplicates.aadharNumber) {
          newValidationErrors.aadharNumber = 'Aadhar Number already exists';
        }

        if (Object.keys(newValidationErrors).length > 0) {
          setValidationErrors(newValidationErrors);
          return;
        }

        setSuccessModalOpen(true);
      } catch (error) {
        console.error('Error checking duplicates:', error);
        // Handle error, maybe show a user-friendly message
      }
    }
  };

  const handleSubmit = () => {
    // Save data to the server or state management here
    setSuccessModalOpen(false);
    navigate("/admin/employeeprofile", { state: { employee: formValues } });
  };

  const handleClose = () => {
    setSuccessModalOpen(false);
  };

  const handleCancel = () => {
    navigate('/admin');
  };
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="background-clr">
      <div>
        <form>
          <div>
            <h3>Create Employee</h3>
            <div className="container employee-form">
              <div className="row">
                <div className="col-md-6 form-group">
                  <label className="label">Firstname<span className="required">*</span></label>
                  <input
                    type="text"  
                    maxLength={50}                  
                    name="firstName"
                    className={`form-control ${formErrors.firstName || validationErrors.firstName ? 'is-invalid' : ''}`}
                    value={formValues.firstName}
                    onChange={handleChange}
                  />
                  {(formErrors.firstName || validationErrors.firstName) && <div className="invalid-feedback">{formErrors.firstName || validationErrors.firstName}</div>}
                </div>
                <div className="col-md-6 form-group">
                  <label className="label">Lastname<span className="required">*</span></label>
                  <input
                    type="text"
                    maxLength={50}
                    name="lastName"
                    className={`form-control ${formErrors.lastName || validationErrors.lastName ? 'is-invalid' : ''}`}
                    value={formValues.lastName}
                    onChange={handleChange}
                  />
                  {(formErrors.lastName || validationErrors.lastName) && <div className="invalid-feedback">{formErrors.lastName || validationErrors.lastName}</div>}
                </div>
                
                <div className="col-md-6 form-group">
                  <label className="label">Email Id<span className="required">*</span></label>
                  <input
                    type="email"
                    maxLength={100}
                    name="emailId"
                    className={`form-control ${formErrors.emailId || validationErrors.emailId ? 'is-invalid' : ''}`}
                    value={formValues.emailId}
                    onChange={handleChange}
                  />
                  {(formErrors.emailId || validationErrors.emailId) && <div className="invalid-feedback">{formErrors.emailId || validationErrors.emailId}</div>}
                </div>
                <div className="col-md-6 form-group">
      <label className="label">Password<span className="required">*</span></label>
      <div className="input-group">
        <input
          type={passwordVisible ? "text" : "password"}
          name="password"
          className={`form-control ${formErrors.password || validationErrors.password ? 'is-invalid' : ''}`}
          value={formValues.password}
          onChange={handleChange}
        />
        <div className="input-group-append">
          <span className="input-group-text" onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
            {passwordVisible ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>
        {(formErrors.password || validationErrors.password) && (
          <div className="invalid-feedback">
            {formErrors.password || validationErrors.password}
          </div>
        )}
      </div>
    </div>
                <div className="col-md-6 form-group">
                  <label className="label">Aadhar Number<span className="required">*</span></label>
                  <input
                    type="text"
                    maxLength={12}
                    name="aadharNumber"
                    className={`form-control ${formErrors.aadharNumber || validationErrors.aadharNumber ? 'is-invalid' : ''}`}
                    value={formValues.aadharNumber}
                    onChange={handleChange}
                  />
                  {(formErrors.aadharNumber || validationErrors.aadharNumber) && <div className="invalid-feedback">{formErrors.aadharNumber || validationErrors.aadharNumber}</div>}
                </div>
                <div className="col-md-6 form-group">
                  <label className="label">Pan Number<span className="required">*</span></label>
                  <input
                    type="text"                   
                    name="panNumber"
                    className={`form-control ${formErrors.panNumber || validationErrors.panNumber ? 'is-invalid' : ''}`}
                    value={formValues.panNumber}
                    onChange={handleChange}
                  />
                  {(formErrors.panNumber || validationErrors.panNumber) && <div className="invalid-feedback">{formErrors.panNumber || validationErrors.panNumber}</div>}
                </div>
                <div className="col-md-6 form-group">
                  <label className="label">Mobile Number<span className="required">*</span></label>
                  <input
                    type="text"
                    maxLength={10}
                    name="mobileNumber"
                    className={`form-control ${formErrors.mobileNumber || validationErrors.mobileNumber ? 'is-invalid' : ''}`}
                    value={formValues.mobileNumber}
                    onChange={handleChange}
                  />
                  {(formErrors.mobileNumber || validationErrors.mobileNumber) && <div className="invalid-feedback">{formErrors.mobileNumber || validationErrors.mobileNumber}</div>}
                </div>
                
                <div className="col-md-6 form-group">
                  <label className="label">Address<span className="required">*</span></label>
                  <textarea
                    name="address"
                    maxLength={100}
                    className={`form-control ${formErrors.address ? 'is-invalid' : ''}`}
                    value={formValues.address}
                    onChange={handleChange}
                  />
                  {formErrors.address && <div className="invalid-feedback">{formErrors.address}</div>}
                </div>
              </div>
              <div className="buttons">
                <button
                  type="button"
                  className="btn btn-success mx-2"
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-secondary mx-2"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <Modal show={isSuccessModalOpen} onHide={handleClose}>
        <Modal.Body>Do you want to save?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddEmployeeData;
