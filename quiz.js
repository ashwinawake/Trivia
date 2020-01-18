const start = document.getElementById('start');
const quiz = document.getElementById('quiz');
const question = document.getElementById('question');
const qImg = document.getElementById('qImg');
const choiceA = document.getElementById('A');
const choiceB = document.getElementById('B');
const choiceC = document.getElementById('C');
const counter = document.getElementById('counter');
const timeGauge = document.getElementById('timeGauge');
const progress = document.getElementById('progress');
const scoreDiv = document.getElementById('score');
let questions = new Array(6);


//get Answers
function fetchTriviaData() {
fetch('https://opentdb.com/api.php?amount=6&category=9&difficulty=easy&type=multiple')
.then(data => data.json())
.then(data => createQuestions(data))
}

function createQuestions(tdata) {  
    for(let i = 0; i<questions.length; i++){
    questions[i] = [
        {
            question : tdata.results[i].question,
            choiceA: tdata.results[i].incorrect_answers[0],
            choiceB: tdata.results[i].incorrect_answers[1],
            choiceC: tdata.results[i].incorrect_answers[2],
            correct: tdata.results[i].correct_answer
        }
    ]
}
}

