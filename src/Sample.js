
// async function approveSaveConfirmation() {
//     setAskConfirmationForApprove(false);
//     const approvedLeavesRequest = leaveDatas.filter((leave) => leave.checked === true);

//     console.log(approvedLeavesRequest);

//     approvedLeavesRequest.map((admin)=>{

//      let response= await axios.put(`http://localhost:8080/superadmin/${admin.id}/approve`)

//     })


//     try {
//       // Update the status of approved sheets and track their IDs
//       const updates = approvedLeavesRequest.map(async (leave) => {
//         // Update the status of the sheet locally
//         const updatedLeavesRequest = { ...leave, status: "Your leave request has been approved" };


//         // Make a PUT request to update the status of the sheet in the API
//         const response = await axios.put(`${leaveUrl}/${updatedLeavesRequest.id}`, updatedLeavesRequest);
//         const responseData = response.data;

//         // console.log("Updated approve leaves request:", responseData);

//         return updatedLeavesRequest;
//       });



//       // Wait for all updates to finish
//       const updatedLeavesRequest = await Promise.all(updates);

//       // Update the state with the updated data
//       setleaveDatas(updatedLeavesRequest);

//       // Reset checkbox selection
//       // cancelLeaveFun();

//       // Show success modal
//       setSuccessModalForApprove(true);
//     } catch (error) {
//       console.log('API error', error);
//     }
//   }