var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var passport = require("passport");
var flash = require("connect-flash");

var ideas = require("./models/Idea");

var ideas = require("./routes/ideas"),
    users_router = require("./routes/users");

require("./config/passport")(passport);

var app = express();
var url = process.env.DBURL || "mongodb://localhost/vidjot";
mongoose.connect(url);
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(require("express-session")({
  secret: "Random",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static("public"));
app.use(flash());
app.use(function(req, res, next){
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  res.locals.error_m = req.flash("error_m");
  res.locals.user = req.user || null;
  next();
});

app.use("/ideas", ideas);
app.use("/users", users_router);

app.set("view engine", "ejs");

app.get("/", function(req, res){
  res.render("index");
});

app.get("/about", function(req, res){
  res.render("about");
});

var port = process.env.PORT || 3000;

app.listen(port, function(){
  console.log("Server started at 3000");
});
