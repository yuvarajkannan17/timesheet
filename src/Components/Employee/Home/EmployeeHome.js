import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../../Supervisor/Home/supervisor.css'
function EmployeeHome() {
    const [isOpenTimesheet, setIsOpenTimesheet] = useState(false);
    const [isOpenLeaveManagement, setIsOpenLeaveManagement] = useState(false);
    const navigate = useNavigate();

    function goToAddTimesheetPage() {
        navigate('/employee/addtimesheet');
    }

    function goToEditPage() {
        navigate('/employee/editTimesheet');

    }

    function goToViewRejectPage() {

        navigate('/employee/rejecttimesheet');
    }

    function leaveRequest() {
        navigate('/employee/leaverequest');
    }


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
                                    <ul><Link to={'/employee/rejecttimesheet'}>Reject Timesheet</Link></ul>

                                </div>
                            )}
                        </div>
                        <div className={`collapse-container mb-3 ${isOpenLeaveManagement ? 'active' : ''}`}>
                            <button onClick={() => setIsOpenLeaveManagement(!isOpenLeaveManagement)} className="collapse-toggle btn fw-bold">
                                Leave Management
                            </button>
                            {isOpenLeaveManagement && (
                                <div className="collapse-content ">
                                    <ul><Link to={'/employee/leaverequest'}>Add Timesheet</Link></ul>
                                    <ul><Link to={'/employee/editleaverequest'}>Edit Leave Request</Link></ul>
                                    <ul><Link to={''}>Reject Leave Request</Link></ul>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='right-details'></div>



                </div>


            </div>

        </>
    )

}

export default EmployeeHome;