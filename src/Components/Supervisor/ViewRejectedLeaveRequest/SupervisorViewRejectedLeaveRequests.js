import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";



function SupervisorViewRejectedLeaveRequests() {
    const [rejectedLeaveRequests, setRejectedLeaveRequests] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const supervisorValue = useSelector(state=>state.supervisorLogin.value);
    const supervisorId=supervisorValue.supervisorId;

    useEffect(() => {
        async function getRejectedLeaveRequests() {
            try {
                const response = await axios.get(`http://localhost:8086/supervisor/leave-requests`);

               
                                   let filteringSupervisorId=  response.data.filter(leave=>leave.empId==supervisorId)
                   let rejectedOne= filteringSupervisorId.filter(leave => leave.status == "REJECTED");
                    setRejectedLeaveRequests(rejectedOne.slice(-3));

            } catch (error) {
                console.error('Error fetching rejected leave requests:', error);
                setErrorMessage('Error fetching rejected leave requests. Please try again.');
            }
        }
        getRejectedLeaveRequests();
    }, []);
    
    const handleCancel = () => {
        navigate("/supervisor");
    }

    return (
        <div className="ti-background-clr">
            {rejectedLeaveRequests.length > 0  ? (<Container>
                <div className="py-3 ">
                    <p className="text-center spr-approval-title">Rejected Leave Requests</p>
                </div>
                {errorMessage && <div className="alert alert-danger" role="alert">
                    {errorMessage}
                </div>}
                <div className="table-responsive">
                    <table className="table table-bordered table-hover border border-1 border-black">
                        <thead className="">
                            <tr className="text-center spr-approval-header" >
                                <th>Leave Type</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Total No of Days</th>
                                <th>Reason for Rejection</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rejectedLeaveRequests.map((leave) => (
                                <tr key={leave.id} className="text-center">
                                    <td>{leave.reason}</td>
                                    <td>{leave.startDate}</td>
                                    <td>{leave.endDate}</td>
                                    <td>{leave.noOfDays}</td>
                                    <td>{leave.reasonForRejection}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="d-flex justify-content-center mt-3">
                    <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
                </div>
            </Container>):(<div className="no-timesheet">
                    <h3>No Rejected Timesheet Available</h3>
                    
                </div>)}
        </div>
    );
}

export default SupervisorViewRejectedLeaveRequests;

