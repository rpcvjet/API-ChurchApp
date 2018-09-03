'use strict';

const server = require('../../server');
const serverControl = {};

serverControl.startServer = function(done) {
    before(done =>  {
        if(!server.isRunning){
            server.listen(process.env.PORT, () => {
                server.isRunning = true;
                console.log('testing server is up');
                done();
            });
            return;
        }
        console.log("testing server already up")
        done();
    })
    done();
}

serverControl.turnoffServer = function(done){
    after(done => {
        if(server.isRunning){
            server.close( () => {
                server.isRunning = false;
                console.log('testing server is DOWN');
                done();
            })
            return;
        }
        done();
    })
    done();
}

module.exports = serverControl;