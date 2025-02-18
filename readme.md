# System Assistant

This project is a voice-activated system assistant that can perform various tasks such as opening websites, playing music, fetching news, and more. The assistant uses speech recognition to understand user commands and responds accordingly. Additionally, Electron.js is used to create a desktop application for the assistant.

## Features

- **Voice Commands**: The assistant listens for voice commands and responds appropriately.
- **Web Browsing**: Open websites like YouTube and Google using voice commands.
- **Play Music**: Play songs on YouTube by simply saying the song name.
- **Fetch News**: Get the latest news headlines.
- **Text-to-Speech**: The assistant can speak responses using Azure Cognitive Services.
- **Desktop Application**: The assistant is available as a desktop application built with Electron.js.

## Requirements

- Python 3.6+
- `speech_recognition`
- `webbrowser`
- `pywhatkit`
- `requests`
- `azure-cognitiveservices-speech`
- `openai`
- `electron`

## Setup

1. Clone the repository:
    ```sh
    git clone <repository_url>
    cd system-assistant
    ```

2. Install the required packages:
    ```sh
    pip install -r requirements.txt
    ```

3. Set up environment variables for Azure and OpenAI:
    ```sh
    export AZURE_OPENAI_ENDPOINT=<your_azure_openai_endpoint>
    export AZURE_OPENAI_API_KEY=<your_azure_openai_api_key>
    export SPEECH_KEY=<your_speech_key>
    export SPEECH_REGION=<your_speech_region>
    ```

4. Install Electron.js dependencies:
    ```sh
    npm install
    ```

5. Run the assistant:
    ```sh
    python assistant.py
    ```

6. Start the Electron.js application:
    ```sh
    npm start
    ```

## Usage

- **Activate the assistant**: Say "captain" followed by your command.
- **Open YouTube**: "captain open youtube"
- **Open Google**: "captain open google"
- **Play a song**: "captain play [song name]"
- **Get news**: "captain today's news"
- **Exit the assistant**: "captain you can go now" or "bye"

## Error Handling

The assistant includes error handling for:
- Speech recognition errors
- API request errors
- Unexpected exceptions

## License

This project is licensed under the MIT License.

## Acknowledgements

- [Azure Cognitive Services](https://azure.microsoft.com/en-us/services/cognitive-services/)
- [OpenAI](https://www.openai.com/)
- [SpeechRecognition](https://pypi.org/project/SpeechRecognition/)
- [PyWhatKit](https://pypi.org/project/pywhatkit/)
- [News API](https://newsapi.org/)
- [Electron.js](https://www.electronjs.org/)
