'use strict';

require('dotenv').config();
const db = require('./database');
const debug = require('debug')('churchapp:server');
const express = require('express');
const morgan = require('morgan');
const bodyParser   = require('body-parser');
const cors = require ('cors');     
const PORT = process.env.PORT;

const app = express();

//middleware
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
//routes
app.use(require('./routes/user-route.js'));
app.use(require('./routes/admin-route.js'));
app.use(require('./routes/acts-route.js'));
app.use(require('./routes/auth-route.js'));


app.use(function(err, req,res,next){
    console.log(err)
    if(err.status){
        res.status(err.status).send();
        return;
    }
})

const server = app.listen(PORT, () => {
    debug('server starting here')
    console.log( 'server up on port:', PORT);
})


module.exports = server;

