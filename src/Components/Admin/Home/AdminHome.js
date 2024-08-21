import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../Supervisor/Home/supervisor.css";
import { useSelector, useDispatch } from "react-redux";
import { submitON, submitOFF } from "../../features/submitBtn";
import { leaveSubmitON,leaveSubmitOFF } from '../../features/empLeaveSubmit';
import axios from "axios";

function AdminHome() {
  const [isOpenTimesheet, setIsOpenTimesheet] = useState(false);
  const [isOpenLeaveManagement, setIsOpenLeaveManagement] = useState(false);
  const [startSubmitDate, setStartSubmitDate] = useState("");
  const [endSubmitDate, setEndSubmitDate] = useState("");
  const [submitEmployeeId, setSubmitEmployeeId] = useState("");
  const [statusValue, setStatusValue] = useState("");
  const [countTimesheet, setCountTimesheet] = useState(0);
  const [rejectTimesheetCount, setRejectTimesheetCount] = useState(0);
  const [leaveObjectId,setLeaveObjectId]=useState("");
    const [isLeaveSubmit,setIsLeaveSubmit]=useState("");
    const [leaveSubmitEmpId,setLeaveSubmitEmpId]=useState("");
    const [leaveSubmitStartDate,setLeaveSubmitStartDate]=useState("");
    const [leaveSubmitEndDate,setLeaveSubmitEndDate]=useState("");
    const [leaveSubmitStatus,setLeaveSubmitStatus]=useState("");
    const [leavePending,setLeavePending]=useState(0)
    const [rejectLeave,setRejectLeave]=useState(0);
  const dispatch = useDispatch();

  const [isOpenEmployeeManagement, setIsOpenEmployeeManagement] =
    useState(false);
  const [isOpenProjectManagement, setIsOpenProjectManagement] = useState(false);

  
  useEffect(()=>{
    setLeaveObjectId(localStorage.getItem("leaveObjectId"));
   },[])

  useEffect(() => {
    // Retrieve the submit state from local storage when the component mounts
    const savedSubmitState = localStorage.getItem("isSubmitOn");
    const startSubmitDate = localStorage.getItem("startSubmitDate");
    const endSubmitDate = localStorage.getItem("endSubmitDate");
    const submitEmployeeId = localStorage.getItem("submitEmployeeId");
    const status = localStorage.getItem("statusValue");
    if (savedSubmitState === "true") {
      setStartSubmitDate(startSubmitDate);
      setEndSubmitDate(endSubmitDate);
      setSubmitEmployeeId(submitEmployeeId);
      setStatusValue(status);
      // dispatch(submitON(true)); // Set the Redux state if needed
      setCountTimesheet(1);
    } else {
      setStartSubmitDate(startSubmitDate);
      setEndSubmitDate(endSubmitDate);
      setStatusValue(status);
      setCountTimesheet(0);
    }
  }, []);

  async function count(){
    let response=  await axios.get("http://localhost:8081/admin/leave-requests");
    let data= response.data;
  if(data){
    let pendingCount= data.filter((obj)=>obj.status==="PENDING");
    
    let rejectCount= data.filter((obj)=>obj.status==="REJECTED");
    setLeavePending(pendingCount.length);
    setRejectLeave(rejectCount.length);
  }
}

useEffect(()=>{
    count();
},[])

     async  function leaveStatus(){
            let response=  await axios.get("http://localhost:8081/admin/leave-requests");
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
        let response = await axios.get(
          `http://localhost:8081/api/working-hours/all/range?startDate=${startSubmitDate}&endDate=${endSubmitDate}`
        );
        let data = response.data;
        console.log("timesheetData", data)
        let statusValue = data[0].status;

        if (statusValue === "APPROVED") {
          setCountTimesheet(0);
        } else if (statusValue === "REJECTED") {
          setRejectTimesheetCount(1);
          setCountTimesheet(0);
        }

        // Check if all objects in the array have a status other than "NEW"
        const allApproved = data.every((obj) => obj.status !== "NEW");

        if (allApproved) {
          console.log(allApproved);
          dispatch(submitOFF(false));
          localStorage.removeItem("isSubmitOn");
          localStorage.setItem("statusValue", statusValue);
          localStorage.removeItem("submitEmployeeId");
          setStatusValue(statusValue);

          setSubmitEmployeeId("");
          clearInterval(intervalId);
        } else {
          setStatusValue("PENDING");
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
        <div className="ti-home-container">
          <div className="left-navigation">
            <div
              className={`collapse-container mb-3 ${
                isOpenEmployeeManagement ? "active" : ""
              }`}
            >
              <button
                onClick={() =>
                  setIsOpenEmployeeManagement(!isOpenEmployeeManagement)
                }
                className="collapse-toggle btn fw-bold"
              >
                Employee Management
              </button>
              {isOpenEmployeeManagement && (
                <div className="collapse-content ">
                  <ul>
                    <Link to={"createemployee"}>Create Employee</Link>
                  </ul>
                  <ul>
                    <Link to={"uploademployees"}>Upload Employees</Link>
                  </ul>
                  <ul>
                    <Link to={"searchemployee"}>Search Employee</Link>
                  </ul>
                </div>
              )}
            </div>
            <div
              className={`collapse-container mb-3 ${
                isOpenTimesheet ? "active" : ""
              }`}
            >
              <button
                onClick={() => setIsOpenTimesheet(!isOpenTimesheet)}
                className="collapse-toggle btn fw-bold"
              >
                Timesheet Management
              </button>
              {isOpenTimesheet && (
                <div className="collapse-content ">
                  <ul>
                    <Link to={"/admin/adminaddtimesheet"}>Add Timesheet</Link>
                  </ul>
                  <ul>
                    <Link to={"/admin/adminedittimesheet"}>Edit Timesheet</Link>
                  </ul>
                  <ul>
                    <Link to={"/admin/adminrejecttimesheet"}>
                      View Rejected Timesheet
                    </Link>
                  </ul>
                  <ul>
                    <Link to={"/admin/approvalpage"}>Approve Timesheet</Link>
                  </ul>
                </div>
              )}
            </div>
            <div
              className={`collapse-container mb-3 ${
                isOpenLeaveManagement ? "active" : ""
              }`}
            >
              <button
                onClick={() => setIsOpenLeaveManagement(!isOpenLeaveManagement)}
                className="collapse-toggle btn fw-bold"
              >
                Leave Management
              </button>
              {isOpenLeaveManagement && (
                <div className="collapse-content ">
                  <ul>
                    <Link to={"/admin/adminaddleaverequest"}>
                      Add Leave Request
                    </Link>
                  </ul>
                  <ul>
                    <Link to={"/admin/admineditleaverequest"}>
                      Edit Leave Request
                    </Link>
                  </ul>
                  <ul>
                    <Link to={"/admin/adminviewrejectedleaverequests"}>
                      View Rejected Leave Requests
                    </Link>
                  </ul>
                  <ul>
                    <Link to={"adminapproveleaverequest"}>
                      Approve Leave Request
                    </Link>
                  </ul>
                </div>
              )}
            </div>
            <div
              className={`collapse-container mb-3 ${
                isOpenProjectManagement ? "active" : ""
              }`}
            >
              <button
                onClick={() =>
                  setIsOpenProjectManagement(!isOpenProjectManagement)
                }
                className="collapse-toggle btn fw-bold"
              >
                Project Management
              </button>
              {isOpenProjectManagement && (
                <div className="collapse-content">
                  <ul>
                    <Link to={"createproject"}>Add Project</Link>
                  </ul>
                  <ul>
                    <Link to={"updateprojectdetails"}>Update Project</Link>
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="right-details">
            <div className="row text-center ti-home-notification">
              <div className="col   mx-5 my-2 p-2 ">
                Timesheet to be approved : {countTimesheet}
              </div>
              <div className="col  mx-5  my-2 p-2  ">Rejected Timesheets : {rejectTimesheetCount}</div>
            </div>

            {/* notification about leave  */}
            <div className="row text-center ti-home-notification">
              <div className="col   mx-5 my-2 p-2 ">
                Leaves to be approved : {leavePending}
              </div>
              <div className="col  mx-5  my-2 p-2  ">
                Rejected Leave Request : {rejectLeave}
              </div>
            </div>

            {/* timesheet content */}
            <div className="row text-center ti-home-content mt-2">
              {/* timesheet status */}
              <div className="col mx-5 my-2 p-2 ">
                <p className="p-2 title">Your Submitted Timesheet</p>
                <div className="body   p-2 text-start">
                  <div className="m-4 ti-home-ti-status p-4">
                    <h5 className=""> Timesheet Period </h5>

                    <div className="d-flex flex-column ms-4">
                      <div className="d-flex align-items-center mb-2">
                        <p className="mb-0 me-2">Start date :</p>
                        <p className="mb-0">{startSubmitDate}</p>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <p className="mb-0 me-2">End date :</p>
                        <p className="mb-0">{endSubmitDate}</p>
                      </div>
                      <div className="d-flex align-items-center">
                        <p className="mb-0 me-2">STATUS :</p>
                        {statusValue && (
                          <button
                            className="view-btn p-2"
                            style={{
                              backgroundColor:
                                statusValue === "APPROVED"
                                  ? "green"
                                  : statusValue === "REJECTED"
                                  ? "red"
                                  : "blue",
                              color: "white", // Set the text color to white for better visibility
                            }}
                          >
                            {statusValue}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

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
  );
}
export default AdminHome;
