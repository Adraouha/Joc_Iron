const totalBombs = 9;
const maxAttempts = 9;
const shuffleDelay = 900;

const bombGrid = document.querySelector("#bombGrid");
const bombs = Array.from(document.querySelectorAll(".bomb"));
const statusText = document.querySelector("#status");
const restartButton = document.querySelector("#restartButton");

let attemptsLeft = maxAttempts;
let extinguisherIndex = 0;
let isWaiting = false;
let hasFinished = false;

function chooseExtinguisher() {
  extinguisherIndex = Math.floor(Math.random() * totalBombs);
}

function resetBombs() {
  bombs.forEach((bomb, index) => {
    bomb.className = "bomb";
    bomb.disabled = false;
    bomb.querySelector("span").textContent = "";
    bomb.setAttribute("aria-label", `Coet d'aniversari ${index + 1}`);
  });
}

function shuffleBoard() {
  const shuffledBombs = bombs
    .map((bomb) => ({ bomb, order: Math.random() }))
    .sort((a, b) => a.order - b.order);

  shuffledBombs.forEach(({ bomb }) => bombGrid.appendChild(bomb));
  chooseExtinguisher();
}

function setBombsDisabled(disabled) {
  bombs.forEach((bomb) => {
    bomb.disabled = disabled;
  });
}

function attemptsLabel(amount) {
  return amount === 1 ? "1 intent" : `${amount} intents`;
}

function missingAttemptsText(amount) {
  return amount === 1 ? "Et falta 1 intent" : `Et falten ${amount} intents`;
}

function remainingAttemptsText(amount) {
  return amount === 1 ? "Et queda 1 intent" : `Et queden ${amount} intents`;
}


function createAudioContext() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;

  if (!AudioContext) {
    return null;
  }

  return new AudioContext();
}

function playNoiseBurst(audioContext, startTime, duration, volume, filterFrequency) {
  const sampleRate = audioContext.sampleRate;
  const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < data.length; i += 1) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = audioContext.createBufferSource();
  const filter = audioContext.createBiquadFilter();
  const gain = audioContext.createGain();

  noise.buffer = buffer;
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(filterFrequency, startTime);
  gain.gain.setValueAtTime(volume, startTime);
  gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(audioContext.destination);
  noise.start(startTime);
}

function playExplosionSound() {
  const audioContext = createAudioContext();

  if (!audioContext) {
    return;
  }

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const startTime = audioContext.currentTime;

  oscillator.type = "sawtooth";
  oscillator.frequency.setValueAtTime(95, startTime);
  oscillator.frequency.exponentialRampToValueAtTime(28, startTime + 0.55);

  gain.gain.setValueAtTime(0.7, startTime);
  gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.55);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + 0.55);

  playNoiseBurst(audioContext, startTime, 0.5, 0.85, 700);
}

function playApplauseSound() {
  const audioContext = createAudioContext();

  if (!audioContext) {
    return;
  }

  const startTime = audioContext.currentTime;

  for (let i = 0; i < 12; i += 1) {
    const clapTime = startTime + i * 0.09 + Math.random() * 0.04;
    playNoiseBurst(audioContext, clapTime, 0.06, 0.28, 1800 + Math.random() * 1200);
  }
}

function finishGame(message, selectedBomb, className, label) {
  hasFinished = true;
  selectedBomb.classList.add(className);
  selectedBomb.querySelector("span").textContent = label;
  statusText.textContent = message;
  setBombsDisabled(true);
  restartButton.classList.add("visible");
}

function handleBombClick(event) {
  const selectedBomb = event.currentTarget;
  const selectedIndex = bombs.indexOf(selectedBomb);

  if (isWaiting || hasFinished) {
    return;
  }

  if (selectedIndex === extinguisherIndex) {
    playApplauseSound();
    finishGame("Salvat! Enhorabona, estàs fora de perill!", selectedBomb, "found", "Enhorabona!");
    return;
  }

  attemptsLeft -= 1;
  playExplosionSound();
  selectedBomb.classList.add("exploded");
  selectedBomb.querySelector("span").textContent = "BOOM!";

  if (attemptsLeft === 0) {
    finishGame("Ep!! Has mort! No et queda cap intent.", selectedBomb, "exploded", "BOOM!");
    return;
  }

  statusText.textContent = `Ep!! Has mort! ${missingAttemptsText(attemptsLeft)}.`;
  isWaiting = true;
  setBombsDisabled(true);

  setTimeout(() => {
    resetBombs();
    shuffleBoard();
    statusText.textContent = `Els coets s'han mogut. ${remainingAttemptsText(attemptsLeft)}.`;
    isWaiting = false;
  }, shuffleDelay);
}

function startGame() {
  attemptsLeft = maxAttempts;
  isWaiting = false;
  hasFinished = false;
  statusText.textContent = `Tens ${attemptsLabel(attemptsLeft)}.`;
  restartButton.classList.remove("visible");
  resetBombs();
  shuffleBoard();
}

bombs.forEach((bomb) => {
  bomb.addEventListener("click", handleBombClick);
});

restartButton.addEventListener("click", startGame);

startGame();
