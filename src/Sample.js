// // navbar---------------------------------------
// // import Container from 'react-bootstrap/Container';
// // import Navbar from 'react-bootstrap/Navbar';
// // import chiselonLogo from '../Image/logochiselon.png'
// // import React, { useState, useEffect } from 'react';
// // import { NavLink } from 'react-router-dom';

// // import './navbarMenu.css'
// // function NavbarMenu() {

// //     const [currentDateTime, setCurrentDateTime] = useState(new Date());
    
// //     useEffect(() => {
// //         // Update the currentDateTime state every second
// //         const intervalId = setInterval(() => {
// //             setCurrentDateTime(new Date());
// //         }, 1000);

// //         // Clean up the interval when the component unmounts
// //         return () => clearInterval(intervalId);
// //     }, []); // Empty dependency array ensures the effect runs only once after initial render

// //     const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' }; const formattedDateTime = currentDateTime.toLocaleDateString(undefined, options);

// //     return (
// //         <> 


// //                 {/* navbar header */}
// //                 < Navbar className="approvelHeader d-block">
// //                     <Container className='d-flex justify-content-between align-items-center'>

// //                         <Navbar.Brand href="#home">
// //                             <img
// //                                 src={chiselonLogo}
// //                                 width="35"
// //                                 height="35"
// //                                 className="d-inline-block align-top"
// //                                 alt="chiselon logo"
// //                             />

// //                         </Navbar.Brand>
// //                         <div className=''>
// //                             <h3 className='text-white mx-auto '>Timesheet</h3>
// //                         </div>
// //                         <div className='text-white  signInSymbol ' >
// //                             <p className='text-end'>{formattedDateTime}</p>
// //                         </div>
// //                         <div className='text-white  signInSymbol ' >
// //                             <p className="mb-0">Y</p>
// //                         </div>
// //                     </Container>
// //                     <Container className=' d-flex justify-content-end mt-2 small  text-warning' >
                       
// //                     </Container>
// //                 </Navbar>
// //                     {/* superadmin navbars */}
// //                 <div className="superadmin-navigation">
// //                 <Container >
// //                     <div>
// //                         <ul className='nav d-flex justify-content-end'>
// //                             <li className='nav-item'>
// //                                 <NavLink to={'/'} className='nav-link superadmin-navigation-link' activeclassname='active'>Create Admin User</NavLink>
// //                             </li>
// //                             <li className='nav-item'>
// //                                 <NavLink to={'/searchadmin'} className='nav-link superadmin-navigation-link' activeclassname='active'>Search Admin User</NavLink>
// //                             </li>
// //                         </ul>
// //                     </div>
// //                 </Container>
// //                 </div>
         
            
// //         </>
// //     )

// // }

// // export default NavbarMenu;


//     // search admin------------------------------------------
//     import { Modal,Button } from 'react-bootstrap';
// import successCheck from '../../Image/checked.png'
// import { successModal } from '../../features/modal';
// import { changeAdminDetails} from '../../features/adminDetails';
// import { adminDetailsEdit } from '../../features/adminDetails';
// import { useDispatch } from 'react-redux';
// import { useSelector } from 'react-redux';
// import './searchadmin.css'
// import url from '../../Api/data'
// import archiveUrl from '../../Api/archive'
// import profile from '../../Image/profile.png'
// import axios from 'axios';
// import { useState, useEffect } from 'react';
// import { useNavigate,useParams } from "react-router-dom";
// import { editSuccessModal } from '../../features/modal';
// function SearchAdmin() {
//     // redux state
//     // create admin success modal
//     const modal = useSelector(state => state.modal.value)
//     const showModal = modal.showSuccessModal;
    
