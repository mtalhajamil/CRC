var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var monk = require('monk');
var db = monk('localhost:27017/CRC');
var nodemailer = require('nodemailer');
var Promise = require("bluebird");



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


app.post('/updateUser', function(req, res){

  var collection = db.get('userCollection');
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
  collection.find({},{sort: {'request':1}},function(e,docs){
    res.send(docs);
  });


});

app.post("/getCyclesForPowerUser",function(req,res,next){

  var collection = db.get('cycle');
  collection.find({"request.username":req.body.username},{},function(err,docs){
    if (err) {
      res.send(err);
    }
    else {
      res.send(docs);
    }
  });
});

app.post("/getCyclesForApplicationManager",function(req,res,next){

  var collection = db.get('cycle');
  collection.find({"request.func":{$in:req.body.modules}},{},function(err,docs){
    if (err) {
      res.send(err);
    }
    else {
      res.send(docs);
    }
  });
});

app.post("/getCyclesForApplicationOwner",function(req,res,next){

  var collection = db.get('cycle');
  collection.find({ $and : [
    { "request.func":{$in:req.body.modules} },
    { $or : [ {$and : [ { status : "initial" }, {approved_by: "aManager" } ]}, { status : "dev" },{ status : "prd" },{ status : "closed" } ] }
    ]},{},function(err,docs){
      if (err) {
        res.send(err);
      }
      else {
        res.send(docs);
      }
    });
});

app.post("/getRequestById", function(req,res,next){
  var collection = db.get('cycle');

  collection.findById(req.body.id, function(err,docs){
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
       //res.send("Request Generated"); 
     }
   });

  var collection2 = db.get('userCollection');
  collection2.find({'role': "aManager", 'modules': { $in:[req.body.func]}},{},function (err, doc) {
    if (err) {
      res.send("There was a problem adding the information to the database.");
    }
    else {
     while(1){

      if(doc){
        if(doc.length == 0){
          res.send("No application manager for this module");
          break;
        }else{
         for(var i=0;i<doc.length;i++) {
          emailCall(doc[i].email,req.body);
        }
        res.send("Request Generated & Email Sent To Application Manager"); 
        break;
      }
    }
  }
}
});
});


function emailCall(email,request){

  //console.log(email);

  var mailOptions = {
              from: 'IS chain management', // sender address
              to: email, // list of receivers
              subject: 'A Change in Module has been requested', // Subject line
              text: 'Request Nature:,Check link:', // plaintext body
              html: '<b>Request Nature:'+ request.natureOfRequest +'</b><br />Go to: <a href="http://localhost:3030/#/request/'+request._id+'">Link To Cycle</a>' // html body
            };

            transporter.sendMail(mailOptions, function(error, info){
              if(error){
                console.log(error);
                //res.send("Email Not Sent");
              }else{
                //console.log("done email");
                //res.send("Email Sent To Application Manager" + docs.email);
              }
            });
          }


/////////////////////////////////////////////////////////////////////

app.listen(3030);

