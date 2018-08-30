'use strict';
const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const async = require('async');
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

//forgot password
AuthRouter.post('/api/forgot', jsonParser, (req, res, next) => {

    async.waterfall([
        function(done){
            crypto.randomBytes(20, (err, buf) => {
                let token = buf.toString('hex');
                done(err, token);
            })
        },
        function(token, done) {
                            //this is the email in the form
            User.findOne({email: req.body.email}, (err, user) => {
                if(!user) {
                    return res.json('No account with that email address exists. Please try again.')
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000;

                user.save( (err) => {
                    done(err, token, user)
                })
            })
        },
        function(token, user, done) {
            let smtpTransport = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                service:'gmail',
                auth: {
                    user: 'kenneth.ashley@gmail.com',
                    pass: process.env.GMAILPW
                }
            });

            let mailOptions = {
                to: user.email,
                from:'kae2141@columbia.edu',
                subject: 'ChurchApp Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://localhost:3000/reset/' + token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                       
            }
            
            smtpTransport.sendMail(mailOptions, function(err) {
                console.log('mail sent');
                res.status(200).json( { message: 'An e-mail has been sent to ' + user.email + ' with further instructions.'});
                done(err, 'done');
              });
        }
    ], function (err) {
        if(err) return next(err)
    }


)
});

//after user clicks link in email -- renders reset password form
AuthRouter.get('/api/reset/:token', (req, res) => {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() }}, (err, user) => {
        if(!user) {
            res.json('Password rest token is invalid or has expired');
        }
        
        res.json({
            token: req.params.token,
            token
        })
    })
})

//user sends new password
AuthRouter.post('/api/reset', jsonParser, (req, res, next) => {
    let { resetToken, newPassword} = req.body;
    async.waterfall([
        function(done) {
            User.findOne({ resetPasswordToken: resetToken}, (err, user) => {
                if(!err){
                    let now = new Date().getTime();

                    let keyExpiration = user.resetPasswordExpires;
                    if(keyExpiration > now) {

                        user.password = bcrypt.hashSync( newPassword, 10);
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpires = undefined;
                        user.save( (err) => {
                            done(err, user)
                        })              
                    }    
                }
            });
        },
        function( user,done ) {

            let smtpTransport = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
              auth: {
                user: 'kenneth.ashley@gmail.com',
                pass: process.env.GMAILPW
              }
            });
            let mailOptions = {
                to: user.email,
                from: 'kenneth.ashley@gmail.com',
                subject: 'Your password has been changed',
                text: 'Hello,\n\n' +
                  'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
              };
              smtpTransport.sendMail(mailOptions, (err) => {
                  if(err) {
                      res.status(400).json({message: "There was an error sending your confirmation email"})
                  }
                res.status(200).json({message: "You password has been reset. You will get a confirmation email"})
                done(err);
            })
            }
    ],function (err) {
        if(err) return next(err)
    })
})



module.exports = AuthRouter;






