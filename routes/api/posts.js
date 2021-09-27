import express from 'express';
import { profile_url } from 'gravatar';
import mongoose from 'mongoose';
import passport from 'passport';
import Post from '../../models/Post';
import Profile from '../../models/Profile';
const router = express.Router();

router.get('/test',(req,res)=>{
    res.json({msg:"posts Work"})
})
//Load Validation
const validatePostInput = require('../../validation/post');

//@route    GET api/posts
//@desc     get post
//@access   PUBLIC
router.get('/',(req,res)=>{
    Post.find()
        .sort({date : -1})
        .then(post => res.json(post))
        .catch(err => res.status(404).json({nopostfound : "No posts found"}));
})

//@route    GET api/posts/:id
//@desc     get post by id
//@access   PUBLIC
router.get('/:id',(req,res)=>{
    Post.findById(req.params.id)
        .then(post => res.json(post))
        .catch(err => res.status(404).json({nopostfound : "No post found with that id"}));
})

//@route    POST api/posts
//@desc     create post
//@access   PRIVATE
router.post('/',passport.authenticate('jwt',{session : false}),(req,res)=>{
    //check validation
    const {errors,isValid} = validatePostInput(req.body);
    if(!isValid){
        return res.status(400).json(errors);
    }
    const newPost = Post({
        text : req.body.text,
        name : req.body.name,
        user : req.body.user,
        avatar : req.body.avatar
    })
    newPost.save().then(post => res.json(post));
})

//@route    DELETE api/posts
//@desc     delete post by id
//@access   PRIVATE
router.delete('/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({id : req.user.id})
        .then(profile =>{
            Post.findById(req.params.id)
                .then(post =>{
                    //check for post owner
                    if(post.user.toString() !== req.user.id){
                        return res.status(401).json({notauthorised : "User not authorised"});
                    }
                    post.remove().then(()=> res.json({success : true}))
                })
                .catch(err =>{
                    res.status(404).json({postnotfound : "No post found"});
                })
        })    
})

//@route    POST api/posts/like/:id
//@desc     Like post
//@access   PRIVATE
router.post('/like/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({id : req.user.id})
        .then(profile =>{
            Post.findById(req.params.id)
                .then(post =>{
                    if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
                        return res.status(400).json({alreadyliked : "User already liked this post"});
                    } 
                    //Add user id to likes array
                    post.likes.unshift({user : req.user.id})
                    
                    post.save().then(post => res.json(post))
                })
                .catch(err =>{
                    res.status(404).json({postnotfound : "No post found"});
                })
        })    
})

//@route    POST api/posts/unlike/:id
//@desc     unLike post
//@access   PRIVATE
router.post('/unlike/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({id : req.user.id})
        .then(profile =>{
            Post.findById(req.params.id)
                .then(post =>{
                    if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
                        return res.status(400).json({notliked : "You have not yet liked this post"});
                    } 
                    //find remove index
                    const removeIndex = post.likes.map(item =>{
                        item.user.toString().indexOf(req.user.id);
                    })
                    //splice out of array
                    post.likes.splice(removeIndex,1);

                    //save
                    post.save().then(post => res.json(post));
                })
                .catch(err =>{
                    res.status(404).json({postnotfound : "No post found"});
                })
        })    
})

//@route    POST api/posts/comment/:id
//@desc     comment to a  post
//@access   PRIVATE
router.post('/comment/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    //check validation
    const {errors,isValid} = validatePostInput(req.body);
    if(!isValid){
        return res.status(400).json(errors);
    }
    Post.findById(req.params.id)
        .then(post =>{
            const newCom = {
                text : req.body.text,
                name : req.body.name,
                avatar : req.body.avatar,
                user : req.body.user
            }
            //Add comment to 
            post.comments.unshift(newCom);
            //save post
            post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({postnotfound : "No post found"}))
})

//@route    POST api/posts/comment/:id/:comment_id
//@desc     delete comment
//@access   PRIVATE
router.delete('/comment/:id/:comment_id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Post.findById(req.params.id)
        .then(post =>{
            //check to see if comment exists
            if(post.comments.filter(comment => comment._id.toString() 
            === req.params.comment_id).length === 0){
                return res.status(404).json({commentnotexist : "Comment does not exist"});
            }
            //get remove index
            const removeIndex = post.comments
                .map(item => item._id.toString())
                .indexOf(req.params.comment_id);
                
            //splice out of array
            post.comments.splice(removeIndex,1);
            //save post
            post.save().then(post =>res.json(post));

        })
        .catch(err => res.status(404).json({postnotfound : "No post found"}))
})

module.exports = router;