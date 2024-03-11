import React, {useState} from 'react'
import XLSX from 'xlsx';
import '../../css/style.css'
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';
import NavPages from '../NavPages';


export default function UploadEmployees() {

  // onchange states
  const [excelFile, setExcelFile] = useState(null);
  const [typeError, setTypeError] = useState(null);
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);


  // const [selectedFile, setSelectedFile] = useState(null);
  // const [errorMessage, setErrorMessage] = useState('');

  // submit state
  const [excelData, setExcelData] = useState(null);
  
  

  // onchange event
  const handleFile=(e)=>{
    const file = e.target.files[0];
    const maxSize = 20 * 1024; // 20KB in bytes


    setTypeError(null)
    // Validate file type (Excel only)
    const allowedFileTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    if (!allowedFileTypes.includes(file.type)) {
      setTypeError('Invalid file type. Please upload an Excel file.');
      return;
    }
    
    if (file.size > maxSize) {
      setTypeError('File size exceeds the limit (20KB)');
       return;
    }
    // else {
      
      // let reader = new FileReader();
      //   reader.readAsArrayBuffer(file);
      //   reader.onload=(e)=>{
      //     setExcelFile(e.target.result);
      //   }
    // } 
    setExcelData(file) 
  }
  const handleUpload = () => {
    if(typeError){
      setTypeError(typeError)
      return
    }
    setSuccessModalOpen(true)
  }
  // submit event
  // const handleFileSubmit=(e)=>{
  //   e.preventDefault();
  //   if(excelFile!==null){
  //     const workbook = XLSX.read(excelFile,{type: 'buffer'});
  //     const worksheetName = workbook.SheetNames[0];
  //     const worksheet = workbook.Sheets[worksheetName];
  //     const data = XLSX.utils.sheet_to_json(worksheet);
  //     setExcelData(data.slice(0,10));
  //   }
  //   // fileupload= " ";
  //   setSuccessModalOpen(true)
  // }
  //  const handleClose = () =>{
  //     setExcelData(false)
  //  }

  const handleClose = () => {setSuccessModalOpen(false); }
  
  const navigate = useNavigate()
//   const handleSuccess = ()=> {
//   // navigate('')
//   window.location.reload();
// }
  const handleSuccessClick = () => {
    Swal.fire({icon: 'success',
    title: 'Success!',
    text: 'File Uploaded Successfully', showConfirmButton: true}).then(()=> {window.location.reload()})  
  }


  return (
   <div className='background-clr'>
    <NavPages/>
    <div className="container employee-form">
      <h3>Upload & View Employee files</h3>
         <div className='row'>
{/* form */}
    <div className="col-md-8 form-group" >
    <input type="file" name='fileupload' className="form-control" required onChange={handleFile} />  
    </div>

   <div className='col-md-4'>
   <button type="button" className="btn btn-success btn-md" onClick={handleUpload}>UPLOAD</button>
   </div>
   </div>
      {typeError&&(
    <p className="text-danger"> {typeError} </p>        
    )}  


<Modal show={isSuccessModalOpen} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
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

   {/* <button onClick={handleSuccessClick}>Upload</button> */}
{/* view data */}
<div className="viewer">
  {/* {excelData?( */}
    <div className="table-responsive">
      {/* <table className="table"> */}

        {/* <thead>
          <tr>
            {Object.keys(excelData[0]).map((key)=>(
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead> */}

        {/* <tbody>
          {excelData.map((individualExcelData, index)=>(
            <tr key={index}>
              {Object.keys(individualExcelData).map((key)=>(
                <td key={key}>{individualExcelData[key]}</td>
              ))}
            </tr>
          ))}
        </tbody> */}

      {/* </table> */}

      {/* <button onClick={handleClose} type="button" class="btn btn-primary btn-sm">Close</button> */}

    </div>
  {/* ):(
    <div>No File is uploaded yet!</div>
  )} */}
</div>
    </div>
   {/* ajdajdksj */}
   </div>
  )
}
