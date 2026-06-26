// Variables to control game state
let gameRunning = false; // Keeps track of whether game is active or not
let dropMaker; // Will store our timer that creates drops regularly
let countdown;
const GAME_DURATION = 30;
let timeLeft = GAME_DURATION;
let score = 0; // Track the player's score
const timerElement = document.getElementById("timer");
const scoreElement = document.getElementById("score");

// Winning and losing messages
const winningMessages = [
  "You're a water-saving hero! 💧",
  "Fantastic catch! Help us save water!",
  "Amazing! You've made a difference!",
  "You crushed it! Keep up the great work!",
  "Outstanding! You're a water drop champion!"
];

const losingMessages = [
  "Try again! Every drop counts! 💧",
  "Don't worry, you can do better next time!",
  "Keep practicing! You'll get there!",
  "Almost there! Give it another shot!",
  "Keep trying! Every effort helps!"
];

// Function to generate a clean, procedural popping sound
function playPopSound() {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = "sine";
  // Start with a short pitch slide upward for a crisp "pop"
  oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.05);

  // Fast volume fade out so it sounds like a quick click/pop
  gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 0.08);
}

// Wait for button click to start the game
document.getElementById("start-btn").addEventListener("click", startGame);

function startGame() {
  // Prevent multiple games from running at once
  if (gameRunning) return;

  gameRunning = true;
  score = 0; // Reset score at start of new game
  scoreElement.textContent = score;
  timeLeft = GAME_DURATION;
  timerElement.textContent = timeLeft;

  // Create new drops every second (1000 milliseconds)
  dropMaker = setInterval(createDrop, 1000);

  countdown = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(countdown);
      endGame();
    }
  }, 1000);
}

function endGame() {
  // Stop creating new drops.
  if (typeof dropMaker !== "undefined") {
    clearInterval(dropMaker);
  }

  gameRunning = false;
  
  // Determine if player won (20 or more points) and show appropriate message
  let message;
  if (score >= 20) {
    const randomIndex = Math.floor(Math.random() * winningMessages.length);
    message = `🎉 ${winningMessages[randomIndex]} Final Score: ${score}`;
  } else {
    const randomIndex = Math.floor(Math.random() * losingMessages.length);
    message = `${losingMessages[randomIndex]} Final Score: ${score}`;
  }
  
  alert(message);
}

function createDrop() {
  // Create a new div element that will be our water drop
  const drop = document.createElement("div");

  // 50/50 chance to create a red drop or a blue drop
  if (Math.random() < 0.5) {
    drop.classList.add("red-drop");
  } else {
    drop.classList.add("water-drop");
  }

  // Make drops different sizes for visual variety
  const initialSize = 60;
  const sizeMultiplier = Math.random() * 0.8 + 0.5;
  const size = initialSize * sizeMultiplier;
  drop.style.width = drop.style.height = `${size}px`;

  // Position the drop randomly across the game width
  // Subtract 60 pixels to keep drops fully inside the container
  const gameWidth = document.getElementById("game-container").offsetWidth;
  const xPosition = Math.random() * (gameWidth - 60);
  drop.style.left = xPosition + "px";

  // Make drops fall for 4 seconds
  drop.style.animationDuration = "4s";

  // Click: play pop sound, burst animation, then remove drop
  drop.addEventListener("click", () => {
    // Only add to score if not already burst (prevent double-clicking)
    if (!drop.classList.contains("burst")) {
      score++; // Increment score by 1 for each drop clicked
      scoreElement.textContent = score; // Update score display
      playPopSound();
      drop.classList.add("burst");

      setTimeout(() => {
        drop.remove();
      }, 200);
    }
  });

  // Add the new drop to the game screen
  document.getElementById("game-container").appendChild(drop);

  // Remove drops that reach the bottom (weren't clicked)
  drop.addEventListener("animationend", () => {
    drop.remove(); // Clean up drops that weren't caught
  });
}
