// ProjectForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CreateProject.css';

const CreateProject = () => {
  const navigate = useNavigate();
  const [projectID, setProjectID] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [teamMembers, setTeamMembers] = useState([{ employeeID: '', employeeName: '' }]);
  const [supervisorEmployees, setSupervisorEmployees] = useState([{ employeeID: '', employeeName: '' }]);

  const validateProjectID = (id) => /^CP\d{5}$/.test(id);
  const validateEmployeeID = (id) => /^CTPL\d{5}$/.test(id);

  const validateFields = () => {
    if (!validateProjectID(projectID)) {
      alert('Project ID format is incorrect. Please use the format CPXXXXX.');
      return false;
    } else if (!projectTitle || !projectDescription || teamMembers.length === 0 || supervisorEmployees.length === 0) {
      alert('Please fill in all the fields.');
      return false;
    } else if (teamMembers.some((member) => !validateEmployeeID(member.employeeID) || !member.employeeName)) {
      alert('Employee ID format is incorrect. Please use the format CTPLXXXXX.');
      return false;
    } else if (supervisorEmployees.some((supervisor) => !validateEmployeeID(supervisor.employeeID) || !supervisor.employeeName)) {
      alert('Supervisor Employee ID format is incorrect. Please use the format CTPLXXXXX.');
      return false;
    }
    return true;
  };

  const handleTeamMemberChange = (index, field, value) => {
    const updatedTeamMembers = [...teamMembers];
    updatedTeamMembers[index][field] = value;
    setTeamMembers(updatedTeamMembers);
  };

  const handleSupervisorChange = (index, field, value) => {
    const updatedSupervisorEmployees = [...supervisorEmployees];
    updatedSupervisorEmployees[index][field] = value;
    setSupervisorEmployees(updatedSupervisorEmployees);
  };

  const handleAddTeamMember = () => {
    setTeamMembers([...teamMembers, { employeeID: '', employeeName: '' }]);
  };

  const handleRemoveTeamMember = (index) => {
    const updatedTeamMembers = [...teamMembers];
    updatedTeamMembers.splice(index, 1);
    setTeamMembers(updatedTeamMembers);
  };

  const handleAddSupervisor = () => {
    setSupervisorEmployees([...supervisorEmployees, { employeeID: '', employeeName: '' }]);
  };

  const handleRemoveSupervisor = (index) => {
    const updatedSupervisorEmployees = [...supervisorEmployees];
    updatedSupervisorEmployees.splice(index, 1);
    setSupervisorEmployees(updatedSupervisorEmployees);
  };

  const handleSubmit = async () => {
    if (!validateFields()) {
      return;
    }

    const formData = {
      projectID,
      projectTitle,
      projectDescription,
      teamMembers,
      supervisorEmployees,
    };

    try {
      const response = await axios.post('https://65c0706125a83926ab964c6f.mockapi.io/api/projectdetails/projectDetails', formData);

      console.log('API Response:', response.data);
      alert('Project created successfully!');
      setProjectID('');
      setProjectTitle('');
      setProjectDescription('');
      setTeamMembers([{ employeeID: '', employeeName: '' }]);
      setSupervisorEmployees([{ employeeID: '', employeeName: '' }]);
      // Navigate back to home page after successful submission
      navigate('/admin/updateprojectdetails');
    } catch (error) {
      console.error('Error creating project:', error.message);
      alert('Error creating project. Please try again.');
    }
  };

  const handleCancel = () => {
    // Navigate back to home page when cancel is clicked
    navigate('/admin/updateprojectdetails');
  };

  return (
    <div className="adminUser-ProjectForm">
      <div className="createAdmin-ProjectForm">
        <p className="createAdmin-title-ProjectForm">Create New Project</p>
        <form>
          <div className="createAdmin-body-ProjectForm border border-1 border-dark rounded">
            <label>Project ID:</label>
            <input type="text" className="form-control-1-ProjectForm" value={projectID} onChange={(e) => setProjectID(e.target.value)} />
            <label>Project Title:</label>
            <input type="text" className="form-control-1-ProjectForm" value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} />
            <label>Project Description:</label>
            <textarea className="form-control-1-ProjectForm" value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} />

            {/* Team Members */}
            <div className="mt-3">
              <label>Team Members:</label>
              {teamMembers.map((member, index) => (
                <div key={index} className="team-member-container-ProjectForm">
                  <input
                    type="text"
                    placeholder="Employee ID"
                    className="form-control-ProjectForm"
                    value={member.employeeID || ''}
                    onChange={(e) => handleTeamMemberChange(index, 'employeeID', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Employee Name"
                    className="form-control-ProjectForm"
                    value={member.employeeName || ''}
                    onChange={(e) => handleTeamMemberChange(index, 'employeeName', e.target.value)}
                  />
                  {index === 0 && (
                    <button type="button" className="btn-ProjectForm btn-success-ProjectForm btn-sm-ProjectForm add-member-ProjectForm" onClick={handleAddTeamMember}>
                      +
                    </button>
                  )}
                  {index > 0 && (
                    <button type="button" className="btn-ProjectForm btn-danger-ProjectForm btn-sm-ProjectForm remove-member-ProjectForm" onClick={() => handleRemoveTeamMember(index)}>
                      -
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Supervisor Employees */}
            <div className="mt-3">
              <label>Supervisor Employees:</label>
              {supervisorEmployees.map((supervisor, index) => (
                <div key={index} className="supervisor-container-ProjectForm">
                  <input
                    type="text"
                    placeholder="Supervisor ID"
                    className="form-control-ProjectForm"
                    value={supervisor.employeeID || ''}
                    onChange={(e) => handleSupervisorChange(index, 'employeeID', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Supervisor Name"
                    className="form-control-ProjectForm"
                    value={supervisor.employeeName || ''}
                    onChange={(e) => handleSupervisorChange(index, 'employeeName', e.target.value)}
                  />
                  {index === 0 && (
                    <button type="button" className="btn-ProjectForm btn-success-ProjectForm btn-sm-ProjectForm add-supervisor-ProjectForm" onClick={handleAddSupervisor}>
                      +
                    </button>
                  )}
                  {index > 0 && (
                    <button type="button" className="btn-ProjectForm btn-danger-ProjectForm btn-sm-ProjectForm remove-supervisor-ProjectForm" onClick={() => handleRemoveSupervisor(index)}>
                      -
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit and Cancel Buttons */}
          <div className="createAdmin-button-ProjectForm d-flex-ProjectForm justify-content-ProjectForm-center my-3 mx-5">
            <button type="button" className="btn-ProjectForm btn-success-ProjectForm btn-lg-ProjectForm submit-button-ProjectForm" onClick={handleSubmit}>
              Submit
            </button>
            <button type="button" className="btn-ProjectForm btn-info-ProjectForm btn-lg-ProjectForm cancel-button-ProjectForm" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;

















