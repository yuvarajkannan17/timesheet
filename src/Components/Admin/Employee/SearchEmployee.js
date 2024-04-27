import React, { useEffect, useState } from 'react'
import axios from 'axios';
import {getEmployeeData} from './EmployeeService';
import { useNavigate } from "react-router-dom";
// import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom'
import NavPages from '../NavPages';
import '../../css/style.css'


export default function SearchEmployee() {
  
  const [result, setResult] = useState(null)
  const [items, setItems] = useState([])
  const [searchtext, setSearchText] = useState("")
  const navigate = useNavigate()
  const handleSelect = () =>{
    navigate('/admin/employeedetails')
  }
  
  // const { id } = useParams();
 
  const handleFilter = async () => {
    try {
      const allEmployees = await getEmployeeData();
      const filteredEmployees = allEmployees.filter(
        (employee) =>
          employee.firstname.toLowerCase().includes(searchtext.toLowerCase()) ||
          employee.lastname.toLowerCase().includes(searchtext.toLowerCase())
        // Add other fields as needed
      );
      if (filteredEmployees.length > 0) {
        setItems(filteredEmployees);
        setResult(false);
      } else {
        setItems([]);
        setResult(true);
      }
    } catch (error) {
      console.error('Error filtering employee data:', error);
    }
  };
useEffect(() => {
  handleFilter();
}, [searchtext]); // Trigger filtering when searchtext changes

const handleClear = () => {
  setSearchText('');
};

const handleCancel = () => {
  navigate('/admin');
  };
  
  // const handleClear = () => {   
  //   setSearchText("")
  //   setItems([]);
  //   setResult(false)
  //  }
  // const [searchQuery,setSearchQuery] = useState([])
  // const handleCancel = () => {
  //   navigate('/admin')
  // }

  // useEffect(() =>{
  //   setItems(getEmployeeData());
  // },[])
  // const employeeData = items.length > 0 ? items : getEmployeeData();

  const handleKeyDown = (e) => {
    if (e.key === 'Backspace') {
      // Trigger filtering when backspace key is pressed
      handleFilter();
    }
  };
  
  // const [searchQuery, setSearchQuery] = useState("");
  // const handleSearchChange = (event) => {
  //   setSearchQuery(event.target.value);
  // };

  // const handleEmployeeSelect = async (id) => {
    // console.log(id)
  //   if (id) {
  //     try {
  //       const response = await axios.get(employeedatas);
  //       setSelectedEmployee(response.data.data)
  //     } catch (error) {
  //       console.error('Error fetching employee details:', error);
  //     }
  //   } else {
  //     // Reset details if no employee is selected
  //     setSelectedEmployee(null);
  //   }
  // };

  return (
          
   <div className='background-clr'>

    <NavPages/>
    <h3> Search Employee </h3>
    <div className='container employee-form '>
      <div className='d-flex justify-content-end   py-2' style={{ backgroundColor: "rgb(251, 250, 250)" }}  >
         <span className='me-2'>EMPLOYEE</span>
      <div>
          <form className='no-focus-outline'>
            <input className='w-75 search-control' type='text' value={searchtext} placeholder='search employee' onChange={(e) => {setSearchText(e.target.value); handleFilter()}} onKeyDown={handleKeyDown}></input>
            <button className='border-0 bg-white' type='button' onClick={handleClear}><i className="bi bi-x" ></i></button>
            <button className='border-0 bg-white' type='button' onClick={handleFilter}><i className="bi bi-search"></i></button>
          </form>
      </div>   
      </div>
      <div className='row'>
      <div className='col-md-12 search-employee'>
      
        <div className='employee-list'>
        {result ? ( 
              <p>No record found</p>):(
        <table className='table table-hover' style={{width:"100%"}} >
          <thead className='table-header'>
            <tr className='text-center text-white'>
               <th scope="col">EMPLOYEE ID</th>
               <th scope="col">FIRST NAME</th>
            </tr>
          </thead>
          <tbody>
            
            {items.map((d) => (
             
             <tr key={d.id} >
              <td>
              {/* <Link to={'/employeedetails${d.id.toString()} '}>{d.id}</Link> */}
              <Link key={d.id} to={`/admin/employeedetails/${d.id}`}>{d.id}</Link>
              </td>
              <td>{d.firstname}</td>            
             </tr>             
                // ))): (<p>No records found</p>)}
              ))}           
          </tbody>
          </table> 
              )} 
              
      </div>
     
      </div>  
    </div>    
    </div>
                 <div className='buttons'>
                 <button type="button" className="btn-cancel btn-sm" onClick={handleCancel} >Cancel</button>
                 </div>
                 
   </div>

  ) 
}
