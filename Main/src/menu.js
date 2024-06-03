function toggleMenu() {
    if (!LoggedIn()){
        for(let i=1; i <= 3; i++){
            op = document.createElement('a');
            op.style.textDecoration = "none"
            op.style.color="#fff"
            switch (i){
                case 1: op.href = "../../information/about.html";
                        op.innerHTML="About this Programm";
                        con = document.getElementById("op1");
                        break;
                case 2: op.href = "../../information/aboutUS.html";
                        op.innerHTML="About us";
                        con = document.getElementById("op2"); 
                        break;
                case 3: op.href = "../../information/privacy.html";
                        op.innerHTML="privacy policy";
                        con = document.getElementById("op3"); 
                        break;
            }
            con.appendChild(op)
        }
    }else{
        for(let i=1; i <= 4; i++){
            op = document.createElement('a');
            op.style.textDecoration = "none"
            op.style.color="#fff"
            switch (i){
                case 1: op.href = "../functions/charts.html?lname="+getQueryParam('lname');
                        op.innerHTML="About this Programm";
                        con = document.getElementById("op1");
                        break;
                case 2: op.href = "../../information/aboutUS.html?"+getQueryParam('lname');
                        op.innerHTML="About us";
                        con = document.getElementById("op2"); 
                        break;
                case 3: op.href = "../../information/privacy.html?"+getQueryParam('lname');
                        op.innerHTML="privacy policy";
                        con = document.getElementById("op3"); 
                        break;
                case 4: op.href = "../../information/privacy.html?"+getQueryParam('lname');
                        op.innerHTML="privacy policy";
                        con = document.getElementById("op3"); 
                        break;
            }
            con.appendChild(op)
        }
    }






    const menuBtn = document.querySelector('.menu-btn');
    const menuOptions = document.querySelector('.menu-options');
    
    menuBtn.classList.toggle('open');
    menuOptions.classList.toggle('open');
  }
  