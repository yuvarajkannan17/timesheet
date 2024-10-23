// superadminLoginSlice.js (example)
import { createSlice } from '@reduxjs/toolkit';

const superadminLoginSlice = createSlice({
  name: 'superadminLogin',
  initialState: { value: {} },
  reducers: {
    loginSuperadmin: (state, action) => {
      state.value = action.payload;
    },
    logoutSuperadmin: (state) => {
      state.value = {}; // Clear superadmin data on logout
    },
  },
});

export const { loginSuperadmin, logoutSuperadmin } = superadminLoginSlice.actions;
export default superadminLoginSlice.reducer;
