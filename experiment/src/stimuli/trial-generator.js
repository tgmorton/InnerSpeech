/**
 * Trial generator for the Inner Speech Stop-Signal experiment
 * Handles trial creation and randomization with constraints
 */

import { PICTURES, WORD_LISTS, STOP_SIGNAL_CONDITIONS, getImagePath } from "./word-lists.js";

/**
 * Shuffle array using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array
 */
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Create a single trial object
 * @param {string} picture - Picture name
 * @param {string} trialType - 'go', 'go_signal', or 'stop_signal'
 * @param {string|null} condition - Stop-signal condition (null for go trials)
 * @param {number|null} block - Block number
 * @param {string} phase - 'practice' or 'experimental'
 * @returns {Object} Trial object
 */
function createTrial(picture, trialType, condition, block, phase) {
  let signalWord = null;

  if (trialType === "go_signal") {
    signalWord = WORD_LISTS[picture].match;
  } else if (trialType === "stop_signal") {
    signalWord = WORD_LISTS[picture][condition];
  }

  return {
    picture_name: picture,
    image: getImagePath(picture),
    trial_type: trialType,
    signal_word: signalWord,
    signal_condition: condition,
    block: block,
    phase: phase
  };
}

/**
 * Randomize trials with constraint: no more than 2 consecutive stop-signal trials
 * @param {Array} trials - Array of trial objects
 * @returns {Array} Randomized trials
 */
function randomizeWithConstraint(trials) {
  let attempts = 0;
  const maxAttempts = 1000;

  while (attempts < maxAttempts) {
    const shuffled = shuffleArray(trials);
    let valid = true;
    let consecutiveStops = 0;

    for (const trial of shuffled) {
      if (trial.trial_type === "stop_signal") {
        consecutiveStops++;
        if (consecutiveStops > 2) {
          valid = false;
          break;
        }
      } else {
        consecutiveStops = 0;
      }
    }

    if (valid) {
      return shuffled;
    }
    attempts++;
  }

  // If we can't find a valid sequence, return a shuffled array anyway
  // (should be very rare with proper trial proportions)
  console.warn("Could not find sequence meeting constraint after", maxAttempts, "attempts");
  return shuffleArray(trials);
}

/**
 * Generate practice trials
 * 72 trials total:
 * - 27 go trials (37.5%) - each picture 1.5x on average
 * - 27 go-signal trials (37.5%) - each picture 1.5x on average
 * - 18 stop-signal trials (25%) - each picture 1x with unrelated words only
 * @returns {Array} Practice trial array
 */
export function generatePracticeTrials() {
  const trials = [];

  // Create go trials (27 total = 18 pictures * 1.5)
  // We'll use 18 pictures for first round, then randomly pick 9 more
  const shuffledForGo = shuffleArray(PICTURES);
  for (const picture of PICTURES) {
    trials.push(createTrial(picture, "go", null, null, "practice"));
  }
  // Add 9 more random go trials
  for (let i = 0; i < 9; i++) {
    trials.push(createTrial(shuffledForGo[i], "go", null, null, "practice"));
  }

  // Create go-signal trials (27 total)
  const shuffledForGoSignal = shuffleArray(PICTURES);
  for (const picture of PICTURES) {
    trials.push(createTrial(picture, "go_signal", null, null, "practice"));
  }
  // Add 9 more random go-signal trials
  for (let i = 0; i < 9; i++) {
    trials.push(createTrial(shuffledForGoSignal[i], "go_signal", null, null, "practice"));
  }

  // Create stop-signal trials (18 total) - only unrelated condition for practice
  for (const picture of PICTURES) {
    trials.push(createTrial(picture, "stop_signal", "unrelated", null, "practice"));
  }

  return randomizeWithConstraint(trials);
}

/**
 * Generate experimental trials for a single block
 * 144 trials per block:
 * - 54 go trials (37.5%) - each picture 3x
 * - 54 go-signal trials (37.5%) - each picture 3x
 * - 36 stop-signal trials (25%) - each picture 2x (2 of 6 conditions)
 * @param {number} blockNum - Block number (1, 2, or 3)
 * @param {Object} conditionAssignment - Which conditions to use for this block
 * @returns {Array} Block trial array
 */
export function generateBlockTrials(blockNum, conditionAssignment) {
  const trials = [];

  // Create go trials (54 = 18 pictures * 3)
  for (const picture of PICTURES) {
    for (let i = 0; i < 3; i++) {
      trials.push(createTrial(picture, "go", null, blockNum, "experimental"));
    }
  }

  // Create go-signal trials (54 = 18 pictures * 3)
  for (const picture of PICTURES) {
    for (let i = 0; i < 3; i++) {
      trials.push(createTrial(picture, "go_signal", null, blockNum, "experimental"));
    }
  }

  // Create stop-signal trials (36 = 18 pictures * 2 conditions per block)
  for (const picture of PICTURES) {
    const conditions = conditionAssignment[picture];
    for (const condition of conditions) {
      trials.push(createTrial(picture, "stop_signal", condition, blockNum, "experimental"));
    }
  }

  return randomizeWithConstraint(trials);
}

/**
 * Create balanced condition assignments across 3 blocks
 * Each picture gets each of the 6 stop-signal conditions once across all blocks
 * Each block has 2 conditions per picture
 * @returns {Object[]} Array of 3 condition assignments, one per block
 */
export function createConditionAssignments() {
  // Each picture needs 6 conditions spread across 3 blocks (2 per block)
  // We'll create balanced Latin-square-like distribution

  const assignments = [{}, {}, {}];

  for (const picture of PICTURES) {
    // Shuffle conditions for this picture
    const shuffledConditions = shuffleArray([...STOP_SIGNAL_CONDITIONS]);

    // Assign 2 conditions per block
    assignments[0][picture] = [shuffledConditions[0], shuffledConditions[1]];
    assignments[1][picture] = [shuffledConditions[2], shuffledConditions[3]];
    assignments[2][picture] = [shuffledConditions[4], shuffledConditions[5]];
  }

  return assignments;
}

/**
 * Generate all experimental trials for all 3 blocks
 * @returns {Object} Object containing trials for each block
 */
export function generateAllExperimentalTrials() {
  const conditionAssignments = createConditionAssignments();

  return {
    block1: generateBlockTrials(1, conditionAssignments[0]),
    block2: generateBlockTrials(2, conditionAssignments[1]),
    block3: generateBlockTrials(3, conditionAssignments[2])
  };
}

/**
 * Generate familiarization trials (show picture with name)
 * @returns {Array} Familiarization trials (shuffled)
 */
export function generateFamiliarizationTrials() {
  return shuffleArray(PICTURES.map(picture => ({
    picture_name: picture,
    image: getImagePath(picture),
    label: picture.toUpperCase()
  })));
}

/**
 * Generate practice naming trials (just pictures, no signal)
 * @returns {Array} Practice naming trials (shuffled)
 */
export function generatePracticeNamingTrials() {
  return shuffleArray(PICTURES.map(picture => ({
    picture_name: picture,
    image: getImagePath(picture)
  })));
}
