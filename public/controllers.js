angular.module('CRC.controllers', ['app.directives']).
controller('indexController', function($scope,$location,authenticationSvc) {
  $scope.logout = function() {
    authenticationSvc.clearUser();
  }
  
  
}).
controller('requestController',function($scope,ergastAPIservice,authenticationSvc,sample, check_user){


  $scope.sample = sample;
  $scope.check_user = check_user;
  console.log($scope.check_user.role);
  console.log($scope.sample);
  if ($scope.sample.role == 'aManager'){
    $scope.IsVisible = false;
    $scope.IsVisible1 = true;
  }
  else {
    $scope.IsVisible1 = false;
   $scope.IsVisible = true; 
  }
  var string = '{"id": "'+$scope.sample.oid+'"}';
  var obj = JSON.parse(string);
   var abc = ergastAPIservice.getRequestById(obj).then(function(mesg){
    console.log(mesg);
    $scope.mesg = mesg;
    console.log($scope.mesg.request)

   });

   $scope.accept= function(){

   }

   $scope.reject = function(){
      alert("hello");
     var timeStamp = new Date().getTime();
     var userInfo = authenticationSvc.getUserInfo();
     console.log(userInfo.username);
     console.log($scope.mesg.request.comments);

     //var string= '{"comments": "'+ $scope.mesg.request.comments+'", "By": + "'+ userInfo.username +'","Role": "'+userInfo.role+'", "timeStamp": "'+ timeStamp+'"}';
     var string= '{"comments": "'+ $scope.mesg.request.comments+'", "By": "'+ userInfo.username+'","Role": "'+userInfo.role+'", "timeStamp": "'+ timeStamp+'"}';
     
     var obj = JSON.parse(string);
     console.log(obj);
     $scope.mesg.comments = obj;
     //$scope.mesg.comments[1] = obj;
    ergastAPIservice.updateRequest($scope.mesg);
        
   }

}).
controller('loginController', function($scope,authenticationSvc) {

    // $scope.login = function() {
    //     ergastAPIservice.sendLoginData($scope.formData);
    // }

    $scope.login = function() {
      var response = authenticationSvc.login($scope.formData);
      //console.log(response);
    }



  }).
controller('registerController', function($scope,ergastAPIservice) {

  $scope.register = function() {

    $scope.formData.modules = $scope.selected_items;
        //console.log($scope.formData);
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
controller('dashboardController', function($scope,authenticationSvc) {
  $scope.userInfo = authenticationSvc.getUserInfo();
  //console.log($scope.userInfo);

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


      $scope.changeModules = function(){
        alert("AA");
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
  //console.log($scope.check_user.role);

  var userInfo = authenticationSvc.getUserInfo();
  console.log(userInfo.role);
  $scope.set = function(oid)
  {
      //alert(oid);   
       $scope.sample= sample;
       $scope.sample.oid = oid;
       $scope.sample.role = userInfo.role;

 
  }

ergastAPIservice.getRequestName().success(function(res){
      console.log(res);


      var i= res.length;
      
      for ( var a= 0; a< res.length; a++)
      {
        console.log(res[a].request.assumption_notes);
      }
      //var list = [];
      var list ='{ "list" : [';
      for ( var i = 0; i<res.length;  i++)
      {
        list += '{ "key": "'+res[i]._id+'", "value": "'+res[i].request.description+'"}';
        if (i != (res.length -1))
        {
            list +=',';
        }
        //list[i] = res[i].description;
      }
      list += ']}';

      var obj = JSON.parse(list);
      console.log(obj.list);
      $scope.usersList = obj.list;
      console.log($scope.usersList);
     });
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