import { createSlice } from "@reduxjs/toolkit";

export const supervisorLoginSlice=createSlice({
     name:"supervisorLogin",
    initialState:{
        value:{
            supervisorId:""
        }
    },
    reducers:{
        setSupervisorId:(state,action)=>{
            state.value.supervisorId=action.payload;
            

        }
       
    }

});
export const {setSupervisorId}=supervisorLoginSlice.actions;
export default supervisorLoginSlice.reducer;