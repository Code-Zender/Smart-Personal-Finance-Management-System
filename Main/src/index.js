angular.module('myApp', [])
.controller('myCtrl', ['$scope', function($scope) {
    if(LoggedIn()){
      $scope.message = LoggedInUser();  
      let urlParams = new URLSearchParams(window.location.search);
      if(urlParams.get("back")){
      $scope.back = "back"
    }
    }else{
      $scope.back = ""
    }
    
    $scope.updateMessage = function() {
        $scope.message = 'AAAAAAAAA';
      };
  }]);
function LoggedIn(){
    return true;
}
function LoggedInUser(){
  let lname = getQueryParam('lname');
  return lname
}
function getQueryParam(param) {
  let urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}


