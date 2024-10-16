// employeeLoginSlice.js (example)
import { createSlice } from '@reduxjs/toolkit';

const employeeLoginSlice = createSlice({
  name: 'employeeLogin',
  initialState: { value: {} },
  reducers: {
    loginEmployee: (state, action) => {
      state.value = action.payload;
    },
    logoutEmployee: (state) => {
      state.value = {}; // Clear employee data on logout
    },
  },
});

export const { loginEmployee, logoutEmployee } = employeeLoginSlice.actions;
export default employeeLoginSlice.reducer;
