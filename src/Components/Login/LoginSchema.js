
import * as Yup from 'yup';

export const LoginSchema=Yup.object().shape({
    role:Yup.string().required("Select the role"),
    password:Yup.string().required("password should not be blank"),
    email:Yup.string().required("Email is required")
})