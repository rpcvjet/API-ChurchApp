'use strict';
const Act = require('../../models/acts');

module.exports = function(done) {

    new Act({
        description: 'Cool boy',
        typeofact: 'Kindness',
        userid: this.tempUser._id.toString()
    })
    .save()
    .then(act => {
        this.tempAct = act;
        done()
    })
    .catch(done)
}