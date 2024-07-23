import React, { useState, useEffect } from 'react'
import  { getEmployeeData, addEmployeeData, deleteEmployeeData, updateEmployeeData, getEmployeeDetails } from './EmployeeService';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useParams, useNavigate } from 'react-router-dom';
import '../../css/style.css'
import successCheck from '../../Image/checked.png'


export default function EmployeeDetails() {

  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [SuccessConfirmation, setSuccessConfirmation] = useState(false);
  const { id } = useParams(); // Get the employee id from the route parameters 
  const navigate = useNavigate();
  // const employeeData = getEmployeeDetails()  
  // const [empData, setEmpData] = useState() 
  // const userData = employeeData.find((employee) => employee.id === parseInt(id, 10));
  // const userData = getEmployeeDetails(id); // Get employee data by id
  const [userData,setUserData] = useState(null)
  console.log(userData)
  const [editedEmployee, setEditedEmployee] = useState(userData || {});
  // const DeleteEmployee = employeeData[employeeData.length - 1];

  useEffect(() => {
    const fetchEmployeeData = async () => {
      const data = await getEmployeeDetails(id);
      setUserData(data);
    };

    fetchEmployeeData();
  }, [id]); // Fetch employee details when the component mounts or id changes

  const handleEdit = () => {
    addEmployeeData(editedEmployee, id);
    navigate("/admin/searchemployee");
  };

  const handleChange = (e) => {
    setEditedEmployee({
      ...editedEmployee,
      [e.target.name]: e.target.value,
   });
  };

  
  const handleEditConfirm = () => {setSuccessModalOpen(true)}
  const handleClose = () => {setSuccessModalOpen(false); }
  const handleConfirmClose = () => {setSuccessConfirmation(false); window.location.reload()}
  
  const handleSuccess = ()=> {
    navigate(`/admin/editemployee/${id}`);
  }
  const ConfirmClose = () => {
    setSuccessConfirmation(false)
    navigate('/admin/searchemployee')
  }           
    
    const handleSuccessClick = () => {
    navigate('/admin/searchemployee')
    }

    const handleDeleteConfirm = () => {setDeleteModalOpen(true)}
    const handleDeleteClose = () =>
     {setDeleteModalOpen(false);
    }
    const handleDeleteSuccess = async () =>
     {setDeleteModalOpen(false);
      //  const updatedEmployeeData = deleteEmployeeData(userData.id);
      // deleteEmployeeData(userData.id);
        // console.log("Updated Session Storage Data:", sessionStorage.getItem('employeedatas'));
        await deleteEmployeeData(id); // Pass id to delete employee data
        setSuccessConfirmation(true)    
    }

  
  return (
    <div className='background-clr'>
        <h3> Employee Details </h3>
        {userData ? (
        <div className="container employee-form">
          
          {/* <div className="row"> */}
          <div className="col-md-6 form-group">
              <label className="label col-md-4"> Employee Id  : </label>
              <label className="label col-md-8"> {userData.employeeId} </label>
            </div>
            
            <div className="col-md-6 form-group">
              <label className="label col-md-4"> Firstname  : </label>
              <label className="label col-md-8"> {userData.firstName} </label>
            </div>

            <div className="col-md-6 form-group">
              <label className="label col-md-4"> Lastname  : </label>
              <label className="label col-md-8"> {userData.lastName} </label>              
            </div>

          
            <div className="col-md-6 form-group">
              <label className="label col-md-4"> Address  : </label>
              <label className="label col-md-8"> {userData.address} </label>
            </div>

            <div className="col-md-6 form-group">
              <label className="label col-md-4"> Mobile Number  : </label>
              <label className="label col-md-8"> {userData.mobileNumber} </label>
            </div>
          
            <div className="col-md-6 form-group">
              <label className="label col-md-4"> Email Id   : </label>
              <label className="label col-md-8"> {userData.emailId} </label>
            </div>

           
            
            {/* <div className="row"> */}
              <div className="col-md-6 form-group">
                <label className="label col-md-4"> Project Id  : </label>
                <label className="label col-md-8"> {userData.projectId} </label>
              </div>

            <div className="col-md-6 form-group">
                <label className="label col-md-4"> Aadhar Card  : </label>
                <label className="label col-md-8"> {userData.aadharNumber} </label>
            </div>
            
            <div className="col-md-6 form-group">
                <label className="label col-md-4"> Pan Card  :</label>
                <label className="label col-md-8"> {userData.panNumber} </label>
            </div>            
         </div>
         ) : (
          // Render loading indicator or error message when userData is undefined
      <div>Loading...</div>
      )}
          <div className="buttons">
            
            <button type="submit" className="btn-edit btn-sm" onClick={handleEditConfirm}>              
              Edit
            </button>
            <button type="button" className="btn-delete btn-sm" onClick={handleDeleteConfirm}>              
              Delete
            </button>
            <button type="button" className="btn-cancel btn-sm" onClick={handleSuccessClick}>              
              cancel
            </button>
          </div>

      <Modal show={isSuccessModalOpen} onHide={handleClose}>        
        <Modal.Body>Do you want to Edit</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSuccess}>
            Yes 
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={isDeleteModalOpen} onHide={handleDeleteClose}>        
        <Modal.Body>Do you want to Delete</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleDeleteSuccess}>
            Delete 
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal centered size='sm' show={SuccessConfirmation} onHide={handleConfirmClose}>          
          <Modal.Body>
          <div className="d-flex flex-column modal-success p-4 align-items-center ">
            <img src={successCheck} className="img-fluid mb-4" alt="successCheck" />                        
            <p className="mb-4 text-center">Employee Profile Deleted Successfully</p>
            <button className="btn  w-100 text-white" onClick =  {ConfirmClose} style={{ backgroundColor: '#5EAC24' }}>Close</button>
          </div>
      </Modal.Body>
        </Modal> 

        

      
        
    
     </div>
     
  )
}
