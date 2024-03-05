import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import  { getLastEnteredEmployee } from './mockempdetails';
import Swal from 'sweetalert2';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import '../../css/style.css'

export default function EmployeeProfile() {
  const userData = getLastEnteredEmployee();
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);

  
  const handleEditConfirm = () => {setSuccessModalOpen(true)}
  const handleClose = () => {setSuccessModalOpen(false); window.location.reload()}
  const navigate = useNavigate()

    const handleSubmitClick = () => {
      Swal.fire('Success!', 'Employee profile Uploded Successfully,', 'success')
      navigate('/admin/createemployee')
    }
    const handleSuccessClick = () => {
      const LastEnteredEmployee = getLastEnteredEmployee();
      if(LastEnteredEmployee){
        navigate('/admin/createemployee?editMode=true') 
      }
      // Swal.fire('Success!', 'File Uploded Successfully,', 'success')
     
    }
  
  return (
    <div className='background-clr'>
        <h3> Employee Profile </h3>
        {userData ? (
        <div className="container employee-form">
          
          {/* <div className="row"> */}
            
            
            <div className="col-md-6 form-group">
              <label className="label col-md-4"> Firstname  : </label>
              <label className="label col-md-8"> {userData.firstname} </label>
            </div>

            <div className="col-md-6 form-group">
              <label className="label col-md-4"> Lastname  : </label>
              <label className="label col-md-8"> {userData.lastname} </label>              
            </div>

          
            <div className="col-md-6 form-group">
              <label className="label col-md-4"> Address  : </label>
              <label className="label col-md-8"> {userData.address} </label>
            </div>

            <div className="col-md-6 form-group">
              <label className="label col-md-4"> Mobile Number  : </label>
              <label className="label col-md-8"> {userData.mobilenumber} </label>
            </div>
          
            <div className="col-md-6 form-group">
              <label className="label col-md-4"> Email Id   : </label>
              <label className="label col-md-8"> {userData.emailid} </label>
            </div>

            <div className="col-md-6 form-group">
              <label className="label col-md-4"> Employee Id  : </label>
              <label className="label col-md-8"> {userData.employeeid} </label>
            </div>
            
            {/* <div className="row"> */}
              <div className="col-md-6 form-group">
                <label className="label col-md-4"> Project Id  : </label>
                <label className="label col-md-8"> {userData.projectid} </label>
              </div>

            <div className="col-md-6 form-group">
                <label className="label col-md-4"> Aadhar Card  : </label>
                <label className="label col-md-8"> {userData.aadharnumber} </label>
            </div>
            
            <div className="col-md-6 form-group">
                <label className="label col-md-4"> Pan Card  :</label>
                <label className="label col-md-8"> {userData.pannumber} </label>
            </div>

                
         
          </div>
        ) : (<></>)}
          <div className="buttons">
            
            <button type="submit" className="btn-edit btn-sm" onClick={handleEditConfirm}>              
              Back
            </button>
            <button type="button" className="btn-submit btn-sm" onClick={handleSubmitClick}>              
              Submit
            </button>
          </div>

          <Modal show={isSuccessModalOpen} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you want to go back</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSuccessClick}>
            Yes 
          </Button>
        </Modal.Footer>
      </Modal>

      {/* <Modal show={isSuccessModalOpen} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you want to Submit</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSuccess}>
            Yes 
          </Button>
        </Modal.Footer>
      </Modal> */}


      
        
    
     </div>
     
  )
}
