import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CreateProject.css';
import NavPages from '../NavPages';

const CreateProject = () => {
  const navigate = useNavigate();
  const [projectID, setProjectID] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [teamMembers, setTeamMembers] = useState([{ employeeID: '', employeeName: '' }]);
  const [supervisorEmployees, setSupervisorEmployees] = useState([{ employeeID: '', employeeName: '' }]);

  // Error state for each field
  const [projectIDError, setProjectIDError] = useState('');
  const [projectTitleError, setProjectTitleError] = useState('');
  const [projectDescriptionError, setProjectDescriptionError] = useState('');
  const initialErrorState = { idError: '', nameError: '' };
  const [teamMembersError, setTeamMembersError] = useState([initialErrorState]);
  const [supervisorEmployeesError, setSupervisorEmployeesError] = useState([initialErrorState]);

  const validateProjectID = (id) => /^CP\d{5}$/.test(id);
  const validateEmployeeID = (id) => /^CTPL\d{5}$/.test(id);

  const validateFields = () => {
    let isValid = true;

    // Reset error messages
    setProjectIDError('');
    setProjectTitleError('');
    setProjectDescriptionError('');
    setTeamMembersError([]);
    setSupervisorEmployeesError([]);

    if (!validateProjectID(projectID)) {
      setProjectIDError('Project ID format is incorrect. Please use the format CPXXXXX.');
      isValid = false;
    }

    if (!projectTitle) {
      setProjectTitleError('Project Title is required.');
      isValid = false;
    }

    if (!projectDescription) {
      setProjectDescriptionError('Project Description is required.');
      isValid = false;
    }

    const teamMembersErrors = teamMembers.map((member, index) => {
      let idError = '';
      let nameError = '';
      if (!validateEmployeeID(member.employeeID)) {
        idError = 'Type valid employee ID. ';
      }
      if (!member.employeeName) {
        nameError = 'Fill the required field.';
      }
      if (idError || nameError) {
        isValid = false;
      }
      return { idError, nameError };
    });

    setTeamMembersError(teamMembersErrors);

    const supervisorEmployeesErrors = supervisorEmployees.map((supervisor, index) => {
      let idError = '';
      let nameError = '';
      if (!validateEmployeeID(supervisor.employeeID)) {
        idError = 'Type valid employee ID. ';
      }
      if (!supervisor.employeeName) {
        nameError = 'Fill the required field.';
      }
      if (idError || nameError) {
        isValid = false;
      }
      return { idError, nameError };
    });

    setSupervisorEmployeesError(supervisorEmployeesErrors);

    return isValid;
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
    setTeamMembersError([...teamMembersError, { idError: '', nameError: '' }]);
  };

  const handleRemoveTeamMember = (index) => {
    const updatedTeamMembers = [...teamMembers];
    updatedTeamMembers.splice(index, 1);
    setTeamMembers(updatedTeamMembers);
  };

  const handleAddSupervisor = () => {
    setSupervisorEmployees([...supervisorEmployees, { employeeID: '', employeeName: '' }]);
    setSupervisorEmployeesError([...supervisorEmployeesError, { idError: '', nameError: '' }]);
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
   <div className='background-clr'>
    <NavPages/>
    <div className="adminUser-ProjectForm ">
      <div className="createAdmin-ProjectForm">
        <p className="createAdmin-title-ProjectForm">Create New Project</p>
        <form>
          <div className="createAdmin-body-ProjectForm border border-1 border-dark rounded">
            <label>Project ID:</label>
            <input type="text" className="form-control-1-ProjectForm" value={projectID} onChange={(e) => setProjectID(e.target.value)} />
            {projectIDError && <p className="error-message-ProjectForm">{projectIDError}</p>}

            <label>Project Title:</label>
            <input type="text" className="form-control-1-ProjectForm" value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} />
            {projectTitleError && <p className="error-message-ProjectForm">{projectTitleError}</p>}

            <label>Project Description:</label>
            <textarea className="form-control-1-ProjectForm" value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} />
            {projectDescriptionError && <p className="error-message-ProjectForm">{projectDescriptionError}</p>}

            {/* Team Members */}
            <div className="mt-3">
              <label>Team Members:</label>
              {teamMembers.map((member, index) => (
                <div key={index} className="row team-member-container-ProjectForm">
                  <div className='col'>
                    <input
                      type="text"
                      placeholder="Employee ID"
                      className="form-control-ProjectForm"
                      value={member.employeeID || ''}
                      onChange={(e) => handleTeamMemberChange(index, 'employeeID', e.target.value)}
                    />

                    {teamMembersError[index].idError && <p className="error-message-ProjectForm">{teamMembersError[index].idError}</p>}
                  </div>

                  <div className='col'>
                    <input
                      type="text"
                      placeholder="Employee Name"
                      className="form-control-ProjectForm"
                      value={member.employeeName || ''}
                      onChange={(e) => handleTeamMemberChange(index, 'employeeName', e.target.value)}
                    />

                  {teamMembersError[index].nameError && <p className="error-message-ProjectForm">{teamMembersError[index].nameError}</p>}
                  </div>

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
                <div key={index} className="row supervisor-container-ProjectForm">
                  <div className='col'>
                    <input
                      type="text"
                      placeholder="Supervisor ID"
                      className="form-control-ProjectForm"
                      value={supervisor.employeeID || ''}
                      onChange={(e) => handleSupervisorChange(index, 'employeeID', e.target.value)}
                    />

                    {supervisorEmployeesError[index].idError && <p className="error-message-ProjectForm">{supervisorEmployeesError[index].idError}</p>}
                  </div>

                  <div className='col'>
                    <input
                      type="text"
                      placeholder="Supervisor Name"
                      className="form-control-ProjectForm"
                      value={supervisor.employeeName || ''}
                      onChange={(e) => handleSupervisorChange(index, 'employeeName', e.target.value)}
                    />

                    {supervisorEmployeesError[index].nameError && <p className="error-message-ProjectForm">{supervisorEmployeesError[index].nameError}</p>}
                  </div>


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
   </div>
  );
};

export default CreateProject;