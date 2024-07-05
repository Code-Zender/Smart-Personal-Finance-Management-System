angular.module('myApp', [])
.controller('myCtrl', ['$scope', function($scope) {
    const token = localStorage.getItem('token');
    if (token) {
        const user = parseJwt(token);
        $scope.message = user.name;
        let urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get("back")) {
            $scope.back = "back";
        } else {
            $scope.back = "";
        }
    } else {
        $scope.back = "";
    }
    
    $scope.updateMessage = function() {
        $scope.message = 'AAAAAAAAA';
    };
}]);

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

// Function to load JSON config file
async function loadConfig() {
    console.log("TEST");
    try {
        const response = await fetch('/config');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const config = await response.json();
        document.getElementById('Link').href = config.index.loginUrl;
        document.getElementById('Link2').href = config.index.registerUrl;
    } catch (error) {
        console.error('Error loading config:', error);
    }
}

// Load config on page load
window.addEventListener('load', loadConfig);