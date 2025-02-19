const { spawnSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const appDir = path.join(process.env.HOME, ".system-assistant"); // App storage
const venvDir = path.join(appDir, "venv"); // Virtual environment
const pythonExecutable = path.join(venvDir, "bin", "python3"); // Python binary
const scriptPath = path.join(__dirname, "assistant.py"); // Path to Python script
const unpackedScriptPath = path.join(appDir, "assistant.py"); // Path after unpacking

console.log("📂 App Directory:", appDir);
console.log("🐍 Virtual Env Directory:", venvDir);
console.log("🔍 Python Executable:", pythonExecutable);
console.log("📜 Python Script Path:", unpackedScriptPath);

async function runSetup() {
    // Ensure the app directory exists
    if (!fs.existsSync(appDir)) {
        fs.mkdirSync(appDir, { recursive: true });
    }

    // Ensure Python virtual environment is set up
    if (!fs.existsSync(pythonExecutable)) {
        console.log("⚙️ Creating Python virtual environment...");
        spawnSync("python3", ["-m", "venv", venvDir], { stdio: "inherit" });
    }

    // Install required dependencies
    console.log("📦 Installing Python dependencies...");
    spawnSync(pythonExecutable, ["-m", "pip", "install", "-r", "requirements.txt"], {
        stdio: "inherit",
    });

    // Ensure `assistant.py` exists in the app directory
    if (!fs.existsSync(unpackedScriptPath)) {
        console.log("📜 Copying `assistant.py` to system directory...");
        fs.copyFileSync(scriptPath, unpackedScriptPath);
    }
}

// Export the setup function and paths
module.exports = {
    runSetup,
    pythonExecutable,
    unpackedScriptPath,
};
