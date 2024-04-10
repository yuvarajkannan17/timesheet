import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./EditLeaveRequest.css";
import { schemaLeave } from "./LeaveSchema";
import leaveUrl from "../../Api/leaveRequest";
import axios from "axios";
import { Modal } from 'react-bootstrap';
import successCheck from '../../Image/checked.png'
import { useNavigate, useParams } from "react-router-dom";

function AdminEditLeaveRequest() {
  const [leaveSuccessModal,setLeaveSuccessModal]=useState(false);
  const { id } = useParams();
  console.log("ID from useParams:", id);
  const navigate = useNavigate();
  const [leaveData, setLeaveData] = useState("");

  useEffect(() => {
    async function fetchLeaveData() {
      try {
        const response = await axios.get(`${leaveUrl}/${id}`);
        console.log("Fetched leave data:", response.data);
        setLeaveData(response.data);
      } catch (error) {
        console.error("Error fetching leave data:", error);
      }
    }

    fetchLeaveData();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      startDate: leaveData ? new Date(leaveData.startDate) : new Date(),
      endDate: leaveData ? new Date(leaveData.endDate) : new Date(),
      leaveReason: leaveData ? leaveData.leaveReason : "",
      leaveComment: leaveData ? leaveData.leaveComment : "",
      numberOfDays: leaveData ? leaveData.numberOfDays : "",
    },
    validationSchema: schemaLeave,
    onSubmit,
  });

  // Calculate the last day of June
  const lastDayOfJune = new Date(new Date().getFullYear(), 5, 30); // Note: Month index is zero-based, so June is 5

  async function onSubmit() {
    try {
      await axios.put(`${leaveUrl}/${id}`, leaveData);
      setLeaveSuccessModal(true);
      formik.resetForm();
      navigate("/admin"); // Redirect to admin page after successful submission
    } catch (error) {
      console.error("Error editing leave request:", error);
    }
  }

  return (
    <>
      <div className="ti-background-clr">
        <div className="ti-leave-management-container p-5 ">
          <div className="bg-white p-5 ">
            <h5 className="text-center py-2 text-primary">EDIT LEAVE REQUEST</h5>

            <form onSubmit={formik.handleSubmit}>
              <div className="row mb-3">
              <label for="inputEmail3" class="col-sm-2 col-form-label">
                  <span style={{ color: "red" }}>*</span> Start Date :
                </label>
                <div class="col-sm-10">
                <DatePicker
                  selected={leaveData.startDate}
                  onChange={(date) => {
                    formik.setFieldValue("startDate", date);
                  }}
                  minDate={new Date()}
                  maxDate={lastDayOfJune} // Set maxDate to the last day of June
                  placeholderText="dd/mm/yyyy"
                  dateFormat="dd/MM/yyyy"
                  className="w-50"
                />
                {" "}
                </div>
                <div>
                  {formik.errors.startDate ? (
                    <p className="text-danger small">{formik.errors.startDate}</p>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <div class="row mb-3">
                <label for="inputEmail3" class="col-sm-2 col-form-label">
                  <span style={{ color: "red" }}>*</span> End Date :
                </label>
                <div class="col-sm-10">
                  <DatePicker
                    selected={leaveData.endDate}
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
                   {" "}
                </div>
                <div>
                  {formik.errors.endDate ? (
                    <p className="text-danger small">{formik.errors.endDate}</p>
                  ) : (
                    ""
                  )}
                </div>
                  {" "}
              </div>

              <div class="row mb-3">
                <label for="inputEmail3" class="col-sm-2 col-form-label">
                  <span style={{ color: "red" }}>*</span> Number of days :
                </label>
                <div class="col-sm-10">
                  <input
                    type="text"
                    id="numberOfDays"
                    name="numberOfDays"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={leaveData.numberOfDays}
                  ></input>
                   {" "}
                </div>
                <div>
                  {formik.errors.numberOfDays ? (
                    <p className="text-danger small">
                      {formik.errors.numberOfDays}
                    </p>
                  ) : (
                    ""
                  )}
                </div>
                  {" "}
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
                    value={leaveData.leaveReason}
                  >
                    <option value="">Select</option>
                    <option value="sick-leave">Sick Leave</option>
                    <option value="earned-leave">Earned Leave</option>
                    <option value="casual-leave">casual Leave</option>
                    <option value="maternity-leave">Maternity leave</option>
                    <option value="others-leave">Others</option>
                  </select>
                   {" "}
                </div>
                <div>
                  {formik.errors.leaveReason ? (
                    <p className="text-danger small">
                      {formik.errors.leaveReason}
                    </p>
                  ) : (
                    ""
                  )}
                </div>
                  {" "}
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
                    value={leaveData.leaveComment}
                  ></textarea>
                   {" "}
                </div>
                <div>
                  {formik.errors.leaveComment ? (
                    <p className="text-danger small">
                      {formik.errors.leaveComment}
                    </p>
                  ) : (
                    ""
                  )}
                </div>
                  {" "}
              </div>
              <div className="my-5 text-end">
                <button
                  type="submit"
                  disabled={formik.isSubmitting}
                  className="btn btn-success mx-2"
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="btn btn-secondary mx-2"
                  onClick={() => {
                    navigate("/admin");
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
          <div>
                    <Modal className="custom-modal" style={{ left: '50%', transform: 'translateX(-50%)' }} dialogClassName="modal-dialog-centered" show={leaveSuccessModal}  >
                        <div className="d-flex flex-column modal-success p-4 align-items-center ">
                            <img src={successCheck} className="img-fluid mb-4" alt="successCheck" />
                            <p className="mb-4 text-center"> Your Leave Request Submitted Successfully</p>
                            <button className="btn  w-100 text-white" onClick={() => setLeaveSuccessModal(false)} style={{ backgroundColor: '#5EAC24' }}>Close</button>
                        </div>
                    </Modal>
                </div>
        </div>
      </div>
    </>
  );
}

export default AdminEditLeaveRequest;
