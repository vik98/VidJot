var LocalStrategy = require("passport-local").Strategy;
var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");

var users = require("../models/Users");

module.exports = function(passport){
  passport.use(new LocalStrategy({usernameField: 'email'}, function(email, password, done){
    users.findOne({email: email}).then(user => {
      if(!user){
        return done(null, false, {message:"No user found"});
      }
      bcrypt.compare(password, user.password, function(err, isMatch){
        if(err) throw err;
        if(isMatch){
          return done(null, user)
        }else{
          return done(null, false, {message:"Password incorrect"});
        }
      })
    })
  }));

  passport.serializeUser(function(user, done){
    done(null, user.id);
  });
  passport.deserializeUser(function(id, done){
    users.findById(id, function(err, user){
      done(err, user);
    })
  });

}
