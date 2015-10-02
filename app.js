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


var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'engrocrc@gmail.com',
    pass: 'engrocrc123'
  }
});


var app = express();

app.use(express.static(__dirname + '/public'));


app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');

  next();
});


app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


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

// app.post('/postBlog', function(req, res){

//   var collection = db.get('blogCollection');
//   var formObject = {author:req.user.username,title:req.body.title,blog:req.body.blog};
//     // Submit to the DB
//     collection.insert(
//       formObject, function (err, doc) {
//         if (err) {
//             // If it failed, return error
//             res.send("There was a problem adding the information to the database.");
//           }
//           else {
//             res.sendStatus(200);
//           }
//         });

//   });


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
  //console.log(req.body);
  var collection = db.get('userCollection');
  collection.find({'email': req.body.email, 'password': req.body.password},{},function(e,docs){
    //console.log(docs);
    res.send(docs);
  });
});





/////////////////////////////request/////////////////////////////////


app.get("/getRequestName",function(req,res,next){

  var collection = db.get('cycle');
  //collection.find({},{sort: {'request':1}, fields: { 'assumption_notes': 0}},function(e,docs){
    collection.find({},{sort: {'request':1}},function(e,docs){
    //console.log(docs);
    res.send(docs);
  });


  });

app.post("/getRequestById", function(req,res,next){
  var collection = db.get('cycle');

  collection.findById(req.body.id, function(err,docs){
    console.log(docs);
    res.send(docs);
  });

});

app.post("/getRequest", function(req,res,next){
  var collection = db.get('cycle');

  collection.findById(req.body._id, function(err,docs){
      //console.log(docs);
      res.send(docs);
    });

});


app.post('/updateRequest', function(req,res,next){
  var collection = db.get('cycle');
  collection.update(
    {_id: req.body._id},req.body , function (err, doc) {
      if (err) {

        res.send(err);
      }
      else {
        res.send("Rejection has been made");
      }
    });

});

app.post('/addRequest', function(req, res){

  var data = {"request": req.body};
  data.status = "initial";
  data.approved_by = "none";

  var collection = db.get('cycle');
  collection.insert(
    data, function (err, doc) {
      if (err) {
        res.send("There was a problem adding the information to the database.");
      }
      else {
            // res.send("Record Inserted"); 
          }
        });


      //var deferred = Q.defer();


      var collection2 = db.get('userCollection');
      collection2.find({'role': "aManager", 'modules': { $in:[req.body.func]}},{},function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
            //console.log("faliure");
          }
          else {

            console.log(doc);
           while(1){

            if(doc){
                  //console.log(doc[0].email);
                  emailCall(doc[0].email,req.body,res);
                  break;
                }
              }
           
         }
       });

     // console.log(deferred.promise);
    // promise.then(function(result){
    //   console.log(result);
    // },
    // function(error){
    // });


});


function emailCall(email,request,res){

  //console.log(email);

  var mailOptions = {
              from: 'IS chain management', // sender address
              to: email, // list of receivers
              subject: 'A Change in Module has been requested', // Subject line
              text: 'Request Nature:,Check link:', // plaintext body
              html: '<b>Request Nature:'+ request.natureOfRequest +'</b><br />Go to: <a href="#">link</a>' // html body
            };

            transporter.sendMail(mailOptions, function(error, info){
              if(error){
                console.log(error);
                //res.send("Email Not Sent");
              }else{
                //console.log("done email");
                res.send("Request Generated & Email Sent"); 
                //res.send("Email Sent To Application Manager" + docs.email);
              }
            });
          }


/////////////////////////////////////////////////////////////////////




app.listen(3030);

