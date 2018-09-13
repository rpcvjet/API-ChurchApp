'use strict';

require('./lib/mock.env');

const expect = require('chai').expect;
const superagent = require('superagent');
const User = require('../models/user');
const baseURL = process.env.API_URL
let server = require('../server');
const serverControl = require('./lib/serverControl');
var jwt = require('jsonwebtoken');


//******USER ROUTE TESTS****** */

describe('Testing user route', function() {
    
    before(serverControl.startServer)  
})


    after(serverControl.turnoffServer);
    after((done) => {
        User.remove({})
        .then( () => done())
        .catch(done)
    })

describe('testing login route', function() {


    it('should respond with JWT when authenticated', function(done) {
        superagent.post(`${baseURL}/api/login`)
        .send({"email": `${process.env.EMAIL}`,"password": `${process.env.WEBSITEPASSWORD}`})
        .then(res => {
            console.log('res', res.body)
            expect(res.status).to.equal(200);
            expect(Boolean(res.text)).to.equal(true);
            done()

        })
        .catch(done);

    })
    it('should respond with a 401 error', (done) => {
        superagent.post(`${baseURL}/api/login`)
        .then(done)
        .catch(err=> {
          expect(err.status).to.equal(400);
          done();
        })
          .catch(done);
      });
})
