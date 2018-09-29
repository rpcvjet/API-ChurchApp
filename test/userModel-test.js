const mongoose = require('mongoose');
var expect = require('chai').expect;
const User = require('../models/user.js');

describe('user', function(){
    it('should be invalid if name is empty', done => {
        let u = new User();
        u.validate(function(err) {
            expect(err.errors.name).to.not.exist;
            done()
        })
    })
})