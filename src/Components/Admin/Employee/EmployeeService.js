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
//last entered  employee
  export const getLastEnteredEmployee = async () => {
    try {
        const response = await axios.get('http://localhost:8081/employee/{employeeId}${lastEnteredEmployee.id}');
        const allEmployees = response.data;
    
        if (allEmployees.length === 0) {
          return null;
        }    
        // Assuming the last entered employee is the last item in the array
        const lastEnteredEmployee = allEmployees[allEmployees.length - 1];
        return lastEnteredEmployee;
      } catch (error) {
        console.error('Error fetching last entered employee:', error);
        return null;
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
      // Assuming the response contains the updated employee data
      const updatedEmployee = response.data;
      // You can handle the response as needed
      console.log('Updated employee:', updatedEmployee);
    } catch (error) {
      console.error('Error updating employee data:', error);
      // Handle error as needed
    }
  };

