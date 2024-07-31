import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateAdmin from '../SuperAdmin/CreateAdmin/CreateAdmin.js'
import SearchAdmin from '../SuperAdmin/SearchAdmin/SearchAdmin.js'
import AdminEdit from '../SuperAdmin/EditAdmin/AdminEdit.js';
import AdminDetailsView from '../SuperAdmin/SearchAdmin/AdminDetailsView.js';
import EditTimesheet from '../Supervisor/Approval/ModifyEmployeeTimesheet.js';
import ApproveTimesheet from '../Supervisor/Approval/ApproveTimesheet.js';
import SupervisorHome from '../Supervisor/Home/SupervisorHome.js';
import EmployeeEditTimesheet from '../Employee/Edit/EmployeeEditTimesheet.js';
import EmployeeEditLeaveRequest from '../Employee/EditLeaveRequest/EmployeeEditLeaveRequest.js'
import SupervisorEditTimesheet from '../Supervisor/EditTimesheet/SupervisorEditTimesheet.js';
import SupervisorEditLeaveRequest from '../Supervisor/EditLeaveRequest/SupervisorEditLeaveRequest.js';

import EmployeeHome from '../Employee/Home/EmployeeHome.js';
import RejectTimesheet from '../Employee/RejectTimesheet/RejectTimesheet.js';
import CreateEmployee from '../Admin/Employee/CreateEmployee.js';
import UploadEmployees from '../Admin/Employee/UploadEmployees.js';
import SearchEmployee from '../Admin/Employee/SearchEmployee.js';
import AdminHome from '../Admin/Home/AdminHome.js';
import AdminAddTimesheet from '../Admin/AddTimesheet/AdminAddTimesheet.js';
import AdminEditTimesheet from '../Admin/EditTimesheet/AdminEditTimesheet.js';
import AdminRejectTimesheet from '../Admin/ViewRejectedTimesheet/AdminRejectTimesheet.js';
import AdminEditLeaveRequest from '../Admin/EditLeaveRequest/AdminEditLeaveRequest.js'
import AdminAddLeaveRequest from '../Admin/AddLeaveRequest/AdminAddLeaveRequest.js'
import AdminRejectLeaveRequest from '../Admin/RejectLeaveRequest/AdminRejectLeaveRequest.js'
import AdminApproveLeaveRequest from '../Admin/ApproveLeaveRequest/AdminApproveLeaveRequest.js'
import AdminApproveDetails from '../Admin/ApproveLeaveRequest/AdminApproveDetails.js'
import EmployeeProfile from '../Admin/Employee/EmployeeProfile.js';
import EditEmployee from '../Admin/Employee/EditEmployee.js';
import EmployeeDetails from '../Admin/Employee/EmployeeDetails.js';
import Approvalpage from '../Admin/ApproveTimesheet/ApprovalPage.js';
import ApprovelBody from '../Admin/ApproveTimesheet/ApprovalPage.js';
import ModifySupervisorTimesheet from '../Admin/ApproveTimesheet/ModifySupervisorTimesheet.js';
import AddTimesheet from '../Employee/AddTimesheet/AddTimesheet.js';
import CreateProject from '../Admin/Employee/CreateProject.js';
import UpdateProjectDetails from '../Admin/Employee/UpdateProjectDetails.js';
import TimesheetLogin from '../Login/TimesheetLogin.js';
import Layout from './Layout.js';
import SupAddTimesheet from '../Supervisor/AddTimesheet/AddTimesheet.js';
import SupRejectTimesheet from '../Supervisor/RejectTimesheet/RejectTimesheet.js';
import { EmployeeLeaveRequest } from '../Employee/LeaveRequest/EmployeeLeaveRequest.js';
import { useSelector } from 'react-redux';

import { SupervisorLeaveRequest } from '../Supervisor/LeaveRequest/SupervisorLeaveRequest.js';
import SupervisorLeaveApproval from '../Supervisor/LeaveApproval/SupervisorLeaveApproval.js';
import SupervisorLeaveDetails from '../Supervisor/LeaveApproval/SupervisorLeaveDetails.js';
import SuperadminLeaveDetails from '../SuperAdmin/LeaveApproval/SuperadminLeaveDetails.js';
import SuperadminLeaveApproval from '../SuperAdmin/LeaveApproval/SuperadminLeaveApproval.js';
import SuperadminApproveTimesheet from '../SuperAdmin/TimesheetApproval/ApproveTimesheet.js';
import SuperadminModifyAdminTimesheet from '../SuperAdmin/TimesheetApproval/ModifyEmployeeTimesheet.js';
import ViewRejectedLeaveRequests from '../Employee/LeaveRequest/RejectLeaveRequest/EmployeeViewRejectedLeaveRequest.js';
import AdminViewRejectedLeaveRequests from '../Admin/ViewRejectedLeaveRequests/AdminViewRejectedLeaveRequests.js';
import SupervisorViewRejectedLeaveRequests from '../Supervisor/ViewRejectedLeaveRequest/SupervisorViewRejectedLeaveRequests.js';


