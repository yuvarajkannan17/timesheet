import { useNavigate } from "react-router-dom";
function AdminHome() {
  const navigate = useNavigate();

  function goToAdminAddTimesheetPage() {
    navigate("/admin/adminaddtimesheet");
  }
  function goToAdminEditPage() {
    navigate("/admin/admineditTimesheet");
  }
  function goToAdminViewRejectPage() {
    navigate("/admin/adminrejecttimesheet");
  }
  function goToCreateEmployeePage() {
    navigate("/admin/createemployee");
  }
  function goToCreateProjectPage() {
    navigate("/admin/createproject");
  }
  function goToUpdateProjectDetailsPage() {
    navigate("/admin/updateprojectdetails");
  }
  function goToCreateLeavePage() {
    navigate("/admin/createproject");
  }
  function goToEditLeavePage() {
    navigate("/admin/editleaverequest");
  }
  function goToUploadEmployeesPage() {
    navigate("/admin/uploademployees");
  }
  function goToSearchEmployeePage() {
    navigate("/admin/searchemployee");
  }

  return (
    <>
      <div className="ti-background-clr">
        <div className="ti-home-container">
          {/* notification about timesheet */}
          <div className="row text-center ti-home-notification">
            <div className="col   mx-5 my-2 p-2 ">Timesheet to be approved :</div>
            <div className="col  mx-5  my-2 p-2  ">Rejected Timesheets :</div>
          </div>

          {/* notification about leave  */}
          <div className="row text-center ti-home-notification">
            <div className="col   mx-5 my-2 p-2 ">Leaves to be approved :</div>
            <div className="col  mx-5  my-2 p-2  ">Rejected Leave Request :</div>
          </div>

          {/* timesheet content */}
          <div className="row text-center ti-home-content mt-2">
            {/* timesheet status */}
            <div className="col mx-5 my-2 p-2 ">
              <p className="p-2 title">Your Submitted Timesheet</p>
              <div className="body   p-2 text-start">
                <div className="m-4 ti-home-ti-status p-4">
                  <p className="">Timesheet Period :</p>
                  <p className="">Created On :</p>
                  <div className="d-flex justify-content-around flex-wrap ">
                    <button className="status-btn p-2 m-2">Status</button>
                    <button className="view-btn p-2 m-2">View</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col mx-5 my-2 p-2 ">
              <p className="p-2 title">Your Requested Leave</p>
              <div className="body   p-2 text-start">
                <div className="m-4 ti-home-ti-status p-4">
                  <p className="">Requested Leave Period :</p>
                  <p className="">Created On :</p>
                  <div className="d-flex justify-content-around flex-wrap ">
                    <button className="status-btn p-2 m-2">Status</button>
                    <button className="view-btn p-2 m-2">View</button>
                  </div>
                </div>
              </div>
            </div>
            {/* navigation pages */}

            <div className="row text-center ti-home-content mt-2">

            <div className="col mx-5 my-2 p-2 ">
              <p className="p-2 title">Timesheet Management</p>
              <div className="p-3 body">
                <div className="my-4 ">
                  <button
                    type="button"
                    className="btn p-2 select-btn "
                    onClick={goToAdminAddTimesheetPage}>Add Timesheet
                  </button>
                </div>
                <div className="my-4">
                  <button
                    type="button"
                    className="btn p-2 select-btn"
                    onClick={goToAdminEditPage}>Edit Timesheet
                  </button>
                </div>
                <div className="my-4">
                  <button
                    type="button"
                    className="btn p-2 select-btn"
                    onClick={goToAdminViewRejectPage}>View Rejected Timesheet
                  </button>
                </div>
              </div>
            </div>

              <div className="col mx-5 my-2 p-2 ">
                <p className="p-2 title">Employee Management</p>
                <div className="p-3 body">
                  <div className="my-4 ">
                    <div className="my-4">
                      <button
                        type="button"
                        className="btn p-2 select-btn"
                        onClick={goToCreateEmployeePage}>Create Employee
                      </button>
                    </div>
                    <div className="my-4">
                      <button
                        type="button"
                        className="btn p-2 select-btn"
                        onClick={goToUploadEmployeesPage}>Upload Employees
                      </button>
                    </div>                    
                    <div className="my-4">
                      <button
                        type="button"
                        className="btn p-2 select-btn"
                        onClick={goToSearchEmployeePage}>Search Employee
                      </button>
                    </div>
                  </div>
                </div>
                </div>

        <div className="row text-center ti-home-content mt-2">
              <div className="col mx-5 my-2 p-2 ">
                <p className="p-2 title">Project Management</p>
                <div className="p-3 body">
                  <div className="my-4 ">
                    <div className="my-4">
                      <button
                        type="button"
                        className="btn p-2 select-btn"
                        onClick={goToCreateProjectPage}>Create Project
                      </button>
                    </div>

                    <div className="my-4">
                      <button
                        type="button"
                        className="btn p-2 select-btn"
                        onClick={goToUpdateProjectDetailsPage}>Update Project
                      </button>
                    </div>
                  </div>
                </div>
              </div> 
            

            <div className="col mx-5 my-2 p-2 ">
              <p className="p-2 title">Leave Management</p>
              <div className="p-3 body">
                <div className="my-4 ">
                  <div className="my-4">
                    <button
                      type="button"
                      className="btn p-2 select-btn"
                      onClick={goToCreateLeavePage}>Leave Request
                    </button>

                    <div className="my-4">
                    <button
                      type="button"
                      className="btn p-2 select-btn"
                      onClick={goToEditLeavePage}>Edit Leave Request
                    </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>          
        </div>
        </div>
        </div>
      </div>
      </div>
    </>
  );
}

export default AdminHome;
