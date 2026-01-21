# Stop-Signal Picture Naming Experiment Protocol
## Replication of Slevc & Ferreira (2006), Experiment 5

---

## 1. OVERVIEW

### 1.1 Purpose
Test the perceptual loop theory of speech monitoring by examining whether speakers' ability to halt word production is affected by the phonological and/or semantic similarity of a stop-signal to the intended word.

### 1.2 Basic Paradigm
```
┌─────────────────────────────────────────────────────────────────┐
│                    STOP-SIGNAL PICTURE NAMING                   │
├─────────────────────────────────────────────────────────────────┤
│  PRIMARY TASK: Name pictures as quickly as possible             │
│  SECONDARY TASK: Halt naming if a non-matching word appears     │
└─────────────────────────────────────────────────────────────────┘
```

### 1.3 Trial Type Distribution
```
Total Trials: 432 experimental (+ 72 practice)

    ┌────────────────┬─────────┬────────────────────────────────┐
    │   Trial Type   │    %    │          Description           │
    ├────────────────┼─────────┼────────────────────────────────┤
    │   Go trials    │  37.5%  │ Picture only, no word appears  │
    │ Go-signal      │  37.5%  │ Matching word appears          │
    │ Stop-signal    │  25.0%  │ Non-matching word appears      │
    └────────────────┴─────────┴────────────────────────────────┘
```

---

## 2. PARTICIPANTS

### 2.1 Sample Size
- **N = 48** (as in Experiment 5)
- Recruit additional participants to account for exclusions

### 2.2 Inclusion Criteria
- University students (UCSD undergraduates in original)
- Native English speakers
- Normal or corrected-to-normal vision

### 2.3 Exclusion Criteria
- Mean go-trial RT > 2 SD from overall mean go-trial RT
- Misunderstanding task instructions / performing task incorrectly
- Equipment malfunction

### 2.4 Compensation
- Course credit (SONA)

---

## 3. APPARATUS & EQUIPMENT

### 3.1 Computer System
- Computer running experiment software
- Original: Apple Macintosh with PsyScope 1.2.5
- Modern equivalent: Any system running PsychoPy, E-Prime, or similar

### 3.2 Display
- Monitor capable of precise timing
- Pictures displayed at approximately **3 × 3 inches** (~7.6 × 7.6 cm)

### 3.3 Audio Recording
- **Head-worn microphone** connected to:
  - Voice-key device (for onset latency measurement)
  - Audio recorder (for verification of responses)
- Microphone sensitivity calibrated separately for each subject

### 3.4 Response Collection
- Voice key for reaction time measurement
- Audio recording for offline verification of:
  - Whether participant stopped successfully
  - Whether response was correct picture name
  - Number of phonemes produced before halting

---

## 4. STIMULI

### 4.1 Pictures
**Source:** 18 line drawings from Snodgrass & Vanderwart (1980)

```
┌──────────────────────────────────────────────────────────────┐
│                    18 TARGET PICTURES                        │
├──────────────────────────────────────────────────────────────┤
│  apple     basket    bee       bread     camel     carrot   │
│  duck      elephant  fly       lamp      peanut    rabbit   │
│  snake     spoon     squirrel  train     truck     trumpet  │
└──────────────────────────────────────────────────────────────┘
```

**Display specifications:**
- Black line drawings on white background
- Approximately 3 × 3 inches
- Centered on screen

### 4.2 Stop-Signal Words (Visual)

#### 4.2.1 The 2×2 Design: Phonological × Semantic Similarity
```
                        SEMANTIC SIMILARITY
                    Similar         Dissimilar
                ┌───────────────┬───────────────┐
     Similar    │  PHON + SEM   │    PHON       │
PHONOLOGICAL    │  (apricot)    │   (apathy)    │
  SIMILARITY    ├───────────────┼───────────────┤
    Dissimilar  │    SEM        │  UNRELATED    │
                │   (peach)     │   (couch)     │
                └───────────────┴───────────────┘

        Example: Picture = APPLE
```

**Phonological similarity criteria:**
- Minimum overlap of first 2 phonemes with picture name

**Semantic similarity criteria:**
- Rated semantic similarity matched between conditions

