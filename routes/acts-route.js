const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const db = require('../database.js');
const ActsRouter = new Router();
const Act = require('../models/acts');
const User = require('../models/user');
const debug = require('debug')('churchapp:acts-route');


//POST ROUTES
//add a new act to a user
ActsRouter.post('/api/acts/create', jsonParser, function(req, res, next){

    let newAct = new Act();
  
    newAct.description = req.body.description;
    newAct.typeofact = req.body.typeofact;
    newAct.userid = req.body.userid;
  
    newAct.save(function(err) {
      if(err){
        return next(err);
      }      
      Act.find().populate('User').exec(function(err, newAct) {
        if(err) {
          next(err)
        }
        res.json(newAct)
  
      })

  })
});


//GET ROUTES

// getallacts
ActsRouter.get('/api/acts/', function(req, res, next){
  User.aggregate([
    {
      $match: {
        "acts": {$exists: true }
      }
    },
    {
      $lookup : {
        from :"acts",
        localField: "_id",
        foreignField:'userid',
        as: "useracts"
      }
    }
  ])
  .then(acts => res.json(acts))
  .catch(err => next(createError(404, err.message)))
});

//get all acts by userid
ActsRouter.get('/api/acts/:id', jsonParser, function(req, res, next){
  
  Act.find({userid: req.params.id}).sort({_id: -1})
  .then( allacts => res.json(allacts))
  .catch(err => next(createError(404, err.message)))
  });



//GET TOTAL NUMBER OF ACTS per user
ActsRouter.get('/api/acts/total/:id', function(req, res, next){
  Act.count({userid: req.params.id})
  .then( totalactsbyperson => res.json(totalactsbyperson))
  .catch(err => next(createError(404, err.message)))
})

module.exports = ActsRouter;
