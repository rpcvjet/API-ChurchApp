const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = require('../models/user');
const config = require('../database');

const opts = {}; 

opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';

module.exports = passport => {
    
    passport.use(new JWTStrategy(opts, (jwt_payload, done) => {
        console.log('opts', opts)
        User.getUserById(jwt_payload._id), (err, user) => {
            if(err) {
                return done(err, false);
            }

            if(user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        }            
    }));
}
    
