const start = document.getElementById('start');
const quiz = document.getElementById('quiz');
const question = document.getElementById('question');
const qImg = document.getElementById('qImg');
const choiceA = document.getElementById('A');
const choiceB = document.getElementById('B');
const choiceC = document.getElementById('C');
const choiceD = document.getElementById('D');
const counter = document.getElementById('counter');
const timeGauge = document.getElementById('timeGauge');
const progress = document.getElementById('progress');
const scoreDiv = document.getElementById('scoreContainer');
const lastQuestion = 6;
let runningQuestion = 0;
let score = 0;
let questions = [];
let correctAnswer = [];
let answers = [];
let count = 0;
let questionTime = 10;
const gaugeWidth = 150;
const gaugeUnit = gaugeWidth/questionTime;
let TIMER;

function renderCounter() {
    if(count<=questionTime){
        console.log("Counter running")
        counter.innerHTML = count;
        timeGauge.style.width = count * gaugeUnit + "px";
        count++;
    }else {
        count = 0;
        answerIsWrong();
        if(runningQuestion < lastQuestion-1){
            runningQuestion++;
            renderQuestion(runningQuestion);
        } else {
            console.log("Inside renderCOunter finish");
            clearInterval(TIMER);
            renderScore();
        }
    }
    ga('send', {
        hitType: 'event',
        eventCategory: 'Question',
        eventAction: 'Question Number' + runningQuestion
      });
}

function renderProgress() {
    for (let qIndex = 0; qIndex < lastQuestion; qIndex++){
        progress.innerHTML += "<div class='prog' id="+qIndex+"></div>"
    }
}

//get Answers
function fetchTriviaData() {
fetch('https://opentdb.com/api.php?amount=6&category=9&difficulty=easy&type=multiple')
.then(data => data.json())
.then(data => createQuestions(data))
}

function createQuestions(tdata) {  
    for(let i = 0; i<6; i++){
    questions[i] = 
        {
            question : tdata.results[i].question,
        }   
    answers[i] = 
    {
        choiceA: tdata.results[i].incorrect_answers[0],
        choiceB: tdata.results[i].incorrect_answers[1],
        choiceC: tdata.results[i].incorrect_answers[2],
        choiceD: tdata.results[i].correct_answer
    }
    correctAnswer[i] = tdata.results[i].correct_answer;
}
renderQuestion(runningQuestion);

}

function renderQuestion(questionNumber){   
    let q = questions[questionNumber];
    question.innerHTML = "<p>"+ q.question +"</p>";
    renderAnswers(questionNumber);
}

function renderAnswers(answerNumber) {
    let a = shuffleAnswers(Object.values(answers[answerNumber]));
    choiceA.innerHTML = a[0];
    choiceB.innerHTML = a[1];
    choiceC.innerHTML = a[2];
    choiceD.innerHTML = a[3];
}

function startQuiz() {
start.style.display = "none";
fetchTriviaData();
quiz.style.display = "block";
renderProgress();
TIMER = setInterval(renderCounter,1000);
}

function checkAnswer(answer){
    //Add event listeners to each answer
   if(answer == correctAnswer[runningQuestion]){
       score++;
       answerIsCorrect();
       //change progress bar to green.
   }else {
       console.log('Answer:' +answer);
       answerIsWrong();
   }
   count = 0;
   if(runningQuestion < lastQuestion-1){
       runningQuestion++;
       renderQuestion(runningQuestion);
   }else {
    clearInterval(TIMER);
    renderScore();
}
}
//Add Event Listener
start.addEventListener('click', startQuiz);


function shuffleAnswers(array){

    var m = array.length, t, i;
    // While there remain elements to shuffle…
    while (m) {
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--); 
      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    } 
    return array;
}

function answerIsCorrect(){
   document.getElementById(runningQuestion).style.backgroundColor = "#0f0";
}

function answerIsWrong(){
    document.getElementById(runningQuestion).style.backgroundColor = "#f00";
}
// Add Event listener
choiceA.addEventListener('click', function() {
    let answer = choiceA.innerText;
    checkAnswer(answer);
});

choiceB.addEventListener('click', function() {
    let answer = choiceB.innerText;
    checkAnswer(answer);
});

choiceC.addEventListener('click', function() {
    let answer = choiceC.innerText;
    checkAnswer(answer);
});

choiceD.addEventListener('click', function() {
    let answer = choiceD.innerText;
    checkAnswer(answer);
});

function renderScore() {
    scoreDiv.style.display = "block";
    const scorePercent = Math.round(100 * score/questions.length);

    let img = (scorePercent >= 80) ? "img/5.png" 
              : (scorePercent >= 60) ? "img/4.png"
              : (scorePercent >= 40) ? "img/3.png" 
              : (scorePercent >= 20) ? "img/2.png" : "img/1.png";
       
    scoreDiv.innerHTML = "<img src="+img+">";
    scoreDiv.innerHTML += "<p>"+ scorePercent + "%</p>";

}