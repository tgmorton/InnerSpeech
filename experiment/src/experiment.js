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
import InstructionsPlugin from "@jspsych/plugin-instructions";
import PreloadPlugin from "@jspsych/plugin-preload";
import SurveyLikertPlugin from "@jspsych/plugin-survey-likert";
import SurveyTextPlugin from "@jspsych/plugin-survey-text";
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
      if (environment === "jatos") {
        // In JATOS: data submission is handled automatically by jspsych-builder
        // after the run() function returns. No local save needed.
        return;
      }

      // Local development: save CSV files to disk
      const participantId = jsPsych.data.get().values()[0]?.participant_id || "unknown";
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

      // Save stop-signal trial data
      const trialFilename = `innerspeech_${participantId}_${timestamp}.csv`;
      const trialData = jsPsych.data.get().filter({ task: "stop_signal_trial" });
      trialData.localSave("csv", trialFilename);

      // Save IRQ questionnaire data
      const irqFilename = `innerspeech_irq_${participantId}_${timestamp}.csv`;
      const irqData = jsPsych.data.get().filter({ task: "irq" });
      irqData.localSave("csv", irqFilename);
    }
  });

  // Generate participant ID
  const participantId = jsPsych.randomization.randomID(8);

  // Record experiment start time
  const experimentStartTime = new Date().toISOString();

  jsPsych.data.addProperties({
    participant_id: participantId,
    experiment_start_time: experimentStartTime
  });

  const timeline = [];

  // Calculate total trial counts for progress display
  const PRACTICE_TRIAL_COUNT = 72;
  const TRIALS_PER_BLOCK = 144;
  const TOTAL_EXPERIMENTAL_TRIALS = TRIALS_PER_BLOCK * 3; // 432

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
        <p>In this study, you will see pictures of common objects and your task is to name them <strong>silently in your head</strong>, pressing the SPACEBAR as soon as you recall the name of the object.</p>
        <p>On some trials, a written word will appear over the picture. Depending on the word, you may need to stop your response. You will receive detailed instructions shortly.</p>
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
        <p>Press <strong>SPACEBAR</strong> as soon as you recall the name of the object.</p>
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
        <p>After each picture, you will see the correct name and be asked if you recalled the correct name of the object.</p>
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
    const currentNamingIndex = practiceNamingIndex; // Capture for closure

    // Trial number (shown once before the loop)
    timeline.push({
      type: HtmlKeyboardResponsePlugin,
      stimulus: `<div class="trial-number">Trial ${currentNamingIndex} of ${practiceNamingTrials.length}</div>`,
      choices: "NO_KEYS",
      trial_duration: 500
    });

    // Looping trial: fixation -> picture -> feedback, repeats if participant presses "N"
    timeline.push({
      timeline: [
        // Fixation
        {
          type: HtmlKeyboardResponsePlugin,
          stimulus: '<div class="fixation">+</div>',
          choices: "NO_KEYS",
          trial_duration: 500
        },
        // Picture naming (spacebar response)
        {
          type: ImageKeyboardResponsePlugin,
          stimulus: trial.image,
          choices: [" "],
          stimulus_height: 300,
          trial_duration: 2000,
          response_ends_trial: true,
          post_trial_gap: 100,
          data: {
            task: "practice_naming",
            picture: trial.picture_name,
            practice_naming_index: currentNamingIndex
          }
        },
        // Feedback: Show correct answer and ask y/n
        {
          type: HtmlKeyboardResponsePlugin,
          stimulus: `
            <div class="practice-feedback">
              <p class="correct-answer">The correct name is: <span>${trial.picture_name.toUpperCase()}</span></p>
              <p class="feedback-question">Did you recall the correct name of the object?</p>
              <p class="feedback-keys">Press <strong>Y</strong> for Yes or <strong>N</strong> for No</p>
            </div>
          `,
          choices: ["y", "n"],
          post_trial_gap: 100,
          data: {
            task: "practice_naming_feedback",
            picture: trial.picture_name,
            practice_naming_index: currentNamingIndex
          }
        }
      ],
      loop_function: function(data) {
        // Repeat if participant pressed "n" (didn't recall correct name)
        const lastTrial = data.values().pop();
        return lastTrial.response === "n";
      }
    });
  }

  // ========================================
  // PHASE 6: Main Task Instructions (multi-page with navigation)
  // ========================================
  timeline.push({
    type: InstructionsPlugin,
    pages: [
      // Page 1: Overview
      `<div class="instruction-screen instructions-detailed">
        <h2>Main Task</h2>
        <p>Now you will begin the main task. Please read the following instructions carefully.</p>
        <p>Your main task is to name the pictures as soon as you can <strong>silently in your head</strong>. Press SPACEBAR as soon as you recall the name of the object.</p>
        <div class="important-box">
          <p><strong>Important:</strong> Do not move your mouth or tongue during the task. All naming should be completely silent and internal.</p>
        </div>
      </div>`,

      // Page 2: Word overlay explanation
      `<div class="instruction-screen instructions-detailed">
        <h2>Instructions</h2>
        <p>On some trials, a <strong>word in red</strong> will briefly appear over the picture, and then be replaced by a mask (XXXXXXX).</p>
        <p>You should use this word to decide whether to <strong>continue naming</strong> or <strong>stop</strong>.</p>
      </div>`,

      // Page 3: Go trial (no word)
      `<div class="instruction-screen instructions-detailed">
        <h2>Trial Type 1: No Word</h2>
        <p>On some trials, <strong>no word</strong> will appear. In this case, simply name the picture silently and press SPACEBAR.</p>
        <div class="instruction-example">
          <div class="example-picture-container">
            <img src="assets/images/apple.png" class="example-image">
          </div>
        </div>
      </div>`,

      // Page 4: Go-signal trial (matching word)
      `<div class="instruction-screen instructions-detailed">
        <h2>Trial Type 2: Matching Word</h2>
        <p>On other trials, the <strong>name of the picture</strong> will appear in red. In this case, you should also name the picture silently and press SPACEBAR.</p>
        <div class="instruction-example">
          <div class="example-picture-container">
            <img src="assets/images/apple.png" class="example-image">
            <div class="example-word-overlay">APPLE</div>
          </div>
        </div>
      </div>`,

      // Page 5: Stop-signal trial (non-matching word)
      `<div class="instruction-screen instructions-detailed">
        <h2>Trial Type 3: Non-Matching Word</h2>
        <p>On the remaining trials, a word that is <strong>NOT the picture name</strong> will appear in red. In this case, you should try to stop your naming response and <strong>do nothing</strong> (do not press SPACEBAR).</p>
        <div class="instruction-example">
          <div class="example-picture-container">
            <img src="assets/images/apple.png" class="example-image">
            <div class="example-word-overlay">HOUSE</div>
          </div>
        </div>
      </div>`,

      // Page 6: Important reminders
      `<div class="instruction-screen instructions-detailed">
        <h2>Important</h2>
        <div class="important-box">
          <p><strong>It is very important to name the pictures quickly, and NOT wait to see if a word appears before starting to name the picture.</strong></p>
        </div>
        <p>Remember: Name pictures silently in your head. Do not move your mouth or tongue.</p>
      </div>`
    ],
    show_clickable_nav: true,
    button_label_previous: "Back",
    button_label_next: "Next"
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
    const currentPracticeIndex = practiceIndex; // Capture for closure

    // Trial number
    timeline.push({
      type: HtmlKeyboardResponsePlugin,
      stimulus: `<div class="trial-number">Practice ${currentPracticeIndex} of ${practiceTrials.length}</div>`,
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

    // Stop-signal trial with enhanced data
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
        task: "stop_signal_trial",
        practice_trial_index: currentPracticeIndex,
        soa: 200,
        word_duration: 200,
        max_trial_duration: 2000
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
    type: InstructionsPlugin,
    pages: [
      `<div class="instruction-screen instructions-detailed">
        <h2>Instructions Review</h2>
        <p>Before we begin the main experiment, let's review the instructions.</p>
        <p>Your main task is to name the pictures as soon as you can <strong>silently in your head</strong>. Press SPACEBAR as soon as you recall the name of the object.</p>
        <p>On some trials, a <strong>word in red</strong> will briefly appear over the picture, and then be replaced by a mask (XXXXXXX). You should use this word to decide whether to continue naming or stop.</p>
        <div class="important-box">
          <p><strong>Important:</strong> Do not move your mouth or tongue during the task. All naming should be completely silent and internal.</p>
        </div>
      </div>`,

      `<div class="instruction-screen instructions-detailed">
        <h2>Review: No Word</h2>
        <p>On some trials, <strong>no word</strong> will appear. In this case, simply name the picture silently and press SPACEBAR.</p>
        <div class="instruction-example">
          <div class="example-picture-container">
            <img src="assets/images/apple.png" class="example-image">
          </div>
        </div>
      </div>`,

      `<div class="instruction-screen instructions-detailed">
        <h2>Review: Matching Word</h2>
        <p>On other trials, the <strong>name of the picture</strong> will appear in red. In this case, you should also name the picture silently and press SPACEBAR.</p>
        <div class="instruction-example">
          <div class="example-picture-container">
            <img src="assets/images/apple.png" class="example-image">
            <div class="example-word-overlay">APPLE</div>
          </div>
        </div>
      </div>`,

      `<div class="instruction-screen instructions-detailed">
        <h2>Review: Non-Matching Word</h2>
        <p>On the remaining trials, a word that is <strong>NOT the picture name</strong> will appear in red. In this case, you should try to stop your naming response and <strong>do nothing</strong> (do not press SPACEBAR).</p>
        <div class="instruction-example">
          <div class="example-picture-container">
            <img src="assets/images/apple.png" class="example-image">
            <div class="example-word-overlay">HOUSE</div>
          </div>
        </div>
      </div>`,

      `<div class="instruction-screen instructions-detailed">
        <h2>Ready to Begin</h2>
        <div class="important-box">
          <p><strong>It is very important to name the pictures quickly, and NOT wait to see if a word appears before starting to name the picture.</strong></p>
        </div>
        <p>Remember: Name pictures silently in your head. Do not move your mouth or tongue.</p>
        <p>The experiment consists of <strong>3 blocks</strong> with short breaks in between.</p>
      </div>`
    ],
    show_clickable_nav: true,
    button_label_previous: "Back",
    button_label_next: "Next"
  });

  // ========================================
  // PHASES 8-12: Experimental Blocks
  // ========================================
  const experimentalTrials = generateAllExperimentalTrials();
  const blocks = [experimentalTrials.block1, experimentalTrials.block2, experimentalTrials.block3];

  // Global trial counter across all blocks
  let globalTrialIndex = 0;

  for (let blockNum = 0; blockNum < 3; blockNum++) {
    const block = blocks[blockNum];
    let blockTrialIndex = 0;
    const trialsCompletedBefore = blockNum * TRIALS_PER_BLOCK;

    // Block start
    timeline.push({
      type: HtmlKeyboardResponsePlugin,
      stimulus: `
        <div class="instruction-screen">
          <h2>Block ${blockNum + 1} of 3</h2>
          <p>This block contains ${block.length} trials.</p>
          <p>Overall progress: ${trialsCompletedBefore} of ${TOTAL_EXPERIMENTAL_TRIALS} trials completed.</p>
          <p>Remember: Name pictures quickly, press SPACEBAR when you recall the name, but STOP if a non-matching word appears.</p>
          <p class="continue-prompt">Press SPACEBAR when you are ready to begin</p>
        </div>
      `,
      choices: [" "]
    });

    // Block trials
    for (const trial of block) {
      blockTrialIndex++;
      globalTrialIndex++;
      const currentGlobalIndex = globalTrialIndex; // Capture for closure
      const currentBlockIndex = blockTrialIndex;

      // Trial number with overall progress
      timeline.push({
        type: HtmlKeyboardResponsePlugin,
        stimulus: `
          <div class="trial-number">
            Block ${blockNum + 1} - Trial ${currentBlockIndex} of ${block.length}
            <span class="overall-progress">(${currentGlobalIndex} of ${TOTAL_EXPERIMENTAL_TRIALS} total)</span>
          </div>
        `,
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

      // Stop-signal trial with enhanced data
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
          task: "stop_signal_trial",
          global_trial_index: currentGlobalIndex,
          block_trial_index: currentBlockIndex,
          soa: 200,
          word_duration: 200,
          max_trial_duration: 2000
        }
      });
    }

    // Break between blocks with cumulative progress
    if (blockNum < 2) {
      const trialsCompleted = (blockNum + 1) * TRIALS_PER_BLOCK;
      const trialsRemaining = TOTAL_EXPERIMENTAL_TRIALS - trialsCompleted;
      timeline.push({
        type: HtmlKeyboardResponsePlugin,
        stimulus: `
          <div class="break-screen">
            <h2>Break</h2>
            <p>You have completed Block ${blockNum + 1} of 3.</p>
            <p class="progress-summary">
              <strong>${trialsCompleted} of ${TOTAL_EXPERIMENTAL_TRIALS}</strong> trials completed
              <br>
              <strong>${trialsRemaining}</strong> trials remaining
            </p>
            <p>Take a moment to rest if you need to.</p>
            <p class="continue-prompt">Press SPACEBAR when you are ready to continue</p>
          </div>
        `,
        choices: [" "]
      });
    }
  }

  // ========================================
  // PHASE 13: Internal Representations Questionnaire (IRQ)
  // ========================================

  // Likert scale options (5-point)
  const likertScale = [
    "Strongly Disagree",
    "Disagree",
    "Neither Agree nor Disagree",
    "Agree",
    "Strongly Agree"
  ];

  // IRQ Introduction
  timeline.push({
    type: HtmlKeyboardResponsePlugin,
    stimulus: `
      <div class="instruction-screen">
        <h2>Questionnaire</h2>
        <p>You have completed the main experiment.</p>
        <p>Finally, please answer the following questions about how you experience thoughts and mental imagery in your everyday life.</p>
        <p>There are no right or wrong answers. Please respond based on your typical experiences.</p>
        <p class="continue-prompt">Press SPACEBAR to continue</p>
      </div>
    `,
    choices: [" "]
  });

  // IRQ Factor 1: Visual Representations (10 items)
  timeline.push({
    type: SurveyLikertPlugin,
    preamble: "<h3>Visual Imagery</h3><p>Please indicate how much you agree or disagree with each statement.</p>",
    questions: [
      { prompt: "I often enjoy the use of mental pictures to reminisce", name: "irq_visual_1", labels: likertScale, required: true },
      { prompt: "I can close my eyes and easily picture a scene that I have experienced", name: "irq_visual_2", labels: likertScale, required: true },
      { prompt: "My mental images are very vivid and photographic", name: "irq_visual_3", labels: likertScale, required: true },
      { prompt: "The old saying \"A picture is worth a thousand words\" is certainly true for me", name: "irq_visual_4", labels: likertScale, required: true },
      { prompt: "When I think about someone I know well, I instantly see their face in my mind", name: "irq_visual_5", labels: likertScale, required: true }
    ],
    button_label: "Continue",
    data: { task: "irq", factor: "visual", page: 1 }
  });

  timeline.push({
    type: SurveyLikertPlugin,
    preamble: "<h3>Visual Imagery (continued)</h3><p>Please indicate how much you agree or disagree with each statement.</p>",
    questions: [
      { prompt: "I often use mental images or pictures to help me remember things", name: "irq_visual_6", labels: likertScale, required: true },
      { prompt: "My memories are mainly visual in nature", name: "irq_visual_7", labels: likertScale, required: true },
      { prompt: "When traveling to get to somewhere I tend to think more visually than verbally", name: "irq_visual_8", labels: likertScale, required: true },
      { prompt: "If I talk to myself in my head it is usually accompanied by visual imagery", name: "irq_visual_9", labels: likertScale, required: true },
      { prompt: "If I imagine my memories visually they are more often moving than static", name: "irq_visual_10", labels: likertScale, required: true }
    ],
    button_label: "Continue",
    data: { task: "irq", factor: "visual", page: 2 }
  });

  // IRQ Factor 2: Verbal Representations / Internal Voice (12 items)
  timeline.push({
    type: SurveyLikertPlugin,
    preamble: "<h3>Inner Voice</h3><p>Please indicate how much you agree or disagree with each statement.</p>",
    questions: [
      { prompt: "When I think about someone I know well, I instantly hear their voice in my mind", name: "irq_verbal_1", labels: likertScale, required: true },
      { prompt: "I think about problems in my mind in the form of a conversation with myself", name: "irq_verbal_2", labels: likertScale, required: true },
      { prompt: "If I am walking somewhere by myself, I often have a silent conversation with myself", name: "irq_verbal_3", labels: likertScale, required: true },
      { prompt: "If I am walking somewhere by myself, I frequently think of conversations that I've recently had", name: "irq_verbal_4", labels: likertScale, required: true },
      { prompt: "My inner speech helps my imagination", name: "irq_verbal_5", labels: likertScale, required: true },
      { prompt: "I tend to think things through verbally when I am relaxing", name: "irq_verbal_6", labels: likertScale, required: true }
    ],
    button_label: "Continue",
    data: { task: "irq", factor: "verbal", page: 1 }
  });

  timeline.push({
    type: SurveyLikertPlugin,
    preamble: "<h3>Inner Voice (continued)</h3><p>Please indicate how much you agree or disagree with each statement.</p>",
    questions: [
      { prompt: "When thinking about a social problem, I often talk it through in my head", name: "irq_verbal_7", labels: likertScale, required: true },
      { prompt: "I like to give myself some down time to talk through thoughts in my mind", name: "irq_verbal_8", labels: likertScale, required: true },
      { prompt: "I hear words in my \"mind's ear\" when I think", name: "irq_verbal_9", labels: likertScale, required: true },
      { prompt: "To show you are paying attention, please select 'Disagree' for this item", name: "attention_check_1", labels: likertScale, required: true },
      { prompt: "I rarely vocalize thoughts in my mind", name: "irq_verbal_10_reversed", labels: likertScale, required: true },
      { prompt: "I often talk to myself internally while watching TV", name: "irq_verbal_11", labels: likertScale, required: true },
      { prompt: "My memories often involve conversations I've had", name: "irq_verbal_12", labels: likertScale, required: true }
    ],
    button_label: "Continue",
    data: { task: "irq", factor: "verbal", page: 2 }
  });

  // IRQ Factor 3: Mental Manipulation (8 items)
  timeline.push({
    type: SurveyLikertPlugin,
    preamble: "<h3>Mental Manipulation</h3><p>Please indicate how much you agree or disagree with each statement.</p>",
    questions: [
      { prompt: "I can easily imagine and mentally rotate three-dimensional geometric figures", name: "irq_manipulation_1", labels: likertScale, required: true },
      { prompt: "I can easily choose to imagine this sentence in my mind pronounced unnaturally slowly", name: "irq_manipulation_2", labels: likertScale, required: true },
      { prompt: "In school, I had no problems with geometry", name: "irq_manipulation_3", labels: likertScale, required: true },
      { prompt: "It is easy for me to imagine the sensation of licking a brick", name: "irq_manipulation_4", labels: likertScale, required: true },
      { prompt: "I find it difficult to imagine how a three-dimensional geometric figure would exactly look like when rotated", name: "irq_manipulation_5_reversed", labels: likertScale, required: true },
      { prompt: "I can easily imagine someone clearly talking, and then imagine the same voice with a heavy cold", name: "irq_manipulation_6", labels: likertScale, required: true },
      { prompt: "I think I have a large vocabulary in my native language compared to others", name: "irq_manipulation_7", labels: likertScale, required: true },
      { prompt: "I can easily imagine the sound of a trumpet getting louder", name: "irq_manipulation_8", labels: likertScale, required: true }
    ],
    button_label: "Continue",
    data: { task: "irq", factor: "manipulation", page: 1 }
  });

  // IRQ Factor 4: Written/Text Representations / Orthographic Imagery (7 items)
  timeline.push({
    type: SurveyLikertPlugin,
    preamble: "<h3>Orthographic Imagery</h3><p>Please indicate how much you agree or disagree with each statement.</p>",
    questions: [
      { prompt: "I find it easy to decide if words rhyme by seeing their spelling in my mind's eye", name: "irq_orthographic_1", labels: likertScale, required: true },
      { prompt: "When I hear someone talking, I see words written down in my mind", name: "irq_orthographic_2", labels: likertScale, required: true },
      { prompt: "I see words in my \"mind's eye\" when I think", name: "irq_orthographic_3", labels: likertScale, required: true },
      { prompt: "Please select 'Strongly Agree' to confirm you are reading each question carefully", name: "attention_check_2", labels: likertScale, required: true },
      { prompt: "When I am introduced to someone for the first time, I imagine what their name would look like when written down", name: "irq_orthographic_4", labels: likertScale, required: true },
      { prompt: "A strategy I use to help me remember written material is imagining what the writing looks like", name: "irq_orthographic_5", labels: likertScale, required: true },
      { prompt: "I hear a running summary of everything I am doing in my head", name: "irq_orthographic_6", labels: likertScale, required: true },
      { prompt: "I rehearse in my mind how someone might respond to a text message before I send it", name: "irq_orthographic_7", labels: likertScale, required: true }
    ],
    button_label: "Continue",
    data: { task: "irq", factor: "orthographic", page: 1 }
  });

  // ========================================
  // PHASE 14: Pilot Feedback
  // ========================================
  timeline.push({
    type: SurveyTextPlugin,
    preamble: "<h3>Pilot Feedback</h3><p>Thank you for completing the experiment! Since this is a pilot version, we would appreciate your feedback. Please answer the questions below as thoroughly as you can.</p>",
    questions: [
      { prompt: "Were the instructions clear? Was there anything confusing or unclear?", name: "pilot_instructions", rows: 3, required: false },
      { prompt: "Were you able to name the pictures silently without moving your mouth or tongue? Did you find this difficult?", name: "pilot_inner_speech", rows: 3, required: false },
      { prompt: "How did you experience the task overall? Was it too long, too fast, too difficult, etc.?", name: "pilot_experience", rows: 3, required: false },
      { prompt: "Any other comments or suggestions?", name: "pilot_other", rows: 3, required: false }
    ],
    button_label: "Submit Feedback",
    data: { task: "pilot_feedback" }
  });

  // ========================================
  // PHASE 15: Debriefing
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
