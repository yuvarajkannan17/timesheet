import React, { useState, useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getEmployeeData, getLastEnteredEmployee, addEmployeeData } from "../Employee/EmployeeService";
import { useLocation } from "react-router-dom";
import NavPages from "../NavPages";
import '../../css/style.css';

export default function AddEmployeeData() {
  const [formValues, setFormValues] = useState({
    firstname: "",
    lastname: "",
    address: "",
    mobilenumber: "",
    emailid: "",
    projectid: "",
    aadharnumber: "",
    pannumber: "",
  });
  const [lastEnteredEmployee, setLastEnteredEmployee] = useState(null); // Lifted state up
  const projectOptions = ["CTPL00001", "CTPL00002", "CTPL00003", "CTPL00004"];

  const [isEditMode, setIsEditMode] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const lastEntered = getLastEnteredEmployee();
    setLastEnteredEmployee(lastEntered); // Update state with last entered employee data
    setIsEditMode(location.search.includes("editMode=true"));
    if (lastEnteredEmployee && location.search.includes("editMode=true")) {
      setFormValues({
        firstname: lastEnteredEmployee.firstname,
        lastname: lastEnteredEmployee.lastname,
        address: lastEnteredEmployee.address,
        mobilenumber: lastEnteredEmployee.mobilenumber,
        emailid: lastEnteredEmployee.emailid,
        projectid: lastEnteredEmployee.projectid,
        aadharnumber: lastEnteredEmployee.aadharnumber,
        pannumber: lastEnteredEmployee.pannumber,
      });

      setIsEditMode(true);
    } else {
      setFormValues({
        firstname: '',
        lastname: '',
        address: '',
        mobilenumber: '',
        emailid: '',
        projectid: '',
        aadharnumber: '',
        pannumber: '',
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
      const { data: existingData } = await axios.get(`http://localhost:8081/employee/getemployees?mobile=${formValues.mobilenumber}&email=${formValues.emailid}&aadhar=${formValues.aadharnumber}&pan=${formValues.pannumber}`);
      const errors = {};

      if (existingData.mobile) {
        errors.mobilenumber = "Mobile number already exists";
      }

      if (existingData.email) {
        errors.emailid = "Email address already exists";
      }

      if (existingData.aadhar) {
        errors.aadharnumber = "Aadhar number already exists";
      }

      if (existingData.pan) {
        errors.pannumber = "PAN number already exists";
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

  const navigate = useNavigate();

  const handleSuccess = async () => {
    try {
      if (isEditMode) {
        await axios.put(`http://localhost:8081/employee/{employeeId}${lastEnteredEmployee.id}`, formValues);
        // Handle success update
      } else {
        await axios.post('http://localhost:8081/employee/saveemployee', formValues);
        // Handle success creation
      }

      setFormValues({
        firstname: "",
        lastname: "",
        address: "",
        mobilenumber: "",
        emailid: "",
        projectid: "",
        aadharnumber: "",
        pannumber: "",
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
                    name="firstname"
                    className="form-control"
                    value={formValues.firstname}
                    onChange={handleChange}
                  />
                  <p className="text-danger"> {formErrors.firstname} </p>
                </div>
                <div className="col-md-6 form-group">
                  <label className="label">Lastname<span className="required">*</span></label>
                  <input
                    type="text"
                    name="lastname"
                    className="form-control"
                    value={formValues.lastname}
                    onChange={handleChange}
                  />
                  <p className="text-danger"> {formErrors.lastname} </p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 form-group">
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
                <div className="col-md-6 form-group">
                  <label className="label">Mobile Number<span className="required">*</span></label>
                  <input
                    type="text"
                    name="mobilenumber"
                    className="form-control"
                    minLength={10}
                    maxLength={10}
                    value={formValues.mobilenumber}
                    onChange={handleChange}
                  />
                  <p className="text-danger"> {formErrors.mobilenumber} </p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 form-group">
                  <label className="label">Email Id<span className="required">*</span></label>
                  <input
                    type="text"
                    name="emailid"
                    className="form-control"
                    value={formValues.emailid}
                    onChange={handleChange}
                  />
                  <p className="text-danger"> {formErrors.emailid} </p>
                </div>
                <div className="col-md-6 form-group">
                  <label className="label">Employee Id</label>
                  <input
                    disabled="disabled"
                    type="text"
                    name="employeeid"
                    className="form-control"
                    value={formValues.employeeid}
                    onChange={handleChange}
                  />
                  {/* <p className="text-danger"> {formErrors.employeeid} </p> */}
                </div>
                <div className="col-md-6 form-group">
                  <label className="label">Project Id</label>
                  <select
                    name="projectid"
                    className="form-control"
                    value={formValues.projectid}
                    onChange={handleChange}
                  >
                    <option value="">Select Project ID</option>
                    {projectOptions.map((projectId) => (
                      <option key={projectId} value={projectId}>{projectId}</option>
                    ))}
                  </select>
                  {/* <p className="text-danger"> {formErrors.projectid} </p> */}
                </div>
                <div className="col-md-6 form-group">
                  <label className="label">Aadhar Number<span className="required">*</span></label>
                  <input
                    type="text"
                    name="aadharnumber"
                    className="form-control"
                    minLength={12}
                    maxLength={12}
                    value={formValues.aadharnumber}
                    onChange={handleChange}
                  />
                  <p className="text-danger"> {formErrors.aadharnumber} </p>
                  <label className="label">Pan Number<span className="required">*</span></label>
                  <input
                    type="text"
                    name="pannumber"
                    className="form-control"
                    maxLength={10}
                    value={formValues.pannumber}
                    onChange={handleChange}
                  />
                  <p className="text-danger"> {formErrors.pannumber} </p>
                </div>
              </div>
            </div>
            <div className="buttons">
              <button type="submit" className="btn-submit btn-sm">Save</button>
              <button type="button" className="btn-cancel btn-sm" onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </form>
        <Modal show={isSuccessModalOpen} onHide={handleClose}>
          <Modal.Body>Do you want to Save</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Cancel</Button>
            <Button variant="primary" onClick={handleSuccess}>Save</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}