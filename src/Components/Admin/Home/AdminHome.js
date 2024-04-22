import { useState } from "react";
import {  Link } from 'react-router-dom';

function AdminHome() {
  const [isOpenTimesheet, setIsOpenTimesheet] = useState(false);
    const [isOpenLeaveManagement, setIsOpenLeaveManagement] = useState(false);  
const [isOpenEmployeeManagement, setIsOpenEmployeeManagement] = useState(false);
const [isOpenProjectManagement, setIsOpenProjectManagement] = useState(false);

  return (
    <>
      <div className="ti-background-clr">
        <div className="ti-home-container">
          

          <div className='left-navigation'>
          <div className={`collapse-container mb-3 ${isOpenEmployeeManagement ? 'active' : ''}`}>
                            <button onClick={() => setIsOpenEmployeeManagement(!isOpenEmployeeManagement)} className="collapse-toggle btn fw-bold">
                                Employee Management
                            </button>
                            {isOpenEmployeeManagement && (
                                <div className="collapse-content ">
                                    <ul><Link to={'createemployee'}>Create Employee</Link></ul>
                                    <ul><Link to={'uploademployees'}>Upload Employees</Link></ul>  
                                    <ul><Link to={'searchemployee'}>Search Employee</Link></ul>                                  
                                </div>
                            )}
                        </div>
                        <div className={`collapse-container mb-3 ${isOpenTimesheet ? 'active' : ''}`}>
                            <button onClick={() => setIsOpenTimesheet(!isOpenTimesheet)} className="collapse-toggle btn fw-bold">
                                Timesheet Management
                            </button>
                            {isOpenTimesheet && (
                                <div className="collapse-content ">
                                    <ul><Link to={'/admin/adminaddtimesheet'}>Add Timesheet</Link></ul>
                                    <ul><Link to={'/admin/adminedittimesheet'}>Edit Timesheet</Link></ul>
                                    <ul><Link to={'/admin/adminrejecttimesheet'}>Reject Timesheet</Link></ul>
                                    <ul><Link to={'/admin/approvalpage'}>Approve Timesheet</Link></ul>

                                </div>
                            )}
                        </div>
                        <div className={`collapse-container mb-3 ${isOpenLeaveManagement ? 'active' : ''}`}>
                            <button onClick={() => setIsOpenLeaveManagement(!isOpenLeaveManagement)} className="collapse-toggle btn fw-bold">
                                Leave Management
                            </button>
                            {isOpenLeaveManagement && (
                                <div className="collapse-content ">
                                    <ul><Link to={'/admin/adminaddleaverequest'}>Add Leave Request</Link></ul>
                                    <ul><Link to={'/admin/admineditleaverequest'}>Edit Leave Request</Link></ul>
                                    <ul><Link to={'/admin/adminviewrejectedleaverequests'}>View Rejected Leave Request</Link></ul>
                                    <ul><Link to={'adminapproveleaverequest'}>Approve Leave Request</Link></ul>
                                </div>
                            )}
                        </div>
                        <div className={`collapse-container mb-3 ${isOpenProjectManagement ? 'active' : ''}`}>
                            <button onClick={() => setIsOpenProjectManagement(!isOpenProjectManagement)} className="collapse-toggle btn fw-bold">
                                Project Management
                            </button>
                            {isOpenProjectManagement && (
                                <div className="collapse-content">
                                    <ul><Link to={'createproject'}>Add Project</Link></ul>
                                    <ul><Link to={'updateprojectdetails'}>Update Project</Link></ul>                                    
                                </div>
                            )}
                        </div>
                    </div>


          <div className='right-details'>
          <div className="row text-center ti-home-notification">
            <div className="col   mx-5 my-2 p-2 ">Timesheet to be approved :</div>
            <div className="col  mx-5  my-2 p-2  ">Rejected Timesheets :</div>
          </div>

          {/* notification about leave  */}
          <div className="row text-center ti-home-notification">
            <div className="col   mx-5 my-2 p-2 ">Leaves to be approved :</div>
            <div className="col  mx-5  my-2 p-2  ">Rejected Leave Request :</div>
          </div>

          {/* timesheet content */}
          <div className="row text-center ti-home-content mt-2">
            {/* timesheet status */}
            <div className="col mx-5 my-2 p-2 ">
              <p className="p-2 title">Your Submitted Timesheet</p>
              <div className="body   p-2 text-start">
                <div className="m-4 ti-home-ti-status p-4">
                  <p className="">Timesheet Period :</p>
                  <p className="">Created On :</p>
                  <div className="d-flex justify-content-around flex-wrap ">
                    <button className="status-btn p-2 m-2">Status</button>
                    <button className="view-btn p-2 m-2">View</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col mx-5 my-2 p-2 ">
              <p className="p-2 title">Your Requested Leave</p>
              <div className="body   p-2 text-start">
                <div className="m-4 ti-home-ti-status p-4">
                  <p className="">Requested Leave Period :</p>
                  <p className="">Created On :</p>
                  <div className="d-flex justify-content-around flex-wrap ">
                    <button className="status-btn p-2 m-2">Status</button>
                    <button className="view-btn p-2 m-2">View</button>
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
