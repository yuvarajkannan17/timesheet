import { createSlice } from "@reduxjs/toolkit";

export const adminLoginSlice=createSlice({
     name:"adminLogin",
    initialState:{
        value:{
            adminId:""
        }
    },
    reducers:{
        setAdminId:(state,action)=>{
            state.value.adminId=action.payload;
            

        }
       
    }

});
export const {setAdminId}=adminLoginSlice.actions;
export default adminLoginSlice.reducer;