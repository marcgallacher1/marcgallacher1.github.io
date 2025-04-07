// Hides the error message text and styling
function clearErrorMessage(element) {
    if (element) {
        element.innerHTML = "";
        element.style.display = "none";
    }
}

// Switches the view from the login form to register form
function navigateToRegister() {
    const loginContainer = document.getElementById('login-container');
    const registerContainer = document.getElementById('register-container');
    const loginError = document.getElementById('login-error'); 
    const registerError = document.getElementById('register-error');
    const registerForm = document.getElementById('register-form');

    // Clear any error messages
    clearErrorMessage(loginError);
    clearErrorMessage(registerError);

    // Reset input fields
    registerForm.reset();

    // Hide login form, show register form
    loginContainer.style.display = 'none';
    registerContainer.style.display = 'block';
}

// Switches the view from the register form back to the login form
function navigateToLogin() {
    const loginContainer = document.getElementById('login-container');
    const registerContainer = document.getElementById('register-container');
    const loginError = document.getElementById('login-error'); 
    const registerError = document.getElementById('register-error');

    clearErrorMessage(loginError);
    clearErrorMessage(registerError);

    // Hide register form, show login form
    registerContainer.style.display = 'none';
    loginContainer.style.display = 'block';
}


// Runs as soon as the page loads
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('lobbyCanvas');
    const ctx = canvas.getContext('2d');
    const lobbyContainer = document.getElementById('lobby-container');
    const loadingScreen = document.getElementById('loading-screen');
    const progressBar = document.getElementById("progress-bar");

    let progress = 0;

    // Hide the main lobby at first
    lobbyContainer.style.display = 'none';
    
    // Fakes a loading bar effect with increasing progress
    function updateProgress() {
        progress += Math.random() * 100; // Increment progress randomly for a smooth effect
        progressBar.style.width = `${progress}%`;

        if (progress < 100) {
            // Keep updating if not yet full
            setTimeout(updateProgress, 100); 
        } else {
             // Once full, hide loading screen and show the lobby
            setTimeout(() => {
                loadingScreen.style.display = "none"; 
                lobbyContainer.style.display = "block"; 
            }, 300); 
             // Check if the user is already logged in
            checkSessionStatus();
        }
    }

    updateProgress(); // Start the loading animation

    // Set the canvas size to match the screen size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Load the background image
    const backgroundImg = new Image();
    backgroundImg.src = '/static/Images/grass_and_sky.png';

    // Resize the canvas when the window size changes
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Redraw the background if the image is already loaded
        if (backgroundImg.complete) {
            drawBackground();
        }
    }

    // Draw the background image onto the canvas
    function drawBackground() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    }

    // When the background image finishes loading
    backgroundImg.onload = () => {

        // Hide loading screen and show the lobby
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        } else {
            console.error('Loading screen element not found.');
        }

        if (lobbyContainer) {
            lobbyContainer.style.display = 'block';
        } else {
            console.error('Lobby container element not found.');
        }

        // Resize the canvas and re-draw if window resizes
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    };

    // If the background image fails to load
    backgroundImg.onerror = () => {
        console.error('Failed to load the background image.');
    };

    // Check if the user is already logged in
    async function checkSessionStatus() {
        try {
            const resp = await fetch('/check_session');
            const data = await resp.json();

            // If logged in, show play button; if not, show login
            if (data.logged_in) {
                showPlayContainer();
            } else {
                showLoginContainer();
            }
        } catch (err) {
            console.error("Error fetching /check_session:", err);
            showLoginContainer();
        }
    }

    // Show the play screen and hide login
    function showPlayContainer() {
        document.getElementById('play-container').style.display  = 'flex';
        document.getElementById('login-container').style.display = 'none';
    }

    // Show the login screen and hide play screen
    function showLoginContainer() {
        document.getElementById('play-container').style.display  = 'none';
        document.getElementById('login-container').style.display = 'block';

        // Clear password input for security
        const passwordInput = document.getElementById('password');
        if (passwordInput) {
            passwordInput.value = '';
        }
        
    }

    // Obtain all required elements from the page
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const loginContainer = document.getElementById('login-container');
    const registerContainer = document.getElementById('register-container');
    const playContainer = document.getElementById('play-container');
    const playButton = document.getElementById('play-button');
    const quizButton = document.getElementById('quiz-button');
    const logoutButton = document.getElementById('logout-button');
    const registerForm = document.getElementById('register-form');
    let registerError = document.getElementById('register-error');

    // Ensure the error message element exists
    if (!registerError) {
        registerError = document.createElement('p');
        registerError.id = 'register-error';
        registerError.style.color = 'red';
        registerError.style.display = 'none';
        registerForm.appendChild(registerError);
    }

    // Handle login form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            // Send login request to the server
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            // If login works, go to play screen
            if (response.ok) {
                clearErrorMessage(loginError);
                showPlayContainer();
            } else {
                const errorData = await response.json();
                showErrorMessage(loginError, errorData.error || 'Invalid username or password.');
            }
        } catch (error) {
            console.error('Error during login:', error);
            showErrorMessage(loginError, 'An error occurred. Please try again.');
        }
    });

    // Handle logout when user clicks logout button
    logoutButton.addEventListener('click', async () => {
        try {
            // Make a POST request to /logout
            const response = await fetch('/logout', {
                method: 'GET'
            });

            if (response.ok) {
                // The user is now logged out
                showLoginContainer();
            } else {
                console.error("Logout request failed. Status:", response.status);
            }
        } catch (error) {
            console.error("Error during logout:", error);
        }
    });

    // Handle register form submission
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Stop form from refreshing the page

        // Get all input values from the register form
        const username = document.getElementById('reg-username').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const yearOfSchool = document.getElementById('reg-year').value;

        // Check if password meets security rules
        const passwordConditions = validatePassword(password);

        if (!passwordConditions) {
            showErrorMessage(registerError, "Password must be at least 8 characters, include an uppercase letter, a number, and a special character.");
            return;
        }

        // Check if both password inputs match
        if (password !== confirmPassword) {
            showErrorMessage(registerError, "Passwords do not match.");
            return;
        }

        try {
            // Send registration details to the server
            const response = await fetch('/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password, year_of_school: yearOfSchool }),
            });

            // Show success message and switch to login screen
            if (response.ok) {
                registerError.innerHTML = '✅ Account created successfully! Redirecting to login...';
                registerError.style.color = 'green';
                registerError.style.display = 'block';

                setTimeout(() => {
                    registerContainer.style.display = 'none';
                    loginContainer.style.display = 'block';
                }, 2000);
            } else {
                if (responseData.error) {
                    showErrorMessage(registerError, responseData.error);
                } else {
                    showErrorMessage(registerError, 'An error occurred. Please try again.');
                }
            }
        } catch (error) {
            console.error('Error during registration:', error);
            showErrorMessage(registerError, 'An error occurred. Please try again.');
        }
    });

    // Show message if user tried to access game while not logged in
    const params = new URLSearchParams(window.location.search);
    if (params.get("error") === "unauthorized") {
        showUnauthorizedMessage();
        // Remove error message from URL to avoid showing it again
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Display a message telling the user to log in
    function showUnauthorizedMessage() {
        if (loginError) {
            showErrorMessage(loginError, "You must log in before accessing the game.");
        }
    }

    // Checks if the password is strong enough
    function validatePassword(password) {
        const minLength = /.{8,}/;
        const hasUppercase = /[A-Z]/;
        const hasNumber = /\d/;
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

        return minLength.test(password) && hasUppercase.test(password) && hasNumber.test(password) && hasSpecialChar.test(password);
    }

    function showErrorMessage(element, message) {
        element.innerHTML = `<i class="bi bi-exclamation-circle-fill error-icon"></i> ${message}`;
        element.style.display = "flex";
    }

    function clearErrorMessage(element) {
        element.innerHTML = "";
        element.style.display = "none";
    }

    // Button Routes
    playButton.addEventListener('click', () => {
        window.location.href = '/gameLobby';
    });

    quizButton.addEventListener('click', ()=> {
        window.location.href = '/quizLobby';
    });
});