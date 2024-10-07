const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startPauseButton = document.getElementById("startPauseButton");

let ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
let isGameRunning = false;

let obstacles = [];
let level = 1;

// Load the bounce sound
const bounceSound = new Audio('bounce.mp3'); // Path to your sound file

// Set the canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Create obstacles
function createObstacles() {
    obstacles = [];
    for (let i = 0; i < level * 3; i++) { // Increase number of obstacles with level
        const width = Math.random() * 100 + 20; // Width between 20-120
        const height = Math.random() * 100 + 20; // Height between 20-120
        const x = Math.random() * (canvas.width - width);
        const y = Math.random() * (canvas.height - height);
        obstacles.push({ x, y, width, height });
    }
}

// Draw the ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#6200ee"; // Ball color
    ctx.fill();
    ctx.closePath();
}

// Draw obstacles
function drawObstacles() {
    ctx.fillStyle = "#03dac5"; // Obstacle color
    for (let obs of obstacles) {
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    }
}

// Collision detection
function collisionDetection() {
    for (let obs of obstacles) {
        if (x + ballRadius > obs.x && x - ballRadius < obs.x + obs.width &&
            y + ballRadius > obs.y && y - ballRadius < obs.y + obs.height) {
            dy = -dy; // Bounce back on collision
            bounceSound.play(); // Play the bounce sound on collision
            x += dx; // Adjust ball position
            y += dy;
            level++;
            createObstacles();
        }
    }
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawObstacles();
    collisionDetection();

    // Ball movement
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
        bounceSound.play(); // Play sound on wall bounce
    }
    if (y + dy < ballRadius) {
        dy = -dy;
        bounceSound.play(); // Play sound on ceiling bounce
    } else if (y + dy > canvas.height - ballRadius) {
        isGameRunning = false; // Stop the game if it hits the bottom
        alert("Game Over! Your level: " + level);
        resetGame();
    }

    x += dx;
    y += dy;

    if (isGameRunning) {
        requestAnimationFrame(draw);
    }
}

// Reset the game
function resetGame() {
    level = 1;
    dx = 2;
    dy = -2;
    x = canvas.width / 2;
    y = canvas.height - 30;
    createObstacles();
}

// Start/Pause button functionality
startPauseButton.addEventListener("click", () => {
    isGameRunning = !isGameRunning;
    startPauseButton.innerText = isGameRunning ? "Pause" : "Start";
    if (isGameRunning) {
        draw();
    }
});

// Adjust canvas on resize
window.addEventListener('resize', () => {
    resizeCanvas();
    resetGame(); // Reset game on resize
});

resizeCanvas(); // Initialize canvas size
createObstacles(); // Create initial obstacles
