import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';

const router = express.Router();
//Load Profile Model
import Profile from '../../models/Profile';

//Load User Model
import User from '../../models/User';

router.get('/test',(req,res)=>{
    res.json({msg:"Profile Work"})
})
//Load validation
import validateProfileinput from '../../validation/profile';
import validateExperienceinput from '../../validation/Add_experience';
import validateEducationinput from '../../validation/Add_education';

//@route    Get api/profile
//@desc     Get Current user's profile   
//@access   PRIVATE
router.get('/',passport.authenticate('jwt',{session : false}),(req,res)=>{
    const errors = {}
    Profile.findOne({user : req.user.id})
        .populate('user',['name','avatar'])
        .then(profile =>{
            if(!profile){
                errors.noprofile = "There is no profile for this user";
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err =>{
            res.status(404).json(err);
        })
})

//@route    Get api/profile/all
//@desc     All profiles  
//@access   PUBLIC
router.get('/all',(req,res)=>{
    const errors = {};
    Profile.find()
        .populate('user',['name','avatar'])
        .then(profiles =>{
            if(!profiles){
                errors.noprofile = "There are no profiles";
                res.status(404).json(errors);
            }
            res.json(profiles);
        })
        .catch(err =>{
            res.status(404).json({profiles : "There are no profiles"});
        })
})

//@route    Get api/profile/handle/:handle
//@desc     Get profile by handle   
//@access   PUBLIC
router.get('/handle/:handle',(req,res)=>{
    const errors = {};
    Profile.findOne({handle : req.params.handle})
        .populate('user',['name','avatar'])
        .then(profile =>{
            if(!profile){
                errors.noprofile = "There is no profile for this user";
                res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err =>{
            res.status(404).json(err);
        })
})

//@route    Get api/profile/user/:user_id
//@desc     Get profile by userid
//@access   PUBLIC
router.get('/user/:user_id',(req,res)=>{
    const errors = {};
    Profile.findOne({user : req.params.user_id})
        .populate('user',['name','avatar'])
        .then(profile =>{
            if(!profile){
                errors.noprofile = "There is no profile for this user";
                res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err =>{
            if(err) res.status(404).json({profile : "There is no profile for user"});
        })
})

//@route    Get api/profile
//@desc     Create or edit Current user's profile   
//@access   PRIVATE
router.post('/',passport.authenticate('jwt',{session : false}),(req,res)=>{

    const {errors,isValid} = validateProfileinput(req.body);
    //check validation
    if(!isValid){
        return res.status(400).json(errors);
    }
    //Get field
    const profileFields = {};
    profileFields.user = req.user.id;

    if(req.body.handle) profileFields.handle = req.body.handle;
    if(req.body.company) profileFields.company = req.body.company;
    if(req.body.website) profileFields.website = req.body.website;
    if(req.body.location) profileFields.location = req.body.location;
    if(req.body.bio) profileFields.bio = req.body.bio;
    if(req.body.status) profileFields.status = req.body.status;
    if(req.body.githubUsername) profileFields.githubUsername = req.body.githubUsername;
    //Skills - split into array
    if(typeof req.body.skills !== 'undefined'){
         profileFields.skills = req.body.skills.split(',');
    }
    //social
    profileFields.social = {};
    if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if(req.body.instagram) profileFields.social.instagram = req.body.instagram;
    if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;

    Profile.findOne({user : req.user.id})
        .then(profile =>{
            if(profile){
                Profile.findOneAndUpdate({user : req.user.id},{$set : profileFields},
                    {new : true}).then(profile => res.json(profile));
            }
            else{
                //check if handle exists
                Profile.findOne({handle : profileFields.handle})
                    .then(profile => {
                        if(profile){
                            errors.handle = "That handle already exists";
                            res.status(404).json(errors);
                        }
                    })
                //Save profile
                new Profile(profileFields).save().then(profile => res.json(profile));
            }
        })
})

//@route    Post api/profile/experience
//@desc     Add experience  
//@access   PRIVATE
router.post('/experience',passport.authenticate('jwt',{session : false}),(req,res)=>{
    //validate data
    const {errors,isValid} = validateExperienceinput(req.body);
    if(!isValid){
        return res.status(400).json(errors);
    }

    Profile.findOne({user : req.user.id})
        .then(profile => {
            const newExp = {
                title : req.body.title,
                company : req.body.company,
                location : req.body.location,
                from : req.body.from,
                to : req.body.to,
                current : req.body.current,
                description : req.body.description
            }
            //Add exp to profile
            profile.experience.unshift(newExp);
            profile.save().then(profile => res.json(profile));
        })
})

//@route    Delete api/profile/experience/:exp_id
//@desc     Delete experience  
//@access   PRIVATE
router.delete('/experience/:exp_id',passport.authenticate('jwt',{session : false}),(req,res)=>{
    Profile.findOne({user : req.user.id})
        .then(profile => {
            //Get remove index
            const removeIndex = profile.experience
                .map(item => item.id)
                .indexOf(req.params.exp_id)   

            //Splice out of Array
            profile.experience.splice(removeIndex,1);

            //Save
            profile.save().then(profile => res.json(profile));
        })
        .catch(err => res.json(err));
})


//@route    Post api/profile/education
//@desc     Add education
//@access   PRIVATE
router.post('/education',passport.authenticate('jwt',{session : false}),(req,res)=>{
    //validate data
    const {errors,isValid} = validateEducationinput(req.body);
    if(!isValid){
        return res.status(400).json(errors);
    }

    Profile.findOne({user : req.user.id})
        .then(profile => {
            const newEdu = {
                school : req.body.school,
                degree : req.body.degree,
                fieldOfStudy : req.body.fieldOfStudy,
                from : req.body.from,
                to : req.body.to,
                current : req.body.current,
                description : req.body.description
            }
            //Add exp to profile
            profile.education.unshift(newEdu);
            profile.save().then(profile => res.json(profile));
        })
})

//@route    Delete api/profile/education/:edu_id
//@desc     Delete education  
//@access   PRIVATE
router.delete('/education/:edu_id',passport.authenticate('jwt',{session : false}),(req,res)=>{
    Profile.findOne({user : req.user.id})
        .then(profile => {
            //Get remove index
            const removeIndex = profile.education
                .map(item => item.id)
                .indexOf(req.params.edu_id)   

            //Splice out of Array
            profile.education.splice(removeIndex,1);

            //Save
            profile.save().then(profile => res.json(profile));
        })
        .catch(err => res.json(err));
})

//@route    Delete api/profile
//@desc     Delete profile  and user
//@access   PRIVATE
router.delete('/',passport.authenticate('jwt',{session : false}),(req,res)=>{
    Profile.findOneAndRemove({user : req.user.id})
        .then(() => {
            User.findOneAndRemove({_id : req.user.id}).then(()=>{
                res.json({success : true});
            })
        })
        .catch(err => res.json(err));
})
module.exports = router;