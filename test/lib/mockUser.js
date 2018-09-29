'use strict';
const bcrypt = require('bcrypt');
const User = require('../../models/user');

module.exports = function(done) {

    const newUser = new User({
        fullname: 'Cool boy',
        email: 'myemail@gmail.com',
        password: 'isacodeboss',
    })
    bcrypt.genSalt(10, (err, salt) => {
        if(err) console.error('There was an error', err);
        else {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if(err) console.error('There was an error', err);
                else {
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => {
                            this.tempUser = user
                            done()
                        })
                        .catch(done)                      
                }
            })       
        }
    })
}