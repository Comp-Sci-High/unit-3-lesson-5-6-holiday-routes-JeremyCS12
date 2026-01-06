// extras.js - Santa animation, confetti, ambient music toggle, and utility helpers
(function(){
  let confettiCanvas, confettiCtx, confettiParticles = [];
  let santaCanvas, santaCtx, santaX = -200;
  let audioCtx, musicGain, musicOsc;

  function resizeCanvas(c){ c.width = window.innerWidth; c.height = Math.max(120, window.innerHeight * 0.12); }

  function initSanta(){
    santaCanvas = document.getElementById('santaCanvas');
    if(!santaCanvas) return;
    santaCtx = santaCanvas.getContext('2d');
    resizeCanvas(santaCanvas);
    window.addEventListener('resize', ()=> resizeCanvas(santaCanvas));
    requestAnimationFrame(drawSanta);
  }

  function drawSleigh(ctx, x, y){
    // simple sleigh + reindeer silhouette
    ctx.save();
    ctx.translate(x,y);
    // reindeer (circles)
    for(let i=0;i<3;i++){
      ctx.fillStyle = '#2f1408'; ctx.beginPath(); ctx.ellipse(-60 - i*34, -6, 10, 8, 0, 0, Math.PI*2); ctx.fill();
    }
    // sleigh body
    ctx.fillStyle = '#c62828'; ctx.beginPath(); ctx.moveTo(0,0); ctx.quadraticCurveTo(36,-12,60,0); ctx.lineTo(60,14); ctx.quadraticCurveTo(36,6,0,8); ctx.closePath(); ctx.fill();
    // runners
    ctx.strokeStyle = '#111'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(8,18); ctx.lineTo(48,22); ctx.stroke();
    ctx.restore();
  }

  function drawSanta(){
    if(!santaCtx) return;
    santaCtx.clearRect(0,0,santaCanvas.width,santaCanvas.height);
    const y = santaCanvas.height * 0.5;
    drawSleigh(santaCtx, santaX, y);
    santaX += 1.6;
    if(santaX > santaCanvas.width + 200) santaX = -200 - (Math.random()*200);
    requestAnimationFrame(drawSanta);
  }

  function initConfetti(){
    confettiCanvas = document.getElementById('confettiCanvas');
    if(!confettiCanvas) return;
    confettiCtx = confettiCanvas.getContext('2d');
    resizeCanvas(confettiCanvas);
    window.addEventListener('resize', ()=> resizeCanvas(confettiCanvas));
    requestAnimationFrame(updateConfetti);
  }

  function triggerConfetti(){
    if(!confettiCtx) return;
    for(let i=0;i<120;i++){
      confettiParticles.push({
        x: Math.random()*confettiCanvas.width,
        y: Math.random()*-200,
        vx: (Math.random()-0.5)*6,
        vy: 2+Math.random()*5,
        size: 6+Math.random()*10,
        color: `hsl(${Math.floor(Math.random()*360)},70%,60%)`,
        rot: Math.random()*360
      });
    }
  }

  function updateConfetti(){
    if(!confettiCtx) return;
    confettiCtx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height);
    confettiParticles.forEach((p,i)=>{
      p.x += p.vx; p.y += p.vy; p.vy += 0.08; p.rot += 6;
      confettiCtx.save();
      confettiCtx.translate(p.x,p.y);
      confettiCtx.rotate(p.rot * Math.PI/180);
      confettiCtx.fillStyle = p.color;
      confettiCtx.fillRect(-p.size/2,-p.size/2,p.size,p.size*0.6);
      confettiCtx.restore();
      if(p.y > confettiCanvas.height + 50) confettiParticles.splice(i,1);
    });
    requestAnimationFrame(updateConfetti);
  }

  function initMusicToggle(){
    const btn = document.getElementById('musicToggle');
    if(!btn) return;
    audioCtx = (window.AudioContext || window.webkitAudioContext) ? new (window.AudioContext || window.webkitAudioContext)() : null;
    musicGain = audioCtx ? audioCtx.createGain() : null;
    if(musicGain) musicGain.gain.value = 0.0;

    btn.addEventListener('click', ()=>{
      if(!audioCtx) return;
      if(musicGain.gain.value > 0.01){ // turn off
        musicGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime+0.6);
        btn.textContent = 'music: off';
      } else {
        // create simple pad
        musicOsc = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        musicOsc.type = 'sine'; osc2.type='sine';
        musicOsc.frequency.value = 220; osc2.frequency.value = 440;
        musicOsc.connect(musicGain); osc2.connect(musicGain);
        musicGain.connect(audioCtx.destination);
        musicOsc.start(); osc2.start();
        musicGain.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime+0.6);
        btn.textContent = 'music: on';
        // gentle LFO for movement
        const lfo = audioCtx.createOscillator(); const lfoGain = audioCtx.createGain();
        lfo.frequency.value = 0.2; lfo.connect(lfoGain);
        lfoGain.connect(musicOsc.frequency);
        lfoGain.gain.value = 8; lfo.start();
      }
    });
  }

  function initBestScoreUI(){
    const el = document.getElementById('bestScore');
    if(!el) return;
    const best = localStorage.getItem('hol_best') || 0;
    el.textContent = best;
  }

  // expose
  window.triggerConfetti = triggerConfetti;
  window.updateBestScoreUI = initBestScoreUI;

  document.addEventListener('DOMContentLoaded', ()=>{
    initSanta(); initConfetti(); initMusicToggle(); initBestScoreUI();
  });
})();
