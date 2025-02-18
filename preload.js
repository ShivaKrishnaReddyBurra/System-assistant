const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld("electron", {
    startVoiceAssistant: () => ipcRenderer.send("start-voice-assistant"),
    onAssistantResponse: (callback) => ipcRenderer.on("assistant-response", (_event, data) => callback(data)),
});
