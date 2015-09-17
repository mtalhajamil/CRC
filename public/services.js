angular.module('CRC.services', []).
factory('ergastAPIservice', function($http,$location,$window,$rootScope) {

  var ergastAPI = {};

  ergastAPI.sendLoginData = function(formData) {
    $http.post('/login', formData).success(function (data) { 
      if(data.auth){
        $rootScope.auth = true;
        $window.location.href = '/#/dashboard';
      }
      else
      {
        $rootScope.auth = false;
      } 
    });
  }

  ergastAPI.sendRegisteration = function(formData) {
    $http.post('/register', formData).success(function (data) {
      alert("User is successfully registered");   
    });

  }

  ergastAPI.postBlog = function(formData) {
    $http.post('/postBlog', formData).success(function (data) {   
      alert("Blog Posted");
    });

  }

  ergastAPI.getUsers = function() {
    return $http({
      method: 'GET', 
      url: '/getUsers'
    });
  }

  ergastAPI.updateRole = function(updateJSON) {
    $http.post('/updateRole', updateJSON).success(function (data) {
        //alert(data);   
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

  return ergastAPI;

  
}).
factory("authenticationSvc", function($http, $q, $window) {
  var userInfo;


  function init() {
    if ($window.sessionStorage["userInfo"]) {
      userInfo = JSON.parse($window.sessionStorage["userInfo"]);
    }
  }

  init();

  

  function login(dataJSON) {
    var deferred = $q.defer();
    //console.log(dataJSON);
    $http.post("/getUser",dataJSON).success(function(data) {
      //console.log(data[0]);
      userInfo = data[0];
      $window.sessionStorage["userInfo"] = JSON.stringify(data[0]);
      deferred.resolve(userInfo);
    }, function(error) {
      deferred.reject(error);
    });

    return deferred.promise;
  }

  function getUserInfo() {
    return userInfo;
  }

  return {
    login: login,
    getUserInfo: getUserInfo
  };
});