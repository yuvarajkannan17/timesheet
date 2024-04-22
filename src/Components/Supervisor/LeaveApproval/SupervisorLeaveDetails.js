import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import leaveUrl from '../../Api/leaveRequest';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { Modal, Button } from 'react-bootstrap';
import successCheck from '../../Image/checked.png'


function SupervisorLeaveDetails() {
    const [rejectReason, setRejectReason] = useState('');
    const [errorForRejection, setErrorForRejection] = useState('');
    const [askConfitrmationForApprove, setAskConfirmationForApprove] = useState(false)
    const [askConfitrmationForReject, setAskConfirmationForReject] = useState(false)
    const [successModalForApprove, setSuccessModalForApprove] = useState(false)
    const [successModalForReject, setSuccessModalForReject] = useState(false)
    const { id } = useParams();
    const [leaveEmp, setLeaveEmp] = useState({});
    const navigate = useNavigate();



    async function getLeaveRequests() {
        const res = await axios.get(`${leaveUrl}/${id}`);
        const leaveData = res.data;
        setLeaveEmp(leaveData);

    }

    useEffect(() => {
        getLeaveRequests();
    }, [])


    function validateRejection() {

        if (rejectReason !== "") {
    
           setErrorForRejection("");
    
        } 
    
      }
    
      useEffect(() => {
        validateRejection();
      }, [rejectReason])


    function approveLeaveFun() {

        setAskConfirmationForApprove(true);
        
    }

    function rejectLeaveFun() {
        setAskConfirmationForReject(true);
    }


    // leave approvel
    async function approveSaveConfirmation() {
        setAskConfirmationForApprove(false);
    
        try {
            const updatedLeave = {
                ...leaveEmp,
                status: "your leave request has been approved"
            };
    
            const response = await axios.put(`${leaveUrl}/${id}`, updatedLeave);
            console.log(response.data);
            
            setLeaveEmp(updatedLeave);
            setSuccessModalForApprove(true);
        } catch (error) {
            console.log(error);
        }
    }
    

    // cancel the approvel
    function approveCancelConfirmation() {
        setAskConfirmationForApprove(false);

    }

    // reject the timesheet
    async function rejectSaveConfirmation() {


        // First validate the rejection reason
        if (!rejectReason) {
            // Set the error message if no reason is selected
            setErrorForRejection("Please select the reject reason");
            // Do not proceed with the rejection process
            return;
        }

        setAskConfirmationForReject(false);

      

        try {

            const updatedLeave = {
                ...leaveEmp,
                status: "your leave request has been rejected",
                rejectReason:rejectReason
            };

            const response = await axios.put(`${leaveUrl}/${id}`, updatedLeave);
            console.log(response.data)
            setLeaveEmp(updatedLeave);
            setSuccessModalForReject(true);
        } catch (error) {
            console.log(error);
        }

    }

    // reject cancel
    function rejectCancelConfirmation() {
        setAskConfirmationForReject(false);

    }

    return (
        <>
            <>
                <div className="ti-background-clr">

                    <div className="ti-leave-management-container p-5 ">
                        <div className='bg-white  '>
                            <h5 className="text-center py-2 text-primary">LEAVE REQUEST SUBMISSION</h5>
                            <div className="row ">

                                <div className="col " >
                                    <div className="p-5 center-align">
                                        <form onSubmit={""}>
                                            <div className="my-3 leave-row">
                                                <label>Emp Id :</label>
                                                <input type='text' disabled className='w-25 px-1' value={leaveEmp.name} ></input>

                                            </div>
                                            <div className="my-3 leave-row">
                                                <label>Emp Name :</label>
                                                <input type='text' disabled className='w-25 px-1' value={leaveEmp.id} ></input>

                                            </div>
                                            <div className="my-3 leave-row  ">
                                                <label className="pe-1"> Start Date :</label>
                                                <DatePicker
                                                    selected={leaveEmp.startDate}
                                                    disabled
                                                    className='w-50 px-1'
                                                    dateFormat="dd/MM/yyyy"

                                                />
                                            </div>
                                            <div className="my-3 leave-row">
                                                <label className="pe-1"> End Date :</label>
                                                <DatePicker
                                                    selected={leaveEmp.endDate}
                                                    className='w-50 px-1'
                                                    disabled
                                                    dateFormat="dd/MM/yyyy"
                                                />

                                            </div>

                                            <div className="my-3 leave-row">
                                                <label>No Of Days :</label>
                                                <input type='text' disabled className='w-25 px-1' value={leaveEmp.numberOfDays} ></input>

                                            </div>

                                            <div className="my-3 leave-row">

                                                <label htmlFor="leave-reason" className="pe-1"> Reason :</label>

                                                <select id="leave-reason" disabled name="leaveReason" className='px-1' value={leaveEmp.leaveReason}>
                                                    <option value={leaveEmp.leaveReason}>{leaveEmp.leaveReason}</option>

                                                </select>

                                            </div>


                                            <div className="my-3 leave-row">
                                                <label htmlFor="leave-comment" className="pe-1" > Comments :</label>
                                                <textarea type="text" id='leave-comment' disabled name='leaveComment' className='px-1' value={leaveEmp.leaveComment}></textarea>
                                            </div>


                                            <div className='my-5 text-end'>
                                                <button type='button' className='btn btn-success mx-2' onClick={approveLeaveFun}>Approve</button>
                                                <button type='button' className='btn btn-danger mx-2' onClick={rejectLeaveFun} >Reject</button>
                                                <button type='button' className='btn btn-secondary mx-2' onClick={() => { navigate('/supervisor/leaveapproval') }} >Cancel</button>
                                            </div>

                                        </form>

                                    </div>
                                </div>



                            </div>
                        </div>


                    </div>
                    <div>
                        {/* modals */}
                        <div className="approveModal">
                            <Modal show={askConfitrmationForApprove}>

                                <Modal.Body >Do you want to approve this leave request?</Modal.Body>

                                <Modal.Footer>
                                    <Button variant="secondary" onClick={approveCancelConfirmation}>
                                        Cancel
                                    </Button>
                                    <Button variant="primary" onClick={approveSaveConfirmation}>
                                        Approve
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                            {/* modal for success approvel */}
                            <Modal className="custom-modal" style={{ left: '50%', transform: 'translateX(-50%)' }} dialogClassName="modal-dialog-centered" show={successModalForApprove}  >
                                <div className="d-flex flex-column modal-success p-4 align-items-center ">
                                    <img src={successCheck} className="img-fluid mb-4" alt="successCheck" />
                                    <p className="mb-4 text-center">The leave request has been approved.</p>
                                    <button className="btn  w-100 text-white" onClick={() => { setSuccessModalForApprove(false) }} style={{ backgroundColor: '#5EAC24' }}>Close</button>
                                </div>
                            </Modal>

                            {/* confirmation modal for rejects */}

                            <Modal show={askConfitrmationForReject}>
                                <Modal.Header>
                                    Are you sure you want to reject ?
                                </Modal.Header>
                                <Modal.Body>

                                    <div>
                                        <label htmlFor="reject-reason" className="pe-1"><span style={{ color: 'red' }}>*</span> Select The Reason For Reject :</label>

                                        <select id="reject-reason" name="rejectReason" onChange={(e) => { setRejectReason(e.target.value) }} value={rejectReason}>
                                            <option value="">Select</option>
                                            <option value="excessive requests">Excessive Requests</option>
                                            <option value="busy periods">Busy Periods</option>
                                            <option value="incomplete work">Incomplete Works</option>
                                            <option value="maternity-leave">Policy Violations</option>

                                        </select>

                                    </div>
                                    <div className="text-danger  m-2">{errorForRejection ? errorForRejection : ""}</div>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={rejectCancelConfirmation}>
                                        Cancel
                                    </Button>
                                    <Button variant="danger" onClick={rejectSaveConfirmation}>
                                        Reject
                                    </Button>
                                </Modal.Footer>
                            </Modal>


                            {/* modal for leave request reject */}
                            <Modal className="custom-modal" style={{ left: '50%', transform: 'translateX(-50%)' }} dialogClassName="modal-dialog-centered" show={successModalForReject}  >
                                <div className="d-flex flex-column modal-success p-4 align-items-center ">
                                    <img src={successCheck} className="img-fluid mb-4" alt="successCheck" />
                                    <p className="mb-4 text-center">The leave request has been rejected.</p>
                                    <button className="btn  w-100 text-white" onClick={() => { setSuccessModalForReject(false) }} style={{ backgroundColor: '#5EAC24' }}>Close</button>
                                </div>
                            </Modal>



                        </div>
                    </div>


                </div>


            </>
        </>
    )
}

export default SupervisorLeaveDetails;