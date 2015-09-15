angular.module('CRC.controllers', ['app.directives']).
controller('indexController', function($scope,$location,$window) {


}).
controller('loginController', function($scope,ergastAPIservice) {

    $scope.login = function() {
        ergastAPIservice.sendLoginData($scope.formData);
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
controller('composeController', function($scope,$location,$window,$rootScope,ergastAPIservice) {
    // if(!$rootScope.auth){
    //     $window.location.href = '/#/login';
    // }
    $scope.postBlog = function() {
        ergastAPIservice.postBlog($scope.formData);

    }

}).
controller('dashboardController', function($scope,$location,$window,ergastAPIservice) {


    $scope.userControl = function() {
        $window.location.href = '/#/userControl';
    }

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

    $scope.test = function(){
        alert($scope.usersList[1].modules);
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

   //  $scope.$watch('selected_items', function(newVal) {
   //     alert('columns changed');
   // });

    // $scope.$watch($scope.usersList,function(newValue,oldValue){
    //     alert("working");
    // });



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
    "<button class='btn btn-small'>Select</button>"+
    "<button class='btn btn-small dropdown-toggle' data-ng-click='open=!open;openDropdown()'><span class='caret'></span></button>"+
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