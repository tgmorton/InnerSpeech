# Strategy 1+2: Go RT Deadline + Practice Staircase SOA

## Problem

Pilot data (N=2) shows halt rates of ~87-90% on stop-signal trials, compared to ~50-60% in Slevc & Ferreira (2006) Experiment 5 with overt speech. Two contributing factors are identified:

1. **Slow go responses**: Mean go RTs (623-657ms) are 50-100ms slower than the original study (~570ms), leaving ample time after the 200ms SOA to process the word before committing to a response
2. **Strategic waiting**: At least one participant explicitly reported delaying their response to check for the stop-signal word, violating the independence assumption of the race model

These factors compound: slow go responses give participants time to wait, and the fixed 200ms SOA does not adapt to challenge faster responders. Addressing both the go process speed and the stop process calibration should produce halt rates in the target range.

## Proposal

Combine two complementary interventions during an extended practice phase:

1. **Go RT deadline with feedback** — constrains the go process to be fast, preventing strategic waiting
2. **Staircase SOA** — calibrates stop-signal timing to each participant's stopping ability, ensuring they experience a meaningful race

The main experiment retains the preregistered fixed 200ms SOA with no feedback.

## Implementation

### Extended Practice Block

Following Experiment 1 of Slevc & Ferreira (2006):

- **144 practice trials** (up from current 72)
  - 54 go trials (37.5%)
  - 54 go-signal trials (37.5%)
  - 36 stop-signal trials (25%, unrelated words only)
- **Break halfway** (after 72 trials)
- Same pseudorandomization constraint: no more than 2 consecutive stop-signal trials

### Component 1: Go RT Deadline

**Threshold calculation:**
- **First 18 trials**: Fixed threshold of 700ms
- **After 18 trials**: Running mean of go/go-signal RTs + 1 SD, updated each trial
- Only go and go-signal trials contribute to the running mean

**Feedback:**
- Go/go-signal RT exceeds threshold: "Too slow — please respond faster!" (1000ms)
- Go/go-signal timeout (no response): "No response detected — remember to press SPACEBAR as soon as you recall the name" (1500ms)
- No feedback on stop-signal trials
- No feedback during experimental blocks

### Component 2: Staircase SOA

**Parameters:**
- **Starting SOA**: 400ms
- **Step size**: ±10ms per stop-signal trial
- **Adjustment**: +10ms after successful halt (harder), −10ms after failed halt (easier)
- **Floor**: 280ms
- **No ceiling**

**Data recorded:**
- Current staircase SOA on each practice trial
- Final converged SOA as a participant-level variable

### How the Two Components Interact

The go RT deadline pushes participants to respond quickly (constraining the go process). The staircase then finds the SOA at which the stop signal arrives just in time to sometimes — but not always — beat the now-fast go process. Together, they produce a genuine race:

- Without the deadline, the staircase alone would chase a slow go process upward, converging at a high SOA where participants are still waiting
- Without the staircase, the deadline alone would speed up go responses but the fixed 200ms SOA might still be too easy to beat
- Combined, the deadline ensures fast go responses and the staircase ensures the stop signal arrives at a challenging time relative to those fast responses

### Transition to Main Experiment

- After practice, SOA switches to fixed 200ms (likely shorter than converged staircase SOA)
- Go RT feedback is removed
- Instruction screen: "The main experiment will now begin. Remember to respond as quickly as possible."

## Expected Outcome

During practice, participants should converge on:
- Go RTs in the 500-600ms range (pushed by the deadline)
- ~50% halt rate on stop-signal trials (calibrated by the staircase)
- A converged SOA reflecting their individual stopping speed

In the main experiment (200ms fixed SOA, no feedback):
- Halt rates should be in the 40-60% range — the SOA is shorter than practice, so halting is harder, but participants have learned to respond fast
- Go RTs may drift slightly slower without feedback, but the learned habit should persist
- Condition differences in halt rates should be detectable with adequate variance

## Advantages

- Addresses both identified problems (slow go process + uncalibrated stop timing)
- Follows established methodology (staircase from Slevc & Ferreira, 2006, Experiment 1)
- Extended practice gives participants more time to learn the unfamiliar inner speech + button press task
- The two components are synergistic — each is more effective in combination
- Main experiment design is completely unchanged from preregistration
- Individual staircase convergence data provides a useful measure of each participant's stopping ability

## Limitations

- More complex practice implementation
- Longer practice section increases total experiment duration by ~5-7 minutes
- The transition from practice (staircase + feedback) to main experiment (fixed SOA, no feedback) is a notable change in task dynamics — there may be a re-adjustment period at the start of Block 1
- Go RT threshold parameters (700ms initial, mean + 1 SD) are somewhat arbitrary
- Requires further pilot testing to verify the approach produces target halt rates in the main experiment

## Impact on Preregistration

Minimal. Changes are confined to the practice phase:
- Practice trials increase from 72 to 144
- Practice SOA changes from fixed 200ms to staircase (400ms start, ±10ms, floor 280ms)
- Go RT feedback added during practice only

The main experiment — trial counts, fixed 200ms SOA, trial proportions, randomization constraints, and all analysis plans — remains exactly as preregistered. These adaptations can be disclosed as methodological modifications based on pilot testing to accommodate the button-press response modality, following established practice from Experiment 1 of the same paradigm.
