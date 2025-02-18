require("dotenv").config();
const { app, BrowserWindow, ipcMain } = require("electron");
const { spawn } = require("child_process");
const path = require("path");

let mainWindow;
let pythonProcess;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js"),
        },
    });

    mainWindow.loadFile("index.html");

    // Handle app close
    mainWindow.on("closed", () => {
        if (pythonProcess) {
            pythonProcess.kill(); // Terminate Python process
        }
    });
});

ipcMain.on("start-voice-assistant", (event) => {
    let pythonPath = process.env.PYTHON_PATH; // Path to Python executable
    let scriptPath = path.join(__dirname, "assistant.py");
    if (!pythonProcess) {
        pythonProcess = spawn(pythonPath, [scriptPath]);

        pythonProcess.stdout.on("data", (data) => {
            mainWindow.webContents.send("assistant-response", data.toString());
        });

        pythonProcess.stderr.on("data", (data) => {
            console.error(`Error: ${data}`);
        });

        pythonProcess.on("close", () => {
            pythonProcess = null; // Reset when process ends
        });
    }
});

app.on("window-all-closed", () => {
    if (pythonProcess) {
        pythonProcess.kill();
    }
    app.quit();
});
