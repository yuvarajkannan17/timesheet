// adminLoginSlice.js (example)
import { createSlice } from '@reduxjs/toolkit';

const adminLoginSlice = createSlice({
  name: 'adminLogin',
  initialState: { value: {} },
  reducers: {
    loginAdmin: (state, action) => {
      state.value = action.payload;
    },
    logoutAdmin: (state) => {
      state.value = {}; // Clear admin data on logout
    },
  },
});

export const { loginAdmin, logoutAdmin } = adminLoginSlice.actions;
export default adminLoginSlice.reducer;
