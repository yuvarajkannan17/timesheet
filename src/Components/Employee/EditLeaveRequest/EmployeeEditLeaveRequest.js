import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { schemaLeave } from "./LeaveSchema";
import leaveUrl from "../../Api/leaveRequest";
import { Modal, Button } from "react-bootstrap";
import successCheck from "../../Image/checked.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function EmployeeEditLeaveRequest() {
  const [leaveData, setLeaveData] = useState(null);
  const [editId, setEditId] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      startDate: new Date(),
      endDate: new Date(),
      numberOfDays: "",
      leaveReason: "",
      leaveComment: "",
    },
    validationSchema: schemaLeave,
    onSubmit: editLeaveRequest,
  });

  useEffect(() => {
    fetchLeaveData();
  }, []);

  async function fetchLeaveData() {
    try {
      const response = await axios.get(leaveUrl);
      const leaveRequest = response.data;
      if (leaveRequest.length > 0) {
        const lastRequest = leaveRequest[leaveRequest.length - 1];
        setLeaveData(lastRequest);
        setEditId(lastRequest.id);
        formik.setValues({
          startDate: new Date(lastRequest.startDate),
          endDate: new Date(lastRequest.endDate),
          numberOfDays: lastRequest.numberOfDays,
          leaveReason: lastRequest.leaveReason,
          leaveComment: lastRequest.leaveComment,
        });
      }
    } catch (error) {
      console.error("Error fetching leave request:", error);
    }
  }

  async function editLeaveRequest() {
    try {
      await axios.put(`${leaveUrl}/${editId}`, formik.values);
      setSuccessModal(true);
    } catch (error) {
      console.error("Error updating leave request:", error);
    }
  }

  function goToEmployeeHome() {
    navigate("/employee");
  }
  // Calculate the last day of June
  const lastDayOfJune = new Date(new Date().getFullYear(), 5, 30);

  return (
    <>
      {leaveData && (
        <div className="ti-background-clr">
          <div className="ti-leave-management-container p-5 ">
            <div className="bg-white p-5 ">
              <h5 className="text-center py-2 text-primary">
                EDIT LEAVE REQUEST
              </h5>

              <div className="ti-data-field-container pt-4">
                {/* Form for editing leave request */}
                <form onSubmit={formik.handleSubmit}>
                  <div className="row mb-3">
                    <label for="inputEmail3" class="col-sm-2 col-form-label">
                      <span style={{ color: "red" }}>*</span> Start Date :
                    </label>
                    <div class="col-sm-10">
                      <DatePicker
                        selected={formik.values.startDate}
                        onChange={(date) => {
                          formik.setFieldValue("startDate", date);
                        }}
                        minDate={new Date()}
                        maxDate={lastDayOfJune} // Set maxDate to the last day of June
                        placeholderText="dd/mm/yyyy"
                        dateFormat="dd/MM/yyyy"
                        className="w-50"
                      />{" "}
                    </div>
                  </div>

                  <div class="row mb-3">
                    <label for="inputEmail3" class="col-sm-2 col-form-label">
                      <span style={{ color: "red" }}>*</span> End Date :
                    </label>
                    <div class="col-sm-10">
                      <DatePicker
                        selected={formik.values.endDate}
                        onChange={(date) => {
                          const endDate = date.toLocaleDateString("en-US"); // Example: "4/4/2024"
                          formik.setFieldValue("endDate", endDate);
                        }}
                        minDate={new Date()}
                        maxDate={lastDayOfJune} // Set maxDate to the last day of June
                        placeholderText="dd/mm/yyyy"
                        dateFormat="dd/MM/yyyy"
                        className="w-50"
                      />
                       
                    </div>
                  </div>

                  <div class="row mb-3">
                    <label for="inputEmail3" class="col-sm-2 col-form-label">
                      <span style={{ color: "red" }}>*</span> Number of days:
                    </label>
                    <div class="col-sm-10">
                      <input
                        type="text"
                        id="numberOfDays"
                        name="numberOfDays"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.numberOfDays}
                      ></input>
                    </div>
                  </div>
                  <div class="row mb-3">
                    <label for="inputEmail3" class="col-sm-2 col-form-label">
                      <span style={{ color: "red" }}>*</span> Reason :
                    </label>
                    <div class="col-sm-10">
                      <select
                        id="leave-reason"
                        name="leaveReason"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.leaveReason}
                      >
                        <option value="">Select</option>
                        <option value="sick-leave">Sick Leave</option>
                        <option value="earned-leave">Earned Leave</option>
                        <option value="casual-leave">casual Leave</option>
                        <option value="maternity-leave">Maternity leave</option>
                        <option value="others-leave">Others</option>
                      </select>
                    </div>
                  </div>
                  <div class="row mb-3">
                    <label for="inputEmail3" class="col-sm-2 col-form-label">
                      <span style={{ color: "red" }}>*</span>Comments :
                    </label>
                    <div class="col-sm-10">
                      <textarea
                        type="text"
                        id="leave-comment"
                        name="leaveComment"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.leaveComment}
                      ></textarea>
                    </div>
                  </div>
                  
                </form>

                <div className="d-flex justify-content-center">
                  <button
                    className="btn btn-success m-3 w-5"
                    onClick={() => setConfirmationModal(true)}
                  >
                    Submit
                  </button>
                  <button
                    className="btn btn-secondary m-3 w-5"
                    onClick={goToEmployeeHome}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Confirmation Modal */}
          <Modal show={confirmationModal}>
            <Modal.Body>
              Do you want to submit the edited leave request?
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setConfirmationModal(false)}
              >
                Cancel
              </Button>
              <Button variant="success" onClick={editLeaveRequest}>
                Submit
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Success Modal */}
          <Modal
            className="custom-modal"
            style={{ left: "50%", transform: "translateX(-50%)" }}
            dialogClassName="modal-dialog-centered"
            show={successModal}            
          >
            <div className="d-flex flex-column modal-success p-4 align-items-center">
              <img
                src={successCheck}
                className="img-fluid mb-4"
                alt="successCheck"
              />
              <p className="mb-4 text-center">
                Leave request updated successfully.
              </p>
              <button
                className="btn w-100 text-white"
                onClick={() => setSuccessModal(false)}                
                style={{ backgroundColor: "#5EAC24" }}
              >
                Close
              </button>
            </div>
          </Modal>
        </div>
      )}
    </>
  );
}

export default EmployeeEditLeaveRequest;
