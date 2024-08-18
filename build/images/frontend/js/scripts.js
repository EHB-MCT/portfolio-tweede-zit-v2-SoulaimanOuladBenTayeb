// Function to check if the user is logged in
function isLoggedIn() {
    const token = localStorage.getItem('token');
    return token !== null;
}

// Function to get the logged-in user's ID
function getLoggedInUserId() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId;
}

// Function to format dates
function formatDate(isoString) {
    const date = new Date(isoString);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${formattedDate}<br>${formattedTime}`;
}

// Function to capitalize the first letter of a name
function capitalizeFirstLetter(string) {
    if (typeof string !== 'string' || !string) {
        return ''; // return an empty string if the input is not valid
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Function to display a custom-styled alert
function showAlert(message, type = "info") {
    const alertBox = document.createElement('div');
    alertBox.className = `custom-alert custom-alert-${type}`;
    alertBox.innerHTML = `<span>${message}</span><button onclick="this.parentElement.style.display='none';">&times;</button>`;
    document.body.appendChild(alertBox);

    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 3000);
}

// Existing code to fetch and render questions
async function fetchQuestions() {
    try {
        const response = await fetch('http://localhost:3000/api/questions');
        let questions = await response.json();
        // console.log(questions);

        // Sort questions by date (latest first)
        questions = questions.sort((a, b) => new Date(b.questionDate) - new Date(a.questionDate));

        renderQuestions(questions);
    } catch (error) {
        console.error('Error fetching questions:', error);
    }
}

// Function to fetch and display answers for a question
let currentQuestionId = null;
let currentQuestionName = null;
let currentQuestionRole = null;
let currentQuestionText = null;
let currentQuestionDate = null;

async function openAnswers(questionId, name, role, questionText, questionDate) {
    // console.log({ questionId, name, role, questionText, questionDate });

    currentQuestionId = questionId;
    currentQuestionName = name;
    currentQuestionRole = role;
    currentQuestionText = questionText;
    currentQuestionDate = questionDate;


    const loggedInUserId = getLoggedInUserId(); 

    if (!questionId) {
        console.error('Invalid question ID:', questionId);
        showAlert('Failed to load answers.', 'error');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/questions/${questionId}/answers`);
        const answers = await response.json();

        if (!Array.isArray(answers)) {
            throw new Error('Invalid answers data received');
        }

        // Clear the questions container and only show the clicked question and its answers
        const questionsContainer = document.getElementById('questions-container');
        questionsContainer.innerHTML = ''; // Clear out other questions

        const roleColor = role === 'teacher' ? 'red' : 'blue';
        const formattedDate = questionDate ? formatDate(questionDate) : 'Invalid Date';

        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';

        // Render the question details again, even after an answer is submitted
        questionDiv.innerHTML = `
            <div class="go-back" onclick="goBackToQuestions()">&#8592; Back</div>
            <h2 style="color:${roleColor};">${capitalizeFirstLetter(name)} (${capitalizeFirstLetter(role)})</h2>
            <p><strong>Question:</strong> ${questionText || 'No question provided'}</p>
            <span class="date-time">${formattedDate}</span>
        `;

        questionsContainer.appendChild(questionDiv);

        const answersContainer = document.getElementById('answers-container');
        answersContainer.innerHTML = ''; // Clear previous answers

        answers.forEach(answer => {
            const answerName = capitalizeFirstLetter(answer.name || "Anonymous");
            const answerRole = answer.role === 'teacher' ? 'Teacher' : 'Student';
            const answerRoleColor = answer.role === 'teacher' ? 'red' : 'lightblue';
            const answerFormattedDate = answer.answerDate ? formatDate(answer.answerDate) : 'Invalid Date';
            
            const answerDiv = document.createElement('div');
            answerDiv.className = 'answer';
            
            answerDiv.innerHTML = `
                <h3 style="color:${answerRoleColor};">${answerName} (${answerRole})</h3>
                <p>${answer.answer}</p>
                <span class="date-time">${answerFormattedDate}</span> <!-- Display date here -->
                ${loggedInUserId === answer.userId ? `
                <div class="answer-actions" style="position: relative; margin-top: 10px;">
                    <span class="icon pencil-icon" title="Edit" onclick="editAnswer(${answer.id}, '${answer.answer}')">&#9998;</span>
                    <span class="icon bin-icon" title="Delete" onclick="confirmDeleteAnswer(${answer.id})">&#128465;</span>
                </div>
                ` : ''}
            `;
            
            answersContainer.appendChild(answerDiv);
        });        
        
        

        if (isLoggedIn()) {
            const answerInputForm = `
                <div class="answer-input">
                    <textarea id="answerInput" placeholder="Write your answer here..."></textarea>
                    <button onclick="submitAnswer(${questionId})" class="answer-submit-btn">Submit Answer</button>
                </div>
            `;
            answersContainer.innerHTML += answerInputForm;
        } else {
            answersContainer.innerHTML += `
                <p style="color: red; font-weight: bold; margin-top: 10px;">
                    You need to log in to submit an answer.
                </p>
            `;
        }

        // Show the answers container
        answersContainer.classList.remove('hidden');

    } catch (error) {
        console.error('Error fetching answers:', error);
        showAlert('Failed to load answers.', 'error');
    }
}




