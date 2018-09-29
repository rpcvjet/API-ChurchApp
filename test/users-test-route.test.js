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

describe('Testing USER ROUTE ', function() {
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

    describe('Testing api/users/ route', function() {
        beforeEach(Usermock.bind(this));
        
        it('should return all of 1 user', done => {
         superagent.get(`${url}/api/users/`)
         .then(res => {
             expect(res.status).to.equal(200);
             expect(res.body.length).to.equal(1)
            done()
         })
         .catch(done)
        })
        it('should return user with properid', done => {
            superagent.get(`${url}/api/users/${this.tempUser._id}`)
            .then(res => {
                expect(res.status).to.equal(200);
                expect(res.body._id).to.equal(this.tempUser._id.toString());
                done()
            })
            .catch(done)
           })       
        it('should return an error with userid', done => {
            superagent.get(`${url}/api/users/1234`)
            .end((err, res) => {
                expect(res.status).to.equal(404);
               done()
            })
        })
    })

})