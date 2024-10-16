/* global DeviceOrientationEvent */
"use strict";

let timePara, distancePara, activeField, watchId, totalDistance, startPosition, startTime;
let tracking = false;

const buttonClickHandler = function(evt){
    console.log(evt.target.innerText);

    const buttonId = evt.target.id;

    switch(buttonId){

        case 'C':
            if (activeField) {
                activeField.innerText = "0";
                calculatePace();
            }
            break;

        case "Arr":
            if (activeField && activeField.innerText.length > 1){
                activeField.innerText = activeField.innerText.slice(0,-1);
            } else if (activeField) {
                activeField.innerText = "0";
                calculatePace();
            }
            break;

        default:
            if (activeField){
                const maxLength = activeField === distancePara ? 5 : 3;
                if (activeField.innerText.length < maxLength || activeField.innerText === '0') {
                    activeField.innerText = activeField.innerText === '0' ? evt.target.innerText : activeField.innerText + evt.target.innerText;
                }
                calculatePace();
            }
            break;

    }
    saveData();
};

function highlightActiveField(){

    timePara.classList.remove('active-input');
    distancePara.classList.remove('active-input');
    activeField.classList.add('active-input');

}
function calculatePace() {
    const time = parseInt(timePara.innerText, 10);
    const distance = parseInt(distancePara.innerText, 10);

    if (isNaN(time) || isNaN(distance) || distance <= 0) {
        document.getElementById("pace").innerText = "-- mins/km";
        return;
    }

    if (distance > 10 && time > 5) {
        const pace = Math.round(time / (distance / 1000));
        document.getElementById("pace").innerText = `${pace} mins/km`;
    } else {
        document.getElementById("pace").innerText = "--";
    }
    saveData();
}

const startStopTracking = function() {

    const startBtn = document.getElementById('Start');

    if (!tracking) {
        tracking = true;
        startBtn.innerText = 'Stop';
        totalDistance = 0;
        startTime = new Date();
        navigator.geolocation.getCurrentPosition(position => {
            startPosition = position;
            watchId = navigator.geolocation.watchPosition(updatePosition, handleError, {enableHighAccuracy: true, maximumAge: 0});
        }, handleError);
        document.getElementById('liveDistance').innerText = "Live Distance: 0m";
        document.getElementById('livePace').innerText = "Average Pace: -- mins/km";
    }

    else {
        navigator.geolocation.clearWatch(watchId);
        tracking = false;
        startBtn.innerText = 'Start';
        startPosition = null;
        calculateAveragePace();
    }
};

const updatePosition = function(position) {

    if (startPosition && startPosition.coords && position.coords) {
        const distance = calculateDistance(
            startPosition.coords.latitude,
            startPosition.coords.longitude,
            position.coords.latitude,
            position.coords.longitude
        );
        startPosition = position;

        if (!isNaN(distance)) {
            totalDistance += distance;
            document.getElementById('liveDistance').innerText = `Live Distance: ${totalDistance.toFixed(2)}m`;
            calculateAveragePace();
        } else {
            console.error('Invalid distance calculation');
        }
    }
};
function calculateAveragePace() {

    const now = new Date();
    const elapsed = (now - startTime) / 1000 / 60;
    const distanceKm = totalDistance / 1000; //

    console.log(`Elapsed time: ${elapsed} minutes, Distance: ${distanceKm} km`);


    if (distanceKm > 0) {
        const pace = elapsed / distanceKm;
        document.getElementById("livePace").innerText = `Average Pace: ${pace.toFixed(2)} mins/km`;
    } else {
        document.getElementById("livePace").innerText = "Moving...";
    }
}

const calculateDistance = function(lat1, lon1, lat2, lon2) {
    const R = 6371000; //radius of the earth in m
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
};


const handleError = function(error) {
    console.warn(`ERROR(${error.code}): ${error.message}`);
};

function saveData() {
    const paceElement = document.getElementById("pace");

    localStorage.setItem('time', timePara.innerText);
    localStorage.setItem('distance', distancePara.innerText);
    localStorage.setItem('pace', paceElement.innerText);
    localStorage.setItem('totalDistance', totalDistance.toString());
}

function addOrientationListener() {
    const inclinePrompt = document.getElementById('inclinePrompt');
    if (window.inclineResetTimeout) {
        clearTimeout(window.inclineResetTimeout);
    }
    const handleOrientationEvent = (event) => {
        const beta = event.beta;


        const gradientPercent = Math.tan(beta * Math.PI / 180) * 100;
        const gradientDirection = gradientPercent >= 0 ? 'uphill' : 'downhill';
        const formattedGradient = Math.abs(gradientPercent).toFixed(2);
        const formattedBeta = Math.abs(beta).toFixed(2);

        inclinePrompt.innerText = `◬ Incline: ${formattedGradient}% ${gradientDirection} (${formattedBeta}°) ◬`;

        window.inclineResetTimeout = setTimeout(() => {
            inclinePrompt.innerText = '◬ Tap to show incline ◬';
            window.inclineResetTimeout = null;
        }, 30000);
    };


    window.addEventListener('deviceorientation', handleOrientationEvent, { once: true });
}

function displayIncline() {

    if (!window.DeviceOrientationEvent) {
        document.getElementById('inclinePrompt').innerText = 'Device orientation not supported';
        return;
    }


    if (DeviceOrientationEvent.requestPermission && typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    addOrientationListener();
                } else {
                    document.getElementById('inclinePrompt').innerText = 'Permission denied for device orientation';
                }
            })
            .catch(console.error);
    } else {

        addOrientationListener();
    }
}
const init = function() {

    timePara = document.getElementById("time");
    const savedTime = localStorage.getItem('time');

    distancePara = document.getElementById("distance");
    const savedDistance = localStorage.getItem('distance');

    const paceElement = document.getElementById("pace");
    const savedPace = localStorage.getItem('pace');

    totalDistance = parseFloat(localStorage.getItem('totalDistance')) || 0;
    document.getElementById('liveDistance').innerText = `Live Distance: ${totalDistance.toFixed(2)}m`;

    if (savedTime !== null) {
        timePara.innerText = savedTime;
    }
    if (savedDistance !== null) {
        distancePara.innerText = savedDistance;
    }
    if (savedPace !== null) {
        paceElement.innerText = savedPace;
    }

    activeField = distancePara;
    highlightActiveField();

    document.querySelectorAll('#keypad button').forEach(button => {
        button.addEventListener('click', buttonClickHandler);
    });

    timePara.addEventListener('click', function() {
        activeField = timePara;
        highlightActiveField();
    });

    distancePara.addEventListener('click', function() {
        activeField = distancePara;
        highlightActiveField();
    });

    document.getElementById('Start').addEventListener('click', startStopTracking);


    const inclineElement = document.getElementById("inclinePrompt");
    inclineElement.addEventListener('click', displayIncline);
};


window.addEventListener("pageshow", init);
