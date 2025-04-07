// Run once the page has fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('quizLobbyCanvas');
    const ctx = canvas.getContext('2d');
    const lobbyContainer = document.getElementById('quiz-container'); 
    const loadingScreen = document.getElementById('loading-screen');
    const progressBar = document.getElementById("progress-bar");
    const homeButton = document.getElementById("homeButton");

    // Go back to main lobby when Home button is clicked
    if (homeButton) {
        homeButton.addEventListener("click", () => {
            window.location.href = "/lobby"; 
        });
    } else {
        console.error("Home button not found in the DOM.");
    }

    let progress = 0;
    let backgroundLoaded = false; // Track if the background is fully loaded

    // Hide the quiz container until loading finishes
    lobbyContainer.style.display = 'none'; 

    // Animate the progress bar during loading
    function updateProgress() {
        if (progress < 100) {
            progress += Math.random() * 100; 
            progressBar.style.width = `${progress}%`;
            setTimeout(updateProgress, 100); 
        }
    }

    updateProgress(); // Start loading animation

    // Set the canvas size to match the screen
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        if (backgroundLoaded) {
            drawBackground();
        }
    }

    // Load background image
    const backgroundImg = new Image();
    backgroundImg.src = '/static/Images/grass_and_sky.png';

    // Once the background image loads
    backgroundImg.onload = () => {
        backgroundLoaded = true; 
        checkIfFullyLoaded(); // Continue only when progress & image are ready
    };

    // Draw background image to canvas
    function drawBackground() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    }

    // Only show the lobby when both loading is done and image is loaded
    function checkIfFullyLoaded() {
        if (progress >= 100 && backgroundLoaded) {
            setTimeout(() => {
                loadingScreen.style.display = 'none'; 
                lobbyContainer.style.display = 'block'; 
                resizeCanvas();
                window.addEventListener('resize', resizeCanvas);
            }, 500);
        } else {
            setTimeout(checkIfFullyLoaded, 100);
        }
    }

    resizeCanvas(); // Set initial canvas size
});

// Start the selected quiz and go to its page
function startQuiz(quiz) {
    window.location.href = `/quiz?quiz=${quiz}`;
}