#### 4.2.2 Complete Stimulus List (from Appendix A)

| Picture | Phon+Sem | Phon Only | Sem Only | Unrelated |
|---------|----------|-----------|----------|-----------|
| apple | apricot | apathy | peach | couch |
| basket | bag | ban | crib | thirst |
| bee | beetle | beacon | spider | flag |
| bread | bran | brick | donut | nail |
| camel | calf | cash | pig | bucket |
| carrot | cabbage | cast | spinach | evening |
| duck | dove | dub | raven | brass |
| elephant | elk | elm | moose | stripe |
| fly | flea | flu | moth | rake |
| lamp | lantern | landing | candle | package |
| peanut | pecan | piano | almond | dress |
| rabbit | rat | raft | beaver | coffee |
| snake | snail | snack | eel | fire |
| spoon | spatula | sparkle | ladle | cable |
| squirrel | skunk | skate | mole | chain |
| train | trolley | trophy | bus | fox |
| truck | tractor | trap | jeep | celery |
| trumpet | trombone | traffic | horn | corner |

#### 4.2.3 Additional Emotional Valence Conditions (+2)

| Picture | Emotionally Valent | Neutral Control |
|---------|-------------------|-----------------|
| apple | tsunami | summary |
| basket | murder | agreed |
| bee | polio | curio |
| bread | cancer | miller |
| camel | sex | add |
| carrot | death | field |
| duck | tornado | pivotal |
| elephant | bomb | mood |
| fly | scream | thread |
| lamp | deceit | tokens |
| peanut | horror | marble |
| rabbit | knife | looks |
| snake | famine | digest |
| spoon | danger | wonder |
| squirrel | doom | toad |
| train | gun | lot |
| truck | AIDS | beef |
| trumpet | disease | speaker |

**Matching criteria for valent/neutral pairs:**
- Length (number of letters)
- Lexical frequency (log-transformed)
- Mean bigram frequency

### 4.3 Visual Word Presentation
- **Font:** Uppercase Helvetica 18-point bold
- **Position:** Centered on picture
- **Duration:** 200 ms
- **Mask:** "XXXXXXX" (replaces word after 200 ms)

---

## 5. TRIAL STRUCTURE & TIMING

### 5.1 Single Trial Timeline (Experiment 5)

```
TIME (ms)    EVENT
─────────────────────────────────────────────────────────────────
    0        Trial number appears (centered)
             │
  500        Trial number removed
             Fixation cross appears (+)
             │
 1000        Fixation cross removed
             PICTURE APPEARS
             │
 1200        [STOP/GO-SIGNAL TRIALS ONLY]
             Word appears overlaid on picture (SOA = 200ms)
             │
 1400        Word replaced by mask "XXXXXXX"
             Picture + mask remain on screen
             │
   ↓         Voice key triggers OR 2000ms timeout
             │
 ≤3000       Picture disappears
             Next trial begins
─────────────────────────────────────────────────────────────────
```

### 5.2 Visual Timeline Diagram

```
GO TRIAL:
┌─────┐ ┌─────┐ ┌─────────────────────────────────────┐
│ "1" │→│  +  │→│         [PICTURE]                   │→ Response
└─────┘ └─────┘ └─────────────────────────────────────┘
 500ms   500ms            until voice key or 2000ms

GO-SIGNAL TRIAL:
┌─────┐ ┌─────┐ ┌───────┬───────┬─────────────────────┐
│ "1" │→│  +  │→│ [PIC] │ LAMP  │ [PIC] + XXXXXXX     │→ Response
└─────┘ └─────┘ └───────┴───────┴─────────────────────┘
 500ms   500ms   200ms    200ms   until voice key/2000ms
                 (SOA)   (word)

STOP-SIGNAL TRIAL:
┌─────┐ ┌─────┐ ┌───────┬───────┬─────────────────────┐
│ "1" │→│  +  │→│ [PIC] │CANDLE │ [PIC] + XXXXXXX     │→ Stop/Fail
└─────┘ └─────┘ └───────┴───────┴─────────────────────┘
 500ms   500ms   200ms    200ms   until voice key/2000ms
                 (SOA)   (word)
```

### 5.3 Critical Timing Parameters

