const flashCard = document.querySelector('.flashcard-stack');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const filterSelect = document.getElementById('filterSelect');
const answerSheetTable = document.getElementById('answerTable');
const quizMode = document.querySelector('.quiz-mode');
const paymentSection = document.querySelector('.payment-section');
const ticketBtn = document.getElementById('ticket-btn');
const simulateSection = document.querySelector('.simulate-container');

let flashCardsData = [];
window.CURRENT_ID = 1;
let userAnswer = ""
let numberOfTries = 2;
let myMap = [];
let myMapSet = new Map();
let finalScore = 0;
let startingMinutes = 20;
let time = startingMinutes * 60;
let simulate = false;
let timeSubmitted = false;

function handleTicket() {
 
  document.querySelector('.tick-number').innerHTML = `Your ticket number is: <span>345</span>. You will be notified when it's your turn.`;
  paymentSection.innerHTML = '<div class="loader">Processing payment options...</div>';
  setTimeout(() => {
    paymentSection.innerHTML = `
     <label for="payment">Payment Amount ($200)</label>
              <input 
                  id="payment" 
                  class="payment-input" 
                  placeholder="Enter payment amount"
            >
            <button onclick="handlePayment()" class="pay-btn">Proceed to Payment</button>
            <p class="payment-error" id="paymentError"></p>
            <p class="payment-success" id="paymentSuccess"></p>
            <p class="payment-note">Note: You must pay $200 to access the test.</p>
  `}, 2000);
}

function handlePayment() {
  const paymentInput = document.getElementById('payment');
  const amount = paymentInput ? paymentInput.value : '';  
  if (amount === '200') {
    document.querySelector('.payment-error').innerHTML = '';
    document.querySelector('.payment-success').innerHTML = 'Payment successful! You can now access the test.';
    paymentInput.value = '';
    setTimeout(() => {
      document.querySelector('.tick-number').innerHTML = `Payment confirmed. Your ticket number is: <span>345</span>. You can now start the test.`;
      ticketBtn.style.display = 'none';
      paymentSection.innerHTML = `<div>
      <button id="start-btn" onclick="handleStartTest()" class="start-btn">Start Test</button>
       <p class="payment-note">
                Test structure: two parts after payment - 20 road rules questions and 20 signs questions. You have 20 minutes to complete as many questions as you can before finishing. Good luck!
            </p>
        </div>
      `;
    }, 1200);
  } else {
    // alert('Payment failed. Please enter the correct amount to proceed.');
    document.querySelector('.payment-error').innerHTML = 'Please enter the correct payment amount.';
    document.querySelector('.payment-success').innerHTML = '';
  }
}

