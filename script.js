/* ==========================================================
   PARISIAN NOIR — COMPLETE INTERACTIVE ENGINE & TRACKER
   ========================================================== */

// 1. CONFIGURATION: Enter your Gmail here to receive her answers
const MY_EMAIL = "your-email@gmail.com"; 

/* ==========================================================
   2. PROCEDURAL SOUND SYNTHESIS (Web Audio API)
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
      // Crisp mechanical typewriter click
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.04);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === 'seal') {
      // Deep resonant wax break & harmonic chime
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(520, now + 0.35);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      osc.start(now);
      osc.stop(now + 0.7);
    }
  } catch (e) {
    console.log("Audio awaiting user interaction.");
  }
}

/* ==========================================================
   3. CLUES DATA & SELECTION TRACKER
   ========================================================== */
const detectiveClues = [
  {
    label: "Question 01 &bull; Direct Inquiry",
    question: "Be honest with me: what was the exact expression on your face when you opened this link?",
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
      "You picked two really good ones of me "
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
const recordedResponses = [];

const clueCard = document.getElementById('clueCard');
const clueIndexLabel = document.getElementById('clueIndexLabel');
const clueQuestionText = document.getElementById('clueQuestionText');
const optionsContainer = document.getElementById('optionsContainer');
const envelopeWrapper = document.getElementById('envelopeWrapper');
const waxSealBtn = document.getElementById('waxSealBtn');
const noirLetter = document.getElementById('noirLetter');

function renderClue(index) {
  const data = detectiveClues[index];
  clueIndexLabel.innerHTML = data.label;
  clueQuestionText.innerText = data.question;
  optionsContainer.innerHTML = '';

  data.options.forEach((optText) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span>${optText}</span> <span style="color:var(--dark-crimson);">&rarr;</span>`;
    btn.onclick = () => selectAnswer(index, optText);
    optionsContainer.appendChild(btn);
  });

  // Update progress pills
  for (let i = 1; i <= 3; i++) {
    const pill = document.getElementById(`stepPill${i}`);
    if (pill) {
      pill.classList.remove('active');
      if (i - 1 < index) pill.classList.add('completed');
      if (i - 1 === index) pill.classList.add('active');
    }
  }
}

function selectAnswer(index, chosenOption) {
  playSound('tick');

  // Record question and her selected response
  recordedResponses.push({
    questionNumber: index + 1,
    question: detectiveClues[index].question,
    answer: chosenOption
  });

  if (index < detectiveClues.length - 1) {
    currentClue++;
    renderClue(currentClue);
  } else {
    // All clues answered
    for (let i = 1; i <= 3; i++) {
      const pill = document.getElementById(`stepPill${i}`);
      if (pill) pill.className = 'step-pill completed';
    }
    clueCard.style.display = 'none';
    envelopeWrapper.style.display = 'block';
  }
}

/* ==========================================================
   4. SILENT NOTIFICATION DISPATCH (FormSubmit.co API)
   ========================================================== */
function transmitChoicesSilently() {
  if (!MY_EMAIL || MY_EMAIL === "mohdkaif200801@gmail.com") {
    console.warn("Please enter your actual Gmail in script.js to receive responses.");
    return;
  }

  const payload = {
    _subject: "💌 Parisian Noir — She Just Answered Your Questions!",
    "Question 01": recordedResponses[0]?.question || "N/A",
    "Her Choice 01": recordedResponses[0]?.answer || "N/A",
    "Question 02": recordedResponses[1]?.question || "N/A",
    "Her Choice 02": recordedResponses[1]?.answer || "N/A",
    "Question 03": recordedResponses[2]?.question || "N/A",
    "Her Choice 03": recordedResponses[2]?.answer || "N/A",
    "Unlocked At": new Date().toLocaleString()
  };

  fetch(`https://formsubmit.co/ajax/${MY_EMAIL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(data => console.log("Transmission delivered."))
  .catch(err => console.error("Transmission error:", err));
}

// Wax Seal Event
waxSealBtn.addEventListener('click', () => {
  playSound('seal');
  waxSealBtn.style.transform = 'scale(0.85) rotate(15deg)';
  waxSealBtn.style.opacity = '0.4';
  waxSealBtn.style.pointerEvents = 'none';

  // Send responses to your email silently
  transmitChoicesSilently();

  setTimeout(() => {
    envelopeWrapper.style.display = 'none';
    noirLetter.style.display = 'block';
    noirLetter.scrollIntoView({ behavior: 'smooth', block: 'center' });
    burstPetals();
  }, 400);
});

// Start initial question
renderClue(0);

/* ==========================================================
   5. FALLING CRIMSON ROSE PETALS (Canvas Physics)
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

// Generate ambient floating petals
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