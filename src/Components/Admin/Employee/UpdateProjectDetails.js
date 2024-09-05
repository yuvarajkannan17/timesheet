import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './UpdateProjectDetails.css';
import axios from 'axios';
import { useSelector } from "react-redux";


const UpdateProjectDetails = () => {
  const adminValue = useSelector(state=>state.adminLogin.value);
  const adminId = adminValue.adminId;
  const { id } = useParams();
  const [projectId, setprojectId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [editing, setEditing] = useState(false);
  const [updatedProject, setUpdatedProject] = useState({
    
    projectTitle: '',
    projectDescription: '',
    employeeTeamMembers: [""],
    supervisorTeamMembers: [""],
    
  });

  const fetchProjectDetails = async (projectId) => {
    console.log('Search Term:', projectId);
    if (projectId) {
      try {
        const response = await axios.get(`http://localhost:8081/admin/projects/${projectId}`);
        console.log('API Response:', response.data); // Log the entire response to see what it contains

        
        const foundProject = response.data;

        if (foundProject) {
          setSearchResult(foundProject);
          setUpdatedProject({ ...foundProject, projectId: foundProject.projectId });
        } else {
          console.log('No matching project found.');
          setSearchResult(null);
        }
      } catch (error) {
        console.error('Error fetching project details:', error.message);
        setSearchResult(null);
      }
    }
  };

  

  const navigate = useNavigate();

 
  const handleSearch = (e) => {
    e.preventDefault();
    setprojectId(projectId);
    console.log('Searching for:', projectId);
    console.log('Search Result:', searchResult);
  };

  const handleClick = (e) => {
    e.preventDefault(); // Prevent the form from submitting
    fetchProjectDetails(projectId);
  };

  // useEffect(() => {
  //   console.log('Search Term:', projectId);
  //   if (projectId) {
  //     axios.get(`http://localhost:8081/admin/projects/${projectId}`)
  //       .then((response) => {
  //         console.log('API Response:',response.data); // Log the entire response to see what it contains
  //         const foundProject = response.data.find(
  //           (project) => project.projectId.toString() === projectId ||
  //           project.projectTitle.toLowerCase() === projectId.toLowerCase()
  //         );
  
  //         if (foundProject) {
  //           setSearchResult(foundProject);
  //           setUpdatedProject({ ...foundProject, projectId: foundProject.projectId });
  //         } else {
  //           console.log('No matching project found.');
  //           setSearchResult(null);
  //         }
  //       })
  //       .catch((error) => {
  //         console.error('Error fetching project details:', error.message);
  //         setSearchResult(null);
  //       });
  //   }
  // }, [projectId, projectId]);
  
  // useEffect(() => {
  //   console.log('Search Term:', projectId);
  //   const fetchProjectDetails = async () => {
  //     if (projectId) {
  //       try {
  //         const response = await axios.get(`http://localhost:8081/admin/projects/${id}`);
  //         console.log('API Response:', response.data); // Log the entire response to see what it contains
          
  //         const foundProject = response.data.find(
  //           (project) =>
  //             project.projectId.toString() === projectId ||
  //             project.projectTitle.toLowerCase() === projectId.toLowerCase()
  //         );  
  //         if (foundProject) {
  //           setSearchResult(foundProject);
  //           setUpdatedProject({ ...foundProject, projectId: foundProject.projectId });
  //         } else {
  //           console.log('No matching project found.');
  //           setSearchResult(null);
  //         }
  //       } catch (error) {
  //         console.error('Error fetching project details:', error.message);
  //         setSearchResult(null);
  //       }
  //     }
  //   };
  
  //   fetchProjectDetails();
  // }, [projectId, id]);
  
  
  const handleNavigateAdminHome = () => {
    navigate('/admin');
  };

  const handleEmployeeIdChange = (index, value) => {
    const updatedEmployeeTeamMembers = [...updatedProject.employeeTeamMembers];
    updatedEmployeeTeamMembers[index] = value; // Update the employeeId at the specific index
    setUpdatedProject({ ...updatedProject, employeeTeamMembers: updatedEmployeeTeamMembers });
  };

  const handleSupervisorIdChange = (index, value) => {
    const updatedSupervisorTeamMembers = [...updatedProject.supervisorTeamMembers];
    updatedSupervisorTeamMembers[index] = value; // Update the supervisorId at the specific index
    setUpdatedProject({ ...updatedProject, supervisorTeamMembers: updatedSupervisorTeamMembers });
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    navigate('/admin');
  };

  // const handleSave = () => {
  //   fetch(`http://localhost:8081/admin/projects/${adminId}?adminId=${adminId}`, {
  //     method: 'PUT',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(updatedProject),
  //   })
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! Status: ${response.status}`);
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       console.log('Updated Project Details:', data);
  //       setEditing(false);
  //       alert('Project details updated successfully!');
  //     })
  //     .catch((error) => {
  //       console.error('Error updating project details:', error.message);
  //       alert('Error updating project details. Please try again.');
  //     });
  // };

  // const handleSave = async () => {
  //   try {
  //     console.log('Payload being sent:', JSON.stringify(updatedProject, null, 2)); // Log the payload
  //     const response = await fetch(`http://localhost:8081/admin/projects/${projectId}?adminId=${adminId}`, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(updatedProject),
  //     });
  
  //     if (!response.ok) {
  //       const errorText = await response.text(); // Capture the response body text for more details
  //     console.error('Error from server:', errorText);
  //       throw new Error(`HTTP error! Status: ${response.status}`);
  //     }
  
  //     const data = await response.json();
  //     console.log('Updated Project Details:', data);
  //     setEditing(false);
  //     alert('Project details updated successfully!');
  //   } catch (error) {
  //     console.error('Error updating project details:', error.message);
  //     alert('Error updating project details. Please try again.');
  //   }
  // };
  



// const handleSave = async () => {
//   try {
//     console.log('Payload being sent:', JSON.stringify(updatedProject, null, 2)); // Log the payload

//     const response = await axios.put(
//       `http://localhost:8081/admin/projects/${projectId}?adminId=${adminId}`, 
//       updatedProject, 
//       {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     console.log('Updated Project Details:', response.data);
//     setEditing(false);
//     alert('Project details updated successfully!');
//   } catch (error) {
//     if (error.response) {
//       // Server responded with a status other than 200
//       console.error('Error from server:', error.response.data);
//       alert(`Error: ${error.response.data.message}`);
//     } else if (error.request) {
//       // Request was made but no response received
//       console.error('No response received:', error.request);
//       alert('No response from server. Please try again later.');
//     } else {
//       // Something else happened
//       console.error('Error updating project details:', error.message);
//       alert('Error updating project details. Please try again.');
//     }
//   }
// };
 

// const transformedProject = {
//   ...updatedProject,
//   employeeTeamMembers: updatedProject.employeeTeamMembers.map(employee => employee.employeeId),
//   supervisorTeamMembers: updatedProject.supervisorTeamMembers.map(supervisor => supervisor.supervisorId),
// };
const handleSave = async () => {
  const { projectTitle, projectDescription, employeeTeamMembers, supervisorTeamMembers } = updatedProject;

    // Convert lists to arrays of strings
    const employeeIDs = employeeTeamMembers.map(member => member.employeeID);
    const supervisorIDs = supervisorTeamMembers.map(supervisor => supervisor.employeeID);
  try {
    console.log('Payload being sent:', JSON.stringify(updatedProject, null, 2));
    const response = await axios.put(
      `http://localhost:8081/admin/projects/${projectId}?adminId=${adminId}`, 
      updatedProject,
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (response.status !== 200) {
      console.error('Error from server:', response.data);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    console.log('Updated Project Details:', response.data);
    setEditing(false);
    alert('Project details updated successfully!');
  } catch (error) {
    if (error.response) {
        // The server responded with a status other than 2xx
        console.error('Error from server:', error.response.data);
        console.error('Status:', error.response.status);
        console.error('Headers:', error.response.headers);
    } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
    } else {
        // Something else happened in setting up the request
        console.error('Error setting up the request:', error.message);
    }
    alert('Error updating project details. Please try again.');
}

};


  const handleAddTeamMember = () => {
    setUpdatedProject({
      ...updatedProject,
      employeeTeamMembers: [...updatedProject.employeeTeamMembers, ''],
    });
  };

  const handleRemoveTeamMember = (index) => {
    const updatedemployeeTeamMembers = [...updatedProject.employeeTeamMembers];
    updatedemployeeTeamMembers.splice(index, 1);
    setUpdatedProject({ ...updatedProject, employeeTeamMembers: updatedemployeeTeamMembers });
  };
  
  

  const handleAddSupervisor = () => {
    setUpdatedProject({
      ...updatedProject,
      supervisorTeamMembers: [...updatedProject.supervisorTeamMembers, ''],
    });
  };

  const handleRemoveSupervisor = (index) => {
    const updatedsupervisorTeamMembers = [...updatedProject.supervisorTeamMembers];
    updatedsupervisorTeamMembers.splice(index, 1);
    setUpdatedProject({ ...updatedProject, supervisorTeamMembers: updatedsupervisorTeamMembers });
  };
  
  

  const handleArchive = (projectId, adminId) => {
    const projectIdToDelete = searchResult.projectId;

    axios.delete(`http://localhost:8081/projects/${projectId}?adminId=${adminId}}`)
      .then((response) => {
        console.log('Project archived successfully:', response.data);
        alert('Project archived successfully!');
        navigate('/');
      })
      .catch((error) => {
        console.error('Error archiving project:', error.message);
        alert('Error archiving project. Please try again.');
      });
  };

  

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col d-flex search-form-container">
            <form onSubmit={handleSearch} className="w-100">
              <br />
              <h2>Search Project</h2>
              <div className="mb-3 d-flex align-items-center">
                <label className="form-label me-2">Enter Project ID or Title:</label>
                <input
                  type="text"
                  className="form-control me-2"
                  value={projectId}
                  onChange={(e) => setprojectId(e.target.value)}
                />
                <button type="search" className="btn btn-primary" onClick={handleClick}>Search</button>
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
                      {!editing && <button  className="btn btn-primary" onClick={handleEdit}>Edit</button>}
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

                      {/* Display Team Members and Supervisor Employees */}
      {editing ? (
        <>
          {/* Team Members */}
          <div>
            <strong>Team Members</strong>
            {updatedProject.employeeTeamMembers.map((employee, index) => (
              <div key={index} className="mb-3">
                <input
                  type="text"
                  placeholder="Employee ID"
                  className="form-control"
                  value={employee.employeeId}
                  onChange={(e) => handleEmployeeIdChange(index, 'employeeId', e.target.value)}
                />
                {/* <input
                  type="text"
                  placeholder="Employee Name"
                  className="form-control"
                  value={member.firstName}
                  onChange={(e) => handleTeamMemberChange(index, 'employeeName', e.target.value)}
                /> */}
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

          {/* Supervisor Employees */}
          <div>
            <strong>Supervisor Employees</strong>
            {updatedProject.supervisorTeamMembers.map((supervisor, index) => (
              <div key={index} className="mb-3">
                <input
                  type="text"
                  placeholder="Supervisor ID"
                  className="form-control"
                  value={supervisor.supervisorId}
                  onChange={(e) => handleSupervisorIdChange(index, 'supervisorId', e.target.value)}
                />
                {/* <input
                  type="text"
                  placeholder="Supervisor Name"
                  className="form-control"
                  value={supervisor.firstName}
                  onChange={(e) => handleSupervisorChange(index, 'employeeName', e.target.value)}
                /> */}
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
          {/* Display search results when not editing */}
          {/* Team Members */}
          {searchResult.employeeTeamMembers && (
            <div>
              <strong>Team Members</strong>
              {searchResult.employeeTeamMembers.map((employee, index) => (
                <div key={index} className="mb-3">
                  <strong>Employee ID:</strong> {employee.employeeId}
                  {/* <br />
                  <strong>Employee Name:</strong> {member.firstName} */}
                </div>
              ))}
            </div>
          )}
          <br />

          {/* Supervisor Employees */}
          {searchResult.supervisorTeamMembers && (
            <div>
              <strong>Supervisor Employees</strong>
              {searchResult.supervisorTeamMembers.map((supervisor, index) => (
                <div key={index} className="mb-3">
                  <strong>Supervisor ID:</strong> {supervisor.supervisorId}
                  {/* <br />
                  <strong>Supervisor Name:</strong> {supervisor.firstName} */}
                </div>
              ))}
            </div>
          )}
          <br />
        </>
      )}

                  {editing && (
                    <div className="mb-3">
                      <button type="button" className="btn btn-success mx-2" onClick={handleSave}>Save</button>
                      <button type="button" className="btn btn-warning" onClick={handleArchive}>Delete</button>
                      <button type="button" className="btn btn-secondary mx-2" onClick={handleCancel}>Cancel</button>
                    </div>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-md-12 text-center">
            {!editing && (
              <button type="button" className="btn btn-secondary mx-2" onClick={handleNavigateAdminHome}>Cancel</button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateProjectDetails;








