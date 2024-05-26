import { saveAs } from 'file-saver';

export function register() {
    if (checkPassword()) {
        let jsonData = {
            "fname": document.getElementById("fname").value,
            "lname": document.getElementById("lname").value,
            "email": document.getElementById("email").value
        };

        let jsonString = JSON.stringify(jsonData, null, 2);

        let blob = new Blob([jsonString], { type: 'application/json' });

        saveAs(blob, 'User.json');
    }
}

function checkPassword() {
    var password = document.getElementById("Password").value;
    var rpassword = document.getElementById("rPassword").value;
    var errorText = document.getElementById("FalsePassword");

    if (password === rpassword) {
        errorText.innerHTML = "";
        return true;
    } else {
        errorText.innerHTML = "Passwords do not match!";
        errorText.style.color = "red";
        return false;
    }
}
