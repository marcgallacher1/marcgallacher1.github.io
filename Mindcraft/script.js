document.addEventListener('DOMContentLoaded', function () {
    attachNavButtonListeners();
});

let map, infowindow, service;
const breathingAudio = new Audio("calming-sound-breathing.mp3");
const audioPlayer = new Audio();

function attachNavButtonListeners() {
    document.addEventListener('click', function (event) {
        if (event.target.id === 'meditateButton') {
            fetchPageContent('meditate.html');
        } else if (event.target.id === 'todoListButton') {
            fetchPageContent('to-do-list.html');
        } else if (event.target.id === 'reflectionButton') {
            fetchPageContent('reflection.html');
        } else if (event.target.id === 'journalButton') {
            fetchPageContent('journal.html');
        } else if (event.target.id === 'breathingButton') {
            fetchPageContent('breathing.html');
        } else if (event.target.id === 'calmingaudioButton') {
            fetchPageContent('calming_sounds.html');
        } else if (event.target.id === 'quoteButton') {
            fetchPageContent('get_quotes.html');
        } else if (event.target.id === 'journalButton') {
            fetchPageContent('journal.html');
        } else if (event.target.id === 'mapsButton') {
            fetchPageContent('poi.html');
        }

    });
}

function fetchPageContent(page) {
    stopAndResetAudio();
    fetch(page)
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            document.getElementById('app').innerHTML = doc.querySelector('#app').innerHTML;
            breathingAudio.pause();
            breathingAudio.currentTime = 0;
            reinitializeScriptForPage(page);
        });
}

function reinitializeScriptForPage(page) {
    if (page.includes('to-do-list.html')) {
        initializeToDoList();
    } else if (page.includes('reflection.html')) {
        initializeReflection();
    } else if (page.includes('journal.html')) {
        loadPikadayAndInitialize();
    } else if (page.includes('breathing.html')) {
        initializeBreathing();
    } else if (page.includes('calming_sounds.html')) {
        initializeCalmingSounds();
    } else if (page.includes('get_quotes.html')) {
        initializeQuotes();
    } else if (page.includes('poi.html')) {
        loadGoogleMapsAPIAndInitialize();
    }

    attachNavButtonListeners();
}

function initializeBreathing() {
    const appContainer = document.getElementById('app');
    if (!appContainer) return;

    const startMeditationBtn = document.getElementById('startMeditationBtn');
    const resetMeditationBtn = document.getElementById('resetMeditationBtn');
    const timerDisplay = document.getElementById('timerDisplay');
    const meditationDurationSelect = document.getElementById('meditationDuration');
    const breathingInstruction = document.getElementById('breathingInstruction'); // Add this element in your HTML

    let isMeditating = false;
    let countdown;
    let breathingPhaseIndex = 0;
    let breathingPhaseTimeout;
    let timeRemaining = parseInt(meditationDurationSelect.value, 10);
    const breathingPhases = ['Breathe In', 'Hold', 'Breathe Out'];

    function updateBreathingInstructions() {
        if (isMeditating) {
            breathingInstruction.textContent = breathingPhases[breathingPhaseIndex % breathingPhases.length];
            breathingPhaseIndex++;
            breathingPhaseTimeout = setTimeout(updateBreathingInstructions, 5000);
        }
    }

    meditationDurationSelect.addEventListener('change', function () {
        if (!isMeditating) {
            timeRemaining = parseInt(this.value, 10);
            updateTimerDisplay(timeRemaining, timerDisplay);
        }
    });

    startMeditationBtn.addEventListener('click', function () {
        if (!isMeditating) {
            this.textContent = 'Stop Meditation';
            meditationDurationSelect.disabled = true;
            resetMeditationBtn.classList.add('hidden');
            breathingAudio.play();
            isMeditating = true;

            countdown = setInterval(() => {
                if (timeRemaining > 0) {
                    timeRemaining -= 1;
                    updateTimerDisplay(timeRemaining, timerDisplay);
                } else {
                    completeMeditation(countdown, breathingPhaseTimeout, breathingAudio);
                }
            }, 1000);

            updateBreathingInstructions();
        } else {
            clearInterval(countdown);
            clearTimeout(breathingPhaseTimeout);
            breathingAudio.pause();
            this.textContent = 'Start Meditation';
            isMeditating = false;
            resetMeditationBtn.classList.remove('hidden');
            breathingInstruction.textContent = "";
            breathingPhaseIndex = 0;
        }
    });

    resetMeditationBtn.addEventListener('click', function () {
        breathingAudio.pause();
        breathingAudio.currentTime = 0;
        clearInterval(countdown);
        clearTimeout(breathingPhaseTimeout);
        timeRemaining = parseInt(meditationDurationSelect.value, 10);
        updateTimerDisplay(timeRemaining, timerDisplay);
        this.classList.add('hidden');
        startMeditationBtn.textContent = 'Start Meditation';
        isMeditating = false;
        meditationDurationSelect.disabled = false;
        breathingInstruction.textContent = "";
        breathingPhaseIndex = 0;
    });
}

