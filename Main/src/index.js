angular.module('myApp', [])
.controller('myCtrl', ['$scope', async function($scope) {
    const user = await profileData();
    console.log(user);
    console.log(user.name);

    $scope.$apply(function() {
        $scope.message = user.name;
    });

    $scope.updateMessage = function() {
        $scope.message = 'AAAAAAAAA';
    };
}]);

async function profileData() {
    try {
        const response = await fetch('/profile', {
            method: 'GET',
            credentials: 'include', // Wenn Sie Cookies oder Sitzungsinformationen senden möchten
            headers: {
                'Content-Type': 'application/json',
                // Fügen Sie hier ggf. Authentifizierungstokens hinzu
                // 'Authorization': 'Bearer ' + token,
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);
            return data;
        } else {
            console.error('Failed to fetch profile:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
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