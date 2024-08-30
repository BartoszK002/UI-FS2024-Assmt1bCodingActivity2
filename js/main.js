console.log("Hello! This is your javascript file.");

// Array to store user entries with dummy data for past days, now including hydration
const userEntries = [
    { date: '2024-08-25', sleep: 7, moods: ['joyful', 'energized', 'curious'], hydration: 6 },
    { date: '2024-08-26', sleep: 6.5, moods: ['anxious', 'frustrated', 'melancholy'], hydration: 5 },
    { date: '2024-08-27', sleep: 8, moods: ['peaceful', 'focused', 'joyful'], hydration: 7 },
    { date: '2024-08-28', sleep: 7.5, moods: ['energized', 'curious'], hydration: 3 } // Today's entry
];

// Function to initialize sleep and hydration data
function initializeData() {
    const sleepInput = document.getElementById('sleep-duration');
    const hydrationInput = document.getElementById('water-intake');
    const today = userEntries[userEntries.length - 1];
    
    sleepInput.value = today.sleep;
    hydrationInput.value = today.hydration;
    
    updateSleepSVG(today.sleep);
    updateHydrationVisual(today.hydration);
    updateTotalWater(today.hydration);
}

// Function to update sleep duration when user changes the input
function updateSleep() {
    const sleepInput = document.getElementById('sleep-duration');
    let sleepDuration = parseFloat(sleepInput.value);
    
    // Limit sleep duration to 12 hours
    sleepDuration = Math.min(Math.max(sleepDuration, 0), 12);
    sleepInput.value = sleepDuration;
    
    const today = userEntries[userEntries.length - 1];
    today.sleep = sleepDuration;
    updateSummary();
    updateSleepSVG(sleepDuration);
}

// Function to update hydration when user changes the input
function updateHydration() {
    const hydrationInput = document.getElementById('water-intake');
    const hydrationAmount = parseInt(hydrationInput.value);
    const today = userEntries[userEntries.length - 1];
    today.hydration = hydrationAmount;
    updateSummary();
    updateHydrationVisual(hydrationAmount);
    updateTotalWater(hydrationAmount);
}

// Function to update the sleep SVG
function updateSleepSVG(sleepDuration) {
    // Update the text
    const svgText = document.querySelector('.sleep-quality svg text');
    svgText.textContent = `${sleepDuration}h`;

    // Update the circular progress bar
    const circle = document.querySelector('.sleep-quality svg circle:nth-child(2)');
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const maxSleep = 12; // Assuming 12 hours is the maximum
    const offset = circumference - (sleepDuration / maxSleep) * circumference;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = offset;
}

// Function to update the hydration visual
function updateHydrationVisual(hydrationAmount) {
    const waterLevel = document.querySelector('.water-level');
    const waterText = document.querySelector('.water-text');
    const maxHydration = 12; // 12 glasses (3000ml total)
    
    const percentage = (hydrationAmount / maxHydration) * 100;
    waterLevel.style.height = `${percentage}%`;
    waterText.textContent = `${hydrationAmount}/${maxHydration}`;
}

// New function to update total water drank
function updateTotalWater(hydrationAmount) {
    const totalWater = hydrationAmount * 250; // 250ml per glass
    document.getElementById('total-water').textContent = totalWater;
}

// Function to update moods when user checks/unchecks mood checkboxes
function updateMoods() {
    const moodCheckboxes = document.querySelectorAll('.mood-selectors input[type="checkbox"]');
    const today = userEntries[userEntries.length - 1]; // Get today's entry
    // Update moods array with checked mood values
    today.moods = Array.from(moodCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);
    updateSummary(); // Recalculate and display summary
}

