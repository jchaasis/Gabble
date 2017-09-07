const express = require('express');
const mustache = require('mustache-express');
const bodyparser = require('body-parser');
const Sequelize = require('sequelize');

const schemas = require('./schemas/schemas.js');

//Initialize app

const app = express();

//connect public folder
app.use(express.static('public'));

//configure app
  //mustache
app.engine('mustache', mustache());
app.set("views", "./views");
app.set("view engine", "mustache");

//initialize body parser for the form
app.use(bodyparser.urlencoded({ extended: false }));

//routes

  //get
  //login
  app.get('/login', function(req, res){
    res.render('login');
  });

  //register
  app.get('/register', function(req, res){
    res.render('register');
  });

  //home
  app.get('/home', function(req, res){
    res.render('home');
  });

  //create
  app.get('/create', function(req, res){
    res.render('create');

  });

  //post
  //new user
  app.post('/register', function(req, res){

    schemas.User.create({
      name: req.body.new_name,
      username: req.body.new_username,
      password: req.body.new_password
    });
    res.redirect('/home');
  });



//ready, set, go
app.listen(4500, function(){
  console.log('Gabble away at http://localhost:4500/login');
});
