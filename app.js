//TODO: names should show up where the userID shows up

const express = require('express');
const mustache = require('mustache-express');
const bodyparser = require('body-parser');
const Sequelize = require('sequelize');
const session = require('express-session');

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

  //configure sessions
app.use(session({
    secret: 'oniejwrcghw07847-ao54qpvq3478',
    resave: false,
    saveUninitialized: true
}));

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


// count the number of likes per message. get the results similar to below
//select count("messageId"), messages.body from likes join messages on //(likes."messageId" = messages.id) group by messages.body;


      schemas.Message.findAll({
              include: [ schemas.User ],
            
          }).then(function(messages){

            const promises = [];

            for (let i = 0; i < messages.length; i++) {
              const promise = schemas.Like.count({
                where: {
                  messageId: messages[i].id,
                },
              }).then(function (likes) {
                messages[i].likes = likes; // store the # of likes
              });

              promises.push(promise);
            }

            Promise.all(promises).then(function () {
              res.render('home', {
                      activename: req.session.who.name,
                      messages: messages,
              });
            });
          });
  });

  //create
  app.get('/create', function(req, res){
    res.render('create');

  });

//post
  //new user
  app.post('/register', function(req, res){

  //TODO: check to see if the username already exists
  //      validate the password.
  //      create new session directly from registration

    schemas.User.create({
      name: req.body.new_name,
      username: req.body.new_username,
      password: req.body.new_password
    });
    res.redirect('/home');
  });

  //login
  app.post('/login', function(req, res){
      schemas.User.findAll().then( function(users){
        for (let i = 0; i < users.length; i++){
          if (req.body.username === users[i].username &&
              req.body.password === users[i].password){
                req.session.who = users[i];
                req.session.who.name = users[i].name;
                req.session.who.id = users[i].id;
                res.redirect('/home');
              } else {
                // res.redirect('/login');
              }
        }
      });
  });

  //create Gab
  app.post('/create', function(req, res){

      schemas.Message.create({
        body: req.body.gabBody,
        userId: req.session.who.id,
      });

      res.redirect('/home');

  });

  //like a message
  app.post('/like/:id', function(req, res){

    console.log(req.params.id);

    schemas.Message.findById(req.params.id,)
        .then(function (liked) {
          schemas.Like.create({

            messageId: liked.id,
            userId: req.session.who.id,

          });
        console.log(liked);

        res.redirect('/home');
        });
  });


  //logout
  app.post('/logout', function(req, res){

    req.session.destroy();
    res.redirect('/login');

  });


//ready, set, go
app.listen(4500, function(){
  console.log('Gabble away at http://localhost:4500/login');
});
