var express = require("express");
var app = express();
var mongoose = require("mongoose");
var passport = require("passport");
var bodyParser = require("body-parser");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var passportLocalMongoose = require("passport-local-mongoose");

mongoose.connect("mongodb://localhost/auth_demo");

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

app.use(require("express-session")({
   secret: "caspian",
   resave: false,
   saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ROUTES ---------------------------------------------------------------------

app.get("/", function(req, res){
   res.render("home"); 
});

app.get("/secret", isLoggedIn, function(req, res){
   res.render("secret"); 
});

// AUTH ROUTES ----------------------------------------------------------------

app.get("/register", function(req, res){
   res.render("register");
});

app.post("/register", function(req, res){
   req.body.username
   req.body.password
   User.register(new User({username: req.body.username}), req.body.password, function(err, user){
      if (err) {
         console.log(err);
         return res.render("register");
      }
      passport.authenticate("local")(req, res, function(){
         res.redirect("/secret");
      });
   });
});

// LOGIN ROUTES ---------------------------------------------------------------

app.get("/login", function(req, res){
   res.render("login");
});

app.post("/login", passport.authenticate("local", {
         successRedirect: "/secret",
         failureRedirect: "/login"
   }), function(req, res){
   });
   
app.get("/logout", function(req, res){
   req.logout();
   res.redirect("/");
});

function isLoggedIn(req, res, next){
   if (req.isAuthenticated()){
      return next();
   }
   res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("SEVERE VIOLENCE."); 
});