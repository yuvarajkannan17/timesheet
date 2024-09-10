import { useState, useEffect } from 'react';
import { Link,useLocation } from 'react-router-dom';
import '../../Supervisor/Home/supervisor.css'
import { useSelector, useDispatch } from 'react-redux';
import { submitON, submitOFF } from '../../features/submitBtn';

import { leaveSubmitON,leaveSubmitOFF } from '../../features/empLeaveSubmit';
import axios from 'axios';

function EmployeeHome() {
    
    const employeeValue = useSelector(state=>state.employeeLogin.value);
    const employeeId=employeeValue.employeeId;
    const [isOpenTimesheet, setIsOpenTimesheet] = useState(true);
    const [isOpenLeaveManagement, setIsOpenLeaveManagement] = useState(true);
    const [startSubmitDate, setStartSubmitDate] = useState("");
    const [endSubmitDate, setEndSubmitDate] = useState("");
    const [submitEmployeeId, setSubmitEmployeeId] = useState("")
    const [statusValue, setStatusValue] = useState("")
    const [countTimesheet,setCountTimesheet]=useState(0);
    const [rejectTimesheetCount,setRejectTimesheetCount]=useState(0);
    const [leaveObjectId,setLeaveObjectId]=useState("");
    const [isLeaveSubmit,setIsLeaveSubmit]=useState("");
    const [leaveSubmitEmpId,setLeaveSubmitEmpId]=useState("");
    const [leaveSubmitStartDate,setLeaveSubmitStartDate]=useState("");
    const [leaveSubmitEndDate,setLeaveSubmitEndDate]=useState("");
    const [leaveSubmitStatus,setLeaveSubmitStatus]=useState("");
    const [leavePending,setLeavePending]=useState(0)
    const [rejectLeave,setRejectLeave]=useState(0);
    const dispatch = useDispatch();
   
       
   
           
    useEffect(()=>{
     setLeaveObjectId(localStorage.getItem(`leaveObjectId${employeeId}`));
     
    },[])


       
    useEffect(() => {
        // Retrieve the submit state from local storage when the component mounts
        const savedSubmitState = localStorage.getItem(`isSubmitOn${employeeId}`);
        const startSubmitDate = localStorage.getItem(`startSubmitDate${employeeId}`);
        const endSubmitDate = localStorage.getItem(`endSubmitDate${employeeId}`);
        const submitEmployeeId = localStorage.getItem(`submitEmployeeId${employeeId}`)
        const status = localStorage.getItem(`statusValue${employeeId}`)
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
            setSubmitEmployeeId(submitEmployeeId)
            
        }
    }, []);



  

         async  function leaveStatus(){
                let response=  await axios.get(`http://localhost:8087/leaverequests/employee/${employeeId}`);
                let data= response.data;
               
                 let submitLeaveRequest=data.filter(obj=>obj.id==leaveObjectId);

                 
                                
                 submitLeaveRequest.map((obj)=>{
                    setLeaveSubmitStartDate(obj.startDate);
                    setLeaveSubmitEndDate(obj.endDate);
                    setLeaveSubmitStatus(obj.status);
            })
                 let leaveStatus = submitLeaveRequest.some(obj => obj.status === "PENDING");
                console.log(leaveStatus)
                  if(leaveStatus){
                     dispatch(leaveSubmitON(true));
               
                  }else{
                    dispatch(leaveSubmitOFF(false));
                   
                     
                  }
                
           }

           useEffect(()=>{
             leaveStatus();
           },[leaveObjectId])

    async function timesheetState() {

        if (startSubmitDate && endSubmitDate && submitEmployeeId) {
            try {
                let response = await axios.get(`http://localhost:8090/workinghours/employee/${submitEmployeeId}/range?startDate=${startSubmitDate}&endDate=${endSubmitDate}`);
                let data = response.data;
                let status = data[0].status;
                // console.log(statusValue);

                 if(status==="APPROVED"){
                      setStatusValue(status);
                      dispatch(submitOFF(false));
                      localStorage.setItem(`isSubmitOn${employeeId}`, 'false');
                      localStorage.setItem(`statusValue${employeeId}`, status);
                 }else if(status==="REJECTED"){
                     setStatusValue(status)
                     dispatch(submitOFF(false));
                      localStorage.setItem(`isSubmitOn${employeeId}`, 'false');
                      localStorage.setItem(`statusValue${employeeId}`, status);
                 }

                
            } catch (error) {
                console.error("Error fetching timesheet data:", error);
            }
        }
    }

 

    useEffect(()=>{
        timesheetState();
    },[startSubmitDate,endSubmitDate,employeeId])


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
                        {/* <div className="row text-center ti-home-notification">

                            <div className="col   mx-5 my-2 p-2 ">Timesheet to be approved : {countTimesheet}</div>
                            <div className="col  mx-5  my-2 p-2  ">Rejected Timesheets : {rejectTimesheetCount}</div>

                        </div>
                        <div className="row text-center ti-home-notification">
                            <div className="col   mx-5 my-2 p-2 ">Leaves to be approved : {leavePending}</div>
                            <div className="col  mx-5  my-2 p-2  ">Rejected Leave Request : {rejectLeave}</div>
                        </div> */}

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
                                        <h5 className=''> Leave Request Period </h5>

                                        <div className='d-flex flex-column ms-4'>
                                            <div className='d-flex align-items-center mb-2'>
                                                <p className='mb-0 me-2'>Start date :</p>
                                                <p className='mb-0'>{leaveSubmitStartDate}</p>
                                            </div>
                                            <div className='d-flex align-items-center mb-2'>
                                                <p className='mb-0 me-2'>End date :</p>
                                                <p className='mb-0'>{leaveSubmitEndDate}</p>
                                            </div>
                                            <div className='d-flex align-items-center'>
                                                <p className='mb-0 me-2'>STATUS :</p>
                                                {leaveSubmitStatus && <button className='view-btn p-2' style={{
                                                    backgroundColor:
                                                        leaveSubmitStatus === "APPROVED" ? "green" :
                                                            leaveSubmitStatus === "REJECTED" ? "red" :
                                                                "blue",
                                                    color: "white"  // Set the text color to white for better visibility
                                                }} >{leaveSubmitStatus}</button>}
                                            </div>
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