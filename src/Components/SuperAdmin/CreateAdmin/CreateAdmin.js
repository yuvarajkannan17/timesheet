
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
            firstName: "",
            lastName: "",
            address: "",
            mobileNumber: "",
            emailId: "",
            aadharNumber: "",
            panNumber: "",
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
        if (values.mobileNumber && touched.mobileNumber) {
            setPhoneError(''); // Clear custom phone error when input changes
        }
       
    }, [values.mobileNumber]);

    useEffect(() => {
        if (values.panNumber && touched.panNumber) {
            setPanError(''); // Clear custom phone error when input changes
        }
       
    }, [values.pan]);

    useEffect(() => {
        if (values.aadharNumber&& touched.aadharNumber) {
            setAadharError(''); // Clear custom phone error when input changes
        }
       
    }, [values.aadharNumber]);

    useEffect(() => {
        if (values.emailId && touched.emailId) {
            setUserAlreadyExit(''); // Clear custom phone error when input changes
        }
       
    }, [values.emailId]);
    

    // function for api call after form submission

    async function onSubmit(values, actions) {
        let formHasErrors = false;

        // Checking if the email is already in use
        const emailExists = adminDatas.some(admin => admin.email === values.emailId);
        if (emailExists) {
            setUserAlreadyExit('Email already in use');
            formHasErrors = true;
        }

        // Checking if the phone number is already in use
        const phoneExists = adminDatas.some(admin => admin.phone === values.mobileNumber);
        if (phoneExists) {
            // Assuming you have a state setter for phone error
            setPhoneError('Phone number already in use');
            formHasErrors = true;
        }

        // Checking if the Aadhar number is already in use
        const aadharExists = adminDatas.some(admin => admin.aadhar === values.aadharNumber);
        if (aadharExists) {
            // Assuming you have a state setter for Aadhar error
            setAadharError('Aadhar number already in use');
            formHasErrors = true;
        }

        // Checking if the PAN number is already in use
        const panExists = adminDatas.some(admin => admin.pan === values.panNumber);
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
            console.log("some")
            
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
                                        <input type="text" maxLength={50} className={`form-control  ${errors.firstName && touched.firstName ? "sprAdmin-createAdmin-input-br-error" : ""}`} name="firstName" id="firstName" onChange={handleChange} onBlur={handleBlur} value={values.firstName} ></input>
                                        {errors.firstName && touched.firstName && <p className="sprAdmin-createAdmin-error-message small mt-1">{errors.firstName}</p>}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="lastName" className="form-label">Last Name<span style={{ color: 'red' }}>*</span> </label>
                                        <input type="text" maxLength={50} className={`form-control  ${errors.lastName && touched.lastName ? "sprAdmin-createAdmin-input-br-error" : ""}`} name="lastName" id="lastName" onChange={handleChange} onBlur={handleBlur} value={values.lastName} ></input>
                                        {errors.lastName && touched.lastName && <p className="sprAdmin-createAdmin-error-message small mt-1">{errors.lastName}</p>}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="address" className="form-label">Address<span style={{ color: 'red' }}>*</span>  </label>
                                        <textarea maxLength={100} className={`form-control sprAdmin-createAdmin-address  ${errors.address && touched.address ? "sprAdmin-createAdmin-input-br-error" : ""}`} name="address" id="address" onChange={handleChange} onBlur={handleBlur} value={values.address}></textarea>
                                        {errors.address && touched.address && <p className="sprAdmin-createAdmin-error-message small mt-1">{errors.address}</p>}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="emailId" className="form-label">Email Id<span style={{ color: 'red' }}>*</span>  </label>
                                        <input type="email" maxLength={100} className={`form-control  ${errors.emailId && touched.emailId ? "sprAdmin-createAdmin-input-br-error" : ""}`} name="emailId" id="emailId" onChange={handleChange} onBlur={handleBlur} value={values.emailId} ></input>
                                        {errors.emailId && touched.emailId && <p className="sprAdmin-createAdmin-error-message small mt-1">{errors.emailId}</p>}
                                        {userAlreadyExit && <p className="sprAdmin-createAdmin-error-message small mt-1">{userAlreadyExit}</p>}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="mobileNumber" className="form-label">Phone Number<span style={{ color: 'red' }}>*</span> </label>
                                        <input type="text" maxLength={10} className={`form-control  ${errors.mobileNumber && touched.mobileNumber ? "sprAdmin-createAdmin-input-br-error" : ""}`} name="mobileNumber" id="mobileNumber" onChange={handleChange} onBlur={handleBlur} value={values.mobileNumber} ></input>
                                       {errors.mobileNumber && touched.mobileNumber && <p className="sprAdmin-createAdmin-error-message small mt-1">{errors.mobileNumber}</p>}
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
                                        <input type="text" maxLength={12} className={`form-control  ${errors.aadharNumber && touched.aadharNumber ? "sprAdmin-createAdmin-input-br-error" : ""}`} name="aadharNumber" id="aadharNumber" onChange={handleChange} onBlur={handleBlur} value={values.aadharNumber} ></input>
                                        {errors.aadharNumber && touched.aadharNumber && <p className="sprAdmin-createAdmin-error-message small mt-1">{errors.aadharNumber}</p>}
                                        {aadharError && <p className="sprAdmin-createAdmin-error-message small mt-1">{aadharError}</p>}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="panNumber" className="form-label">Pan Number<span style={{ color: 'red' }}>*</span> </label>
                                        <input type="text" maxLength={10} className={`form-control  ${errors.panNumber && touched.panNumber ? "sprAdmin-createAdmin-input-br-error" : ""}`} name="panNumber" id="panNumber" onChange={handleChange} onBlur={handleBlur} value={values.panNumber} ></input>
                                        {errors.panNumber && touched.panNumber && <p className="sprAdmin-createAdmin-error-message small mt-1">{errors.panNumber}</p>}
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