function renderQuestions(questions) {
    const container = document.getElementById('questions-container');
    const answersContainer = document.getElementById('answers-container');
    container.innerHTML = '';
    answersContainer.classList.add('hidden'); // Hide the answers container when going back to the questions list
    
    const loggedInUserId = getLoggedInUserId();

    questions.forEach(question => {
        const name = capitalizeFirstLetter(question.name || "Anonymous");
        const role = question.role === 'teacher' ? 'Teacher' : 'Student';
        const roleColor = question.role === 'teacher' ? 'red' : 'blue';
        const formattedDate = formatDate(question.questionDate);

        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';

        questionDiv.innerHTML = `
            <h2 style="color:${roleColor};">${name} (${role})</h2>
            <p><strong>Question:</strong> ${question.question}</p>
            <span class="date-time">${formattedDate}</span>
            ${loggedInUserId === question.userId ? `
            <div class="question-actions">
                <span class="icon pencil-icon" title="Edit" onclick="editQuestion(${question.id}, '${question.question}')">&#9998;</span>
                <span class="icon bin-icon" title="Delete" onclick="confirmDeleteQuestion(${question.id})">&#128465;</span>
            </div>
            ` : ''}
            <div class="chat-icon" onclick="openAnswers(${question.id}, '${question.name}', '${question.role}', '${question.question}', '${question.questionDate}')">&#128172;</div>
        `;

        container.appendChild(questionDiv);
    });
}

// Function to go back to the list of questions and hide the answers
function goBackToQuestions() {
    const questionsContainer = document.getElementById('questions-container');
    const answersContainer = document.getElementById('answers-container');
    fetchQuestions();
    answersContainer.classList.add('hidden');
}

// Function to submit an answer
async function submitAnswer(questionId) {
    const token = localStorage.getItem('token');
    if (!isLoggedIn()) {
        showAlert('You need to log in to submit an answer', 'error');
        return;
    }

    const answerText = document.getElementById('answerInput').value;
    if (answerText.trim() === '') {
        showAlert('Answer cannot be empty', 'error');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/questions/${questionId}/answers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ answer: answerText, answerDate: new Date().toISOString() })
        });

        const result = await response.json();
        if (result.success) {
            showAlert('Answer submitted successfully!', 'success');
            // Ensure all the required parameters are passed here:
            openAnswers(currentQuestionId, currentQuestionName, currentQuestionRole, currentQuestionText, currentQuestionDate); 
        } else {
            showAlert('Failed to submit answer: ' + result.error, 'error');
        }
    } catch (error) {
        console.error('Error submitting answer:', error);
        showAlert('Failed to submit answer due to a server error.', 'error');
    }
}


let currentEditAnswerId = null;
let currentDeleteAnswerId = null;

// Function to edit an answer
function editAnswer(answerId, currentAnswer) {
    currentEditAnswerId = answerId;
    const modal = document.getElementById('editAnswerModal');
    const editInput = document.getElementById('editAnswerInput');

    editInput.value = currentAnswer;
    modal.style.display = 'block';
}

