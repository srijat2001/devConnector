import validator from 'validator';
import is_empty from './is_empty';

module.exports = function validateEducationinput(data){
    let errors = {};

    data.school = is_empty(data.school) ? '' : data.school;
    data.degree = is_empty(data.degree) ? '' : data.degree;
    data.from = is_empty(data.from) ? '' : data.from;
    data.fieldOfStudy = is_empty(data.fieldOfStudy) ? '' : data.fieldOfStudy

    if(validator.isEmpty(data.school)){
        errors.school = "school field is required";
    }
    if(validator.isEmpty(data.degree)){
        errors.degree = "Degree field is required";
    }
    if(validator.isEmpty(data.from)){
        errors.from = "From date field is required";
    }
    if(validator.isEmpty(data.fieldOfStudy)){
        errors.fieldOfStudy = "Field of Study is required";
    }
    return{
        errors,
        isValid : is_empty(errors)
    }
}