import { useState } from 'react';
import {  Link } from 'react-router-dom';
import './supervisor.css'
function SupervisorHome() {
    const [isOpenTimesheet, setIsOpenTimesheet] = useState(true);
    const [isOpenLeaveManagement, setIsOpenLeaveManagement] = useState(true);
   

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
                                    <ul><Link to={'/supervisor/addtimesheet'}>Add Timesheet</Link></ul>
                                    <ul><Link to={'/supervisor/edittimesheet'}>Edit Timesheet</Link></ul>
                                    <ul><Link to={'/supervisor/rejecttimesheet'}>Reject Timesheet</Link></ul>
                                    <ul><Link to={'/supervisor/approvetimesheet'}>Approve Timesheet</Link></ul>

                                </div>
                            )}
                        </div>
                        <div className={`collapse-container mb-3 ${isOpenLeaveManagement ? 'active' : ''}`}>
                            <button onClick={() => setIsOpenLeaveManagement(!isOpenLeaveManagement)} className="collapse-toggle btn fw-bold">
                                Leave Management
                            </button>
                            {isOpenLeaveManagement && (
                                <div className="collapse-content ">
                                    <ul><Link to={'/supervisor/leaverequest'}>Add Leave Request</Link></ul>
                                    <ul><Link to={'/supervisor/editleaverequest'}>Edit Leave Request</Link></ul>
                                    <ul><Link to={''}>Reject Leave Request</Link></ul>
                                    <ul><Link to={'/supervisor/leaveapproval'}>Approve Leave Request</Link></ul>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='right-details'>

                        {/* notification about timesheet */}
                        <div className="row text-center ti-home-notification">

                            <div className="col   mx-5 my-2 p-2 ">Timesheet to be approved :</div>
                            <div className="col  mx-5  my-2 p-2  ">Rejected Timesheets :</div>

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
                                        <p className=''>Timesheet Period :</p>
                                        <p className=''>Created On :</p>
                                        <div className='d-flex justify-content-around flex-wrap '>
                                            <button className='status-btn p-2 m-2'>Status</button>
                                            <button className='view-btn p-2 m-2'>View</button>
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

export default SupervisorHome;