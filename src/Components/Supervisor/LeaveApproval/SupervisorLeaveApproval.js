import { useEffect, useState } from "react";
import axios from 'axios';
import { Container } from "react-bootstrap";
import { Modal, Button } from 'react-bootstrap';
import successCheck from '../../Image/checked.png'
import { useNavigate } from "react-router-dom";

import leaveUrl from "../../Api/leaveRequest"
function SupervisorLeaveApproval() {
  const [leaveDatas, setleaveDatas] = useState([])
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [errorForRejection, setErrorForRejection] = useState('');
  const [askConfitrmationForApprove, setAskConfirmationForApprove] = useState(false)
  const [askConfitrmationForReject, setAskConfirmationForReject] = useState(false)
  const [successModalForApprove, setSuccessModalForApprove] = useState(false)
  const [successModalForReject, setSuccessModalForReject] = useState(false)
  const [atLeastOneChecked, setAtLeastOneChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const navigate = useNavigate();
  


  useEffect(() => {

    async function getLeaveData() {
      const leaves = await axios.get(leaveUrl);
      const leaveList = leaves.data;
      setleaveDatas(leaveList.map((leave) => ({
        ...leave,
        checked: false,

      })));
    }


    getLeaveData();
  }, [])



  useEffect(() => {
    // Check if at least one checkbox is checked
    const isChecked = leaveDatas.some((sheet) => sheet.checked);
    setSelectAllChecked(isChecked)
    setAtLeastOneChecked(isChecked);
    if (isChecked) {
      setErrorMessage('');
    }
  }, [leaveDatas]);

  function validateRejection() {

    if (rejectReason !== "") {

       setErrorForRejection("");

    } 

  }

  useEffect(() => {
    validateRejection();
  }, [rejectReason])


  // ask confirmation or trigger alert
  function approveLeaveFun() {

    if (atLeastOneChecked) {
      setAskConfirmationForApprove(true);
    } else {
      setErrorMessage("Please select at least one Leave Request!!")
    }



  }
  // ask confirmation or trigger alert
  function rejectLeaveFun() {
    if (atLeastOneChecked) {
      setAskConfirmationForReject(true);
    } else {
      setErrorMessage("Please select at least one Leave Request!!")
    }



  }

  // reset the timesheet
  function cancelLeaveFun() {
    navigate('/supervisor')
  }


  // update the timesheetCheckBox
  function handleCheckboxChange(id) {

    setleaveDatas((prevData) =>
      prevData.map((sheet) =>
        sheet.id === id ? { ...sheet, checked: !sheet.checked } : sheet
      )
    );
  }


  // timesheet approvel
  async function approveSaveConfirmation() {
    setAskConfirmationForApprove(false);
    const approvedLeavesRequest = leaveDatas.filter((leave) => leave.checked === true);



    try {
      // Update the status of approved sheets and track their IDs
      const updates = approvedLeavesRequest.map(async (leave) => {
        // Update the status of the sheet locally
        const updatedLeavesRequest = { ...leave, status: "Your leave request has been approved" };


        // Make a PUT request to update the status of the sheet in the API
        const response = await axios.put(`${leaveUrl}/${updatedLeavesRequest.id}`, updatedLeavesRequest);
        const responseData = response.data;

        // console.log("Updated approve leaves request:", responseData);

        return updatedLeavesRequest;
      });



      // Wait for all updates to finish
      const updatedLeavesRequest = await Promise.all(updates);

      // Update the state with the updated data
      setleaveDatas(updatedLeavesRequest);

      // Reset checkbox selection
      // cancelLeaveFun();

      // Show success modal
      setSuccessModalForApprove(true);
    } catch (error) {
      console.log('API error', error);
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
    const rejectLeaves = leaveDatas.filter((leave) => leave.checked === true);



    try {
      // Update the status of approved sheets and track their IDs
      const updates = rejectLeaves.map(async (leave) => {
        // Update the status of the sheet locally
        const updatedLeave = { ...leave, status: "Your timesheet has been rejected", rejectReason:rejectReason };

        // Make a PUT request to update the status of the sheet in the API
        const response = await axios.put(`${leaveUrl}/${updatedLeave.id}`, updatedLeave);
        // console.log("Updated reject sheet:", response.data);

        return updatedLeave;
      });

      // Wait for all updates to finish
      const updatedLeave = await Promise.all(updates);

      // Update the state with the updated data
      setleaveDatas(updatedLeave);

      // Reset checkbox selection
      // cancelLeaveFun();

      // Show success modal
      setSuccessModalForReject(true);
    } catch (error) {
      console.log('API error', error);
    }

  }

  // reject cancel
  function rejectCancelConfirmation() {
    setAskConfirmationForReject(false);

  }

  function goToLeaveDetails(id, check) {

    if (check) {
      console.log(id)
      navigate('/supervisor/leavedetails/' + id)
    } else {
      setErrorMessage("Please select the person you wish to view !!!")
    }


  }

  function selectAllCheckbox(event) {
    const check = event.target.checked;
    setSelectAllChecked(check);
    setleaveDatas(prevData =>
      prevData.map(data => ({
        ...data,
        checked: check
      }))
    );

  }


  return (
    <>

      <div className="ti-background-clr">
        <Container>
          <div className="py-3 ">
            <p className=" text-center spr-approval-title ">Leave List</p>
          </div>
          {/* without select timesheet error  */}
          {errorMessage && <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>}
          {/* table head */}
          <div className="table-responsive">
            <table className="table table-bordered   table-hover border border-1 border-black">
              <thead className="" >
                <tr className="text-center spr-approval-header" >
                  <th> <input className="me-1" type="checkbox" checked={selectAllChecked} onChange={selectAllCheckbox} />Select </th>
                  <th>Emp Id</th>
                  <th>Emp Name</th>
                  <th>No Of Days Leave</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody >
                {/* table body */}
                {leaveDatas ? leaveDatas.map((sheet) => (
                  <tr key={sheet.id} className="text-center">
                    <td>
                      <input
                        type="checkbox"
                        name="approvalchkLeave"
                        checked={sheet.checked}
                        onChange={() => handleCheckboxChange(sheet.id)}
                      ></input>
                    </td>
                    <td>{sheet.id}</td>
                    <td>{sheet.name}</td>
                    <td>{sheet.numberOfDays}</td>

                    <td><button className="btn btn-primary" onClick={() => { goToLeaveDetails(sheet.id, sheet.checked) }}>View</button></td>

                  </tr>
                )) : ""}


              </tbody>
            </table>
          </div>
          {/* buttons for approvel page */}
          <div className="d-flex justify-content-around flex-wrap">
            <button className="btn btn-success m-2" onClick={approveLeaveFun}>Approve</button>
            <button className="btn btn-danger m-2" onClick={rejectLeaveFun}>Reject</button>
            <button className="btn btn-secondary m-2" onClick={cancelLeaveFun} >Cancel</button>
          </div>
        </Container>


        {/* confirmation modal for approvel */}
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
              <div className="text-danger  m-2">{ errorForRejection ? errorForRejection :""}</div>
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

    </>
  )
}

export default SupervisorLeaveApproval;