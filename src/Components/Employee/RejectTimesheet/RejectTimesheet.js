
import axios from "axios";
import employeeSheetUrl from "../../Api/employeeEdit";
import Select from 'react-select';
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import successCheck from '../../Image/checked.png'

import { submitON,submitOFF } from '../../features/submitBtn';
import { useSelector,useDispatch } from 'react-redux';

function RejectTimesheet() {
    const employeeValue = useSelector(state => state.employeeLogin.value);
    const employeeId = employeeValue.employeeId;
    const [startSubmitDate, setStartSubmitDate] = useState("");
    const [endSubmitDate, setendSubmitDate] = useState("");
    const [submitTimesheetStatus, setsubmitTimesheetStatus] = useState("");
    const [submitEmployeeId, setSubmitEmployeeId] = useState("");
    const [submitButtonState, setSubmitButtonState] = useState("");
    const [timesheetData, setTimesheetData] = useState([]);
    const [editableData, setEditableData] = useState([]);
    const [uniqueDates, setUniqueDates] = useState("");
    const [uniqueProjectIds, setUniqueProjectIds] = useState("");
    const [projectDatas, setProjectDatas] = useState({})
    const [availableProjects, setAvailableProjects] = useState([]);
    const [error, setError] = useState("");
    const [workHourError, setWorkHourError] = useState("")
    let [totalWorkHours, setTotalWorkHours] = useState(0)
    const [editDataSaveConfirmation, setEditDataSaveConfirmation] = useState(false);
    const [saveModalForEmployeeRejectEdit, setSaveModalForEmployeeRejectEdit] = useState(false);
    const [rejectDataSubmitConfirmation, setRejectDataSubmitConfirmation] = useState(false);
    const [successModalForTimesheetApprove, setSuccessModalForTimesheetApprove] = useState(false);
    const [viewRejectReason, setViewRejectReason] = useState("");

    const dispatch= useDispatch();
    const navigate = useNavigate();

    useEffect(() => {

        async function getRejectTimesheet() {

            const savedSubmitState = localStorage.getItem(`isSubmitOn${employeeId}`);
            const startSubmitDate = localStorage.getItem(`startSubmitDate${employeeId}`);
            const endSubmitDate = localStorage.getItem(`endSubmitDate${employeeId}`);
            const submitEmployeeId = localStorage.getItem(`submitEmployeeId${employeeId}`)
            const status = localStorage.getItem(`statusValue${employeeId}`)
            setSubmitButtonState(savedSubmitState);
            setStartSubmitDate(startSubmitDate);
            setendSubmitDate(endSubmitDate);
            setSubmitEmployeeId(submitEmployeeId);
            setsubmitTimesheetStatus(status);

            if (status === "REJECTED" && startSubmitDate && endSubmitDate) {
                const response = await axios.get(`http://localhost:8090/workinghours/employee/${employeeId}/range?startDate=${startSubmitDate}&endDate=${endSubmitDate}`)
                const datas = response.data;
                // Iterate over each timesheet entry and update rejectionReason and status
                const updatedData = datas.map((data) => {
                    // Modify rejectionReason and status
                    return {
                        ...data,
                        rejectionReason: null, // Set rejectionReason to null
                        status: "NEW",         // Set status to "NEW"
                    };
                });

                // Set the updated data to the state
                setTimesheetData(updatedData);
                setEditableData(updatedData);

                const rejectReason = datas[0].rejectionReason;
                setViewRejectReason(rejectReason);


            }



        }

        getRejectTimesheet();
    }, [])


    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get('http://localhost:8081/admin/projects');
                let projectDatas = response.data;
                let projectIds = projectDatas.map((project) => project.projectId);
                setAvailableProjects(projectIds);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchProjects();
    }, []);

    const groupByProject = () => {
        const projectMap = {};
        timesheetData.forEach(entry => {
            if (!projectMap[entry.projectId]) {
                projectMap[entry.projectId] = {};
            }
            projectMap[entry.projectId][entry.date] = entry.hours;
        });
        setProjectDatas(projectMap);
    };


    const spiltingProject = () => {
        const uniqueDates = [...new Set(timesheetData.map(item => item.date))];
        const uniqueProjectIds = [...new Set(timesheetData.map(item => item.projectId))];
        setUniqueDates(uniqueDates);
        setUniqueProjectIds(uniqueProjectIds);
    };

    // console.log(uniqueDates)
    // console.log(uniqueProjectIds)

    useEffect(() => {

        spiltingProject();
        groupByProject();

    }, [timesheetData])

    function findOutDay(date) {
        const givenDate = new Date(date);
        const dayOftheweek = givenDate.toLocaleDateString('default', { weekday: "short" });
        return dayOftheweek;
    }

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const month = date.toLocaleString('default', { month: 'short' });
        return `${month} ${date.getDate()}`;
    };

    const getDay = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('default', { weekday: 'short' });
    };

    const updateProject = (newProjectId, index) => {
        console.log(newProjectId)
        console.log(index)
        // Check if the new project ID already exists
        if (uniqueProjectIds.includes(newProjectId) && uniqueProjectIds[index] !== newProjectId) {
            setError("Project already in use.");
            return;
        } else {
            setError(""); // Clear error if valid
        }

        // Capture the old projectId before it changes
        const oldProjectId = uniqueProjectIds[index];

        setUniqueProjectIds(prevUniqueProjectIds => {
            const newProjectIds = [...prevUniqueProjectIds];
            newProjectIds[index] = newProjectId;
            return newProjectIds;
        });

        setEditableData(prevEditableData => {
            return prevEditableData.map(entry => {
                if (entry.projectId === oldProjectId) {
                    return { ...entry, projectId: newProjectId };
                }
                return entry;
            });
        });
    };

    const handleHoursChange = (projectId, date, newHours) => {
        // Allow only numeric input
        if (/^\d*$/.test(newHours)) {

            setEditableData(prevData =>
                prevData.map(entry =>
                    entry.projectId === projectId && entry.date === date
                        ? { ...entry, hours: Number(newHours) }
                        : entry
                )
            );
            setWorkHourError("")
            // Calculate total hours for the date
            const totalHours = editableData
                .filter(entry => entry.date === date)
                .reduce((sum, entry) => sum + (entry.projectId === projectId ? parseInt(newHours) : parseInt(entry.hours)), 0);

            if (totalHours > 15) {
                setWorkHourError("Maximum work hours per day is 15.")
                setEditableData(prevData =>
                    prevData.map(entry =>
                        entry.projectId === projectId && entry.date === date
                            ? { ...entry, hours: 0 }
                            : entry
                    )
                );
            }
        }
    };

    const addProjectRow = () => {
        const newProjectId = ""; // Placeholder for new project ID
        setUniqueProjectIds([...uniqueProjectIds, newProjectId]);

        // Add entries for the new project in editableData with 0 hours for each date
        const newEntries = uniqueDates.map(date => ({
            employeeId: employeeId,
            projectId: newProjectId,
            date: date,
            hours: 0,

        }));

        setEditableData(prevEditableData => [...prevEditableData, ...newEntries]);
    };



    const deleteProjectRow = (index) => {
        const newUniqueProjectIds = [...uniqueProjectIds];
        const [removedProjectId] = newUniqueProjectIds.splice(index, 1);
        setUniqueProjectIds(newUniqueProjectIds);

        setEditableData(prevEditableData =>
            prevEditableData.filter(entry => entry.projectId !== removedProjectId)
        );
    };



    const calculateTotalWorkHours = () => {
        const total = editableData.reduce((acc, entry) => acc + entry.hours, 0);
        setTotalWorkHours(total);
    };

    useEffect(() => {
        calculateTotalWorkHours();
    }, [editableData])


    async function editDataSaveConfirmationFun() {
        setEditDataSaveConfirmation(true);
    }
    async function rejectDataSubmitConfirmationFun() {
        if (!error) {
            setRejectDataSubmitConfirmation(true);
        }
    }

    function goToEmployeeHome() {
        navigate('/employee')
    }



    function editDataCancelFun() {
        setEditDataSaveConfirmation(false)
    }
    function rejectSubmitDataCancelFun() {
        setRejectDataSubmitConfirmation(false)
    }
    function rejectDataSumbitFun() {
        setRejectDataSubmitConfirmation(false);
        setSuccessModalForTimesheetApprove(true)
    }


    async function editDataSaveFun() {
        setEditDataSaveConfirmation(false);

    }
    async function rejectDataSumbitFun() {
        setRejectDataSubmitConfirmation(false);
        try {
            // Use Promise.all to handle multiple async requests
            const promises = editableData.map(async (data) => {
                // Await inside map by turning the callback into an async function
                const response = await axios.put(`http://localhost:8090/workinghours/${data.id}`, data);
                return response;  // Optionally return the response if needed
            });
    
            // Await all promises
            await Promise.all(promises);
            dispatch(submitON(true));
            localStorage.setItem(`statusValue${employeeId}`, "NEW");
            localStorage.setItem(`isSubmitOn${employeeId}`, 'true');
            setSuccessModalForTimesheetApprove(true);
    
            // Optionally handle success here
            console.log("All requests successfully submitted");
        } catch (error) {
            console.error("Error submitting data:", error);
        }
    }
    
    function closeSuccessModal(){
        setSuccessModalForTimesheetApprove(false);
        navigate('/employee')
    }


    return (
        <>
            <div className="ti-background-clr">
               {timesheetData.length > 0 ? ( <div className="ti-data-field-container pt-4">
                    <div>
                        <p className='fs-4 text-danger '>Reject Timesheet</p>
                    </div>

                    <div className="p-1 my-2 border border-danger border-2 bg-light" >
                        <p>{viewRejectReason}</p>
                    </div>


                    <div className="d-flex justify-content-between">
                        <div className="m-1">
                            <label htmlFor="emp_id">Emp Id :  </label>
                            <input type="text" id="emp_id" className="mx-1" value={employeeId} readOnly />
                        </div>
                    </div>
                    <div className="d-flex justify-content-between">
                        <div className="m-1">
                            <label htmlFor="fromDate">Start Date: </label>
                            <input type="text" id="fromDate" className="mx-1" value={startSubmitDate} readOnly />
                        </div>
                    </div>

                    <div className="d-flex justify-content-between">
                        <div className="m-1">
                            <label htmlFor="fromDate">End Date :  </label>
                            <input type="text" id="fromDate" className="mx-1" value={endSubmitDate} readOnly />
                        </div>
                    </div>




                    <div className=" border table-responsive border-1 rounded p-4 border-black my-4" style={{ position: 'relative', zIndex: 1 }}>
                        {error && <div style={{ color: "red", marginLeft: "20px", fontWeight: 900 }}>{error}</div>}
                        <table className="table table-bordered border-dark text-center">

                            <thead>
                                <tr>
                                    <th style={{ backgroundColor: '#c8e184' }}>Date</th>
                                    {uniqueDates && uniqueDates.map((date) => (
                                        <th style={{ backgroundColor: '#c8e184' }} key={date}>{formatDate(date)}</th>
                                    ))}
                                    <td style={{ backgroundColor: '#c8e184' }}></td>
                                </tr>
                                <tr>
                                    <th style={{ backgroundColor: '#c8e184' }}>Day</th>
                                    {uniqueDates && uniqueDates.map((date) => (
                                        <td key={date} style={{ backgroundColor: getDay(date).toLowerCase() === 'sun' ? 'yellow' : '#c8e184' }}>{getDay(date)}</td>
                                    ))}
                                    <td style={{ backgroundColor: '#c8e184' }}></td>
                                </tr>
                            </thead>
                            <tbody>
                                {uniqueProjectIds && uniqueProjectIds.map((projectId, index) => (
                                    <tr key={index}>
                                        <td style={{ width: "120px", backgroundColor: '#e8fcaf' }}>
                                            <Select
                                                value={availableProjects.find(project => project === projectId) ? { value: projectId, label: projectId } : null}
                                                options={availableProjects.map(project => ({
                                                    value: project,
                                                    label: project,
                                                }))}
                                                className="AddTimesheet my-2"
                                                onChange={(selectedOption) => updateProject(selectedOption.value, index)}
                                            />

                                        </td>
                                        {uniqueDates.map(date => (
                                            <td key={date} style={{ backgroundColor: '#e8fcaf' }}>
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    className="AddTimesheet form-control my-3 text-center"
                                                    min={0}
                                                    max={12}
                                                    placeholder="0"
                                                    disabled={findOutDay(date).toLowerCase() === "sun"}
                                                    value={editableData.find(entry => entry.projectId === projectId && entry.date === date)?.hours || ""}
                                                    onChange={(e) => handleHoursChange(projectId, date, e.target.value)}
                                                />
                                            </td>
                                        ))}
                                        <td style={{ backgroundColor: '#e8fcaf' }}>
                                            <button type="button" className="AddTimesheet btn btn-danger my-3" onClick={() => deleteProjectRow(index)}>
                                                X
                                            </button>

                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                        <div className="d-flex ">
                            <button type="button" className="AddTimesheet btn btn-success ms-2" onClick={addProjectRow}>+</button>

                            {workHourError && <div className="mt-2" style={{ color: "red", marginLeft: "20px", fontWeight: 900 }}>{workHourError}</div>}

                        </div>
                    </div>
                    <div>
                        <span className='fw-bold'>Total Hours Worked : </span> <span className='fw-bold'>{totalWorkHours}</span>
                    </div>
                    <div className="d-flex justify-content-center" >

                        <button className="btn btn-success m-3 w-5" onClick={rejectDataSubmitConfirmationFun} style={{ width: '100px' }}>Submit</button>
                        <button className="btn btn-secondary m-3 w-5" onClick={goToEmployeeHome} style={{ width: '100px' }}>Cancel</button>
                    </div>

                </div> ): (<div className="no-timesheet">
                    <h3>No Rejected Timesheet Available</h3>
                    
                </div>)}
                

                <Modal show={rejectDataSubmitConfirmation}>
                    <Modal.Body >Do you want to Submit?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={rejectSubmitDataCancelFun}>
                            Cancel
                        </Button>
                        <Button variant="success" onClick={rejectDataSumbitFun}>
                            Submit
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal className="custom-modal" style={{ left: '50%', transform: 'translateX(-50%)' }} dialogClassName="modal-dialog-centered" show={successModalForTimesheetApprove}  >
                    <div className="d-flex flex-column modal-success p-4 align-items-center ">
                        <img src={successCheck} className="img-fluid mb-4" alt="successCheck" />
                        <p className="mb-4 text-center"> Your Timesheet has submitted for approval.</p>
                        <button className="btn  w-100 text-white" onClick={closeSuccessModal} style={{ backgroundColor: '#5EAC24' }}>Close</button>
                    </div>
                </Modal>
            </div>
        </>
    );
}

export default RejectTimesheet;
