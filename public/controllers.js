angular.module('CRC.controllers', ['app.directives']).
controller('indexController', function($scope,$location,authenticationSvc,loginDashboard) {
  $scope.logout = function() {
    authenticationSvc.clearUser();
  }

  $scope.loginDashboard = loginDashboard;
  $scope.loginDashboard.visible = true;

}).
controller('requestController',function($scope,$routeParams,ergastAPIservice,authenticationSvc,sample, check_user){

  var status = "";
  var userInfo = authenticationSvc.getUserInfo();
  var string = '{"id": "'+$routeParams.key+'"}';
  var obj = JSON.parse(string);
  var forReturn = ergastAPIservice.getRequestById(obj).then(function(mesg){
    $scope.mesg = mesg;

    if ( mesg.comments != null)
    {
      var changedComments = mesg.comments;
      for (var j=0; j <changedComments.length; j++)
      {
        if (changedComments[j].Role== 'aManager')
        {
          changedComments[j].Role = "Application Manager";
        }

      }
      $scope.changedComments = changedComments;
    }
    


    if($scope.mesg.status == "initial")
      status = "dev";
    else
      status = "prd";


    $scope.pUserVisibility = false; 
    $scope.aManagerVisibility = false;
    $scope.aOwnerVisibility = false;

    if(userInfo.role == 'pUser'){ 
      if($scope.mesg.approved_by == 'none')
        $scope.pUserVisibility = true;
    }else if(userInfo.role == 'aManager'){
      if($scope.mesg.approved_by != 'aManager')
        $scope.aManagerVisibility = true;
    }else if(userInfo.role == 'aOwner'){
      if($scope.mesg.approved_by != 'aOwner')
        $scope.aOwnerVisibility = true;
    }


  });

  $scope.check_user = check_user;


  $scope.updateRequest = function(){
   var arr= [{"pUser": 0, "aManager":1 , "aOwner": 0}];
   $scope.mesg.request.seen = arr;
   ergastAPIservice.updateRequest($scope.mesg);
   alert("Updated Request has been sent");

 }

 $scope.aManagerAccept= function(){
  $scope.mesg.approved_by = "aManager";
  $scope.aManagerVisibility = false;
  addApprovals();
  alert("Request Approved & Sent To Application Owner");
}

$scope.aMangerReject = function(){
  rejectionComments();
}

$scope.aOwnerAccept= function(){
  $scope.mesg.approved_by = "aOwner";
  $scope.mesg.status = status;
  addApprovals();
  $scope.aOwnerVisibility = false;
  alert("Request Approved");
}

$scope.aOwnerReject= function(){
  $scope.mesg.status = "closed";
  ergastAPIservice.updateRequest($scope.mesg);
  $scope.aOwnerVisibility = false;
  alert("Cycle Closed");
  var arr= [{"pUser": 1, "aManager":1 , "aOwner": 0}];

  $scope.mesg.request.seen = arr;
     //$scope.mesg.comments[1] = obj;
     ergastAPIservice.updateRequest($scope.mesg);
   }

   function rejectionComments(){

    var timeStamp = new Date(); 

    // if (count >0)
    if ($scope.mesg.comments == null){
      var jsonArray = [ 
      {"comments": $scope.mesg.request.comments , "By": userInfo.username , "Role" : userInfo.role , "timeStamp" : timeStamp.toDateString()}
      ];
      $scope.mesg.comments = jsonArray;
      alert("Rejected");
      var arr= [{"pUser": 1, "aManager":0 , "aOwner": 0}];

      $scope.mesg.request.seen = arr;
     //$scope.mesg.comments[1] = obj;
     ergastAPIservice.updateRequest($scope.mesg);
   }
   else 
   {
    var count = Object.keys($scope.mesg.comments).length;
    alert("Rejected");
    var jsonArray = [];
    for (var i=0; i< count; i++)
    {

      jsonArray[i]= $scope.mesg.comments[i];

    }
    jsonArray[count]= { "comments": $scope.mesg.request.comments, "By": userInfo.username, "Role": userInfo.role, "timeStamp" : timeStamp.toDateString()};

    $scope.mesg.comments = jsonArray;

    var arr= [{"pUser": 1, "aManager":0 , "aOwner": 0}];

    $scope.mesg.request.seen = arr;
          //$scope.mesg.comments[1] = obj;
          ergastAPIservice.updateRequest($scope.mesg);

        }
      }


      function addApprovals(){
        var timeStamp = new Date();
        if ($scope.mesg.approvals == null){
          var jsonArray = [ 
          {"name": userInfo.username , "role" : userInfo.role , "for" : status ,"timeStamp" : timeStamp.toDateString()}
          ];
          $scope.mesg.approvals = jsonArray;
          if (userInfo.role == 'aManager')
          {
            var arr= [{"pUser": 1, "aManager":0 , "aOwner": 1}];
          }
          else if (userInfo.role == 'aOwner')
          {
            var arr= [{"pUser": 1, "aManager":1 , "aOwner": 0}];

          }
          $scope.mesg.request.seen = arr;
            //$scope.mesg.comments[1] = obj;

            ergastAPIservice.updateRequest($scope.mesg);
          }
          else 
          {
            var count = Object.keys($scope.mesg.approvals).length;
            var jsonArray = [];
            for (var i=0; i< count; i++)
            {
              jsonArray[i]= $scope.mesg.approvals[i];
            }
            jsonArray[count]= {"name": userInfo.username , "role" : userInfo.role , "for" : status ,"timeStamp" : timeStamp.toDateString()};
          
            $scope.mesg.approvals = jsonArray;
            if (userInfo.role == 'aManager')
            {
              var arr= [{"pUser": 1, "aManager":0 , "aOwner": 1}];
            }
            else if (userInfo.role == 'aOwner')
            {
              var arr= [{"pUser": 1, "aManager":1 , "aOwner": 0}];
              
            }
            $scope.mesg.request.seen = arr;

            ergastAPIservice.updateRequest($scope.mesg);
          }
        }
      }).
