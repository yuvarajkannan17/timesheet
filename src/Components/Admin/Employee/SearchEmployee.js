import React, { useEffect, useState, useCallback } from 'react';
import { getEmployeeData } from './EmployeeService';
import { useNavigate } from 'react-router-dom';
import NavPages from '../NavPages';
import './SearchEmployee.css';

export default function SearchEmployee() {
  const [items, setItems] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [result, setResult] = useState(false); // Whether to display "No record found"
  const navigate = useNavigate();

  const handleFilter = useCallback(async () => {
    try {
      const allEmployees = await getEmployeeData();
      const filteredEmployees = allEmployees.filter(
        (employee) =>
          employee.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
          employee.lastName.toLowerCase().includes(searchText.toLowerCase())
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
      setResult(true);
    }
  }, [searchText]); // Use searchText as dependency

  useEffect(() => {
    handleFilter();
  }, [handleFilter]); // Include handleFilter in the dependency array

  const handleClear = () => {
    setSearchText('');
    handleFilter(); // Optionally trigger filter after clearing the search text
  };

  const handleCancel = () => {
    navigate('/admin');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Backspace') {
      // Trigger filtering when backspace key is pressed
      handleFilter();
    }
  };

  const handleRowClick = (employeeId) => {
    navigate(`/admin/employeedetails/${employeeId}`);
  };

  return (
    <div className='background-clr'>
      <NavPages />
      <h3> Search Employee </h3>
      <div className='container employee-form'>
        <div className='d-flex justify-content-end py-2' style={{ backgroundColor: 'rgb(251, 250, 250)' }}>
          <span className='me-2'>EMPLOYEE</span>
          <div>
            <form className='no-focus-outline'>
              <input
                className='w-75 search-control'
                type='text'
                value={searchText}
                placeholder='Search employee'
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button className='border-0 bg-white' type='button' onClick={handleClear}>
                <i className='bi bi-x'></i>
              </button>
              <button className='border-0 bg-white' type='button' onClick={handleFilter}>
                <i className='bi bi-search'></i>
              </button>
            </form>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12 search-employee'>
            <div className='employee-list'>
              {result ? (
                <p>No record found</p>
              ) : (
                <table className='table table-hover' style={{ width: '100%' }}>
                  <thead className='table-header'>
                    <tr className='text-center text-white'>
                      <th scope='col'>EMPLOYEE ID</th>
                      <th scope='col'>FIRST NAME</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((employee) => (
                      <tr key={employee.employeeId} onClick={() => handleRowClick(employee.employeeId)} style={{ cursor: 'pointer' }}>
                        <td className="text-center">{employee.employeeId}</td>
                        <td className="text-center">{employee.firstName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className='buttons'>
        <button type='button' className='btn btn-secondary mx-2' onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