// Function to create the mood chart
function createMoodChart(moodCounts) {
    const moodChart = document.getElementById('mood-chart');
    moodChart.innerHTML = ''; // Clear previous chart

    const maxCount = Math.max(...Object.values(moodCounts));
    const colors = {
        joyful: '#FFD700',
        peaceful: '#90EE90',
        energized: '#FF4500',
        curious: '#1E90FF',
        focused: '#8A2BE2',
        anxious: '#FF69B4',
        frustrated: '#DC143C',
        melancholy: '#4682B4'
    };

    // Function to calculate logarithmic width
    const logScale = (count) => {
        return Math.log(count + 1) / Math.log(maxCount + 1);
    };

    Object.entries(moodCounts).forEach(([mood, count]) => {
        const barContainer = document.createElement('div');
        barContainer.className = 'mood-bar-container';

        const label = document.createElement('span');
        label.className = 'mood-label';
        label.textContent = mood;

        const barWrapper = document.createElement('div');
        barWrapper.className = 'mood-bar-wrapper';

        const bar = document.createElement('div');
        bar.className = 'mood-bar';
        // Set width based on logarithmic scale
        const widthPercentage = logScale(count) * 100;
        bar.style.width = `${widthPercentage}%`;
        bar.style.backgroundColor = colors[mood] || '#999';

        const countLabel = document.createElement('span');
        countLabel.className = 'mood-count';
        countLabel.textContent = `${count} day${count !== 1 ? 's' : ''}`;

        barWrapper.appendChild(bar);

        barContainer.appendChild(label);
        barContainer.appendChild(barWrapper);
        barContainer.appendChild(countLabel);
        moodChart.appendChild(barContainer);
    });
}

// Add this function to create mini-charts
function createMiniChart(elementId, value, maxValue) {
    const chart = document.getElementById(elementId);
    chart.innerHTML = ''; // Clear previous content
    
    const bar = document.createElement('div');
    bar.className = 'mini-chart-bar';
    const percentage = (value / maxValue) * 100;
    bar.style.width = `${percentage}%`;
    
    chart.appendChild(bar);
}

// Modify the updateSummary function to include mini-charts
function updateSummary() {
    // Calculate and update average sleep
    const avgSleep = userEntries.reduce((sum, entry) => sum + entry.sleep, 0) / userEntries.length;
    document.getElementById('avg-sleep').textContent = avgSleep.toFixed(1);
    createMiniChart('sleep-chart', avgSleep, 12); // Assuming 12 hours is the maximum

    // Calculate and update average hydration
    const avgHydration = userEntries.reduce((sum, entry) => sum + entry.hydration, 0) / userEntries.length;
    document.getElementById('avg-hydration').textContent = avgHydration.toFixed(1);
    createMiniChart('hydration-chart', avgHydration, 12); // Assuming 12 glasses is the maximum

    // Calculate and update average total water
    const avgTotalWater = avgHydration * 250; // 250ml per glass
    document.getElementById('avg-total-water').textContent = avgTotalWater.toFixed(0);

    // Count occurrences of each mood
    const moodCounts = {};
    userEntries.forEach(entry => {
        entry.moods.forEach(mood => {
            moodCounts[mood] = (moodCounts[mood] || 0) + 1;
        });
    });

    // Create and update the mood chart
    createMoodChart(moodCounts);
}

// Function to update the current date and time
function updateCurrentDateTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const formattedDate = now.toLocaleDateString('en-US', options);
    const timeElement = document.querySelector('.entry-timestamp time');
    timeElement.setAttribute('datetime', now.toISOString());
    timeElement.textContent = formattedDate;
}

// Event listeners and initializations
document.addEventListener('DOMContentLoaded', function() {
    updateCurrentDateTime();
    initializeData();
    updateSummary();

    // Add event listener for sleep duration input
    const sleepInput = document.getElementById('sleep-duration');
    sleepInput.addEventListener('change', updateSleep);
    sleepInput.addEventListener('input', function() {
        this.value = Math.min(Math.max(this.value, 0), 12);
    });

    // Add event listener for hydration input
    document.getElementById('water-intake').addEventListener('change', updateHydration);

    // Add event listeners for all mood checkboxes
    document.querySelectorAll('.mood-selectors input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateMoods);
    });

    // Update the max attribute of the water intake input
    document.getElementById('water-intake').setAttribute('max', '12');
});