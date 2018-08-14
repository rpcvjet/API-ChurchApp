const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const db = require('../database.js');
const ActsRouter = new Router();
const debug = require('debug')('churchapp:acts-route');



//GET ROUTES
ActsRouter.get('/api/acts/:id', jsonParser, function(req, res, next){
    let UserId = parseInt(req.params.id)
    db.any('SELECT * FROM acts WHERE userid = $1', UserId)
    .then((data) => {
      res.status(200)
      .json({data:data});
    })
      .catch((err) => {
        return next(err);
      })
  });

  ActsRouter.get('/api/acts/', jsonParser, function(req, res, next){
    let UserId = parseInt(req.params.id)
    db.any('SELECT * FROM acts')
    .then((data) => {
      res.status(200)
      .json({data:data});
    })
      .catch((err) => {
        return next(err);
      })
  });


//GET TOTAL NUMBER OF ACTS BY USERID
ActsRouter.get('/api/acts/total/:id', jsonParser, function(req, res, next){
  let UserId = parseInt(req.params.id)
  db.any('select count(*) from acts where userid = $1', UserId)
  .then((data) => {
    res.status(200)
    .json({data})
  })
  .catch((err) => {
    return next(err)
  })
})


//Update TOTAL ACT COUNT BY USERID
ActsRouter.put('/api/acts/update/:id', jsonParser, function(req, res, next){
    let UserId = parseInt(req.params.id)
    db.any('Update users set totalpoints = (select count(*) from acts where userid = $1) where userid = $1', UserId)
    .then((data) => {
      res.status(200)
      .json({data:data});
    })
      .catch((err) => {
        return next(err);
      })
  });

//POST ROUTES
//add a new act to a user
ActsRouter.post('/api/acts/create', jsonParser, function(req, res, next){
   
  let description = req.body.description
  let typeofact = req.body.typeofact
  let userid = req.body.description

  console.log('req.body--->',req.body)
    db.none('INSERT into acts (description, typeofact, userid)' + 
           'VALUES (${description}, ${typeofact}, ${userid})', req.body)
    .then( () => {
      res.status(200)
      .json({
        message: 'New Act Inserted'
      })
    })
    .catch( (err) => {
      return next(err);
    })
  });

  //DELETE ROUTE
ActsRouter.delete('/api/acts/delete/:id', jsonParser, function (req, res, next) {
    let ActsId = parseInt(req.params.id)  
    db.result ('DELETE from acts WHERE actsid = $1', ActsId)
    .then((result) => {
      res.status(200)
      .json({
        message: `Removed ${result.rowCount} Act`})
    })
    .catch((err) => {
      return next (err)
    })
  })

  //*********UPDATE ROUTE****************
ActsRouter.put('/api/acts/update/:id', jsonParser, function (req, res, next) {
    console.log('req.body--->',req.body)
    db.none('UPDATE acts SET description=$1, typeofact=$2 where actsid=$3', 
    [req.body.description, req.body.typeofact, parseInt(req.params.id)])
    .then(function () {
      res.status(200)
      .json({
        message: 'Act has been updated'
      })
    }) 
    .catch((err) => {
      return next (err);
    })
  })

  module.exports = ActsRouter;





