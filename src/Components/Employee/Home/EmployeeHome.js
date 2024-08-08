import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../Supervisor/Home/supervisor.css'
import { useSelector, useDispatch } from 'react-redux';
import { submitON, submitOFF } from '../../features/submitBtn';
import axios from 'axios';
function EmployeeHome() {
    const [isOpenTimesheet, setIsOpenTimesheet] = useState(true);
    const [isOpenLeaveManagement, setIsOpenLeaveManagement] = useState(true);
    const [startSubmitDate, setStartSubmitDate] = useState("");
    const [endSubmitDate, setEndSubmitDate] = useState("");
    const [submitEmployeeId, setSubmitEmployeeId] = useState("")
    const [statusValue, setStatusValue] = useState("")
    const [countTimesheet,setCountTimesheet]=useState(0);
    const [rejectTimesheetCount,setRejectTimesheetCount]=useState(0)
    const dispatch = useDispatch();

    // setInterval(()=>{
    //     const savedSubmitState = localStorage.getItem('isSubmitOn');
    //     const startSubmitDate=  localStorage.getItem('startSubmitDate');
    //     const endSubmitDate=localStorage.getItem('endSubmitDate');
    //     const submitEmployeeId=localStorage.getItem('submitEmployeeId')
    //     if(savedSubmitState){
    //            timesheetState();
    //     }
    //    },1000)

    useEffect(() => {
        // Retrieve the submit state from local storage when the component mounts
        const savedSubmitState = localStorage.getItem('isSubmitOn');
        const startSubmitDate = localStorage.getItem('startSubmitDate');
        const endSubmitDate = localStorage.getItem('endSubmitDate');
        const submitEmployeeId = localStorage.getItem('submitEmployeeId')
        const status = localStorage.getItem('statusValue')
        if (savedSubmitState === 'true') {
            setStartSubmitDate(startSubmitDate);
            setEndSubmitDate(endSubmitDate);
            setSubmitEmployeeId(submitEmployeeId)
            setStatusValue(status)
            dispatch(submitON(true)); // Set the Redux state if needed
            setCountTimesheet(1);
        } else {
            setStartSubmitDate(startSubmitDate);
            setEndSubmitDate(endSubmitDate);
            setStatusValue(status)
            setCountTimesheet(0);
        }
    }, []);



    async function timesheetState() {

        if (startSubmitDate && endSubmitDate && submitEmployeeId) {
            try {
                let response = await axios.get(`http://localhost:8002/api/working-hours/${submitEmployeeId}/range?startDate=${startSubmitDate}&endDate=${endSubmitDate}`);
                let data = response.data;
                let statusValue = data[0].status;

                 if(statusValue==="APPROVED"){
                      setCountTimesheet(0)
                 }else if(statusValue==="REJECTED"){
                     setRejectTimesheetCount(1)
                     setCountTimesheet(0)
                 }

                // Check if all objects in the array have a status other than "NEW"
                const allApproved = data.every(obj => obj.status !== "NEW");

                if (allApproved) {
                    console.log(allApproved);
                    dispatch(submitOFF(false));
                    localStorage.removeItem('isSubmitOn');
                    localStorage.setItem('statusValue', statusValue);
                    localStorage.removeItem('submitEmployeeId');
                    setStatusValue(statusValue);


                    setSubmitEmployeeId("")
                    clearInterval(intervalId);
                } else {
                    setStatusValue("PENDING")
                }
            } catch (error) {
                console.error("Error fetching timesheet data:", error);
            }
        }
    }

    // Call the timesheetState function every second
    const intervalId = setInterval(timesheetState, 1000);


    return (
        <>
            <div className="ti-background-clr">

                <div className='ti-home-container'>

                    <div className='left-navigation'>
                        <div className={`collapse-container mb-3 ${isOpenTimesheet ? 'active' : ''}`}>
                            <button onClick={() => setIsOpenTimesheet(!isOpenTimesheet)} className="collapse-toggle btn fw-bold">
                                Timesheet Options
                            </button>
                            {isOpenTimesheet && (
                                <div className="collapse-content ">
                                    <ul><Link to={'/employee/addtimesheet'}>Add Timesheet</Link></ul>
                                    <ul><Link to={'/employee/edittimesheet'}>Edit Timesheet</Link></ul>
                                    <ul><Link to={'/employee/rejecttimesheet'}>View Rejected Timesheet</Link></ul>

                                </div>
                            )}
                        </div>
                        <div className={`collapse-container mb-3 ${isOpenLeaveManagement ? 'active' : ''}`}>
                            <button onClick={() => setIsOpenLeaveManagement(!isOpenLeaveManagement)} className="collapse-toggle btn fw-bold">
                                Leave Management
                            </button>
                            {isOpenLeaveManagement && (
                                <div className="collapse-content ">
                                    <ul><Link to={'/employee/leaverequest'}>Add Leave Request</Link></ul>
                                    <ul><Link to={'/employee/editleaverequest'}>Edit Leave Request</Link></ul>
                                    <ul><Link to={'/employee/rejectedleaverequests'}>View Rejected Leave Requests</Link></ul>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='right-details'>

                        {/* notification about timesheet */}
                        <div className="row text-center ti-home-notification">

                            <div className="col   mx-5 my-2 p-2 ">Timesheet to be approved : {countTimesheet}</div>
                            <div className="col  mx-5  my-2 p-2  ">Rejected Timesheets : {rejectTimesheetCount}</div>

                        </div>
                        <div className="row text-center ti-home-notification">
                            <div className="col   mx-5 my-2 p-2 ">Leaves to be approved :</div>
                            <div className="col  mx-5  my-2 p-2  ">Rejected Leave Request :</div>
                        </div>

                        <div className="row text-center ti-home-content mt-2">
                            {/* timesheet status */}
                            <div className="col mx-5 my-2 p-2 ">
                                <p className='p-2 title'>Your Submitted Timesheet</p>
                                <div className='body   p-2 text-start'>
                                    <div className='m-4 ti-home-ti-status p-4'>
                                        <h5 className=''> Timesheet Period </h5>

                                        <div className='d-flex flex-column ms-4'>
                                            <div className='d-flex align-items-center mb-2'>
                                                <p className='mb-0 me-2'>Start date :</p>
                                                <p className='mb-0'>{startSubmitDate}</p>
                                            </div>
                                            <div className='d-flex align-items-center mb-2'>
                                                <p className='mb-0 me-2'>End date :</p>
                                                <p className='mb-0'>{endSubmitDate}</p>
                                            </div>
                                            <div className='d-flex align-items-center'>
                                                <p className='mb-0 me-2'>STATUS :</p>
                                                {statusValue && <button className='view-btn p-2' style={{
                                                    backgroundColor:
                                                        statusValue === "APPROVED" ? "green" :
                                                            statusValue === "REJECTED" ? "red" :
                                                                "blue",
                                                    color: "white"  // Set the text color to white for better visibility
                                                }} >{statusValue}</button>}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            {/* navigation pages */}
                            <div className="col mx-5 my-2 p-2 ">
                                <p className='p-2 title'>Your Requested Leave</p>
                                <div className='body   p-2 text-start'>
                                    <div className='m-4 ti-home-ti-status p-4'>
                                        <p className=''> Requested Leave Period :</p>
                                        <p className=''>Created On :</p>
                                        <div className='d-flex justify-content-around flex-wrap '>
                                            <button className='status-btn p-2 m-2'>Status</button>
                                            <button className='view-btn p-2 m-2'>View</button>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>


                    </div>



                </div>


            </div>

        </>
    )

}

export default EmployeeHome;