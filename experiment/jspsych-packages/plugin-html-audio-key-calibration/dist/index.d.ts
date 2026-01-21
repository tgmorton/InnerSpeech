import { JsPsych, JsPsychPlugin, ParameterType, TrialType } from "jspsych";
declare const info: {
    readonly name: "html-audio-response";
    readonly parameters: {
        /** The HTML string to be displayed */
        readonly stimulus: {
            readonly type: ParameterType.HTML_STRING;
            readonly default: any;
        };
        /** How long to show the stimulus. */
        readonly stimulus_duration: {
            readonly type: ParameterType.INT;
            readonly default: any;
        };
        /** How long to show the trial. */
        readonly recording_duration: {
            readonly type: ParameterType.INT;
            readonly default: any;
        };
        /** Whether or not to show a button to end the recording. If false, the recording_duration must be set. */
        readonly show_done_button: {
            readonly type: ParameterType.BOOL;
            readonly default: true;
        };
        /** Label for the done (stop recording) button. Only used if show_done_button is true. */
        readonly done_button_label: {
            readonly type: ParameterType.STRING;
            readonly default: "Continue";
        };
        /** Label for the record again button (only used if allow_playback is true). */
        readonly record_again_button_label: {
            readonly type: ParameterType.STRING;
            readonly default: "Record again";
        };
        /** Label for the button to accept the audio recording (only used if allow_playback is true). */
        readonly accept_button_label: {
            readonly type: ParameterType.STRING;
            readonly default: "Continue";
        };
        /** Whether or not to allow the participant to playback the recording and either accept or re-record. */
        readonly allow_playback: {
            readonly type: ParameterType.BOOL;
            readonly default: false;
        };
        /** Whether or not to save the video URL to the trial data. */
        readonly save_audio_url: {
            readonly type: ParameterType.BOOL;
            readonly default: false;
        };
        /** Whether or not to use the voice-key functionality. */
        readonly use_voice_key: {
            readonly type: ParameterType.BOOL;
            readonly default: true;
        };
        /** The amplitude threshold for the voice-key. */
        readonly amplitude_threshold: {
            readonly type: ParameterType.FLOAT;
            readonly default: 0.1;
        };
        /** The duration of the timer that starts when the amplitude threshold is surpassed. */
        readonly timer_duration: {
            readonly type: ParameterType.INT;
            readonly default: 350;
        };
    };
};
declare type Info = typeof info;
/**
 * html-audio-response
 * jsPsych plugin for displaying a stimulus and recording an audio response through a microphone
 * @author Josh de Leeuw
 * @see {@link https://www.jspsych.org/plugins/jspsych-html-audio-response/ html-audio-response plugin documentation on jspsych.org}
 */
declare class HtmlAudioResponsePlugin implements JsPsychPlugin<Info> {
    private jsPsych;
    static info: {
        readonly name: "html-audio-response";
        readonly parameters: {
            /** The HTML string to be displayed */
            readonly stimulus: {
                readonly type: ParameterType.HTML_STRING;
                readonly default: any;
            };
            /** How long to show the stimulus. */
            readonly stimulus_duration: {
                readonly type: ParameterType.INT;
                readonly default: any;
            };
            /** How long to show the trial. */
            readonly recording_duration: {
                readonly type: ParameterType.INT;
                readonly default: any;
            };
            /** Whether or not to show a button to end the recording. If false, the recording_duration must be set. */
            readonly show_done_button: {
                readonly type: ParameterType.BOOL;
                readonly default: true;
            };
            /** Label for the done (stop recording) button. Only used if show_done_button is true. */
            readonly done_button_label: {
                readonly type: ParameterType.STRING;
                readonly default: "Continue";
            };
            /** Label for the record again button (only used if allow_playback is true). */
            readonly record_again_button_label: {
                readonly type: ParameterType.STRING;
                readonly default: "Record again";
            };
            /** Label for the button to accept the audio recording (only used if allow_playback is true). */
            readonly accept_button_label: {
                readonly type: ParameterType.STRING;
                readonly default: "Continue";
            };
            /** Whether or not to allow the participant to playback the recording and either accept or re-record. */
            readonly allow_playback: {
                readonly type: ParameterType.BOOL;
                readonly default: false;
            };
            /** Whether or not to save the video URL to the trial data. */
            readonly save_audio_url: {
                readonly type: ParameterType.BOOL;
                readonly default: false;
            };
            /** Whether or not to use the voice-key functionality. */
            readonly use_voice_key: {
                readonly type: ParameterType.BOOL;
                readonly default: true;
            };
            /** The amplitude threshold for the voice-key. */
            readonly amplitude_threshold: {
                readonly type: ParameterType.FLOAT;
                readonly default: 0.1;
            };
            /** The duration of the timer that starts when the amplitude threshold is surpassed. */
            readonly timer_duration: {
                readonly type: ParameterType.INT;
                readonly default: 350;
            };
        };
    };
    private stimulus_start_time;
    private recorder_start_time;
    private recorder;
    private response;
    private load_resolver;
    private rt;
    private start_event_handler;
    private stop_event_handler;
    private data_available_handler;
    private recorded_data_chunks;
    private analyzer;
    private dataArray;
    private bufferLength;
    private amplitudeThreshold;
    private startTime;
    private timeout;
    private meter;
    private canvasContext;
    private isLoggingAmplitude;
    private amplitudeLoggingTimeoutId;
    constructor(jsPsych: JsPsych);
    trial(display_element: HTMLElement, trial: TrialType<Info>): void;
    private showDisplay;
    private hideStimulus;
    private addButtonEvent;
    private setupRecordingEvents;
    private drawVolumeMeter;
    private stopAmplitudeLogging;
    private startAmplitudeLogging;
    private logAmplitudeUntilThresholdReached;
    private startRecording;
    private stopRecording;
    private showPlaybackControls;
    private endTrial;
}
export default HtmlAudioResponsePlugin;
