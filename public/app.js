'use strict';


angular
.module('CRC', [
	'CRC.controllers','CRC.services','ngRoute'
	])
.config(['$routeProvider', function($routeProvider) {

	

	var registerResolve = {
		auth: ["$q", "authenticationSvc", function($q, authenticationSvc) {
			var userInfo = authenticationSvc.getUserInfo();

			function isInArray(value, array) {
				return array.indexOf(value) > -1;
			}

			if (userInfo) {
				console.log(isInArray("BASIS",userInfo.modules));
				if(isInArray("BASIS",userInfo.modules) == false){
					alert("You Need To Be A BASIS Administrator");
					return $q.reject({ authenticated: false });
				}
				else
					return $q.when(userInfo);
			} else {
				alert("Please Login");
				return $q.reject({ authenticated: false });
			}
		}]
	};

	$routeProvider.
	when("/login", {templateUrl: "partials/login.html", controller: "loginController"}).
	when("/register", {templateUrl: "partials/register.html", controller: "registerController",resolve: registerResolve}).
	when("/dashboard", {templateUrl: "partials/dashboard.html", controller: "dashboardController"}).
	when("/compose", {templateUrl: "partials/compose.html", controller: "composeController"}).
	when("/userControl", {templateUrl: "partials/userControl.html", controller: "userControlController"}).
	when("/status", {templateUrl: "partials/status.html", controller: "statusController"}).
	otherwise({redirectTo: '/dashboard'});
}]);