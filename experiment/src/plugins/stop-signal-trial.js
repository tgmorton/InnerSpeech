/**
 * Stop-Signal Trial Plugin for jsPsych
 *
 * This plugin displays a picture with optional word overlay for stop-signal paradigm.
 * Features:
 * - Picture displayed immediately
 * - Word appears at SOA (stimulus onset asynchrony) for signal trials
 * - Word replaced by mask after word_duration
 * - RT measured from picture onset
 * - Response via spacebar
 */

const info = {
  name: "stop-signal-trial",
  parameters: {
    image: {
      type: "STRING",
      default: undefined,
      description: "Path to the picture image"
    },
    trial_type: {
      type: "STRING",
      default: "go",
      description: "Type of trial: 'go', 'go_signal', or 'stop_signal'"
    },
    signal_word: {
      type: "STRING",
      default: null,
      description: "Word to display for signal trials (null for go trials)"
    },
    signal_condition: {
      type: "STRING",
      default: null,
      description: "Condition category for stop-signal trials"
    },
    soa: {
      type: "INT",
      default: 200,
      description: "Stimulus onset asynchrony - time before word appears (ms)"
    },
    word_duration: {
      type: "INT",
      default: 200,
      description: "Duration word is displayed before mask (ms)"
    },
    mask: {
      type: "STRING",
      default: "XXXXXXX",
      description: "Mask string to replace word"
    },
    trial_duration: {
      type: "INT",
      default: 2000,
      description: "Maximum trial duration from picture onset (ms)"
    },
    response_key: {
      type: "STRING",
      default: " ",
      description: "Key to register response (spacebar by default)"
    },
    picture_name: {
      type: "STRING",
      default: null,
      description: "Name of the picture for data recording"
    },
    block: {
      type: "INT",
      default: null,
      description: "Block number for data recording"
    },
    phase: {
      type: "STRING",
      default: "experimental",
      description: "Phase of experiment (practice or experimental)"
    }
  }
};

class StopSignalTrialPlugin {
  constructor(jsPsych) {
    this.jsPsych = jsPsych;
  }

  trial(display_element, trial) {
    // Build HTML structure
    let html = `
      <div class="stop-signal-trial">
        <div class="picture-container">
          <img src="${trial.image}" class="trial-picture" id="trial-picture">
          <div class="word-overlay" id="word-overlay"></div>
        </div>
      </div>
    `;

    display_element.innerHTML = html;

    // Get elements
    const wordOverlay = document.getElementById("word-overlay");

    // Trial state
    let response = {
      rt: null,
      responded: false,
      key_pressed: null
    };

    let trialEnded = false;
    const startTime = performance.now();
    const trialStartTimestamp = new Date().toISOString();
    let wordOnsetTime = null;
    let maskOnsetTime = null;
    let soaTimeout = null;
    let maskTimeout = null;
    let endTimeout = null;

    // Handle response
    const handleKeypress = (e) => {
      // Ignore if trial already ended or wrong key
      if (trialEnded || e.key !== trial.response_key) {
        return;
      }

      if (!response.responded) {
        response.rt = Math.round(performance.now() - startTime);
        response.responded = true;
        response.key_pressed = e.key;
        endTrial();
      }
    };

    // Add keyboard listener
    document.addEventListener("keydown", handleKeypress);

    // Schedule word display for signal trials
    if (trial.trial_type === "go_signal" || trial.trial_type === "stop_signal") {
      soaTimeout = this.jsPsych.pluginAPI.setTimeout(() => {
        if (trialEnded) return;
        wordOnsetTime = Math.round(performance.now() - startTime);
        wordOverlay.textContent = trial.signal_word;
        wordOverlay.classList.add("visible");

        // Schedule mask after word duration
        maskTimeout = this.jsPsych.pluginAPI.setTimeout(() => {
          if (trialEnded) return;
          maskOnsetTime = Math.round(performance.now() - startTime);
          wordOverlay.textContent = trial.mask;
        }, trial.word_duration);
      }, trial.soa);
    }

    // Schedule trial end
    endTimeout = this.jsPsych.pluginAPI.setTimeout(() => {
      endTrial();
    }, trial.trial_duration);

    // End trial function
    const endTrial = () => {
      // Prevent multiple calls
      if (trialEnded) return;
      trialEnded = true;

      // Clear all timeouts
      if (soaTimeout) this.jsPsych.pluginAPI.clearAllTimeouts();

      // Remove keyboard listener
      document.removeEventListener("keydown", handleKeypress);

      // Calculate actual trial duration
      const trialEndTime = Math.round(performance.now() - startTime);

      // Collect data
      const trialData = {
        picture: trial.picture_name,
        stimulus_type: trial.trial_type,
        signal_word: trial.signal_word,
        signal_condition: trial.signal_condition,
        rt: response.rt,
        responded: response.responded,
        key_pressed: response.key_pressed,
        block: trial.block,
        phase: trial.phase,
        // Timing data
        trial_start_timestamp: trialStartTimestamp,
        target_soa: trial.soa,
        target_word_duration: trial.word_duration,
        actual_word_onset: wordOnsetTime,
        actual_mask_onset: maskOnsetTime,
        actual_word_duration: (maskOnsetTime && wordOnsetTime) ? maskOnsetTime - wordOnsetTime : null,
        actual_trial_duration: trialEndTime,
        max_trial_duration: trial.trial_duration
      };

      // Clear display
      display_element.innerHTML = "";

      // End trial
      this.jsPsych.finishTrial(trialData);
    };
  }
}

StopSignalTrialPlugin.info = info;

export default StopSignalTrialPlugin;
