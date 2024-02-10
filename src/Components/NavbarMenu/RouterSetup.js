import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import CreateAdmin from '../SuperAdmin/CreateAdmin/CreateAdmin.js'
import SearchAdmin from '../SuperAdmin/SearchAdmin/SearchAdmin.js'
import AdminEdit from '../SuperAdmin/EditAdmin/AdminEdit.js';
import Layout from './Layout.js'

function RouterSetup() {


    return (
        <>
          <Router>
            <Routes>
                <Route path='/' element={<Layout hideNavbar={false}><CreateAdmin/></Layout>}/>
                <Route path='/editAdmin/:id' element={<Layout hideNavbar={true}><AdminEdit/></Layout>}/>
                <Route path='/searchAdmin' element={<Layout hideNavbar={false}><SearchAdmin/></Layout>}/>
                <Route path='/searchAdmin/:id' element={<Layout hideNavbar={false}><SearchAdmin/></Layout>}/>
            </Routes>
              
          </Router>

        </>
    )
}


export default RouterSetup;