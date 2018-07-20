'use strict';
const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const jwt = require('jsonwebtoken');
const debug = require('debug')('churchapp:auth-route');


const db = require('../database');
const AuthRouter  = new Router();


AuthRouter.post('/api/login', jsonParser, function (req, res, next) {
    let email = req.body.email;
    let accesspassword = req.body.accesspassword;
    db.one ('SELECT * from Users WHERE email = $1 AND accesspassword =$2', [email, accesspassword])
    .then((user => {
       const payload = {user: user}
       const token = jwt.sign(payload, process.env.APP_SECRET, { expiresIn: '6h' })    
       if(res.status(200)){
        
           delete payload.user.accesspassword;
       }
       res.json({token: token,
                 payload})   
    }))
    .catch(err => {
        if(err.received === 0){
            res.status(401)
            res.json({message:'There was an error in your request. Please try again.'})
        }
        return next (err);
    }) 
})




module.exports = AuthRouter;