function RouterSetup() {
       const {isAuthenticated}=useSelector(state=>state.adminDetails.value);

       
       

  return (
    <>
      <Router>
             
        <Routes>
          <Route path='/' element={<TimesheetLogin/>} />
          <Route path='/superadmin/createadmin' element={ isAuthenticated ?<Layout><CreateAdmin/></Layout> :<TimesheetLogin/>} />
          <Route path='/superadmin/searchadmin/admindetailsview/editadmin/:id' element={isAuthenticated ?<Layout><AdminEdit/></Layout>:<TimesheetLogin/>} />
          <Route path='/superadmin/searchadmin' element={isAuthenticated ? <Layout><SearchAdmin /></Layout>:<TimesheetLogin/>} />
          <Route path='/superadmin/searchadmin/admindetailsview/:id' element={isAuthenticated ? <Layout><AdminDetailsView /></Layout>:<TimesheetLogin/>} />
          <Route path='/superadmin/leaveapproval' element={isAuthenticated ? <Layout><SuperadminLeaveApproval /></Layout>:<TimesheetLogin/>} />
          {/* <Route path='/superadmin/leavedetails' element={isAuthenticated ? <Layout><SuperadminLeaveDetails /></Layout>:<TimesheetLogin/>} /> */}
          <Route path='/superadmin/timesheetapproval' element={isAuthenticated ? <Layout><SuperadminApproveTimesheet /></Layout>:<TimesheetLogin/>} />
          <Route path='/superadmin/leavedetails/:id' element={isAuthenticated ? <Layout><SuperadminLeaveDetails /></Layout>:<TimesheetLogin/>} />
          <Route path='/superadmin/timesheetapproval/modifytimesheet/:id' element={isAuthenticated ? <Layout><SuperadminModifyAdminTimesheet /></Layout>:<TimesheetLogin/>} />
          
          <Route path='/supervisor' element={isAuthenticated ? <Layout><SupervisorHome /></Layout>:<TimesheetLogin/>} />
          <Route path='/supervisor/addtimesheet' element={isAuthenticated ? <Layout><SupAddTimesheet /></Layout>:<TimesheetLogin/>} />
          <Route path='/supervisor/approvetimesheet' element={isAuthenticated ? <Layout><ApproveTimesheet /></Layout>:<TimesheetLogin/>} />
          <Route path='/supervisor/editTimesheet' element={isAuthenticated ? <Layout><SupervisorEditTimesheet /></Layout>:<TimesheetLogin/>} />
          <Route path='/supervisor/modifyEmployeeTimesheet/:id' element={isAuthenticated ? <Layout><EditTimesheet /></Layout>:<TimesheetLogin/>} />
          <Route path='/supervisor/rejecttimesheet' element={isAuthenticated ? <Layout><SupRejectTimesheet /></Layout>:<TimesheetLogin/>} />
          <Route path='/supervisor/leaverequest' element={isAuthenticated ? <Layout><SupervisorLeaveRequest /></Layout>:<TimesheetLogin/>} />
          <Route path='/supervisor/editleaverequest' element={isAuthenticated ? <Layout><SupervisorEditLeaveRequest /></Layout>:<TimesheetLogin/>} />

          <Route path='/supervisor/leaveapproval' element={isAuthenticated ? <Layout><SupervisorLeaveApproval /></Layout>:<TimesheetLogin/>} />
          <Route path='/supervisor/leavedetails/:id' element={isAuthenticated ? <Layout><SupervisorLeaveDetails /></Layout>:<TimesheetLogin/>} />
          <Route path='/supervisor/viewrejectedleaverequests' element={isAuthenticated ? <Layout><SupervisorViewRejectedLeaveRequests /></Layout>:<TimesheetLogin/>} />
          {/* employee */}
          <Route path='/employee' element={isAuthenticated ? <Layout><EmployeeHome /></Layout>:<TimesheetLogin/>} />
          <Route path='/employee/edittimesheet' element={isAuthenticated ? <Layout><EmployeeEditTimesheet /></Layout>:<TimesheetLogin/>} />
          <Route path='/employee/rejecttimesheet' element={isAuthenticated ? <Layout><RejectTimesheet /></Layout>:<TimesheetLogin/>} />
          <Route path='/employee/leaverequest' element={isAuthenticated ? <Layout><EmployeeLeaveRequest /></Layout>:<TimesheetLogin/>} />
          <Route path='/employee/editleaverequest' element={isAuthenticated ? <Layout><EmployeeEditLeaveRequest /></Layout>:<TimesheetLogin/>} />

          <Route path='/employee/addtimesheet' element={isAuthenticated ? <Layout><AddTimesheet /></Layout>:<TimesheetLogin/>} />
          <Route path='/employee/rejectedleaverequests' element={isAuthenticated ? <Layout><ViewRejectedLeaveRequests /></Layout>:<TimesheetLogin/>} />
          {/* admin */}
          <Route path='/admin' element={ isAuthenticated ? <Layout><AdminHome  /></Layout>:<TimesheetLogin/>} />
          <Route path='/admin/adminaddtimesheet' element={ isAuthenticated ? <Layout><AdminAddTimesheet /></Layout>:<TimesheetLogin/>} />
          <Route path='/admin/adminedittimesheet' element={ isAuthenticated ? <Layout><AdminEditTimesheet /></Layout>:<TimesheetLogin/>} />
          <Route path='/admin/adminrejecttimesheet' element={ isAuthenticated ? <Layout><AdminRejectTimesheet /></Layout>:<TimesheetLogin/>} />
          <Route path='/admin/approvalpage' element={ isAuthenticated ? <Layout><Approvalpage /></Layout>:<TimesheetLogin/>} />
          {/* <Route path='/admin/approvalList' element={isAuthenticated ? <Layout><ApprovelBody /></Layout>:<TimesheetLogin/>} /> */}

          <Route path='/admin/modifysupervisortimesheet/:id' element={ isAuthenticated ? <Layout><ModifySupervisorTimesheet /></Layout>:<TimesheetLogin/>} />
          <Route path='/admin/createemployee' element={ isAuthenticated ? <Layout><CreateEmployee /></Layout>:<TimesheetLogin/>} />
          <Route path='/admin/uploademployees' element={isAuthenticated ? <Layout><UploadEmployees /></Layout>:<TimesheetLogin/>} />
          <Route path='/admin/searchemployee' element={isAuthenticated ? <Layout><SearchEmployee /></Layout>:<TimesheetLogin/>} />
          <Route path='/admin/employeeprofile' element={isAuthenticated ? <Layout><EmployeeProfile /></Layout>:<TimesheetLogin/>} />
          <Route path='/admin/editemployee/:id' element={isAuthenticated ? <Layout><EditEmployee /></Layout>:<TimesheetLogin/>} />
          <Route path='/admin/employeedetails' element={isAuthenticated ? <Layout><EmployeeDetails /></Layout>:<TimesheetLogin/>} />
          <Route path='/admin/employeedetails/:id' element={isAuthenticated ? <Layout><EmployeeDetails /></Layout>:<TimesheetLogin/>} />
          <Route path='/admin/createproject' element={isAuthenticated ? <Layout><CreateProject /></Layout>:<TimesheetLogin/>} />
          <Route path='/admin/updateprojectdetails' element={isAuthenticated ? <Layout><UpdateProjectDetails /></Layout>:<TimesheetLogin/>} />
          <Route path='/admin/adminedittimesheet' element={ isAuthenticated ? <Layout><AdminEditTimesheet /></Layout>:<TimesheetLogin/>} />
          <Route path='/admin/admineditleaverequest/' element={ isAuthenticated ? <Layout><AdminEditLeaveRequest /></Layout>:<TimesheetLogin/>} />
          <Route path='/admin/adminaddleaverequest' element={ isAuthenticated ? <Layout><AdminAddLeaveRequest /></Layout>:<TimesheetLogin/>} />
                 
          <Route path='/admin/adminapproveleaverequest' element={ isAuthenticated ? <Layout><AdminApproveLeaveRequest /></Layout>:<TimesheetLogin/>} />        
          <Route path='/admin/adminapprovedetails/:id' element={ isAuthenticated ? <Layout><AdminApproveDetails /></Layout>:<TimesheetLogin/>} />
          <Route path='/admin/adminviewrejectedleaverequests' element={ isAuthenticated ? <Layout><AdminViewRejectedLeaveRequests/></Layout>:<TimesheetLogin/>} />        

        </Routes>
      </Router>
    </>
  )
}


export default RouterSetup;