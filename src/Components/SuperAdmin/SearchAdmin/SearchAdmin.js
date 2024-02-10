import { Modal,Button } from 'react-bootstrap';
import successCheck from '../../Image/checked.png'
import { successModal } from '../../features/modal';
import { changeAdminDetails} from '../../features/adminDetails';
import { adminDetailsEdit } from '../../features/adminDetails';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import './searchadmin.css'
import url from '../../Api/data'
import archiveUrl from '../../Api/archive'
import profile from '../../Image/profile.png'
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate,useParams } from "react-router-dom";
import { editSuccessModal } from '../../features/modal';
function SearchAdmin() {
    // redux state
    // create admin success modal
    const modal = useSelector(state => state.modal.value)
    const showModal = modal.showSuccessModal;
    // admin details state
    const adminDetails= useSelector(state=>state.adminDetails.value.adminDetails);
    // to check profile edited or not
    const adminDetailsEditValue= useSelector(state=>state.adminDetails.value.adminDetailsEditValue);
    // edit success modal
    const editSuccessModalValue=useSelector(state=>state.modal.value.editSuccessModalValue);
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // for delete confirmation modal
    const [confirmationForDelete,setConfirmationForDelete]=useState(false);
    // admin List
    const [adminList, setAdminList] = useState([]);
    // edit admin id from edit admin page
    const {id:editedAdminId}=useParams()
    // for search adminlist
    const [searchQuery, setSearchQuery] = useState("");
    // active row
    const [activeRow, setActiveRow] = useState(null);
    // last added admin detail
    const [newlyAddedAdminId, setNewlyAddedAdminId] = useState('');
    // remove admin id
    const [removeAdminId,setRemoveAdminID]=useState(null);
    // delete success modal
    const [deleteConfirmModal,setDeleteConfirmModal]=useState(false);
    // to fetch admin details
    async function getAdminDetails(id) {
        try {
            const response = await axios.get(`${url}/${id}`);
            dispatch(changeAdminDetails(response.data));
        } catch (error) {
            console.error('Error fetching admin details:', error);
        }
    }

    

    //   fetch the data from api
    async function getDataFromApi() {
        let response = await axios.get(url)
        setAdminList(response.data);
        const array = response.data;

        // checking editable admin details
        if(adminDetailsEditValue){
            getAdminDetails(editedAdminId);
            setNewlyAddedAdminId(editedAdminId);
            dispatch(adminDetailsEdit(false));
            
            // for current column
        }else{
            const lastElement = array[array.length - 1];
            { lastElement ? dispatch(changeAdminDetails(lastElement)) : dispatch(changeAdminDetails('')) }
            { lastElement ? setNewlyAddedAdminId(lastElement.id) : setNewlyAddedAdminId('') }
        }

    }

    // set adminDetails

    const handleAdminClick = async (admin) => {
        try {
            // Make API call to fetch additional details based on admin.id
            const response = await axios.get(`${url}/${admin.id}`);
            // Update the state with the selected admin and additional details

            dispatch(changeAdminDetails(response.data))  // Update this line with the actual structure of your API response
            setActiveRow(admin.id);
            setNewlyAddedAdminId(null);
        } catch (error) {
            console.error('Error fetching admin details:', error);
        }
    };


   
    useEffect(() => {
        
            // Otherwise, fetch and display the details of the last admin added by default
            getDataFromApi();
        
    }, []);


    // storing the special api once delete the admin details
    async function archiveData(admin) {
        try {
             await axios.post(archiveUrl, admin);
            
        } catch (error) {
            console.error('Error archiving admin:', error);
        }
    }

    // set the confirmation modal

     function removeAdmin(id) {
         setConfirmationForDelete(true);
         setRemoveAdminID(id);
        
    }

    // cancel the confirmation modal for delete
     function deleteCancelChanges(){
          setConfirmationForDelete(false);
     }

    //  delete the admin deatils
     async function deleteSaveChanges(){
         try {
            setConfirmationForDelete(false);
            const response = await axios.get(`${url}/${removeAdminId}`);
            const deletedAdmin = response.data;

            await axios.delete(`${url}/${removeAdminId}`);
            archiveData(deletedAdmin);
            getDataFromApi();
            setDeleteConfirmModal(true);
        } catch (error) {
            console.error('Error deleting admin:', error);
        }
     }


    //  search the admin details from admin list
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // searching admin based on name and id
    const filteredAdminList = adminList.filter((admin) =>
        admin.fName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admin.id.toString().includes(searchQuery)

    );

    
    //  navigate to edit page
    function updateAdmin(id) {
        navigate('/editAdmin/' + id);

    }

  
    return (
        <>
            <div className='searchAdminPanel-bg'>
                <div className='searchAdminPanel row'>
                    {/* admin list view and search */}
                    <div className='col-md-6 search-admin'>
                        <div className=' d-flex justify-content-between  flex-wrap p-2' style={{ backgroundColor: "white" }}>
                            <p className='me-2 '>ADMIN USER</p>
                            <div>
                                <form className='no-focus-outline'>
                                    <input className='w-75 border-0' type='search' placeholder='search admin' value={searchQuery} onChange={handleSearchChange}></input>
                                    <button className='border-0 bg-white' type='button'><i className="bi bi-search"></i></button>
                                </form>

                            </div>
                        </div>
                        <div className='admin-list'>
                            <table className='table custom-table '>
                                <thead className='table-header'>
                                    <tr className='text-center text-white'>
                                        <th scope="col"> Name</th>
                                        <th scope="col">Admin Id</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {filteredAdminList.map((d) => (
                                        <tr key={d.id} className={`text-center adminList-column ${activeRow === d.id ? 'table-active' : ''}  ${newlyAddedAdminId === d.id ? 'table-active' : ''}`} onClick={() => handleAdminClick(d)}>
                                            <td>{d.fName}</td>
                                            <td>CTPLAD00{d.id}</td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>

                        </div>
                    </div>
{/* admin details view */}
                    <div className='col-md-6'>
                        <div className='viewAdmin'>
                            {adminDetails &&
                                <div className='admin-details'>
                                    <div className='d-flex justify-content-between flex-wrap '>
                                        <p className=''>Admin User</p>
                                        <div>
                                            <div className='admin-edit d-inline-block me-5'>
                                                <i className="bi bi-pencil-square text-primary" onClick={() => { updateAdmin(adminDetails.id) }}></i>
                                            </div>
                                            <div className='admin-delete d-inline-block'>
                                                <i className="bi bi-trash3 text-danger  " onClick={() => { removeAdmin(adminDetails.id) }}></i>
                                            </div>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className='text-center'>
                                        <img src={profile} alt={adminDetails.fName} />
                                        <p className='text-primary'>{adminDetails.fName}</p>
                                    </div>
                                    <div >
                                        <div className='row mb-2'>
                                            <div className='col-md-6'>Admin Id</div>
                                            <div className='col-md-6 text-secondary'>CTPLAD00{adminDetails.id}</div>
                                        </div>
                                        <div className='row mb-2'>
                                            <div className='col-md-6'>First Name</div>
                                            <div className='col-md-6 text-secondary'>{adminDetails.fName}</div>
                                        </div>
                                        <div className='row mb-2'>
                                            <div className='col-md-6'>Last Name</div>
                                            <div className='col-md-6 text-secondary'>{adminDetails.lName}</div>
                                        </div>
                                        <div className='row mb-2'>
                                            <div className='col-12'>Email :</div>
                                            <div className='col-12 mt-2  text-secondary'>{adminDetails.email}</div>
                                        </div>
                                        <div className='row mb-2'>
                                            <div className='col-md-6'>Phone</div>
                                            <div className='col-md-6 text-secondary'>{adminDetails.phone}</div>
                                        </div>
                                        <div className='row mb-2 '>
                                            <div className='col-12'>Address :</div>
                                            <div className='col-12 mt-2 text-secondary address'>{adminDetails.address}</div>
                                        </div>
                                        <div className='row mb-2'>
                                            <div className='col-md-6'>Aadhar Number</div>
                                            <div className='col-md-6 text-secondary'>{adminDetails.aadhar}</div>
                                        </div>
                                        <div className='row mb-2'>
                                            <div className='col-md-6'>Pan Number</div>
                                            <div className='col-md-6 text-secondary'>{adminDetails.pan}</div>
                                        </div>
                                        <div className='row mb-2'>
                                            <div className='col-sm-12 text-decoration-underline'>Access Permission For Employee Details</div>
                                        </div>
                                        <div className='row mb-2'>
                                            <div className='col-md-6'>
                                                Create
                                            </div>
                                            <div className='col-md-6 text-secondary'>
                                                {adminDetails.employeeAccess.create.toString()}
                                            </div>
                                        </div>
                                        <div className='row mb-2'>
                                            <div className='col-md-6'>
                                                Edit
                                            </div>
                                            <div className='col-md-6 text-secondary'>
                                                {adminDetails.employeeAccess.edit.toString()}
                                            </div>
                                        </div>
                                        <div className='row mb-2'>
                                            <div className='col-md-6'>
                                                Delete
                                            </div>
                                            <div className='col-md-6 text-secondary'>
                                                {adminDetails.employeeAccess.delete.toString()}
                                            </div>
                                        </div>
                                        <div className='row mb-2'>
                                            <div className='col-sm-12 text-decoration-underline'>Access Permission For Project Details</div>
                                        </div>
                                        <div className='row mb-2'>
                                            <div className='col-md-6'>
                                                Create
                                            </div>
                                            <div className='col-md-6 text-secondary'>
                                                {adminDetails.projectAccess.create.toString()}
                                            </div>
                                        </div>
                                        <div className='row mb-2'>
                                            <div className='col-md-6'>
                                                Edit
                                            </div>
                                            <div className='col-md-6 text-secondary'>
                                                {adminDetails.projectAccess.edit.toString()}
                                            </div>
                                        </div>
                                        <div className='row mb-2'>
                                            <div className='col-md-6'>
                                                Delete
                                            </div>
                                            <div className='col-md-6 text-secondary'>
                                                {adminDetails.projectAccess.delete.toString()}
                                            </div>
                                        </div>
                                    </div>

                                </div>}
                        </div>
                    </div>




                </div>

                {/* modal for admin created */}
                <Modal className="custom-modal" style={{ left: '50%', transform: 'translateX(-50%)' }} dialogClassName="modal-dialog-centered" show={showModal}  >
                    <div className="d-flex flex-column modal-success p-4 align-items-center ">
                        <img src={successCheck} className="img-fluid mb-4" alt="successCheck" />
                        <p className="mb-4 text-center">Admin User Profile Created Successfully</p>
                        <button className="btn  w-100 text-white" onClick={() => { dispatch(successModal(false)) }} style={{ backgroundColor: '#5EAC24' }}>Close</button>
                    </div>
                </Modal>
                     {/*modal for admin edit sucess  */}
                <Modal className="custom-modal" style={{ left: '50%', transform: 'translateX(-50%)' }} dialogClassName="modal-dialog-centered" show={editSuccessModalValue}  >
                    <div className="d-flex flex-column modal-success p-4 align-items-center ">
                        <img src={successCheck} className="img-fluid mb-4" alt="successCheck" />
                        <p className="mb-4 text-center">Admin User Profile Edited Successfully</p>
                        <button className="btn  w-100 text-white" onClick={() => {dispatch(editSuccessModal(false))}} style={{ backgroundColor: '#5EAC24' }}>Close</button>
                    </div>
             </Modal>

               {/* Modal for confirming save or cancel */}
            <Modal  show={confirmationForDelete} onHide={() => setConfirmationForDelete(false)}>
              
                <Modal.Body >Are you sure want to delete this profile?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={deleteCancelChanges}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={deleteSaveChanges}>
                        Delete 
                    </Button>
                </Modal.Footer>
            </Modal>
              {/* admin delete success modal */}
            <Modal className="custom-modal" style={{ left: '50%', transform: 'translateX(-50%)' }} dialogClassName="modal-dialog-centered" show={deleteConfirmModal}  >
                    <div className="d-flex flex-column modal-success p-4 align-items-center ">
                        <img src={successCheck} className="img-fluid mb-4" alt="successCheck" />
                        <p className="mb-4 text-center">Admin User Profile Deleted Successfully</p>
                        <button className="btn  w-100 text-white" onClick={() => {setDeleteConfirmModal(false)}} style={{ backgroundColor: '#5EAC24' }}>Close</button>
                    </div>
             </Modal>

            </div>

        </>
    )
}

export default SearchAdmin;


