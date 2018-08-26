'use strict';
const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const db = require('../database.js');
const passport = require('passport');
const createError = require('http-errors');

const UserRouter  = new Router();
const debug = require('debug')('churchapp:user-route');
const User = require('../models/user');



  //GET ROUTES//

  //get all users
UserRouter.get('/api/users/', function(req, res, next){
  User.find({})
  .then(users => res.json(users))
  .catch(err => next(createError(404, err.message)))
})

//get user by id
UserRouter.get('/api/users/:id', function(req, res, next){
  User.findById(req.params.id)
  .then( singleuser => res.json(singleuser))
  .catch(err => next(createError(404, err.message)))
})



module.exports = UserRouter;






