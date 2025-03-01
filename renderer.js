const startBtn = document.getElementById('start-btn');
const loader = document.getElementById('loader');
const pulseRing = document.getElementById('pulse-ring');
const outputElement = document.getElementById('output');

// Start button click event
startBtn.addEventListener('click', () => {
    // Show loader and hide mic button
    loader.classList.add('active');
    startBtn.style.display = 'none';
    pulseRing.classList.remove('active');
    
    $('.assistant-subtitle').addClass('d-none');
    
    window.electron.startVoiceAssistant()
});

// Handle assistant response
if (window.electron) {
    window.electron.onAssistantResponse((response) => {
        addResponse(response);
    });
}

// For demonstration without electron
function simulateResponse(text) {
    addResponse(text);
}

// Add response to output
function addResponse(text) {
    // Create a new response element
    const responseElement = document.createElement('div');
    responseElement.classList.add('response-message');
    responseElement.innerHTML = text;
    
    // Add the new response
    outputElement.appendChild(responseElement);
    
    // Scroll to bottom
    scrollToBottom();
}

// Auto-scroll functionality
function scrollToBottom() {
    const responseArea = document.querySelector('.response-area');
    responseArea.scrollTop = responseArea.scrollHeight;
}

// Mutation observer to keep scrolling to bottom when content changes
const observer = new MutationObserver(scrollToBottom);
observer.observe(outputElement, { childList: true, subtree: true });

// Initialize pulse effect
setTimeout(() => {
    pulseRing.classList.add('active');
}, 500);