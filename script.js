const timerEl = document.getElementById("timer");
const modeEl = document.getElementById("mode");
const studyInput = document.getElementById("studyTime");
const breakInput = document.getElementById("breakTime");
const repeatInput = document.getElementById("repeatCount");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const infiniteBtn = document.getElementById("infiniteBtn");
const themeBtn = document.getElementById("themeBtn");
const pomoEl = document.getElementById("pomoCount");

let timer=null,timeLeft=0,isStudy=true,paused=false,repeatsDone=0,infinite=false;
let pomoCount=Number(localStorage.getItem("pomo"))||0;
pomoEl.textContent=pomoCount;

themeBtn.onclick=()=>{
  const next=document.body.dataset.theme==="dark"?"light":"dark";
  document.body.dataset.theme=next;
  localStorage.setItem("theme",next);
};

infiniteBtn.onclick=()=>{
  infinite=!infinite;
  infiniteBtn.textContent=`계속 반복: ${infinite?"ON":"OFF"}`;
};

startBtn.onclick=()=>{
  if(timer)return;
  isStudy=true;
  repeatsDone=0;
  startSession();
};

pauseBtn.onclick=()=>{
  paused=!paused;
  pauseBtn.textContent=paused?"재개":"멈춤";
};

resetBtn.onclick=()=>{
  clearInterval(timer);
  timer=null;
  paused=false;
  pauseBtn.textContent="멈춤";
  timerEl.textContent=formatTime(studyInput.value*60);
  modeEl.textContent="공부";
};

function startSession(){
  timeLeft=(isStudy?studyInput.value:breakInput.value)*60;
  modeEl.textContent=isStudy?"공부":"휴식";
  timer=setInterval(()=>{
    if(paused)return;
    timeLeft--;
    timerEl.textContent=formatTime(timeLeft);
    if(timeLeft<=0){
      navigator.vibrate?.(300);
      clearInterval(timer);
      timer=null;
      if(!isStudy){
        pomoCount++;
        localStorage.setItem("pomo",pomoCount);
        pomoEl.textContent=pomoCount;
        repeatsDone++;
      }
      if(!infinite && repeatsDone>=repeatInput.value)return;
      isStudy=!isStudy;
      startSession();
    }
  },1000);
}

function formatTime(sec){
  const m=String(Math.floor(sec/60)).padStart(2,"0");
  const s=String(sec%60).padStart(2,"0");
  return `${m}:${s}`;
}

timerEl.textContent=formatTime(studyInput.value*60);