| Parameter | Value | Notes |
|-----------|-------|-------|
| Trial number duration | 500 ms | |
| Fixation cross duration | 500 ms | |
| SOA (Stimulus Onset Asynchrony) | **200 ms** | Fixed in Exp 5 |
| Word display duration | 200 ms | |
| Maximum trial duration | 2000 ms | From picture onset |
| Response window | Until voice key or 2000 ms | |

---

## 6. EXPERIMENTAL DESIGN

### 6.1 Factors

**Within-subjects 2 × 2 + 2 design:**

```
┌─────────────────────────────────────────────────────────────┐
│                    STOP-SIGNAL CONDITIONS                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│     2 × 2 FACTORIAL:                                        │
│     ├── Phonological Similarity (similar / dissimilar)      │
│     └── Semantic Similarity (similar / dissimilar)          │
│                                                             │
│     +2 ADDITIONAL:                                          │
│     ├── Emotionally Valent                                  │
│     └── Neutral Control                                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Trial Counts (Experiment 5)

```
PRACTICE SECTION: 72 trials
├── Go trials:        27  (37.5%)
├── Go-signal trials: 27  (37.5%)
└── Stop-signal trials: 18 (25%, unrelated words only)

EXPERIMENTAL SECTION: 432 trials
├── Go trials:        162 (37.5%, each picture 9×)
├── Go-signal trials: 162 (37.5%, each picture 9×)
└── Stop-signal trials: 108 (25%, each picture 6×)
    ├── Phon + Sem:    18 (each picture 1×)
    ├── Phon only:     18 (each picture 1×)
    ├── Sem only:      18 (each picture 1×)
    ├── Unrelated:     18 (each picture 1×)
    ├── Valent:        18 (each picture 1×)
    └── Neutral:       18 (each picture 1×)
```

### 6.3 Randomization

- Trials presented in **random order**
- **Constraint:** No more than 2 stop-signal trials adjacent to each other
- **Breaks:** 2 breaks, equally spaced throughout experimental session

---

## 7. PROCEDURE

### 7.1 Session Overview

```
┌────────────────────────────────────────────────────────────────┐
│                    EXPERIMENTAL SESSION                        │
│                    (~35 minutes total)                         │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  1. FAMILIARIZATION PHASE                                      │
│     └── View all 18 pictures with names (2000ms each)          │
│                                                                │
│  2. PRACTICE NAMING                                            │
│     └── Name 18 pictures, corrections provided                 │
│                                                                │
│  3. INSTRUCTIONS                                               │
│     └── On-screen + verbal summary from experimenter           │
│                                                                │
│  4. PRACTICE TRIALS                                            │
│     └── 72 trials with unrelated stop-signals                  │
│                                                                │
│  5. EXPERIMENTAL TRIALS                                        │
│     ├── Block 1: 144 trials                                    │
│     ├── [BREAK]                                                │
│     ├── Block 2: 144 trials                                    │
│     ├── [BREAK]                                                │
│     └── Block 3: 144 trials                                    │
│                                                                │
│  6. DEBRIEFING                                                 │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 7.2 Phase 1: Familiarization

**Purpose:** Ensure participants know correct names for all pictures

**Procedure:**
1. Display each picture with its name below/beside it
2. Each picture-name pair shown for **2000 ms**
3. Cycle through all 18 pictures

```
┌─────────────────────────────────┐
│                                 │
│        [PICTURE OF LAMP]        │
│                                 │
│            "LAMP"               │
│                                 │
└─────────────────────────────────┘
        Display: 2000 ms
```

### 7.3 Phase 2: Practice Naming

**Purpose:** Verify participants can produce correct names

**Procedure:**
1. Present all 18 pictures in random order
2. Participant names each picture aloud
3. Experimenter corrects any errors verbally
4. Continue until all pictures named correctly

### 7.4 Phase 3: Instructions

**Display instructions on screen AND have experimenter summarize verbally.**

#### Participant Instructions (Verbatim from paper):

