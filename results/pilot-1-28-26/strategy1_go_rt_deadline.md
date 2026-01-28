# Strategy 1: Go RT Deadline with Feedback (Practice Only)

## Problem

Pilot data (N=2) shows halt rates of ~87-90% on stop-signal trials, well above the ~50-60% observed in Slevc & Ferreira (2006) Experiment 5 with overt speech. Pilot go RTs (623-657ms) suggest participants are strategically delaying their response to check whether a stop-signal word appears (SOA = 200ms), violating the independence assumption of the race model. One participant explicitly reported waiting for the word.

## Proposal

Introduce a **go RT deadline with corrective feedback during practice only**. When a participant's go or go-signal RT exceeds a threshold, brief feedback is displayed prompting them to respond faster. No feedback is given during experimental blocks, preserving the integrity of the critical data.

## Implementation

### Threshold Calculation

- **Fixed initial threshold**: 700ms for the first 18 practice trials (before sufficient data for a running mean)
- **Adaptive threshold**: After 18 trials, use the running mean of go/go-signal RTs + 1 SD, recalculated every trial
- Only go and go-signal trials contribute to the running mean (stop-signal trials are excluded since withholding is correct behavior)

### Feedback Display

- When a go or go-signal RT exceeds the threshold: display "Too slow — please respond faster!" for 1000ms after the trial
- When no response is made on a go or go-signal trial (timeout): display "No response detected — remember to press SPACEBAR as soon as you recall the name" for 1500ms
- No feedback on stop-signal trials (halting is correct behavior)
- Feedback appears between the trial and the next trial number screen

### Practice Structure

- Same 72 practice trials as current design (27 go, 27 go-signal, 18 stop-signal)
- Unrelated distractor words only for stop-signal trials (unchanged)
- Fixed SOA at 200ms (unchanged)

## Rationale

This strategy directly targets the go process speed without modifying the stop-signal parameters. By training participants to commit to a fast response during practice, they enter the main experiment with the habit of pressing spacebar before the word has time to influence their decision. The adaptive threshold accommodates individual differences in baseline speed while still pushing each participant to respond within their natural range.

## Advantages

- Minimal departure from preregistered design (practice only, main experiment unchanged)
- Directly addresses the identified problem (slow go responses enabling strategic waiting)
- Simple to implement
- Does not change the SOA or response window
- Feedback is only corrective, not punitive — participants are not penalized, just prompted

## Limitations

- Practice habits may not fully transfer to the main experiment without continued feedback
- 72 practice trials may not be sufficient to fully train fast responding
- Does not address the fundamental difference between voluntary button press and semi-automatic voice key onset
- Threshold calibration (700ms initial, mean + 1 SD adaptive) is somewhat arbitrary and may need adjustment based on further piloting

## Impact on Preregistration

None. Practice procedures are not specified in the preregistration beyond trial counts and the use of unrelated distractor words. The main experiment design, SOA, trial counts, and analysis plan remain unchanged.
