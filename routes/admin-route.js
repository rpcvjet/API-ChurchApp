'use strict';
const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const AdminRouter  = new Router();
const db = require('../database.js');



//GET ROUTE
AdminRouter.get('/api/admin/totalpoints', jsonParser, function(req, res, next){
  db.any('select sum(totalpoints) from users')
  .then((data) => {
    res.status(200)
    .json({data:data})
  })  
    .catch((err) => {
      return next(err);
    })
})

module.exports = AdminRouter;