// Function to save the edited answer
async function saveEditedAnswer() {
    const newAnswer = document.getElementById('editAnswerInput').value;
    const token = localStorage.getItem('token');

    if (newAnswer.trim() !== "" && currentEditAnswerId !== null) {
        try {
            const response = await fetch(`http://localhost:3000/api/answers/${currentEditAnswerId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ answer: newAnswer })
            });

            const result = await response.json();
            if (result.success) {
                showAlert('Answer edited successfully!', 'success');
                openAnswers(currentQuestionId, currentQuestionName, currentQuestionRole, currentQuestionText, currentQuestionDate); // Refresh the list of answers
            } else {
                showAlert('Failed to edit answer: ' + result.error, 'error');
            }
        } catch (error) {
            console.error('Error editing answer:', error);
            showAlert('Failed to edit answer due to a server error.', 'error');
        } finally {
            closeEditAnswerModal(); // Ensure the modal is closed after the action
        }
    }
}


function closeEditAnswerModal() {
    const modal = document.getElementById('editAnswerModal');
    modal.style.display = 'none';
    currentEditAnswerId = null; // Reset the ID after closing the modal
}

// Event listener for saving the edited answer
document.getElementById('saveEditAnswerBtn').addEventListener('click', saveEditedAnswer);

// Event listener for closing the edit answer modal
document.getElementById('closeAnswerModal').addEventListener('click', closeEditAnswerModal);




// Function to confirm deletion of an answer
function confirmDeleteAnswer(answerId) {
    currentDeleteAnswerId = answerId; // Store the ID of the answer to be deleted
    const deleteModal = document.getElementById('deleteAnswerModal');
    deleteModal.style.display = 'block'; // Show the delete confirmation modal
}

// Function to delete an answer
async function deleteAnswer() {
    const token = localStorage.getItem('token');

    if (currentDeleteAnswerId !== null) {
        try {
            const response = await fetch(`http://localhost:3000/api/answers/${currentDeleteAnswerId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();
            if (result.success) {
                showAlert('Answer deleted successfully!', 'success');
                // Fetch and refresh the answers only if the question still exists
                openAnswers(currentQuestionId, currentQuestionName, currentQuestionRole, currentQuestionText, currentQuestionDate); // Pass correct data
            } else {
                showAlert('Failed to delete answer: ' + result.error, 'error');
            }
        } catch (error) {
            console.error('Error deleting answer:', error);
            showAlert('Failed to delete answer due to a server error.', 'error');
        } finally {
            closeDeleteAnswerModal(); // Close the delete modal
        }
    }
}



let currentEditQuestionId = null;
let currentDeleteQuestionId = null;

// Function to confirm deletion of a question
function confirmDeleteQuestion(questionId) {
    currentDeleteQuestionId = questionId; // Store the ID of the question to be deleted
    const deleteModal = document.getElementById('deleteQuestionModal');
    deleteModal.style.display = 'block'; // Show the delete confirmation modal
}

// Function to edit a question
function editQuestion(questionId, currentQuestion) {
    currentEditQuestionId = questionId;
    const modal = document.getElementById('editQuestionModal');
    const editInput = document.getElementById('editQuestionInput');
    editInput.value = currentQuestion;
    modal.style.display = 'block';
}

// Function to save the edited question
async function saveEditedQuestion() {
    const newQuestion = document.getElementById('editQuestionInput').value;
    const token = localStorage.getItem('token');

    if (newQuestion.trim() !== "" && currentEditQuestionId !== null) {
        try {
            const response = await fetch(`http://localhost:3000/api/questions/${currentEditQuestionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ question: newQuestion })
            });

            const result = await response.json();
            if (result.success) {
                showAlert('Question edited successfully!', 'success');
                fetchQuestions(); // Refresh the list of questions
            } else {
                showAlert('Failed to edit question: ' + result.error, 'error');
            }
        } catch (error) {
            console.error('Error editing question:', error);
            showAlert('Failed to edit question due to a server error.', 'error');
        } finally {
            closeDeleteQuestionModal();
        }
    }
}

// Function to delete a question
async function deleteQuestion() {
    const token = localStorage.getItem('token');

    if (currentDeleteQuestionId !== null) {
        try {
            const response = await fetch(`http://localhost:3000/api/questions/${currentDeleteQuestionId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                // If response status is not OK (e.g., 404 or 403), handle the error
                const errorData = await response.json();
                showAlert('Failed to delete question: ' + errorData.error, 'error');
                throw new Error(errorData.error);
            }

            const result = await response.json();
            showAlert('Question deleted successfully!', 'success');
            fetchQuestions(); // Refresh the list of questions
        } catch (error) {
            console.error('Error deleting question:', error);
            showAlert('Failed to delete question due to a server error.', 'error');
        } finally {
            closeDeleteQuestionModal();
        }
    }
}

// Function to close the delete modal for questions
function closeDeleteQuestionModal() {
    const deleteModal = document.getElementById('deleteQuestionModal');
    deleteModal.style.display = 'none';
    currentDeleteQuestionId = null;
}

// Function to close the delete modal for answers
function closeDeleteAnswerModal() {
    const deleteModal = document.getElementById('deleteAnswerModal');
    deleteModal.style.display = 'none';
    currentDeleteAnswerId = null;
}

// Function to close the modal
function closeModal() {
    const modal = document.getElementById('editQuestionModal');
    modal.style.display = 'none';
    currentEditQuestionId = null;
}

// Event listener for the close button
document.getElementById('closeModal').addEventListener('click', closeModal);

// Event listeners for closing the modals
document.getElementById('closeDeleteQuestionModal').addEventListener('click', closeDeleteQuestionModal);
document.getElementById('closeDeleteAnswerModal').addEventListener('click', closeDeleteAnswerModal);

// Event listener for saving the edit
document.getElementById('saveEditBtn').addEventListener('click', saveEditedQuestion);

// Event listener for confirming the delete of a question
document.getElementById('confirmDeleteQuestionBtn').addEventListener('click', deleteQuestion);

// Event listener for confirming the delete of an answer
document.getElementById('confirmDeleteAnswerBtn').addEventListener('click', deleteAnswer);

// Event listener for canceling the delete of a question
document.getElementById('cancelDeleteQuestionBtn').addEventListener('click', closeDeleteQuestionModal);

// Event listener for canceling the delete of an answer
document.getElementById('cancelDeleteAnswerBtn').addEventListener('click', closeDeleteAnswerModal);

// Event listener for the register form submission
document.getElementById('register-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const lastname = document.getElementById('lastname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    const formData = { name, lastname, email, password, role };

    // console.log("Register form data:", formData);

    try {
        const response = await fetch('http://localhost:3000/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
            showAlert('Registration successful!', 'success');
        } else {
            showAlert('Registration failed: ' + result.error, 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showAlert('Registration failed due to a server error.', 'error');
    }
});

// Event listener for the login form submission
document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (result.success) {
            // Store the token without "Bearer" prefix
            localStorage.setItem('token', result.token);
            // console.log("Token stored:", localStorage.getItem('token'));

            // Decode the token to get user info
            const payload = JSON.parse(atob(result.token.split('.')[1]));
            const userName = capitalizeFirstLetter(payload.name || email);

            // Update greeting message
            document.getElementById('greeting').innerText = `Hello, ${userName}!`;
            document.getElementById('logout-btn').style.display = 'block';

            showAlert('Login successful!', 'success');
            hideSectionsAfterLogin();
            fetchQuestions(); // Refresh questions after login
        } else {
            showAlert('Login failed: ' + result.error, 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showAlert('Login failed due to a server error.', 'error');
    }
});

// New function to handle sending a question
async function askQuestion(questionText) {
    const token = localStorage.getItem('token');
    if (!isLoggedIn()) {
        showAlert('You need to log in to ask a question', 'error');
        return;
    }

    // console.log("Token used to ask question:", token);

    const response = await fetch('http://localhost:3000/api/questions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ question: questionText, questionDate: new Date().toISOString() })
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Error asking question:', errorData);

        if (errorData.error === 'Invalid token') {
            showAlert('Session expired, please log in again.', 'error');
            localStorage.removeItem('token');
            location.reload(); 
        } else {
            showAlert('You need to log in to ask a question', 'error');
        }
    } else {
        const result = await response.json();
        // console.log('Question asked:', result);
        fetchQuestions();
    }
}

// Event listener for the question form submission
document.getElementById('question-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const questionText = document.getElementById('question-text').value;
    const token = localStorage.getItem('token');

    if (!token) {
        showAlert('You need to log in to ask a question', 'error');
    } else {
        askQuestion(questionText);
    }
});

// Hide register and login forms after login
function hideSectionsAfterLogin() {
    document.getElementById('register-section').classList.add('hidden');
    document.getElementById('login-section').classList.add('hidden');
    document.querySelector('.navbar').classList.add('hidden');
    document.getElementById('logout-btn').style.display = 'block';
}

// Show the login form
document.getElementById('show-login').addEventListener('click', function() {
    document.getElementById('login-section').classList.remove('hidden');
    document.getElementById('register-section').classList.add('hidden');
});

// Show the register form
document.getElementById('show-register').addEventListener('click', function() {
    document.getElementById('register-section').classList.remove('hidden');
    document.getElementById('login-section').classList.add('hidden');
});

// Event listener for the logout button
document.getElementById('logout-btn').addEventListener('click', function() {
    localStorage.removeItem('token');
    location.reload(); 
});

// Initial page setup
if (isLoggedIn()) {
    hideSectionsAfterLogin();
    const token = localStorage.getItem('token');
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userName = capitalizeFirstLetter(payload.name || "User");
    document.getElementById('greeting').innerText = `Hello, ${userName}!`;
} else {
    document.getElementById('logout-btn').style.display = 'none';
}

fetchQuestions();
