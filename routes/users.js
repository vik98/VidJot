var express = require("express");
var bcrypt = require("bcryptjs");
var router = express.Router();
var passport = require("passport");


var ideas = require("../models/Idea");
var users = require("../models/Users");

router.get("/login", function(req, res){
  res.render("users/login");
});

router.post("/login", function(req, res, next){
  passport.authenticate('local', {
    successRedirect: '/ideas',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

router.get("/register", function(req, res){
  res.render("users/register");
});

router.post("/register", function(req, res){
  // users.register(new users({name: req.body.name, email: req.body.email}), req.body.password, function(err, user){
  //   if(err){
  //     console.log(err);
  //     return res.render("users/register");
  //   }else{
  //     res.redirect("/users/login");
  //   }
  // });

  // let errors = [];
  //
  // if(req.body.password != req.body.password2){
  //   errors.push({text: "Passwords do not match"});
  // }
  //
  // if(req.body.password.length < 8){
  //   errors.push({text: "Password too small"});
  // }
  //
  // if(errors.length > 0){
  //   res.render("users/register", {name: req.body.name, email: req.body.email, errors: errors});
  // }else{
    var user = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    }
    //
    // users.findOne({email: req.body.email}, function(err, user){
    //   if(user){
    //     res.redirect("users/login");
    //   }
    // });
    //
    //
    //     //bcrypt is used to encrypt your password
    //     // herre 10 indicated the size of the hash
    //     // pass in the password that you want to encrypt
    //
    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(user.password, salt, function(err, hash){
        if(err) throw err;
        user.password = hash;
        users.create(user, function(err, user){
          if(err){
            console.log(err);
          }else{
            res.redirect("/users/login");
          }
        })
      })
    })

});

router.get("/logout", function(req, res){
  req.logout();
  req.flash("success", "Logged Out");
  res.redirect("/users/login");
});

module.exports = router;
