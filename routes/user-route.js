'use strict';
const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const db = require('../database.js');
const UserRouter  = new Router();
const bearerAuth = require('../config/middleware/bearer-auth');
const debug = require('debug')('churchapp:user-route');



  //GET ROUTES//
  //get all users
UserRouter.get('/api/users/', bearerAuth, jsonParser, function(req, res, next){
  db.any('SELECT * FROM Users')
  .then((data) => {
    res.status(200)
    .json({data:data});
  })
    .catch((err) => {
      return next(err)
    })
})

//get user by id
UserRouter.get('/api/users/:id', jsonParser, function(req, res, next){
  let UserId = parseInt(req.params.id)
  db.any('SELECT * FROM Users WHERE userid = $1', UserId)
  .then((data) => {
    res.status(200)
    .json({data:data});
  })
    .catch((err) => {
      return next(err);
    })
})
//get single user's points
UserRouter.get('/api/users/points/:id',jsonParser, function(req, res, next){
  let UserId = parseInt(req.params.id)
  db.any('SELECT COUNT(*) from Users WHERE userid = $1',UserId)
  .then((data) => {
    res.status(200)
    .json({data:data})
  })  
    .catch((err) => {
      return next(err);
    })
})
//*************POST ROUTES***************//
//sign up a new user
UserRouter.post('/api/users/signup', jsonParser, function(req, res, next){
  console.log('request body--->',req.body)
  let fullname = req.body.fullname;
  let totalpoints = req.body.totalpoints = parseInt(0);
  let accesspassword = req.body.accesspassword;
  let email = req.body.email;
  let userrole = req.body.userrole = 'USER'; 
  db.none('INSERT into Users (fullname, totalpoints, accesspassword, email, userrole)' + 
         'VALUES (${fullname}, ${totalpoints}, ${accesspassword}, ${email}, ${userrole})', req.body)
  .then( () => {
    res.status(200)
    .json({
      message: 'New User Inserted'
    })
  })
  .catch( (err) => {
    return next(err);
  })
});
//*********UPDATE ROUTE****************
//update a users profile
UserRouter.put('/api/users/update/:id', jsonParser, function (req, res, next) {
  console.log('req.body--->',req.body)
  db.none('UPDATE Users SET fullname=$1, totalpoints=$2, accesspassword=$3 where userid=$4', 
  [req.body.fullname, req.body.totalpoints, req.body.accesspassword, parseInt(req.params.id)])
  .then(function () {
    res.status(200)
    .json({
      message: 'User has been updated'
    })
  }) 
  .catch((err) => {
    return next (err);
  })
})

//*********DELETE ROUTE****************
//delete a singular user
UserRouter.delete('/api/users/delete/:id', jsonParser, function (req, res, next) {
  let UserId = parseInt(req.params.id)  
  db.result ('DELETE from Users WHERE userid = $1', UserId)
  .then((result) => {
    res.status(200)
    .json({
      message: `Removed ${result.rowCount} User`})
  })
  .catch((err) => {
    return next (err)
  })
})

module.exports = UserRouter;






