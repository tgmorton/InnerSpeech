# Inner Speech Stop-Signal Picture Naming Experiment - Implementation Plan

## Overview

Implement Slevc & Ferreira (2006) Experiment 5 adapted for **inner speech**:
- Participants name pictures **silently in their head** (no lip/mouth movement)
- Press **SPACEBAR** when they begin internal naming (replaces voice-key)
- Stop-signal trials: withhold response when non-matching word appears

---

## Phase 1: Stimulus Preparation

### 1.1 Image Files
- **Source**: 18 BMP files from `/Users/thomasmorton/InnerSpeech/images/`
- **Conversion**: Convert BMP → PNG and copy to `/experiment/assets/images/`
- **Naming**: Rename to `apple.png`, `basket.png`, etc. for clarity

**Image Mappings (BMP file → picture name)**:
| Picture | File | Picture | File |
|---------|------|---------|------|
| apple | 006 .bmp | lamp | 132 .bmp |
| basket | 020 .bmp | peanut | 165 .bmp |
| bee | 023 .bmp | rabbit | 182 .bmp |
| bread | 036 .bmp | snake | 209 .bmp |
| camel | 043 .bmp | spoon | 215 .bmp |
| carrot | 048 .bmp | squirrel | 216 .bmp |
| duck | 081 .bmp | train | 240 .bmp |
| elephant | 084 .bmp | truck | 242 .bmp |
| fly | 093 .bmp | trumpet | 243 .bmp |

### 1.2 Create Stimulus CSV (`/experiment/assets/stimuli.csv`)

Structure:
```csv
picture,trial_type,signal_word,signal_condition
apple,go,,
apple,go_signal,APPLE,
apple,stop_signal,APRICOT,phon_sem
apple,stop_signal,APATHY,phon_only
apple,stop_signal,PEACH,sem_only
apple,stop_signal,COUCH,unrelated
apple,stop_signal,TSUNAMI,valent
apple,stop_signal,SUMMARY,neutral
...
```

Word lists from protocol (Section 4.2.2 and 4.2.3):
| Picture | Phon+Sem | Phon Only | Sem Only | Unrelated | Valent | Neutral |
|---------|----------|-----------|----------|-----------|--------|---------|
| apple | apricot | apathy | peach | couch | tsunami | summary |
| basket | bag | ban | crib | thirst | murder | agreed |
| bee | beetle | beacon | spider | flag | polio | curio |
| bread | bran | brick | donut | nail | cancer | miller |
| camel | calf | cash | pig | bucket | sex | add |
| carrot | cabbage | cast | spinach | evening | death | field |
| duck | dove | dub | raven | brass | tornado | pivotal |
| elephant | elk | elm | moose | stripe | bomb | mood |
| fly | flea | flu | moth | rake | scream | thread |
| lamp | lantern | landing | candle | package | deceit | tokens |
| peanut | pecan | piano | almond | dress | horror | marble |
| rabbit | rat | raft | beaver | coffee | knife | looks |
| snake | snail | snack | eel | fire | famine | digest |
| spoon | spatula | sparkle | ladle | cable | danger | wonder |
| squirrel | skunk | skate | mole | chain | doom | toad |
| train | trolley | trophy | bus | fox | gun | lot |
| truck | tractor | trap | jeep | celery | AIDS | beef |
| trumpet | trombone | traffic | horn | corner | disease | speaker |

---

## Phase 2: Plugin & Dependencies

### 2.1 Install Additional Plugin
```bash
npm install @jspsych/plugin-image-keyboard-response
```

### 2.2 Create Custom Plugin: `stop-signal-trial`

**File**: `/experiment/src/plugins/stop-signal-trial.js`

**Why custom?** Standard plugins can't handle:
- Picture + word overlay (not replacement)
- SOA timing (word 200ms after picture)
- Word → mask transition (200ms)
- RT measured from picture onset

**Parameters**:
- `image`: path to picture
- `trial_type`: 'go' | 'go_signal' | 'stop_signal'
- `signal_word`: word to display (null for go trials)
- `soa`: 200ms
- `word_duration`: 200ms
- `mask`: "XXXXXXX"
- `trial_duration`: 2000ms
- `response_key`: ' ' (spacebar)

**Trial Flow**:
1. Show picture immediately
2. Start listening for spacebar (RT from picture onset)
3. If signal trial: show word at SOA, replace with mask after word_duration
4. End on response or timeout

---

## Phase 3: Experiment Structure