function updateCountdown() {
  const countdownEl = document.querySelector('.countdown-timer');
  if (time >= 0) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    countdownEl.textContent = `Time Remaining: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    time--;
  } else {
    countdownEl.textContent = 'Time is up! Your test will be submitted automatically.';
    if (!timeSubmitted) {
      timeSubmitted = true;
      handleFinish();
    }
  }
}


function handleStartTest() {
  document.querySelector('.tick-number').innerHTML = '';
  paymentSection.innerHTML = '';
  document.querySelector('.simulate-header').style.display = 'none';
  simulate = true;
  timeSubmitted = false;
  updateCountdown();
  setInterval(updateCountdown, 1000);
  handleFlashCard();
}


function randomizeArray(array, shouldExecute = true) {
  // if (!shouldExecute) return array;

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}


function renderFlashCards() {
  if (!flashCardsData.length) {
    if (flashCard) flashCard.innerHTML = '';
    if (answerSheetTable) answerSheetTable.innerHTML = '';
    if (quizMode) quizMode.innerHTML = '';
    return;
  }

  if (answerSheetTable) {
    answerSheetTable.innerHTML = flashCardsData.map(card => {
    return `
    
    ${card.image == null ? (
       ` <tr>
      <td>${card.id}</td>
      <td>${card.question}</td>
      <td>${card.answer}</td>
    </tr>`) : ''}
    `;
  }).join('');
  }

  if (simulate) {
    document.querySelector('.simulate-container').innerHTML = flashCardsData.map(card => {
    return `
    <div>
    <div class="quiz-card ${window.CURRENT_ID == card.id ? 'active' : ''}">
    <div class="quiz-top-row">
        <p class="quiz-id">${card.id}.</p>
        <p class="quiz-question">${card.question}</p>
        <img src="${card.image ? `/static/images/${card.image}` : ''}" alt="" class="quiz-card-image" style="${card.image ? '' : 'display:none;'}">
    </div>
 <div class="quiz-answers">
        ${randomizeArray(card.fakeAnswers || [], false)
            .map(answer => {
              const entry = myMapSet.get(window.CURRENT_ID);
              const selectedWrong = entry && entry.userAnswer === answer && !entry.isCorrect;
              const selectedCorrect = entry && entry.userAnswer === answer && entry.isCorrect;
              const stillFailed = entry && entry.numberOfTries === 0 && !entry.isCorrect && answer === card.answer;
              const isCorrectClass = selectedCorrect || (entry && entry.isCorrect && answer === card.answer) || stillFailed;
              const isWrongClass = selectedWrong && (!stillFailed || entry.userAnswer !== card.answer);
              const className = isCorrectClass ? 'correct' : (isWrongClass ? 'wrong' : '');
              return `<span onclick='handleTest(this, ${JSON.stringify(answer)}, ${JSON.stringify(card.answer)})' class="quiz-answer ${className}">${answer}</span>`;
            })
            .join('')}
    </div>   
   <div class="quiz-trials-container">
    <p class="quiz-trials"></p>
</div>
    <div class="quiz-navigation">
    <button onclick="handleToggleLeft()" class="quiz-nav-btn">Previous</button>
    <button onclick="${flashCardsData.length === card.id ? 'handleFinish()' : 'handleToggleRight()'}" class="quiz-nav-btn">${flashCardsData.length === card.id ? 'Finish' : 'Next'}</button>
</div>
</div>
`
  }).join('');
  }

  if (quizMode) {
    quizMode.innerHTML = flashCardsData.map(card => {
    return `
    <div class="quiz-card ${window.CURRENT_ID == card.id ? 'active' : ''}">
    <div class="quiz-top-row">
        <p class="quiz-id">${card.id}.</p>
        <p class="quiz-question">${card.question}</p>
        <img src="${card.image ? `/static/images/${card.image}` : ''}" alt="" class="quiz-card-image" style="${card.image ? '' : 'display:none;'}">
    </div>
 <div class="quiz-answers">
        ${randomizeArray(card.fakeAnswers || [], false)
            .map(answer => {
              const entry = myMapSet.get(window.CURRENT_ID);
              const selectedWrong = entry && entry.userAnswer === answer && !entry.isCorrect;
              const selectedCorrect = entry && entry.userAnswer === answer && entry.isCorrect;
              const stillFailed = entry && entry.numberOfTries === 0 && !entry.isCorrect && answer === card.answer;
              const isCorrectClass = selectedCorrect || (entry && entry.isCorrect && answer === card.answer) || stillFailed;
              const isWrongClass = selectedWrong && (!stillFailed || entry.userAnswer !== card.answer);
              const className = isCorrectClass ? 'correct' : (isWrongClass ? 'wrong' : '');
              return `<span onclick='handleQuestionAnswer(this, ${JSON.stringify(answer)}, ${JSON.stringify(card.answer)})' class="quiz-answer ${className}">${answer}</span>`;
            })
            .join('')}
    </div>   
   <div class="quiz-trials-container">
    <p class="quiz-trials"></p>
</div>
    <div class="quiz-navigation">
    <button onclick="handleToggleLeft()" class="quiz-nav-btn">Previous</button>
    <button onclick="${flashCardsData.length === card.id ? 'handleFinish()' : 'handleToggleRight()'}" class="quiz-nav-btn">${flashCardsData.length === card.id ? 'Finish' : 'Next'}</button>
</div>
</div>
</div>
`;

  }).join('');

    const activeCard = quizMode.querySelector('.quiz-card.active');
    if (activeCard) {
      const activeTrials = activeCard.querySelector('.quiz-trials');
      const activeEntry = myMapSet.get(window.CURRENT_ID);
      const currentCard = flashCardsData.find(card => card.id === window.CURRENT_ID);
      if (activeTrials) {
        if (activeEntry) {
          if (activeEntry.isCorrect) {
            activeTrials.textContent = 'Correct!';
            activeCard.querySelector('.quiz-trials-container')?.classList.add('quiz-trials-container');
          } else if (activeEntry.numberOfTries > 0) {
            activeTrials.textContent = `Incorrect. ${activeEntry.numberOfTries} tries left.`;
            activeCard.querySelector('.quiz-trials-container')?.classList.add('quiz-trials-container');
          } else {
            activeTrials.textContent = `Incorrect. Correct answer is ${currentCard ? currentCard.answer : 'unknown'}.`;
            activeCard.querySelector('.quiz-trials-container')?.classList.add('quiz-trials-container');
          }
        } else {
          activeTrials.textContent = '';
        }
      }
    }
}


  if (flashCard) {
    flashCard.innerHTML = flashCardsData.map(card => {
    return `
<div class="flashcard-wrapper">


    <button class="arrow left" onclick="handleToggleLeft()">&#8592;</button>

    <div class="flashcard ${window.CURRENT_ID == card.id ? 'active' : ''}">
        <div class="flashcard-inner">
            <div class="flashcard-front">
            <img src="${card.image ? `/static/images/${card.image}` : ''}" alt="" class="card-image" style="${card.image ? '' : 'display:none;'}">
            <p class="card-question">${card.question}</p>
            ${card.description ? `<p class="card-description">${card.description}</p>` : ''}
                <button class="btn-front" onclick="handleFlip(this)">Reveal</button>
            </div>
            <div class="flashcard-back">
                <p class="card-answer">${card.answer}</p>
                <button class="btn-back" onclick="handleFlip(this)">Close</button>
            </div>
        </div>
    </div>

    <button class="arrow right" onclick="handleToggleRight()">&#8594;</button>

</div>
`;
  }).join('');
}

if (filterSelect) {
  filterSelect.addEventListener('change', (event) => {
    if (event.target.value === 'all') {
         fetch('http://127.0.0.1:5000/api/questions-answers')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json(); // Parses the response body as JSON
  })
  .then((data) => {
    
      flashCardsData = data;
      if (flashCardsData.length) {
        window.CURRENT_ID = flashCardsData[0].id;
        progressBar.style.width = `${(1 / flashCardsData.length) * 100}%`;
        progressText.textContent = `${Math.round((1 / flashCardsData.length) * 100)}%`;
      } else {
        window.CURRENT_ID = 1;
        progressBar.style.width = '0%';
        progressText.textContent = '0%';
      }
      renderFlashCards();
  })
  .catch(error => console.error('Fetch error:', error));
    }
    else if (event.target.value === 'demerit') {
    fetch('http://127.0.0.1:5000/api/demerit-answers')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json(); // Parses the response body as JSON
  })
  .then((data) => {
    
      flashCardsData = data;
      if (flashCardsData.length) {
        window.CURRENT_ID = flashCardsData[0].id;
        progressBar.style.width = `${(1 / flashCardsData.length) * 100}%`;
        progressText.textContent = `${Math.round((1 / flashCardsData.length) * 100)}%`;
      } else {
        window.CURRENT_ID = 1;
        progressBar.style.width = '0%';
        progressText.textContent = '0%';
      }
      renderFlashCards();
  })
  .catch(error => console.error('Fetch error:', error));
       
    } else {
    fetch('http://127.0.0.1:5000/api/questions-signs')
     .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json(); // Parses the response body as JSON
  })
  .then((data) => {
    
      flashCardsData = data;
      if (flashCardsData.length) {
        window.CURRENT_ID = flashCardsData[0].id;
        progressBar.style.width = `${(1 / flashCardsData.length) * 100}%`;
        progressText.textContent = `${Math.round((1 / flashCardsData.length) * 100)}%`;
      } else {
        window.CURRENT_ID = 1;
        progressBar.style.width = '0%';
        progressText.textContent = '0%';
      }
      renderFlashCards();
  })
  .catch(error => console.error('Fetch error:', error));  
        }
    });
};

}

function handleFlashCard() {
  fetch('http://127.0.0.1:5000/api/questions-answers')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      flashCardsData = data;
      if (flashCardsData.length) {
        window.CURRENT_ID = flashCardsData[0].id;
      }
      renderFlashCards();
    })
    .catch(error => console.error('Fetch error:', error));
}

window.handleFlip = function(button) {

  const card = button.closest('.flashcard-inner');
  card.classList.toggle('is-flipped'); 
};

window.handleToggleLeft = function() {
  const currentIndex = flashCardsData.findIndex(item => item.id === window.CURRENT_ID);
  if (currentIndex > 0) {
    window.CURRENT_ID = flashCardsData[currentIndex - 1].id;
    const entry = myMapSet.get(window.CURRENT_ID);
    numberOfTries = entry ? entry.numberOfTries : 2;
    if (progressBar) progressBar.style.width = `${(currentIndex / flashCardsData.length) * 100}%`;
    if (progressText) progressText.textContent = `${Math.round((currentIndex / flashCardsData.length) * 100)}%`;
    renderFlashCards();
  }
};

window.handleToggleRight = function() {
  const currentIndex = flashCardsData.findIndex(item => item.id === window.CURRENT_ID);
  if (currentIndex >= 0 && currentIndex < flashCardsData.length - 1) {
    window.CURRENT_ID = flashCardsData[currentIndex + 1].id;
    const entry = myMapSet.get(window.CURRENT_ID);
    numberOfTries = entry ? entry.numberOfTries : 2;
    if (progressBar) progressBar.style.width = `${((currentIndex + 2) / flashCardsData.length) * 100}%`;
    if (progressText) progressText.textContent = `${Math.round(((currentIndex + 2) / flashCardsData.length) * 100)}%`;
    renderFlashCards();
  }
};

window.handleFinish = async function() {
  const answeredCount = myMapSet.size;
  const total = flashCardsData.length;
  const most = Math.ceil(total / 2);
  const activeContainer = simulate ? simulateSection : quizMode;

  if (answeredCount < most && time > 0) {
    const activeCard = activeContainer ? activeContainer.querySelector('.quiz-card.active') : null;
    if (activeCard) {
      const activeTrials = activeCard.querySelector('.quiz-trials');
      if (activeTrials) {
        activeTrials.textContent = `Incomplete: You have answered only ${answeredCount} out of ${total} questions.`;
        activeCard.querySelector('.quiz-trials-container')?.classList.add('quiz-trials-container');
      }
    }
  } else {
    // Finish the quiz
    if (activeContainer) {
      if (!timeSubmitted) {
        time = 0;
        timeSubmitted = true;
        const countdownEl = document.querySelector('.countdown-timer');
        countdownEl.textContent = 'Time is up! Calculating your results.';
      }

      try {
        const response = await fetch('http://127.0.0.1:5000/auth/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            percentage: `${Math.round((answeredCount / total) * 100)}%`,
            score: `${finalScore} out of ${total}`,
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Progress saved:', result);
      } catch (error) {
        console.error('Error saving progress:', error);
      }

      activeContainer.innerHTML = `
      <div class="quiz-results">
        <h2>Quiz Completed!</h2>
        <p>You have successfully completed the quiz.</p>
        <p>Your final score is: ${finalScore} out of ${flashCardsData.length}</p>
        <p>You can review your answers in the answer sheet.</p>
        <a href="/practice-mode/answersheet" class="back-btn">Answer Sheet</a>
      </div>
      `;
    }
  }
};

function goBack() {
    if (confirm("Are you sure you want to exit?")) {
        window.history.back();
    }
}

function handleQuestionAnswer(element, fakeAnswer, realAnswer) {

  const currentIndex = flashCardsData.findIndex(item => item.id === window.CURRENT_ID);
  const currentCard = flashCardsData[currentIndex];
  const cardQuestion = currentCard ? currentCard.question : '';
  userAnswer = fakeAnswer;
  const existingEntryIndex = myMap.findIndex(entry => entry.currentIndex === currentIndex);

  const quizCard = element.closest('.quiz-card');
  const answerEls = quizCard ? quizCard.querySelectorAll('.quiz-answer') : [];
  const quizTrialsEl = quizCard ? quizCard.querySelector('.quiz-trials') : null;
  const quizTrialsContainer = quizCard ? quizCard.querySelector('.quiz-trials-container') : null;

  if (existingEntryIndex !== -1 && (myMap[existingEntryIndex]?.numberOfTries === 0 || myMap[existingEntryIndex]?.isCorrect)) {
    // completed card: keep existing highlight state and do not allow further changes
    return;
  }

  // clear previous indicators for active attempts
  answerEls.forEach(btn => btn.classList.remove('correct', 'wrong'));
  if (quizTrialsEl) quizTrialsEl.textContent = '';
  if (quizTrialsContainer) quizTrialsContainer.classList.remove('quiz-trials-container');

  if (existingEntryIndex !== -1 && myMap[existingEntryIndex]?.userAnswer === userAnswer && myMap[existingEntryIndex]?.numberOfTries > 0) {
    if (quizTrialsEl) quizTrialsEl.textContent = 'You have already selected this answer. Try a different one.';
    if (quizTrialsContainer) quizTrialsContainer.classList.add('quiz-trials-container');
    return;
  }

  const isCorrect = userAnswer === realAnswer;

  if (isCorrect) {
    element.classList.add('correct');
    numberOfTries = 0;
    finalScore++;
    if (quizTrialsEl) quizTrialsEl.textContent = 'Correct! Move on to the next question...';
    if (quizTrialsContainer) quizTrialsContainer.classList.add('quiz-trials-container');
  } else {
    element.classList.add('wrong');
    numberOfTries = Math.max(0, numberOfTries - 1);

    if (numberOfTries > 0) {
      if (quizTrialsEl) quizTrialsEl.textContent = `Incorrect. ${numberOfTries} tries left.`;
      if (quizTrialsContainer) quizTrialsContainer.classList.add('quiz-trials-container');
    } else {
      if (quizTrialsEl) quizTrialsEl.textContent = `Incorrect. The answer is ${realAnswer}.`;
      if (quizTrialsContainer) quizTrialsContainer.classList.add('quiz-trials-container');

      answerEls.forEach(btn => {
        if (btn.textContent.trim() === realAnswer) {
          btn.classList.add('correct');
        }
      });

    }
  }

  const entry = {
    currentIndex,
    numberOfTries,
    userAnswer,
    cardQuestion,
    isCorrect,
  };

  if (existingEntryIndex === -1) {
    myMapSet.set(window.CURRENT_ID, entry);
    myMap.push(entry);
  } else {
    myMapSet.set(window.CURRENT_ID, entry);
    myMap[existingEntryIndex] = entry;
  }

console.log("Current Index:", myMap.filter(entry => entry.currentIndex).length, "Total questions:", flashCardsData.length);
}

function handleTest(element, fakeAnswer, realAnswer) {

  numberOfTries = 1;

  const currentIndex = flashCardsData.findIndex(item => item.id === window.CURRENT_ID);
  const currentCard = flashCardsData[currentIndex];
  const cardQuestion = currentCard ? currentCard.question : '';
  userAnswer = fakeAnswer;
  const existingEntryIndex = myMap.findIndex(entry => entry.currentIndex === currentIndex);

  const quizCard = element.closest('.quiz-card');
  const answerEls = quizCard ? quizCard.querySelectorAll('.quiz-answer') : [];
  const quizTrialsEl = quizCard ? quizCard.querySelector('.quiz-trials') : null;
  const quizTrialsContainer = quizCard ? quizCard.querySelector('.quiz-trials-container') : null;

  if (existingEntryIndex !== -1 && (myMap[existingEntryIndex]?.numberOfTries === 0 || myMap[existingEntryIndex]?.isCorrect)) {
    return;
  }

  // clear previous indicators for active attempts
  answerEls.forEach(btn => btn.classList.remove('correct', 'wrong'));
  if (quizTrialsEl) quizTrialsEl.textContent = '';
  if (quizTrialsContainer) quizTrialsContainer.classList.remove('quiz-trials-container');

  if (existingEntryIndex !== -1 && myMap[existingEntryIndex]?.userAnswer === userAnswer && myMap[existingEntryIndex]?.numberOfTries > 0) {
    if (quizTrialsEl) quizTrialsEl.textContent = 'You have already selected this answer. Try a different one.';
    if (quizTrialsContainer) quizTrialsContainer.classList.add('quiz-trials-container');
    return;
  }

  const isCorrect = userAnswer === realAnswer;

  if (isCorrect) {
    element.classList.add('correct');
    numberOfTries = 0;
    finalScore++;
    if (quizTrialsEl) quizTrialsEl.textContent = 'Correct! Move on to the next question...';
    if (quizTrialsContainer) quizTrialsContainer.classList.add('quiz-trials-container');
    // setTimeout(() => handleToggleRight(), 1000);
  } else {
    element.classList.add('wrong');
    numberOfTries = Math.max(0, numberOfTries - 1);

    if (numberOfTries > 0) {
      if (quizTrialsEl) quizTrialsEl.textContent = `Incorrect. ${numberOfTries} tries left.`;
      if (quizTrialsContainer) quizTrialsContainer.classList.add('quiz-trials-container');
    } else {
      if (quizTrialsEl) quizTrialsEl.textContent = `Incorrect. The answer is ${realAnswer}.`;
      if (quizTrialsContainer) quizTrialsContainer.classList.add('quiz-trials-container');

      answerEls.forEach(btn => {
        if (btn.textContent.trim() === realAnswer) {
          btn.classList.add('correct');
        }
      });

    }
  }

  const entry = {
    currentIndex,
    numberOfTries,
    userAnswer,
    cardQuestion,
    isCorrect,
  };

  if (existingEntryIndex === -1) {
    myMapSet.set(window.CURRENT_ID, entry);
    myMap.push(entry);
  } else {
    myMapSet.set(window.CURRENT_ID, entry);
    myMap[existingEntryIndex] = entry;
  }

console.log("Current Index:", myMap.filter(entry => entry.currentIndex).length, "Total questions:", flashCardsData.length);
}

handleFlashCard();