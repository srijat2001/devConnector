const JwtStratergy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
import mongoose from 'mongoose';
import passport from 'passport';
const User = mongoose.model('users');
const props = require('../config/properties');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = props.secretOrkey;

module.exports = passport => {
    passport.use(
        new JwtStratergy(opts,(jwt_payload,done)=>{
            User.findById(jwt_payload.id)
                .then(user =>{
                    if(user){
                        return done(null,user);
                    }
                    return done(null,false);
                })
                .catch(err =>{
                    if(err) console.log(err);
                })
        })
    );
};
