import express from 'express';
import User from '../../models/User';
import bcrypt from 'bcrypt';
import gravatar from 'gravatar';
import jwt from 'jsonwebtoken';
import props from '../../config/properties';
import passport from 'passport';
import validateRegisterInput from '../../validation/register';
import validateLoginInput from '../../validation/login';
const router = express.Router();

router.get('/test',(req,res)=>{
    res.json({msg:"User Work"})
})

//@route    POST api/users/register
//desc      Register user
//@access   PUBLIC
router.post('/register',(req,res)=>{
    const {errors,isValid} = validateRegisterInput(req.body);
    //check validation
    if(!isValid){
        return res.status(400).json(errors);
    }
    User.findOne({email : req.body.email})
        .then(user =>{
            if(user){
                errors.email = "Email already Exists";
                return res.status(404).json(errors);
            }
            else{
                const avatar = gravatar.url(req.body.email,{
                    s: '200', //size
                    r:'pg' , //rating
                    d: 'mm' //default
                });
                const newUser = new User({
                    name : req.body.name,
                    email : req.body.email,
                    avatar,
                    password : req.body.password
                });
                bcrypt.genSalt(10,(err,salt)=>{
                    bcrypt.hash(newUser.password,salt,(err,hash)=>{
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save().then(user=>{
                            res.json(user);
                        }).catch(err=>{
                            if(err) console.log(err);
                        })
                    })
                })

            }
        })
        .catch(err =>{
            if(err) throw err;
        })
})
//@route    POST api/users/login
//desc      login user / Returning JWT
//@access   PUBLIC

router.post('/login',(req,res)=>{
    //validation
    const {errors,isValid} = validateLoginInput(req.body);
    if(!isValid){
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email})
        .then(user =>{
            //check for email
            if(!user){
                errors.email = "User not found";
                return res.status(404).json(errors);
            }
            //check password
            bcrypt.compare(password,user.password)
                .then(isMatch=>{
                    if(isMatch){
                        //create JWT payload
                        const payload = {id : user.id, name:user.name, avatar:user.avatar}
                        //Sign Token
                        jwt.sign(payload, props.secretOrkey,{expiresIn : 3600},(err,token)=>{
                            if(err) throw err;
                            res.json({success : true , token : 'Bearer '+token})
                        })    
                    }
                    else{
                        errors.password = "password incorrect";
                        return res.status(404).json(errors);
                    }
                })
        })
})

//@route    GET api/users/current
//desc      Returns current user
//@access   PRIVATE
router.get('/current',passport.authenticate('jwt',{session : false}),(req,res)=>{
    res.json(req.user);
})

module.exports = router;