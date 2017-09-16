//TODO: names should show up where the userID shows up

const express = require('express');
const mustache = require('mustache-express');
const bodyparser = require('body-parser');
const Sequelize = require('sequelize');
const session = require('express-session');

//import schemas
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

      //find all messages and include the user table
      schemas.Message.findAll({
              include: [ schemas.User ],

          }).then(function(messages){
            //promises to be run
            const promises = [];
            //check to see if the message author is the person
            //currently logged in. If it is, set active to true so
            // that they are able to delete a message and not able
            //to like their own message, because liking your own
            //post is super lame.
            for (let i = 0; i < messages.length; i++) {
              if (messages[i].userId === req.session.who.id){
                   messages[i].active = true;
              } //count the number of likes each message has
              const promise = schemas.Like.count({
                where: {
                  messageId: messages[i].id,
                }, //store the number of likes for display
              }).then(function (likes) {
                messages[i].likes = likes;
              });

              promises.push(promise);
            }
            //the promises and render the home page
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

  //likes display page
  app.get('/likes/:message_id', function(req, res){
        //store the param id se we can use it to render in the likes
        //display page and also find the associated likes
        const id =  req.params.message_id;
        //find all likes with the corresponding message id
        schemas.Like.findAll({
          where: {messageId: parseInt(id)},
          include: [ schemas.User ],
        }
      ).then(function(results){
          //find the message with the corresponding message id
          schemas.Message.findById(parseInt(id)).then(function(message){

            res.render("likes", {
                message: message,
                results: results,

            });
          })
      });
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

  //login
  app.post('/login', function(req, res){
      schemas.User.findAll().then( function(users){
        for (let i = 0; i < users.length; i++){
          //check to see if the username & password combo typed in is
          //a registered user. If they are, direct them to the home page and
          //create a new session
          if (req.body.username === users[i].username &&
              req.body.password === users[i].password){
                req.session.who = users[i];
                req.session.who.name = users[i].name;
                req.session.who.id = users[i].id;
                res.redirect('/home');
          }
        }
      });
  });

  //create Gab
  app.post('/create', function(req, res){
      //create new message
      schemas.Message.create({
        body: req.body.gabBody,
        userId: req.session.who.id,
      });

      res.redirect('/home');

  });
  //delete Gab
  app.post('/delete/:id', function(req, res){
    //first delete the likes associated with the messageId
    //so that we can delete the message
    schemas.Like.destroy({
                  where: {
                    messageId: req.params.id,
                  }

    }).then(function(){
      //now that the likes are gone, the message is not connected to any
      //other tables so we can delete it.
      schemas.Message.destroy({
                      where: {
                        id: req.params.id,
                      }
      }).then(function(){
          res.redirect('/home');
      });
    });
  });

  //like a message
  app.post('/like/:id', function(req, res){
    //find the message the user wishes to like and add a like
    //to the likes table with the associated messageId and UserId
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
    //destroy session and logout
    req.session.destroy();
    res.redirect('/login');
  });

//ready, set, go
app.listen(4500, function(){
  console.log('Gabble away at http://localhost:4500/login');
});
