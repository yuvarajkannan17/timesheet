

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Modal } from 'react-bootstrap'; // Importing Modal
import { useSelector } from "react-redux";
import './UpdateProjectDetails.css';
import successCheck from '../../Image/checked.png'

const UpdateProjectDetails = () => {
  const adminValue = useSelector(state => state.adminLogin.value);
  const adminId = adminValue.adminId;
  const { id } = useParams();
  
  const [projectId, setProjectId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [editing, setEditing] = useState(false);
  const [updatedProject, setUpdatedProject] = useState({
    projectTitle: '',
    projectDescription: '',
    employeeTeamMembers: [{ employeeId: '', firstName: '' }],
    supervisorTeamMembers: [{ supervisorId: '', firstName: '' }],
  });

  const [showSaveModal, setShowSaveModal] = useState(false); // Modal state for save confirmation
  const [showArchiveModal, setShowArchiveModal] = useState(false); // Modal state for archive confirmation
const [updateProjectSuccessModal, setUpdateProjectSuccessModal] = useState(false);
  const navigate = useNavigate();


  const fetchProjectDetails = async (projectId) => {
    if (projectId) {
      try {
        const response = await axios.get(`http://localhost:8081/admin/projects/${projectId}`);
        const foundProject = response.data;

        if (foundProject) {
          setSearchResult(foundProject);
          setUpdatedProject({
            projectTitle: foundProject.projectTitle,
            projectDescription: foundProject.projectDescription,
            employeeTeamMembers: foundProject.employeeTeamMembers.map(member => member.employeeId),
            supervisorTeamMembers: foundProject.supervisorTeamMembers.map(supervisor => supervisor.supervisorId),
          });
        } else {
          setSearchResult(null);
        }
      } catch (error) {
        console.error('Error fetching project details:', error.message);
        setSearchResult(null);
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProjectDetails(projectId);
  };

  const handleClick = (e) => {
    e.preventDefault();
    fetchProjectDetails(projectId);
  };

  const handleEmployeeIdChange = (index, value) => {
    const updatedEmployeeTeamMembers = [...updatedProject.employeeTeamMembers];
    updatedEmployeeTeamMembers[index] = value;
    setUpdatedProject({ ...updatedProject, employeeTeamMembers: updatedEmployeeTeamMembers });
  };

  const handleSupervisorIdChange = (index, value) => {
    const updatedSupervisorTeamMembers = [...updatedProject.supervisorTeamMembers];
    updatedSupervisorTeamMembers[index] = value;
    setUpdatedProject({ ...updatedProject, supervisorTeamMembers: updatedSupervisorTeamMembers });
  };

  const handleEdit = () => {
    setEditing(true);
  };

  // const handleCancel = () => {
  //   navigate('/admin');
  // };

  const handleShowSaveModal = () => {
    setShowSaveModal(true); // Show save confirmation modal
  };

  const handleCloseSaveModal = () => {
    setShowSaveModal(false); // Hide save confirmation modal
  };


  const handleSave = async () => {
    handleCloseSaveModal();
    const transformedProject = {
      projectTitle: updatedProject.projectTitle,
      projectDescription: updatedProject.projectDescription,
      employeeTeamMembers: updatedProject.employeeTeamMembers,
      supervisorTeamMembers: updatedProject.supervisorTeamMembers,
    };
  
    try {
      const response = await axios.put(
        `http://localhost:8081/admin/projects/${projectId}?adminId=${adminId}`,
        transformedProject,
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      if (response.status !== 200) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // Fetch updated project details after saving
      fetchProjectDetails(projectId);
      setUpdateProjectSuccessModal(true);  // Show success modal
  
      setEditing(false);
    } catch (error) {
      if (error.response) {
        console.log(`Error: ${error.response.data.message}`);
      } else if (error.request) {
        console.log('No response from server. Please try again later.');
      } else {
        console.log('Error updating project details. Please try again.');
      }
    }
  };
  

  const handleAddTeamMember = () => {
    setUpdatedProject({
      ...updatedProject,
      employeeTeamMembers: [...updatedProject.employeeTeamMembers, ''],
    });
  };

  const handleRemoveTeamMember = (index) => {
    const updatedEmployeeTeamMembers = [...updatedProject.employeeTeamMembers];
    updatedEmployeeTeamMembers.splice(index, 1);
    setUpdatedProject({ ...updatedProject, employeeTeamMembers: updatedEmployeeTeamMembers });
  };

  const handleAddSupervisor = () => {
    setUpdatedProject({
      ...updatedProject,
      supervisorTeamMembers: [...updatedProject.supervisorTeamMembers, ''],
    });
  };

  const handleRemoveSupervisor = (index) => {
    const updatedSupervisorTeamMembers = [...updatedProject.supervisorTeamMembers];
    updatedSupervisorTeamMembers.splice(index, 1);
    setUpdatedProject({ ...updatedProject, supervisorTeamMembers: updatedSupervisorTeamMembers });
  };

  const handleArchive = async () => {
    try {
      await axios.delete(`http://localhost:8081/admin/projects/${projectId}?adminId=${adminId}`);
      alert('Project archived successfully!');
      navigate('/admin');
    } catch (error) {
      alert('Error archiving project. Please try again.');
    }
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col d-flex search-form-container">
            <form onSubmit={handleSearch} className="w-100">
              <h2>Search Project</h2>
              <div className="mb-3 d-flex align-items-center">
                <label className="form-label me-2">Enter Project ID:</label>
                <input
                  type="text"
                  className="form-control me-2"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                />
                <button type="button" className="btn btn-primary" onClick={handleClick}>Search</button>
              </div>
            </form>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col project-details-form-container">
            {searchResult && (
              <form>
                <div className="project-details-container">
                  <div className="project-details-header">
                    <h3>Project Details</h3>
                    <div className='button'>
                      {!editing && <button className="btn btn-primary" onClick={handleEdit}>Edit</button>}
                    </div>
                  </div>

                  <p>
                    <strong>Project Title:</strong>{' '}
                    {editing ? (
                      <input
                        type="text"
                        className="form-control"
                        value={updatedProject.projectTitle}
                        onChange={(e) =>
                          setUpdatedProject({
                            ...updatedProject,
                            projectTitle: e.target.value,
                          })
                        }
                      />
                    ) : (
                      searchResult.projectTitle
                    )}
                  </p>
                  <p>
                    <strong>Project Description:</strong>{' '}
                    {editing ? (
                      <textarea
                        className="form-control"
                        value={updatedProject.projectDescription}
                        onChange={(e) =>
                          setUpdatedProject({
                            ...updatedProject,
                            projectDescription: e.target.value,
                          })
                        }
                      />
                    ) : (
                      searchResult.projectDescription
                    )}
                  </p>

                  {editing ? (
                    <>
                      <div>
                        <strong>Team Members</strong>
                        {updatedProject.employeeTeamMembers.map((employee, index) => (
                          <div key={index} className="mb-3">
                            <input
                              type="text"
                              placeholder="Employee ID"
                              className="form-control"
                              value={employee}
                              onChange={(e) => handleEmployeeIdChange(index, e.target.value)}
                            />
                            <button type="button" className="btn btn-danger" onClick={() => handleRemoveTeamMember(index)}>
                              Remove
                            </button>
                          </div>
                        ))}
                        <button type="button" className="btn btn-success" onClick={handleAddTeamMember}>
                          Add Team Member
                        </button>
                      </div>
                      <br />

                      <div>
                        <strong>Supervisor Employees</strong>
                        {updatedProject.supervisorTeamMembers.map((supervisor, index) => (
                          <div key={index} className="mb-3">
                            <input
                              type="text"
                              placeholder="Supervisor ID"
                              className="form-control"
                              value={supervisor}
                              onChange={(e) => handleSupervisorIdChange(index, e.target.value)}
                            />
                            <button type="button" className="btn btn-danger" onClick={() => handleRemoveSupervisor(index)}>
                              Remove
                            </button>
                          </div>
                        ))}
                        <button type="button" className="btn btn-success" onClick={handleAddSupervisor}>
                          Add Supervisor
                        </button>
                      </div>
                      <br />
                    </>
                  ) : (
                    <>
                      {searchResult.employeeTeamMembers && (
                        <div>
                          <strong>Team Members</strong>
                          {searchResult.employeeTeamMembers.map((member, index) => (
                            <p key={index}>{member.employeeId} - {member.firstName}</p>
                            
                          ))}
                        </div>
                      )}
                      <br />
                      {searchResult.supervisorTeamMembers && (
                        <div>
                          <strong>Supervisors</strong>
                          {searchResult.supervisorTeamMembers.map((supervisor, index) => (
                            <p key={index}>{supervisor.supervisorId} - {supervisor.firstName}</p>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {editing && (
                  <div className="mb-3">
                    <button type="button" className="btn btn-success mx-2" onClick={handleShowSaveModal}>Save</button>
                    <button type="button" className="btn btn-danger" onClick={handleArchive}>Delete</button>
                    {/* <button type="button" className="btn btn-secondary mx-2" onClick={handleCancel}>Cancel</button> */}
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
  <button className="AddTimesheet btn btn-secondary m-3" style={{ width: '100px' }} onClick={() => { navigate('/admin') }}>
    Cancel
  </button>
</div>


      {/* Save Confirmation Modal */}
      <Modal show={showSaveModal} onHide={handleCloseSaveModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Save</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to save the changes to this project?</p>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleCloseSaveModal}>Cancel</button>
          <button className="btn btn-success" onClick={handleSave}>Save</button>
        </Modal.Footer>
      </Modal>
      <Modal
  className="custom-modal"
  style={{ left: '50%', transform: 'translateX(-50%)' }}
  dialogClassName="modal-dialog-centered"
  show={updateProjectSuccessModal}
>
  <div className="d-flex flex-column modal-success p-4 align-items-center ">
    <img src={successCheck} className="img-fluid mb-4" alt="successCheck" />
    <p className="mb-4 text-center">Your Project Updated Successfully</p>
    <button
      className="btn  w-100 text-white"
      onClick={() => {
        setUpdateProjectSuccessModal(false);
        fetchProjectDetails(projectId);  // Fetch the latest project data after closing the modal
      }}
      style={{ backgroundColor: '#5EAC24' }}
    >
      Close
    </button>
  </div>
</Modal>

    </>
  );
};

export default UpdateProjectDetails;
