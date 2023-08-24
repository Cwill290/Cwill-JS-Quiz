let question = document.querySelector("#question");
let multipleChoiceList = document.querySelector("#multipleChoice");
let validate = document.querySelector("#validate");
let btnStartQuiz = document.querySelector("#startBtn");
let timeCount = document.querySelector("#timeCount");
let score = document.querySelector("#score");
let highscores = document.querySelector("#highscores");
let initials = document.querySelector("#initials");
let hsList = document.querySelector("#hsList");
let replaceBtn;
let i = 0;
let count = 60;
let indexReplace;
let answer;
let highscoreInitials = [];
let highscoreCount = [];
let timerID;

let multipleChoiceOptions = [
    "if statements", "arrays", ".length", ".sort()",
    "global scope", "key value pairs", "functions", "web apis"
];

let questionListArray = [1, 2, 3, 4, 5];

let questionList = {
    1: ["_____ adds interactivity to a static website", "JavaScript"],
    2: ["This converts objects to strings: ", "JSON.stringify()"],
    3: ["This method selects all the elements that match", ".querySelectorAll('')"],
    4: ["A very useful tool used during development and debugging for printing content to the debugger is:", "console.log"],
    5: ["String values must be enclosed within _____ when being assigned to variables", "quotes"],
};

// Function to randomize the order of an array
let randomOrder = function (arr) {
    let b = 0;
    let c = 0;
    for (a = 0; a < arr.length; a++) {
        b = Math.floor(Math.random() * (arr.length - 1) + 1);
        c = arr[a];
        arr[a] = arr[b];
        arr[b] = c;
    }
    return arr;
};

randomOrder(questionListArray);

// Function to display the question and related multiple-choice answers
let displayQuestion = function () {
    if (i < questionListArray.length) {
        let index = questionListArray[i];
        question.textContent = questionList[index][0];
        answer = questionList[index][1];
        multipleChoiceOptions = randomOrder(multipleChoiceOptions);
        displayAnswers();
    } else {
        finish();
    }
}

// Function to handle the display of multiple-choice answers
let displayAnswers = function () {
    for (let j = 0; j < 4; j++) {
        let list = document.createElement("button");
        list.textContent = multipleChoiceOptions[j];
        list.setAttribute("id", j);
        multipleChoiceList.appendChild(list);
    }

    indexReplace = Math.floor(Math.random() * 4);
    replaceBtn = document.getElementById(indexReplace);
    replaceBtn.textContent = answer;
}

// Event listener to check if the selected answer is correct
multipleChoiceList.addEventListener("click", function (event) {
    let userAns = event.target;
    if (userAns == replaceBtn) {
        validate.textContent = "Correct!";
    } else {
        validate.textContent = "Wrong!";
        count = count - 10;
    }

    setTimeout(() => {
        validate.textContent = "";
        for (let c = 3; c >= 0; c--) {
            multipleChoiceList.children[c].remove();
        }
        i++;
        displayQuestion();
    }, "500");
})

// Function to handle the end of the quiz
let finish = function () {
    clearInterval(timerID);
    document.getElementById("quiz").setAttribute("style", "display: none");
    document.getElementById("finish").setAttribute("style", "display: flex");
    score.textContent = count;
    storeHighScore();
}

// Function to store high scores
let storeHighScore = function () {
    document.querySelector("#submitBtn").addEventListener("click", function (event) {
        event.preventDefault()
        highscoreCount = JSON.parse(localStorage.getItem("hi-scores")) || [];
        let newScore = {
            initials: initials.value,
            score: count
        };

        highscoreCount.push(newScore);
        localStorage.setItem("hi-scores", JSON.stringify(highscoreCount));
        highscoresPage();
    })
}

// Function to handle the high scores page
let highscoresPage = function () {
    clearInterval(timerID);
    document.getElementById("intro").setAttribute("style", "display: none");
    document.getElementById("quiz").setAttribute("style", "display: none");
    document.getElementById("finish").setAttribute("style", "display: none");
    highscores.setAttribute("style", "display: flex");

    let myHighscores = JSON.parse(localStorage.getItem("hi-scores")) || [];
    myHighscores.sort(function (x, y) {
        return y.score - x.score;
    })

    hsList.innerHTML = "";
    for (let a = 0; a < myHighscores.length; a++) {
        let li = document.createElement("li");
        li.textContent = myHighscores[a].initials + "-" + myHighscores[a].score;
        hsList.appendChild(li);
    }


    //localStorage.getItem(initials);

    document.querySelector("#backBtn").addEventListener("click", function () {
        highscores.setAttribute("style", "display: none");
        document.getElementById("intro").setAttribute("style", "display:flex;");
        window.location.reload();
    })

    document.querySelector("#clearBtn").addEventListener("click", function () {
        localStorage.removeItem("hi-scores");
        window.location.reload();
    })

}


//view high score page
document.querySelector("a").addEventListener("click", function (event) {
    if (event.target) {
        highscoresPage();
    }
})

//Timer function
function timer() {
    timerID = setInterval(function () {
        if (count <= 0) {
            timeCount.textContent = "times up";
            count = 0;
            finish();
            return;
        }
        timeCount.textContent = count;
        count--;
    }, 1000);

}

//starts the timer
btnStartQuiz.addEventListener("click", function (event) {
    document.getElementById("intro").setAttribute("style", "display:none;");
    document.getElementById("quiz").setAttribute("style", "display: flex");
    displayQuestion();
    timer();
});