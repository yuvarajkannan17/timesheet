import React, {useState, useRef} from 'react'
import '../../css/style.css'
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import NavPages from '../NavPages';
import successCheck from '../../Image/checked.png'
import axios from 'axios';

export default function UploadEmployees() {

  // onchange states
  const [excelFile, setExcelFile] = useState(null);
  const [typeError, setTypeError] = useState(null);
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);  
  const [SuccessConfirmation, setSuccessConfirmation] = useState(false);

  const navigate = useNavigate()
  const formRef = useRef(null);

  // submit state
  const [excelData, setExcelData] = useState(null);  



  const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    // Make a POST request to the server to upload the file
    const response = await axios.post('http://localhost:8081/employee/import-excel', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    // If the request is successful, return the response data
    return response.data;
  } catch (error) {
    // If an error occurs during the request, handle it here
    console.error('Error uploading file:', error);
    throw error; // Optionally, re-throw the error to handle it in the component
  }
};

// export default uploadFile;


  // onchange event
  const handleFile=(e)=>{
    const file = e.target.files[0];
    const maxSize = 20 * 1024; // 20KB in bytes
    
    setTypeError(null)
    // Validate file type (Excel only)
    const allowedFileTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    if (!allowedFileTypes.includes(file.type)) {
      setTypeError('Invalid file type. Please upload an Excel file.');
      setExcelFile(null); // Clear file state
      return;
    }
    
    if (file.size > maxSize) {
      setTypeError('File size exceeds the limit (20KB)');
      setExcelFile(null); // Clear file state
       return;
       
    }
    
    setExcelFile(file) 
  }
  const handleUpload = () => {
    if (!excelFile) {
      setTypeError('Please select a file to upload.');
      return;
    }
    if(typeError){
      setTypeError(typeError)
      return
    }
    setSuccessModalOpen(true)
  }

  const handleCancel = () => {
    navigate('/admin')
  }
  

  const handleClose = () => {setSuccessModalOpen(false); }
  // const handleSuccessClick = () => {
  //   setSuccessModalOpen(false)
  //   setSuccessConfirmation(true)
   
  //   formRef.current.reset();


  // }
  const handleSuccessClick = async () => {
    try {
      if (!excelFile) {
        setTypeError('Please select a file to upload.');
        return;
      }
  
      if (typeError) {
        setTypeError(typeError);
        return;
      }
  
      // Call the uploadFile function to upload the file
      await uploadFile(excelFile);
  
      // If the upload is successful, show the success modal
      setSuccessModalOpen(true);
    } catch (error) {
      // Handle any errors that occur during the file upload
      console.error('Error uploading file:', error);
      // Optionally, set an error message to display to the user
      setTypeError('An error occurred while uploading the file. Please try again.');
    }
  };
  
  const handleConfirmClose = () => {
    setSuccessConfirmation(false);
     setExcelFile(null)}

  
  const ConfirmClose = () => {
    setSuccessConfirmation(false)
    setExcelFile(null)
  }
  return (
   <div className='background-clr'>
    <NavPages/>
    <div className="container employee-form">
      <h3>Upload Employees file</h3>
      <form ref={formRef}>
         <div className='row'>
    <div className="col-md-8 form-group" >
    <input type="file" name='fileupload' className="form-control" required onChange={handleFile} 
    key={excelData ? excelData.name : 'default'}/> 

    </div>

   <div className='col-md-4'>
   <button type="button" className="btn-submit btn-sm" onClick={handleUpload} >Upload</button>
   <button type="button" className="btn-cancel btn-sm" onClick={handleCancel} >Cancel</button>

   </div>
   </div>

      {typeError&&(
    <p className="text-danger"> {typeError} </p>        
    )}  
</form>
    


      <Modal show={isSuccessModalOpen} onHide={handleClose}>        
        <Modal.Body>Do you want to Upload</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSuccessClick}>
            Yes 
          </Button>
      </Modal.Footer>
      </Modal>

      <Modal centered size='sm' show={SuccessConfirmation} onHide={handleConfirmClose}>          
        <Modal.Body>
          <div className="d-flex flex-column modal-success p-4 align-items-center ">
            <img src={successCheck} className="img-fluid mb-4" alt="successCheck" />                        
            <p className="mb-4 text-center">Employee Profile Uploaded Successfully</p>
            <button className="btn  w-100 text-white" onClick =  {ConfirmClose} style={{ backgroundColor: '#5EAC24' }}>Close</button>
          </div>
        </Modal.Body>
      </Modal>    

   
    </div>
  
</div>
    
  )
}
