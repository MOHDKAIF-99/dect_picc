/* ==========================================================
   1. PROCEDURAL SOUND SYNTHESIS (Web Audio API)
   ========================================================== */
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function playSound(type) {
  try {
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'tick') {
      // Typewriter key click
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.04);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === 'seal') {
      // Wax crack & harmonic chime
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(520, now + 0.35);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      osc.start(now);
      osc.stop(now + 0.7);
    }
  } catch (e) {
    console.log("Audio waiting for user gesture");
  }
}

/* ==========================================================
   2. DETECTIVE ENVELOPE GAME ENGINE
   ========================================================== */
const detectiveClues = [
  {
    label: "Question 01 &bull; For You",
    question: "Be honest with me: What was the exact expression on your face when you first opened this link?",
    options: [
      "I was completely confused, then started smiling ✦",
      "“Wait, did you actually code a whole website for me?!”",
      "Trying to act calm, but my heart definitely skipped a beat"
    ]
  },
  {
    label: "Question 02 &bull; For You",
    question: "When you look at these two photos of yourself up there, what's the first thought that comes to mind?",
    options: [
      "I didn't realize someone was paying this much attention ✦",
      "I look pretty classic in black and white, not going to lie",
      "You picked two really good ones of me
    ]
  },
  {

    label: "Question 02 &bull; What Makes Your Day",
    question: "What's one little thing that never fails to put you in a good mood no matter what?",
    options: [
      "Unexpected sweet gestures like this website ✦",
      "Good food, good music, and zero drama",
      "A long, genuine conversation at the end of a long day"
    ]
  }
];

let currentClue = 0;
const clueCard = document.getElementById('clueCard');
const clueIndexLabel = document.getElementById('clueIndexLabel');
const clueQuestionText = document.getElementById('clueQuestionText');
const optionsContainer = document.getElementById('optionsContainer');
const envelopeWrapper = document.getElementById('envelopeWrapper');
const waxSealBtn = document.getElementById('waxSealBtn');
const noirLetter = document.getElementById('noirLetter');

function renderClue(index) {
  const data = detectiveClues[index];
  clueIndexLabel.innerText = data.label;
  clueQuestionText.innerText = data.question;
  optionsContainer.innerHTML = '';

  data.options.forEach((optText) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span>${optText}</span> <span style="color:var(--dark-crimson);">&rarr;</span>`;
    btn.onclick = () => selectAnswer(index);
    optionsContainer.appendChild(btn);
  });

  // Update pills
  for (let i = 1; i <= 3; i++) {
    const pill = document.getElementById(`stepPill${i}`);
    pill.classList.remove('active');
    if (i - 1 < index) pill.classList.add('completed');
    if (i - 1 === index) pill.classList.add('active');
  }
}

function selectAnswer(index) {
  playSound('tick');
  if (index < detectiveClues.length - 1) {
    currentClue++;
    renderClue(currentClue);
  } else {
    // All 3 clues completed
    for (let i = 1; i <= 3; i++) {
      document.getElementById(`stepPill${i}`).className = 'step-pill completed';
    }
    clueCard.style.display = 'none';
    envelopeWrapper.style.display = 'block';
  }
}

waxSealBtn.addEventListener('click', () => {
  playSound('seal');
  waxSealBtn.style.transform = 'scale(0.85) rotate(15deg)';
  waxSealBtn.style.opacity = '0.4';
  waxSealBtn.style.pointerEvents = 'none';

  setTimeout(() => {
    envelopeWrapper.style.display = 'none';
    noirLetter.style.display = 'block';
    noirLetter.scrollIntoView({ behavior: 'smooth', block: 'center' });
    burstPetals();
  }, 400);
});

// Initialize with the first clue
renderClue(0);

/* ==========================================================
   3. FALLING CRIMSON ROSE PETALS (Canvas Physics)
   ========================================================== */
const canvas = document.getElementById('petalsCanvas');
const ctx = canvas.getContext('2d');
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

const petals = [];
const petalColors = ['#990011', '#ba0c2f', '#75000c', '#e6192d'];

class Petal {
  constructor(isBurst = false) {
    this.reset(isBurst);
  }

  reset(isBurst = false) {
    this.x = isBurst ? width / 2 + (Math.random() * 200 - 100) : Math.random() * width;
    this.y = isBurst ? height / 2 + (Math.random() * 100 - 50) : Math.random() * -height * 0.5;
    this.size = Math.random() * 8 + 6;
    this.speedY = isBurst ? Math.random() * 3 + 2 : Math.random() * 1.5 + 0.8;
    this.speedX = Math.random() * 1.2 - 0.6;
    this.angle = Math.random() * Math.PI * 2;
    this.angularSpeed = Math.random() * 0.03 - 0.015;
    this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
    this.opacity = Math.random() * 0.6 + 0.4;
  }

  update() {
    this.y += this.speedY;
    this.x += Math.sin(this.angle) * 0.8 + this.speedX;
    this.angle += this.angularSpeed;

    if (this.y > height + 20) {
      this.reset(false);
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.beginPath();
    ctx.ellipse(0, 0, this.size, this.size * 0.55, 0, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.opacity;
    ctx.fill();
    ctx.restore();
  }
}

// Generate 25 ambient floating petals
for (let i = 0; i < 25; i++) {
  petals.push(new Petal(false));
}

function burstPetals() {
  for (let i = 0; i < 40; i++) {
    petals.push(new Petal(true));
  }
}

function animatePetals() {
  ctx.clearRect(0, 0, width, height);
  petals.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animatePetals);
}

animatePetals();