function updateTimerDisplay(timeRemaining, timerDisplay) {
    let minutes = Math.floor(timeRemaining / 60);
    let seconds = timeRemaining % 60;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    timerDisplay.textContent = `${minutes}:${seconds}`;
}

function completeMeditation(countdown, breathingPhaseTimeout, breathingAudio) {
    const startMeditationBtn = document.getElementById('startMeditationBtn');
    const timerDisplay = document.getElementById('timerDisplay');
    const meditationDurationSelect = document.getElementById('meditationDuration');
    const meditationSound = document.getElementById('meditationSound');

    clearInterval(countdown);
    clearTimeout(breathingPhaseTimeout);
    breathingAudio.pause();
    timerDisplay.textContent = "00:00";
    meditationSound.pause();
    meditationSound.currentTime = 0;
    if ("vibrate" in navigator) navigator.vibrate([500, 200, 500]);
    alert("Meditation session completed.");
    startMeditationBtn.textContent = 'Start Meditation';
    startMeditationBtn.disabled = false;
    meditationDurationSelect.disabled = false;
    document.getElementById('breathingInstruction').textContent = "";
    breathingPhaseIndex = 0;
}

function initializeToDoList() {
    loadTasks();
    const addTaskBtn = document.getElementById("add-task-btn");
    if (addTaskBtn) {
        addTaskBtn.addEventListener("click", function () {
            let taskInput = document.getElementById("task-input");
            if (taskInput && taskInput.value.trim() !== "") {
                addTaskToList(taskInput.value, false);
                taskInput.value = "";
            } else {
                alert("Please enter a task.");
            }
        });
    }
}

function addTaskToList(text, completed) {
    const taskList = completed ? document.getElementById("completed-task-list") : document.getElementById("task-list");
    let li = document.createElement("li");

    let img = document.createElement("img");
    img.src = completed ? "ticked_circle.png" : "empty_circle.png";
    img.className = "status-icon";
    li.appendChild(img);

    let textSpan = document.createElement("span");
    textSpan.textContent = text;
    li.appendChild(textSpan);

    let deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "🗑";
    deleteBtn.className = "delete-task-btn";
    li.appendChild(deleteBtn);

    if (completed) {
        textSpan.classList.add("completed-text");
    }

    taskList.appendChild(li);

    img.addEventListener("click", function() {
        toggleTaskCompletion.call(img, text);
    });

    deleteBtn.addEventListener("click", function () {
        li.remove();
        playSound('delete-task-noise.mp3');
        updateCompletedListVisibility();
        saveTasks();
    });

    updateCompletedListVisibility();
    saveTasks();
}

function playSound(file) {
    let audio = new Audio(file);
    audio.play();
}

