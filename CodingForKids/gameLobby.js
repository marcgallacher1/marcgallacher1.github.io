// Run this once the page has fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameLobbyCanvas');
    const ctx = canvas.getContext('2d');
    const lobbyContainer = document.getElementById('level-container'); 
    const loadingScreen = document.getElementById('loading-screen');
    const progressBar = document.getElementById("progress-bar");
    const homeButton = document.getElementById("homeButton");

  // Go back to main lobby when home button is clicked
  if (homeButton) {
    homeButton.addEventListener("click", () => {
        window.location.href = "/lobby"; 
    });
    } else {
    console.error("Home button not found in the DOM.");
    }

    let progress = 0;
    let backgroundLoaded = false; // Flag to track if the image is ready

    // Hide the level selection screen while loading
    lobbyContainer.style.display = 'none'; 

    // Animate the progress bar with random increments
    function updateProgress() {
        if (progress < 100) {
            progress += Math.random() * 100; 
            progressBar.style.width = `${progress}%`;

            setTimeout(updateProgress, 100); 
        }
    }

    updateProgress(); // Start loading animation

    // Resize canvas to match screen size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        if (backgroundLoaded) {
            drawBackground();
        }
    }

    // Load the background image
    const backgroundImg = new Image();
    backgroundImg.src = '/static/Images/grass_and_sky.png';

    // Once the background image loads
    backgroundImg.onload = () => {
        backgroundLoaded = true; 
        checkIfFullyLoaded(); // Continue only when progress & image are ready
    };

    // Draw the background image onto the canvas
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
            }, 500); // Small delay for smoother transition
        } else {
            setTimeout(checkIfFullyLoaded, 100); // Keep checking until ready
        }
    }

    // Get user progress (which levels are unlocked) from the server
    fetch('/get-progress')
        .then(response => response.json())
        .then(data => {
            if (data.progress) {
                // Enable level buttons based on user's progress
                document.getElementById("tutorial-btn").disabled = false;
                document.getElementById("level1-btn").disabled = !data.progress.tutorial;
                document.getElementById("level2-btn").disabled = !data.progress.level_1;
                document.getElementById("level3-btn").disabled = !data.progress.level_2;
                document.getElementById("level4-btn").disabled = !data.progress.level_3;
            }
            progress = 100; // Mark loading as done
            checkIfFullyLoaded();
        })
        .catch(error => {
            console.error("Error fetching progress:", error);
        });

    // Set initial canvas size
    resizeCanvas(); 
});

