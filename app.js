var express = require('express')
, passport = require('passport')
, util = require('util')
, LocalStrategy = require('passport-local').Strategy;

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var monk = require('monk');
//var flash    = require('connect-flash');

var db = monk('localhost:27017/CRC');

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'engrocrc@gmail.com',
        pass: 'engrocrc123'
    }
});





function findById(id, fn) {
  var users = [];
  var index = -1;
  var found = false;
  var collection = db.get('usercollection');
  collection.find({}, {}, function (e, docs) {
    users = docs;
    for (var i = 0; users.length; i++) {
      if (users[i]._id == id) {
        index = i;
        found = true;
        break;
      }

    }
    if (found == true) {
      fn(null, users[index]);
    } else {
      fn(new Error('User ' + id + ' does not exist'));
    }

  });

}

function findByUsername(username, fn) {
  var users = [];
  var collection = db.get('usercollection');
  collection.find({}, {}, function (e, docs) {
    users = docs;
    for (var i = 0, len = users.length; i < len; i++) {
      var user = users[i];
      if (user.username === username) {
        return fn(null, user);
      }
    }
    return fn(null, null);
  });
}


var app = express();


app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');

  next();
});


app.use(express.static(__dirname + '/public'));


app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// configure Express
app.use(cookieParser());
//app.use(express.methodOverride());
app.use(session({

  secret: 'keyboard cat'
  //resave: true,
  //saveUninitialized: true,
  //cookie : { secure : false, maxAge : (40 * 60 * 60 * 1000)}, // 4 hours
}));

app.use(passport.initialize());
app.use(passport.session());




// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(user, done) {
  //console.log("ser",user);
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  //console.log(id,"id");
  findById(id, function (err, user) {
    done(err, user);
  });
});


// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(
  function(username, password, done) {
    // Find the user by username.  If there is no user with the given
    // username, or the password is not correct, set the user to `false` to
    // indicate failure and set a flash message.  Otherwise, return the
    // authenticated `user`.
    console.log("username: " + username);
    console.log("password: " + password);
    findByUsername(username, function(err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
      if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
      return done(null, user);
    })
  }
  ));







// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
//app.use(flash());




app.get('/account', ensureAuthenticated, function(req, res){
  //res.send(req.user);
  res.send({state:true});
});

app.get('/login', function(req, res){
  res.send("login karrrlo!")
});

app.get('/faliure', function(req, res){
  res.send({state:false});
});


app.post('/register', function(req, res){

  var collection = db.get('userCollection');
  
    req.body.backup = "";
    req.body.active = true;

    //console.log(req.body);
    // Submit to the DB
    collection.insert(
      req.body, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
          }
          else {
            res.sendStatus(200);
          }
        });

  });

app.post('/postBlog', function(req, res){

  var collection = db.get('blogCollection');
  var formObject = {author:req.user.username,title:req.body.title,blog:req.body.blog};
    // Submit to the DB
    collection.insert(
      formObject, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
          }
          else {
            res.sendStatus(200);
          }
        });

  });


app.post('/updateUser', function(req, res){

  var collection = db.get('userCollection');
 // console.log(req.body);
  collection.update(
    {_id: req.body._id}, req.body , function (err, doc) {
      if (err) {

        res.send(err);
      }
      else {
        res.send("User Updated");
      }
    });
});


app.post('/deleteUser', function(req, res){

  var collection = db.get('userCollection');
  //console.log(req.body);
  collection.remove(
    {_id: req.body._id}, function (err, doc) {
      if (err) {
        res.send(err);
      }
      else {
        res.send("User Deleted");
      }
    });

});


app.post('/updateRole', function(req, res){

  var collection = db.get('userCollection');

    //console.log(req.body);

    // Submit to the DB
    collection.findAndModify(
      { _id: req.body.id }, { $set: {role: req.body.role } }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send(err);
          }
          else {
            res.sendStatus(200);
          }
        });

  });

app.get("/getUsers", function(req,res,next){

  var collection = db.get('userCollection');
  collection.find({},{},function(e,docs){

    res.send(docs);

  });
});

app.post("/getUser", function(req,res,next){

  console.log(req.body);
  var collection = db.get('userCollection');
  collection.find({'email': req.body.email, 'password': req.body.password},{},function(e,docs){
    console.log(docs);
    res.send(docs);
  });
});








// POST /login
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
//
//   curl -v -d "username=bob&password=secret" http://127.0.0.1:3000/login
app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/faliure'}),
  function(req, res) {
    console.log("success",req.user);
    console.log("s2",req.session);

    res.send({auth:true});
    //res.redirect('/account');
  });

// POST /login
//   This is an alternative implementation that uses a custom callback to
//   acheive the same functionality.
/*
app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) {
      req.flash('error', info.message);
      return res.redirect('/login')
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/users/' + user.username);
    });
  })(req, res, next);
});
*/

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.listen(3030);


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  //console.log("req.user",req.user,req.session);
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/#/login');
}