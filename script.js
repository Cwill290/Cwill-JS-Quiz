// Sample questions for the quiz
const questions = [
    {
        question: 'What is the correct way to write a JavaScript array?',
        answers: [
            'var colors = "red", "blue", "green";',
            'var colors = (1:"red", 2:"blue", 3:"green");',
            'var colors = ["red", "blue", "green"];',
            'var colors = 1 = ("red"), 2 = ("blue"), 3 = ("green");'
        ],
        correct: 2
    },
    // Additional questions can be added here
];

// Game state variables
let currentQuestionIndex = 0;
let timeRemaining = 60;
let timerInterval;

// DOM elements
const questionContainer = document.getElementById('question-container');
const answerButtons = document.getElementById('answer-buttons');
const timerElement = document.getElementById('time-remaining');
const feedbackElement = document.getElementById('feedback');

// Function to start the game
function startGame() {
    currentQuestionIndex = 0;
    timeRemaining = 60;
    timerElement.innerText = timeRemaining;
    displayQuestion();
    startTimer();
}

// Function to display the current question
function displayQuestion() {
    console.log('Displaying question', currentQuestionIndex);
    const question = questions[currentQuestionIndex];
    console.log('Question object:', question); // Debugging line
    questionContainer.innerText = question.question;
    answerButtons.innerHTML = '';
    question.answers.forEach((answer, index) => {
        console.log('Creating button for answer', index, answer); // Debugging line
        const button = document.createElement('a');
        button.innerText = answer;
        button.href = 'javascript:void(0)'; // Make it behave like a button
        button.classList.add('btn');
        button.addEventListener('click', () => handleAnswer(index));
        answerButtons.appendChild(button);
    });
}

// Function to start the timer
function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeRemaining--;
        timerElement.innerText = timeRemaining;
        if (timeRemaining <= 0) {
            endGame();
        }
    }, 1000);
}

// Call the startGame function when the page loads
startGame();

// Function to handle the user's answer
function handleAnswer(selectedIndex) {
    const correctIndex = questions[currentQuestionIndex].correct;
    if (selectedIndex === correctIndex) {
        feedbackElement.innerText = 'Correct!';
    } else {
        feedbackElement.innerText = 'Incorrect!';
        timeRemaining -= 10; // Subtract time for incorrect answer
        timerElement.innerText = timeRemaining;
    }

    // Move to the next question or end the game if all questions are answered
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        displayQuestion();
    } else {
        endGame();
    }
}

// Function to end the game and save the score
function endGame() {
    clearInterval(timerInterval);
    // Redirect to the highscores page and pass the score as a query parameter
    window.location.href = './highscores.html?score=' + timeRemaining;
}

// Additional logic for handling high scores can be added to the highscores.html page

// Function to get a query parameter from the URL
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Function to load and display high scores
function loadHighScores() {
    const highScoresList = document.getElementById('highscores-list');
    const highScores = JSON.parse(localStorage.getItem('highscores')) || [];
    highScores.forEach(score => {
        const scoreItem = document.createElement('tr');
        scoreItem.innerHTML = '<td>' + score.name + '</td><td>' + score.score + '</td>';
        highScoresList.appendChild(scoreItem);
    });
}

// Function to save a new high score
function saveHighScore(score) {
    const name = prompt('Enter your initials:');
    if (name) {
        const highScores = JSON.parse(localStorage.getItem('highscores')) || [];
        highScores.push({ name, score });
        localStorage.setItem('highscores', JSON.stringify(highScores));
    }
}

// Handle high scores if on the highscores.html page
if (window.location.pathname.endsWith('highscores.html')) {
    const score = parseInt(getQueryParam('score'));
    if (score) {
        saveHighScore(score);
    }
    loadHighScores();
}