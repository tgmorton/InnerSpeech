'use strict';

var jspsych = require('jspsych');

const info = {
    name: "html-audio-response",
    parameters: {
        /** The HTML string to be displayed */
        stimulus: {
            type: jspsych.ParameterType.HTML_STRING,
            default: undefined,
        },
        /** How long to show the stimulus. */
        stimulus_duration: {
            type: jspsych.ParameterType.INT,
            default: null,
        },
        /** How long to show the trial. */
        recording_duration: {
            type: jspsych.ParameterType.INT,
            default: null,
        },
        /** Whether or not to show a button to end the recording. If false, the recording_duration must be set. */
        show_done_button: {
            type: jspsych.ParameterType.BOOL,
            default: true,
        },
        /** Label for the done (stop recording) button. Only used if show_done_button is true. */
        done_button_label: {
            type: jspsych.ParameterType.STRING,
            default: "Continue",
        },
        /** Label for the record again button (only used if allow_playback is true). */
        record_again_button_label: {
            type: jspsych.ParameterType.STRING,
            default: "Record again",
        },
        /** Label for the button to accept the audio recording (only used if allow_playback is true). */
        accept_button_label: {
            type: jspsych.ParameterType.STRING,
            default: "Continue",
        },
        /** Whether or not to allow the participant to playback the recording and either accept or re-record. */
        allow_playback: {
            type: jspsych.ParameterType.BOOL,
            default: false,
        },
        /** Whether or not to save the video URL to the trial data. */
        save_audio_url: {
            type: jspsych.ParameterType.BOOL,
            default: false,
        },
        /** Whether or not to use the voice-key functionality. */
        use_voice_key: {
            type: jspsych.ParameterType.BOOL,
            default: true,
        },
        /** The amplitude threshold for the voice-key. */
        amplitude_threshold: {
            type: jspsych.ParameterType.FLOAT,
            default: 0.1,
        },
        /** The duration of the timer that starts when the amplitude threshold is surpassed. */
        timer_duration: {
            type: jspsych.ParameterType.INT,
            default: 350,
        },
    },
};
/**
 * html-audio-response
 * jsPsych plugin for displaying a stimulus and recording an audio response through a microphone
 * @author Josh de Leeuw
 * @see {@link https://www.jspsych.org/plugins/jspsych-html-audio-response/ html-audio-response plugin documentation on jspsych.org}
 */
