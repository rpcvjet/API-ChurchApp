'use strict';

require('dotenv').config();
const config = require('./database');
const debug = require('debug')('churchapp:server');
const mongoose = require('mongoose')
const express = require('express');
const passport = require('passport');
const morgan = require('morgan');
const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require ('cors');    
// const  { sequelize } = require('./models');
const User = require('./models/user'); 
const PORT = process.env.PORT;

const app = express();

//middleware
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
// initialize cookie-parser to allow us access the cookies 
//stored in the browser. 
app.use(cookieParser());


mongoose.connect(config.DB, { useNewUrlParser: true }).then(
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



module.exports = server;

