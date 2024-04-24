import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import './CreateProject.css';
import NavPages from '../NavPages';
import successImage from '../../Image/checked.png'; // Import your success image here
import { Modal} from 'react-bootstrap';

const CreateProject = () => {
  const navigate = useNavigate();

  // State for form input values
  const [formData, setFormData] = useState({
    projectID: '',
    projectTitle: '',
    projectDescription: '',
    teamMembers: [{ employeeID: '', employeeName: '' }],
    supervisorEmployees: [{ employeeID: '', employeeName: '' }],
  });

  // Error state for each field
  const [projectIDError, setProjectIDError] = useState('');
  const [projectTitleError, setProjectTitleError] = useState('');
  const [projectDescriptionError, setProjectDescriptionError] = useState('');
  const initialErrorState = { idError: '', nameError: '' };
  const [teamMembersError, setTeamMembersError] = useState([initialErrorState]);
  const [supervisorEmployeesError, setSupervisorEmployeesError] = useState([initialErrorState]);

  // State for confirmation page
  const [formSubmitted, setFormSubmitted] = useState(false);

  // State for showing the success modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const validateProjectID = (id) => /^CP\d{5}$/.test(id);
  const validateEmployeeID = (id) => /^CTPL\d{5}$/.test(id);

  const handleTeamMemberChange = (index, field, value) => {
    const updatedTeamMembers = [...formData.teamMembers];
    updatedTeamMembers[index][field] = value;
    setFormData({
      ...formData,
      teamMembers: updatedTeamMembers,
    });
  };

  const handleSupervisorChange = (index, field, value) => {
    const updatedSupervisorEmployees = [...formData.supervisorEmployees];
    updatedSupervisorEmployees[index][field] = value;
    setFormData({
      ...formData,
      supervisorEmployees: updatedSupervisorEmployees,
    });
  };

  const handleAddTeamMember = () => {
    setFormData({
      ...formData,
      teamMembers: [...formData.teamMembers, { employeeID: '', employeeName: '' }],
    });
    setTeamMembersError([...teamMembersError, { idError: '', nameError: '' }]);
  };

  const handleRemoveTeamMember = (index) => {
    const updatedTeamMembers = [...formData.teamMembers];
    updatedTeamMembers.splice(index, 1);
    setFormData({
      ...formData,
      teamMembers: updatedTeamMembers,
    });
  };

  const handleAddSupervisor = () => {
    setFormData({
      ...formData,
      supervisorEmployees: [...formData.supervisorEmployees, { employeeID: '', employeeName: '' }],
    });
    setSupervisorEmployeesError([...supervisorEmployeesError, { idError: '', nameError: '' }]);
  };

  const handleRemoveSupervisor = (index) => {
    const updatedSupervisorEmployees = [...formData.supervisorEmployees];
    updatedSupervisorEmployees.splice(index, 1);
    setFormData({
      ...formData,
      supervisorEmployees: updatedSupervisorEmployees,
    });
  };

  const handleSubmit = () => {
    if (!validateFields()) {
      return;
    }
    setFormSubmitted(true);
  };

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleConfirmSubmit = async () => {
    const { projectID, projectTitle, projectDescription, teamMembers, supervisorEmployees } = formData;

    const postData = {
      projectID,
      projectTitle,
      projectDescription,
      teamMembers,
      supervisorEmployees,
    };

    try {
      const response = await axios.post('https://65c0706125a83926ab964c6f.mockapi.io/api/projectdetails/projectDetails', postData);

      console.log('API Response:', response.data);
      setShowSuccessModal(true); // Show success modal when form is successfully submitted
      // Navigate back to Home'/admin' after successful submission
      navigate('/admin');
    } catch (error) {
      console.error('Error creating project:', error.message);
      alert('Error creating project. Please try again.');
      setFormSubmitted(false);
    }
  };

  const handleCancel = () => {
    // Navigate to '/admin'
    navigate('/admin');
  };

  const handleConfirmationCancel = () => {
    // Reset form and confirmation state when cancel is clicked
    setFormSubmitted(false);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate('/admin/updateprojectdetails');
  };

  const validateFields = () => {
    let isValid = true;

    // Reset error messages
    setProjectIDError('');
    setProjectTitleError('');
    setProjectDescriptionError('');
    setTeamMembersError([]);
    setSupervisorEmployeesError([]);

    if (!validateProjectID(formData.projectID)) {
      setProjectIDError('Project ID format is incorrect. Please use the format CPXXXXX.');
      isValid = false;
    }

    if (!formData.projectTitle) {
      setProjectTitleError('Project Title is required.');
      isValid = false;
    }

    if (!formData.projectDescription) {
      setProjectDescriptionError('Project Description is required.');
      isValid = false;
    }

    const teamMembersErrors = formData.teamMembers.map((member, index) => {
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

    const supervisorEmployeesErrors = formData.supervisorEmployees.map((supervisor, index) => {
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

  return (
    <div className="background-clr">
      <NavPages />
      <div className="adminUser-ProjectForm">
        <div className="createAdmin-ProjectForm">
          <p className="createAdmin-title-ProjectForm">Create New Project</p>
          <form>
            {formSubmitted ? (
              // Confirmation Page
              <div className="createAdmin-body-ProjectForm border border-1 border-dark rounded">
                <div className="createAdmin-confirmation-text-container">
                  <p className="createAdmin-confirmation-text">Confirm the following details before submitting:</p>
                </div>
                <div className="confirmation-field">
                  <p>Project ID: {formData.projectID}</p>
                </div>
                <div className="confirmation-field">
                  <p>Project Title: {formData.projectTitle}</p>
                </div>
                <div className="confirmation-field">
                  <p>Project Description: {formData.projectDescription}</p>
                </div>
                <div className="confirmation-field">
                  <p>Team Members:</p>
                  <ul>
                    {formData.teamMembers.map((member, index) => (
                      <li key={index}>{`ID: ${member.employeeID}, Name: ${member.employeeName}`}</li>
                    ))}
                  </ul>
                </div>
                <div className="confirmation-field">
                  <p>Supervisor Employees:</p>
                  <ul>
                    {formData.supervisorEmployees.map((supervisor, index) => (
                      <li key={index}>{`ID: ${supervisor.employeeID}, Name: ${supervisor.employeeName}`}</li>
                    ))}
                  </ul>
                </div>
                <div className="confirmation-button-group">
                  <div className="d-flex justify-content-center">
                    <button type="button" className="btn btn-success" onClick={handleConfirmSubmit}>
                      Confirm
                    </button>
                    <button type="button" className="btn btn-secondary ms-2" onClick={handleConfirmationCancel}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // Form Fields
              <div className="createAdmin-body-ProjectForm border border-1 border-dark rounded">
                <label>Project ID:</label>
                <input
                  type="text"
                  className="form-control-1-ProjectForm"
                  value={formData.projectID}
                  onChange={(e) => handleInputChange('projectID', e.target.value)}
                />
                {projectIDError && <p className="error-message-ProjectForm">{projectIDError}</p>}

                <label>Project Title:</label>
                <input
                  type="text"
                  className="form-control-1-ProjectForm"
                  value={formData.projectTitle}
                  onChange={(e) => handleInputChange('projectTitle', e.target.value)}
                />
                {projectTitleError && <p className="error-message-ProjectForm">{projectTitleError}</p>}

                <label>Project Description:</label>
                <textarea
                  className="form-control-1-ProjectForm"
                  value={formData.projectDescription}
                  onChange={(e) => handleInputChange('projectDescription', e.target.value)}
                />
                {projectDescriptionError && <p className="error-message-ProjectForm">{projectDescriptionError}</p>}

                {/* Team Members */}
                <div className="mt-3">
                  <label>Team Members:</label>
                  {formData.teamMembers.map((member, index) => (
                    <div key={index} className="row team-member-container-ProjectForm">
                      <div className="col">
                        <input
                          type="text"
                          placeholder="Employee ID"
                          className="form-control-ProjectForm"
                          value={member.employeeID || ''}
                          onChange={(e) => handleTeamMemberChange(index, 'employeeID', e.target.value)}
                        />
                        {teamMembersError[index].idError && (
                          <p className="error-message-ProjectForm">{teamMembersError[index].idError}</p>
                        )}
                      </div>

                      <div className="col">
                        <input
                          type="text"
                          placeholder="Employee Name"
                          className="form-control-ProjectForm"
                          value={member.employeeName || ''}
                          onChange={(e) => handleTeamMemberChange(index, 'employeeName', e.target.value)}
                        />
                        {teamMembersError[index].nameError && (
                          <p className="error-message-ProjectForm">{teamMembersError[index].nameError}</p>
                        )}
                      </div>

                      {index === 0 && (
                        <button
                          type="button"
                          className="btn-ProjectForm btn-success-ProjectForm btn-sm-ProjectForm add-member-ProjectForm"
                          onClick={handleAddTeamMember}
                        >
                          +
                        </button>
                      )}
                      {index > 0 && (
                        <button
                          type="button"
                          className="btn-ProjectForm btn-danger-ProjectForm btn-sm-ProjectForm remove-member-ProjectForm"
                          onClick={() => handleRemoveTeamMember(index)}
                        >
                          -
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Supervisor Employees */}
                <div className="mt-3">
                  <label>Supervisor Employees:</label>
                  {formData.supervisorEmployees.map((supervisor, index) => (
                    <div key={index} className="row supervisor-container-ProjectForm">
                      <div className="col">
                        <input
                          type="text"
                          placeholder="Supervisor ID"
                          className="form-control-ProjectForm"
                          value={supervisor.employeeID || ''}
                          onChange={(e) => handleSupervisorChange(index, 'employeeID', e.target.value)}
                        />
                        {supervisorEmployeesError[index].idError && (
                          <p className="error-message-ProjectForm">{supervisorEmployeesError[index].idError}</p>
                        )}
                      </div>

                      <div className="col">
                        <input
                          type="text"
                          placeholder="Supervisor Name"
                          className="form-control-ProjectForm"
                          value={supervisor.employeeName || ''}
                          onChange={(e) => handleSupervisorChange(index, 'employeeName', e.target.value)}
                        />
                        {supervisorEmployeesError[index].nameError && (
                          <p className="error-message-ProjectForm">{supervisorEmployeesError[index].nameError}</p>
                        )}
                      </div>

                      {index === 0 && (
                        <button
                          type="button"
                          className="btn-ProjectForm btn-success-ProjectForm btn-sm-ProjectForm add-supervisor-ProjectForm"
                          onClick={handleAddSupervisor}
                        >
                          +
                        </button>
                      )}
                      {index > 0 && (
                        <button
                          type="button"
                          className="btn-ProjectForm btn-danger-ProjectForm btn-sm-ProjectForm remove-supervisor-ProjectForm"
                          onClick={() => handleRemoveSupervisor(index)}
                        >
                          -
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Submit and Cancel Buttons */}
                <div className="createAdmin-button-ProjectForm d-flex-ProjectForm justify-content-ProjectForm-center my-3 mx-5">
                  <button
                    type="button"
                    className="btn-ProjectForm btn-success-ProjectForm btn-lg-ProjectForm submit-button-ProjectForm"
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    className="btn-ProjectForm btn-info-ProjectForm btn-lg-ProjectForm cancel-button-ProjectForm"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
      {showSuccessModal && (
        <Modal className="custom-modal" style={{ left: '50%', transform: 'translateX(-50%)' }} dialogClassName="modal-dialog-centered" show={showSuccessModal}  >
         <div className="d-flex flex-column modal-success p-4 align-items-center ">
             <img src={successImage} className="img-fluid mb-4" alt="SuccessCheck" />
             <p className="mb-4 text-center"> Your Timesheet has submitted for approval.</p>
             <button className="btn  w-100 text-white" onClick={() => { setShowSuccessModal(false) }} style={{ backgroundColor: '#5EAC24' }}>Close</button>
         </div>
        </Modal>
      )}
    </div>
  );
};

export default CreateProject;