//     // to check profile edited or not
//     const adminDetailsEditValue= useSelector(state=>state.adminDetails.value.adminDetailsEditValue);
//     // edit success modal
//     const editSuccessModalValue=useSelector(state=>state.modal.value.editSuccessModalValue);
    
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     // for delete confirmation modal
//     const [confirmationForDelete,setConfirmationForDelete]=useState(false);
//     // admin List
//     const [adminList, setAdminList] = useState([]);
//     // edit admin id from edit admin page
//     const {id:editedAdminId}=useParams()
//     // for search adminlist
//     const [searchQuery, setSearchQuery] = useState("");
//     // active row
//     const [activeRow, setActiveRow] = useState(null);
//     // last added admin detail
//     // const [newlyAddedAdminId, setNewlyAddedAdminId] = useState('');
//     // remove admin id
//     const [removeAdminId,setRemoveAdminID]=useState(null);
//     // delete success modal
//     const [deleteConfirmModal,setDeleteConfirmModal]=useState(false);
//     // to fetch admin details
//     async function getAdminDetails(id) {
//         try {
//             const response = await axios.get(`${url}/${id}`);
//             dispatch(changeAdminDetails(response.data));
//         } catch (error) {
//             console.error('Error fetching admin details:', error);
//         }
//     }

    

//     //   fetch the data from api
//     async function getDataFromApi() {
//         let response = await axios.get(url)
//         setAdminList(response.data);
//         const array = response.data;

//         // checking editable admin details
//         if(adminDetailsEditValue){
//             getAdminDetails(editedAdminId);
//             // setNewlyAddedAdminId(editedAdminId);
//             dispatch(adminDetailsEdit(false));
            
//             // for current column
//         }else{
//             const lastElement = array[array.length - 1];
//             { lastElement ? dispatch(changeAdminDetails(lastElement)) : dispatch(changeAdminDetails('')) }
//             // { lastElement ? setNewlyAddedAdminId(lastElement.id) : setNewlyAddedAdminId('') }
//         }

//     }

//     // set adminDetails

//     const handleAdminClick = async (admin) => {
//         try {
//             // Make API call to fetch additional details based on admin.id
//             const response = await axios.get(`${url}/${admin.id}`);
//             // Update the state with the selected admin and additional details

//             dispatch(changeAdminDetails(response.data))  // Update this line with the actual structure of your API response
//             setActiveRow(admin.id);
//             // setNewlyAddedAdminId(null);
//         } catch (error) {
//             console.error('Error fetching admin details:', error);
//         }
//     };


   
//     useEffect(() => {
        
//             // Otherwise, fetch and display the details of the last admin added by default
//             getDataFromApi();
        
//     }, []);


//     // storing the special api once delete the admin details
//     async function archiveData(admin) {
//         try {
//              await axios.post(archiveUrl, admin);
            
//         } catch (error) {
//             console.error('Error archiving admin:', error);
//         }
//     }

//     // set the confirmation modal

//      function removeAdmin(id) {
//          setConfirmationForDelete(true);
//          setRemoveAdminID(id);
        
//     }

//     // cancel the confirmation modal for delete
//      function deleteCancelChanges(){
//           setConfirmationForDelete(false);
//      }

//     //  delete the admin deatils
//      async function deleteSaveChanges(){
//          try {
//             setConfirmationForDelete(false);
//             const response = await axios.get(`${url}/${removeAdminId}`);
//             const deletedAdmin = response.data;

//             await axios.delete(`${url}/${removeAdminId}`);
//             archiveData(deletedAdmin);
//             getDataFromApi();
//             setDeleteConfirmModal(true);
//         } catch (error) {
//             console.error('Error deleting admin:', error);
//         }
//      }


//     //  search the admin details from admin list
//     const handleSearchChange = (event) => {
//         setSearchQuery(event.target.value);
//     };

//     // searching admin based on name and id
//     const filteredAdminList = adminList.filter((admin) =>
//         admin.fName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         admin.id.toString().includes(searchQuery)

//     );

    
//     //  navigate to edit page
//     function updateAdmin(id) {
//         navigate('/editAdmin/' + id);

