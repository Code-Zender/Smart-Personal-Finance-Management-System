async function submitForm() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    const data = {
      username: username,
      password: password
    };
  
    try {
      const response = await fetch('http://localhost:3000/register', { // Ensure the correct URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
  
      if (response.ok) {
        const result = await response.json();
        alert(result.message);
      } else {
        const error = await response.json();
        alert('Error: ' + error.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  