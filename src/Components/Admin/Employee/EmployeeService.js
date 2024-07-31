import axios from 'axios';
//Get employee data
export const getEmployeeData = async () => {
  try {
    const response = await axios.get('http://localhost:8081/employee/getemployees');
    return response.data; // Assuming the response.data contains the array of employee data
  } catch (error) {
    console.error('Error fetching employee data:', error);
    return []; // Return an empty array in case of error
  }
};
// Get Employee Detail
export const getEmployeeDetails = async (employeeId) => {
  try {
    const response = await axios.get(`http://localhost:8081/employee/${employeeId}`);
    return response.data; // Assuming the response.data contains the array of employee data
  } catch (error) {
    console.error('Error fetching employee data:', error);
    return []; // Return an empty array in case of error
  }
};
//create employee
export const addEmployeeData = async (formValues) => {
    try {
      const response = await axios.post('http://localhost:8081/employee/saveemployee', formValues);
      // Assuming the response contains the newly created employee data
      const createdEmployee = response.data;
      // You can handle the response as needed
      console.log('Created employee:', createdEmployee);
    } catch (error) {
      console.error('Error adding employee data:', error);
      // Handle error as needed
    }
  };

  // Check for duplicate employee details
// Check for duplicate employee details
export const checkEmployeeDuplicates = async (employeeData) => {
  try {
    const response = await axios.get('http://localhost:8081/employee/getemployees');
    const allEmployees = response.data;

    const duplicates = {
      emailId: false,
      panNumber: false,
      mobileNumber: false,
      aadharNumber: false,
    };

    allEmployees.forEach((employee) => {
      // Convert to strings for comparison
      const employeeMobile = employee.mobileNumber.toString();
      const employeeAadhar = employee.aadharNumber.toString();
      const inputMobile = employeeData.mobileNumber.toString();
      const inputAadhar = employeeData.aadharNumber.toString();

      if (employee.emailId === employeeData.emailId) {
        duplicates.emailId = true;
      }
      if (employee.panNumber === employeeData.panNumber) {
        duplicates.panNumber = true;
      }
      if (employeeMobile === inputMobile) {
        duplicates.mobileNumber = true;
      }
      if (employeeAadhar === inputAadhar) {
        duplicates.aadharNumber = true;
      }
    });

    return duplicates;
  } catch (error) {
    console.error('Error checking employee duplicates:', error);
    return null; // Handle error appropriately
  }
};

///last entered  employee
export const getLastEnteredEmployee = async () => {
  try {
    const response = await axios.get('http://localhost:8081/employee/getemployees');
    const allEmployees = response.data;
    if (allEmployees.length === 0) {
      return null;
    }
    const lastEnteredEmployeeData = allEmployees[allEmployees.length - 1];
    return lastEnteredEmployeeData;
  } catch (error) {
    console.error('Error fetching last entered employee:', error);
    return null;
  }
};

//delete employee
  export const deleteEmployeeData = async (employeeId) => {
    try {
      // Make DELETE request to the API endpoint with the employeeId
      await axios.delete(`http://localhost:8081/employee/${employeeId}`);
  
      // Retrieve updated employee data from the API and return it
      const updatedEmployeeData = await getEmployeeData();
      return updatedEmployeeData;
    } catch (error) {
      console.error('Error deleting employee data:', error);
      // Handle error as needed
      return null;
    }
  };
//edit employee
export const updateEmployeeData = async (employeeId, updatedData) => {
  try {
    const response = await axios.put(`http://localhost:8081/employee/${employeeId}`, updatedData);
    return response.data; // Assuming the response.data contains the updated employee data
  } catch (error) {
    console.error('Error updating employee data:', error);
    throw error; // Throw error to be handled in component
  }
};

