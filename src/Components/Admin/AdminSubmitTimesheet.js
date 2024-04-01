import axios from "axios";
// import employeeSheetUrl from "../../Api/submittimesheet";
import 'bootstrap/dist/css/bootstrap.min.css';
import Select from 'react-select';
import { useEffect, useState,useRef } from "react";
import { useNavigate } from "react-router-dom"
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';
// import './employeeEdit.css'


function AdminSubmitTimesheet() {
    const [timesheetData, setTimesheetData] = useState('');
    const [editId, setEditId] = useState('');
    const objectPositionRef = useRef(1);
    const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
    // const [isDropdownDisabled, setisDropdownDisabled] = useState(false)


    async function getEditTimesheet() {
        const response = await axios.get(`https://65c5a61be5b94dfca2e020d4.mockapi.io/sample/`);
        const datas = response.data;
        const length = datas.length;
        const sheetData = datas[length - objectPositionRef.current];
        setEditId(sheetData.id)
        setTimesheetData(sheetData);
         console.log("workingHours", sheetData.timesheetData);
         console.log("startDate", sheetData.StartDate)
    }

    useEffect(() => {
        getEditTimesheet();
    }, []);

    const handleChange = (selectedOptions) => {
        setTimesheetData((preValue) => ({
            ...preValue, workingProject: selectedOptions
        }));
    };
    const handleWorkHoursChange = (index, value) => {
        const newWorkHour = [...timesheetData.timesheetData];
        newWorkHour[index].hoursWorked = Number(value); // Update the hoursWorked property at the specified index
        setTimesheetData(prevState => ({
            ...prevState,
            timesheetData: newWorkHour // Update the timesheetData state with the modified array

        }));

    };
    // function calculateTotalWorkHours() {
    //     if (timesheetData.timesheetData) {
    //         const totalWorkHours = timesheetData.timesheetData.reduce((acc, cur) => acc + parseInt(cur.hoursWorked), 0);

    //         setTimesheetData(prevState => ({
    //             ...prevState,
    //             noOfHoursWorked: totalWorkHours
    //         }));
    //     }
    //     return 0; // Return 0 if timesheetData.timesheetData is not available
    // }
    useEffect(() => {
        // calculateTotalWorkHours();
    }, [timesheetData.timesheetData])

    function goToPreviousPage() {
        if (objectPositionRef.current > 3) return; // Prevent going beyond 3
        objectPositionRef.current += 1;
        getEditTimesheet();
    }

    async function SubmitData() {

        await axios.put(`https://65c5a61be5b94dfca2e020d4.mockapi.io/sample/${editId}`, timesheetData);
        // alert("data has been updated")
        const totalHoursWorked = timesheetData.noOfHoursWorked;
        const selectedProject = timesheetData.workingProject.label; // Assuming 'workingProject' has a 'label' property
        const startDate = timesheetData.StartDate;
        console.log("workingHours", totalHoursWorked);
         console.log("startDate", startDate)
         setSuccessModalOpen(true)
        //  setisDropdownDisabled(true)
    }

    // function SubmitData() {

    //    console.log("workingHours")
    // }

    function goToNextPage(){
        if (objectPositionRef.current <= 1) return;
        objectPositionRef.current -= 1;
        getEditTimesheet();
    }

    const handleClose = () => {setSuccessModalOpen(false); window.location.reload()}
    const navigate = useNavigate()

    const handleSuccess = ()=> {
        // navigate(''); window.location.reload()
        Swal.fire({icon: 'success',
    title: 'Success!',
    text: 'Timesheet submitted Successfully', showConfirmButton: true}).then(()=> {window.location.reload()})
      }


    return (
        <div className="background-clr">
            <div className="employeeEdit-container pt-4" >
                <div>
                    <p className='fs-4 '>Submit Timesheet</p>
                </div>

                <div className="d-flex justify-content-between" >
                    <div className="m-1">
                        <label htmlFor="fromDate">Select Date :  </label>
                        <input type="date" id="fromDate" className="mx-1" value={timesheetData.StartDate} readOnly></input>
                    </div>
                    <div className="d-flex justify-content-end flex-row">
                        <button className="btn btn-primary mx-2" onClick={goToPreviousPage} disabled={objectPositionRef.current >= 3}> <i class="bi bi-caret-left-fill"></i>Backward</button>
                        <button className="btn btn-primary mx-2" onClick={goToNextPage} disabled={objectPositionRef.current <= 1}>Forward<i class="bi bi-caret-right-fill"></i></button>
                    </div>
                </div>


                <div className=" border border-1 rounded p-4 border-black my-4 table-responsive" style={{ position: 'relative', zIndex: 1 }}>
                    <table className="table table-bordered  text-center">
                        <thead>
                            <tr>
                                <th style={{ backgroundColor: '#1C2FBA' }} className='text-white date-col'>Date</th>
                                {timesheetData && timesheetData.timesheetData.map((date) => (
                                    <th key={date.date}>{date.date}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>

                            <tr >
                                <th style={{ backgroundColor: '#1C2FBA' }} className='text-white projectid' >Day</th>
                                {timesheetData && timesheetData.timesheetData.map((date) => (
                                    <td key={date.date} style={{ backgroundColor: date.day.toLowerCase() === 'sunday' ? 'gold' : '' }}>{date.day}</td>
                                ))}
                            </tr>
                            <tr>
                                <td  className="projectid">

                                    <div>
                                        <Select
                                            options={timesheetData.projectOptions}
                                            
                                            value={timesheetData.workingProject}
                                            onChange={handleChange}
                                            placeholder="choose the project"
                                            className="my-2" 
                                            // isDisabled={timesheetData.isDropdownDisabled}
                                        />
                                    </div>
                                </td>
                                {timesheetData && timesheetData.timesheetData.map((date, index) => (
                                    <td key={date.date}  ><input type="number" className="workInput-edit border border-none text-center mt-3" readOnly value={date.hoursWorked} onChange={(e) => handleWorkHoursChange(index, e.target.value)}></input></td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div>
                    <span className='fw-bold'>Total Hours Worked : </span> <span className='fw-bold'>{timesheetData.noOfHoursWorked}</span>
                </div>
                
                <div className="d-flex justify-content-center" style={{ marginBottom: '50px' }}>
                    <button className="btn btn-success m-3 w-5" onClick={SubmitData} style={{ width: '100px',justifyContent: 'center' }}>Submit</button>
                    <button className="btn btn-secondary m-3 w-5" style={{ width: '100px',justifyContent: 'center' }}>Cancel</button>
                </div>
            </div>

      <Modal show={isSuccessModalOpen} onHide={handleClose}>        
        <Modal.Body>Do you want to Submit</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSuccess}>
            Yes 
          </Button>
        </Modal.Footer>
      </Modal>
        </div>
    );
}

export default AdminSubmitTimesheet;