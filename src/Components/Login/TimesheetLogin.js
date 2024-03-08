import { useFormik } from "formik";
import { LoginSchema } from "./LoginSchema";
import { useState } from "react";
import login from "../Api/login";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function TimesheetLogin() {
    const navigate=useNavigate();
    const [userError,setUserError]=useState('');
    const { values,isSubmitting, handleChange,touched, errors,handleSubmit,handleBlur,resetForm } = useFormik({
        initialValues: {
            username: "",
            password: ""
        },
        validationSchema:LoginSchema,
        onSubmit
    });

   async function onSubmit(values){

       try{
         const response = await axios.get(login)
          const users=response.data;
          const actualUser=users.find((user)=>user.username===values.username);
           if(actualUser){
              if(actualUser.username==="employee"){
                 navigate('/employee')
              }else if(actualUser.username==="supervisor"){
                navigate('/supervisor')
              }else if(actualUser.username==="admin"){
                navigate('/admin/createemployee')
              }else if(actualUser.username==="superadmin"){
                navigate('/superadmin/createadmin')
              }
           }else{
              setUserError('Please enter the vaild username')
           }
       }catch(error){
         console.log(error)
       }
   
   }

   
//    console.log(errors);
   

    return (
        <div className="ti-background-clr">
            <div className="ti-login mb-0">

                <div className=" text-center ti-login-title">
                    <h5 className="fsb">USER LOGIN</h5>
                </div>
                <div className="ti-login-content pt-3">

                    <form className="ti-login-form" onSubmit={handleSubmit} >
                        <div className="my-2">
                            <label className="form-label">User Name</label>
                            <input className={`form-control ${errors.username && touched.username ? "ti-lg-make-border-error":""}`} type="text" placeholder="username" id="lgusername" name="username" onChange={handleChange} value={values.username} onBlur={handleBlur}></input>
                             {errors.username && touched.username && <p style={{color:'rgba(228, 14, 14, 0.826)'}}>{errors.username}</p> }
                             {userError && touched.username && <p style={{color:'rgba(228, 14, 14, 0.826)'}}>{userError}</p>}
                        </div>
                        <div className="my-2">
                            <label className="form-label fsb">Password</label>
                            <input className={`form-control ${errors.password && touched.password ? "ti-lg-make-border-error":""}`} type="password" placeholder="password" id="lgpassword" name="password" onChange={handleChange} value={values.password} onBlur={handleBlur} ></input>
                             {errors.password && touched.password && <p style={{color:'rgba(228, 14, 14, 0.826)'}}>{errors.password}</p> }
                        </div>
                        <div className="my-4 text-center">
                            <button type="submit" disabled={isSubmitting}  className="btn btn-primary ti-login-btn">Login</button>
                        </div>

                    </form>
                </div>

            </div>

        </div>
    )
}

export default TimesheetLogin;
