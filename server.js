'use strict';

require('dotenv').config();
const CONNECTION_URI = process.env.MONGODB_URI || 'mongodb://heroku_61tzst62:2sgvufsr0jqu2pb0d3kvsmlh4j@ds143932.mlab.com:43932/heroku_61tzst62'
const debug = require('debug')('churchapp:server');
const mongoose = require('mongoose')
const express = require('express');
const passport = require('passport');
const morgan = require('morgan');
const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require ('cors');    
const User = require('./models/user'); 
const PORT = process.env.PORT || 4000

const app = express();

//middleware
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
// initialize cookie-parser to allow us access the cookies 
//stored in the browser. 
app.use(cookieParser());


mongoose.connect(CONNECTION_URI, { useNewUrlParser: true }).then(
    () => {console.log('Database is connected') },
    err => { console.log('Can not connect to the database'+ err)}
);




//routes
app.use(require('./routes/user-route.js'));
app.use(require('./routes/admin-route.js'));
app.use(require('./routes/acts-route.js'));
app.use(require('./routes/auth-route.js'));


//passport

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);


app.use(function(err, req,res,next){
    console.log(err)
    if(err.status){
        res.status(err.status).send();
        return;
    }
})


    
  const server =  app.listen(PORT, () => {
        debug('server starting here')
        console.log( 'server up on port:', PORT);
    })

server.isRunning = true;


module.exports = server;

