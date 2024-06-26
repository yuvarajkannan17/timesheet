
import { useFormik } from "formik";
import './CreateAdmin.css'
import { basicSchema } from './ValidationSchema'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import url from '../../Api/data'
import { useSelector } from 'react-redux';
import { successModal, failureModal, deleteSuccessModal } from '../../features/modal';
import { useDispatch } from 'react-redux';
import { Modal } from 'react-bootstrap';
import failedCheck from '../../Image/failed.png'
import successCheck from '../../Image/checked.png'
import SuperAdminNav from "../Navbar/SuperAdminNav";
function CreateAdmin() {

    // for navigation 
    let navigate = useNavigate();
    const [adminDatas, setAdminDatas] = useState(null);
    const [userAlreadyExit, setUserAlreadyExit] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [aadharError, setAadharError] = useState('');
    const [panError, setPanError] = useState('');
    
    const [createAdminError, setCreateAdminError] = useState('');
    // redux state 
    const modal = useSelector(state => state.modal.value)
    const showFailureModal = modal.failureModal;
   
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchDataFromApi = async () => {
            try {
                const response = await axios.get("http://localhost:8080/admins/getadmins");
                // Handle the response here if needed
                setAdminDatas(response.data);
            } catch (error) {
                // Handle errors here
                console.error('Error fetching data:', error);
            }
        };

        fetchDataFromApi();
    }, []);
    // formik for form value

    const { values, isSubmitting, handleChange, handleBlur, errors, handleSubmit, touched, resetForm } = useFormik({
        initialValues: {
            fname: "",
            lname: "",
            address: "",
            phone: "",
            email: "",
            aadhar: "",
            pan: "",
            employeeAccess: {
                create: false,
                edit: false,
                delete: false
            },

            projectAccess: {
                create: false,
                edit: false,
                delete: false
            }

        },
        validationSchema: basicSchema,
        onSubmit
    })

    useEffect(() => {
        if (values.phone && touched.phone) {
            setPhoneError(''); // Clear custom phone error when input changes
        }
       
    }, [values.phone]);

    useEffect(() => {
        if (values.pan && touched.pan) {
            setPanError(''); // Clear custom phone error when input changes
        }
       
    }, [values.pan]);

    useEffect(() => {
        if (values.aadhar&& touched.aadhar) {
            setAadharError(''); // Clear custom phone error when input changes
        }
       
    }, [values.aadhar]);

    useEffect(() => {
        if (values.email && touched.email) {
            setUserAlreadyExit(''); // Clear custom phone error when input changes
        }
       
    }, [values.email]);
    

    // function for api call after form submission

    async function onSubmit(values, actions) {
        let formHasErrors = false;

        // Checking if the email is already in use
        const emailExists = adminDatas.some(admin => admin.email === values.email);
        if (emailExists) {
            setUserAlreadyExit('Email already in use');
            formHasErrors = true;
        }

        // Checking if the phone number is already in use
        const phoneExists = adminDatas.some(admin => admin.phone === values.phone);
        if (phoneExists) {
            // Assuming you have a state setter for phone error
            setPhoneError('Phone number already in use');
            formHasErrors = true;
        }

        // Checking if the Aadhar number is already in use
        const aadharExists = adminDatas.some(admin => admin.aadhar === values.aadhar);
        if (aadharExists) {
            // Assuming you have a state setter for Aadhar error
            setAadharError('Aadhar number already in use');
            formHasErrors = true;
        }

        // Checking if the PAN number is already in use
        const panExists = adminDatas.some(admin => admin.pan === values.pan);
        if (panExists) {
            // Assuming you have a state setter for PAN error
            setPanError('PAN number already in use');
            formHasErrors = true;
        }

        if (formHasErrors) {
            return; // Stop the form submission if there are errors
        }

        // Convert boolean values to string for API compatibility
        values.employeeAccess = JSON.stringify(values.employeeAccess);
        values.projectAccess = JSON.stringify(values.projectAccess);

        try {
            const response = await axios.post("http://localhost:8080/admins/saveadmin", values);
            dispatch(successModal(true));
            actions.resetForm();
            navigate('/superadmin/searchadmin');
            
        } catch (error) {
            setCreateAdminError(error.message);
            dispatch(failureModal(true));
        }
    }




    //    reset function for form field
    const handleCancel = () => {
        resetForm();
    };



    return (
        <>
            <SuperAdminNav />
            <div className="ti-background-clr">
                <div className="sprAdmin-createAdmin">
                    <p className="sprAdmin-createAdmin-title ">Create Profile</p>
                    <form onSubmit={handleSubmit}>
                        <div className="sprAdmin-createAdmin-body border border-1 border-dark rounded p-4">
                            {/* create admin user form */}
                            <div className="row sprAdmin-createAdmin-form" >
                                {/* col-5 under the row */}
                                <div className="col-md-5" >

                                    <div className="mb-3">
                                        <label htmlFor="firstName" className="form-label">First Name<span style={{ color: 'red' }}>*</span> </label>
                                        <input type="text" maxLength={50} className={`form-control  ${errors.fname && touched.fname ? "sprAdmin-createAdmin-input-br-error" : ""}`} name="fname" id="firstName" onChange={handleChange} onBlur={handleBlur} value={values.fname} ></input>
                                        {errors.fname && touched.fname && <p className="sprAdmin-createAdmin-error-message small mt-1">{errors.fname}</p>}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="lastName" className="form-label">Last Name<span style={{ color: 'red' }}>*</span> </label>
                                        <input type="text" maxLength={50} className={`form-control  ${errors.lname && touched.lname ? "sprAdmin-createAdmin-input-br-error" : ""}`} name="lname" id="lastName" onChange={handleChange} onBlur={handleBlur} value={values.lname} ></input>
                                        {errors.lname && touched.lname && <p className="sprAdmin-createAdmin-error-message small mt-1">{errors.lname}</p>}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="address" className="form-label">Address<span style={{ color: 'red' }}>*</span>  </label>
                                        <textarea maxLength={100} className={`form-control sprAdmin-createAdmin-address  ${errors.address && touched.address ? "sprAdmin-createAdmin-input-br-error" : ""}`} name="address" id="address" onChange={handleChange} onBlur={handleBlur} value={values.address}></textarea>
                                        {errors.address && touched.address && <p className="sprAdmin-createAdmin-error-message small mt-1">{errors.address}</p>}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email Id<span style={{ color: 'red' }}>*</span>  </label>
                                        <input type="email" maxLength={100} className={`form-control  ${errors.email && touched.email ? "sprAdmin-createAdmin-input-br-error" : ""}`} name="email" id="email" onChange={handleChange} onBlur={handleBlur} value={values.email} ></input>
                                        {errors.email && touched.email && <p className="sprAdmin-createAdmin-error-message small mt-1">{errors.email}</p>}
                                        {userAlreadyExit && <p className="sprAdmin-createAdmin-error-message small mt-1">{userAlreadyExit}</p>}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="phone" className="form-label">Phone Number<span style={{ color: 'red' }}>*</span> </label>
                                        <input type="text" maxLength={10} className={`form-control  ${errors.phone && touched.phone ? "sprAdmin-createAdmin-input-br-error" : ""}`} name="phone" id="phone" onChange={handleChange} onBlur={handleBlur} value={values.phone} ></input>
                                       {errors.phone && touched.phone && <p className="sprAdmin-createAdmin-error-message small mt-1">{errors.phone}</p>}
                                       {phoneError && <p className="sprAdmin-createAdmin-error-message small mt-1">{phoneError}</p>}
                                    </div>
                                </div>
                                {/* Skip the next 1 columns */}
                                <div className="col-1 offset-1">
                                    {/* This column is offset by 1 columns  */}
                                </div>
                                {/* col-5 under the row */}
                                <div className="col-md-5" >
                                    <div className="mb-3">
                                        <label htmlFor="aadharNumber" className="form-label">Aadhar Number<span style={{ color: 'red' }}>*</span> </label>
                                        <input type="text" maxLength={12} className={`form-control  ${errors.aadhar && touched.aadhar ? "sprAdmin-createAdmin-input-br-error" : ""}`} name="aadhar" id="aadharNumber" onChange={handleChange} onBlur={handleBlur} value={values.aadhar} ></input>
                                        {errors.aadhar && touched.aadhar && <p className="sprAdmin-createAdmin-error-message small mt-1">{errors.aadhar}</p>}
                                        {aadharError && <p className="sprAdmin-createAdmin-error-message small mt-1">{aadharError}</p>}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="panNumber" className="form-label">Pan Number<span style={{ color: 'red' }}>*</span> </label>
                                        <input type="text" maxLength={10} className={`form-control  ${errors.pan && touched.pan ? "sprAdmin-createAdmin-input-br-error" : ""}`} name="pan" id="panNumber" onChange={handleChange} onBlur={handleBlur} value={values.pan} ></input>
                                        {errors.pan && touched.pan && <p className="sprAdmin-createAdmin-error-message small mt-1">{errors.pan}</p>}
                                        {panError && <p className="sprAdmin-createAdmin-error-message small mt-1">{panError}</p>}
                                    </div>
                                    {/* checkboxes */}
                                    <div className="form-group">
                                        {/* checkbox for employee access */}
                                        <div>

                                            <label htmlFor="checkBoxGroupTitle d-block" >Access Permission for Employee details </label>
                                            <div className="form-check ">
                                                <input className="form-check-input sprAdmin-createAdmin-checkbox-create" name="employeeAccess.create" type="checkbox" id="empcreate" checked={values.employeeAccess.create} onBlur={handleBlur} onChange={handleChange}></input>
                                                <label className="form-check-label" htmlFor="empcreate">Create</label>

                                            </div>
                                            <div className="form-check ">
                                                <input className="form-check-input sprAdmin-createAdmin-checkbox-edit" name="employeeAccess.edit" type="checkbox" id="empedit" checked={values.employeeAccess.edit} onBlur={handleBlur} onChange={handleChange}></input>
                                                <label className="form-check-label" htmlFor="empedit">Edit</label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input sprAdmin-createAdmin-checkbox-delete" name="employeeAccess.delete" type="checkbox" id="empdelete" checked={values.employeeAccess.delete} onBlur={handleBlur} onChange={handleChange}></input>
                                                <label className="form-check-label" htmlFor="empdelete">Delete</label>
                                            </div>

                                        </div>
                                        {/* checkbox for project access */}
                                        <div className="mt-4">

                                            <label htmlFor="checkBoxGroupTitle d-block">Access Permission for Project details </label>
                                            <div className="form-check ">
                                                <input className="form-check-input sprAdmin-createAdmin-checkbox-create" name="projectAccess.create" type="checkbox" id="pjcreate" checked={values.projectAccess.create} onBlur={handleBlur} onChange={handleChange}></input>
                                                <label className="form-check-label" htmlFor="pjcreate">Create</label>
                                            </div>
                                            <div className="form-check ">
                                                <input className="form-check-input sprAdmin-createAdmin-checkbox-edit" name="projectAccess.edit" type="checkbox" id="pjedit" checked={values.projectAccess.edit} onBlur={handleBlur} onChange={handleChange}></input>
                                                <label className="form-check-label" htmlFor="pjedit">Edit</label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input sprAdmin-createAdmin-checkbox-delete" name="projectAccess.delete" type="checkbox" id="pjdelete" checked={values.projectAccess.delete} onBlur={handleBlur} onChange={handleChange}></input>
                                                <label className="form-check-label" htmlFor="pjdelete">Delete</label>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* buttons for save & reset form */}
                        <div className="ti-common-buttons d-flex flex-wrap justify-content-end my-3 mx-5">
                            <button type="submit" disabled={isSubmitting} className="btn btn-success ">Save</button>
                            <button type="button" className="btn btn-info" onClick={handleCancel}>Cancel</button>
                        </div>
                    </form>

                </div>
                {/* modal for form submission failed */}
                <Modal className="custom-modal" style={{ left: '50%', transform: 'translateX(-50%)' }} dialogClassName="modal-dialog-centered" show={showFailureModal}  >
                    <div className="d-flex flex-column modal-success p-4 align-items-center ">
                        <img src={failedCheck} className="img-fluid mb-4" alt="failedCheck" />
                        <p className="mb-4 text-center">{createAdminError}</p>
                        <button className="btn  w-100 text-white" onClick={() => { dispatch(failureModal(false)) }} style={{ backgroundColor: '#F44336' }}>Close</button>
                    </div>
                </Modal>

               
            </div>


        </>
    )
}


export default CreateAdmin;