const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const paddleHeight = 100;
const paddleWidth = 10;
const paddleSpeed = 5;

let playerY = (canvas.height - paddleHeight) / 2;
let aiY = (canvas.height - paddleHeight) / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 7.5;
let ballSpeedY = 3;

let playerScore = 0;
let aiScore = 0;

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    playerY = e.clientY - rect.top - paddleHeight / 2;
});

function drawText(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = '24px Arial';
    ctx.fillText(text, x, y);
}

class Confetti {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 4 + 2; // Updated size range from 1-3 to 2-6
        this.vx = Math.random() * 2 - 1;
        this.vy = Math.random() * 2 - 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}

function spawnConfetti(x, y, color) {
    const numberOfParticles = 10; // Number of particles to spawn

    for (let i = 0; i < numberOfParticles; i++) {
        confetti.push(new Confetti(x, y, color));
    }
}

const confetti = [];

function draw() {
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#f00';
    ctx.fillRect(10, playerY, paddleWidth, paddleHeight);

    ctx.fillStyle = '#00f';
    ctx.fillRect(canvas.width - 20, aiY, paddleWidth, paddleHeight);

    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(ballX, ballY, 5, 0, Math.PI * 2);
    ctx.fill();

    drawText(playerScore, canvas.width / 2 - 50, 30, '#f00');
    drawText(aiScore, canvas.width / 2 + 30, 30, '#00f');

    for (let i = 0; i < confetti.length; i++) {
        const particle = confetti[i];
        particle.update();
        particle.draw();

        if (particle.x < 0 || particle.x > canvas.width || particle.y < 0 || particle.y > canvas.height) {
            confetti.splice(i, 1);
            i--;
        }
    }

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballY < 0 || ballY > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    if (ballX < 0) {
        aiScore++;
        resetBall();
    } else if (ballX > canvas.width) {
        playerScore++;
        resetBall();
    }

    if (isCollidingWithPlayerPaddle()) {
        ballX = 20;
        spawnConfetti(20, ballY, 'rgba(255, 0, 0, 0.8)'); // Updated to use spawnConfetti()
    }
    
    if (ballX > canvas.width - 30 && ballY > aiY && ballY < aiY + paddleHeight) {
        ballSpeedX = -ballSpeedX;
        spawnConfetti(canvas.width - 30, ballY, 'rgba(0, 0, 255, 0.8)'); // Updated to use spawnConfetti()
    }
    
    aiY += (ballY - (aiY + paddleHeight / 2)) * 0.1;
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = (ballSpeedX > 0 ? -1 : 1) * 7.5;
    ballSpeedY = (Math.random() < 0.5 ? -1 : 1) * 3;
}

function isCollidingWithPlayerPaddle() {
    const nextBallX = ballX + ballSpeedX;
    const nextBallY = ballY + ballSpeedY;
    const paddleTop = playerY;
    const paddleBottom = playerY + paddleHeight;

    if (nextBallX < 20 && nextBallY > paddleTop && nextBallY < paddleBottom) {
        const relativeIntersectY = playerY + paddleHeight / 2 - nextBallY;
        const normalizedIntersectY = relativeIntersectY / (paddleHeight / 2);
        const bounceAngle = normalizedIntersectY * (5 * Math.PI / 12);

        ballSpeedX = 7.5 * Math.cos(bounceAngle);
        ballSpeedY = -7.5 * Math.sin(bounceAngle);

        confetti.push(new Confetti(20, ballY, 'rgba(255, 0, 0, 0.8)'));
        return true;
    }

    return false;
}

function gameLoop() {
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
