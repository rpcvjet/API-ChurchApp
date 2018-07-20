const db = require('../database');
var connectionString = 'postgres://localhost:5432/kennethedwards';


function User(){
    this.userid = 0;
    this.email = "";
    this.password= ""; //need to declare the things that i want to be remembered for each user in the database

    this.save = function(callback) {
       
        console.log(this.email +' will be saved');

            db.any('INSERT INTO users(email, password) VALUES($1, $2)', [this.email, this.password], function (err, result) {
                if(err){
                    console.log(err);
                    return console.error('error running query', err);
                }
                console.log(result.rows);
            });
            db.any('SELECT * FROM users ORDER BY userid desc limit 1', null, function(err, result){

                if(err){
                    return callback(null);
                }
                //if no rows were returned from query, then new user
                if (result.rows.length > 0){
                    console.log(result.rows[0] + ' is found!');
                    var user = new User();
                    user.email= result.rows[0]['email'];
                    user.password = result.rows[0]['password'];
                    user.u_id = result.rows[0]['userid'];
                    console.log(user.email);
                    client.end();
                    return callback(user);
                }
            });
    };
}

User.findOne = function(email, callback){
   
    var isNotAvailable = false; //we are assuming the email is taking
 
    console.log(email + ' is in the findOne function test');
  

    db.query("SELECT * from users where email=$1", [email], function(err, result){
        if(err){
            return callback(err, isNotAvailable, this);
        }
        //if no rows were returned from query, then new user
        if (result.rows.length > 0){
            isNotAvailable = true; // update the user for return in callback
        
            console.log(email + ' is am not available!');
        }
        else{
            isNotAvailable = false;
            //email = email;
            console.log(email + ' is available');
        }
        //the callback has 3 parameters:
        // parameter err: false if there is no error
        //parameter isNotAvailable: whether the email is available or not
        // parameter this: the User object;

        db.end();
        return callback(false, isNotAvailable, this);


    });

};
