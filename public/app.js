'use strict';


angular
.module('CRC', [
  'CRC.controllers','CRC.services','ngRoute'
])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
 when("/login", {templateUrl: "partials/login.html", controller: "loginController"}).
 when("/register", {templateUrl: "partials/register.html", controller: "registerController"}).
 when("/dashboard", {templateUrl: "partials/dashboard.html", controller: "dashboardController"}).
 when("/compose", {templateUrl: "partials/compose.html", controller: "composeController"}).
 when("/userControl", {templateUrl: "partials/userControl.html", controller: "userControlController"}).
 otherwise({redirectTo: '/dashboard'});
}]);