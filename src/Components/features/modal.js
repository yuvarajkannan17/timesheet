
import { createSlice } from "@reduxjs/toolkit";
// reducer for handling modal state value 
// initial value
const initialModalState = {
    showSuccessModal: false,
    failureModal: false,
    editSuccessModalValue:false
};
export const modalSlice =createSlice({
    name: 'modal',
    initialState: { value: initialModalState },
    reducers: {
        // create admin success
        successModal: (state, actions) => {
            state.value.showSuccessModal = actions.payload 
        }
        ,
        // create admin failure
        failureModal: (state, action) => {
            state.value.failureModal = action.payload;
        },
         // edit admin success
        editSuccessModal: (state, action) => {
            state.value.editSuccessModalValue = action.payload;
        }
    }
});

export const {successModal,failureModal,editSuccessModal}=modalSlice.actions;

export default  modalSlice.reducer;