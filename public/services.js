angular.module('CRC.services', []).
factory('check_user',function(){
  return {};
}).
factory('sample', function(){
  return {};
}).
factory('loginDashboard', function(){
  return {};
}).
factory('ergastAPIservice', function($http,$location,$window,$rootScope,$q) {

  var ergastAPI = {};

  var def = $q.defer();

  getUsers = function() {
    return $http({
      method: 'GET', 
      url: '/getUsers'
    }).success(function(data) {
      def.resolve(data);
    });

    return def.promise;
  }
  
  var userData = getUsers().then(function(userData){
    $rootScope.userInformation = userData;
  });
  
  

  ///////////////////////////Request/////////////////////////////

  ergastAPI.updateRequest = function(formData){
    $http.post('/updateRequest', formData).success(function(data){

    });
  }



  ergastAPI.sendRequest = function(formData) {
    $http.post('/addRequest', formData).success(function (data) {
     alert(data);   
   });

  }

  ergastAPI.getRequest = function(id){
   return $http({
    method: 'GET',
    url: '/getRequest'
  });

 }

 ergastAPI.getRequestName =function (){
  return $http({
    method: 'GET',
    url: '/getRequestName'
  });

}


var abc = null;
ergastAPI.getRequestById =function (oid){

  var deferred = $q.defer();

  $http.post('/getRequestById', oid).success(function (data) {   
    abc= data;

    deferred.resolve(abc);
    
  });
  
  return deferred.promise;
}

///////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////Status//////////////////////////////////////////

ergastAPI.getCyclesForPowerUser = function(formData) {
  return $http.post('/getCyclesForPowerUser', formData).success(function (data) {   
  });

}

ergastAPI.getCyclesForApplicationManager = function(formData) {
  return $http.post('/getCyclesForApplicationManager', formData).success(function (data) {   
  });

}

ergastAPI.getCyclesForApplicationOwner = function(formData) {
  return $http.post('/getCyclesForApplicationOwner', formData).success(function (data) {   
  });

}


  ////////////////////////////////////////////////////////////////////


  ////////////////////////User Registration/////////////////////////////

  ergastAPI.sendRegisteration = function(formData) {
    $http.post('/register', formData).success(function (data) {
      alert("User is successfully registered");   
    });

  }

  ergastAPI.getUsers = function() {
    return $http({
      method: 'GET', 
      url: '/getUsers'
    });
  }

  ergastAPI.updateUser = function(updateJSON) {
    $http.post('/updateUser', updateJSON).success(function (data) {
      alert(data);   
    });
  }

  ergastAPI.deleteUser = function(updateJSON) {
    $http.post('/deleteUser', updateJSON).success(function (data) {
      alert(data);   
    });
  }

////////////////////////////////////////////////////////////////////////////


return ergastAPI;


}).
factory("authenticationSvc", function($http, $q, $window) {
  var userInfo;

  

  function init() {
    if ($window.sessionStorage["userInfo"] !== "undefined") {
      userInfo = JSON.parse($window.sessionStorage["userInfo"]);
    }
  }

  //init();
  

  function login(dataJSON) {
    var deferred = $q.defer();
    $http.post("/getUser",dataJSON).success(function(data) {
      userInfo = data[0];
      
      
      if(userInfo){
        if(!userInfo.active){
          alert('User Disabled')
        }else{
          $window.location.href = '/#/dashboard';
        }
      }
      else
      {
        alert('username or password incorrect!');
      }
      $window.sessionStorage["userInfo"] = JSON.stringify(data[0]);
      deferred.resolve(userInfo);
    }, function(error) {
      deferred.reject(error);
    });

    return deferred.promise;
  }

  function clearUser() {
    userInfo = null;
    $window.sessionStorage["userInfo"] = null;
  }


  function getUserInfo() {
    console.log(userInfo);
    return userInfo;
  }

  return {
    login: login,
    getUserInfo: getUserInfo,
    clearUser: clearUser
  };
});