function toggleTaskCompletion(taskText) {
    let img = this;
    let li = img.parentElement;
    let textSpan = li.querySelector("span");
    let wasCompleted = img.src.includes("ticked_circle.png");

    img.src = wasCompleted ? "empty_circle.png" : "ticked_circle.png";
    if (wasCompleted) {
        document.getElementById("task-list").appendChild(li);
        textSpan.classList.remove("completed-text");
    } else {
        document.getElementById("completed-task-list").appendChild(li);
        textSpan.classList.add("completed-text");
        playSound('complete-task-noise.mp3');
    }

    updateTaskInLocalStorage(taskText, !wasCompleted);
    updateCompletedListVisibility();
    saveTasks();
}

function updateTaskInLocalStorage(taskText, completed) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let found = false;

    tasks = tasks.map(task => {
        if (task.text === taskText) {
            found = true;
            return { ...task, completed };
        }
        return task;
    });

    if (!found) {
        let completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];
        completedTasks = completedTasks.map(task => {
            if (task.text === taskText) {
                return { ...task, completed };
            }
            return task;
        });

        localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
    } else {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
}

function updateCompletedListVisibility() {
    let completedTaskList = document.getElementById("completed-task-list");
    let completedTasksContainer = document.getElementById("completed-tasks-container");
    if (completedTaskList && completedTasksContainer) {
        completedTasksContainer.style.display = completedTaskList.children.length > 0 ? "block" : "none";
    }
}

