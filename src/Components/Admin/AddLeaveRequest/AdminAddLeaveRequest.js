import React, { useState,useEffect } from 'react';
import { useFormik } from "formik";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './AddLeaveRequest.css'
import { schemaLeave } from "./LeaveSchema";
import leaveUrl from '../../Api/leaveRequest';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Modal,Button } from 'react-bootstrap';
import successCheck from '../../Image/checked.png';
import { leaveSubmitON, leaveSubmitOFF } from '../../features/empLeaveSubmit';
import { useSelector, useDispatch } from 'react-redux';

function AdminAddLeaveRequest() {
    const adminValue = useSelector(state=>state.adminLogin.value);
  const adminId=adminValue.adminId;
  const [leaveSuccessModal,setLeaveSuccessModal]=useState(false);
  const [numberOfDays, setNumberOfDays] = useState(0);
  const [approvedLeaveCount,setApprovedLeaveCount]=useState(0);
    const [totalLeaves,setTotalLeaves]=useState(18)
    const [pendingLeaves,setPendingLeaves]=useState(0);
  let dispatch = useDispatch();
    let { isSubmit } = useSelector((state) => state.empLeaveSubmit.value);
    console.log("sss", isSubmit) 
     
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            empId:adminId, 
            startDate: new Date(),
            endDate: new Date(),
            noOfDays:0,
            reason: "",
            comments: "",

        },
        validationSchema: schemaLeave,
        onSubmit
    })

    function calculatePendingLeaves(){

        let count=0;

        count=totalLeaves-approvedLeaveCount;

        setPendingLeaves(count);

    }

    useEffect(()=>{
        calculatePendingLeaves();
    },[approvedLeaveCount,totalLeaves])
 
    // Calculate the last day of June
    // const lastDayOfJune = new Date(new Date().getFullYear(), 5, 30); // Note: Month index is zero-based, so June is 5
    
console.log(formik.values)
    useEffect(() => {
        if (formik.values.endDate && formik.values.startDate) {
          const start = new Date(formik.values.startDate);
          const end = new Date(formik.values.endDate);
          const difference = Math.max(end - start, 0); // Ensure no negative days
          // Use Math.ceil to round up to the nearest whole number
          const days = Math.ceil(difference / (1000 * 60 * 60 * 24)) + 1; // +1 to include the start date as a full day
          setNumberOfDays(days);
          formik.setFieldValue('noOfDays', days);
        
        }
    }, [formik.values.startDate, formik.values.endDate]);
    
    async function calculateApprovedLeave() {
        try {
          // Make the API request
          let response = await axios.get(`http://localhost:8081/admin/leave-requests`);
    
          // Extract the actual data (leaves)
          let totalLeaves = response.data;
    
          // Filter for approved leaves
          let approvedLeaves = totalLeaves.filter(leaves => leaves.status === "APPROVED");
    
          // Set the approved leave count in state
          let approvedCount=  approvedLeaves.length;

           if(approvedCount>0){
            
           setApprovedLeaveCount(approvedCount);
           }
        } catch (error) {
          console.error("Error fetching leaves data:", error);
        }
      }

      useEffect(()=>{
        calculateApprovedLeave();
      },[])

    async function onSubmit() {
        console.log(formik.values);
        try {
            const leaveData = await axios.post("http://localhost:8081/admin/leave-requests", formik.values);
            if (leaveData.data) {
                const {empId,status,id,startDate,endDate} =leaveData.data
                setLeaveSuccessModal(true);
                // localStorage.setItem(`leaveSubmitEmpId${adminId}`,empId);
                // localStorage.setItem(`leaveStatus${adminId}`,status);
                // localStorage.setItem(`isLeaveSubmit${adminId}`,"true");
                localStorage.setItem(`leaveObjectId${adminId}`,id);
                // localStorage.setItem(`leaveStartDate${adminId}`,startDate);
                // localStorage.setItem(`leaveEndDate${adminId}`,endDate);
                dispatch(leaveSubmitON(true));
                formik.resetForm();
                navigate("/admin")
            }


        } catch (error) {
            console.log(error)

        }

    }

    return (
        <>
            <div className="ti-background-clr">
            <h5 className="text-center pt-4">LEAVE REQUEST</h5>
                <div className="ti-leave-management-container  ">
                <h5 className=''> YOUR AVAILABLE LEAVES : {pendingLeaves}</h5>

                    <div className='bg-white  '>
                        
                        <div className="row ">

                            <div className="col " >
                                <div className="p-5 center-align">
                                    <form onSubmit={formik.handleSubmit}>
                                    <div className="my-3 leave-row">
                                            <label> <span style={{ color: 'red' }}>*</span>Admin Id :</label>
                                            <input type='text'  className='w-25' name="empId" value={adminId} onChange={formik.handleChange} ></input>

                                  </div>
                                       <div>
                                            {formik.touched.empId&&formik.errors.empId ? <p className='text-danger small'>{formik.errors.empId}</p> : ""}
                                        </div>
                                        <div className="my-3 leave-row  ">
                                            <label className="pe-1"><span style={{ color: 'red' }}>*</span> Start Date :</label>
                                            <DatePicker
                                                selected={formik.values.startDate}
                                                onChange={date => {
                                                    const startDate = date.toLocaleDateString('en-US'); // Example: "4/4/2024"
                                                    formik.setFieldValue("startDate", date);
                                                }}
                                                minDate={new Date()}
                                        
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
                                                    formik.setFieldValue("endDate", date);
                                                }}
                                                minDate={new Date()}
                                                
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
                                            <input type='text' readOnly className='w-25' value={formik.values.noOfDays} ></input>

                                        </div>

                                        <div className="my-3 leave-row">

                                            <label htmlFor="leave-reason" className="pe-1"><span style={{ color: 'red' }}>*</span> Reason :</label>

                                            <select id="leave-reason" name="reason" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.reason}>
                                                <option value="">Select</option>
                                                <option value="sick-leave">Sick Leave</option>
                                                <option value="earned-leave">Earned Leave</option>
                                                <option value="casual-leave">casual Leave</option>
                                                <option value="maternity-leave">Maternity leave</option>
                                                <option value="others-leave">Others</option>
                                            </select>

                                        </div>
                                        <div>
                                            {formik.touched.reason && formik.errors.reason ? <p className='text-danger small'>{formik.errors.reason}</p> : ""}
                                        </div>

                                        <div className="my-3 leave-row">
                                            <label htmlFor="leave-comment" className="pe-1" > <span style={{ color: 'red' }}>*</span>Comments :</label>
                                            <textarea type="text" id='leave-comment' name='comments' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.comments}></textarea>
                                        </div>
                                        <div>
                                            {formik.touched.comments&&formik.errors.comments ? <p className='text-danger small'>{formik.errors.comments}</p> : ""}
                                        </div>

                                        <div className='my-5 text-end'>
                                            <button type='submit' disabled={formik.isSubmitting} className='btn btn-success mx-2'>Submit</button>
                                            <button type='button' className='btn btn-secondary mx-2' onClick={() => { navigate('/admin') }}>Cancel</button>
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
export default AdminAddLeaveRequest;