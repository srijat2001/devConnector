import validator from 'validator';
import is_empty from './is_empty';

module.exports = function validatePostInput(data){
    let errors = {};

    data.text = is_empty(data.text) ? '' : data.text;
    

    if(!validator.isLength(data.text,{min:10,max:300})){
        errors.text = "Post must be between 10 and 300 characters";
    }
    if(validator.isEmpty(data.text)){
        errors.text = "Text field is required";
    }
    return{
        errors,
        isValid : is_empty(errors)
    }
}