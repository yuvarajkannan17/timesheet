import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import CreateAdmin from '../SuperAdmin/CreateAdmin/CreateAdmin.js'
import SearchAdmin from '../SuperAdmin/SearchAdmin/SearchAdmin.js'
import AdminEdit from '../SuperAdmin/EditAdmin/AdminEdit.js';
import Layout from './Layout.js'
import AdminDetailsView from '../SuperAdmin/SearchAdmin/AdminDetailsView.js';
import EditTimesheet from '../Supervisor/Approval/ModifyEmployeeTimesheet.js';
import ApprovelBody from '../Supervisor/Approval/ApprovalPage.js';
import SupervisorHome from '../Supervisor/Home/SupervisorHome.js';
import EmployeeEditTimesheet from '../Employee/Edit/EmployeeEditTimesheet.js';
import SupervisorEditTimesheet from '../Supervisor/EditTimesheet/SupervisorEditTimesheet.js';
import EmployeeHome from '../Employee/Home/EmployeeHome.js';
import RejectTimesheet from '../Employee/RejectTimesheet/RejectTimesheet.js';

function RouterSetup() {


    return (
        <>
          <Router>
            <Routes>
                <Route path='/superadmin/createadmin' element={<Layout hideNavbar={false}><CreateAdmin/></Layout>}/>
                <Route path='/superadmin/searchadmin/admindetailsview/editadmin/:id' element={<Layout hideNavbar={true}><AdminEdit/></Layout>}/>
                <Route path='/superadmin/searchadmin' element={<Layout hideNavbar={false}><SearchAdmin/></Layout>}/>
                <Route path='/superadmin/searchadmin/admindetailsview/:id' element={<Layout hideNavbar={false}><AdminDetailsView/></Layout>}/>
                <Route path='/searchAdmin/admindetailsview' element={<Layout hideNavbar={false}><AdminDetailsView/></Layout>}/>
                <Route path='/supervisor' element={<Layout hideNavbar={true}><SupervisorHome/></Layout>}/>
                <Route path='/supervisor/approvelList' element={<Layout hideNavbar={true}><ApprovelBody/></Layout>}/>
                <Route path='/supervisor/editTimesheet' element={<Layout hideNavbar={true}><SupervisorEditTimesheet/></Layout>}/>
                <Route path='/supervisor/modifyEmployeeTimesheet/:id' element={<Layout hideNavbar={true}><EditTimesheet/></Layout>}/>
                <Route path='/employee' element={<Layout hideNavbar={true}><EmployeeHome/></Layout>}/>
                <Route path='/employee/edittimesheet' element={<Layout hideNavbar={true}><EmployeeEditTimesheet/></Layout>}/>
                <Route path='/employee/rejecttimesheet' element={<Layout hideNavbar={true}><RejectTimesheet/></Layout>}/>

            </Routes>
              
          </Router>

        </>
    )
}


export default RouterSetup;