> "Your main task is to name the pictures as soon as you can. However, you will occasionally need to try to stop your naming response and say nothing.
>
> On some trials, you will see a picture and will NOT see any word. In this case, simply name the picture.
>
> On other trials, the name of the picture will appear shortly after the picture appears. In this case, you should also name the picture.
>
> On the remaining trials, you will see the picture and then see a word that is NOT the picture name. In this case, you should try to stop your naming response and say nothing.
>
> **IMPORTANT:** It is very important to name the pictures quickly, and NOT wait to see if a word appears before starting to name the picture."

### 7.5 Phase 4: Practice Trials

**72 practice trials:**
- 27 go trials (37.5%)
- 27 go-signal trials (37.5%)
- 18 stop-signal trials (25%) — **unrelated words only**

**SOA:** Fixed at 200 ms (no calibration in Experiment 5)

### 7.6 Phase 5: Experimental Trials

**432 experimental trials** divided into 3 blocks of 144 trials each

**Breaks:**
- After trial 144
- After trial 288
- Self-paced; participant presses key to continue

---

## 8. RESPONSE CODING

### 8.1 Stopping Criteria

**Primary criterion (Experiment 5):**
- **Complete halt** = No production of picture name

**Alternative criterion (Experiments 1-4):**
- **Successful stop** = Maximum of 2 phonemes produced before halting

### 8.2 Coding Scheme

```
┌─────────────────────────────────────────────────────────────────┐
│                     RESPONSE CODING                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  GO / GO-SIGNAL TRIALS:                                         │
│  ├── Correct: Picture name produced                             │
│  ├── Error: Wrong name or no response                           │
│  └── RT: Voice key onset time                                   │
│                                                                 │
│  STOP-SIGNAL TRIALS:                                            │
│  ├── Successful Stop: No speech / ≤2 phonemes                   │
│  ├── Failed Stop: >2 phonemes or complete word                  │
│  └── RT (failed stops only): Voice key onset time               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 8.3 Data to Record

For each trial:
1. Trial number
2. Trial type (go / go-signal / stop-signal)
3. Picture name
4. Stop-signal word (if applicable)
5. Stop-signal condition (if applicable)
6. Voice key triggered (yes/no)
7. Voice key RT (if triggered)
8. Response produced (from audio recording)
9. Response accuracy
10. Stop success (for stop-signal trials)

---

## 9. DATA EXCLUSION

### 9.1 Participant-Level Exclusions

1. **RT outliers:** Mean go-trial RT > 2 SD from overall mean
2. **Task compliance:** Misunderstood instructions or performed incorrectly
3. **Technical issues:** Equipment malfunction

### 9.2 Trial-Level Exclusions

1. **RT outliers:** Individual trials with RT > 3 SD from participant's mean go-trial RT
2. **Naming errors:** Trials where participant produced wrong picture name
3. **Voice key errors:** Spurious voice key triggers

---

## 10. DEPENDENT VARIABLES

### 10.1 Primary Measures

| Measure | Description | Trials Used |
|---------|-------------|-------------|
| **Stopping Accuracy** | % of stop-signal trials successfully stopped | Stop-signal trials |
| **Go RT** | Mean naming latency | Go trials |
| **Go-Signal RT** | Mean naming latency | Go-signal trials |
| **Failed-Stop RT** | Mean naming latency when failed to stop | Stop-signal trials (failed) |

### 10.2 Derived Measures

**Stop-Signal Reaction Time (SSRT):**
- Estimates internal response time to stop-signal
- Calculated using the race model (Logan & Cowan, 1984)

```
SSRT Calculation:
1. Rank-order go-trial RTs
2. Find the RT at the nth percentile, where n = (1 - P(stop)) × 100
3. SSRT = RT(nth percentile) - SOA
```

---

## 11. STATISTICAL ANALYSIS

### 11.1 Primary Analysis

**2 × 2 Repeated-Measures ANOVA:**
- Factor 1: Phonological Similarity (similar / dissimilar)
- Factor 2: Semantic Similarity (similar / dissimilar)
- DV: Stopping accuracy (% successfully stopped)

### 11.2 Secondary Analyses

1. **Valence comparison:** Paired t-test comparing valent vs. neutral conditions
2. **SSRT analysis:** Same ANOVA structure as stopping accuracy
3. **RT analysis:** Same structure for failed-stop RTs

### 11.3 Random Effects

- Subjects (F1)
- Items (F2)

### 11.4 Effect Size Reporting

- 95% Confidence Intervals (repeated-measures; Loftus & Masson, 1994)

---

## 12. EXPECTED RESULTS

Based on Slevc & Ferreira (2006), Experiment 5:

```
STOPPING ACCURACY BY CONDITION:

                        Semantically Similar    Semantically Dissimilar
                        ────────────────────    ───────────────────────
