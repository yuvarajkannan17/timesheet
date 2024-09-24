import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import './CreateProject.css';
import NavPages from '../NavPages';
import successCheck from '../../Image/checked.png'

import successImage from '../../Image/checked.png'; // Import your success image here
import { Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const CreateProject = () => {
  const navigate = useNavigate();
  const adminValue = useSelector((state) => state.adminLogin.value);
  const adminId = adminValue.adminId;

  // State for form input values
  const [formData, setFormData] = useState({
    projectTitle: '',
    projectDescription: '',
    employeeTeamMembers: [''],
    supervisorTeamMembers: [''],
  });

  // Error state for each field
  const [projectTitleError, setProjectTitleError] = useState('');
  const [projectDescriptionError, setProjectDescriptionError] = useState('');
  const [employeeTeamMembersError, setEmployeeTeamMembersError] = useState([]);
  const [supervisorTeamMembersError, setSupervisorTeamMembersError] = useState([]);
  const [createdProjectId, setCreatedProjectId] = useState(null); // New state to hold the created employee ID
  
  // State for confirmation page
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false); // Modal for confirmation

  // State for showing the success modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const validateEmployeeID = (id) => /^EMP\d{3}$/.test(id);

  const handleTeamMemberChange = (index, value) => {
    const updatedEmployeeTeamMembers = [...formData.employeeTeamMembers];
    updatedEmployeeTeamMembers[index] = value;
    setFormData({
      ...formData,
      employeeTeamMembers: updatedEmployeeTeamMembers,
    });
  };

  const handleSupervisorChange = (index, value) => {
    const updatedSupervisorTeamMembers = [...formData.supervisorTeamMembers];
    updatedSupervisorTeamMembers[index] = value;
    setFormData({
      ...formData,
      supervisorTeamMembers: updatedSupervisorTeamMembers,
    });
  };

  const handleAddTeamMember = () => {
    setFormData({
      ...formData,
      employeeTeamMembers: [...formData.employeeTeamMembers, ''],
    });
    setEmployeeTeamMembersError([...employeeTeamMembersError, '']);
  };

  const handleRemoveTeamMember = (index) => {
    const updatedEmployeeTeamMembers = [...formData.employeeTeamMembers];
    updatedEmployeeTeamMembers.splice(index, 1);
    setFormData({
      ...formData,
      employeeTeamMembers: updatedEmployeeTeamMembers,
    });
  };

  const handleAddSupervisor = () => {
    setFormData({
      ...formData,
      supervisorTeamMembers: [...formData.supervisorTeamMembers, ''],
    });
    setSupervisorTeamMembersError([...supervisorTeamMembersError, '']);
  };

  const handleRemoveSupervisor = (index) => {
    const updatedSupervisorTeamMembers = [...formData.supervisorTeamMembers];
    updatedSupervisorTeamMembers.splice(index, 1);
    setFormData({
      ...formData,
      supervisorTeamMembers: updatedSupervisorTeamMembers,
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
    setShowConfirmationModal(false); // Hide confirmation modal
    const { projectTitle, projectDescription, employeeTeamMembers, supervisorTeamMembers } = formData;

    try {
      const response = await axios.post(
        'http://localhost:8081/admin/createprojects',
        {
          projectTitle,
          projectDescription,
          employeeTeamMembers,
          supervisorTeamMembers,
        },
        {
          params: {
            adminId,
          },
        }
      );

      const createdProjectId = response.data.projectId;
      
      setCreatedProjectId(createdProjectId);
      
      console.log('API Response:', response.data);
      setShowSuccessModal(true); // Show success modal when form is successfully submitted
      // navigate('/admin');
      // return createdProjectId;
    } catch (error) {
      console.error('Error creating project:', error.message);
      // alert('Error creating project. Please try again.');
      setFormSubmitted(false);
    }
  };
  

  const handleCancel = () => {
    navigate('/admin');
  };

  // const handleConfirmationCancel = () => {
  //   setFormSubmitted(false);
  // };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate('/admin/updateprojectdetails');
  };

  const handleShowConfirmationModal = () => {
    setShowConfirmationModal(true);
  };

  const handleConfirmationCancel = () => {
    setShowConfirmationModal(false);
  };

  const validateFields = () => {
    let isValid = true;

    setProjectTitleError('');
    setProjectDescriptionError('');
    setEmployeeTeamMembersError([]);
    setSupervisorTeamMembersError([]);

    if (!formData.projectTitle) {
      setProjectTitleError('Project Title is required.');
      isValid = false;
    }

    if (!formData.projectDescription) {
      setProjectDescriptionError('Project Description is required.');
      isValid = false;
    }

    const employeeTeamMembersErrors = formData.employeeTeamMembers.map((member) => {
      let idError = '';

      if (!validateEmployeeID(member)) {
        idError = 'Type valid employee ID.';
      }

      if (idError) {
        isValid = false;
      }
      return idError;
    });

    setEmployeeTeamMembersError(employeeTeamMembersErrors);

    const supervisorTeamMembersErrors = formData.supervisorTeamMembers.map((supervisor) => {
      let idError = '';

      // if (!validateSupervisorID(supervisor)) {
      //   idError = 'Type valid supervisor ID.';
      // }

      return idError;
    });

    setSupervisorTeamMembersError(supervisorTeamMembersErrors);

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
                  <p>Project Title: {formData.projectTitle}</p>
                </div>
                <div className="confirmation-field">
                  <p>Project Description: {formData.projectDescription}</p>
                </div>
                <div className="confirmation-field">
                  <p>Team Members:</p>
                  <ul>
                    {formData.employeeTeamMembers.map((member, index) => (
                      <li key={index}>ID: {member}</li>
                    ))}
                  </ul>
                </div>
                <div className="confirmation-field">
                  <p>Supervisor Employees:</p>
                  <ul>
                    {formData.supervisorTeamMembers.map((supervisor, index) => (
                      <li key={index}>ID: {supervisor}</li>
                    ))}
                  </ul>
                </div>
                <div className="confirmation-button-group">
                  <div className="d-flex justify-content-center">
                    <button type="button" className="btn btn-success" onClick={handleShowConfirmationModal}>
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
                  {formData.employeeTeamMembers.map((member, index) => (
                    <div key={index} className="row team-member-container-ProjectForm">
                      <div className="col">
                        <input
                          type="text"
                          placeholder="Employee ID"
                          className="form-control-ProjectForm"
                          value={member || ''}
                          onChange={(e) => handleTeamMemberChange(index, e.target.value)}
                        />
                        {employeeTeamMembersError[index] && (
                          <p className="error-message-ProjectForm">{employeeTeamMembersError[index]}</p>
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
                  {formData.supervisorTeamMembers.map((supervisor, index) => (
                    <div key={index} className="row supervisor-container-ProjectForm">
                      <div className="col">
                        <input
                          type="text"
                          placeholder="Supervisor ID"
                          className="form-control-ProjectForm"
                          value={supervisor || ''}
                          onChange={(e) => handleSupervisorChange(index, e.target.value)}
                        />
                        {supervisorTeamMembersError[index] && (
                          <p className="error-message-ProjectForm">{supervisorTeamMembersError[index]}</p>
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
                    className="btn btn-success m-3 w-5"
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary m-3 w-5"
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

      {/* Confirmation Modal */}
      <Modal show={showConfirmationModal} onHide={handleConfirmationCancel} centered>
        <Modal.Header closeButton>
          <Modal.Title>Project Submission</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to create this project?</p>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleConfirmationCancel}>
            Cancel
          </button>
          <button className="btn btn-success" onClick={handleConfirmSubmit}>
            Confirm
          </button>
        </Modal.Footer>
      </Modal>
      {showSuccessModal && (
        <Modal className="custom-modal" style={{ left: '50%', transform: 'translateX(-50%)' }} dialogClassName="modal-dialog-centered" show={showSuccessModal} onHide={handleCloseSuccessModal} >
          <div className="d-flex flex-column modal-success p-4 align-items-center ">
            <img src={successCheck} className="img-fluid mb-4" alt="successCheck" />
            <p className="mb-4 text-center">Project created Successfully.</p>
            {createdProjectId && ( // Conditionally render project ID
              <p className='mb-4 text-center'>Project ID: {createdProjectId}</p>              
            )}
            <p className='mb-4 text-center'>Project Title: {formData.projectTitle}</p>
            
            <button className="btn  w-100 text-white" onClick={handleCloseSuccessModal} style={{ backgroundColor: '#5EAC24' }}>Close</button>
          </div>
        </Modal>
     )} 
    </div>
  );
};

export default CreateProject;