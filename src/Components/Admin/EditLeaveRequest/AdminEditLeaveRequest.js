import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { schemaLeave } from "./LeaveSchema";
import leaveUrl from "../../Api/leaveRequest";
import { Modal, Button } from "react-bootstrap";
import successCheck from "../../Image/checked.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function AdminEditLeaveRequest() {
  const [lastLeaveRequestData, setLastLeaveRequestData] = useState(null);
  const [editId, setEditId] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const navigate = useNavigate();

  const adminValue = useSelector(state=>state.adminLogin.value);
  const adminId=adminValue.adminId;
  

  const formik = useFormik({
    initialValues: {
      empId:"",
      startDate: new Date(),
      endDate: new Date(),
      noOfDays: "",
      reason: "",
      status:"",
      comments: "",
    },
    validationSchema: schemaLeave,
    onSubmit: editLeaveRequest,
  });

  

  async function fetchLeaveData() {
    try {
      const response = await axios.get(`http://localhost:8081/admin/leave-requests`);
      const leaveRequest = response.data;
      const pendingItems = leaveRequest.filter(item => item.status === "PENDING");
      console.log(pendingItems);
    
      if (pendingItems.length > 0) {
        const lastRequest = pendingItems[pendingItems.length - 1];
        console.log("last",lastRequest)
        setLastLeaveRequestData(lastRequest);
        setEditId(lastRequest.id);
        formik.setValues({
          empId:lastRequest.empId,
          startDate: new Date(lastRequest.startDate),
          endDate: new Date(lastRequest.endDate),
          noOfDays: lastRequest.noOfDays,
          reason: lastRequest.reason,
          status:lastRequest.status,
          comments: lastRequest.comments,
        });
      }
    } catch (error) {
      console.error("Error fetching leave request:", error);
    }
  }
  useEffect(() => {
    fetchLeaveData();
  }, []);

  useEffect(() => {
    if (formik.values.endDate && formik.values.startDate) {
      const start = new Date(formik.values.startDate);
      const end = new Date(formik.values.endDate);
      const difference = Math.max(end - start, 0); // Ensure no negative days
      // Use Math.ceil to round up to the nearest whole number
      const days = Math.ceil(difference / (1000 * 60 * 60 * 24)) + 1; // +1 to include the start date as a full day
      
      formik.setFieldValue('noOfDays', days);
    
    }
}, [formik.values.startDate, formik.values.endDate]);


  async function editLeaveRequest() {
    setConfirmationModal(false)
    try {
      await axios.put(`http://localhost:8081/admin/leave-requests/${editId}`, formik.values);
      setSuccessModal(true)
      console.log("submitted successfully")
    } catch (error) {
      console.error("Error updating leave request:", error);
    }
  }

  


  return (
    <>
       <div className="ti-background-clr">
            
                { lastLeaveRequestData && Object.keys(lastLeaveRequestData).length > 0 ?( <div className="ti-leave-management-container  ">
                  <h5 className="text-center pt-4">EDIT LEAVE REQUEST</h5>
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
                                            <button type='submit' disabled={formik.isSubmitting} className='btn btn-success mx-2' onClick={() => setConfirmationModal(true)}>Submit</button>
                                            <button type='button' className='btn btn-secondary mx-2' onClick={() => { navigate('/admin') }}>Cancel</button>
                                        </div>

                                    </form>

                                </div>
                            </div>



                        </div>
                    </div>


                </div> ): (<div className="no-timesheet">
                    <h3>No Leave Request Available</h3>
                    <p>Please create a new one.</p>
                    <button className="btn btn-secondary " onClick={()=>{navigate('/admin')}}>Cancel</button>

                </div>)}
                <div>
                    {/* <Modal className="custom-modal" style={{ left: '50%', transform: 'translateX(-50%)' }} dialogClassName="modal-dialog-centered" show={leaveSuccessModal}  >
                        <div className="d-flex flex-column modal-success p-4 align-items-center ">
                            <img src={successCheck} className="img-fluid mb-4" alt="successCheck" />
                            <p className="mb-4 text-center"> Your Leave Request Submitted Successfully</p>
                            <button className="btn  w-100 text-white" onClick={() => setLeaveSuccessModal(false)} style={{ backgroundColor: '#5EAC24' }}>Close</button>
                        </div>
                    </Modal> */}
                     {/* Confirmation Modal */}
          <Modal show={confirmationModal}>
            <Modal.Body>
              Do you want to submit the edited leave request?
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setConfirmationModal(false)}
              >
                Cancel
              </Button>
              <Button variant="success" onClick={editLeaveRequest}>
                Submit
              </Button>
            </Modal.Footer>
          </Modal>
          <Modal
            className="custom-modal"
            style={{ left: "50%", transform: "translateX(-50%)" }}
            dialogClassName="modal-dialog-centered"
            show={successModal}            
          >
            <div className="d-flex flex-column modal-success p-4 align-items-center">
              <img
                src={successCheck}
                className="img-fluid mb-4"
                alt="successCheck"
              />
              <p className="mb-4 text-center">
                Leave request updated successfully.
              </p>
              <button
                className="btn w-100 text-white"
                onClick={() => setSuccessModal(false)}                
                style={{ backgroundColor: "#5EAC24" }}
              >
                Close
              </button>
            </div>
          </Modal>
                </div>


            </div>
      
    </>
  );
}

export default AdminEditLeaveRequest;