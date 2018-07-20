'use strict';
const debug = require('debug')('churchapp:bearer-auth-middleware');
const createError = require('http-errors');
const jwt = require('jsonwebtoken');



module.exports = function (req, res, next) {

    debug('bearer-auth-middleware');
    
        const authorization = req.headers["authorization"];
       
        let token = authorization.split('Bearer ')[1];    
      
        jwt.verify(token, process.env.APP_SECRET, function(err, data) {
            if (err) {
              console.log(err)
              res.sendStatus(403);
            } else {
              res.json({
                data: data
              });
            }
          });
 
}
