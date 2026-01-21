/**
 * @title Inner Speech Stop-Signal Experiment
 * @description Investigating inner speech in error monitoring using a stop-signal paradigm
 * @version 1.0.0
 *
 * Based on Slevc & Ferreira (2006) Experiment 5, adapted for inner speech.
 *
 * @assets assets/
 */

import "../styles/main.scss";

import HtmlButtonResponsePlugin from "@jspsych/plugin-html-button-response";
import HtmlKeyboardResponsePlugin from "@jspsych/plugin-html-keyboard-response";
import ImageKeyboardResponsePlugin from "@jspsych/plugin-image-keyboard-response";
import PreloadPlugin from "@jspsych/plugin-preload";
import { initJsPsych } from "jspsych";

import StopSignalTrialPlugin from "./plugins/stop-signal-trial.js";
import { getAllImagePaths } from "./stimuli/word-lists.js";
import {
  generateFamiliarizationTrials,
  generatePracticeNamingTrials,
  generatePracticeTrials,
  generateAllExperimentalTrials
} from "./stimuli/trial-generator.js";

/**
 * Main experiment function
 */
export async function run({ assetPaths, input = {}, environment, title, version }) {
  // Initialize jsPsych
  const jsPsych = initJsPsych({
    default_iti: 50,
    on_finish: function() {
      const participantId = jsPsych.data.get().values()[0]?.participant_id || "unknown";
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `innerspeech_${participantId}_${timestamp}.csv`;

      const data = jsPsych.data.get().filter({ task: "stop_signal_trial" });
      data.localSave("csv", filename);
    }
  });

  // Generate participant ID
  const participantId = jsPsych.randomization.randomID(8);

  jsPsych.data.addProperties({
    participant_id: participantId
  });

  const timeline = [];

  // ========================================
  // PHASE 1: Preload Assets
  // ========================================
  timeline.push({
    type: PreloadPlugin,
    images: getAllImagePaths(),
    show_progress_bar: true,
    message: "Loading experiment resources..."
  });

  // ========================================
  // PHASE 2: Consent Form
  // ========================================
  timeline.push({
    type: HtmlButtonResponsePlugin,
    stimulus: `
      <div class="consent-form">
        <h2>Research Consent</h2>
        <p>Victor Ferreira, who is a Professor at UC San Diego, is conducting a research study to find out more about how people produce language.</p>
        <p>If you agree to be in this study, you will produce language (i.e., talk) and respond to stimuli (i.e., press buttons) when shown written or spoken words, sentences, or pictures. One study session could include multiple different specific tasks.</p>
        <p>If you agree, your auditory responses may be recorded. The recordings are kept completely confidential, in that your voice is the only identifying information stored with your specific recording. Recordings will only be listened to by authorized study personnel to transcribe and code your responses. At any point in the experiment, you may request that the audio recording be stopped. You may also request that the recording with your voice be erased immediately, or after transcription.</p>
        <p>Research records will be kept confidential to the extent allowed by law. Information from study participants will be identified by a subject number. We will also collect your name, to ensure that you do not participate in more than one specific experiment in this study. We will also ask you to voluntarily provide your gender, ethnicity, and race information. Your name and race/ethnicity/gender information will be kept completely separate from your study responses, and it is impossible for anyone (including the researchers) to link your name and gender/ethnicity/race to one another or to your responses.</p>
        <p>Participation in research is entirely voluntary. You may refuse to participate or withdraw at any time without penalty or loss of benefits to which you are entitled.</p>
        <p>If you want additional information or have questions or research-related problems, you may reach Victor Ferreira at 858-534-6303 or vferreira@ucsd.edu.</p>
      </div>
    `,
    choices: ["I Consent"]
  });

  // ========================================
  // PHASE 3: Welcome Screen
  // ========================================
  timeline.push({
    type: HtmlKeyboardResponsePlugin,
    stimulus: `
      <div class="welcome-screen">
        <h1>Inner Speech Study</h1>
        <p>Thank you for participating in this experiment.</p>
        <p>In this study, you will name pictures <strong>silently in your head</strong>.</p>
        <p class="continue-prompt">Press SPACEBAR to continue</p>
      </div>
    `,
    choices: [" "]
  });

  // ========================================
  // PHASE 4: Familiarization Instructions
  // ========================================
  timeline.push({
    type: HtmlKeyboardResponsePlugin,
    stimulus: `
      <div class="instruction-screen">
        <h2>Picture Familiarization</h2>
        <p>First, you will see each picture with its name below it.</p>
        <p>Please learn these names carefully, as you will use them throughout the experiment.</p>
        <div class="instruction-box">
          <p>Take your time to memorize each picture and its name.</p>
          <p>Press <strong>SPACEBAR</strong> to advance through each picture at your own pace.</p>
        </div>
        <p class="continue-prompt">Press SPACEBAR to begin</p>
      </div>
    `,
    choices: [" "]
  });

  // ========================================
  // PHASE 4b: Familiarization Trials (Self-paced with spacebar)
  // ========================================
  const familiarizationTrials = generateFamiliarizationTrials();
  for (const trial of familiarizationTrials) {
    timeline.push({
      type: HtmlKeyboardResponsePlugin,
      stimulus: `
        <div class="familiarization-trial">
          <img src="${trial.image}" class="familiarization-image">
          <p class="picture-label">${trial.label}</p>
          <p class="continue-prompt">Press SPACEBAR for next picture</p>
        </div>
      `,
      choices: [" "]
    });
  }

  // ========================================
  // PHASE 5: Transition to Practice Naming
  // ========================================
  timeline.push({
    type: HtmlKeyboardResponsePlugin,
    stimulus: `
      <div class="instruction-screen">
        <h2>Practice Naming</h2>
        <p>Now you will practice naming the pictures.</p>
        <p class="continue-prompt">Press SPACEBAR to continue</p>
      </div>
    `,
    choices: [" "]
  });

  timeline.push({
    type: HtmlKeyboardResponsePlugin,
    stimulus: `
      <div class="instruction-screen">
        <h2>Practice Naming</h2>
        <p>When you see a picture, say the name <strong>silently in your head</strong>.</p>
        <p>Press <strong>SPACEBAR</strong> as soon as you begin saying the name internally.</p>
        <div class="important-box">
          <p><strong>Important:</strong> Do not move your mouth or tongue. All naming should be completely silent and internal.</p>
        </div>
        <p class="continue-prompt">Press SPACEBAR to continue</p>
      </div>
    `,
    choices: [" "]
  });

  timeline.push({
    type: HtmlKeyboardResponsePlugin,
    stimulus: `
      <div class="instruction-screen">
        <h2>Practice Naming</h2>
        <p>After each picture, you will see the correct name and be asked if you said the correct word in your mind.</p>
        <p class="continue-prompt">Press SPACEBAR to begin</p>
      </div>
    `,
    choices: [" "]
  });

  // ========================================
  // PHASE 5b: Practice Naming Trials with Feedback
  // ========================================
  const practiceNamingTrials = generatePracticeNamingTrials();
  let practiceNamingIndex = 0;

  for (const trial of practiceNamingTrials) {
    practiceNamingIndex++;

    // Trial number
    timeline.push({
      type: HtmlKeyboardResponsePlugin,
      stimulus: `<div class="trial-number">Trial ${practiceNamingIndex} of ${practiceNamingTrials.length}</div>`,
      choices: "NO_KEYS",
      trial_duration: 500
    });

    // Fixation
    timeline.push({
      type: HtmlKeyboardResponsePlugin,
      stimulus: '<div class="fixation">+</div>',
      choices: "NO_KEYS",
      trial_duration: 500
    });

    // Picture naming (spacebar response)
    timeline.push({
      type: ImageKeyboardResponsePlugin,
      stimulus: trial.image,
      choices: [" "],
      stimulus_height: 300,
      stimulus_width: 300,
      trial_duration: 2000,
      response_ends_trial: true,
      data: {
        task: "practice_naming",
        picture: trial.picture_name
      }
    });

    // Feedback: Show correct answer and ask y/n
    timeline.push({
      type: HtmlKeyboardResponsePlugin,
      stimulus: `
        <div class="practice-feedback">
          <p class="correct-answer">The correct name is: <span>${trial.picture_name.toUpperCase()}</span></p>
          <p class="feedback-question">Did you say the correct word in your mind?</p>
          <p class="feedback-keys">
            Press <span class="key">Y</span> for Yes or <span class="key">N</span> for No
          </p>
        </div>
      `,
      choices: ["y", "n"],
      data: {
        task: "practice_naming_feedback",
        picture: trial.picture_name
      }
    });
  }

  // ========================================
  // PHASE 6: Transition to Main Task
  // ========================================
  timeline.push({
    type: HtmlKeyboardResponsePlugin,
    stimulus: `
      <div class="instruction-screen">
        <h2>Main Task</h2>
        <p>Now you will begin the main task.</p>
        <p>Please read the following instructions carefully.</p>
        <p class="continue-prompt">Press SPACEBAR to continue</p>
      </div>
    `,
    choices: [" "]
  });

  // ========================================
  // PHASE 6b: Main Task Instructions
  // ========================================
  timeline.push({
    type: HtmlKeyboardResponsePlugin,
    stimulus: `
      <div class="instruction-screen">
        <h2>Instructions</h2>
        <p>Your main task is to name the pictures as soon as you can <strong>silently in your head</strong>. Press SPACEBAR as soon as you begin naming internally.</p>
        <p>However, you will occasionally need to try to stop your naming response and do nothing.</p>
        <div class="important-box">
          <p><strong>Important:</strong> Do not move your mouth or tongue during the task. All naming should be completely silent and internal.</p>
        </div>
        <p class="continue-prompt">Press SPACEBAR to continue</p>
      </div>
    `,
    choices: [" "]
  });

  timeline.push({
    type: HtmlKeyboardResponsePlugin,
    stimulus: `
      <div class="instruction-screen">
        <h2>Instructions</h2>
        <p>On some trials, you will see a picture and will <strong>NOT</strong> see any word. In this case, simply name the picture silently and press SPACEBAR.</p>
        <p class="continue-prompt">Press SPACEBAR to continue</p>
      </div>
    `,
    choices: [" "]
  });

  timeline.push({
    type: HtmlKeyboardResponsePlugin,
    stimulus: `
      <div class="instruction-screen">
        <h2>Instructions</h2>
        <p>On other trials, the <strong>name of the picture</strong> will appear shortly after the picture appears. In this case, you should also name the picture silently and press SPACEBAR.</p>
        <p class="continue-prompt">Press SPACEBAR to continue</p>
      </div>
    `,
    choices: [" "]
  });

  timeline.push({
    type: HtmlKeyboardResponsePlugin,
    stimulus: `
      <div class="instruction-screen">
        <h2>Instructions</h2>
        <p>On the remaining trials, you will see the picture and then see a word that is <strong>NOT</strong> the picture name. In this case, you should try to stop your naming response and do nothing.</p>
        <p class="continue-prompt">Press SPACEBAR to continue</p>
      </div>
    `,
    choices: [" "]
  });

  timeline.push({
    type: HtmlKeyboardResponsePlugin,
    stimulus: `
      <div class="instruction-screen">
        <h2>Important</h2>
        <div class="important-box">
          <p><strong>It is very important to name the pictures quickly, and NOT wait to see if a word appears before starting to name the picture.</strong></p>
        </div>
        <p>Remember: Name pictures silently in your head. Do not move your mouth or tongue.</p>
        <p class="continue-prompt">Press SPACEBAR to continue</p>
      </div>
    `,
    choices: [" "]
  });

  // ========================================
  // PHASE 6c: Transition to Practice
  // ========================================
  timeline.push({
    type: HtmlKeyboardResponsePlugin,
    stimulus: `
      <div class="instruction-screen">
        <h2>Practice Trials</h2>
        <p>You will now complete some practice trials to get familiar with the task.</p>
        <p class="continue-prompt">Press SPACEBAR to begin practice</p>
      </div>
    `,
    choices: [" "]
  });

  // ========================================
  // PHASE 7: Practice Stop-Signal Trials
  // ========================================
  const practiceTrials = generatePracticeTrials();
  let practiceIndex = 0;

  for (const trial of practiceTrials) {
    practiceIndex++;

    // Trial number
    timeline.push({
      type: HtmlKeyboardResponsePlugin,
      stimulus: `<div class="trial-number">Practice ${practiceIndex} of ${practiceTrials.length}</div>`,
      choices: "NO_KEYS",
      trial_duration: 500
    });

    // Fixation
    timeline.push({
      type: HtmlKeyboardResponsePlugin,
      stimulus: '<div class="fixation">+</div>',
      choices: "NO_KEYS",
      trial_duration: 500
    });

    // Stop-signal trial
    timeline.push({
      type: StopSignalTrialPlugin,
      image: trial.image,
      trial_type: trial.trial_type,
      signal_word: trial.signal_word,
      signal_condition: trial.signal_condition,
      picture_name: trial.picture_name,
      block: null,
      phase: "practice",
      data: {
        task: "stop_signal_trial"
      }
    });
  }

  // Practice complete - transition to experimental blocks
  timeline.push({
    type: HtmlKeyboardResponsePlugin,
    stimulus: `
      <div class="instruction-screen">
        <h2>Practice Complete</h2>
        <p>You have completed the practice trials.</p>
        <p class="continue-prompt">Press SPACEBAR to continue</p>
      </div>
    `,
    choices: [" "]
  });

  // Repeat instructions before main experiment
  timeline.push({
    type: HtmlKeyboardResponsePlugin,
    stimulus: `
      <div class="instruction-screen">
        <h2>Main Experiment</h2>
        <p>Before we begin, let's review the instructions.</p>
        <p class="continue-prompt">Press SPACEBAR to continue</p>
      </div>
    `,
    choices: [" "]
  });

  timeline.push({
    type: HtmlKeyboardResponsePlugin,
    stimulus: `
      <div class="instruction-screen">
        <h2>Instructions Review</h2>
        <p>Your main task is to name the pictures as soon as you can <strong>silently in your head</strong>. Press SPACEBAR as soon as you begin naming internally.</p>
        <p>However, you will occasionally need to try to stop your naming response and do nothing.</p>
        <p class="continue-prompt">Press SPACEBAR to continue</p>
      </div>
    `,
    choices: [" "]
  });

  timeline.push({
    type: HtmlKeyboardResponsePlugin,
    stimulus: `
      <div class="instruction-screen">
        <h2>Instructions Review</h2>
        <p>On some trials, you will see a picture and will <strong>NOT</strong> see any word. In this case, simply name the picture silently and press SPACEBAR.</p>
        <p>On other trials, the <strong>name of the picture</strong> will appear shortly after the picture appears. In this case, you should also name the picture silently and press SPACEBAR.</p>
        <p class="continue-prompt">Press SPACEBAR to continue</p>
      </div>
    `,
    choices: [" "]
  });

  timeline.push({
    type: HtmlKeyboardResponsePlugin,
    stimulus: `
      <div class="instruction-screen">
        <h2>Instructions Review</h2>
        <p>On the remaining trials, you will see the picture and then see a word that is <strong>NOT</strong> the picture name. In this case, you should try to stop your naming response and do nothing.</p>
        <p class="continue-prompt">Press SPACEBAR to continue</p>
      </div>
    `,
    choices: [" "]
  });

  timeline.push({
    type: HtmlKeyboardResponsePlugin,
    stimulus: `
      <div class="instruction-screen">
        <h2>Important Reminders</h2>
        <div class="important-box">
          <p><strong>It is very important to name the pictures quickly, and NOT wait to see if a word appears before starting to name the picture.</strong></p>
        </div>
        <div class="important-box">
          <p><strong>Do not move your mouth or tongue during the task. All naming should be completely silent and internal.</strong></p>
        </div>
        <p class="continue-prompt">Press SPACEBAR to continue</p>
      </div>
    `,
    choices: [" "]
  });

  timeline.push({
    type: HtmlKeyboardResponsePlugin,
    stimulus: `
      <div class="instruction-screen">
        <h2>Main Experiment</h2>
        <p>The experiment consists of <strong>3 blocks</strong> with short breaks in between.</p>
        <p class="continue-prompt">Press SPACEBAR to begin</p>
      </div>
    `,
    choices: [" "]
  });

  // ========================================
  // PHASES 8-12: Experimental Blocks
  // ========================================
  const experimentalTrials = generateAllExperimentalTrials();
  const blocks = [experimentalTrials.block1, experimentalTrials.block2, experimentalTrials.block3];

  for (let blockNum = 0; blockNum < 3; blockNum++) {
    const block = blocks[blockNum];
    let trialIndex = 0;

    // Block start
    timeline.push({
      type: HtmlKeyboardResponsePlugin,
      stimulus: `
        <div class="instruction-screen">
          <h2>Block ${blockNum + 1} of 3</h2>
          <p>This block contains ${block.length} trials.</p>
          <p>Remember: Name pictures quickly, press SPACEBAR when naming, but STOP if a non-matching word appears.</p>
          <p class="continue-prompt">Press SPACEBAR when you are ready to begin</p>
        </div>
      `,
      choices: [" "]
    });

    // Block trials
    for (const trial of block) {
      trialIndex++;

      // Trial number
      timeline.push({
        type: HtmlKeyboardResponsePlugin,
        stimulus: `<div class="trial-number">Block ${blockNum + 1} - Trial ${trialIndex} of ${block.length}</div>`,
        choices: "NO_KEYS",
        trial_duration: 500
      });

      // Fixation
      timeline.push({
        type: HtmlKeyboardResponsePlugin,
        stimulus: '<div class="fixation">+</div>',
        choices: "NO_KEYS",
        trial_duration: 500
      });

      // Stop-signal trial
      timeline.push({
        type: StopSignalTrialPlugin,
        image: trial.image,
        trial_type: trial.trial_type,
        signal_word: trial.signal_word,
        signal_condition: trial.signal_condition,
        picture_name: trial.picture_name,
        block: trial.block,
        phase: trial.phase,
        data: {
          task: "stop_signal_trial"
        }
      });
    }

    // Break between blocks
    if (blockNum < 2) {
      timeline.push({
        type: HtmlKeyboardResponsePlugin,
        stimulus: `
          <div class="break-screen">
            <h2>Break</h2>
            <p>You have completed Block ${blockNum + 1} of 3.</p>
            <p>Take a moment to rest if you need to.</p>
            <p class="continue-prompt">Press SPACEBAR when you are ready to continue</p>
          </div>
        `,
        choices: [" "]
      });
    }
  }

  // ========================================
  // PHASE 13: Debriefing
  // ========================================
  timeline.push({
    type: HtmlKeyboardResponsePlugin,
    stimulus: `
      <div class="debrief-screen">
        <h2>Experiment Complete</h2>
        <p>Thank you for participating!</p>
        <p>Your data has been saved.</p>
        <p>Participant ID: <span class="participant-id">${participantId}</span></p>
        <p class="continue-prompt">Press SPACEBAR to exit</p>
      </div>
    `,
    choices: [" "]
  });

  await jsPsych.run(timeline);

  return jsPsych;
}
