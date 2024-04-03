import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function LeaveManagement() {
  const [startDate, setStartDate] = useState(new Date());

  // Calculate the last day of June
  const lastDayOfJune = new Date(new Date().getFullYear(), 5, 30); // Note: Month index is zero-based, so June is 5

  // Function to handle date changes
  const handleDateChange = date => {
    setStartDate(date);
  };

  return (
    <div className="ti-background-clr">
      <div className="ti-leave-management-container p-5 ">
        <div className='bg-white'>
          <h5 className="text-center py-2 text-primary">LEAVE REQUEST</h5>
          <div className="row">
            <div className="col">
              <div className="p-5 center-align">
                <div className="my-3 leave-row">
                  <label className="pe-1"><span style={{ color: 'red' }}>*</span> Start Date :</label>
                  <DatePicker
                    selected={startDate}
                    onChange={handleDateChange}
                    minDate={new Date()}
                    maxDate={lastDayOfJune} // Set maxDate to the last day of June
                    placeholderText="dd/mm/yyyy"
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
                <div className="my-3 leave-row">
                  <label className="pe-1"><span style={{ color: 'red' }}>*</span> End Date :</label>
                  <DatePicker
                    selected={startDate}
                    onChange={handleDateChange}
                    minDate={new Date()}
                    maxDate={lastDayOfJune} // Set maxDate to the last day of June
                    placeholderText="dd/mm/yyyy"
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
                <div className="my-3 leave-row">

                  <label for="leave-reason" className="pe-1"><span style={{ color: 'red' }}>*</span> Reason :</label>

                  <select id="leave-reason" name="leave-reason">
                    <option value="no-value">Select</option>
                    <option value="sick-leave">Sick Leave</option>
                    <option value="earned-leave">Earned Leave</option>
                    <option value="casual-leave">casual Leave</option>
                    <option value="maternity-leave">Maternity leave</option>
                    <option value="others-leave">Others</option>
                  </select>

                </div>

                <div className="my-3 leave-row">
                  <label className="pe-1"> <span style={{ color: 'red' }}>*</span>Comments :</label>
                  <textarea type="date"></textarea>
                </div>
                {/* Other input fields */}
                <div className='my-5'>
                  <button className='btn btn-success mx-2'>Submit</button>
                  <button className='btn btn-secondary mx-2'>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeaveManagement;
