import { useEffect, useState } from "react";
import axios from 'axios';
import timesheetUrl from "../../Api/timesheet";
import { Container } from "react-bootstrap";
import { Modal, Button } from 'react-bootstrap';
import successCheck from '../../Image/checked.png'
function ApprovelBody() {
  const [timesheetDatas, setTimesheetDatas] = useState([])
  const [askConfitrmationForApprove, setAskConfirmationForApprove] = useState(false)
  const [askConfitrmationForReject, setAskConfirmationForReject] = useState(false)
  const [successModalForApprove, setSuccessModalForApprove] = useState(false)
  const [successModalForReject, setSuccessModalForReject] = useState(false)
  const [atLeastOneChecked, setAtLeastOneChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {

    async function getTimesheet() {
      const timesheets = await axios.get(timesheetUrl);
      const datasOfTimesheet = timesheets.data;
      setTimesheetDatas(datasOfTimesheet.map((sheetData) => ({
        ...sheetData,
        checked: false

      })));
    }

    
    getTimesheet();
  }, [])
  
  useEffect(() => {
    // Check if at least one checkbox is checked
    const isChecked = timesheetDatas.some((sheet) => sheet.checked);
     setAtLeastOneChecked(isChecked);
       if(isChecked){
        setErrorMessage('');
       }
  }, [timesheetDatas]);



  function approvesheetFun() {

    if (atLeastOneChecked) {
      setAskConfirmationForApprove(true);
    } else {
      setErrorMessage("Please select at least one checkbox!!")
    }



  }

  function rejectsheetFun() {
    if (atLeastOneChecked) {
      setAskConfirmationForReject(true);
    } else {
      setErrorMessage("Please select at least one checkbox!!")
    }



  }

  function cancelsheetFun() {
    setTimesheetDatas((prevData) =>
      prevData.map((sheet) => ({
        ...sheet,
        checked: false
      }))
    );
  }



  function handleCheckboxChange(id) {
    setTimesheetDatas((prevData) =>
      prevData.map((sheet) =>
        sheet.id === id ? { ...sheet, checked: !sheet.checked } : sheet
      )
    );
  }

   

  async function approveSaveConfirmation() {
    setAskConfirmationForApprove(false);
    const approvedSheets = timesheetDatas.filter((sheet) => sheet.checked === true);
    
  
    try {
        // Update the status of approved sheets and track their IDs
        const updates = approvedSheets.map(async (sheet) => {
            // Update the status of the sheet locally
            const updatedSheet = { ...sheet, status: "Your timesheet has been approved" };

            // Make a PUT request to update the status of the sheet in the API
            const response = await axios.put(`${timesheetUrl}/${updatedSheet.id}`, updatedSheet);
            const responseData=response.data;
          
            console.log("Updated approve sheet:",responseData);

            return updatedSheet;
        });

        

        // Wait for all updates to finish
        const updatedSheets = await Promise.all(updates);
  
        // Update the state with the updated data
        setTimesheetDatas(updatedSheets);
       
        // Reset checkbox selection
        cancelsheetFun();
  
        // Show success modal
        setSuccessModalForApprove(true);
    } catch (error) {
        console.log('API error', error);
    }
}


  function approveCancelConfirmation() {
    setAskConfirmationForApprove(false);

  }

 async function rejectSaveConfirmation() {
    setAskConfirmationForReject(false);
    const rejectSheets = timesheetDatas.filter((sheet) => sheet.checked === true);
    
  
    try {
        // Update the status of approved sheets and track their IDs
        const updates = rejectSheets.map(async (sheet) => {
            // Update the status of the sheet locally
            const updatedSheet = { ...sheet, status: "Your timesheet has been rejected" };

            // Make a PUT request to update the status of the sheet in the API
            const response = await axios.put(`${timesheetUrl}/${updatedSheet.id}`, updatedSheet);
            console.log("Updated reject sheet:", response.data);

            return updatedSheet;
        });

        // Wait for all updates to finish
        const updatedSheets = await Promise.all(updates);
  
        // Update the state with the updated data
        setTimesheetDatas(updatedSheets);
  
        // Reset checkbox selection
        cancelsheetFun();
  
        // Show success modal
        setSuccessModalForReject(true);
    } catch (error) {
        console.log('API error', error);
    }
   
  }


  function rejectCancelConfirmation() {
    setAskConfirmationForReject(false);

  }


  return (
    <>

      <div className="approvel-body">
        <Container>
          <div className="py-3 ">
            <p className=" text-center approvel-title ">Approvalsheet</p>
          </div>
          {errorMessage && <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>}
          <div className="table-responsive">
            <table className="table table-bordered   table-hover border border-1 border-black">
              <thead className="table-header" >
                <tr className="text-center " style={{backgroundColor:"blue"}}>
                  <th>Select</th>
                  <th>Emp Id</th>
                  <th>Emp Name</th>
                  <th>Timesheet Period</th>
                  <th>No hrs Submitted</th>
                </tr>
              </thead>
              <tbody >
                {timesheetDatas ? timesheetDatas.map((sheet) => (
                  <tr key={sheet.id} className="text-center">
                    <td>
                      <input
                        type="checkbox"
                        name={sheet.name}
                        checked={sheet.checked}
                        onChange={() => handleCheckboxChange(sheet.id)}
                      ></input>
                    </td>
                    <td>{sheet.empId}</td>
                    <td>{sheet.empName}</td>
                    <td>{sheet.timesheetPeriod}</td>
                    <td>{sheet.noOfHoursSubmitted}</td>
                  </tr>
                )) : ""}


              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-around flex-wrap">
              <button className="btn btn-success m-2" onClick={approvesheetFun}>Approve</button>
              <button className="btn btn-danger m-2" onClick={rejectsheetFun}>Reject</button>
              <button className="btn btn-secondary m-2" onClick={cancelsheetFun} >Cancel</button>
          </div>
        </Container>

        <div className="approveModal">
          <Modal show={askConfitrmationForApprove}>

            <Modal.Body >Do you want to approve this sheets?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={approveCancelConfirmation}>
                Cancel
              </Button>
              <Button variant="primary" onClick={approveSaveConfirmation}>
                Approve
              </Button>
            </Modal.Footer>
          </Modal>
          <Modal className="custom-modal" style={{ left: '50%', transform: 'translateX(-50%)' }} dialogClassName="modal-dialog-centered" show={successModalForApprove}  >
            <div className="d-flex flex-column modal-success p-4 align-items-center ">
              <img src={successCheck} className="img-fluid mb-4" alt="successCheck" />
              <p className="mb-4 text-center">Timesheets have been approved.</p>
              <button className="btn  w-100 text-white" onClick={() => { setSuccessModalForApprove(false) }} style={{ backgroundColor: '#5EAC24' }}>Close</button>
            </div>
          </Modal>

          <Modal show={askConfitrmationForReject} >

            <Modal.Body >Are you sure you want to reject this sheets?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={rejectCancelConfirmation}>
                Cancel
              </Button>
              <Button variant="danger" onClick={rejectSaveConfirmation}>
                Reject
              </Button>
            </Modal.Footer>
          </Modal>
          <Modal className="custom-modal" style={{ left: '50%', transform: 'translateX(-50%)' }} dialogClassName="modal-dialog-centered" show={successModalForReject}  >
            <div className="d-flex flex-column modal-success p-4 align-items-center ">
              <img src={successCheck} className="img-fluid mb-4" alt="successCheck" />
              <p className="mb-4 text-center">Timesheets have been rejected.</p>
              <button className="btn  w-100 text-white" onClick={() => { setSuccessModalForReject(false) }} style={{ backgroundColor: '#5EAC24' }}>Close</button>
            </div>
          </Modal>

        </div>
      </div>

    </>
  )
}

export default ApprovelBody;