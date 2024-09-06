import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import './CreateProject.css';
import NavPages from '../NavPages';
import successImage from '../../Image/checked.png'; // Import your success image here
import { Modal} from 'react-bootstrap';
import { useSelector } from "react-redux";


const CreateProject = () => {
  const navigate = useNavigate();
  const adminValue = useSelector(state=>state.adminLogin.value);
  const adminId = adminValue.adminId;
  // State for form input values
  const [formData, setFormData] = useState({    
    projectTitle: '',
    projectDescription: '',
    employeeTeamMembers: [{ employeeID: '' }],
    supervisorTeamMembers: [{ employeeID: '' }],   
  });

  // Error state for each field
  const [projectTitleError, setProjectTitleError] = useState('');
  const [projectDescriptionError, setProjectDescriptionError] = useState('');
  const initialErrorState = { idError: ''};
  const [employeeTeamMembersError, setemployeeTeamMembersError] = useState([initialErrorState]);
  const [supervisorTeamMembersError, setsupervisorTeamMembersError] = useState([initialErrorState]);
  

  // State for confirmation page
  const [formSubmitted, setFormSubmitted] = useState(false);

  // State for showing the success modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // const validateProjectID = (id) => /^PROJ\d{3}$/.test(id);
  const validateEmployeeID = (id) => /^EMP\d{3}$/.test(id);
  // const validateSupervisorID = (id) => /^STPL\d{3}$/.test(id);


  const handleTeamMemberChange = (index, field, value) => {
    const updatedemployeeTeamMembers = [...formData.employeeTeamMembers];
    updatedemployeeTeamMembers[index][field] = value;
    setFormData({
      ...formData,
      employeeTeamMembers: updatedemployeeTeamMembers,
    });
  };

  const handleSupervisorChange = (index, field, value) => {
    const updatedsupervisorTeamMembers = [...formData.supervisorTeamMembers];
    updatedsupervisorTeamMembers[index][field] = value;
    setFormData({
      ...formData,
      supervisorTeamMembers: updatedsupervisorTeamMembers,
    });
  };

  const handleAddTeamMember = () => {
    setFormData({
      ...formData,
      employeeTeamMembers: [...formData.employeeTeamMembers, { employeeID: '' }],
    });
    setemployeeTeamMembersError([...employeeTeamMembersError, { idError: '' }]);
  };

  const handleRemoveTeamMember = (index) => {
    const updatedemployeeTeamMembers = [...formData.employeeTeamMembers];
    updatedemployeeTeamMembers.splice(index, 1);
    setFormData({
      ...formData,
      employeeTeamMembers: updatedemployeeTeamMembers,
    });
  };

  const handleAddSupervisor = () => {
    setFormData({
      ...formData,
      supervisorTeamMembers: [...formData.supervisorTeamMembers, { employeeID: '' }],
    });
    setsupervisorTeamMembersError([...supervisorTeamMembersError, { idError: '' }]);
  };

  const handleRemoveSupervisor = (index) => {
    const updatedsupervisorTeamMembers = [...formData.supervisorTeamMembers];
    updatedsupervisorTeamMembers.splice(index, 1);
    setFormData({
      ...formData,
      supervisorTeamMembers: updatedsupervisorTeamMembers,
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
    const { projectTitle, projectDescription, employeeTeamMembers, supervisorTeamMembers } = formData;

    // Convert lists to arrays of strings
    const employeeIDs = employeeTeamMembers.map(member => member.employeeID);
    const supervisorIDs = supervisorTeamMembers.map(supervisor => supervisor.employeeID);

    try {
      const response = await axios.post(
        `http://localhost:8081/admin/createprojects`,
        {
          projectTitle,
          projectDescription,
          employeeTeamMembers: employeeIDs,
          supervisorTeamMembers: supervisorIDs,
        },
        {
          params: {
            adminId
          }
        }
      );

      console.log('API Response:', response.data);
      setShowSuccessModal(true); // Show success modal when form is successfully submitted
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
    
    setProjectTitleError('');
    setProjectDescriptionError('');
    setemployeeTeamMembersError([]);
    setsupervisorTeamMembersError([]);

    
    if (!formData.projectTitle) {
      setProjectTitleError('Project Title is required.');
      isValid = false;
    }

    if (!formData.projectDescription) {
      setProjectDescriptionError('Project Description is required.');
      isValid = false;
    }

    const employeeTeamMembersErrors = formData.employeeTeamMembers.map((member, index) => {
      let idError = '';
      
      if (!validateEmployeeID(member.employeeID)) {
        idError = 'Type valid employee ID. ';
      }
      
      if (idError) {
        isValid = false;
      }
      return { idError};
    });

    setemployeeTeamMembersError(employeeTeamMembersErrors);

    const supervisorTeamMembersErrors = formData.supervisorTeamMembers.map((supervisor, index) => {
      let idError = '';
      
      // if (!validateSupervisorID(supervisor.employeeID)) {
      //   idError = 'Type valid employee ID. ';
      // }
      
      
      return { idError };
    });

    setsupervisorTeamMembersError(supervisorTeamMembersErrors);

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
                      <li key={index}>{`ID: ${member.employeeID}`}</li>
                    ))}
                  </ul>
                </div>
                <div className="confirmation-field">
                  <p>Supervisor Employees:</p>
                  <ul>
                    {formData.supervisorTeamMembers.map((supervisor, index) => (
                      <li key={index}>{`ID: ${supervisor.employeeID}`}</li>
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
                {/* <label>Project ID:</label>
                <input
                  type="text"
                  className="form-control-1-ProjectForm"
                  value={formData.projectID}
                  onChange={(e) => handleInputChange('projectID', e.target.value)}
                /> */}
                {/* {projectIDError && <p className="error-message-ProjectForm">{projectIDError}</p>} */}

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
                          value={member.employeeID || ''}
                          onChange={(e) => handleTeamMemberChange(index, 'employeeID', e.target.value)}
                        />
                        {employeeTeamMembersError[index].idError && (
                          <p className="error-message-ProjectForm">{employeeTeamMembersError[index].idError}</p>
                        )}
                      </div>

                      {/* <div className="col">
                        <input
                          type="text"
                          placeholder="Employee Name"
                          className="form-control-ProjectForm"
                          value={member.employeeName || ''}
                          onChange={(e) => handleTeamMemberChange(index, 'employeeName', e.target.value)}
                        />
                        {employeeTeamMembersError[index].nameError && (
                          <p className="error-message-ProjectForm">{employeeTeamMembersError[index].nameError}</p>
                        )}
                      </div> */}

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
                          value={supervisor.employeeID || ''}
                          onChange={(e) => handleSupervisorChange(index, 'employeeID', e.target.value)}
                        />
                        {supervisorTeamMembersError[index].idError && (
                          <p className="error-message-ProjectForm">{supervisorTeamMembersError[index].idError}</p>
                        )}
                      </div>

                      {/* <div className="col">
                        <input
                          type="text"
                          placeholder="Supervisor Name"
                          className="form-control-ProjectForm"
                          value={supervisor.employeeName || ''}
                          onChange={(e) => handleSupervisorChange(index, 'employeeName', e.target.value)}
                        />
                        {supervisorTeamMembersError[index].nameError && (
                          <p className="error-message-ProjectForm">{supervisorTeamMembersError[index].nameError}</p>
                        )}
                      </div> */}

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
             <p className="mb-4 text-center"> Project created Successfully.</p>
             <button className="btn  w-100 text-white" onClick={() => { setShowSuccessModal(false) }} style={{ backgroundColor: '#5EAC24' }}>Close</button>
         </div>
        </Modal>
      )}
    </div>
  );
};

export default CreateProject;



