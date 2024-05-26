function saveData(){
    const formData = new FormData(document.getElementById('dataForm'));
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'C:\xampp\htdocs\Code\System\save.php', true);
    xhr.send(formData);
}