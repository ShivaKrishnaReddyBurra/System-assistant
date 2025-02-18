document.getElementById("start-btn").addEventListener("click", () => {
    window.electron.startVoiceAssistant();
});

window.electron.onAssistantResponse((response) => {
    document.getElementById("output").textContent += response + "\n";
});