controller('loginController', function($scope,authenticationSvc,loginDashboard) {

  $scope.login = function() {

    var response = authenticationSvc.login($scope.formData);

  }

  $scope.loginDashboard = loginDashboard;
  $scope.loginDashboard.visible = false;



}).
controller('registerController', function($scope,ergastAPIservice) {

  $scope.register = function() {

    $scope.formData.modules = $scope.selected_items;
    ergastAPIservice.sendRegisteration($scope.formData);

  }

  $scope.roles = [
  {"id": "FI", "name": "Financial Accounting", "assignable": true},
  {"id": "CO", "name": "Controlling", "assignable": true},
  {"id": "SD", "name": "Sales and Distribution", "assignable": true},
  {"id": "HCM", "name": "Human Capital Management", "assignable": true},
  {"id": "MM", "name": "Materials Management", "assignable": true},
  {"id": "QM", "name": "Quality Management", "assignable": true},
  {"id": "LE", "name": "Logistics Execution", "assignable": true},
  {"id": "WMS", "name": "Warehouse Management System", "assignable": true},
  {"id": "PP", "name": "Production Planning", "assignable": true},
  {"id": "PM", "name": "Plant Maintenance", "assignable": true},
  {"id": "BASIS", "name": "SAP Admin", "assignable": true},
  {"id": "ABAP", "name": "Programming", "assignable": true}

  ];

  $scope.member = {roles: []};
  $scope.selected_items = [];

}).
controller('composeController', function($scope,$location,$window,$rootScope,authenticationSvc,ergastAPIservice) {

 var userInfo = authenticationSvc.getUserInfo();
 var timeStamp = new Date();
 
 $scope.formData = { 'username': userInfo.username, 'timeStamp': timeStamp.toDateString(), 'designation': userInfo.designation};
 $scope.modules = userInfo.modules;


 $scope.dropboxitemselected = function (item) {
  $scope.formData.func = item;
}

var arr= [{"pUser": 0, "aManager":1 , "aOwner": 0}];
$scope.formData.seen = arr;

$scope.register = function(){
  ergastAPIservice.sendRequest($scope.formData);

}

}).
controller('dashboardController', function($scope,$rootScope,authenticationSvc,loginDashboard,ergastAPIservice) {
  $scope.userInfo = authenticationSvc.getUserInfo();

  $scope.changePassword = function(id) {
  if($scope.formData.oldPassword != $scope.userInfo.password)
      alert("Current Password Incorrect");
  else if($scope.formData.newPassword != $scope.formData.confirmPassword)
      alert("Passwords Don't Match");
  }

  $scope.loginDashboard = loginDashboard;
  $scope.loginDashboard.visible = true;
}).
controller('userControlController', function($scope,ergastAPIservice) {

  ergastAPIservice.getUsers().success(function(res){
    $scope.usersList = res;
  });


  $scope.updateUser = function(index){
    ergastAPIservice.updateUser($scope.usersList[index]);
  }

  $scope.deleteUser = function(index){


    var r = confirm("Are you sure?");
    if (r == true) {
      ergastAPIservice.deleteUser($scope.usersList[index]);

      ergastAPIservice.getUsers().success(function(res){
        $scope.usersList = res;
      });
    }
  }


  $scope.roles = [
  {"id": "FI", "name": "Financial Accounting", "assignable": true},
  {"id": "CO", "name": "Controlling", "assignable": true},
  {"id": "SD", "name": "Sales and Distribution", "assignable": true},
  {"id": "HCM", "name": "Human Capital Management", "assignable": true},
  {"id": "MM", "name": "Materials Management", "assignable": true},
  {"id": "QM", "name": "Quality Management", "assignable": true},
  {"id": "LE", "name": "Logistics Execution", "assignable": true},
  {"id": "WMS", "name": "Warehouse Management System", "assignable": true},
  {"id": "PP", "name": "Production Planning", "assignable": true},
  {"id": "PM", "name": "Plant Maintenance", "assignable": true},
  {"id": "BASIS", "name": "SAP Admin", "assignable": true},
  {"id": "ABAP", "name": "Programming", "assignable": true}
  ];


  $scope.member = {roles: []};
  $scope.selected_items = [];

}).
controller('statusController', function($scope,ergastAPIservice,authenticationSvc, sample,check_user) {

  $scope.check_user = check_user;

  var userInfo = authenticationSvc.getUserInfo();
  $scope.userInfo = userInfo;

  if(userInfo.role == "pUser"){
    var JSONusername = {"username":userInfo.username};
    ergastAPIservice.getCyclesForPowerUser(JSONusername).success(function(res){
     

     for (var i=0; i<res.length; i++){
      if (res[i].request.seen[0].pUser == 1)
      {
       res[i].class="text_type_bold";
     }
     else 
     {
      res[i].class = "text_type_not_bold";
    }
    res[i].key = i;
  }

  $scope.cycles = res;
});
  }

  if(userInfo.role == "aManager"){
    var JSONmodules = {"modules":userInfo.modules};
    ergastAPIservice.getCyclesForApplicationManager(JSONmodules).success(function(res){


     for (var i=0; i<res.length; i++){
      if (res[i].request.seen[0].aManager == 1)
      {
       res[i].class="text_type_bold";
     }
     else 
     {
      res[i].class = "text_type_not_bold";
    }
    res[i].key = i;
  }

  $scope.cycles = res;
});
  }

  if(userInfo.role == "aOwner"){
    var JSONmodules = {"modules":userInfo.modules};
    ergastAPIservice.getCyclesForApplicationOwner(JSONmodules).success(function(res){

      for (var i=0; i<res.length; i++){
        if (res[i].request.seen[0].aOwner == 1)
        {
         res[i].class="text_type_bold";
       }
       else 
       {
        res[i].class = "text_type_not_bold";
      }
      res[i].key = i;
    }

    $scope.cycles = res;
  });
  }




  $scope.set = function(key)
  {   
    $scope.sample= sample;
    $scope.sample.role = userInfo.role;
    if (userInfo.role == 'aManager')
    {
      if ($scope.cycles[key].request.seen[0].aManager == 1)
      {
        $scope.cycles[key].request.seen[0].aManager = 0;
      }

    //var arr= [{"pUser": 0, "aManager":0 , "aOwner": 0}];
  }
  else if (userInfo.role == 'aOwner')
  {
    if ($scope.cycles[key].request.seen[0].aOwner == 1)
    {
      $scope.cycles[key].request.seen[0].aManager = 0;
    }
  }
  else 
  {
   if ($scope.cycles[key].request.seen[0].pUser == 1)
   {
    $scope.cycles[key].request.seen[0].pUser = 0;
  }
}
   ergastAPIservice.updateRequest($scope.cycles[key]);



 }

});

