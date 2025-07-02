// Login form handling
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginText = document.querySelector('.login-text');
    const loading = document.querySelector('.loading');
    const btn = document.querySelector('.btn-login');
    
    if (!username || !password) {
        showAlert('Preencha todos os campos!', 'error');
        return;
    }
    
    // Show loading state
    loginText.style.display = 'none';
    loading.style.display = 'inline-block';
    btn.disabled = true;
    
    // Simulate login process
    setTimeout(() => {
        // Here you would normally make an API call
        // For demo purposes, we'll accept any credentials
        if (username === 'Lucelio' && password === '1234') {
            showAlert('Login realizado com sucesso!', 'success');
            
            // Store user session (for demo)
            sessionStorage.setItem('user', JSON.stringify({
                username: username,
                loginTime: new Date().toISOString()
            }));

            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
            
        } else {
            showAlert('Usuário ou senha inválidos!', 'error');
        }
        
        // Reset button state
        loginText.style.display = 'inline-block';
        loading.style.display = 'none';
        btn.disabled = false;
        
    }, 2000);
});

// Password visibility toggle
document.getElementById('passwordIcon').addEventListener('click', function() {
    const passwordInput = document.getElementById('password');
    const icon = this;
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-lock');
        icon.classList.add('fa-lock-open');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-lock-open');
        icon.classList.add('fa-lock');
    }
});

// Forgot password
document.getElementById('forgotPassword').addEventListener('click', function(e) {
    e.preventDefault();
    alert('Funcionalidade de recuperação de senha será implementada em breve!');
});

// Alert function
function showAlert(message, type) {
    // Remove existing alerts
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
    const alertHTML = `
        <div class="alert ${alertClass} alert-dismissible fade show mt-3" role="alert">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    document.querySelector('.login-container').insertAdjacentHTML('beforeend', alertHTML);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        const alert = document.querySelector('.alert');
        if (alert) {
            alert.remove();
        }
    }, 5000);
}

// Add some interactive effects
document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'translateY(-2px)';
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'translateY(0)';
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Enter to submit form
    if (e.key === 'Enter' && document.activeElement.tagName !== 'BUTTON') {
        document.getElementById('loginForm').dispatchEvent(new Event('submit'));
    }
});

// Welcome animation
window.addEventListener('load', function() {
    const container = document.querySelector('.login-container');
    container.style.opacity = '0';
    container.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
        container.style.transition = 'all 0.6s ease';
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
    }, 100);
});