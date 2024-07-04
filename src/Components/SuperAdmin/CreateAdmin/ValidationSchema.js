import * as Yup from 'yup';

export const basicSchema = Yup.object().shape({

  // regex validation for form field
  // first name
  firstName: Yup.string()
    .matches(/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/, 'Please enter the valid FirstName')
    .required('First Name is required'),
  // last name
  lastName: Yup.string()
    .matches(/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/, 'Please enter the valid LastName')
    .required('Last Name is required'),
  // address
  address: Yup.string()
    .min(10, 'Address should have at least 10 characters')
    .required('Address is required'),
  // email
  emailId: Yup.string().matches(/^(?=.{1,50}$)[\w-]+(\.[\w-]+)*@[A-Za-z0-9]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/
    , "Please enter the valid email id").required('Email is required'),
  // phone
  mobileNumber: Yup.string()
    .matches(/^\d{10}$/

      , 'The phone number should be 10 digits & numbers itself')
    .required('Phone number is required'),
  // aadhar
  aadharNumber: Yup.string()
    .matches(/^\d{12}$/
      , 'The aadhar number should be 12 digits & numbers itself')
    .required('aadhar number is required'),
  // pan
  panNumber: Yup.string()
    .matches(/[A-Z]{5}[0-9]{4}[A-Z]{1}/
      , 'Please enter the vaild pan number')
    .required('Pan Number is required'),
  // checkboxes
  employeeAccess: Yup.object().shape({
    create: Yup.boolean(),
    edit: Yup.boolean(),
    delete: Yup.boolean(),
  }),
  projectAccess: Yup.object().shape({
    create: Yup.boolean(),
    edit: Yup.boolean(),
    delete: Yup.boolean(),
  }),
  


});