angular.module('app.directives', []).
directive('dropdownMultiselect', function(){
 return {
   restrict: 'E',
   scope:{           
    model: '=',
    options: '=',
    pre_selected: '=preSelected'
  },
  template: "<div class='btn-group' data-ng-class='{open: open}'>"+
  "<button class='btn btn-default dropdown-toggle' data-ng-click='open=!open;openDropdown()'>Module<span class='caret'></span></button>"+
  "<ul class='dropdown-menu' aria-labelledby='dropdownMenu'>" + 
  "<li><a data-ng-click='selectAll()'><i class='glyphicon glyphicon-ok-sign pull-right'></i>  Check All</a></li>" +
  "<li><a data-ng-click='deselectAll();'><i class='glyphicon glyphicon-remove-sign pull-right'></i>  Uncheck All</a></li>" +                    
  "<li class='divider'></li>" +
  "<li data-ng-repeat='option in options'> <a data-ng-click='setSelectedItem()'>{{option.name}}<span data-ng-class='isChecked(option.id)'></span></a></li>" +                                        
  "</ul>" +
  "</div>" ,
  controller: function($scope){

   $scope.openDropdown = function(){        
    $scope.selected_items = [];
    for(var i=0; i<$scope.pre_selected.length; i++){      
      $scope.selected_items.push($scope.pre_selected[i].id);
    }                                        
  };

  $scope.selectAll = function () {
    $scope.model = _.pluck($scope.options, 'id');
        //alert($scope.model);
      };            
      $scope.deselectAll = function() {
        $scope.model=[];
        //alert($scope.model);
      };
      $scope.setSelectedItem = function(){
        var id = this.option.id;
        if (_.contains($scope.model, id)) {
          $scope.model = _.without($scope.model, id);
        } else {
          $scope.model.push(id);
        }
        return false;
      };
      $scope.isChecked = function (id) {                 
        if (_.contains($scope.model, id)) {
          return 'glyphicon glyphicon-ok-sign pull-right';
        }
        return false;
      };                                 
    }
  } 
});