function saveTasks() {
    let tasks = [];
    document.querySelectorAll("#task-list li, #completed-task-list li").forEach(task => {
        let text = task.querySelector("span").textContent;
        let completed = task.parentNode.id === "completed-task-list";
        tasks.push({ text, completed });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => {
        addTaskToList(task.text, task.completed);
    });
}

function initializeReflection() {

    displayRandomQuote();

    const editEntry = localStorage.getItem('editEntry');
    if (editEntry) {
        const reflectionEntry = JSON.parse(editEntry);
        populateFormWithDate(reflectionEntry);
        localStorage.removeItem('editEntry');
    }

    document.getElementById("dayLogForm").addEventListener("submit", function (event) {
        event.preventDefault();

        const selectedDate = document.getElementById("date").value;
        const mood = document.getElementById("mood").value;
        const highlights = document.getElementById("highlights").value;
        const challenges = document.getElementById("challenges").value;

        const existingEntries = JSON.parse(localStorage.getItem('journalEntries')) || [];
        const existingEntryIndex = existingEntries.findIndex(entry => entry.date === selectedDate);

        const formData = {date: selectedDate, mood, highlights, challenges};

        if (existingEntryIndex !== -1) {
            const overwrite = confirm("You already have a reflection for this date. Would you like to overwrite it?");
            if (overwrite) {
                existingEntries[existingEntryIndex] = formData;
                alert("Your reflection has been updated.");
            } else {
                return;
            }
        } else {
            existingEntries.push(formData);
            alert("Your reflection has been saved.");
        }

        localStorage.setItem('journalEntries', JSON.stringify(existingEntries));
        displayFormResponse(mood);
        document.getElementById('dayLogForm').style.display = "none";
        const journalSection = document.getElementById("journalSection");
        if (journalSection) {
            journalSection.classList.remove("hidden");
        }

        document.getElementById("dayLogForm").reset();
    });
}

function populateFormWithDate(reflectionEntry) {
    console.log('Entry for editing:', reflectionEntry);

    if (reflectionEntry) {
        document.getElementById("date").value = reflectionEntry.date;
        document.getElementById("mood").value = reflectionEntry.mood;
        document.getElementById("highlights").value = reflectionEntry.highlights;
        document.getElementById("challenges").value = reflectionEntry.challenges;
    } else {
        console.log("No reflection entry found for this date.");
        alert("No reflection entry found for this date.");
    }
}





function displayFormResponse(mood) {
    const comments = {
        happy: "😊 It's great to hear that you had a happy day! Keep up the positive attitude!",
        okay: "🙂 Sometimes we have okay days. Tomorrow is a new opportunity to make it better!",
        sad: "🙁 I'm sorry to hear that you had a sad day. Remember, it's okay to feel this way and to reach out for support.",
        anxious: "😟 Feeling anxious can be tough, but remember to take deep breaths and focus on the present moment."
    };

    const comment = comments[mood];
    if (comment) {
        const quoteDisplay = document.getElementById("quoteDisplay");
        quoteDisplay.textContent = comment;
        quoteDisplay.className = 'comment-fly-in';
    }
}

function displayRandomQuote() {
    const quotes = [
        "'Life can only be understood backwards; but it must be lived forwards.' - Søren Kierkegaard",
        "'Sometimes, you have to look back in order to understand the things that lie ahead.' - Yvonne Woon, Dead Beautiful",
        "'The real man smiles in trouble, gathers strength from distress, and grows brave by reflection.' - Thomas Paine",
        "'Transitions are a time for reflection, and a time for looking forward.' - Roy Cooper",
        "'The way we experience the world around us is a direct reflection of the world within us.' - Gabrielle Bernstein"
    ];

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.textContent = randomQuote;


}

function initializeJournalPage() {

    function addPrevListener() { addReflectionClasses(); }
    function addNextListener() { addReflectionClasses(); }

    function attachButtonListeners() {

        setTimeout(function() {
            let prevButton = document.querySelector('.pika-prev');
            let nextButton = document.querySelector('.pika-next');

            if (prevButton) {
                prevButton.removeEventListener('click', addPrevListener);
                prevButton.addEventListener('click', addPrevListener);
                console.log('Previous button listener attached.');
            }
            if (nextButton) {
                nextButton.removeEventListener('click', addNextListener);
                nextButton.addEventListener('click', addNextListener);
            }
        }, 0);
    }
    let picker = new Pikaday({

        onSelect: function (date) {
            let dateString = date.toISOString().substring(0, 10);
            let entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
            let entryForSelectedDate = entries.find(entry => entry.date === dateString);

            let viewReflectionButton = document.getElementById('viewReflectionButton');
            let editReflectionButton = document.getElementById('editReflectionButton');
            let noReflectionMessage = document.getElementById('noReflectionMessage');

            if (entryForSelectedDate) {

                if (viewReflectionButton) {
                    viewReflectionButton.classList.remove('hidden');
                    viewReflectionButton.onclick = function () {
                        onViewReflectionClick(dateString);
                    };
                }
                if (editReflectionButton) {
                    editReflectionButton.classList.remove('hidden');
                    editReflectionButton.onclick = function () {
                        onEditReflectionClick(dateString);
                    };
                }
                if (noReflectionMessage) {
                    noReflectionMessage.classList.add('hidden');
                }
            } else {

                if (viewReflectionButton) {
                    viewReflectionButton.classList.add('hidden');
                }
                if (editReflectionButton) {
                    editReflectionButton.classList.add('hidden');
                }
                if (noReflectionMessage) {
                    noReflectionMessage.classList.remove('hidden');
                    noReflectionMessage.textContent = "No reflection entry found for this date.";
                }
            }

            addReflectionClasses();

        },
        onDraw: function() {

            addReflectionClasses();

            let entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
            let reflectionDates = new Set(entries.map(entry => entry.date));

            if (this.el) {
                let buttons = this.el.querySelectorAll('.pika-button');
                buttons.forEach(button => {
                    let year = button.getAttribute('data-pika-year');
                    let month = button.getAttribute('data-pika-month');
                    let day = button.getAttribute('data-pika-day');
                    let formattedDate = `${year}-${String(Number(month) + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    if (reflectionDates.has(formattedDate)) {
                        button.classList.add('has-reflection');
                    } else {
                        button.classList.remove('has-reflection');
                    }
                });
            }

            attachButtonListeners();
        }
    });

    document.getElementById('datepicker').appendChild(picker.el);
    picker.show();

    attachNavButtonListeners();
    addReflectionClasses();
    attachButtonListeners();
}

function loadPikadayAndInitialize() {
    if (typeof Pikaday === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pikaday/1.8.0/pikaday.min.js';
        script.onload = function () {
            initializeJournalPage();
        };
        script.onerror = function () {
            console.error('Failed to load the Pikaday script!');
        };
        document.head.appendChild(script);
    } else {
        initializeJournalPage();
    }
}
function addReflectionClasses() {
    if (document.querySelector('.pika-table')) {
        let entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
        let reflectionDates = new Set(entries.map(entry => entry.date));
        let buttons = document.querySelectorAll('.pika-button');
        buttons.forEach(button => {
            let year = button.getAttribute('data-pika-year');
            let month = button.getAttribute('data-pika-month');
            let day = button.getAttribute('data-pika-day');
            let formattedDate = `${year}-${String(Number(month) + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

            if (reflectionDates.has(formattedDate)) {
                button.classList.add('has-reflection');
            } else {
                button.classList.remove('has-reflection');
            }
        });
    } else {
        setTimeout(addReflectionClasses, 250);
    }
}




function onViewReflectionClick(dateString) {
    const reflectionEntry = getReflectionEntryForDate(dateString);

    if (reflectionEntry) {
        fetch('reflectionsWrapped.html')
            .then(response => response.text())
            .then(html => {

                document.getElementById('app').innerHTML = html;
                populateJournalWrappedData(reflectionEntry);
            })
            .catch(error => {
                console.error('Error fetching the journalWrapped.html file:', error);
            });
    } else {
        alert("No reflection entry found for this date.");
    }
}

function onEditReflectionClick(dateString) {
    const entry = getReflectionEntryForDate(dateString);
    if (entry) {
        localStorage.setItem('editEntry', JSON.stringify(entry));
        fetchPageContent('reflection.html');
    } else {
        alert('No reflection entry found for this date.');
    }
}


function getReflectionEntryForDate(date) {
    const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    return entries.find(entry => entry.date === date);
}

function populateJournalWrappedData(reflectionEntry) {

    document.querySelector('.reflectionDate').innerText = reflectionEntry.date;
    document.querySelector('.reflectionMood').innerText = reflectionEntry.mood;
    document.querySelector('.reflectionHighlights').innerText = reflectionEntry.highlights;
    document.querySelector('.reflectionChallenges').innerText = reflectionEntry.challenges;

    initializePresentation();
}


function initializePresentation() {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    slides[currentSlide].classList.add('active', 'comment-fly-in');

    document.getElementById('reflectionPresentation').addEventListener('click', function (event) {
        const clickedArea = event.clientX > window.innerWidth / 2 ? 'right' : 'left';

        if (clickedArea === 'right') {
            if (currentSlide < slides.length - 1) {
                slides[currentSlide].classList.remove('active', 'comment-fly-in');
                currentSlide++;
                slides[currentSlide].classList.add('active', 'comment-fly-in');
            } else {
                fetchPageContent('journal.html');
                initializeJournalPage();
            }
        } else if (clickedArea === 'left' && currentSlide > 0) {
            slides[currentSlide].classList.remove('active', 'comment-fly-in');
            currentSlide--;
            slides[currentSlide].classList.add('active', 'comment-fly-in');
        }
    });
}

function stopAndResetAudio() {
    if (audioPlayer) {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
    }
}

function initializeCalmingSounds() {
    const audioSelection = document.getElementById('audioSelection');
    const audioDuration = document.getElementById('audioDuration');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const timerDisplay = document.getElementById('timerDisplay');
    const resetBtn = document.getElementById('resetBtn');
    let countdown;
    let timeRemaining;
    let initialDuration;
    

    function toggleControls(enable) {
        audioSelection.disabled = !enable;
        audioDuration.disabled = !enable;
    }

    audioSelection.addEventListener('change', () => {
        initializeAudio(false);
    });

    audioDuration.addEventListener('change', () => {
        handleDurationChange();
    });

    playPauseBtn.addEventListener('click', togglePlayPause);
    resetBtn.addEventListener('click', hideAndResetButton);

    function handleDurationChange() {
        if (audioPlayer.src) {
            if (audioDuration.value === 'Repeat') {
                audioPlayer.loop = true;
                timerDisplay.textContent = '∞';
                timeRemaining = null;
            } else {
                audioPlayer.loop = false;
                const duration = parseInt(audioDuration.value, 10);
                timeRemaining = duration;
                initialDuration = duration;
                updateTimerDisplay(duration);
            }
        }
    }

    function updateTimerDisplay(seconds) {
        if (audioDuration.value === 'Repeat') {
            timerDisplay.textContent = '∞';
        } else {
            const minutes = Math.floor(seconds / 60);
            const secs = seconds % 60;
            timerDisplay.textContent = `${minutes}:${secs.toString().padStart(2, '0')}`;
        }
    }

    function startCountdown(duration) {
        clearInterval(countdown);
        timeRemaining = duration;
        countdown = setInterval(() => {
            if (timeRemaining > 0) {
                timeRemaining--;
                updateTimerDisplay(timeRemaining);
            } else {
                clearInterval(countdown);
                if (!audioPlayer.loop) {
                    audioPlayer.pause();
                    audioPlayer.currentTime = 0;
                    playPauseBtn.textContent = 'Play';
                    resetBtn.style.display = 'none';
                    toggleControls(true);
                    timeRemaining = initialDuration;
                    updateTimerDisplay(timeRemaining);
                }
            }
        }, 1000);
    }

    function togglePlayPause() {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playPauseBtn.textContent = 'Pause';
            toggleControls(false);
            resetBtn.style.display = 'none';
            if (audioDuration.value !== 'Repeat' && timeRemaining === null) {
                timeRemaining = parseInt(audioDuration.value, 10) || 0;
                initialDuration = timeRemaining;
            }
            startCountdown(timeRemaining);
        } else {
            audioPlayer.pause();
            playPauseBtn.textContent = 'Play';
            clearInterval(countdown);
            resetBtn.style.display = 'inline-block';
        }
    }

    function hideAndResetButton() {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
        playPauseBtn.textContent = 'Play';
        clearInterval(countdown);
        timerDisplay.textContent = '00:00';
        resetBtn.style.display = 'none';
        toggleControls(true);
        timeRemaining = initialDuration;
        updateTimerDisplay(timeRemaining);
    }

    function initializeAudio(change = false) {
        audioPlayer.pause();
        clearInterval(countdown);
        audioPlayer.src = audioSelection.value;
        audioPlayer.loop = audioDuration.value === 'Repeat';
        playPauseBtn.textContent = 'Play';
        resetBtn.style.display = 'none';

        audioPlayer.removeEventListener('ended', onAudioEnded);
        audioPlayer.addEventListener('ended', onAudioEnded);

        handleDurationChange();
    }

    function onAudioEnded() {
        if (timeRemaining > 0 && !audioPlayer.loop) {
            audioPlayer.play();
        } else if (timeRemaining <= 0) {
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
            playPauseBtn.textContent = 'Play';
            resetBtn.style.display = 'none';
            toggleControls(true);
            timeRemaining = initialDuration;
            updateTimerDisplay(timeRemaining);
        }
    }

    initializeAudio();
}

function initializeQuotes() {
    const fetchQuoteBtn = document.getElementById("fetchQuoteBtn");
    fetchQuoteBtn.addEventListener('click', function () {
        document.getElementById('fetchQuoteBtn')
    });
    const quoteMessage = document.getElementById('quoteMessage');

    fetchQuoteBtn.addEventListener('click', function () {
        const selectedCategory = document.getElementById('quoteCategory').value;
        if (selectedCategory === "") {
            quoteMessage.textContent = 'Please choose a category.';
            return;
        }
        quoteMessage.textContent = '';
        localStorage.setItem('quoteCategory', selectedCategory);
        fetchQuote(selectedCategory);
    });
}

function fetchQuote(category) {
    const url = `https://api.quotable.io/random${category ? '?tags=' + category : ''}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not OK');
            }
            return response.json();
        })
        .then(data => {
            displayQuote(("\"" + data.content + "\""), data.author);
        })
        .catch(error => {
            console.error('Fetch error:', error);
            displayQuote("Failed to fetch quote. Please try again.", "");
        });
}

function displayQuote(quote, author) {
    const quoteDisplayArea = document.getElementById('quotes-display');
    let quoteElement = document.querySelector('.quote');
    let authorElement = document.querySelector('.author');

    if (!quoteElement) {
        quoteElement = document.createElement('p');
        quoteElement.className = 'quote';
        quoteDisplayArea.appendChild(quoteElement);
    }
    if (!authorElement) {
        authorElement = document.createElement('p');
        authorElement.className = 'author';
        quoteDisplayArea.appendChild(authorElement);
    }

    quoteElement.textContent = quote;
    authorElement.textContent = author ? `- ${author}` : '';
}


function debugLocalStorage() {
    const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    console.log('All journal entries:', entries);


    const testDate = '2024-03-13';
    const entryForTestDate = entries.find(entry => entry.date === testDate);
    console.log(`Entry for ${testDate}:`, entryForTestDate);
}

function loadGoogleMapsAPIAndInitialize() {
    if (document.getElementById('map')) {
        if (window.google && window.google.maps) {
            initializeMaps();
        } else {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBTGN2dzgI5ZLWwZ4nVbHYo8XvMArvG9sc&callback=initializeMaps&libraries=places&v=weekly`;
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
            window.initializeMaps = initializeMaps;
        }
    }
}

function initializeMaps() {
    const glasgow = { lat: 55.8642, lng: -4.2518 };
    map = new google.maps.Map(document.getElementById('map'), {
        center: glasgow,
        zoom: 13,
    });
    infowindow = new google.maps.InfoWindow();

    setupAddressInputListener();
}

function setupAddressInputListener() {
    const submitAddressButton = document.getElementById('submit-address');
    if (submitAddressButton) {
        submitAddressButton.addEventListener('click', geocodeAddressAndShowPlaces);
    }
}

function geocodeAddressAndShowPlaces() {
    const address = document.getElementById('address-input').value;
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ 'address': address }, function(results, status) {
        if (status === 'OK') {
            const userLocation = results[0].geometry.location;
            map.setCenter(userLocation);
            searchNearby(userLocation, ['gym', 'park', 'restaurant', 'cafe', 'meal_takeaway', 'amusement_park', 'bowling_alley', 'bar', 'night_club', 'movie_theater']);
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

function searchNearby(location, types) {
    const service = new google.maps.places.PlacesService(map);


    types.forEach(type => {
        service.nearbySearch({
            location: location,
            radius: 10000,
            type: [type],
        }, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                results.forEach(result => {
                    if (!result.types.includes('lodging')) {
                        let color = 'red';
                        if (type === 'gym' && !result.name.toLowerCase().includes('school')) {
                            color = 'red';
                        } else if (type === 'park') {
                            color = 'green';
                        } else if (type === 'amusement_park' || type === 'bowling_alley' ||
                            type === 'movie_theater') {
                            color = 'blue';
                        } else if (type === 'restaurant' || type === 'cafe' || type === 'meal_takeaway' || type === 'bar' || type === 'night_club') {
                            color = 'yellow';
                        }
                        createMarker(result, color);
                    }
                });
            }
        });
    });
}


function createMarker(place, color) {
    const marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 9,
            fillColor: color,
            fillOpacity: 0.8,
            strokeWeight: 0.4,
        },
    });

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(`${place.name}<br>Type: ${place.types[0]}`);
        infowindow.open(map, this);
    });
}

debugLocalStorage();