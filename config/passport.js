const bcrypt = require('bcrypt');
var passport = require('passport');
var LocalStrategy  = require('passport-local').Strategy;
const User = require('./model');


module.exports = (passport) => {

  passport.serializeUser(function(user, done) {
      console.log(user.u_id +" was seralized");
      done(null, user.u_id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
      console.log(id + "is deserialized");
    User.findById(id, function(err, user) {
          done(err, user);
    });
  });

//************LOCAL SIGN UP***************//

  passport.use('local-signup', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField : 'username',
      passwordField : 'accesspassword',
      passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, email, password, done) {

      // asynchronous
      // User.findOne wont fire unless data is sent back
    process.nextTick(function(callback) {


          // find a user whose email is the same as the forms email
          // we are checking to see if the user trying to login already exists
      User.findOne(email, function(err, isNotAvailable, user) {
              //console.log('userfound: ' + isNotAvailable);
              // if there are any errors, return the error
        if (err)
          return done(err);
              //if (){
              //
              //}

              // check to see if theres already a user with that email
            if (isNotAvailable == true) {
                  //console.log(user.email +' is not available');
                  return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
              } else {
                  console.log('new local user');

                  // if there is no user with that email
                  // create the user
                  user = new User();
                  // set the user's local credentials

                  user.email    = req.body.username;
                  user.password = req.body.accesspassword;
                  //newUser.photo = 'http://www.flippersmack.com/wp-content/uploads/2011/08/Scuba-diving.jpg';

                  user.save(function(newUser) {
                      console.log("the object user is: ", newUser);
                      passport.authenticate();
                      return done(null, newUser);
                  });
              }

          });

      });

  }));
  //LOGIN
  passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'username',
    passwordField : 'accesspassword',
    passReqToCallback : true // allows us to pass back the entire request to the callback
},
    function(req, email, password, done) { // callback with email and password from our form

    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
  User.findOne({ 'local.username' :  email }, function(err, user) {
        // if there are any errors, return the error before anything else
        if (err)
            return done(err);

        // if no user is found, return the message
        if (!user)
            return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

        // if the user is found but the password is wrong
        if (!user.validPassword(password))
            return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

        // all is well, return successful user
        return done(null, user);
    });

}));



































  //   passport.use(new LocalStrategy((username, password, cb) => {
  //     db.one("SELECT userid, fullname, totalpoints, username, email, userrole " +
  //     "FROM users " +
  //     "WHERE user_email=$1 AND accesspassword=$2", [username, password])
  //   .then((result)=> {
  //     if(result.rows.length > 0) {
  //       const first = result.rows[0]
  //       bcrypt.compare(password, first.password, function (err, res) {
  //         if(res) {
  //           cb(null, {id: first.id, username: first.username, type: first.type})
  //         }
  //         else {
  //           cb(null, false)
  //         }
  //       })
  //     }
  //   })
  //   .catch((err) => {
  //     log.error("/login: " + err);
  //     return done(null, false, {message:'Wrong user name or password'});
  //   });
  // }))


  // passport.serializeUser((user, done)=>{
  //   console.log("serialize ", user);
  //   done(null, user.userid);
  // });

  // passport.deserializeUser((id, done)=>{
  //   console.log("deserualize ", userid);
  //   db.one("SELECT userid, fullname, totalpoints, username, email, userrole FROM users " +
  //           "WHERE userid = $1", [userid])
  //   .then((user)=>{
  //     done(null, user);
  //   })
  //   .catch((err)=>{
  //     done(new Error(`User with the userid ${userid} does not exist`));
  //   })
  // });


}//end of module
    
