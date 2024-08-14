 let speech = new SpeechSynthesisUtterance();
        let voices = [];
        let voiceSelect = document.querySelector("select");
        let downloadButton = document.querySelector(".download-btn");
        let isRecording = false;

        // Function to convert data URI to Blob
        function dataURItoBlob(dataURI) {
            const byteString = atob(dataURI.split(",")[1]);
            const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            return new Blob([ab], { type: mimeString });
        }

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
            if (!isRecording) {
                isRecording = true;
                startRecording();
            }
            window.speechSynthesis.speak(speech);
        });

        function startRecording() {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const audioContext = new AudioContext();
            const audioDestination = audioContext.createMediaStreamDestination();
            audioContext.createBufferSource().connect(audioDestination);
            const mediaRecorder = new MediaRecorder(audioDestination.stream);
            let chunks = [];

            mediaRecorder.ondataavailable = (e) => {
                chunks.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: "audio/mp3" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "text_to_speech.mp3"; // Set the filename for the downloaded file
                a.style.display = "none"; // Hide the anchor element
                document.body.appendChild(a); // Append the anchor element to the document
                a.click(); // Programmatically trigger the click event
                document.body.removeChild(a); // Remove the anchor element after download
                URL.revokeObjectURL(url); // Release the URL object after download
                downloadButton.disabled = false; // Enable the download button after the file is downloaded
                isRecording = false; // Reset the recording flag
            };

            mediaRecorder.start();
            setTimeout(() => {
                mediaRecorder.stop();
            }, 2000); // Adjust the duration (in milliseconds) as needed
        }