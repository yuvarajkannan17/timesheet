import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Select from 'react-select';
import './AddTimesheet.css';
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import successCheck from '../../Image/checked.png'
import checkedImage from '../../Image/checked.png';



const AdminAddTimesheet = () => {
  const [errors,setErrors]=useState("");
 const [inputData,setInputData]=useState({
  employeeId:"",
  projectId:""

 })
  const [selectedMonth, setSelectedMonth] = useState('');
  const [timesheetData, setTimesheetData] = useState([]);
  const [availableProjects, setAvailableProjects] = useState([]);
  const [tableRowCount, setTableRowCount] = useState(1);
  const [showFirstHalf, setShowFirstHalf] = useState(true);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [addDataSubmitConfirmation, setAddDataSubmitConfirmation] = useState(false);
  const [successModalForEmployeeAdd, setSuccessModalForEmployeeAdd] = useState(false);
  const [getValueFromLocal,setGetValueFromLocal]=useState("")
  const navigate = useNavigate();


  const generateTimesheetData = (selectedMonth) => {
    if (!selectedMonth) return;
  
    const currentYear = parseInt(selectedMonth.slice(0, 4));
    const currentMonth = parseInt(selectedMonth.slice(5, 7)) - 1; // Adjust for zero-based month index
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const startDay = showFirstHalf ? 1 : 16;
    const endDay = showFirstHalf ? 15 : daysInMonth;
  
    const newTimesheetData = [];
  
    for (let day = startDay; day <= endDay; day++) {
      const date = new Date(currentYear, currentMonth, day);
      newTimesheetData.push({ date, projectId: "", employeeId: "", hours: 0 });
    }
  
    setErrors({ ...errors, date: "" });
    setTimesheetData(newTimesheetData);
    
  };

  useEffect(() => {
    generateTimesheetData(selectedMonth);
  }, [selectedMonth, showFirstHalf]);

     

  console.log("timesheetData",timesheetData)

  const saveTimesheetData = () => {
    let hasErrors = false;
    const newErrors = { date: "", projectId: "", employeeId: "" };
  
    // Check if timesheetData is empty
    if (timesheetData.length === 0) {
      newErrors.date = "No timesheet data available";
      hasErrors = true;
    } else {
      // Validate each entry in timesheetData
      timesheetData.forEach((entry) => {
        if (!entry.date) {
          newErrors.date = "Date is required";
          hasErrors = true;
        }
        if (!entry.projectId) {
          newErrors.projectId = "Project ID is required";
          hasErrors = true;
        }
        if (!entry.employeeId) {
          newErrors.employeeId = "Employee ID is required";
          hasErrors = true;
        }
      });
    }
  
    // Update state with new errors
    setErrors(newErrors);
  
    // Prevent saving if there are errors
    if (hasErrors) {
      console.error('Validation errors:', newErrors);
      return;
    }
  
    // Save data to local storage
    try {
      const timesheetPayload = {
        data: timesheetData.map(({ date, projectId, employeeId, hours }) => ({
          date: date.toISOString(),
          projectId,
          employeeId,
          
          hours:Number(hours),
        })),
        timestamp: new Date().getTime()
      };
  
      // Get existing timesheets from localStorage
      const existingTimesheets = JSON.parse(localStorage.getItem('timesheetDataList')) || [];
  
      // Add new timesheet to the list
      existingTimesheets.push(timesheetPayload);
  
      // Save updated list to localStorage
      localStorage.setItem('timesheetDataList', JSON.stringify(existingTimesheets));
      console.log("Timesheet data saved locally:", timesheetPayload);
  
         
      // Show success modal
      setShowSuccessModal(true);
        setTimesheetData([]);
      setSelectedMonth("");
      setInputData({
        employeeId:"",
        projectId:""
      })
 
      
  
    } catch (error) {
      console.error('Error saving timesheet data:', error);
      alert('Error saving timesheet data.');
    }
  };
  
  
  

  function addSubmitDataCancelFun() {
    setAddDataSubmitConfirmation(false)
  }

  const handleCancel = () => {
    navigate('/admin'); // Navigate back to the home page
  };

  

  async function addDataSumbitFun(){
    setAddDataSubmitConfirmation(false);

    const formattedTimesheetData = timesheetData.map((obj) => ({
      ...obj,
      date: obj.date.toISOString().split('T')[0], // Format date to YYYY-MM-DD
    }));

    console.log(formattedTimesheetData);


    if(formattedTimesheetData){

      try{
        let response= await axios.post("http://localhost:8081/api/working-hours",timesheetData);
         setSuccessModalForEmployeeAdd(true)
         
        setTimesheetData([]);
        setSelectedMonth("");
        setInputData({
          employeeId:"",
          projectId:""
        })
      }catch(error){

        console.log(error)

      }

    }   
     
}

  const handleForward = () => {
    const nextMonth = new Date(selectedMonth);
    nextMonth.setMonth(nextMonth.getMonth() + (showFirstHalf ? 0 : 1));
    setSelectedMonth(nextMonth.toISOString().split('T')[0].slice(0, 7));
    setShowFirstHalf(!showFirstHalf);
  };

  const handleBackward = () => {
    const previousMonth = new Date(selectedMonth);
    previousMonth.setMonth(previousMonth.getMonth() - (showFirstHalf ? 1 : 0));
    setSelectedMonth(previousMonth.toISOString().split('T')[0].slice(0, 7));
    setShowFirstHalf(!showFirstHalf);
  };


  const loadRecentTimesheetData = () => {
    const savedTimesheetDataList = JSON.parse(localStorage.getItem('timesheetDataList')) || [];
    if (savedTimesheetDataList.length > 0) {
      // Get the most recent timesheet based on the timestamp
      const mostRecentTimesheet = savedTimesheetDataList.reduce((latest, current) => {
        return current.timestamp > latest.timestamp ? current : latest;
      }, savedTimesheetDataList[0]);
      
      setGetValueFromLocal(mostRecentTimesheet.data.map(entry => ({
        date: new Date(entry.date),
        projectId: entry.projectId,
        employeeId: entry.employeeId,
        hours: entry.hours,
      })));
      console.log("Loaded recent timesheet data from localStorage:", mostRecentTimesheet);
    }
  };

  useEffect(()=>{
   loadRecentTimesheetData();
  },[])

  console.log("local",getValueFromLocal);

  

  function enteringProjectId(e){
    setInputData({...inputData,projectId:e.target.value})
    let updateProjectId = timesheetData.map((day)=>({

        ...day,
        projectId:e.target.value

      }))

      setTimesheetData(updateProjectId)

      setErrors({errors,projectId:""})

  }
 

  const enteringWorkHours= (rowIndex, value) => {
    if (!isNaN(value)) {

        if (value < 0 || value > 12) {
            // If the value is less than 0 or greater than 12 , we don't need do anything
            
          }else{
            // Update the timesheetData array
    const updatedTimesheetData = timesheetData.map((entry, index) => {
      if (index === rowIndex) {
        // Update the specific row index with the new value
        return {
          ...entry,
          // Assuming you want to update the 'workHours' field or similar
          hours: Number(value) 
        };
      }
      return entry;
    });
  
    setTimesheetData(updatedTimesheetData);
       
          }
       
    } else {
        value = 0;
    }


};

function enteringEmpId(e){

     setInputData({...inputData,employeeId:e.target.value})
  let updateEmpId = timesheetData.map((day)=>({

    ...day,
    employeeId:e.target.value

  }))

  setTimesheetData(updateEmpId)
  
   setErrors({...errors,employeeId:""})

}


function calculateTotalWorkHours() {
  return timesheetData.reduce((total, entry) => {
    // Ensure the hours field is a number and add it to the total
    const workHours = entry.hours ? parseFloat(entry.hours) : 0;
    return total + workHours;
  }, 0);
}

const isSunday = (date) => date.getDay() === 0;

  console.log("error",errors);

  async function confirmationForSubmit() {
    let hasErrors = false;
    const newErrors = { date: "", projectId: "", employeeId: "" };
  
    // Check if timesheetData is empty
    if (timesheetData.length === 0) {
      newErrors.date = "No timesheet data available";
      hasErrors = true;
    } else {
      // Validate each entry in timesheetData
      timesheetData.forEach((entry) => {
        if (!entry.date) {
          newErrors.date = "Date is required";
          hasErrors = true;
        }
        if (!entry.projectId) {
          newErrors.projectId = "Project ID is required";
          hasErrors = true;
        }
        if (!entry.employeeId) {
          newErrors.employeeId = "Employee ID is required";
          hasErrors = true;
        }
      });
    }
  
    // Update state with new errors
    setErrors(newErrors);
  
    // Prevent saving if there are errors
    if (hasErrors) {
      console.error('Validation errors:', newErrors);
      return;
    } else {
      setAddDataSubmitConfirmation(true);
  
     
    }
  }
  
  return (
    <div className="AddTimesheet background-clr">
      <div className="AddTimesheet employeeEdit-container pt-4">
        <div>
          <p className="AddTimesheet fs-4 text-secondary">Add Timesheet</p>
        </div>

        <div className="d-flex justify-content-between">
          <div className="m-1">
            <label htmlFor="fromMonth">Select Month and Year : </label>
            <input
              type="month"
              id="fromMonth"
              className="mx-1"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
          </div>
        <div>
            <button
              className="AddTimesheet btn btn-primary"
              onClick={handleBackward}
            >
              <i className="bi bi-caret-left-fill"></i>Backward
            </button>
            <button
              className="AddTimesheet btn btn-primary ms-2"
              onClick={handleForward}
            >
                            Forward<i className="bi bi-caret-right-fill"></i>
            </button>
          </div>
        </div>

        {errors && errors.date ? <small style={{color:"red",fontWeight:"bold"}}>{errors.date}</small> : ""}
       
        <div className='d-flex justify-content-between'>
           <div className="m-1">
            <label htmlFor="emp-id">EMP ID : </label>
            <input
              type="text"
              id="emp-id"
              className="mx-1"
              value={inputData.employeeId}
               onChange={enteringEmpId}
               placeholder=' Enter EMP ID'
            />
           </div>
          
        </div>
        {errors.employeeId && errors.employeeId ? <small style={{color:'red',fontWeight:"bold"}}>{errors.employeeId}</small>:""}
        
        


        <div className=" table-responsive border border-1 rounded p-4 border-black my-4" style={{ position: 'relative', zIndex: 1 }}>
          <table className="table table-bordered text-center">
            <thead>
              <tr>
                <th style={{ backgroundColor: '#c8e184' }}>Date</th>
                {timesheetData.map((entry, rowIndex) => (
                  <th key={rowIndex} style={{ backgroundColor: ' #c8e184' }}>
                    {entry.date.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </th>
                ))}
                
              </tr>
              <tr>
                <th style={{ backgroundColor: ' #c8e184' }}>Day</th>
                {timesheetData.map((entry, rowIndex) => (
                  <td
                    key={rowIndex}
                    style={{ backgroundColor: entry.date.getDay() === 0 ? 'gold' : '#c8e184' }}
                  >
                    {entry.date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </td>
                ))}
                
              </tr>
              <tr>
                <th><input type='text' className='w-100  ' value={inputData.projectId} onChange={enteringProjectId} placeholder='Enter Project Id' /></th>
                {timesheetData.map((entry,rowIndex)=>
                   <td><input key={rowIndex} type="text"
                   inputMode="numeric"
                   className="AddTimesheet form-control"
                   placeholder="0" value={entry.hours} min={0} max={15}  disabled={isSunday(entry.date)}  onChange={(e)=>enteringWorkHours(rowIndex,e.target.value)}></input></td>
                )}
                
              </tr>
               
            </thead>
          </table>

          {errors.projectId && errors.projectId ? <small style={{color:"red",fontWeight:"bold"}}>{errors.projectId}</small>:""}
        
        
        </div>

        <div>
          <span className="AddTimesheet fw-bold">Total Hours Worked : </span>{' '}
          <span className="AddTimesheet fw-bold">{calculateTotalWorkHours()}</span>
        </div>
        <div className="d-flex justify-content-center">
          <button
           type='button'
            className="AddTimesheet btn btn-primary m-3 w-5"
            onClick={saveTimesheetData}
            style={{ width: '100px' }}
          >
            Save
          </button>
          <button
            className="AddTimesheet btn btn-success m-3 w-5"
            onClick={confirmationForSubmit}
            style={{ width: '100px' }}
          >
            Submit
          </button>
          <button
            className="AddTimesheet btn btn-secondary m-3 w-5"
            onClick={handleCancel}
            style={{ width: '100px' }}
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Save Confirmation Modal */}
       {/* <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)}>
        <Modal.Body>Do you want to Save this sheet?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmationModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal> */}
      <Modal
        className="custom-modal"
        style={{ left: '50%', transform: 'translateX(-50%)' }}
        dialogClassName="modal-dialog-centered"
        show={showSuccessModal}
      >
        <div className="d-flex flex-column modal-success p-4         align-items-center">
          <img src={checkedImage} className="img-fluid mb-4" alt="successCheck" />
          <p className="mb-4 text-center">Your Timesheet has been Saved.</p>
          <button
            className="btn  w-100 text-white"
            onClick={() => navigate('/admin')}
            style={{ backgroundColor: '#5EAC24' }}>
            Close
          </button>
        </div>
      </Modal>

      <Modal show={addDataSubmitConfirmation}>
                <Modal.Body >Do you want to Submit?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={addSubmitDataCancelFun}>
                        Cancel
                    </Button>
                    <Button variant="success" onClick={addDataSumbitFun}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal className="custom-modal" style={{ left: '50%', transform: 'translateX(-50%)' }} dialogClassName="modal-dialog-centered" show={successModalForEmployeeAdd}  >
                <div className="d-flex flex-column modal-success p-4 align-items-center ">
                    <img src={successCheck} className="img-fluid mb-4" alt="successCheck" />
                    <p className="mb-4 text-center"> Your Timesheet has submitted for approval.</p>
                    <button className="btn  w-100 text-white" onClick={() => { navigate('/admin') }} style={{ backgroundColor: '#5EAC24' }}>Close</button>
                </div>
            </Modal>     
       
    </div>
  );
};

export default AdminAddTimesheet;










