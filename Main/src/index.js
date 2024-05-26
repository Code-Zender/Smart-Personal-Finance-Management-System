angular.module('myApp', [])
.controller('myCtrl', ['$scope', function($scope) {
    if(LoggedIn()){
      $scope.message = LoggedInUser();  
    }
    
    $scope.updateMessage = function() {
        $scope.message = 'AAAAAAAAA';
      };
  }]);
function LoggedIn(){
    return true;
}
function LoggedInUser(){
    return "Marc"
}