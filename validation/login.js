import validator from 'validator';
import is_empty from './is_empty';

module.exports = function validateLoginInput(data){
    let errors = {};

    data.email = is_empty(data.email) ? '' : data.email;
    data.password = is_empty(data.password) ? '' : data.password;
    

    if(!validator.isEmail(data.email)){
        errors.email = "Email is invalid";
    }
    if(validator.isEmpty(data.email)){
        errors.email = "Email field is required";
    }
    if(validator.isEmpty(data.password)){
        errors.password = "password field is required";
    }
    return{
        errors,
        isValid : is_empty(errors)
    }
}