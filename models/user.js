const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../database');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    fullname: { type: String,required: true},
    email: {type: String,required: true, unique: true},
    password: { type: String,required: true},
    acts: [{type:Schema.Types.ObjectId, ref: 'Acts'}],
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    createdAt: {
        type:Date,
        required: false

    },
    updatedAt: {
        type: Number,
        required: false
    }
});

module.exports = mongoose.model('User', UserSchema);

module.exports.comparePassword = function(candidatePassword, hash, callback) {
  
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if(err) throw err;
        callback(null, isMatch);
    })
}