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
  mobileNumber: Yup.number()
  .typeError('The phone number should be a number')
  .integer('The phone number should be a number without decimals')
  .positive('The phone number should be a positive number')
  .test(
      'len',
      'The phone number should be exactly 10 digits',
      val => val && val.toString().length === 10
  )
  .required('Phone number is required'),
  // aadhar
  aadharNumber: Yup.number()
        .typeError('The Aadhar number should be a number')
        .test(
            'len',
            'The Aadhar number should be exactly 12 digits',
            val => val && val.toString().length === 12
        )
        .required('Aadhar number is required'),
  // pan
  panNumber: Yup.string()
    .matches(/[A-Z]{5}[0-9]{4}[A-Z]{1}/
      , 'Please enter the vaild pan number')
    .required('Pan Number is required'),
    password:Yup.string()
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,"Password must include at least one number, one letter, one special character, and have a minimum length of 8 characters")
    .required("Password is required ")
    // checkboxes
  // employeeAccess: Yup.object().shape({
  //   create: Yup.boolean(),
  //   edit: Yup.boolean(),
  //   delete: Yup.boolean(),
  // }),
  // projectAccess: Yup.object().shape({
  //   create: Yup.boolean(),
  //   edit: Yup.boolean(),
  //   delete: Yup.boolean(),
  // }),
  


});

