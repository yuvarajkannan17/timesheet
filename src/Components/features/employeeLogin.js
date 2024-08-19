import { createSlice } from "@reduxjs/toolkit";

export const employeeLoginSlice=createSlice({
     name:"employeeLogin",
    initialState:{
        value:{
            employeeId:""
        }
    },
    reducers:{
        setEmployeeId:(state,action)=>{
            state.value.employeeId=action.payload;
            

        }
       
    }

});
export const {setEmployeeId}=employeeLoginSlice.actions;
export default employeeLoginSlice.reducer;