'use strict';

const mongoose = require('mongoose');
const User = require('./user');
const createError = require('http-errors');

const Schema = mongoose.Schema;

const ActsSchema = new Schema({

    description:{type: String,required: true}, 
    typeofact: {type: String, required: true},
    userid: [{type: Schema.Types.ObjectId, ref: 'User'}]


})

ActsSchema.pre('save', function(next) {

    User.findById(this.userid)
    .then(user => {
        user.acts.push(this._id);
        return user.save();
    })
    .then(() => next())
    .catch(err => next(createError(404, err.message)))



})

const Act = module.exports = mongoose.model('Acts', ActsSchema)

module.exports.getActById = function (id, callback) {
    Act.findById(id, callback)
}