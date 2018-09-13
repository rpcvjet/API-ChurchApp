'use strict';
require('./mock.env');
const server = require('../../server');
const serverControl = module.exports = {};

let myserver;

serverControl.startServer = (done) => {
    if(!server.isRunning)
        return myserver =  server.listen(process.env.PORT, () => {
            server.isRunning = true;
            console.log('testing server is up');
            done();
        });
    
    console.log("testing server already up")
    done();
}

serverControl.turnoffServer = function(done){
        if(server.isRunning)
           return server.close( () => {
                server.isRunning = false;
                console.log('testing server is DOWN');
                done();
            })       
        done();
}

module.exports = serverControl;