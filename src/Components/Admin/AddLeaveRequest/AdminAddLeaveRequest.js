import React, { useState } from "react";
import { useFormik } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./AddLeaveRequest.css";
import { schemaLeave } from "./LeaveSchema";
import leaveUrl from "../../Api/leaveRequest";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function AdminAddLeaveRequest() {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      startDate: new Date(),
      endDate: new Date(),
      leaveReason: "",
      leaveComment: "",
      numberOfDays: "",
    },
    validationSchema: schemaLeave,
    onSubmit,
  });
  // Calculate the last day of June
  const lastDayOfJune = new Date(new Date().getFullYear(), 5, 30); // Note: Month index is zero-based, so June is 5

  async function onSubmit() {
    const leaveData = await axios.post(leaveUrl, formik.values);
    console.log(leaveData);
    formik.resetForm();
  }

  return (
    <>
      <div className="ti-background-clr">
        <div className="ti-leave-management-container p-5 ">
          <div className="bg-white p-5 ">
            <h5 className="text-center py-2 text-primary">LEAVE REQUEST</h5>

            <form onSubmit={formik.handleSubmit}>
              <div class="row mb-3">
                <label for="inputEmail3" class="col-sm-2 col-form-label">
                  <span style={{ color: "red" }}>*</span> Start Date :
                </label>
                <div class="col-sm-10">
                  <DatePicker
                    selected={formik.values.startDate}
                    onChange={(date) => {
                      const startDate = date.toLocaleDateString("en-US"); // Example: "4/4/2024"
                      formik.setFieldValue("startDate", startDate);
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
                    <p className="text-danger small">
                      {formik.errors.startDate}
                    </p>
                  ) : (
                    ""
                  )}
                </div>
                  {" "}
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
                    value={formik.values.numberOfDays}
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
                    value={formik.values.leaveReason}
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
                    value={formik.values.leaveComment}
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
        </div>
      </div>
    </>
  );
}
export default AdminAddLeaveRequest;
