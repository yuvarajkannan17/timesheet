import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';
import { submitON,submitOFF } from '../../features/submitBtn';
import { Modal, Button } from "react-bootstrap";
import successCheck from "../../Image/checked.png";

import './AddTimesheet.css';

const AddTimesheet = () => {
  const [total, setTotal] = useState(0);
  const [startSubmitDate,setStartSubmitDate]=useState("");
  const [endSubmitDate,setEndSubmitDate]=useState("");
  const [submitSupervisorId,setSubmitSupervisorId]=useState("")
  const [hoursError, setHoursError] = useState("");
  const [selectedMonth, setSelectedMonth] = useState('');
  const [projectIdError, setProjectIdError] = useState("");
  const [timesheetData, setTimesheetData] = useState([]);
  const [availableProjects, setAvailableProjects] = useState([]);
  const [projectRows, setProjectRows] = useState([{}]);
  const [showFirstHalf, setShowFirstHalf] = useState(true);  
  const [addDataSubmitConfirmation,setAddDataSubmitConfirmation]=useState(false);
  const [successModalForTimesheet,setSuccessModalForTimesheet]=useState(false);
  const [saveModalForTimesheet,setSaveModalForTimesheet]=useState(false)

  let navigate = useNavigate();

  let {isSubmit} =useSelector((state)=>state.submitBtn.value);
 const dispatch= useDispatch();
  
  
 const supervisorValue = useSelector(state=>state.supervisorLogin.value);
 const supervisorId=supervisorValue.supervisorId;

  useEffect(() => {
    generateTimesheetData(selectedMonth);
  }, [selectedMonth, showFirstHalf]);

 

  

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:8081/admin/projects');
         let projectDatas=response.data;
        let projectIds= projectDatas.map((project)=>project.projectId);
        setAvailableProjects(projectIds);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

 

  const handleForward = () => {
    if (selectedMonth) {
      const nextMonth = new Date(selectedMonth);
      nextMonth.setMonth(nextMonth.getMonth() + (showFirstHalf ? 0 : 1));
      setSelectedMonth(nextMonth.toISOString().split('T')[0].slice(0, 7));
      setShowFirstHalf(!showFirstHalf);
    }
  };

  const handleBackward = () => {
    if (selectedMonth) {
      const previousMonth = new Date(selectedMonth);
      previousMonth.setMonth(previousMonth.getMonth() - (showFirstHalf ? 1 : 0));
      setSelectedMonth(previousMonth.toISOString().split('T')[0].slice(0, 7));
      setShowFirstHalf(!showFirstHalf);
    }
  };

  const generateTimesheetData = (selectedMonth) => {
    if (!selectedMonth) return;

    const currentYear = parseInt(selectedMonth.slice(0, 4));
    const currentMonth = parseInt(selectedMonth.slice(5, 7)) - 1; // Zero-indexed month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const startDay = showFirstHalf ? 1 : 16;
    const endDay = showFirstHalf ? 15 : daysInMonth;

    const newTimesheetData = Array.from({ length: endDay - startDay + 1 }, (_, i) => {
      const dayOfMonth = startDay + i;
      const date = new Date(currentYear, currentMonth, dayOfMonth);
      return { date };
    });

    setTimesheetData(newTimesheetData);
  };

  console.log(timesheetData);
   
  const handleProjectChange = (rowIndex, selectedOption) => {
    if (selectedOption && selectedOption.value) {
      setProjectIdError(""); // Clear the error when a valid projectId is selected
        let result=projectRows.some(project=>project.projectId===selectedOption.value);
        if(result){
           setProjectIdError("Project Already In Use")
        }else{
          const updatedProjectRows = [...projectRows];
          updatedProjectRows[rowIndex] = {
            ...updatedProjectRows[rowIndex],
            projectId: selectedOption.value
          };
          setProjectRows(updatedProjectRows);
        }
    } else {
      setProjectIdError("Please select a valid project");
    }
  };
  
  const isSunday = (date) => date.getDay() === 0;

  const handleWorkHoursChange = (rowIndex, columnIndex, value) => {
    let parsedValue = value.replace(/[^0-9]/g, '');
    parsedValue = parsedValue ? Number(parsedValue) : 0;

    const newProjectRows = [...projectRows];
    const previousValue = Number(newProjectRows[rowIndex].workHours?.[columnIndex] || 0);
    let dayTotal = 0;

    newProjectRows.forEach((row) => {
      if (row.workHours && row.workHours[columnIndex]) {
        dayTotal += Number(row.workHours[columnIndex]);
      }
    });

    const newDayTotal = dayTotal - previousValue + parsedValue;

    if (newDayTotal <= 15) {
      if (!newProjectRows[rowIndex].workHours) {
        newProjectRows[rowIndex].workHours = {};
      }
      newProjectRows[rowIndex].workHours[columnIndex] = parsedValue;
      setProjectRows(newProjectRows);
      setHoursError("");
      if (projectIdError && projectRows[rowIndex].projectId) {
        setProjectIdError("");
      }
    } else {
      setHoursError('Maximum work hours per day is 15.');
      if (newProjectRows[rowIndex].workHours) {
        newProjectRows[rowIndex].workHours[columnIndex] = previousValue;
      } else {
        newProjectRows[rowIndex].workHours = { [columnIndex]: previousValue };
      }
      setProjectRows(newProjectRows);
    }
  };

  function calculateTotalWorkHours() {
    let totalWorkHours = 0;
    projectRows.forEach((row) => {
      if (row.workHours) {
        for (let key in row.workHours) {
          totalWorkHours += Number(row.workHours[key]);
        }
      }
    });
    setTotal(totalWorkHours);
  }

  useEffect(() => {
    calculateTotalWorkHours();
  }, [projectRows]);

  
  const handleAddRow = () => {
    setProjectRows((prev) => [...prev, {}]);
  };

  const handleRemoveRow = (rowIndex) => {
    const newProjectRows = [...projectRows];
    newProjectRows.splice(rowIndex, 1);
    setProjectRows(newProjectRows);
  };

  const validateTimesheetData = () => {
    let isValid = true;

   
    const invalidRows = projectRows.filter(row => !row.projectId || !Object.values(row.workHours || {}).some(hours => hours > 0));
    if (invalidRows.length > 0) {
      setProjectIdError("Please select a valid project and enter work hours.");
      isValid = false;
    } else {
      setProjectIdError("");
    }

    return isValid;
  };

  const saveTimesheetData = () => {
    if (validateTimesheetData()) {
      // Array to hold the formatted timesheet entries
      
      const formattedData = [];
    
      // Create a date formatter for 'en-GB' locale
      const dateFormatter = new Intl.DateTimeFormat('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    
      // Initialize formattedData with zero hours for all dates
      timesheetData.forEach((entry) => {
        const formattedDate = dateFormatter.format(entry.date);
        const [day, month, year] = formattedDate.split('/');
        const dateStr = `${year}-${month}-${day}`; // Convert to YYYY-MM-DD
    
        projectRows.forEach((row) => {
          if (row.projectId) {
            // Ensure that each date for each project has an entry
            formattedData.push({
              employeeId:supervisorId,
              projectId: row.projectId,
              date: dateStr,
              hours: 0, // Default to zero hours
            });
          }
        });
      });
    
      // Update formattedData with entered work hours
      projectRows.forEach((row) => {
        if (row.projectId && row.workHours) {
          Object.entries(row.workHours).forEach(([columnIndex, hours]) => {
            if (hours) {
              const formattedDate = dateFormatter.format(timesheetData[columnIndex].date);
              const [day, month, year] = formattedDate.split('/');
              const dateStr = `${year}-${month}-${day}`; // Convert to YYYY-MM-DD
    
              // Find and update existing entry or add new one if not present
              const existingEntry = formattedData.find(
                (entry) =>
                  entry.employeeId === supervisorId &&
                  entry.projectId === row.projectId &&
                  entry.date === dateStr
              );
    
              if (existingEntry) {
                existingEntry.hours = parseFloat(hours);
              } else {
                formattedData.push({
                  employeeId:supervisorId,
                  projectId: row.projectId,
                  date: dateStr,
                  hours: parseFloat(hours),
                });
              }
            }
          });
        }
      });
    
      // Retrieve existing data from local storage
      const existingData = JSON.parse(localStorage.getItem(supervisorId)) || [];
    
      // Append new data to the existing data
      existingData.push(formattedData);
    
      // Save updated data back to local storage
      localStorage.setItem(supervisorId, JSON.stringify(existingData));
        setSaveModalForTimesheet(true);
      // Log the data for debugging
      
    }
    
  };
  
  
  
 
  const submitTimesheetData = async () => {
    if (!validateTimesheetData()) {
      return;
    }
     setAddDataSubmitConfirmation(false);
    // Array to hold the formatted timesheet entries
    const formattedData = [];
  
    // Create a date formatter for 'en-GB' locale
    const dateFormatter = new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  
    // Initialize formattedData with zero hours for all dates
    timesheetData.forEach((entry) => {
      const formattedDate = dateFormatter.format(entry.date);
      const [day, month, year] = formattedDate.split('/');
      const dateStr = `${year}-${month}-${day}`; // Convert to YYYY-MM-DD
  
      projectRows.forEach((row) => {
        if (row.projectId) {
          // Ensure that each date for each project has an entry
          formattedData.push({
            employeeId:supervisorId,
            projectId: row.projectId,
            date: dateStr,
            hours: 0, // Default to zero hours
          });
        }
      });
    });
  
    // Update formattedData with entered work hours
    projectRows.forEach((row) => {
      if (row.projectId && row.workHours) {
        Object.entries(row.workHours).forEach(([columnIndex, hours]) => {
          if (hours) {
            const formattedDate = dateFormatter.format(timesheetData[columnIndex].date);
            const [day, month, year] = formattedDate.split('/');
            const dateStr = `${year}-${month}-${day}`; // Convert to YYYY-MM-DD
  
            // Find and update existing entry or add new one if not present
            const existingEntry = formattedData.find(
              (entry) =>
                entry.employeeId === supervisorId &&
                entry.projectId === row.projectId &&
                entry.date === dateStr
            );
  
            if (existingEntry) {
              existingEntry.hours = parseFloat(hours);
            } else {
              formattedData.push({
                employeeId:supervisorId,
                projectId: row.projectId,
                date: dateStr,
                hours: parseFloat(hours),
              });
            }
          }
        });
      }
    });
  
  
    console.log(formattedData);
    
  
    // Check if there is any data to send
    if (formattedData.length > 0) {
      try {
        // Send the data to the backend
        const response = await axios.post("http://localhost:8086/sup/api/working-hours", formattedData);
        console.log(response)
        
          if(response.data){
            let data=response.data;

            console.log(data);

           let statusValue= data[0].status;
             dispatch(submitON(true));
              localStorage.setItem(`isSubmitOn${supervisorId}`, 'true');
              let receviedData=response.data;
             let lengthOfData=receviedData.length;
            let last=receviedData[lengthOfData-1];
            let lastDate=last.date;
           let first= receviedData[0];
          let empId=  first.employeeId;
           let firstDate=first.date;
            setSubmitSupervisorId(empId);
            setStartSubmitDate(firstDate);
            setEndSubmitDate(lastDate);
            localStorage.setItem(`startSubmitDate${supervisorId}`, firstDate);
            localStorage.setItem(`endSubmitDate${supervisorId}`, lastDate);
            localStorage.setItem(`submitSupervisorId${supervisorId}`, empId);
            localStorage.setItem(`statusValue${supervisorId}`, statusValue);
         
           setSuccessModalForTimesheet(true);
           
          }

        console.log(formattedData);
      } catch (error) {
        // Handle errors in the request
        console.error("Error saving timesheet data:", error);
      }
    } else {
      console.log("No data to save.");
    }
  };

  function closeSuccessModal(){
      setSuccessModalForTimesheet(false);
      navigate("/supervisor")
  }
  function closeSaveModal(){
    setSaveModalForTimesheet(false)
    navigate("/supervisor")
}
  console.log(projectRows)

  
  // Get the current month in YYYY-MM format
const currentMonth = new Date().toISOString().slice(0, 7); // e.g., "2024-10"

// Create a Date object from the current month
const [year, month] = currentMonth.split('-').map(Number); // Split and convert to numbers
const currentDate = new Date(year, month - 1); // month - 1 because month is 0-indexed

// Add 6 months
currentDate.setMonth(currentDate.getMonth() + 5);

// Get the new year and month in the desired format
const newYear = currentDate.getFullYear();
const newMonth = currentDate.getMonth() + 1; // Adding 1 to make it 1-indexed

// Format the result as YYYY-MM
const endMonth = `${newYear}-${newMonth < 10 ? '0' : ''}${newMonth}`; // Add leading zero if needed


  
   
 


  useEffect(() => {
    // Get the current month and year
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
    setSelectedMonth(`${year}-${month}`);
    

  }, []);

  
  const getMaxDate = () => {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + 5);
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    
    return `${year}-${month}`;
  };
 
  
  

  return (
    <div className="AddTimesheet background-clr">
      <div className="AddTimesheet employeeEdit-container pt-4">
        <div>
          <p className='AddTimesheet fs-4 text-secondary'>Add Timesheet</p>
        </div>

        <div className="d-flex justify-content-between">
          <div className="m-1">
            <label htmlFor="fromMonth">SELECT MONTH AND YEAR :  </label>
            <input
              type="month"
              id="fromMonth"
              className="mx-1"
              value={selectedMonth}
              min={`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`}
              max={getMaxDate()}
              onChange={(e) => setSelectedMonth(e.target.value)}

            />
          </div>
          {selectedMonth && <div>
            <button
              className="AddTimesheet btn btn-primary"
              onClick={handleBackward}
              disabled={(selectedMonth===currentMonth)&&(showFirstHalf)}
            >
              <i className="bi bi-caret-left-fill"></i>Backward
            </button>
            <button
              className="AddTimesheet btn btn-primary ms-2"
              onClick={handleForward}
              disabled={(selectedMonth===endMonth)&&(!showFirstHalf)}
              
            >
              Forward <i className="bi bi-caret-right-fill"></i>
            </button>
          </div>}
        </div>

        

        

        {selectedMonth && <div>
          <div className="table-responsive border border-1 rounded p-4 border-black my-4" style={{ position: 'relative', zIndex: 1 }}>
            {projectIdError && <div style={{ color: "red", fontWeight: "bold" }}>{projectIdError}</div>}
            <table className="table table-bordered border-dark text-center">
              <thead>
                <tr>
                  <th style={{ backgroundColor: '#c8e184' }}>Date</th>
                  {timesheetData.map((entry, index) => (
                    <th key={index} style={{ backgroundColor: ' #c8e184' }}>
                      {entry.date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </th>
                  ))}
                  <th style={{ backgroundColor: '#c8e184' }}></th>
                </tr>
                <tr>
                  <th style={{ backgroundColor: ' #c8e184' }}>Day</th>
                  {timesheetData.map((entry, index) => (
                    <td key={index} style={{ backgroundColor: entry.date.getDay() === 0 ? 'gold' : '#c8e184' }}>
                      {entry.date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </td>
                  ))}
                  <td style={{ backgroundColor: '#c8e184' }}></td>
                </tr>
              </thead>
              <tbody>
                {projectRows.map((project, rowIndex) => (
                  <tr key={rowIndex}>
                    <td style={{ width: "120px", backgroundColor: '#e8fcaf' }} >
                      <Select
                        options={availableProjects.map((projectId) => ({
                          value: projectId,
                          label: projectId,
                        }))}
                        value={project.projectId ? { value: project.projectId, label: project.projectId } : null}
                        onChange={(selectedOption) => handleProjectChange(rowIndex, selectedOption)}
                        placeholder="Project ID"
                        className="AddTimesheet my-2"
                      />
                    </td>
                    {timesheetData.map((entry, columnIndex) => (
                      <td key={columnIndex} style={{ backgroundColor: '#e8fcaf' }}>
                        <input
                          type="text"
                          inputMode='numeric'
                          className="AddTimesheet form-control my-3 text-center"
                          placeholder="0"
                          value={project.workHours ? project.workHours[columnIndex] : ''}
                          disabled={isSunday(entry.date)}
                          onChange={(e) => handleWorkHoursChange(rowIndex, columnIndex, e.target.value)}
                        />
                      </td>
                    ))}
                    <td style={{ backgroundColor: '#e8fcaf' }} >
                      <button
                        className="AddTimesheet btn btn-danger my-3"
                        onClick={() => handleRemoveRow(rowIndex)}
                      >
                        X
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              className="AddTimesheet btn btn-success ms-2"
              onClick={handleAddRow}
            >
              +
            </button>
            {hoursError && <div style={{ color: 'red', fontWeight: 'bold' }}>{hoursError}</div>}
          </div>

          <div>
            <span className='AddTimesheet fw-bold'>Total Hours Worked : {total}</span>
          </div>
          <div className="d-flex justify-content-center">
            <button className="AddTimesheet btn btn-primary m-3 w-5" onClick={saveTimesheetData} style={{ width: '100px' }}>Save</button>
            <button className="AddTimesheet btn btn-success m-3 w-5" onClick={()=> setAddDataSubmitConfirmation(true)} disabled={isSubmit} style={{ width: '100px' }}>Submit</button>
            <button className="AddTimesheet btn btn-secondary m-3 w-5" style={{ width: '100px' }} onClick={() => { navigate('/supervisor') }}>Cancel</button>
          </div>
        </div>}
      </div>
      <Modal show={addDataSubmitConfirmation}>
                <Modal.Body >Do you want to Submit?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={()=>setAddDataSubmitConfirmation(false)}>
                        Cancel
                    </Button>
                    <Button variant="success" onClick={submitTimesheetData}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal className="custom-modal" style={{ left: '50%', transform: 'translateX(-50%)' }} dialogClassName="modal-dialog-centered" show={successModalForTimesheet}  >
                <div className="d-flex flex-column modal-success p-4 align-items-center ">
                    <img src={successCheck} className="img-fluid mb-4" alt="successCheck" />
                    <p className="mb-4 text-center"> You Have Submitted Timesheet For Approval .</p>
                    <p className="mb-4 text-center"><b>  {startSubmitDate} To {endSubmitDate} </b></p>
                    <button className="btn  w-100 text-white" onClick={closeSuccessModal} style={{ backgroundColor: '#5EAC24' }}>Close</button>
                </div>
            </Modal>  
            <Modal className="custom-modal" style={{ left: '50%', transform: 'translateX(-50%)' }} dialogClassName="modal-dialog-centered" show={saveModalForTimesheet}  >
                <div className="d-flex flex-column modal-success p-4 align-items-center ">
                    <img src={successCheck} className="img-fluid mb-4" alt="successCheck" />
                    <p className="mb-4 text-center"> Your Timesheet Saved Successfully.</p>
                    <button className="btn  w-100 text-white" onClick={closeSaveModal} style={{ backgroundColor: '#5EAC24' }}>Close</button>
                </div>
            </Modal> 
    </div>
  );
};

export default AddTimesheet;
