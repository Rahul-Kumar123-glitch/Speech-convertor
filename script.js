let speech = new SpeechSynthesisUtterance();
        let voices = [];
        let voiceSelect = document.querySelector("select");
        let downloadButton = document.querySelector(".download-btn");
        let isPlaying = false;

        window.speechSynthesis.onvoiceschanged = () => {
            voices = window.speechSynthesis.getVoices();
            speech.voice = voices[0];
            voices.forEach((voice, i) => (voiceSelect.options[i] = new Option(voice.name, i)));
        };

        voiceSelect.addEventListener("change", () => {
            speech.voice = voices[voiceSelect.value];
        });

        document.querySelector(".btn").addEventListener("click", () => {
            speech.text = document.querySelector(".text").value;
            if (!isPlaying) {
                isPlaying = true;
                startPlaying();
            }
            window.speechSynthesis.speak(speech);
        });

        speech.addEventListener("end", () => {
            isPlaying = false;
            downloadButton.disabled = false; // Enable the download button after speech ends
        });

        function startPlaying() {
            const audioContext = new AudioContext();
            const mediaRecorder = new MediaRecorder(audioContext.createMediaStreamDestination());

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    const blob = new Blob([event.data], { type: "audio/wav" });
                    const url = URL.createObjectURL(blob);
                    const audio = new Audio(url);
                    audio.play();
                }
            };

            mediaRecorder.onstop = () => {
                downloadButton.disabled = false; // Enable the download button after recording stops
            };

            mediaRecorder.start();
            setTimeout(() => {
                mediaRecorder.stop();
            }, 2000); // Adjust the duration (in milliseconds) as needed
        }

        downloadButton.addEventListener("click", () => {
            downloadButton.disabled = true; // Disable the download button to prevent multiple clicks

            // Code to save audio as an MP3 file goes here

            // After the download is complete, re-enable the button
            downloadButton.disabled = false;
        });