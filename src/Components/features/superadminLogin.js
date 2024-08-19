import { createSlice } from "@reduxjs/toolkit";

export const superadminLoginSlice=createSlice({
     name:"superadminLogin",
    initialState:{
        value:{
            superadminId:""
        }
    },
    reducers:{
        setSuperadminId:(state,action)=>{
            state.value.superadminId=action.payload;
            

        }
       
    }

});
export const {setSuperadminId}=superadminLoginSlice.actions;
export default superadminLoginSlice.reducer;