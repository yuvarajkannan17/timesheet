import { Container, Navbar } from 'react-bootstrap';
import { Modal,Button } from 'react-bootstrap';
import successCheck from '../../Image/checked.png'
import chiselonLogo from '../../Image/logochiselon.png'
import React, { useState, useEffect } from 'react';
import { useFormik } from "formik";
import { basicSchema } from '../CreateAdmin/ValidationSchema';
import './adminEdit.css'
import url from '../../Api/data'
import axios from 'axios';
import { useDispatch,useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { adminDetailsEdit } from '../../features/adminDetails';
import { editSuccessModal } from '../../features/modal';

function AdminEdit() {
    // editable id from searchadmin page
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // setting error message if user email already exit
    const [userAlreadyExit, setUserAlreadyExit] = useState('');
    // admin list exclude current edit admin 
    const [adminDatas, setAdminDatas] = useState(null);
    // for edit confirmation modal
    const [confirmationForEdit,setConfirmationForEdit]=useState(false)
    // edit admin datas
    const [editAdminData, setEditAdminData] = useState(null);
    // date and time
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    
  
// fetch the edit admin data once come from the search page
    useEffect(() => {
        async function getDataFromApi() {
            try {
                const response = await axios.get(`${url}/${id}`);
                setEditAdminData(response.data);
            } catch (error) {
                console.error('Error:', error);
            }
        }

        getDataFromApi();
    }, [id]);

    // filtering data from api, exclude current admin data for form validation
    useEffect(() => {

        const fetchDataFromApi = async () => {
            try {
                const response = await axios.get(url);
                // Handle the response here if needed
                const datas=response.data;
                const filterData=datas.filter((data)=>data.id!==id)
                setAdminDatas(filterData);
            } catch (error) {
                // Handle errors here
                console.error('Error fetching data:', error);
            }
        };

        fetchDataFromApi();

        // Update the currentDateTime state every second
        const intervalId = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        // Clean up the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, []); // Empty dependency array ensures the effect runs only once after initial render

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' }; const formattedDateTime = currentDateTime.toLocaleDateString(undefined, options);
// to get form input by formik
    const { values, isSubmitting, handleChange, handleBlur, errors, handleSubmit, touched, resetForm, setValues } = useFormik({
        initialValues: {
            fName: "",
            lName: "",
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

    // set the value into edit form field

    useEffect(() => {
        if (editAdminData) {
            setValues(editAdminData);
        }
    }, [editAdminData, setValues]);
  

    // trigger the confirmation popup
     function onSubmit() {
        
        setConfirmationForEdit(true);
       
    }

    // cancel the edit changes
    function editCancelConfirmation(){
         setConfirmationForEdit(false);
    }

    // save the edit changes
   async function editSaveConfirmation(){
        setConfirmationForEdit(false);
         try{
            const exitingAdmin = adminDatas.find((data) => data.email === values.email);
             if(exitingAdmin){
                setUserAlreadyExit("This user email is already exit ")

             }else{
                await axios.put(`${url}/${id}`, values);

                dispatch(adminDetailsEdit(true));
                dispatch(editSuccessModal(true));
                navigate('/searchAdmin/' + id)
             }


        }catch(error){
           console.log('while submitting edit form',error)
        }
    }

// reset the form
    const handleCancel = () => {
        resetForm();
        navigate('/searchAdmin')
    };

    return (
        <>

            {/* navbar header */}
            <header>
                < Navbar className="approvelHeader d-block">
                    <Container className='d-flex justify-content-between align-items-center'>

                        <Navbar.Brand href="#home">
                            <img
                                src={chiselonLogo}
                                width="35"
                                height="35"
                                className="d-inline-block align-top"
                                alt="chiselon logo"
                            />

                        </Navbar.Brand>
                        <div className=''>
                            <h3 className='text-white mx-auto '>Timesheet</h3>
                        </div>
                        <div className='text-white  signInSymbol ' >
                            <p className="mb-0">Y</p>
                        </div>
                    </Container>
                    <Container className=' d-flex justify-content-end mt-2 small  text-warning' >
                        <p className='text-end'>{formattedDateTime}</p>
                    </Container>
                </Navbar>
            </header>
            <section>
                <div className='editAdmin'>
                    <div className='editAdmin-content'>

                        <div className='editAdmin-title'>
                            <p>Edit Admin Profile</p>
                        </div>
                        <div className='editAdmin-body'>
                        {/* edit form */}
                            <form onSubmit={handleSubmit}>
                                <div className=" bg-white border border-1 border-dark rounded">

                                    <div className="row editAdmin-form my-4" >
                                        {/* col-5 under the row */}
                                        <div className="col-md-5" >
                                            <div className="mb-3">
                                                <label htmlFor="admin-id" className="form-label">Admin Id</label>
                                                <input type="text" className="form-control" name="admin-id" id="admin-id" onChange={handleChange} onBlur={handleBlur} value={values.id} disabled ></input>

                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="firstName" className="form-label">First Name</label>
                                                <input type="text" maxLength={50} className={`form-control  ${errors.fName && touched.fName ? "input-error" : ""}`} name="fName" id="firstName" onChange={handleChange} onBlur={handleBlur} value={values.fName} ></input>
                                                {errors.fName && touched.fName && <p className="error-message small mt-1">{errors.fName}</p>}
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="lastName" className="form-label">Last Name</label>
                                                <input type="text" maxLength={50} className={`form-control  ${errors.lName && touched.lName ? "input-error" : ""}`} name="lName" id="lastName" onChange={handleChange} onBlur={handleBlur} value={values.lName} ></input>
                                                {errors.lName && touched.lName && <p className="error-message small mt-1">{errors.lName}</p>}
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="address" className="form-label">Address </label>
                                                <textarea maxLength={100} className={`form-control  ${errors.address && touched.address ? "input-error" : ""}`} name="address" id="address" onChange={handleChange} onBlur={handleBlur} value={values.address}></textarea>
                                                {errors.address && touched.address && <p className="error-message small mt-1">{errors.address}</p>}
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="email" className="form-label">Email Id </label>
                                                <input type="email" maxLength={100} className={`form-control  ${errors.email && touched.email ? "input-error" : ""}`} name="email" id="email" onChange={handleChange} onBlur={handleBlur} value={values.email} ></input>
                                                {errors.email && touched.email && <p className="error-message small mt-1">{errors.email}</p>}
                                                {userAlreadyExit && <p className="error-message small mt-1">{userAlreadyExit}</p>}
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="phone" className="form-label">Phone Number</label>
                                                <input type="text" maxLength={10} className={`form-control  ${errors.phone && touched.phone ? "input-error" : ""}`} name="phone" id="phone" onChange={handleChange} onBlur={handleBlur} value={values.phone} ></input>
                                                {errors.phone && touched.phone && <p className="error-message small mt-1">{errors.phone}</p>}
                                            </div>
                                        </div>
                                        {/* Skip the next 1 columns */}
                                        <div className="col-1 offset-1">
                                            {/* This column is offset by 1 columns  */}
                                        </div>
                                        {/* col-5 under the row */}
                                        <div className="col-md-5" >
                                            <div className="mb-3">
                                                <label htmlFor="aadharNumber" className="form-label">Aadhar Number</label>
                                                <input type="text" maxLength={12} className={`form-control  ${errors.aadhar && touched.aadhar ? "input-error" : ""}`} name="aadhar" id="aadharNumber" onChange={handleChange} onBlur={handleBlur} value={values.aadhar} ></input>
                                                {errors.aadhar && touched.aadhar && <p className="error-message small mt-1">{errors.aadhar}</p>}
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="panNumber" className="form-label">Pan Number</label>
                                                <input type="text" maxLength={10} className={`form-control  ${errors.pan && touched.pan ? "input-error" : ""}`} name="pan" id="panNumber" onChange={handleChange} onBlur={handleBlur} value={values.pan} ></input>
                                                {errors.pan && touched.pan && <p className="error-message small mt-1">{errors.pan}</p>}
                                            </div>
                                            {/* checkboxes */}
                                            <div className="form-group">
                                                <div>

                                                    <label htmlFor="checkBoxGroupTitle d-block" >Access Permission for Employee details </label>
                                                    <div className="form-check ">
                                                        <input className="form-check-input checkbox-create" name="employeeAccess.create" type="checkbox" id="empcreate" checked={values.employeeAccess.create} onBlur={handleBlur} onChange={handleChange}></input>
                                                        <label className="form-check-label" htmlFor="empcreate">Create</label>

                                                    </div>
                                                    <div className="form-check ">
                                                        <input className="form-check-input checkbox-edit" name="employeeAccess.edit" type="checkbox" id="empedit" checked={values.employeeAccess.edit} onBlur={handleBlur} onChange={handleChange}></input>
                                                        <label className="form-check-label" htmlFor="empedit">Edit</label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input className="form-check-input checkbox-delete" name="employeeAccess.delete" type="checkbox" id="empdelete" checked={values.employeeAccess.delete} onBlur={handleBlur} onChange={handleChange}></input>
                                                        <label className="form-check-label" htmlFor="empdelete">Delete</label>
                                                    </div>

                                                </div>
                                                <div className="mt-4">

                                                    <label htmlFor="checkBoxGroupTitle d-block">Access Permission for Project details </label>
                                                    <div className="form-check ">
                                                        <input className="form-check-input checkbox-create" name="projectAccess.create" type="checkbox" id="pjcreate" checked={values.projectAccess.create} onBlur={handleBlur} onChange={handleChange}></input>
                                                        <label className="form-check-label" htmlFor="pjcreate">Create</label>
                                                    </div>
                                                    <div className="form-check ">
                                                        <input className="form-check-input checkbox-edit" name="projectAccess.edit" type="checkbox" id="pjedit" checked={values.projectAccess.edit} onBlur={handleBlur} onChange={handleChange}></input>
                                                        <label className="form-check-label" htmlFor="pjedit">Edit</label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input className="form-check-input checkbox-delete" name="projectAccess.delete" type="checkbox" id="pjdelete" checked={values.projectAccess.delete} onBlur={handleBlur} onChange={handleChange}></input>
                                                        <label className="form-check-label" htmlFor="pjdelete">Delete</label>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* buttons for save & reset form */}
                                <div className="editAdmin-button d-flex flex-wrap justify-content-end my-3 mx-5">
                                    <button type="submit"  className="btn btn-success ">Save</button>
                                    <button type="button" className="btn btn-info" onClick={handleCancel}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>



                </div>
                        {/* Modal for Edit confirming save or cancel */}
            <Modal  show={confirmationForEdit} onHide={() => setConfirmationForEdit(false)}>
              
              <Modal.Body >Do you want to save the changes?</Modal.Body>
              <Modal.Footer>
                  <Button variant="secondary" onClick={editCancelConfirmation}>
                      Cancel
                  </Button>
                  <Button variant="primary" onClick={editSaveConfirmation}>
                      Save
                  </Button>
              </Modal.Footer>
          </Modal>
            </section>
           
        </>
    )
}

export default AdminEdit;

