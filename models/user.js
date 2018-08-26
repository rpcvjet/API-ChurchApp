const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../database');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    fullname: { type: String,required: true},
    email: {type: String,required: true},
    password: { type: String,required: true},
    acts: [{type:Schema.Types.ObjectId, ref: 'Acts'}]
});

// const User = 
module.exports = mongoose.model('User', UserSchema);

// module.exports.getUserById = function(id, callback) {
//     User.findById(id, callback);
// }


// module.exports.getUserByEmail = function(email, callback) {
//     console.log('email', email)
//     const query = { email: email}
//     User.findOne(query, callback);
// }

// module.exports.addUser = function(newUser, callback) {
//     bcrypt.genSalt(10, (err,salt) => {
//         bcrypt.hash(newUser.password, salt, (err, hash) => {

//             if(err) throw err;
//             newUser.password = hash;
//             newUser.save(callback);
//         });
//     });
// }

module.exports.comparePassword = function(candidatePassword, hash, callback) {
    console.log('candidatePassword',candidatePassword)
    console.log('hash',hash)
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if(err) throw err;
        callback(null, isMatch);
    })
}