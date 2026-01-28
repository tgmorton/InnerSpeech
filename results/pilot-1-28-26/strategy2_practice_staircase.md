# Strategy 2: Practice Staircase SOA

## Problem

Pilot data (N=2) shows halt rates of ~87-90% on stop-signal trials, well above the ~50-60% observed in Slevc & Ferreira (2006) Experiment 5 with overt speech. With a fixed 200ms SOA, the stop-signal word appears and disappears before most participants respond (mean go RT = 623-657ms), giving them ample time to incorporate the word into their response decision rather than running a genuine race between go and stop processes.

## Proposal

Implement a **staircase SOA procedure during an extended practice phase**, following the method used in Slevc & Ferreira (2006) Experiment 1. The SOA starts high (400ms) and adjusts dynamically based on stop-signal performance, calibrating the task difficulty to each participant's natural stopping ability. The main experiment retains the preregistered fixed 200ms SOA.

## Implementation

### Staircase Parameters

- **Starting SOA**: 400ms
- **Step size**: ±10ms per stop-signal trial
- **Direction**: Increase SOA by 10ms after a successful halt (making the task harder — the word appears later, so participants have less time to process it before responding). Decrease SOA by 10ms after a failed halt (making the task easier — the word appears earlier).
- **Floor**: 280ms (to prevent the word from appearing early enough to function as a picture-word interference stimulus; following Slevc & Ferreira, 2006)
- **No ceiling**: SOA can increase without limit, though in practice it will stabilize around each participant's threshold

### Extended Practice Block

Following Experiment 1 of Slevc & Ferreira (2006):

- **144 practice trials** (up from current 72)
  - 54 go trials (37.5%)
  - 54 go-signal trials (37.5%)
  - 36 stop-signal trials (25%, unrelated words only)
- **Break halfway** (after 72 trials)
- Same pseudorandomization constraint: no more than 2 consecutive stop-signal trials

### Data Recorded

- The staircase SOA value is recorded on each practice trial for verification
- Final staircase SOA value is recorded as a participant-level measure (can be used as an individual difference variable or exclusion criterion)

### Transition to Main Experiment

- After practice, the SOA switches to the fixed 200ms for all experimental blocks
- An instruction screen notes: "The main experiment will now begin. The task is the same as in practice."
- The 200ms SOA will likely be shorter than the participant's converged staircase SOA, meaning halt rates in the main experiment will be lower than during practice — this is expected and desirable

## Rationale

The staircase procedure calibrates the task to each participant's stopping speed during practice, ensuring they experience a meaningful range of halts and non-halts while learning the task. Over 144 trials, the SOA will converge on a value where the participant halts approximately 50% of the time on stop-signal trials, teaching them that they cannot reliably wait for the word.

When the main experiment begins with a fixed 200ms SOA (shorter than most participants' converged SOA), the word appears earlier — but participants have already learned to respond quickly from practice. The result should be halt rates closer to 50-60% rather than the 87-90% observed in the pilot.

## Advantages

- Follows established methodology from the same research paradigm (Slevc & Ferreira, 2006, Experiment 1)
- Calibrates to individual differences in stopping ability
- Extended practice (144 trials) gives participants more time to learn the task — pilot Participant 2 had the task backwards during practice, suggesting 72 trials is insufficient
- Does not modify the main experiment design
- The staircase naturally teaches participants that strategic waiting doesn't help, because the SOA adjusts to challenge them

## Limitations

- The transition from a converged staircase SOA (likely 300-400ms) to a fixed 200ms may feel abrupt to participants
- The staircase addresses stop process calibration but does not directly constrain go process speed — participants could still adopt a waiting strategy by simply being slow on go trials, which would push the staircase to higher SOAs
- A longer practice section increases total experiment duration
- The staircase SOA floor of 280ms means participants never practice with the 200ms SOA they'll encounter in the main experiment

## Impact on Preregistration

Minimal. The preregistration specifies 72 practice trials; this increases to 144. Practice procedures are ancillary to the main design. The preregistration states the design "follows exactly from Experiment 5 of Slevc and Ferreira, including a fixed Stop Onset Asynchrony (SOA) of 200ms with no staircase procedure" — this remains true for the main experiment. The practice staircase is a training procedure, not a change to the experimental design. This could be disclosed as a methodological adaptation based on pilot testing.
