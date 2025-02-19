const loader = document.querySelector(".loader");
const delay = +loader.dataset.delay || 200;
const dots = loader.querySelectorAll(".loader .dot");
dots.forEach((dot, index) => {
  dot.style = `--delay: ${delay * index}`;
});

document.getElementById("start-btn").addEventListener("click", () => {
    $('.loader').removeClass('d-none');
    $('#start-btn').addClass('d-none');
    window.electron.startVoiceAssistant();
});

window.electron.onAssistantResponse((response) => {
    document.getElementById("output").innerHTML += response + "<br>";
});

const outputElement = document.getElementById("output");

const scrollToBottom = () => {
    outputElement.scrollTop = outputElement.scrollHeight;
};

const observer = new MutationObserver(scrollToBottom);

observer.observe(outputElement, { childList: true });

outputElement.addEventListener("scroll", () => {
    if (outputElement.scrollTop + outputElement.clientHeight >= outputElement.scrollHeight) {
        observer.observe(outputElement, { childList: true });
    } else {
        observer.disconnect();
    }
});

