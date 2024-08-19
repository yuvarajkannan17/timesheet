// import { useFormik } from "formik";
// import { LoginSchema } from "./LoginSchema";
// import { useState } from "react";
// import login from "../Api/login";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { UseDispatch, useDispatch } from "react-redux";
// import { authenticate } from "../features/adminDetails";
// import { object } from "yup";
// function TimesheetLogin() {
//     const navigate = useNavigate();
//     const [userError, setUserError] = useState('');
//     const [showPassword, setShowPassword] = useState(false);
//     const dispatch = useDispatch();
//     const { values, isSubmitting, handleChange, touched, errors, handleSubmit, handleBlur, resetForm } = useFormik({
//         initialValues: {
//             email: "",
//             password: ""
//         },
//         validationSchema: LoginSchema,
//         onSubmit
//     });

//     async function onSubmit(values) {

//         //    try{
//         //      const response = await axios.get(login)
//         //       const users=response.data;
//         //       const actualUserName=users.find((user)=>user.username===values.username);
//         //       const actualUserPassword=users.find((user)=>user.password===values.password);
//         //        if(actualUserName&&actualUserPassword){
//         //           dispatch(authenticate(true));
//         //           if(actualUserName.username==="employee"){
//         //              navigate('/employee')
//         //           }else if(actualUserName.username==="supervisor"){
//         //             navigate('/supervisor')
//         //           }else if(actualUserName.username==="admin"){
//         //             navigate('/admin')
//         //           }else if(actualUserName.username==="superadmin"){
//         //             navigate('/superadmin/createadmin')
//         //           }
//         //        }else{
//         //           setUserError('Incorrect Username or Password ')
//         //        }
//         //    }catch(error){
//         //      console.log(error)
//         //    }

//         try{

//            let response= await axios.post(`http://localhost:8082/api/login/employee?emailId=${values.email}&password=${values.password}`);
//            let credentials= response.data;

//             let nullValue=Object.values(credentials).some(value=>value===null);

//             if(nullValue){
//                 setUserError('Incorrect Username or Password ')
//             }else{
                
//                 for (let key in credentials){
//                        if(key==="employeeId"){
//                            navigate("/employee")
//                        }else if(key==="adminId"){

//                            navigate("/admin")

//                        }else if(key==="superAdminId"){

//                         navigate("/employee")

//                        }
//                 }
//             }


//         }catch(error){

//             console.log(error);

//         }
       

//     }


    

//     const togglePasswordVisibility = () => setShowPassword(!showPassword);

//     return (
//         <div className="ti-background-clr">
//             <div className="ti-login mb-0">

//                 <div className=" text-center ti-login-title">
//                     <h5 className="fsb">USER LOGIN</h5>
//                 </div>
//                 <div className="ti-login-content pt-3">

//                     <form className="ti-login-form" onSubmit={handleSubmit}>
//                         {userError && touched.email && <p style={{ color: 'rgba(228, 14, 14, 0.826)' }}>{userError}</p>}
//                         <div className="my-2">
//                             <label htmlFor="email" className="form-label">Email</label>
//                             <div className="position-relative">
//                                 <input
//                                     className={`form-control ${errors.email && touched.email ? "ti-lg-make-border-error" : ""}`}
//                                     type="text"
//                                     placeholder="email"
//                                     id="email"
//                                     name="email"
//                                     onChange={handleChange}
//                                     value={values.email}
//                                     onBlur={handleBlur}
//                                     style={{ paddingRight: '2rem' }} // Ensure similar padding as password
//                                 />
//                                 {/* You can add an email icon here if needed */}
//                             </div>
//                             {errors.email && touched.email && <p className="small" style={{ color: 'rgba(228, 14, 14, 0.826)' }}>{errors.email}</p>}
//                         </div>
//                         <div className="my-2">
//                             <label className="form-label fsb">Password</label>
//                             <div className="position-relative">
//                                 <input
//                                     className={`form-control ${errors.password && touched.password ? "ti-lg-make-border-error" : ""}`}
//                                     type={showPassword ? "text" : "password"}
//                                     placeholder="password"
//                                     id="lgpassword"
//                                     name="password"
//                                     onChange={handleChange}
//                                     value={values.password}
//                                     onBlur={handleBlur}
//                                     style={{ paddingRight: '2rem' }} // Ensure similar padding as email
//                                 />
//                                 <i
//                                     className={`bi ${!showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"} text-primary`}
//                                     style={{ cursor: 'pointer', position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)' }}
//                                     onClick={togglePasswordVisibility}
//                                 ></i>
//                             </div>
//                             {errors.password && touched.password && <p className="small" style={{ color: 'rgba(228, 14, 14, 0.826)' }}>{errors.password}</p>}
//                         </div>
//                         <div className="my-4 text-center">
//                             <button type="submit" disabled={isSubmitting} className="btn btn-primary ti-login-btn">Login</button>
//                         </div>
//                     </form>

//                 </div>

//             </div>

//         </div>
//     )
// }

// export default TimesheetLogin;
