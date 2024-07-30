import axios from "axios";
import employeeSheetUrl from "../../Api/employeeEdit";
import Select from 'react-select';
import { useEffect, useState, useRef } from "react";
import './employeeEdit.css'
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import successCheck from '../../Image/checked.png'

function EmployeeEditTimesheet() {
    const [overallLength, setOverallLength] = useState("");
    const [editData, setEditData] = useState({
        startDate: "",
        endDate: "",
        projectId: "",
        employeeId: ""

    })
    const [getValueFromLocal, setGetValueFromLocal] = useState([]);
    
    const objectPositionRef = useRef(1);
    
    const [saveModalForEmployeeEdit, setSaveModalForEmployeeEdit] = useState(false);

    const [successModalForEmployeeEdit, setSuccessModalForEmployeeEdit] = useState(false);
    const [editDataSubmitConfirmation, setEditDataSubmitConfirmation] = useState(false);


    const navigate = useNavigate();
    const loadRecentTimesheetData = () => {
        const savedTimesheetDataList = JSON.parse(localStorage.getItem('timesheetDataList')) || [];
        // console.log(savedTimesheetDataList.length)
        if (savedTimesheetDataList.length > 0) {
            const recentIndices = savedTimesheetDataList.slice(-3); // Get last 3 indices
              setOverallLength(recentIndices.length);
            setGetValueFromLocal(recentIndices[recentIndices.length - objectPositionRef.current].data.map(entry => ({
                date: new Date(entry.date),
                projectId: entry.projectId,
                employeeId: entry.employeeId,
                hours: entry.hours,
            })));
            // objectPositionRef.current = recentIndices.length - 1; // Set position to the latest index
        }
    };
    

    useEffect(() => {
        loadRecentTimesheetData();
    }, [])

    

    function formatDateToDDMMYYYY(date) {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    }


    function getEditData() {
        let firstObject = getValueFromLocal[0];
        let lastObject = getValueFromLocal[getValueFromLocal.length - 1];

        if (firstObject && lastObject) {
            setEditData({
                ...editData,
                "startDate": formatDateToDDMMYYYY(firstObject.date),
                "endDate": formatDateToDDMMYYYY(lastObject.date),
                "projectId": lastObject.projectId,
                "employeeId": lastObject.employeeId
            });
        }
    }


    useEffect(() => {
        getEditData();
    }, [getValueFromLocal])

    

    function formatDateToShortMonthDay(date) {
        const options = { month: 'short', day: 'numeric' };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    }

    function getDayOfWeek(date) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[date.getDay()];
    }



    const enteringWorkHours = (rowIndex, value) => {
        // Ensure the value is a number and clamp it between 0 and 12
        let workHours = isNaN(value) || value === '' ? 0 : Number(value);

        // Clamp the workHours to be within 0 and 12
        if (workHours < 0 || workHours > 12) {

        } else {
            // Update the timesheetData array
            const updatedTimesheetData = getValueFromLocal.map((entry, index) => {
                if (index === rowIndex) {
                    return { ...entry, hours: workHours };
                }
                return entry;
            });

            setGetValueFromLocal(updatedTimesheetData);
        }


    };


    function calculateTotalWorkHours() {
        return getValueFromLocal.reduce((total, entry) => {
            const workHours = entry.hours ? parseFloat(entry.hours) : 0;
            return total + workHours;
        }, 0);
    }



   
    async function editDataSubmitConfirmationFun() {
        setEditDataSubmitConfirmation(true);
    }

    function goToEmployeeHome() {
        navigate('/employee')
    }

    const goToPreviousPage = () => {
        if (objectPositionRef.current > 3) return; // Prevent going beyond 3
        objectPositionRef.current += 1;
        loadRecentTimesheetData();
    };
    
    const goToNextPage = () => {
        if (objectPositionRef.current <= 1) return; // Prevent going beyond 3
        objectPositionRef.current -= 1;
        loadRecentTimesheetData();
        
    };

    async function saveTimesheetData() {
        try {
            // Retrieve the existing timesheet data from local storage
            const savedTimesheetDataList = JSON.parse(localStorage.getItem('timesheetDataList')) || [];
            
            // Ensure we are working with the most recent 3 entries
            const recentIndices = savedTimesheetDataList.slice(-3);
            
            // Update the entry at the current index
            recentIndices[recentIndices.length - objectPositionRef.current].data = getValueFromLocal.map(entry => ({
                date: entry.date.toISOString(), // Ensure date is in string format
                projectId: entry.projectId,
                employeeId: entry.employeeId,
                hours: entry.hours,
            }));
            
            // Update the list in local storage
            localStorage.setItem('timesheetDataList', JSON.stringify([...savedTimesheetDataList.slice(0, -3), ...recentIndices]));
    
          
    
            // Notify the user of success
            setSaveModalForEmployeeEdit(true);
            console.log('Timesheet data saved successfully:', getValueFromLocal);
        } catch (error) {
            console.error('Error saving timesheet data:', error);
        }
    }
    
    async function submitTimesheetData() {
        setEditDataSubmitConfirmation(false);
    
        if (getValueFromLocal.length === 0) return;
    
        try {
            // Post data to backend
            await axios.post("http://localhost:8002/api/working-hours", getValueFromLocal);
    
            // Remove the submitted data from local storage
            const savedTimesheetDataList = JSON.parse(localStorage.getItem('timesheetDataList')) || [];
            const recentIndices = savedTimesheetDataList.slice(-3);
            const updatedIndices = recentIndices.filter((_, index) => index !== (recentIndices.length - objectPositionRef.current));
            localStorage.setItem('timesheetDataList', JSON.stringify([...savedTimesheetDataList.slice(0, -3), ...updatedIndices]));
    
            // Reset local state
            setGetValueFromLocal([]);
            setEditData({
                startDate: "",
                endDate: "",
                employeeId: "",
                projectId: ""
            });
    
            // Show success modal
            setSuccessModalForEmployeeEdit(true);
            console.log('Timesheet data submitted successfully:', getValueFromLocal);
        } catch (error) {
            console.log('Error submitting timesheet data:', error);
        }
    }
    

    function editSubmitDataCancelFun() {
        setEditDataSubmitConfirmation(false)
    }

    


    return (
        <>

            <div className="ti-background-clr">
                <div className="">
                    <div >
                        <div className="ti-data-field-container pt-4">
                            <div>
                                <p className='fs-4 '>Edit Timesheet</p>
                            </div>

                            <div className=" d-flex justify-content-between">
                                <div className="m-1">
                                    <label htmlFor="fromDate">Start Date: </label>
                                    <input type="text" id="fromDate" className="mx-1" value={editData.startDate} readOnly />
                                </div>
                                <div>
                                    <button className="btn btn-primary mx-2" onClick={goToPreviousPage} disabled={objectPositionRef.current>=overallLength}>
                                        <i className="bi bi-caret-left-fill"></i> Backward
                                    </button>
                                    <button className="btn btn-primary mx-2" onClick={goToNextPage} disabled={objectPositionRef.current <=1}>
                                        Forward <i className="bi bi-caret-right-fill"></i>
                                    </button>

                                </div>
                            </div>
                            <div className=" d-flex justify-content-between">
                                <div className="m-1">
                                    <label htmlFor="fromDate">End Date :  </label>
                                    <input type="text" id="fromDate" className="mx-1" value={editData.endDate} readOnly></input>
                                </div>

                            </div>

                            <div className=" d-flex justify-content-between">
                                <div className="m-1">
                                    <label htmlFor="emp_id">Emp Id :  </label>
                                    <input type="text" id="emp_id" className="mx-1" value={editData.employeeId} readOnly></input>
                                </div>

                            </div>


                            <div className=" border table-responsive border-1 rounded p-4 border-black my-4" style={{ position: 'relative', zIndex: 1 }}>
                                <table className="table table-bordered border-dark  text-center "  >
                                    <thead>
                                        <tr>
                                            <th style={{ backgroundColor: ' #c8e184' }} >Date</th>
                                            {getValueFromLocal && getValueFromLocal.map((date) => (
                                                <th style={{ backgroundColor: ' #c8e184' }} key={date.date}>{formatDateToShortMonthDay(date.date)}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>

                                        <tr>
                                            <th style={{ backgroundColor: '#c8e184' }} >Day</th>
                                            {getValueFromLocal && getValueFromLocal.map((date) => (
                                                <td key={date.date} style={{ backgroundColor: getDayOfWeek(date.date).toLowerCase() === 'sunday' ? 'yellow' : ' #c8e184' }}>{getDayOfWeek(date.date)}</td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <th style={{ backgroundColor: "#e8fcaf" }} >

                                                <div >
                                                    <input type="text" className=" mt-3" placeholder=" PROJECT ID " value={editData.projectId} readOnly ></input>
                                                </div>
                                            </th>
                                            {getValueFromLocal && getValueFromLocal.map((date, index) => (
                                                <td key={date.date} style={{ backgroundColor: '#e8fcaf' }}  ><input type="text" inputmode="numeric" className="ti-workInput-edit border border-none text-center mt-3 " value={date.hours} min={0} max={12} onChange={(e) => enteringWorkHours(index, e.target.value)}></input></td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div>
                                <span className='fw-bold'>Total Hours Worked :{calculateTotalWorkHours()} </span> <span className='fw-bold'></span>
                            </div>
                            <div className="d-flex justify-content-center" >
                                <button className="btn btn-primary m-3 w-5" onClick={saveTimesheetData} style={{ width: '100px' }}>Save</button>
                                <button className="btn btn-success m-3 w-5" onClick={editDataSubmitConfirmationFun} style={{ width: '100px' }}>Submit</button>
                                <button className="btn btn-secondary m-3 w-5" onClick={goToEmployeeHome} style={{ width: '100px' }}>Cancel</button>
                            </div>

                        </div>

                    </div>

                </div>
               
                <Modal className="custom-modal" style={{ left: '50%', transform: 'translateX(-50%)' }} dialogClassName="modal-dialog-centered" show={saveModalForEmployeeEdit}  >
                    <div className="d-flex flex-column modal-success p-4 align-items-center ">
                        <img src={successCheck} className="img-fluid mb-4" alt="successCheck" />
                        <p className="mb-4 text-center"> Your Timesheet has been updated.</p>
                        <button className="btn  w-100 text-white" onClick={() => { setSaveModalForEmployeeEdit(false) }} style={{ backgroundColor: '#5EAC24' }}>Close</button>
                    </div>
                </Modal>

                <Modal show={editDataSubmitConfirmation}>
                    <Modal.Body >Do you want to Submit?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={editSubmitDataCancelFun}>
                            Cancel
                        </Button>
                        <Button variant="success" onClick={submitTimesheetData}>
                            Submit
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal className="custom-modal" style={{ left: '50%', transform: 'translateX(-50%)' }} dialogClassName="modal-dialog-centered" show={successModalForEmployeeEdit}  >
                    <div className="d-flex flex-column modal-success p-4 align-items-center ">
                        <img src={successCheck} className="img-fluid mb-4" alt="successCheck" />
                        <p className="mb-4 text-center"> Your Timesheet has submitted for approval.</p>
                        <button className="btn  w-100 text-white" onClick={() => { setSuccessModalForEmployeeEdit(false) }} style={{ backgroundColor: '#5EAC24' }}>Close</button>
                    </div>
                </Modal>

            </div>

        </>


    );
}

export default EmployeeEditTimesheet;
