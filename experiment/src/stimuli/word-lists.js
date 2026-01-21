/**
 * Word lists for the Inner Speech Stop-Signal experiment
 * Based on Slevc & Ferreira (2006) Experiment 5 protocol
 */

// All 18 picture names used in the experiment
export const PICTURES = [
  "apple", "basket", "bee", "bread", "camel", "carrot",
  "duck", "elephant", "fly", "lamp", "peanut", "rabbit",
  "snake", "spoon", "squirrel", "train", "truck", "trumpet"
];

// Stop-signal word conditions
export const STOP_SIGNAL_CONDITIONS = [
  "phon_sem",   // Phonologically + semantically related
  "phon_only",  // Phonologically related only
  "sem_only",   // Semantically related only
  "unrelated",  // Unrelated control
  "valent",     // Emotionally valent
  "neutral"     // Neutral control
];

// Complete word lists for each picture
// Structure: picture -> { condition -> word }
export const WORD_LISTS = {
  apple: {
    match: "APPLE",
    phon_sem: "APRICOT",
    phon_only: "APATHY",
    sem_only: "PEACH",
    unrelated: "COUCH",
    valent: "TSUNAMI",
    neutral: "SUMMARY"
  },
  basket: {
    match: "BASKET",
    phon_sem: "BAG",
    phon_only: "BAN",
    sem_only: "CRIB",
    unrelated: "THIRST",
    valent: "MURDER",
    neutral: "AGREED"
  },
  bee: {
    match: "BEE",
    phon_sem: "BEETLE",
    phon_only: "BEACON",
    sem_only: "SPIDER",
    unrelated: "FLAG",
    valent: "POLIO",
    neutral: "CURIO"
  },
  bread: {
    match: "BREAD",
    phon_sem: "BRAN",
    phon_only: "BRICK",
    sem_only: "DONUT",
    unrelated: "NAIL",
    valent: "CANCER",
    neutral: "MILLER"
  },
  camel: {
    match: "CAMEL",
    phon_sem: "CALF",
    phon_only: "CASH",
    sem_only: "PIG",
    unrelated: "BUCKET",
    valent: "SEX",
    neutral: "ADD"
  },
  carrot: {
    match: "CARROT",
    phon_sem: "CABBAGE",
    phon_only: "CAST",
    sem_only: "SPINACH",
    unrelated: "EVENING",
    valent: "DEATH",
    neutral: "FIELD"
  },
  duck: {
    match: "DUCK",
    phon_sem: "DOVE",
    phon_only: "DUB",
    sem_only: "RAVEN",
    unrelated: "BRASS",
    valent: "TORNADO",
    neutral: "PIVOTAL"
  },
  elephant: {
    match: "ELEPHANT",
    phon_sem: "ELK",
    phon_only: "ELM",
    sem_only: "MOOSE",
    unrelated: "STRIPE",
    valent: "BOMB",
    neutral: "MOOD"
  },
  fly: {
    match: "FLY",
    phon_sem: "FLEA",
    phon_only: "FLU",
    sem_only: "MOTH",
    unrelated: "RAKE",
    valent: "SCREAM",
    neutral: "THREAD"
  },
  lamp: {
    match: "LAMP",
    phon_sem: "LANTERN",
    phon_only: "LANDING",
    sem_only: "CANDLE",
    unrelated: "PACKAGE",
    valent: "DECEIT",
    neutral: "TOKENS"
  },
  peanut: {
    match: "PEANUT",
    phon_sem: "PECAN",
    phon_only: "PIANO",
    sem_only: "ALMOND",
    unrelated: "DRESS",
    valent: "HORROR",
    neutral: "MARBLE"
  },
  rabbit: {
    match: "RABBIT",
    phon_sem: "RAT",
    phon_only: "RAFT",
    sem_only: "BEAVER",
    unrelated: "COFFEE",
    valent: "KNIFE",
    neutral: "LOOKS"
  },
  snake: {
    match: "SNAKE",
    phon_sem: "SNAIL",
    phon_only: "SNACK",
    sem_only: "EEL",
    unrelated: "FIRE",
    valent: "FAMINE",
    neutral: "DIGEST"
  },
  spoon: {
    match: "SPOON",
    phon_sem: "SPATULA",
    phon_only: "SPARKLE",
    sem_only: "LADLE",
    unrelated: "CABLE",
    valent: "DANGER",
    neutral: "WONDER"
  },
  squirrel: {
    match: "SQUIRREL",
    phon_sem: "SKUNK",
    phon_only: "SKATE",
    sem_only: "MOLE",
    unrelated: "CHAIN",
    valent: "DOOM",
    neutral: "TOAD"
  },
  train: {
    match: "TRAIN",
    phon_sem: "TROLLEY",
    phon_only: "TROPHY",
    sem_only: "BUS",
    unrelated: "FOX",
    valent: "GUN",
    neutral: "LOT"
  },
  truck: {
    match: "TRUCK",
    phon_sem: "TRACTOR",
    phon_only: "TRAP",
    sem_only: "JEEP",
    unrelated: "CELERY",
    valent: "AIDS",
    neutral: "BEEF"
  },
  trumpet: {
    match: "TRUMPET",
    phon_sem: "TROMBONE",
    phon_only: "TRAFFIC",
    sem_only: "HORN",
    unrelated: "CORNER",
    valent: "DISEASE",
    neutral: "SPEAKER"
  }
};

/**
 * Get the image path for a picture
 * @param {string} picture - Picture name
 * @returns {string} Path to image file
 */
export function getImagePath(picture) {
  return `assets/images/${picture}.png`;
}

/**
 * Get all images paths for preloading
 * @returns {string[]} Array of image paths
 */
export function getAllImagePaths() {
  return PICTURES.map(pic => getImagePath(pic));
}
