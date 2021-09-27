import validator from 'validator';
import is_empty from './is_empty';

module.exports = function validateProfileinput(data){
    let errors = {};

    data.handle = is_empty(data.handle) ? '' : data.handle;
    data.status = is_empty(data.status) ? '' : data.status;
    data.skills = is_empty(data.skills) ? '' : data.skills;

    if(!validator.isLength(data.handle,{min:2,max:40})){
        errors.handle = "Handle must be between 2 to 40 characters";
    }
    if(validator.isEmpty(data.handle)){
        errors.handle = "Handle field is required";
    }
    if(validator.isEmpty(data.status)){
        errors.status = "status field is required";
    }
    if(validator.isEmpty(data.skills)){
        errors.skills = "skills field is required";
    }
    if(!is_empty(data.website)){
        if(!validator.isURL(data.website)){
            errors.website = "Not a valid URL";
        }
    }
    if(!is_empty(data.youtube)){
        if(!validator.isURL(data.youtube)){
            errors.youtube = "Not a valid URL";
        }
    }
    if(!is_empty(data.twitter)){
        if(!validator.isURL(data.twitter)){
            errors.twitter = "Not a valid URL";
        }
    }
    if(!is_empty(data.instagram)){
        if(!validator.isURL(data.instagram)){
            errors.instagram = "Not a valid URL";
        }
    }
    if(!is_empty(data.linkedin)){
        if(!validator.isURL(data.linkedin)){
            errors.linkedin = "Not a valid URL";
        }
    }
    if(!is_empty(data.facebook)){
        if(!validator.isURL(data.facebook)){
            errors.facebook = "Not a valid URL";
        }
    }
    return{
        errors,
        isValid : is_empty(errors)
    }
}