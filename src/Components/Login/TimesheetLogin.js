import { useFormik } from "formik";
import { LoginSchema } from "./LoginSchema";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authenticate } from "../features/adminDetails";
import { loginEmployee } from '../features/employeeLogin';
import { loginAdmin } from '../features/adminLogin';
import { loginSupervisor } from '../features/supervisorLogin';
import { loginSuperadmin } from '../features/superadminLogin';


function TimesheetLogin() {
    const navigate = useNavigate();
    const [userError, setUserError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();

    const { values, isSubmitting, handleChange, touched, errors, handleSubmit, handleBlur, resetForm } = useFormik({
        initialValues: {
            role: "",
            email: "",
            password: ""
        },
        validationSchema: LoginSchema,
        onSubmit
    });

    async function onSubmit(values) {
        try {
            // API call based on role
            let response = await axios.post(`http://localhost:8088/api/login/${values.role}?emailId=${values.email}&password=${values.password}`);
            let credentials = response.data;
    
            if(credentials) {
                dispatch(authenticate(true));
                for (let key in credentials) {
                    if (key === "employeeId") {
                        let id = credentials[key];
                        dispatch(loginEmployee({ employeeId: id })); // Updated dispatch
                        navigate("/employee");
                    } else if (key === "adminId") {
                        let id = credentials[key];
                        dispatch(loginAdmin({ adminId: id })); // Updated dispatch
                        navigate("/admin");
                    } else if (key === "superAdminId") {
                        let id = credentials[key];
                        dispatch(loginSuperadmin({ superadminId: id })); // Updated dispatch
                        navigate("/superadmin");
                    } else if (key === "supervisorId") {
                        let id = credentials[key];
                        dispatch(loginSupervisor({ supervisorId: id })); // Updated dispatch
                        navigate("/supervisor");
                    }
                }
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setUserError('Incorrect Username or Password');
            } else if (error.request) {
                setUserError('No response from server. Please try again later.');
            } else {
                setUserError('An error occurred. Please try again.');
            }
        }
    }
    

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    return (
        <div className="ti-background-clr">
            <div className="ti-login">
                <div className="text-center ti-login-title">
                    <h5 className="fsb">USER LOGIN</h5>
                </div>
                <div className="ti-login-content pt-3">
                    <form className="ti-login-form" onSubmit={handleSubmit}>
                        {/* Display userError if it exists */}
                        {userError && <p style={{ color: 'rgba(228, 14, 14, 0.826)', marginBottom: '1rem' }}>{userError}</p>}

                        <div className="my-2">
                            <label htmlFor="role" className="form-label">Role</label>
                            <div className="position-relative">
                                <select
                                    className={`form-select ${errors.role && touched.role ? "ti-lg-make-border-error" : ""}`}
                                    value={values.role}
                                    name="role"
                                    onChange={handleChange}
                                >
                                    <option value="">Select Role</option>
                                    <option value="employee">Employee</option>
                                    <option value="admin">Admin</option>
                                    <option value="supervisor">Supervisor</option>
                                    <option value="superadmin">Superadmin</option>
                                </select>
                            </div>
                            {errors.role && touched.role && <p className="small" style={{ color: 'rgba(228, 14, 14, 0.826)' }}>{errors.role}</p>}
                        </div>

                        <div className="my-2">
                            <label htmlFor="email" className="form-label">Email</label>
                            <div className="position-relative">
                                <input
                                    className={`form-control ${errors.email && touched.email ? "ti-lg-make-border-error" : ""}`}
                                    type="text"
                                    placeholder="email"
                                    id="email"
                                    name="email"
                                    onChange={handleChange}
                                    value={values.email}
                                    onBlur={handleBlur}
                                    style={{ paddingRight: '2rem' }} // Ensure similar padding as password
                                />
                            </div>
                            {errors.email && touched.email && <p className="small" style={{ color: 'rgba(228, 14, 14, 0.826)' }}>{errors.email}</p>}
                        </div>

                        <div className="my-2">
                            <label className="form-label fsb">Password</label>
                            <div className="position-relative">
                                <input
                                    className={`form-control ${errors.password && touched.password ? "ti-lg-make-border-error" : ""}`}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="password"
                                    id="lgpassword"
                                    name="password"
                                    onChange={handleChange}
                                    value={values.password}
                                    onBlur={handleBlur}
                                    style={{ paddingRight: '2rem' }} // Ensure similar padding as email
                                />
                                <i
                                    className={`bi ${!showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"} text-primary`}
                                    style={{ cursor: 'pointer', position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)' }}
                                    onClick={togglePasswordVisibility}
                                ></i>
                            </div>
                            {errors.password && touched.password && <p className="small" style={{ color: 'rgba(228, 14, 14, 0.826)' }}>{errors.password}</p>}
                        </div>

                        <div className="my-4 text-center">
                            <button type="submit" disabled={isSubmitting} className="btn btn-primary ti-login-btn">Login</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default TimesheetLogin;