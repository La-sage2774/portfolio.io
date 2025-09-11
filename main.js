// Background Slider
    const hero = document.querySelector(".hero");
    const images = [
      "/src/chefs.jpeg",
      "/src/interior.jpeg",
      "/src/view.jpeg",
      "/src/customers.jpeg"
      
    ];
    let i = 0;

    function changeBackground() {
      hero.style.backgroundImage = `url('${images[i]}')`;
      i = (i + 1) % images.length;
    }

    setInterval(changeBackground, 4000);
    changeBackground(); 


      const faqQuestions = document.querySelectorAll(".faq-question");

  faqQuestions.forEach(question => {
    question.addEventListener("click", () => {
      question.classList.toggle("active");

      const answer = question.nextElementSibling;
      answer.classList.toggle("show");
    });
  });




// Basic drawing app implementation
(function(){
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const colorInput = document.getElementById('color');
const sizeInput = document.getElementById('size');
const sizeValue = document.getElementById('size-value');
const modeSelect = document.getElementById('mode');
const undoBtn = document.getElementById('undo');
const redoBtn = document.getElementById('redo');
const clearBtn = document.getElementById('clear');
const saveBtn = document.getElementById('save');
const coords = document.getElementById('coords');


// State
let drawing = false;
let lastX = 0, lastY = 0;
let strokeColor = colorInput.value;
let lineWidth = Number(sizeInput.value);
let mode = modeSelect.value; // draw or erase


// Undo / Redo stacks
const undoStack = [];
const redoStack = [];
const MAX_HISTORY = 25;


// Resize canvas to fit container while keeping drawing scale
function fitCanvasToContainer(){
const ratio = window.devicePixelRatio || 1;
const wrap = canvas.parentElement;
const maxWidth = Math.min(900, wrap.clientWidth - 24); // leave padding
const maxHeight = Math.max(300, Math.min(800, window.innerHeight - 260));
// maintain existing drawing scale by using an offscreen copy
const img = ctx.getImageData(0,0,canvas.width,canvas.height);
canvas.width = Math.floor(maxWidth * ratio);
canvas.height = Math.floor(maxHeight * ratio);
canvas.style.width = maxWidth + 'px';
canvas.style.height = maxHeight + 'px';
ctx.putImageData(img,0,0);
}


// Initial clear background
function clearCanvas(useHistory=true){
ctx.fillStyle = '#ffffff';
ctx.clearRect(0,0,canvas.width,canvas.height);
ctx.fillRect(0,0,canvas.width,canvas.height);
if(useHistory) pushHistory();
}


// Save snapshot for undo
function pushHistory(){
try{
if(undoStack.length >= MAX_HISTORY) undoStack.shift();
undoStack.push(canvas.toDataURL());
// once we push a new state, redo is invalid
redoStack.length = 0;
updateButtons();
}catch(e){console.warn('History push failed', e)}
}
function restoreFromDataURL(dataURL){
const img = new Image();
img.onload = function(){
// clear and draw
ctx.clearRect(0,0,canvas.width,canvas.height);
ctx.drawImage(img,0,0,canvas.width,canvas.height);
}
img.src = dataURL;
}


function updateButtons(){
undoBtn.disabled = undoStack.length === 0;
redoBtn.disabled = redoStack.length === 0;
}


// Drawing helpers
function setContext(){
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.strokeStyle = (mode === 'erase') ? '#ffffff' : strokeColor;
ctx.lineWidth = lineWidth;
}


function startDrawing(x,y){
drawing = true;
lastX = x; lastY = y;
ctx.beginPath();
ctx.moveTo(lastX, lastY);
}


function drawLine(x,y){
if(!drawing) return;
ctx.lineTo(x,y);
ctx.stroke();
lastX = x; lastY = y;
}


function stopDrawing(){
if(drawing){
ctx.closePath();
drawing = false;
pushHistory();
}
}
// Mouse events
 function getPointerPos(e){
  const rect = canvas.getBoundingClientRect();
  let clientX, clientY;
  if(e.touches && e.touches.length){
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else {
    clientX = e.clientX;
    clientY = e.clientY;
  }
  const x = (clientX - rect.left) * (canvas.width / rect.width);
  const y = (clientY - rect.top) * (canvas.height / rect.height);
  return {x,y}
}

canvas.addEventListener('mousedown', (e)=>{
  setContext();
  const p = getPointerPos(e);
  startDrawing(p.x,p.y);
});

canvas.addEventListener('mousemove', (e)=>{
  const p = getPointerPos(e);
  coords.textContent = `x: ${Math.round(p.x)}, y: ${Math.round(p.y)}`;
  drawLine(p.x,p.y);});
window.addEventListener('mouseup', stopDrawing);


// Touch
canvas.addEventListener('touchstart', (e)=>{e.preventDefault(); setContext(); const p = getPointerPos(e); startDrawing(p.x,p.y);});
canvas.addEventListener('touchmove', (e)=>{e.preventDefault(); const p = getPointerPos(e); drawLine(p.x,p.y);});
canvas.addEventListener('touchend', (e)=>{e.preventDefault(); stopDrawing();});


// Controls
colorInput.addEventListener('input', (e)=>{strokeColor = e.target.value;});
sizeInput.addEventListener('input', (e)=>{lineWidth = Number(e.target.value); sizeValue.textContent = e.target.value;});
modeSelect.addEventListener('change', (e)=>{mode = e.target.value;});


undoBtn.addEventListener('click', ()=>{
if(undoStack.length){
const last = undoStack.pop();
// push current to redo
redoStack.push(canvas.toDataURL());
restoreFromDataURL(last);
updateButtons();
}
});


redoBtn.addEventListener('click', ()=>{
if(redoStack.length){
const last = redoStack.pop();
undoStack.push(canvas.toDataURL());
restoreFromDataURL(last);
updateButtons();
}
});


clearBtn.addEventListener('click', ()=>{
if(confirm('Clear the canvas?')){
clearCanvas(true);
}
});


saveBtn.addEventListener('click', ()=>{
const link = document.createElement('a');
link.download = 'drawing.png';
link.href = canvas.toDataURL('image/png');
link.click();
});
// keyboard shortcuts
window.addEventListener('keydown', (e)=>{
if((e.ctrlKey||e.metaKey) && e.key === 'z'){ // undo
e.preventDefault(); undoBtn.click();
}else if((e.ctrlKey||e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'Z'))){
e.preventDefault(); redoBtn.click();
}
});


// initial setup
function init(){
// set white background
canvas.width = 900; canvas.height = 600;
canvas.style.width = '100%';
canvas.style.maxWidth = '900px';
ctx.fillStyle = '#ffffff';
ctx.fillRect(0,0,canvas.width,canvas.height);
pushHistory();
updateButtons();
}


init();

window.addEventListener('resize', ()=>{
// no-op: keep fixed internal resolution to avoid blurring
});


})();

 //game js

    const gameBoard = document.getElementById("game");
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let cards = [];

    function startGame() {
      gameBoard.innerHTML = "";
      firstCard = null;
      secondCard = null;
      lockBoard = false;

const emojis = [
  "\u{1F34E}","\u{1F34C}","\u{1F352}","\u{1F347}","\u{1F349}","\u{1F34D}","\u{1F95D}","\u{1F351}",
  "\u{1FAD2}","\u{1F34B}"  //emojis
];
      cards = [...emojis, ...emojis]
        .sort(() => 0.5 - Math.random()); // shuffle

      cards.forEach(symbol => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.symbol = symbol;
        card.textContent = "?";
        card.addEventListener("click", flipCard);
        gameBoard.appendChild(card);
      });
    }

    function flipCard() {
      if (lockBoard) return;
      if (this === firstCard) return;

      this.textContent = this.dataset.symbol;
      this.classList.add("flipped");

      if (!firstCard) {
        firstCard = this;
        return;
      }

      secondCard = this;
      checkMatch();
    }

    function checkMatch() {
      if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");
        resetBoard();
      } else {
        lockBoard = true;
        setTimeout(() => {
          firstCard.textContent = "?";
          secondCard.textContent = "?";
          firstCard.classList.remove("flipped");
          secondCard.classList.remove("flipped");
          resetBoard();
        }, 1000);
      }
    }

    function resetBoard() {
      [firstCard, secondCard] = [null, null];
      lockBoard = false;
    }

    startGame();
