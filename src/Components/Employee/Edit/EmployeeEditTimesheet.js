import axios from "axios";
import employeeSheetUrl from "../../Api/employeeEdit";
import Select from 'react-select';
import { useEffect, useState, useRef } from "react";
import './employeeEdit.css'
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import successCheck from '../../Image/checked.png'

function EmployeeEditTimesheet() {
    const [timesheetData, setTimesheetData] = useState([]);
    const [editData,setEditData]=useState({
        startDate:"",
        endDate:"",
        projectId:"",
        employeeId:""

    })
    const [getValueFromLocal,setGetValueFromLocal]=useState([]);
    const [editId, setEditId] = useState('');
    const objectPositionRef = useRef(1);
    const [editDataSaveConfirmation, setEditDataSaveConfirmation] = useState(false);
    const [saveModalForEmployeeEdit, setSaveModalForEmployeeEdit] = useState(false);

    const [successModalForEmployeeEdit, setSuccessModalForEmployeeEdit] = useState(false);
    const [editDataSubmitConfirmation, setEditDataSubmitConfirmation] = useState(false);


    const navigate = useNavigate();

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
    

      useEffect(()=>{
        getEditData();
      },[getValueFromLocal])
    
      console.log("edit Data",editData);
   

        

    const handleChange = (selectedOptions) => {
        setTimesheetData((preValue) => ({
            ...preValue, workingProject: selectedOptions
        }));

    };
    const handleWorkHoursChange = (index, value) => {
        if (!isNaN(value)) {

            if (value < 0 || value > 12) {
                // If the value is less than 0 or greater than 12 , we don't need do anything
                
              }else{
                const newWorkHour = [...timesheetData.timesheetData];
                newWorkHour[index].hoursWorked = Number(value); // Update the hoursWorked property at the specified index
                setTimesheetData(prevState => ({
                    ...prevState,
                    timesheetData: newWorkHour // Update the timesheetData state with the modified array
    
                }));
              }
           
        } else {
            value = 0;
        }

    };

    
    function calculateTotalWorkHours() {
        if (timesheetData.timesheetData) {
            const totalWorkHours = timesheetData.timesheetData.reduce((acc, cur) => acc + parseInt(cur.hoursWorked), 0);

            setTimesheetData(prevState => ({
                ...prevState,
                noOfHoursWorked: totalWorkHours
            }));
        }
        return 0; // Return 0 if timesheetData.timesheetData is not available
    }


    useEffect(() => {
        calculateTotalWorkHours();
    }, [timesheetData.timesheetData])

    function goToPreviousPage() {
        if (objectPositionRef.current > 3) return; // Prevent going beyond 3
        objectPositionRef.current += 1;
        // getEditTimesheet();
    }

    async function editDataSaveConfirmationFun() {
        setEditDataSaveConfirmation(true);
    }
    async function editDataSubmitConfirmationFun() {
        setEditDataSubmitConfirmation(true);        
    }

    function goToEmployeeHome() {
        navigate('/employee')
    }

    function goToNextPage() {
        if (objectPositionRef.current <= 1) return;
        objectPositionRef.current -= 1;
        // getEditTimesheet();
    }
    

    function editDataCancelFun() {
        setEditDataSaveConfirmation(false)
    }

    async function editDataSaveFun() {
        setEditDataSaveConfirmation(false);
        try {
            await axios.put(`${employeeSheetUrl}/${editId}`, timesheetData);
            setSaveModalForEmployeeEdit(true);
            console.log('Timesheet data saved successfully:', timesheetData);

        } catch (error) {
            console.log(error)
        }
    }

    async function editDataSumbitFun() {
        setEditDataSubmitConfirmation(false);
        try {
            await axios.put(`${employeeSheetUrl}/${editId}`, timesheetData);
            setSuccessModalForEmployeeEdit(true);
            console.log('Timesheet data submitted successfully:', timesheetData);
        } catch (error) {
            console.log(error)
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
                                        <button className="btn btn-primary mx-2" onClick={goToPreviousPage} disabled={objectPositionRef.current >= 3}> <i class="bi bi-caret-left-fill"></i>Backward</button>
                                        <button className="btn btn-primary mx-2" onClick={goToNextPage} disabled={objectPositionRef.current <= 1}>Forward  <i class="bi bi-caret-right-fill"></i></button>
                                    </div>
                                </div>
                                <div className=" d-flex justify-content-between">
                                    <div className="m-1">
                                        <label htmlFor="fromDate">End Date :  </label>
                                        <input type="text" id="fromDate" className="mx-1"  value={editData.endDate}  readOnly></input>
                                    </div>
                                   
                                </div>

                                <div className=" d-flex justify-content-between">
                                    <div className="m-1">
                                        <label htmlFor="emp_id">Emp Id :  </label>
                                        <input type="text" id="emp_id" className="mx-1"  value={editData.employeeId}  readOnly></input>
                                    </div>
                                   
                                </div>


                                <div className=" border table-responsive border-1 rounded p-4 border-black my-4" style={{ position: 'relative', zIndex: 1 }}>
                                    <table className="table table-bordered border-dark  text-center "  >
                                        <thead>
                                            <tr>
                                                <th style={{ backgroundColor: ' #c8e184' }} >Date</th>
                                                {getValueFromLocal && getValueFromLocal.map((date) => (
                                                    <th style={{ backgroundColor: ' #c8e184' }} key={date.date}>{formatDateToDDMMYYYY(date.date)}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>

                                            <tr>
                                                <th style={{ backgroundColor: '#c8e184' }} >Day</th>
                                                {/* {timesheetData && timesheetData.timesheetData.map((date) => (
                                                    <td key={date.date} style={{ backgroundColor: date.day.toLowerCase() === 'sunday' ? 'yellow' : ' #c8e184' }}>{date.day}</td>
                                                ))} */}
                                            </tr>
                                            <tr>
                                                <th style={{ backgroundColor: "#e8fcaf" }} >

                                                    <div >
                                                        <input type="text" className="w-100 mt-3" placeholder=" PROJECT ID " ></input>
                                                    </div>
                                                </th>
                                                {/* {timesheetData && timesheetData.timesheetData.map((date, index) => (
                                                    <td key={date.date} style={{ backgroundColor: '#e8fcaf' }}  ><input type="text" inputmode="numeric" className="ti-workInput-edit border border-none text-center mt-3 " value={date.hoursWorked} min={0} max={12}  onChange={(e) => handleWorkHoursChange(index, e.target.value)}></input></td>
                                                ))} */}
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div>
                                    <span className='fw-bold'>Total Hours Worked : </span> <span className='fw-bold'></span>
                                </div>
                                <div className="d-flex justify-content-center" >
                                    <button className="btn btn-primary m-3 w-5" onClick={editDataSaveConfirmationFun} style={{ width: '100px' }}>Save</button>
                                    <button className="btn btn-success m-3 w-5" onClick={editDataSubmitConfirmationFun} style={{ width: '100px' }}>Submit</button>
                                    <button className="btn btn-secondary m-3 w-5" onClick={goToEmployeeHome} style={{ width: '100px' }}>Cancel</button>
                                </div>

                            </div>

                        </div>

                    </div>
                    {/* confirmation modal */}
                    <Modal show={editDataSaveConfirmation}>

                        <Modal.Body >Do you want to Save this sheet?</Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={editDataCancelFun}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={editDataSaveFun}>
                                Save
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    {/* modal for success edit */}
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
                    <Button variant="success" onClick={editDataSumbitFun}>
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
