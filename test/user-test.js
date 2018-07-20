'use strict';
require('./lib/mock.env');
const debug = require('debug')('churchapp:user-test');
const server = require ('../server');
const expect = require('chai').expect;
const serverControl = require('./lib/serverControl')
const baseURL = `http://localhost:${process.env.PORT}`;
const superagent = require('superagent');
const db = require('../database')
/**********************************POST TESTING****************************/


describe('smoke test of server', function (){
    before(serverControl.startServer)
    after(serverControl.turnoffServer)
    
    it('server should exist',() => {
        debug('smoke test')
        expect(server).to.exist;
    });
    
    //******************************GET ROUTES**************************
    describe('testing GET ROUTE', function (){
        describe('testing get route', function (){
        it('should return all users', ()=>{
            debug('testing get all users route')
            superagent.get(`${baseURL}/api/users`)
            .then(res => {
                db.any('SELECT * from Users')
                expect(res.status).to.equal(200);
            })
            .catch();
            })
        
        })

    })
})