Phonologically Similar       46.6%                    49.3%
Phonologically Dissimilar    62.2%                    59.6%

EFFECT SUMMARY:
├── Phonological Similarity: SIGNIFICANT (p < .001)
├── Semantic Similarity: NOT SIGNIFICANT
└── Interaction: Marginal (p = .05 by subjects)

VALENCE COMPARISON:
├── Emotionally Valent: 65.2% stopped
└── Neutral Control: 58.8% stopped
└── Difference: SIGNIFICANT (p < .01)
```

---

## 13. EQUIPMENT SETUP CHECKLIST

```
□ Computer with experiment software installed
□ Monitor positioned at appropriate viewing distance (~60 cm)
□ Head-worn microphone
□ Voice key device connected and calibrated
□ Audio recording system (backup)
□ Response verification system
□ Stimulus files loaded and verified
□ Trial randomization confirmed
□ Timing verified with external measurement
□ Participant consent forms ready
□ Data recording templates prepared
```

---

## 14. EXPERIMENTER SCRIPT

### Before Participant Arrives
1. Test voice key sensitivity
2. Verify all stimuli display correctly
3. Check audio recording

### Participant Arrival
1. Greet participant, explain general purpose
2. Obtain informed consent
3. Calibrate microphone for individual participant

### During Familiarization
> "First, I'll show you all the pictures you'll be naming today, along with their names. Please look at each one carefully."

### During Practice Naming
> "Now please name each picture out loud. I'll let you know if you use a different name than we're looking for."

### Before Practice Trials
> "Now we'll do some practice trials. Remember: name the pictures as quickly as you can, but if you see a word that doesn't match the picture, try to stop yourself from speaking."

### Before Experimental Trials
> "Great, you've got the hang of it. Now we'll start the main experiment. There will be two short breaks. Any questions?"

### At Breaks
> "Take a moment to rest. Press any key when you're ready to continue."

### After Experiment
> "That's the end of the experiment. Do you have any questions about what we were studying?"

---

## 15. TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| Voice key too sensitive | Increase threshold; ensure quiet environment |
| Voice key not triggering | Lower threshold; check microphone position |
| Participant waiting for signals | Re-emphasize speed instructions |
| Participant stopping on go-signals | Clarify matching vs. non-matching |
| Too many/few stops overall | Check trial randomization |

---

## 16. REFERENCES

- Logan, G. D., & Cowan, W. B. (1984). On the ability to inhibit thought and action: A theory of an act of control. *Psychological Review, 91*, 295-327.
- Loftus, G. R., & Masson, M. E. J. (1994). Using confidence intervals in within-subject designs. *Psychonomic Bulletin & Review, 1*, 476-490.
- Slevc, L. R., & Ferreira, V. S. (2006). Halting in single word production: A test of the perceptual loop theory of speech monitoring. *Journal of Memory and Language, 54*, 515-540.
- Snodgrass, J. G., & Vanderwart, M. (1980). A standardized set of 260 pictures: Norms for name agreement, image agreement, familiarity, and visual complexity. *Journal of Experimental Psychology: Human Learning & Memory, 6*, 174-215.

---

## APPENDIX: TIMING VERIFICATION

To verify timing accuracy, use photodiode or external timing measurement to confirm:

1. **SOA accuracy:** Word appears exactly 200 ms after picture
2. **Word duration:** Word displayed for exactly 200 ms
3. **Voice key latency:** Minimal delay between speech onset and trigger
4. **Frame rate:** Display refresh rate appropriate for timing precision

```
Recommended verification procedure:
1. Run 100 test trials with photodiode on screen
2. Measure actual SOA and word duration
3. Accept if within ±5 ms of target
4. Adjust software timing if necessary
```
