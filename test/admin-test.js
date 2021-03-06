'use strict';
require('./lib/mock.env.js');

const mongoose = require('mongoose');
const Promise = require('bluebird');
const Act = require('../models/acts.js');
const User = require('../models/user.js');
let server = require('../server.js');
var jwt = require('jsonwebtoken');
const Usermock = require('./lib/mockUser');
const mockAct = require('./lib/mockAct');

const expect = require('chai').expect;
const superagent = require('superagent');
const serverControl = require('./lib/serverControl.js');

mongoose.Promise = Promise;

const url = `http://localhost:${process.env.PORT}`;



  describe('Testing POST /api/acts/create ', function() {
    before( done => {serverControl.startServer(server, done)});   
    after( done => {serverControl.turnoffServer(server, done)});
    
    afterEach((done) => {
        Promise.all([
            User.remove({}),
            Act.remove({})
        ])
        .then( () => done())
        .catch(done);
    });
    
    describe('Testing admin route', function() {
        beforeEach(Usermock.bind(this));

        beforeEach(mockAct.bind(this));
        beforeEach(mockAct.bind(this));
        beforeEach(mockAct.bind(this));
  
        it('should return total points of 1', done => {
            superagent.get(`${url}/api/admin/totalpoints`)
            .then(res => {      
                expect(res.body).to.equal(3);
                done()
            })
            .catch(done)
        })
    })

  })
 





