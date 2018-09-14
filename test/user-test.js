'use strict';


const User = require('../models/user');
let server = require('../server');
var jwt = require('jsonwebtoken');

require('./lib/mock.env.js');
const expect = require('chai').expect;
const superagent = require('superagent');
const baseURL = process.env.API_URL
const serverControl = require('./lib/serverControl');


//******USER ROUTE TESTS****** */

describe('Testing user route', function() {
    before(serverControl.startServer);  
    after(serverControl.turnoffServer);
    
        
    describe('testing login route', () => {                 
        it('should respond with JWT when authenticated',(done) => {
        superagent.post(`${baseURL}/api/login`)
        .send({"email": `${process.env.EMAIL}`,"password": `${process.env.WEBSITEPASSWORD}`})
        .then(res => {
            console.log('res', res.body)
            expect(res.status).to.equal(200);
            expect(Boolean(res.text)).to.equal(true);
            done();

        })
        .catch(done);

    })
        it('should respond with a 400 error', (done) => {
            superagent.post(`${baseURL}/api/login`)
            .then(done)
            .catch(err=> {
            expect(err.status).to.equal(400);
            done();
            })
            .catch(done);
        });

    })

})
