'use strict';
require('./lib/mock.env.js');

const mongoose = require('mongoose');
const Promise = require('bluebird');
const User = require('../models/user.js');
let server = require('../server.js');
var jwt = require('jsonwebtoken');

const expect = require('chai').expect;
const superagent = require('superagent');
const serverControl = require('./lib/serverControl.js');

mongoose.Promise = Promise;

const url = `http://localhost:${process.env.PORT}`;

const exampleUser = {
    fullname: 'Cool boy',
    email: 'rpcvjet@gmail.com',
    password: 'isacodeboss',
    password_confirm: 'isacodeboss',
  };


//******USER ROUTE TESTS****** */

describe('Testing auth route ', function() {
    before( done => {
        serverControl.startServer(server, done)
    });  
   
    after( done => {
        serverControl.turnoffServer(server, done)
    });
    
        
    describe('testing auth route', () => {                 
        after(done => {
            User.findOneAndDelete({email: exampleUser.email})
            .then(() => done())
            .catch(done);
        });
        describe('has a valid body', () => {
            it('should have a 200 status', done => {
                superagent.post(`${url}/api/signup`)
                .send(exampleUser)
                .then( res => {
                    expect(res.status).to.equal(200);
                    expect(res.text).to.be.a('string')
                    done();
                })
                .catch(done);
            })
         
        })
        describe('testing loggin in', () => {
            it('should return a token', done => {
                superagent.post(`${url}/api/login`)
                .send({"email":exampleUser.email,"password": exampleUser.password})
                .then( res => {
                    expect(res.status).to.equal(200)
                    done()
                })
                .catch(done)
            })
            it('testing the wrong password', done => {
                superagent.post(`${url}/api/login`)
                .send({"email":exampleUser.email,"password": "sdfsdfsd"})
                .end( (err,res) => {
                    expect(res.status).to.equal(400)
                    done()
                })
            })
        })
        describe('testing forgot email', () => {
            it('should find user in database and send email', done => {
                superagent.post(`${url}/api/forgot`)
                .send({email: exampleUser.email})
                .then( res => {
                   expect(res.status).to.equal(200);
                   done()
                })
                .catch(done)
            })
            it('should return a 400 error', done => {
                 superagent.post(`${url}/api/forgot`)
                .send({email: "something@gmail.com"})
                .end( (err,res) => {
                    expect(res.status).to.equal(400)
                    done()
                })
              
            })
        })
    })

})
