import React, { useState,useEffect } from 'react';
import { useFormik } from "formik";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './EmployeeLeaveRequest.css'
import { schemaLeave } from './EmployeeLeaveSchema';
import leaveUrl from '../../Api/leaveRequest';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Modal,Button } from 'react-bootstrap';
import successCheck from '../../Image/checked.png'
export function EmployeeLeaveRequest() {
  const [leaveSuccessModal,setLeaveSuccessModal]=useState(false);
  const [numberOfDays, setNumberOfDays] = useState(0); 
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {

            startDate: new Date(),
            endDate: new Date(),
            numberOfDays:0,
            leaveReason: "",
            leaveComment: "",

        },
        validationSchema: schemaLeave,
        onSubmit
    })
    console.log(formik.values);
    // Calculate the last day of June
    const lastDayOfJune = new Date(new Date().getFullYear(), 5, 30); // Note: Month index is zero-based, so June is 5

    useEffect(() => {
        if (formik.values.endDate && formik.values.startDate) {
          const start = new Date(formik.values.startDate);
          const end = new Date(formik.values.endDate);
          const difference = Math.max(end - start, 0); // Ensure no negative days
          // Use Math.ceil to round up to the nearest whole number
          const days = Math.ceil(difference / (1000 * 60 * 60 * 24)) + 1; // +1 to include the start date as a full day
          setNumberOfDays(days);
          formik.setFieldValue('numberOfDays', days);
        }
    }, [formik.values.startDate, formik.values.endDate]);
    

    async function onSubmit() {

        const leaveData = await axios.post(leaveUrl, formik.values);
           setLeaveSuccessModal(true);
        console.log("submitted");
        formik.resetForm();

    }





    return (
        <>
            <div className="ti-background-clr">

                <div className="ti-leave-management-container p-5 ">
                    <div className='bg-white  '>
                        <h5 className="text-center py-2 text-primary">LEAVE REQUEST</h5>
                        <div className="row ">

                            <div className="col " >
                                <div className="p-5 center-align">
                                    <form onSubmit={formik.handleSubmit}>
                                        <div className="my-3 leave-row  ">
                                            <label className="pe-1"><span style={{ color: 'red' }}>*</span> Start Date :</label>
                                            <DatePicker
                                                selected={formik.values.startDate}
                                                onChange={date => {
                                                    const startDate = date.toLocaleDateString('en-US'); // Example: "4/4/2024"
                                                    formik.setFieldValue("startDate", startDate);
                                                }}
                                                minDate={new Date()}
                                                maxDate={lastDayOfJune} // Set maxDate to the last day of June
                                                placeholderText="dd/mm/yyyy"
                                                dateFormat="dd/MM/yyyy"
                                                className='w-50'
                                            />
                                        </div>
                                        <div className="my-3 leave-row">
                                            <label className="pe-1"><span style={{ color: 'red' }}>*</span> End Date :</label>
                                            <DatePicker
                                                selected={formik.values.endDate}
                                                onChange={date => {
                                                    const endDate = date.toLocaleDateString('en-US'); // Example: "4/4/2024"
                                                    formik.setFieldValue("endDate", endDate);
                                                }}
                                                minDate={new Date()}
                                                maxDate={lastDayOfJune} // Set maxDate to the last day of June
                                                placeholderText="dd/mm/yyyy"
                                                dateFormat="dd/MM/yyyy"
                                                className='w-50'
                                            />

                                        </div>
                                        <div>
                                            {formik.errors.endDate ? <p className='text-danger small'>{formik.errors.endDate}</p> : ""}
                                        </div>
                                        <div className="my-3 leave-row">
                                            <label>No Of Days :</label>
                                            <input type='text' readOnly className='w-25' value={numberOfDays} ></input>

                                        </div>

                                        <div className="my-3 leave-row">

                                            <label htmlFor="leave-reason" className="pe-1"><span style={{ color: 'red' }}>*</span> Reason :</label>

                                            <select id="leave-reason" name="leaveReason" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.leaveReason}>
                                                <option value="">Select</option>
                                                <option value="sick-leave">Sick Leave</option>
                                                <option value="earned-leave">Earned Leave</option>
                                                <option value="casual-leave">casual Leave</option>
                                                <option value="maternity-leave">Maternity leave</option>
                                                <option value="others-leave">Others</option>
                                            </select>

                                        </div>
                                        <div>
                                            {formik.touched.leaveReason && formik.errors.leaveReason ? <p className='text-danger small'>{formik.errors.leaveReason}</p> : ""}
                                        </div>

                                        <div className="my-3 leave-row">
                                            <label htmlFor="leave-comment" className="pe-1" > <span style={{ color: 'red' }}>*</span>Comments :</label>
                                            <textarea type="text" id='leave-comment' name='leaveComment' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.leaveComment}></textarea>
                                        </div>
                                        <div>
                                            {formik.touched.leaveComment&&formik.errors.leaveComment ? <p className='text-danger small'>{formik.errors.leaveComment}</p> : ""}
                                        </div>

                                        <div className='my-5 text-end'>
                                            <button type='submit' disabled={formik.isSubmitting} className='btn btn-success mx-2'>Submit</button>
                                            <button type='button' className='btn btn-secondary mx-2' onClick={() => { navigate('/employee') }}>Cancel</button>
                                        </div>

                                    </form>

                                </div>
                            </div>



                        </div>
                    </div>


                </div>
                <div>
                    <Modal className="custom-modal" style={{ left: '50%', transform: 'translateX(-50%)' }} dialogClassName="modal-dialog-centered" show={leaveSuccessModal}  >
                        <div className="d-flex flex-column modal-success p-4 align-items-center ">
                            <img src={successCheck} className="img-fluid mb-4" alt="successCheck" />
                            <p className="mb-4 text-center"> Your Leave Request Submitted Successfully</p>
                            <button className="btn  w-100 text-white" onClick={() => setLeaveSuccessModal(false)} style={{ backgroundColor: '#5EAC24' }}>Close</button>
                        </div>
                    </Modal>
                </div>


            </div>


        </>
    )
}   