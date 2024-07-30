async function toggleMenu() {
    profile = await profileData()
    config = await loadConfig()
  
    document.getElementById('Link').href = config.index.loginUrl;
    document.getElementById('Link2').href = config.index.registerUrl;
   

    let test = document.getElementById('op1').href

    if(profile && !test){
        document.getElementById('op1').innerHTML= "<a id='a1' href="+config.index.charts+">Charts</a>";
        document.getElementById('op2').innerHTML= "<a id='a2' href="+config.index.addFinances+">Add Finance Data</a>";
        document.getElementById('op3').innerHTML= "<a id='a3' href="+config.index.displayData+">Display Data</a>";
        document.getElementById('op4').innerHTML= "<a id='a4' href="+config.index.profileUrl+">Profile</a>";
        
    }else if(!profile){
        document.getElementById('op5').hidden = true
        document.getElementById('op1').innerHTML= "<a id='a1' href="+config.index.aboutUS+">about us</a>";
        document.getElementById('op2').innerHTML= "<a id='a2' href="+config.index.aboutThisProgramm+">about this programm</a>";
        document.getElementById('op3').innerHTML= "<a id='a3' href="+config.index.privacyPolicy+">privacy policy</a>";
        document.getElementById('op4').innerHTML= "<a id='a4' href="+config.index.ContactUS+">Contact us</a>";
    }

    const menuBtn = document.querySelector('.menu-btn');
    const menuOptions = document.querySelector('.menu-options');
    menuBtn.classList.toggle('open');
    menuOptions.classList.toggle('open');
  }
async function loadConfig() {

    try {
        const response = await fetch('/config');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const config = await response.json();
        return config
    } catch (error) {
        console.error('Error loading config:', error);
    }
}

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
            if(data != "Not authenticated"){
                return data;
            }else{
                return
            }
            
        } else {
            console.error('Failed to fetch profile:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function Logout(){
    try {
        const response = await fetch('/logout', {
            method: 'GET',
            credentials: 'include', // Wenn Sie Cookies oder Sitzungsinformationen senden möchten
            headers: {
                'Content-Type': 'application/json',
                // Fügen Sie hier ggf. Authentifizierungstokens hinzu
                // 'Authorization': 'Bearer ' + token,
            }
        });

        if (response.ok) {
            
        } else {
            console.error('Failed to fetch:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
    window.location.href = "/"
}