import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import url from '../../Api/data'
import { useEffect, useState } from "react";
import { changeAdminDetails } from '../../features/adminDetails';
import user from '../../Image/user-profile.png'
import { Modal,Button } from 'react-bootstrap';
import archiveUrl from '../../Api/archive'
import successCheck from '../../Image/checked.png'
import { editSuccessModal,deleteSuccessModal } from '../../features/modal';
import SuperAdminNav from "../Navbar/SuperAdminNav";

function AdminDetailsView() {
    // admin details state
    const adminDetails = useSelector(state => state.adminDetails.value.adminDetails);
     // edit success modal
     const editSuccessModalValue=useSelector(state=>state.modal.value.editSuccessModalValue);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // admin id for view details
    const { id } = useParams();
    // state for delete confirmation
    const [confirmationForDelete, setConfirmationForDelete] = useState(false);
    // remove admin id
    const [removeAdminId, setRemoveAdminID] = useState(null);

    // fetch the admin details
    async function getAdminDetails() {

        try {

            const response = await axios.get(`http://localhost:8080/admins/${id}`)  //to view admin details backend url
            dispatch(changeAdminDetails(response.data))

        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        // fetch and display the details of the selected admin 
        getAdminDetails();
    }, []);

    //  navigate to edit page
    function updateAdmin(id) {
        navigate('/superadmin/searchadmin/admindetailsview/editadmin/' + id);

    }

    // cancel the confirmation modal for delete
    function deleteCancelChanges() {
        setConfirmationForDelete(false);
    }

    // storing the special api once delete the admin details
    async function archiveData(admin) {
        try {
            await axios.post(archiveUrl, admin);

        } catch (error) {
            console.error('Error archiving admin:', error);
        }
    }

    //  delete the admin deatils
    async function deleteSaveChanges() {
        try {
            setConfirmationForDelete(false);
            const response = await axios.get(`${url}/${removeAdminId}`);
            const deletedAdmin = response.data;
            archiveData(deletedAdmin);
            await axios.delete(`http://localhost:8080/admins/${removeAdminId}`);  //delete admin backend url
            dispatch(deleteSuccessModal(true));
            navigate('/superadmin/createadmin')
        } catch (error) {
            console.error('Error deleting admin:', error);
        }
    }

    // delete icon
    function removeAdmin(id) {
        setConfirmationForDelete(true);
        setRemoveAdminID(id);
    }


    return (
        <>
       <SuperAdminNav/>
            <div className='ti-background-clr pt-5'>
                {adminDetails &&
                    <div className='sprAdmin-admin-details '>
                        <div className='d-flex justify-content-between flex-wrap '>
                            <p className=''>Admin User</p>
                            <div>
                                <div className='admin-edit d-inline-block me-5'>
                                    <i className="bi bi-pencil-square text-primary h3" onClick={() => { updateAdmin(adminDetails.id) }}></i>
                                </div>
                                <div className='admin-delete d-inline-block'>
                                    <i className="bi bi-trash3 text-danger h3  " onClick={() => { removeAdmin(adminDetails.id) }}></i>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className='text-center'>
                            <img src={user} alt={adminDetails.fname} />
                            <p className='text-primary'>{adminDetails.fname}</p>
                        </div>
                        <div className="row " >
                            <div className="col-md-6">

                                <div className='row mb-2'>
                                    <div className='col-md-6'>Admin Id</div>
                                    <div className='col-md-6 text-secondary'>CTPLAD00{adminDetails.id}</div>
                                </div>
                                <div className='row mb-2'>
                                    <div className='col-md-6'>First Name</div>
                                    <div className='col-md-6 text-secondary'>{adminDetails.fname}</div>
                                </div>
                                <div className='row mb-2'>
                                    <div className='col-md-6'>Last Name</div>
                                    <div className='col-md-6 text-secondary'>{adminDetails.lname}</div>
                                </div>
                                <div className='row mb-2'>
                                    <div className='col-md-6'>Email </div>
                                    <div className='col-md-6 mt-2  text-secondary'>{adminDetails.email}</div>
                                </div>
                                <div className='row mb-2'>
                                    <div className='col-md-6'>Phone</div>
                                    <div className='col-md-6 text-secondary'>{adminDetails.phone}</div>
                                </div>
                                <div className='row mb-2 '>
                                    <div className='col-md-6'>Address </div>
                                    <div className='col-md-6 mt-2 text-secondary address'>{adminDetails.address}</div>
                                </div>
                                <div className='row mb-2'>
                                    <div className='col-md-6'>Aadhar Number</div>
                                    <div className='col-md-6 text-secondary'>{adminDetails.aadhar}</div>
                                </div>
                                <div className='row mb-2'>
                                    <div className='col-md-6'>Pan Number</div>
                                    <div className='col-md-6 text-secondary'>{adminDetails.pan}</div>
                                </div>
                            </div>

                            <div className="col-md-6   ">
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
                        </div>

                    </div>}
            </div>

            <div >

                {/* Modal for confirming delete or cancel */}
                <Modal show={confirmationForDelete} onHide={() => setConfirmationForDelete(false)}>

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

                     {/*modal for admin edit sucess  */}
                 <Modal className="custom-modal" style={{ left: '50%', transform: 'translateX(-50%)' }} dialogClassName="modal-dialog-centered" show={editSuccessModalValue}  >
                     <div className="d-flex flex-column modal-success p-4 align-items-center ">
                         <img src={successCheck} className="img-fluid mb-4" alt="successCheck" />
                         <p className="mb-4 text-center">Admin User Profile Edited Successfully</p>
                         <button className="btn  w-100 text-white" onClick={() => {dispatch(editSuccessModal(false))}} style={{ backgroundColor: '#5EAC24' }}>Close</button>
                     </div>
              </Modal>
            </div>



        </>
    )

}

export default AdminDetailsView;