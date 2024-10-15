// supervisorLoginSlice.js (example)
import { createSlice } from '@reduxjs/toolkit';

const supervisorLoginSlice = createSlice({
  name: 'supervisorLogin',
  initialState: { value: {} },
  reducers: {
    loginSupervisor: (state, action) => {
      state.value = action.payload;
    },
    logoutSupervisor: (state) => {
      state.value = {}; // Clear supervisor data on logout
    },
  },
});

export const { loginSupervisor, logoutSupervisor } = supervisorLoginSlice.actions;
export default supervisorLoginSlice.reducer;
