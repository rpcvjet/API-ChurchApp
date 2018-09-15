'use strict';

module.exports = exports =  {};



exports.startServer = function(server, done) {
    if(!server.isRunning) {
         server.listen(process.env.PORT, () => {
            server.isRunning = true;
            console.log("Server up!")
            done();
        });
        return;
    }   
        done();
};

exports.turnoffServer = function(server, done){
    if(server.isRunning) {
        server.close( () => {
                server.isRunning = false;
                console.log('testing server is DOWN');
                done();
            });       
        return;
    }
        done();
};