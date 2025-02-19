import speech_recognition as sr
import webbrowser
import pywhatkit as kit
import requests
from datetime import datetime
import os
import azure.cognitiveservices.speech as speechsdk
from openai import AzureOpenAI

client = AzureOpenAI(
  azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT"), 
  api_key=os.getenv("AZURE_OPENAI_API_KEY"),  
  api_version="2024-02-01"
)
conversation=[{"role": "system", "content": "You are a helpful assistant."}]
speech_config = speechsdk.SpeechConfig(subscription=os.environ.get('SPEECH_KEY'), region=os.environ.get('SPEECH_REGION'))
audio_config = speechsdk.audio.AudioOutputConfig(use_default_speaker=True)
speech_config.speech_synthesis_voice_name='en-US-RyanMultilingualNeural'
speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=audio_config)

def speak(text):
    """Speak the given text."""
    print(text, flush=True)
    speech_synthesis_result = speech_synthesizer.speak_text_async(text).get()
    if speech_synthesis_result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
        print("Speech synthesized for text [{}]".format(text), flush=True)
    elif speech_synthesis_result.reason == speechsdk.ResultReason.Canceled:
        cancellation_details = speech_synthesis_result.cancellation_details
        print("Speech synthesis canceled: {}".format(cancellation_details.reason), flush=True)
        if cancellation_details.reason == speechsdk.CancellationReason.Error:
            if cancellation_details.error_details:
                print("Error details: {}".format(cancellation_details.error_details), flush=True)
                print("Did you set the speech resource key and region values?", flush=True)

def listen_and_respond():
    """Listen to user input and respond accordingly."""
    recognizer = sr.Recognizer()
    
    with sr.Microphone() as source:
        try:
            assistant = recognizer.listen(source, timeout=20, phrase_time_limit=20)
            command = recognizer.recognize_google(assistant).lower()
            print(f"You said: {command}", flush=True)
            if "captain" in command:
                extract_command = command.split("captain", 1)[1].strip()
                return captain_at_your_service(recognizer,source,extract_command)
            else:
                pass
        except sr.UnknownValueError:
            print("Sorry, I didn't catch that. Could you please repeat?", flush=True)
        except sr.RequestError as e:
            print(f"Could not request results; {e}", flush=True)
            print("There was an error connecting to the speech recognition service.", flush=True)
        except Exception as e:
            print(f"An unexpected error occurred: {e}", flush=True)
            print("An unexpected error occurred. Please try again.", flush=True)
        
    return True


def captain_at_your_service(recognizer,source,command=""):
    try:
        # Capture the audio input
        if(command):
            conversation.append({"role": "user", "content": command})
        else:
            speak("captain at your service")
            audio = recognizer.listen(source, timeout=20, phrase_time_limit=20)
            speak("Processing your input.")
            
            # Recognize the speech
            command = recognizer.recognize_google(audio).lower()
            print(f"You said: {command}")
            conversation.append({"role": "user", "content": command})

        ai_response = client.chat.completions.create(
        model="gpt-35-turbo", # model = "deployment_name".
        messages=conversation
        )
        response = ai_response.choices[0].message.content

    
        if "I'm sorry" in response or "I am sorry" in response or "I apologize":

            if "open youtube" in command:
                webbrowser.open("https://www.youtube.com")
                speak("Opening YouTube for you.")
                speak("what do you want me to do next?")
                search = recognizer.listen(source, timeout=20, phrase_time_limit=20)
                command = recognizer.recognize_google(search).lower()
                if "play" in command:
                    song = command.replace("play", "")
                    response = actions_on_youtube("play",song)
                else:
                    search = command.replace("search", "")
                    response = actions_on_youtube("search",search)

            elif "open google" in command or "captain open google" in command:
                webbrowser.open("https://www.google.com")
                response = "Opening Google for you."

            elif "today's news" in command:
                response = get_news()
            elif "today's time" in command:
                response = date_and_time("time")

            else:
                response = "Sorry, I didn't understand that."
        elif "exit" in command or "quit" in command or "captain you can go now" in command or "take a leave" in command or "bye" in command:
                response = "Goodbye! Have a great day."
                speak(response)
                return False  
        speak(response)
    except sr.UnknownValueError:
        speak("Sorry, I didn't catch that. Could you please repeat?")
    except sr.RequestError as e:
        print(f"Could not request results; {e}")
        speak("There was an error connecting to the speech recognition service.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        speak("An unexpected error occurred. Please try again.")
    return True

def get_news():
    """Fetches the latest news from an API and returns it."""
    api_key = "f984e2735e5641989fd48f0beb370d61"  # Replace with your own news API key
    url = f"https://newsapi.org/v2/top-headlines?country=us&apiKey={api_key}"

    try:
        response = requests.get(url)
        data = response.json()
        articles = data['articles'][:5]  # Get top 5 news articles

        if articles:
            news = "Here are the top headlines today:\n"
            for idx, article in enumerate(articles, 1):
                news += f"{idx}. {article['title']}\n"
            return news
        else:
            return "Sorry, I couldn't fetch the news at the moment."
    except Exception as e:
        return f"Sorry, there was an error fetching the news: {e}"


def actions_on_youtube(type,query):
    if type == "play":
        kit.playonyt(query)
        return f"playing {query}"
    if type == "search":
        webbrowser.open(f"https://www.youtube.com/results?search_query={query}")
        return f"here are the results for {query}"


def date_and_time(type):
    now = datetime.now()
    date = now.strftime("%Y-%m-%d")
    time = now.strftime("%H:%M:%S")
    if type == "time":
       return f"The time right now is {time}"
    if type == "date":
        return f"Today's date is {date}"
    return f"Today's date is {date} and it's {time}"     

# Main loop to keep the program running
if __name__ == "__main__":
    print("Starting the voice assistant. Say 'exit' or 'quit' to stop.", flush=True)
    while listen_and_respond():
        pass
    print("Voice assistant stopped.", flush=True)
