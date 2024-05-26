<?php
    $data = json_decode(file_get_contents('php://input'), true);
    $jsonFile = 'C:\Users\marcf_0bgdv0x\OneDrive\Dokumente\Code\GitHub\Smart-Personal-Finance-Management-System\Main\data\User.json';
    file_put_contents($jsonFile, json_encode($data));
?>