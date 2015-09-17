angular.module('CRC.services', []).
  factory('ergastAPIservice', function($http,$location,$window,$rootScope) {

    var ergastAPI = {};

    ergastAPI.sendLoginData = function(formData) {
      $http.post('http://localhost:3030/login', formData).success(function (data) { 
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
      $http.post('http://localhost:3030/register', formData).success(function (data) {
        alert("User is successfully registered");   
    });

    }

    ergastAPI.postBlog = function(formData) {
      $http.post('http://localhost:3030/postBlog', formData).success(function (data) {   
        alert("Blog Posted");
    });

    }

    ergastAPI.getUsers = function() {
      return $http({
        method: 'GET', 
        url: 'http://localhost:3030/getUsers'
      });
    }

    ergastAPI.updateRole = function(updateJSON) {
      $http.post('http://localhost:3030/updateRole', updateJSON).success(function (data) {
        //alert(data);   
    });
    }

    ergastAPI.updateUser = function(updateJSON) {
      $http.post('http://localhost:3030/updateUser', updateJSON).success(function (data) {
        alert(data);   
    });
    }

    ergastAPI.deleteUser = function(updateJSON) {
      $http.post('http://localhost:3030/deleteUser', updateJSON).success(function (data) {
        alert(data);   
    });
    }
    
    return ergastAPI;

  
  });