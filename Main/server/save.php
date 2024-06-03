<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get the form data
    $fname = $_POST["fname"];
    $lname = $_POST["lname"];
    $email = $_POST["email"];
    $password = $_POST["Password"];

    // Validate the form data (e.g., check if passwords match)
    if ($password == $_POST["rPassword"]) {
        // Read the existing JSON data from the file
        $fp = fopen("..\data\User.json", "r+");
        $existing_data = json_decode(file_get_contents("../data/User.json"), true);

        // Check if the email already exists
        if (array_key_exists($email, $existing_data)) {
            // Update the data for the existing user
            $existing_data[$email]["fname"] = $fname;
            $existing_data[$email]["lname"] = $lname;
            $existing_data[$email]["password"] = $password;
        } else {
            // Add the new data as a new user
            $new_data = array(
                "fname" => $fname,
                "lname" => $lname,
                "email" => $email,
                "password" => $password,
                "signUpTime" => date('Y-m-d H:i:s', $timestamp)
            );
            $existing_data[$email] = $new_data;
        }

        // Convert the updated data to JSON
        $json_data = json_encode($existing_data, JSON_PRETTY_PRINT);

        // Write the updated data to the file
        fseek($fp, 0);
        fwrite($fp, $json_data);
        fclose($fp);

        // Set SMTP and smtp_port settings using ini_set()

        // Ziel-URL zur Weiterleitung
        $url = '../public/Main/';

        // Weiterleitung zur Ziel-URL
        $nUrl = $url. '?lname=' . urlencode($lname);
        
        header('Location:' . $nUrl, true, 301);
        


        // Beenden des Skripts, um sicherzustellen, dass kein weiterer Code ausgeführt wird
        exit();


        

    }
}
?>