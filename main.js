require("dotenv").config();
const { app, BrowserWindow, ipcMain } = require("electron");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

// Import setup functions
const { runSetup, pythonExecutable, unpackedScriptPath } = require("./setup");

let mainWindow;
let pythonProcess;

// Ensure Python environment is set up before running the app
(async () => {
    await runSetup(); // Run setup before proceeding
})();

const scriptPath = unpackedScriptPath;
console.log("App Directory:", path.dirname(pythonExecutable));
console.log("Python Executable:", pythonExecutable);
console.log("Python Script Path:", scriptPath);

function ensurePythonEnv() {
    if (!fs.existsSync(pythonExecutable)) {
        console.error("❌ Python virtual environment is missing! Run `node setup.js` first.");
        app.quit();
    }
}

app.whenReady().then(() => {
    ensurePythonEnv(); // Ensure the Python environment is available

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

    mainWindow.on("closed", () => {
        if (pythonProcess) {
            pythonProcess.kill();
        }
    });
});

ipcMain.on("start-voice-assistant", (event) => {
    if (!pythonProcess) {
        console.log("🔊 Starting voice assistant...");
        pythonProcess = spawn(pythonExecutable, [scriptPath]);

        pythonProcess.stdout.on("data", (data) => {
            console.log(`📝 Assistant Output: ${data}`);
            mainWindow.webContents.send("assistant-response", data.toString());
        });

        pythonProcess.stderr.on("data", (data) => {
            console.error(`❌ Assistant Error: ${data}`);
        });

        pythonProcess.on("close", (code) => {
            console.log(`🛑 Assistant Process Closed (Code: ${code})`);
            pythonProcess = null;
            app.quit();
        });
    }
});

app.on("window-all-closed", () => {
    if (pythonProcess) {
        pythonProcess.kill();
    }
    app.quit();
});