class HtmlAudioResponsePlugin {
    constructor(jsPsych) {
        this.jsPsych = jsPsych;
        this.rt = null;
        this.recorded_data_chunks = [];
        this.meter = null;
        this.canvasContext = null;
        this.isLoggingAmplitude = false;
        this.amplitudeLoggingTimeoutId = null;
    }
    trial(display_element, trial) {
        this.jsPsych.pluginAPI.audioContext();
        this.recorder = this.jsPsych.pluginAPI.getMicrophoneRecorder();
        this.setupRecordingEvents(display_element, trial);
        this.startRecording(trial);
    }
    showDisplay(display_element, trial) {
        const ro = new ResizeObserver((entries, observer) => {
            this.stimulus_start_time = performance.now();
            observer.unobserve(display_element);
            //observer.disconnect();
        });
        ro.observe(display_element);
        console.log("here0");
        let html = `<div id="jspsych-html-audio-response-stimulus">${trial.stimulus}</div>` +
            '<canvas id="meter" width="500" height="50"></canvas>' +
            `<div id="threshold-display">Threshold: ${trial.amplitude_threshold.toFixed(3)}</div>` +
            '<button id="decrease-threshold" class="jspsych-btn">-</button>' +
            '<button id="increase-threshold" class="jspsych-btn">+</button>';
        if (trial.show_done_button) {
            html += `<p><button class="jspsych-btn" id="finish-trial">${trial.done_button_label}</button></p>`;
        }
        display_element.innerHTML = html;
        this.startAmplitudeLogging(trial);
        // Add event listeners for the buttons
        document.getElementById('increase-threshold').addEventListener('click', () => {
            this.stopAmplitudeLogging();
            trial.amplitude_threshold = Math.min(trial.amplitude_threshold + 0.025, 1); // Assuming the threshold max is 1
            document.getElementById('threshold-display').textContent = `Threshold: ${trial.amplitude_threshold.toFixed(3)}`;
            this.startAmplitudeLogging(trial);
        });
        document.getElementById('decrease-threshold').addEventListener('click', () => {
            this.stopAmplitudeLogging();
            trial.amplitude_threshold = Math.max(trial.amplitude_threshold - 0.025, 0); // Assuming the threshold min is 0
            document.getElementById('threshold-display').textContent = `Threshold: ${trial.amplitude_threshold.toFixed(3)}`;
            this.startAmplitudeLogging(trial);
        });
    }
    hideStimulus(display_element) {
        const el = display_element.querySelector("#jspsych-html-audio-response-stimulus");
        if (el) {
            el.style.visibility = "hidden";
        }
        const alertImage = document.getElementById("alert-image");
        if (alertImage) {
            alertImage.style.opacity = "0";
        }
    }
    addButtonEvent(display_element, trial) {
        const btn = display_element.querySelector("#finish-trial");
        if (btn) {
            btn.addEventListener("click", () => {
                const end_time = performance.now();
                this.rt = Math.round(end_time - this.stimulus_start_time);
                this.stopRecording().then(() => {
                    if (trial.allow_playback) {
                        this.showPlaybackControls(display_element, trial);
                    }
                    else {
                        this.endTrial(display_element, trial);
                    }
                });
            });
        }
    }
    setupRecordingEvents(display_element, trial) {
        this.data_available_handler = (e) => {
            if (e.data.size > 0) {
                this.recorded_data_chunks.push(e.data);
            }
        };
        this.stop_event_handler = () => {
            const data = new Blob(this.recorded_data_chunks, { type: "audio/webm" });
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                const base64 = reader.result.split(",")[1];
                this.response = base64;
                this.load_resolver();
            });
            reader.readAsDataURL(data);
        };
        this.start_event_handler = (e) => {
            // resets the recorded data
            this.recorded_data_chunks.length = 0;
            this.recorder_start_time = e.timeStamp;
            this.showDisplay(display_element, trial);
            this.addButtonEvent(display_element, trial);
            // setup timer for hiding the stimulus
            if (trial.stimulus_duration !== null) {
                this.jsPsych.pluginAPI.setTimeout(() => {
                    this.hideStimulus(display_element);
                }, trial.stimulus_duration);
            }
            // setup timer for ending the trial
            if (trial.recording_duration !== null) {
                this.jsPsych.pluginAPI.setTimeout(() => {
                    // this check is necessary for cases where the
                    // done_button is clicked before the timer expires
                    if (this.recorder.state !== "inactive") {
                        this.stopRecording().then(() => {
                            if (trial.allow_playback) {
                                this.showPlaybackControls(display_element, trial);
                            }
                            else {
                                this.endTrial(display_element, trial);
                            }
                        });
                    }
                }, trial.recording_duration);
            }
        };
        this.recorder.addEventListener("dataavailable", this.data_available_handler);
        this.recorder.addEventListener("stop", this.stop_event_handler);
        this.recorder.addEventListener("start", this.start_event_handler);
    }
    drawVolumeMeter(amplitude, threshold) {
        console.log("here4");
        if (!this.canvasContext) {
            this.canvasContext = document.getElementById("meter").getContext("2d");
        }
        const canvas = this.canvasContext.canvas;
        this.canvasContext.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawing
        const scaledAmplitude = amplitude / threshold;
        const width = Math.min(scaledAmplitude, 1) * canvas.width; // Ensure the width does not exceed the canvas width
        this.canvasContext.fillStyle = amplitude > threshold ? 'red' : 'green';
        this.canvasContext.fillRect(0, 0, width, canvas.height); // Draw the volume level as a filled rectangle
    }
    stopAmplitudeLogging() {
        this.isLoggingAmplitude = false;
        if (this.amplitudeLoggingTimeoutId !== null) {
            this.amplitudeLoggingTimeoutId = null;
        }
    }
    startAmplitudeLogging(trial) {
        this.stopAmplitudeLogging(); // Ensure any previous logging is stopped
        this.logAmplitudeUntilThresholdReached(trial, trial.amplitude_threshold)
            .then(message => {
            console.log(message); // Handle message
        })
            .catch(error => {
            console.error(error); // Handle error
        });
    }
    logAmplitudeUntilThresholdReached(trial, threshold) {
        return new Promise((resolve, reject) => {
            console.log("here2");
            const logAmplitude = () => {
                if (!this.isLoggingAmplitude) {
                    resolve('Amplitude logging stopped');
                    return;
                }
                // Get the audio data from the analyzer
                this.analyzer.getByteTimeDomainData(this.dataArray);
                // Calculate the amplitude
                let sum = 0;
                for (let i = 0; i < this.bufferLength; i++) {
                    const value = (this.dataArray[i] - 128) / 128;
                    sum += value * value;
                }
                const amplitude = Math.sqrt(sum / this.bufferLength);
                //console.log(trial.amplitude_threshold);
                this.drawVolumeMeter(amplitude, threshold);
                // If the amplitude exceeds the threshold, resolve the promise
                if (amplitude > threshold) {
                    const endTime = performance.now(); // Store the end time
                    console.log(`Time from start to amplitude log: ${endTime - this.startTime} ms`);
                    //resolve('Amplitude threshold reached');
                    //return;
                }
                // If the timeout has been reached, reject the promise
                if (Date.now() - this.startTime > this.timeout) {
                    reject('Timeout reached');
                    return;
                }
                // Schedule the next log if still logging
                if (this.isLoggingAmplitude) {
                    this.amplitudeLoggingTimeoutId = this.jsPsych.pluginAPI.setTimeout(logAmplitude, 16.67);
                }
            };
            this.isLoggingAmplitude = true;
            logAmplitude();
        });
    }
    startRecording(trial) {
        // Initialize the analyzer
        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(this.recorder.stream);
        this.analyzer = audioContext.createAnalyser();
        source.connect(this.analyzer);
        this.bufferLength = this.analyzer.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);
        this.recorder.start();
        this.startTime = performance.now(); // Store the start time
        // while the experiment is running
        console.log("here");
    }
    stopRecording() {
        this.recorder.stop();
        return new Promise((resolve) => {
            this.load_resolver = resolve;
        });
    }
    showPlaybackControls(display_element, trial) {
        display_element.innerHTML = `
      <button id="record-again" class="jspsych-btn">${trial.record_again_button_label}</button>
      <button id="continue" class="jspsych-btn">${trial.accept_button_label}</button>
    `;
        display_element.querySelector("#record-again").addEventListener("click", () => {
            // release object url to save memory
            this.startRecording(trial);
        });
        display_element.querySelector("#continue").addEventListener("click", () => {
            this.endTrial(display_element, trial);
        });
        // const audio = display_element.querySelector('#playback');
        // audio.src =
    }
    endTrial(display_element, trial) {
        // clear recordering event handler
        this.recorder.removeEventListener("dataavailable", this.data_available_handler);
        this.recorder.removeEventListener("start", this.start_event_handler);
        this.recorder.removeEventListener("stop", this.stop_event_handler);
        // kill any remaining setTimeout handlers
        this.jsPsych.pluginAPI.clearAllTimeouts();
        // gather the data to store for the trial
        var trial_data = {
            rt: this.rt,
            stimulus: trial.stimulus,
            response: this.response,
            estimated_stimulus_onset: Math.round(this.stimulus_start_time - this.recorder_start_time),
        };
        // clear the display
        display_element.innerHTML = "";
        // move on to the next trial
        this.jsPsych.finishTrial(trial_data);
    }
}
HtmlAudioResponsePlugin.info = info;

module.exports = HtmlAudioResponsePlugin;
//# sourceMappingURL=index.cjs.map
