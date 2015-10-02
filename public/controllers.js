angular.module('CRC.controllers', ['app.directives']).
controller('indexController', function($scope,$location,authenticationSvc,loginDashboard) {
  $scope.logout = function() {
    authenticationSvc.clearUser();
  }

  $scope.loginDashboard = loginDashboard;
  $scope.loginDashboard.visible = true;

}).
controller('requestController',function($scope,$routeParams,ergastAPIservice,authenticationSvc,sample, check_user){



  $scope.sample = sample;
  $scope.check_user = check_user;

  if ($scope.sample.role == 'aManager'){
    $scope.IsVisible = false;
    $scope.IsVisible1 = true;
  }
  else {
    $scope.IsVisible1 = false;
    $scope.IsVisible = true; 
  }
  var string = '{"id": "'+$routeParams.key+'"}';
  var obj = JSON.parse(string);
  var abc = ergastAPIservice.getRequestById(obj).then(function(mesg){

    $scope.mesg = mesg;

  });

  $scope.accept= function(){
    $scope.mesg.approved_by = "aManager";
    ergastAPIservice.updateRequest($scope.mesg);
    alert("Request Approved & Sent To Application Owner");
  }

  $scope.reject = function(){
   var timeStamp = new Date().getTime();
   var userInfo = authenticationSvc.getUserInfo();
   

     //var string= '{"comments": "'+ $scope.mesg.request.comments+'", "By": + "'+ userInfo.username +'","Role": "'+userInfo.role+'", "timeStamp": "'+ timeStamp+'"}';
     var string= '{"comments": "'+ $scope.mesg.request.comments+'", "By": "'+ userInfo.username+'","Role": "'+userInfo.role+'", "timeStamp": "'+ timeStamp+'"}';
     
     var obj = JSON.parse(string);
     $scope.mesg.comments = obj;
     //$scope.mesg.comments[1] = obj;
     ergastAPIservice.updateRequest($scope.mesg);

   }

 }).
controller('loginController', function($scope,authenticationSvc,loginDashboard) {

    // $scope.login = function() {
    //     ergastAPIservice.sendLoginData($scope.formData);
    // }

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
 var timeStamp = new Date().getTime();

 $scope.formData = { 'username': userInfo.username, 'timeStamp': new Date(timeStamp), 'designation': userInfo.designation};
 $scope.modules = userInfo.modules;

 $scope.dropboxitemselected = function (item) {
  $scope.formData.func = item;
}

$scope.register = function(){
  ergastAPIservice.sendRequest($scope.formData);

}

}).
controller('dashboardController', function($scope,authenticationSvc,loginDashboard) {
  $scope.userInfo = authenticationSvc.getUserInfo();
  

  $scope.loginDashboard = loginDashboard;
  $scope.loginDashboard.visible = true;
}).
controller('userControlController', function($scope,ergastAPIservice) {

  ergastAPIservice.getUsers().success(function(res){
    $scope.usersList = res;
  });



  $scope.ChangeOfRole = function(id,role){
        //alert(id+"---"+role);
        var updateJSON = {"id":id,"role":role};
        ergastAPIservice.updateRole(updateJSON);
      }

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
      console.log(res);
     $scope.cycles = res;
   });
  }

  if(userInfo.role == "aManager"){
    var JSONmodules = {"modules":userInfo.modules};
    ergastAPIservice.getCyclesForApplicationManager(JSONmodules).success(function(res){
      console.log(res);
     $scope.cycles = res;
   });
  }

  if(userInfo.role == "aOwner"){
    var JSONmodules = {"modules":userInfo.modules};
    ergastAPIservice.getCyclesForApplicationOwner(JSONmodules).success(function(res){
      console.log(res);
     $scope.cycles = res;
   });
  }

  $scope.set = function()
  {   
    $scope.sample= sample;
    $scope.sample.role = userInfo.role;
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
  "<button class='btn btn-success dropdown-toggle' data-ng-click='open=!open;openDropdown()'>Module<span class='caret'></span></button>"+
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