<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST["email"];
    $password = $_POST["Password"];
    $fp = fopen("..\data\User.json", "r+");
    $existing_data = json_decode(file_get_contents("../data/User.json"), true);
    if (array_key_exists($email, $existing_data)) {
        
        if ($existing_data[$email]["password"] == $password){
           $lname =  $existing_data[$email]["lname"] ;
           $url = '../public/Main/';
            // Weiterleitung zur Ziel-URL
            $nUrl = $url. '?lname=' . urlencode($lname)."&back=".urlencode("true");
            echo $nUrl;
            header('Location:' . $nUrl, true, 301);
            


            // Beenden des Skripts, um sicherzustellen, dass kein weiterer Code ausgeführt wird
            exit();
        }
        
    }
}
?>