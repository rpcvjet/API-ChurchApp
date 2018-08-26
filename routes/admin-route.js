'use strict';
const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const Act = require('../models/acts');

const AdminRouter  = new Router();
const db = require('../database.js');

//GET TOTAL NUMBER OF ACTS for entire database
AdminRouter.get('/api/admin/totalpoints', function(req, res, next){
  console.log('req.body', req.body)
  Act.count({})
  .then( alltheacts => res.json(alltheacts))
  .catch(err => next(createError(404, err.message)))
})

module.exports = AdminRouter;



