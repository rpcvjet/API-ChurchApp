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
    
    describe('POST: testing act route', function(){
        before(Usermock.bind(this));
        it('should add an act to the user', done => {
             superagent.post(`${url}/api/acts/create`)
            .send({
                description: 'i did a nice thing',
                typeofact: 'Witness',
                userid: this.tempUser._id.toString()
            })
            .then(res=> {
                expect(res.status).to.equal(200);
                done();
              })
              .catch(done);
        })
        
    })
    //***GET TESTING */
    describe('GET: testing get routes', function() {
        beforeEach(Usermock.bind(this));
        beforeEach((done) => {
         new Act({
            description: 'i did a nice thing',
            typeofact: 'Witness',
            userid: this.tempUser._id.toString()
        })
        .save()
        .then(act => {
            this.fakeAct = act;
            done()
        })
        .catch(done)
     })
        it('should return an act by userid', done => {
            superagent.get(`${url}/api/acts/${this.tempUser._id}`)
            .then(res => {
               
                expect(res.status).to.equal(200);
                expect(res.body[0].description).to.equal('i did a nice thing');
                expect(res.body[0]._id).to.equal(this.fakeAct._id.toString());
                expect(res.body[0].typeofact).to.equal('Witness');
                done()
            })
            .catch(done)
        })
        it('should respond with an error', done => {
            superagent.get(`${url}/api/acts/1234`)
            .end((err,res) => {
                expect(res.status).to.equal(404)
                done()
            })
        })
        it('should return all act', done => {
            superagent.get(`${url}/api/acts/`)
            .then(res => {
                expect(res.status).to.equal(200)
                done()
            })
        })
        it('should return 1 act', done => {
            superagent.get(`${url}/api/acts/total/${this.tempUser._id}`)
            .then(res => {
                expect(res.body).to.equal(1)
                done()
            })
        })

    })

  })
 
