var express = require("express");
var router = express.Router();
var {ensureAuthenticated} = require("../helpers/auth")
var ideas = require("../models/Idea");

router.get("/new", ensureAuthenticated, function(req, res){
  res.render("ideas/add");
});

router.post("/", ensureAuthenticated, function(req, res){
  var errors = [];
  if(!req.body.title){
    errors.push({text: "Please add a title"});
  }
  if(!req.body.details){
    errors.push({text: "Please add some text"});
  }
  if(errors.length>0){
      res.render("ideas/add", {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  }else{
    var usernew = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
    }
    ideas.create(usernew, function(err, idea){
      if(err){
        console.log(err);
      }else{
        req.flash("success", "IDea Added successfully");
        res.redirect("/ideas");
      }
    });
  }
});

router.get("/", ensureAuthenticated, function(req, res){
  ideas.find({user: req.user.id}, function(err, all){
    if(err){
      console.log(err);
    }else{
      res.render("ideas/display", {arr: all});
    }
  }).sort({date: "desc"});

});

router.get("/:id/edit", ensureAuthenticated, function(req, res){
  ideas.findById(req.params.id, function(err, idea){
    if(err){
      console.log(err);
    }else{
      res.render("ideas/edit", {idea: idea});
    }
  });

});

router.put("/:id", ensureAuthenticated, function(req, res){
  ideas.findByIdAndUpdate(req.params.id, req.body.idea, function(err, idea){
    if(err){
      console.log(err);
    }else{
      req.flash("success", "Video Idea Updated");
      res.redirect("/ideas")
    }
  })
});

router.delete("/:id", ensureAuthenticated, function(req, res){
  ideas.findByIdAndRemove(req.params.id, function(err){
    if(err){
      console.log(err);
    }else{
      req.flash("success", "Video Idea Deleted");
      res.redirect("/ideas");
    }
  });
});



module.exports = router;