//     }

  
//     return (
//         <>
//             <div className='searchAdminPanel-bg'>
//                 <div className='searchAdminPanel row'>
//                     {/* admin list view and search */}
//                     <div className='col search-admin'>
//                         <div className=' d-flex justify-content-between  flex-wrap p-2' style={{ backgroundColor: "white" }}>
//                             <p className='me-2 '>ADMIN USER</p>
//                             <div>
//                                 <form className='no-focus-outline'>
//                                     <input className='w-75 border-0' type='search' placeholder='search admin' value={searchQuery} onChange={handleSearchChange}></input>
//                                     <button className='border-0 bg-white' type='button'><i className="bi bi-search"></i></button>
//                                 </form>

//                             </div>
//                         </div>
//                         <div className='admin-list table-responsive'>
//                             <table className='table custom-table  table-hover '>
//                                 <thead className='table-header'>
//                                     <tr className='text-center text-white'>
//                                         <th scope="col">Admin Id</th>  
//                                         <th scope="col"> Name</th>
//                                         <th scope='col'>Email</th>
                                        
//                                     </tr>
//                                 </thead>
//                                 <tbody>

//                                     {filteredAdminList.map((d) => (
//                                         <tr key={d.id} className={`text-center adminList-column ${activeRow === d.id ? 'table-active' : ''} `} onClick={() => handleAdminClick(d)}>
//                                             <td>CTPLAD00{d.id}</td>
//                                             <td>{d.fName}</td>
//                                             <td>{d.email}</td>
                                            
//                                         </tr>
//                                     ))}

//                                 </tbody>
//                             </table>

//                         </div>
//                     </div>
// {/* admin details view */}
                    



//                 </div>

//                 {/* modal for admin created */}
//                 <Modal className="custom-modal" style={{ left: '50%', transform: 'translateX(-50%)' }} dialogClassName="modal-dialog-centered" show={showModal}  >
//                     <div className="d-flex flex-column modal-success p-4 align-items-center ">
//                         <img src={successCheck} className="img-fluid mb-4" alt="successCheck" />
//                         <p className="mb-4 text-center">Admin User Profile Created Successfully</p>
//                         <button className="btn  w-100 text-white" onClick={() => { dispatch(successModal(false)) }} style={{ backgroundColor: '#5EAC24' }}>Close</button>
//                     </div>
//                 </Modal>
//                      {/*modal for admin edit sucess  */}
//                 <Modal className="custom-modal" style={{ left: '50%', transform: 'translateX(-50%)' }} dialogClassName="modal-dialog-centered" show={editSuccessModalValue}  >
//                     <div className="d-flex flex-column modal-success p-4 align-items-center ">
//                         <img src={successCheck} className="img-fluid mb-4" alt="successCheck" />
//                         <p className="mb-4 text-center">Admin User Profile Edited Successfully</p>
//                         <button className="btn  w-100 text-white" onClick={() => {dispatch(editSuccessModal(false))}} style={{ backgroundColor: '#5EAC24' }}>Close</button>
//                     </div>
//              </Modal>

//                {/* Modal for confirming save or cancel */}
//             <Modal  show={confirmationForDelete} onHide={() => setConfirmationForDelete(false)}>
              
//                 <Modal.Body >Are you sure want to delete this profile?</Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={deleteCancelChanges}>
//                         Cancel
//                     </Button>
//                     <Button variant="primary" onClick={deleteSaveChanges}>
//                         Delete 
//                     </Button>
//                 </Modal.Footer>
//             </Modal>
//               {/* admin delete success modal */}
//             <Modal className="custom-modal" style={{ left: '50%', transform: 'translateX(-50%)' }} dialogClassName="modal-dialog-centered" show={deleteConfirmModal}  >
//                     <div className="d-flex flex-column modal-success p-4 align-items-center ">
//                         <img src={successCheck} className="img-fluid mb-4" alt="successCheck" />
//                         <p className="mb-4 text-center">Admin User Profile Deleted Successfully</p>
//                         <button className="btn  w-100 text-white" onClick={() => {setDeleteConfirmModal(false)}} style={{ backgroundColor: '#5EAC24' }}>Close</button>
//                     </div>
//              </Modal>

//             </div>

//         </>
//     )
// }

// export default SearchAdmin;


