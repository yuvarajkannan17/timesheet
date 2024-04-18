import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Container } from "react-bootstrap";

import leaveUrl from "../../../Api/leaveRequest";

function ViewRejectedLeaveRequests() {
    const [rejectedLeaveRequests, setRejectedLeaveRequests] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        async function getRejectedLeaveRequests() {
            try {
                const response = await axios.get(leaveUrl);
                setRejectedLeaveRequests(response.data.filter(leave => leave.status === "Your timesheet has been rejected"));
            } catch (error) {
                console.error('Error fetching rejected leave requests:', error);
                setErrorMessage('Error fetching rejected leave requests. Please try again.');
            }
        }
        getRejectedLeaveRequests();
    }, []);

    return (
        <div className="ti-background-clr">
            <Container>
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
                                    <td>{leave.leaveReason}</td>
                                    <td>{leave.startDate}</td>
                                    <td>{leave.endDate}</td>
                                    <td>{leave.numberOfDays}</td>
                                    <td>{leave.rejectReason}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Container>
        </div>
    );
}

export default ViewRejectedLeaveRequests;