### 3.1 File Organization
```
experiment/
├── src/
│   ├── experiment.js          # Main experiment
│   ├── plugins/
│   │   └── stop-signal-trial.js
│   └── stimuli/
│       ├── word-lists.js      # Stop-signal words
│       └── trial-generator.js # Trial generation & randomization
├── assets/
│   ├── images/                # 18 PNG images
│   └── stimuli.csv            # Trial definitions
└── styles/
    └── main.scss
```

### 3.2 Experiment Phases (in order)

| Phase | Description | Trials |
|-------|-------------|--------|
| 1. Welcome | Title screen | 1 |
| 2. Fullscreen | Enter fullscreen mode | 1 |
| 3. Familiarization | Show each picture with name (2000ms each) | 18 |
| 4. Practice Naming | Name pictures silently, press spacebar | 18 |
| 5. Instructions | Detailed task instructions (multi-page) | ~5 |
| 6. Practice Trials | Go/go-signal/stop-signal (unrelated only) | 72 |
| 7. Block 1 | Experimental trials | 144 |
| 8. Break 1 | Self-paced break | 1 |
| 9. Block 2 | Experimental trials | 144 |
| 10. Break 2 | Self-paced break | 1 |
| 11. Block 3 | Experimental trials | 144 |
| 12. Debriefing | Thank you screen | 1 |

### 3.3 Trial Timing (per trial)
```
[Trial number]     500ms
[Fixation +]       500ms
[Picture]          ← RT measured from here
  └─ [Word]        appears at +200ms (SOA), lasts 200ms
  └─ [XXXXXXX]     mask replaces word
[Response/Timeout] max 2000ms from picture onset
```

### 3.4 Trial Counts

**Practice (72 trials)**:
- 27 go trials (37.5%)
- 27 go-signal trials (37.5%)
- 18 stop-signal trials (25%) - unrelated words only

**Experimental (432 trials)**:
- 162 go trials (37.5%) - each picture 9×
- 162 go-signal trials (37.5%) - each picture 9×
- 108 stop-signal trials (25%) - each picture 6× (1 per condition)

### 3.5 Randomization Constraint
No more than 2 consecutive stop-signal trials.

---

## Phase 4: Styling

**File**: `/experiment/styles/main.scss`

Key styles needed:
- Picture: ~300×300px, centered
- Word overlay: centered on picture, uppercase Helvetica bold, white background
- Fixation: large + symbol
- Trial number: smaller gray text

---

## Phase 5: Data Recording

### Variables per trial:
| Variable | Description |
|----------|-------------|
| `participant_id` | Unique ID |
| `trial_index` | Global trial number |
| `block` | Block number (1-3) |
| `phase` | 'practice' or 'experimental' |
| `picture` | Picture name |
| `trial_type` | 'go', 'go_signal', 'stop_signal' |
| `signal_word` | Word shown (null for go) |
| `signal_condition` | Condition (null for go/go_signal) |
| `rt` | Reaction time (ms from picture onset) |
| `responded` | Boolean |

### Output:
CSV file saved locally: `innerspeech_{participant}_{timestamp}.csv`

---

## Implementation Steps

1. **User provides image mappings** (picture name → BMP file number)
2. **Convert & copy images** to `/experiment/assets/images/`
3. **Create stimuli.csv** with all trial definitions
4. **Install dependencies**: `npm install @jspsych/plugin-image-keyboard-response`
5. **Create custom plugin**: `/src/plugins/stop-signal-trial.js`
6. **Create helper modules**: word-lists.js, trial-generator.js
7. **Implement experiment.js** with all phases
8. **Add CSS styles** for trial display
9. **Test locally**: `npm start`
10. **Verify timing and data output**

---

## Verification

1. **Run `npm start`** - experiment should load in browser
2. **Complete full run** through all phases
3. **Check CSV output** - all variables recorded correctly
4. **Verify timing** - use browser devtools to check SOA/word duration
5. **Check randomization** - no more than 2 consecutive stop-signal trials

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `/experiment/package.json` | Add image-keyboard-response plugin |
| `/experiment/src/experiment.js` | Complete rewrite with all phases |
| `/experiment/src/plugins/stop-signal-trial.js` | Create custom plugin |
| `/experiment/src/stimuli/word-lists.js` | Create word definitions |
| `/experiment/src/stimuli/trial-generator.js` | Create trial generation logic |
| `/experiment/styles/main.scss` | Add trial display styles |
| `/experiment/assets/images/*.png` | Copy converted images |
| `/experiment/assets/stimuli.csv` | Create trial definitions |
