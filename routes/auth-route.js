'use strict';
const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const passport = require('passport');
const debug = require('debug')('churchapp:auth-route');
const config = require('../database');
const AuthRouter  = new Router();

const validateRegisterInput = require('../config/validation/register-validation');
const validateLoginInput = require('../config/validation/login-validation');

const User = require('../models/user')


//sign up a new user
AuthRouter.post('/api/signup', jsonParser, function(req, res){
    console.log('request body--->',req.body)
    const { errors, isValid } = validateRegisterInput(req.body);

    if(!isValid) {
        console.log('errors', errors)
        return res.status(400).json(errors);
    }
    User.findOne({
        email: req.body.email
    }).then(user => {
        if(user) {
            
            return res.status(400).json({
                email: 'Email already exists'
            });
        }
        else {
            const newUser = new User({
                fullname: req.body.fullname,
                email: req.body.email,
                password: req.body.password,
                
            });
            
            bcrypt.genSalt(10, (err, salt) => {
                if(err) console.error('There was an error', err);
                else {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) console.error('There was an error', err);
                        else {
                            newUser.password = hash;
                            newUser
                                .save()
                                .then(user => {
                                    res.json(user)
                                }); 
                        }
                    });
                }
            });
        }
    });
});

   
   

AuthRouter.post('/api/login', jsonParser, function (req, res) {
    console.log('req.body', req.body)
    
    const { errors, isValid } = validateLoginInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;
    
    User.findOne({email})
    .then(user => {
        if(!user) {
            errors.email = 'User not found'
            return res.status(404).json(errors);
        }
        bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(isMatch) {
                        const payload = {
                            _id: user.id,
                            fullname: user.fullname,
                        }
                        jwt.sign(payload, 'secret', {
                            expiresIn: 3600
                        }, (err, token) => {
                            if(err) console.error('There is some error in token', err);
                            else {
                                res.json({
                                    success: true,
                                    token: `Bearer ${token}`
                                });
                            }
                        });
                    }
                    else {
                        errors.password = 'Incorrect Password';
                        return res.status(400).json(errors);
                    }
                });
    });
});

//profile
AuthRouter.get('/api/profile', passport.authenticate('jwt', {session:false}), (req, res,next) => {
    res.json({user: req.user})
});


module.exports = AuthRouter;






