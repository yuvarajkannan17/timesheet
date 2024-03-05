import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateAdmin from '../SuperAdmin/CreateAdmin/CreateAdmin.js'
import SearchAdmin from '../SuperAdmin/SearchAdmin/SearchAdmin.js'
import AdminEdit from '../SuperAdmin/EditAdmin/AdminEdit.js';

import AdminDetailsView from '../SuperAdmin/SearchAdmin/AdminDetailsView.js';
import EditTimesheet from '../Supervisor/Approval/ModifyEmployeeTimesheet.js';
import ApprovelBody from '../Supervisor/Approval/ApprovalPage.js';
import SupervisorHome from '../Supervisor/Home/SupervisorHome.js';
import EmployeeEditTimesheet from '../Employee/Edit/EmployeeEditTimesheet.js';
import SupervisorEditTimesheet from '../Supervisor/EditTimesheet/SupervisorEditTimesheet.js';
import EmployeeHome from '../Employee/Home/EmployeeHome.js';
import RejectTimesheet from '../Employee/RejectTimesheet/RejectTimesheet.js';
import CreateEmployee from '../Admin/Employee/CreateEmployee.js';
import UploadEmployees from '../Admin/Employee/UploadEmployees.js';
import SearchEmployee from '../Admin/Employee/SearchEmployee.js';
import SubmitTimesheet from '../Employee/Submit/SubmitTimesheet.js';
import EmployeeProfile from '../Admin/Employee/EmployeeProfile.js';
import EditEmployee from '../Admin/Employee/EditEmployee.js';
import EmployeeDetails from '../Admin/Employee/EmployeeDetails.js';
import SupSubmitTimesheet from '../Supervisor/Submit/SubmitTimesheet.js';
import AddTimesheet from '../Employee/AddTimesheet/AddTimesheet.js';
import CreateProject from '../Admin/Employee/CreateProject.js';
import UpdateProjectDetails from '../Admin/Employee/UpdateProjectDetails.js';
import Layout from './Layout.js';

function RouterSetup() {


  return (
    <>
      <Router>
             
        <Routes>
       
          <Route path='/superadmin/createadmin' element={<Layout><CreateAdmin/></Layout>} />
          <Route path='/superadmin/searchadmin/admindetailsview/editadmin/:id' element={<Layout><AdminEdit/></Layout>} />
          <Route path='/superadmin/searchadmin' element={ <Layout><SearchAdmin /></Layout>} />
          <Route path='/superadmin/searchadmin/admindetailsview/:id' element={ <Layout><AdminDetailsView /></Layout>} />
          <Route path='/searchAdmin/admindetailsview' element={<Layout><AdminDetailsView /></Layout>} />
          <Route path='/supervisor' element={<Layout><SupervisorHome /></Layout>} />
          <Route path='/supervisor/approvelList' element={<Layout><ApprovelBody /></Layout>} />
          <Route path='/supervisor/editTimesheet' element={<Layout><SupervisorEditTimesheet /></Layout>} />
          <Route path='/supervisor/modifyEmployeeTimesheet/:id' element={<Layout><EditTimesheet /></Layout>} />
          <Route path='/supervisor/submittimesheet' element={<Layout><SupSubmitTimesheet /></Layout>} />
          <Route path='/employee' element={<Layout><EmployeeHome /></Layout>} />
          <Route path='/employee/edittimesheet' element={<Layout><EmployeeEditTimesheet /></Layout>} />
          <Route path='/employee/rejecttimesheet' element={<Layout><RejectTimesheet /></Layout>} />
          <Route path='/employee/submittimesheet' element={<Layout><SubmitTimesheet /></Layout>} />
          <Route path='/employee/addtimesheet' element={<Layout><AddTimesheet /></Layout>} />
          {/* admin */}
          <Route path='/admin/createemployee' element={<Layout><CreateEmployee /></Layout>} />
          <Route path='/admin/uploademployees' element={<Layout><UploadEmployees /></Layout>} />
          <Route path='/admin/searchemployee' element={<Layout><SearchEmployee /></Layout>} />
          <Route path='/admin/employeeprofile' element={<Layout><EmployeeProfile /></Layout>} />
          <Route path='/admin/editemployee/:id' element={<Layout><EditEmployee /></Layout>} />
          <Route path='/admin/employeedetails' element={<Layout><EmployeeDetails /></Layout>} />
          <Route path='/admin/employeedetails/:id' element={<Layout><EmployeeDetails /></Layout>} />
          <Route path='/admin/createproject' element={<Layout><CreateProject /></Layout>} />
          <Route path='/admin/updateprojectdetails' element={<Layout><UpdateProjectDetails /></Layout>} />

          

        </Routes>

      </Router>

    </>
  )
}


export default RouterSetup;