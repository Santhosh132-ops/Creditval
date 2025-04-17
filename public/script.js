


document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');
    const regMessage = document.getElementById('regMessage');
  
    // 📝 Helper to show message
    const showMessage = (element, message, type) => {
      element.textContent = message;
      element.className = `message-box ${type === 'success' ? 'message-success' : 'message-error'}`;
      element.style.display = 'block';
    };
  
    // 🚀 Handle Signup
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const data = {
        username: document.getElementById('regUsername').value,
        email: document.getElementById('regEmail').value,
        mobile: document.getElementById('regMobile').value,
        password: document.getElementById('regPassword').value
      };
  
      try {
        const res = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
  
        const result = await res.json();
  
        if (res.ok) {
            regMessage.className = 'message-box message-success';
            regMessage.textContent = result.message || 'Registration successful!';
            regMessage.style.display = 'block';
          
            signupForm.reset();
          
            // ✅ After 1.5 seconds, switch to login view
            setTimeout(() => {
                // Redirect after signup
                window.location.href = "/dashboard.html";
              }, 1500);
              
        } else {
          showMessage(regMessage, result.message || 'Registration failed 😢', 'error');
        }
      } catch (err) {
        showMessage(regMessage, 'Something went wrong. ❌', 'error');
      }
    });
  
    // 🔐 Handle Login
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const data = {
        email: loginForm.email.value,
        password: loginForm.pswd.value
      };
  
      try {
        const res = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
  
        const result = await res.json();
  
        if (res.ok) {
          
          

          window.location.href = "/dashboard.html";
          // Redirect or UI update here
        } else {
          alert(result.message || 'Login failed.');
        }
      } catch (err) {
        alert('Login error. Try again later.');
      }
    });
  });
  