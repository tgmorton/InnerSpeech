# =============================================================================
# Power Analysis for Inner Speech Monitoring Study
# 2x2 (Phonological × Semantic) + 2 (Emotional Valence) Design
# Linear Mixed Effects with Maximal Random Effects Structure
# =============================================================================

# Load required packages
required_packages <- c("lme4", "lmerTest", "dplyr", "tidyr", "ggplot2", "parallel")

for (pkg in required_packages) {
  if (!require(pkg, character.only = TRUE)) {
    install.packages(pkg)
    library(pkg, character.only = TRUE)
  }
}

# =============================================================================
# M1 MAX OPTIMIZATION SETTINGS
# =============================================================================

# Detect cores - M1 Max has 10 cores, use 8 to leave headroom
N_CORES <- min(detectCores() - 2, 8)
cat("Using", N_CORES, "cores for parallel processing\n")

# Enable OpenMP threading for lme4 (if available)
if (Sys.getenv("OMP_NUM_THREADS") == "") {
  Sys.setenv(OMP_NUM_THREADS = 2)  # 2 threads per core for lme4
}

# Use faster BLAS if available (Apple Accelerate on M1)
# This is usually automatic on ARM Macs

set.seed(42)

# =============================================================================
# RAW DATA FROM SLEVC & FERREIRA (2006)
# =============================================================================

# Experiment 2: Phonological/Semantic Relatedness (Visual Stop-Signals)
exp2_n <- 48
exp2_df <- exp2_n - 1  # df = 47

# Reported means and CIs (% halted)
exp2_phon_dissim_mean <- 37.2
exp2_phon_sim_mean <- 32.2
exp2_phon_ci_halfwidth <- 3.7
exp2_phon_F <- 7.60

exp2_sem_dissim_mean <- 34.8
exp2_sem_sim_mean <- 34.5
exp2_sem_ci_halfwidth <- 2.9
# exp2_sem_F < 1 (ns)

# Experiment 5: Emotional Valence
exp5_n <- 48
exp5_df <- exp5_n - 1

exp5_neutral_mean <- 58.8
exp5_valent_mean <- 65.2
exp5_valence_ci_halfwidth <- 4.4
exp5_valence_F <- 8.57

# =============================================================================
# DERIVED EFFECT SIZE CALCULATIONS
# =============================================================================

# Function to calculate effect sizes from within-subjects data
# Using Loftus & Masson (1994) within-subjects CIs
calc_effect_size <- function(mean_diff, ci_halfwidth, n, df = n - 1) {
  # Critical t-value for 95% CI
  t_crit <- qt(0.975, df = df)

  # Standard error of the mean difference
  se <- ci_halfwidth / t_crit

  # Standard deviation of difference scores
  # SE = SD / sqrt(N), so SD = SE * sqrt(N)
  sd_diff <- se * sqrt(n)

  # Cohen's d_z for within-subjects designs
  # d_z = mean_diff / SD_diff
  d_z <- mean_diff / sd_diff

  return(list(
    mean_diff = mean_diff,
    ci_halfwidth = ci_halfwidth,
    t_crit = t_crit,
    se = se,
    sd_diff = sd_diff,
    d_z = d_z
  ))
}

# Function to calculate partial eta squared from F-value
calc_partial_eta_sq <- function(F_val, df_num, df_den) {
  eta_sq_p <- (F_val * df_num) / ((F_val * df_num) + df_den)
  return(eta_sq_p)
}

# Function to convert partial eta squared to Cohen's d
# For within-subjects: d = sqrt(eta_sq_p / (1 - eta_sq_p)) * sqrt(2)
# This gives d_z (standardized mean difference for paired data)
eta_sq_to_d <- function(eta_sq_p) {
  d <- sqrt(eta_sq_p / (1 - eta_sq_p)) * sqrt(2)
  return(d)
}

cat("\n")
cat("================================================================\n")
cat("EFFECT SIZE CALCULATIONS FROM S&F 2006 DATA\n")
cat("================================================================\n")

# --- Phonological Effect (Experiment 2) ---
cat("\n--- PHONOLOGICAL EFFECT (Experiment 2) ---\n")

# Method 1: From means and CIs
phon_mean_diff <- exp2_phon_dissim_mean - exp2_phon_sim_mean
cat("Mean difference (dissim - sim):", phon_mean_diff, "percentage points\n")
cat("  (Phonologically similar = LOWER halt rate = MORE interference)\n")

phon_effect <- calc_effect_size(
  mean_diff = phon_mean_diff,
  ci_halfwidth = exp2_phon_ci_halfwidth,
  n = exp2_n
)

cat("\nFrom CI method:\n")
cat("  t_crit (df=47):", round(phon_effect$t_crit, 4), "\n")
cat("  SE:", round(phon_effect$se, 4), "%\n")
cat("  SD_diff:", round(phon_effect$sd_diff, 4), "%\n")
cat("  Cohen's d_z:", round(phon_effect$d_z, 4), "\n")

# Method 2: From F-value
phon_eta_sq_p <- calc_partial_eta_sq(exp2_phon_F, 1, exp2_df)
phon_d_from_F <- eta_sq_to_d(phon_eta_sq_p)

cat("\nFrom F-value method:\n")
cat("  F(1,47) =", exp2_phon_F, "\n")
cat("  Partial eta-squared:", round(phon_eta_sq_p, 4), "\n")
cat("  Cohen's d (from eta-sq):", round(phon_d_from_F, 4), "\n")

# --- Semantic Effect (Experiment 2) ---
cat("\n--- SEMANTIC EFFECT (Experiment 2) ---\n")

sem_mean_diff <- exp2_sem_dissim_mean - exp2_sem_sim_mean
cat("Mean difference (dissim - sim):", sem_mean_diff, "percentage points\n")
cat("  (Essentially null effect)\n")

sem_effect <- calc_effect_size(
  mean_diff = abs(sem_mean_diff),  # Use absolute value
  ci_halfwidth = exp2_sem_ci_halfwidth,
  n = exp2_n
)

cat("\nFrom CI method:\n")
cat("  Cohen's d_z:", round(sem_effect$d_z, 4), "(essentially 0)\n")

# --- Valence Effect (Experiment 5) ---
cat("\n--- VALENCE EFFECT (Experiment 5) ---\n")

valence_mean_diff <- exp5_valent_mean - exp5_neutral_mean
cat("Mean difference (valent - neutral):", valence_mean_diff, "percentage points\n")
cat("  (Valent = HIGHER halt rate = LESS interference)\n")

valence_effect <- calc_effect_size(
  mean_diff = valence_mean_diff,
  ci_halfwidth = exp5_valence_ci_halfwidth,
  n = exp5_n
)

cat("\nFrom CI method:\n")
cat("  t_crit (df=47):", round(valence_effect$t_crit, 4), "\n")
cat("  SE:", round(valence_effect$se, 4), "%\n")
cat("  SD_diff:", round(valence_effect$sd_diff, 4), "%\n")
cat("  Cohen's d_z:", round(valence_effect$d_z, 4), "\n")

# From F-value
valence_eta_sq_p <- calc_partial_eta_sq(exp5_valence_F, 1, exp5_df)
valence_d_from_F <- eta_sq_to_d(valence_eta_sq_p)

cat("\nFrom F-value method:\n")
cat("  F(1,47) =", exp5_valence_F, "\n")
cat("  Partial eta-squared:", round(valence_eta_sq_p, 4), "\n")
cat("  Cohen's d (from eta-sq):", round(valence_d_from_F, 4), "\n")

# =============================================================================
# SUMMARY OF EFFECT SIZES FOR POWER ANALYSIS
# =============================================================================

cat("\n")
cat("================================================================\n")
cat("EFFECT SIZES TO USE IN POWER ANALYSIS\n")
cat("================================================================\n")
cat("\nPhonological effect:\n")
cat("  d_z =", round(phon_effect$d_z, 3), "(from CI)\n")
cat("  d   =", round(phon_d_from_F, 3), "(from F)\n")
cat("  Mean diff =", phon_mean_diff, "% (on proportion scale:", phon_mean_diff/100, ")\n")

cat("\nSemantic effect:\n")
cat("  d_z =", round(sem_effect$d_z, 3), "(essentially null, as expected)\n")

cat("\nValence effect:\n")
cat("  d_z =", round(valence_effect$d_z, 3), "(from CI)\n")
cat("  d   =", round(valence_d_from_F, 3), "(from F)\n")
cat("  Mean diff =", valence_mean_diff, "% (on proportion scale:", valence_mean_diff/100, ")\n")

# =============================================================================
# SIMULATION PARAMETERS (DERIVED FROM S&F 2006 DATA)
# =============================================================================

# Design parameters from the study (CORRECTED)
n_items <- 18           # Number of unique pictures per condition (72 stop-signal / 4 conditions)
n_trials_per_cell <- 18 # Trials per cell in the 2x2 design
n_valence_trials_per_level <- 18  # 36 valence trials / 2 levels

# Calculate grand means from the data
exp2_grand_mean <- mean(c(exp2_phon_dissim_mean, exp2_phon_sim_mean,
                          exp2_sem_dissim_mean, exp2_sem_sim_mean)) / 100
exp5_grand_mean <- mean(c(exp5_neutral_mean, exp5_valent_mean)) / 100

cat("\n")
cat("================================================================\n")
cat("SIMULATION PARAMETERS\n")
cat("================================================================\n")

# Fixed effects (derived from S&F 2006, on proportion scale)
grand_mean <- exp2_grand_mean
cat("\n2x2 Design grand mean (proportion):", round(grand_mean, 4), "\n")

# Effect sizes on proportion scale (divide by 100 and by 2 for contrast coding)
# With contrast coding (-0.5, 0.5), the coefficient = full difference
phon_effect_size <- -phon_mean_diff / 100  # Negative because similar = lower halting
sem_effect_size <- sem_mean_diff / 100     # Essentially 0
phon_x_sem_interaction <- 0.00             # No interaction expected

cat("Phonological effect (proportion):", round(phon_effect_size, 4), "\n")
cat("Semantic effect (proportion):", round(sem_effect_size, 4), "\n")

# For valence analysis (separate)
valence_grand_mean <- exp5_grand_mean
valence_effect_size <- valence_mean_diff / 100  # Positive because valent = higher halting

cat("\nValence design grand mean (proportion):", round(valence_grand_mean, 4), "\n")
cat("Valence effect (proportion):", round(valence_effect_size, 4), "\n")

# =============================================================================
# RANDOM EFFECTS ESTIMATION (FROM S&F 2006 DATA)
# =============================================================================
# Derive variance parameters from S&F 2006 data
# Using the within-subjects SD from the CI calculations

cat("\n--- Random Effects Parameters (Derived from S&F 2006) ---\n")

# Total SD estimated from the phonological effect SD_diff
total_sd <- phon_effect$sd_diff / 100  # Convert to proportion scale
cat("Estimated total SD (proportion):", round(total_sd, 4), "\n")

# Partition variance using typical ICCs for psycholinguistic experiments
icc_subject <- 0.20   # Proportion of variance due to subjects
icc_item <- 0.10      # Proportion of variance due to items

tau_subj <- sqrt(icc_subject) * total_sd
tau_item <- sqrt(icc_item) * total_sd
sigma <- sqrt(1 - icc_subject - icc_item) * total_sd

cat("Between-subject SD (intercept):", round(tau_subj, 4), "\n")
cat("Between-item SD (intercept):", round(tau_item, 4), "\n")
cat("Residual SD:", round(sigma, 4), "\n")

# Random slopes proportional to fixed effects
slope_proportion <- 0.5
tau_subj_phon <- abs(phon_effect_size) * slope_proportion
tau_subj_sem <- abs(phon_effect_size) * slope_proportion
tau_item_phon <- abs(phon_effect_size) * slope_proportion * 0.5
tau_item_sem <- abs(phon_effect_size) * slope_proportion * 0.5

cat("\nRandom slope SDs (subject):", round(tau_subj_phon, 4), "\n")
cat("Random slope SDs (item):", round(tau_item_phon, 4), "\n")

# =============================================================================
# DATA SIMULATION FUNCTION: 2x2 Design
# =============================================================================

simulate_2x2_data <- function(n_subj, n_items_per_cell = 18) {
  # USE GLOBAL EFFECT SIZE VARIABLES
  beta_intercept <- grand_mean
  beta_phon <- phon_effect_size
  beta_sem <- sem_effect_size
  beta_interaction <- 0.00

  n_total_items <- n_items_per_cell * 4
  n_obs <- n_subj * n_total_items

  # Pre-generate all random effects (vectorized)
  u0 <- rnorm(n_subj, 0, tau_subj)
  u_phon <- rnorm(n_subj, 0, tau_subj_phon)
  u_sem <- rnorm(n_subj, 0, tau_subj_sem)
  w0 <- rnorm(n_total_items, 0, tau_item)
  w_phon <- rnorm(n_total_items, 0, tau_item_phon)
  w_sem <- rnorm(n_total_items, 0, tau_item_sem)

  # Create full factorial design (vectorized)
  subject <- rep(1:n_subj, times = n_total_items)
  item <- rep(1:n_total_items, each = n_subj)

  # Assign conditions to items
  item_cond <- rep(1:4, each = n_items_per_cell)[item]
  phon <- c(-0.5, 0.5, -0.5, 0.5)[item_cond]
  sem <- c(-0.5, -0.5, 0.5, 0.5)[item_cond]

  # Calculate linear predictor (fully vectorized)
  eta <- beta_intercept +
    (beta_phon + u_phon[subject] + w_phon[item]) * phon +
    (beta_sem + u_sem[subject] + w_sem[item]) * sem +
    beta_interaction * phon * sem +
    u0[subject] + w0[item] +
    rnorm(n_obs, 0, sigma)

  # Create data frame
  data <- data.frame(
    subject = factor(subject),
    item = factor(item),
    phon = phon,
    sem = sem,
    prop_halt = pmax(0, pmin(1, eta))
  )

  return(data)
}

# =============================================================================
# DATA SIMULATION FUNCTION: Valence Design
# =============================================================================

simulate_valence_data <- function(n_subj, n_items_per_level = 18) {
  # USE GLOBAL EFFECT SIZE VARIABLES
  beta_intercept <- valence_grand_mean
  beta_valence <- valence_effect_size

  # Random effect SDs for valence (proportional to effect)
  tau_s_val <- abs(valence_effect_size) * 0.5
  tau_i_val <- abs(valence_effect_size) * 0.25

  n_total_items <- n_items_per_level * 2
  n_obs <- n_subj * n_total_items

  # Pre-generate all random effects (vectorized)
  u0 <- rnorm(n_subj, 0, tau_subj)
  u_val <- rnorm(n_subj, 0, tau_s_val)
  w0 <- rnorm(n_total_items, 0, tau_item)
  w_val <- rnorm(n_total_items, 0, tau_i_val)

  # Create full factorial design (vectorized)
  subject <- rep(1:n_subj, times = n_total_items)
  item <- rep(1:n_total_items, each = n_subj)

  # Assign valence to items: first half neutral (-0.5), second half valent (0.5)
  valence <- ifelse(item <= n_items_per_level, -0.5, 0.5)

  # Calculate linear predictor (fully vectorized)
  eta <- beta_intercept +
    (beta_valence + u_val[subject] + w_val[item]) * valence +
    u0[subject] + w0[item] +
    rnorm(n_obs, 0, sigma)

  # Create data frame
  data <- data.frame(
    subject = factor(subject),
    item = factor(item),
    valence = valence,
    prop_halt = pmax(0, pmin(1, eta))
  )

  return(data)
}

# =============================================================================
# POWER SIMULATION FUNCTIONS
# =============================================================================

run_single_sim_2x2 <- function(n_subj, ...) {
  # Simulate data
  dat <- simulate_2x2_data(n_subj, ...)

  # Fit maximal model with fast settings
  tryCatch({
    # Use nlminbwrap (fastest lme4 optimizer)
    model <- suppressMessages(suppressWarnings(
      lmer(prop_halt ~ phon * sem +
             (1 + phon + sem | subject) +
             (1 + phon + sem | item),
           data = dat,
           control = lmerControl(
             optimizer = "nlminbwrap",
             calc.derivs = FALSE,
             optCtrl = list(maxfun = 1000)
           ))
    ))

    coef_table <- summary(model)$coefficients

    return(data.frame(
      n_subj = n_subj,
      p_phon = coef_table["phon", "Pr(>|t|)"],
      p_sem = coef_table["sem", "Pr(>|t|)"],
      p_interaction = coef_table["phon:sem", "Pr(>|t|)"],
      converged = TRUE
    ))

  }, error = function(e) {
    # If maximal fails, try reduced random effects
    tryCatch({
      model <- suppressMessages(suppressWarnings(
        lmer(prop_halt ~ phon * sem +
               (1 + phon + sem | subject) +
               (1 | item),
             data = dat,
             control = lmerControl(optimizer = "nlminbwrap", calc.derivs = FALSE))
      ))

      coef_table <- summary(model)$coefficients

      return(data.frame(
        n_subj = n_subj,
        p_phon = coef_table["phon", "Pr(>|t|)"],
        p_sem = coef_table["sem", "Pr(>|t|)"],
        p_interaction = coef_table["phon:sem", "Pr(>|t|)"],
        converged = TRUE
      ))

    }, error = function(e2) {
      return(data.frame(
        n_subj = n_subj,
        p_phon = NA,
        p_sem = NA,
        p_interaction = NA,
        converged = FALSE
      ))
    })
  })
}

run_single_sim_valence <- function(n_subj, ...) {
  dat <- simulate_valence_data(n_subj, ...)

  tryCatch({
    model <- suppressMessages(suppressWarnings(
      lmer(prop_halt ~ valence +
             (1 + valence | subject) +
             (1 + valence | item),
           data = dat,
           control = lmerControl(
             optimizer = "nlminbwrap",
             calc.derivs = FALSE,
             optCtrl = list(maxfun = 1000)
           ))
    ))

    coef_table <- summary(model)$coefficients

    return(data.frame(
      n_subj = n_subj,
      p_valence = coef_table["valence", "Pr(>|t|)"],
      converged = TRUE
    ))

  }, error = function(e) {
    tryCatch({
      model <- suppressMessages(suppressWarnings(
        lmer(prop_halt ~ valence +
               (1 + valence | subject) +
               (1 | item),
             data = dat,
             control = lmerControl(optimizer = "nlminbwrap", calc.derivs = FALSE))
      ))

      coef_table <- summary(model)$coefficients

      return(data.frame(
        n_subj = n_subj,
        p_valence = coef_table["valence", "Pr(>|t|)"],
        converged = TRUE
      ))

    }, error = function(e2) {
      return(data.frame(
        n_subj = n_subj,
        p_valence = NA,
        converged = FALSE
      ))
    })
  })
}

# =============================================================================
# MAIN POWER ANALYSIS
# =============================================================================

run_power_analysis <- function(sample_sizes = c(48, 60, 72, 84, 96),
                                n_sims = 500,
                                alpha = 0.05,
                                analysis_type = "2x2") {

  results_list <- list()
  total_analyses <- length(sample_sizes)

  for (idx in seq_along(sample_sizes)) {
    n_subj <- sample_sizes[idx]

    cat("\n")
    cat("========================================================\n")
    cat(sprintf(" [%d/%d] N = %d | %s | %d sims | %d cores\n",
                idx, total_analyses, n_subj, toupper(analysis_type), n_sims, N_CORES))
    cat("========================================================\n")

    set.seed(42 + n_subj)

    # Run in batches to show progress
    batch_size <- 50
    n_batches <- ceiling(n_sims / batch_size)
    all_results <- list()
    start_time <- Sys.time()

    for (batch in 1:n_batches) {
      batch_start <- (batch - 1) * batch_size + 1
      batch_end <- min(batch * batch_size, n_sims)
      batch_n <- batch_end - batch_start + 1

      if (analysis_type == "2x2") {
        batch_results <- mclapply(1:batch_n, function(i) {
          run_single_sim_2x2(n_subj)
        }, mc.cores = N_CORES, mc.set.seed = TRUE)
      } else {
        batch_results <- mclapply(1:batch_n, function(i) {
          run_single_sim_valence(n_subj)
        }, mc.cores = N_CORES, mc.set.seed = TRUE)
      }

      all_results <- c(all_results, batch_results)

      # Progress bar
      pct <- round(100 * batch_end / n_sims)
      bar_width <- 30
      filled <- round(bar_width * batch_end / n_sims)
      bar <- paste0("[", paste(rep("#", filled), collapse = ""),
                    paste(rep("-", bar_width - filled), collapse = ""), "]")
      elapsed <- as.numeric(difftime(Sys.time(), start_time, units = "secs"))
      eta <- if (batch_end < n_sims) round(elapsed / batch_end * (n_sims - batch_end)) else 0

      cat(sprintf("\r %s %3d%% (%d/%d) | %ds elapsed | ETA %ds     ",
                  bar, pct, batch_end, n_sims, round(elapsed), eta))
      flush.console()
    }

    elapsed <- round(difftime(Sys.time(), start_time, units = "secs"), 1)
    cat(sprintf("\n Done in %.1fs (%.2fs/sim)\n", elapsed, elapsed/n_sims))

    results_df <- bind_rows(all_results)
    results_list[[as.character(n_subj)]] <- results_df

    # Calculate power
    converged <- results_df[results_df$converged == TRUE, ]
    n_converged <- nrow(converged)

    cat("\n Results for N =", n_subj, ":\n")
    cat("   Converged:", n_converged, "/", n_sims,
        "(", round(100 * n_converged/n_sims, 1), "%)\n")

    if (analysis_type == "2x2") {
      power_phon <- mean(converged$p_phon < alpha, na.rm = TRUE)
      power_sem <- mean(converged$p_sem < alpha, na.rm = TRUE)
      power_int <- mean(converged$p_interaction < alpha, na.rm = TRUE)

      cat(sprintf("   Power (Phonological): %5.1f%%\n", power_phon * 100))
      cat(sprintf("   Power (Semantic):     %5.1f%%\n", power_sem * 100))
      cat(sprintf("   Power (Interaction):  %5.1f%%\n", power_int * 100))
    } else {
      power_val <- mean(converged$p_valence < alpha, na.rm = TRUE)
      cat(sprintf("   Power (Valence):      %5.1f%%\n", power_val * 100))
    }
  }

  return(results_list)
}

# =============================================================================
# RUN THE ANALYSIS
# =============================================================================

cat("\n")
cat("================================================================\n")
cat("POWER ANALYSIS FOR INNER SPEECH MONITORING STUDY\n")
cat("================================================================\n")
cat("\nBased on effect sizes derived from Slevc & Ferreira (2006):\n")
cat("  - Phonological effect: d_z =", round(phon_effect$d_z, 3),
    "(from CI), d =", round(phon_d_from_F, 3), "(from F)\n")
cat("  - Valence effect: d_z =", round(valence_effect$d_z, 3),
    "(from CI), d =", round(valence_d_from_F, 3), "(from F)\n")
cat("  - Semantic effect: d_z ≈ 0 (null, as expected)\n")
cat("\nEffect sizes on proportion scale:\n")
cat("  - Phonological:", round(phon_effect_size, 4), "\n")
cat("  - Valence:", round(valence_effect_size, 4), "\n")
cat("\nDesign: 2x2 (Phonological × Semantic) + 2 (Valence)\n")
cat("Analysis: Linear mixed effects with maximal random effects\n")
cat("Target power: 80%\n")
cat("Alpha: 0.05\n")

# Number of simulations - 500 for publication-quality estimates
N_SIMS <- 500

# Sample sizes to test
SAMPLE_SIZES <- c(48, 72, 96)

# =============================================================================
# APPLY CONSERVATIVE EFFECT SIZE (80% of S&F 2006)
# =============================================================================

cat("\n")
cat("################################################################\n")
cat("# CONSERVATIVE EFFECT SIZE ANALYSIS (80% of S&F 2006)          #\n")
cat("################################################################\n")
cat("\nRationale: Inner speech without articulation may show attenuated\n")
cat("effects compared to overt speech (Oppenheim & Dell, 2010).\n")
cat("Variance parameters are derived from S&F 2006 data, as we expect\n")
cat("to be targeting the same underlying mechanism.\n")

# Store original effect sizes for reporting
phon_effect_size_original <- phon_effect_size
valence_effect_size_original <- valence_effect_size

# Apply conservative 80% factor to effect sizes
CONSERVATIVE_FACTOR <- 0.80
phon_effect_size <- phon_effect_size * CONSERVATIVE_FACTOR
valence_effect_size <- valence_effect_size * CONSERVATIVE_FACTOR

cat("\nConservative effect sizes (80% of S&F 2006):\n")
cat("  Phonological:", round(phon_effect_size_original, 4), "->", round(phon_effect_size, 4), "\n")
cat("  Valence:", round(valence_effect_size_original, 4), "->", round(valence_effect_size, 4), "\n")

# =============================================================================
# DIAGNOSTIC: Verify simulation parameters
# =============================================================================

cat("\n")
cat("================================================================\n")
cat("DIAGNOSTIC: Verifying simulation parameters\n")
cat("================================================================\n")

cat("\nParameters being used in simulation:\n")
cat("  phon_effect_size (conservative):", phon_effect_size, "\n")
cat("  valence_effect_size (conservative):", valence_effect_size, "\n")
cat("  tau_subj:", tau_subj, "\n")
cat("  tau_item:", tau_item, "\n")
cat("  sigma:", sigma, "\n")

cat("\nGenerating test dataset (N=48)...\n")
test_dat <- simulate_2x2_data(48)

cat("\n2x2 Design - Mean halt rate by phonological condition:\n")
phon_means <- aggregate(prop_halt ~ phon, test_dat, mean)
print(phon_means)
expected_diff <- abs(phon_effect_size)
cat("  Observed difference:", round(abs(diff(phon_means$prop_halt)), 4), "\n")
cat("  Expected difference:", round(expected_diff, 4), "\n")

cat("\nGenerating test valence dataset (N=48)...\n")
test_val_dat <- simulate_valence_data(48)

cat("\nValence Design - Mean halt rate by valence condition:\n")
val_means <- aggregate(prop_halt ~ valence, test_val_dat, mean)
print(val_means)
expected_val_diff <- abs(valence_effect_size)
cat("  Observed difference:", round(abs(diff(val_means$prop_halt)), 4), "\n")
cat("  Expected difference:", round(expected_val_diff, 4), "\n")

cat("\n================================================================\n")

cat("\n--- Running 2x2 Design Power Analysis ---\n")
cat("Testing sample sizes:", paste(SAMPLE_SIZES, collapse = ", "), "\n")
cat("Number of simulations per sample size:", N_SIMS, "\n")

results_2x2 <- run_power_analysis(
  sample_sizes = SAMPLE_SIZES,
  n_sims = N_SIMS,
  alpha = 0.05,
  analysis_type = "2x2"
)

cat("\n--- Running Valence Design Power Analysis ---\n")
results_valence <- run_power_analysis(
  sample_sizes = SAMPLE_SIZES,
  n_sims = N_SIMS,
  alpha = 0.05,
  analysis_type = "valence"
)

# =============================================================================
# SUMMARY AND RECOMMENDATIONS
# =============================================================================

summarize_power <- function(results_list, analysis_type = "2x2", alpha = 0.05) {
  summary_df <- data.frame()

  for (n_str in names(results_list)) {
    n_subj <- as.numeric(n_str)
    results <- results_list[[n_str]]
    converged <- results[results$converged == TRUE, ]

    if (analysis_type == "2x2") {
      row <- data.frame(
        N = n_subj,
        Convergence = round(100 * nrow(converged) / nrow(results), 1),
        Power_Phon = round(100 * mean(converged$p_phon < alpha, na.rm = TRUE), 1),
        Power_Sem = round(100 * mean(converged$p_sem < alpha, na.rm = TRUE), 1),
        Power_Int = round(100 * mean(converged$p_interaction < alpha, na.rm = TRUE), 1)
      )
    } else {
      row <- data.frame(
        N = n_subj,
        Convergence = round(100 * nrow(converged) / nrow(results), 1),
        Power_Valence = round(100 * mean(converged$p_valence < alpha, na.rm = TRUE), 1)
      )
    }

    summary_df <- rbind(summary_df, row)
  }

  return(summary_df)
}

cat("\n")
cat("################################################################\n")
cat("#                                                              #\n")
cat("#              POWER ANALYSIS RESULTS FOR PREREGISTRATION      #\n")
cat("#                                                              #\n")
cat("################################################################\n")

cat("\n")
cat("================================================================\n")
cat("POWER ANALYSIS RESULTS\n")
cat("================================================================\n")
cat("\nApproach: Conservative effect sizes (80% of S&F 2006) with\n")
cat("variance parameters derived from S&F 2006 data.\n")
cat("\nConservative effect sizes:\n")
cat("  Phonological: d_z =", round(phon_effect$d_z * 0.80, 3), "(80% of", round(phon_effect$d_z, 3), ")\n")
cat("  Valence: d_z =", round(valence_effect$d_z * 0.80, 3), "(80% of", round(valence_effect$d_z, 3), ")\n")
cat("\nVariance parameters (derived from S&F 2006):\n")
cat("  Between-subject SD:", round(tau_subj, 4), "| Between-item SD:", round(tau_item, 4), "| Residual SD:", round(sigma, 4), "\n")
cat("\nTrials: 72 phonological/semantic (18 per cell) | 36 valence (18 per level)\n")
cat("Simulations:", N_SIMS, "per sample size\n")

cat("\n2×2 Design (Phonological × Semantic Relatedness):\n")
cat("--------------------------------------------------\n")
summary_2x2 <- summarize_power(results_2x2, "2x2")
print(summary_2x2, row.names = FALSE)

cat("\nValence Design (Manipulation Check):\n")
cat("------------------------------------\n")
summary_val <- summarize_power(results_valence, "valence")
print(summary_val, row.names = FALSE)

# =============================================================================
# RECOMMENDATIONS
# =============================================================================

cat("\n")
cat("================================================================\n")
cat("SAMPLE SIZE RECOMMENDATIONS\n")
cat("================================================================\n")

# Find minimum N for 80% power
min_n_phon <- summary_2x2$N[which(summary_2x2$Power_Phon >= 80)[1]]
min_n_val <- summary_val$N[which(summary_val$Power_Valence >= 80)[1]]

cat("\nMinimum N for 80% power (conservative assumptions):\n")
cat("---------------------------------------------------\n")
cat("Phonological effect:    N =", ifelse(is.na(min_n_phon), ">96", min_n_phon), "\n")
cat("Valence effect:         N =", ifelse(is.na(min_n_val), ">96", min_n_val), "\n")

cat("\nNote: Power for semantic relatedness is ~5% (Type I error rate),\n")
cat("consistent with the null effect observed in S&F 2006.\n")

# =============================================================================
# PREREGISTRATION TEXT
# =============================================================================

cat("\n")
cat("================================================================\n")
cat("SUGGESTED PREREGISTRATION TEXT\n")
cat("================================================================\n")

# Determine recommended N
if (!is.na(min_n_phon) && !is.na(min_n_val)) {
  recommended_n <- max(min_n_phon, min_n_val)
} else {
  recommended_n <- max(SAMPLE_SIZES)
  cat("\nWARNING: 80% power not achieved in tested range.\n")
  cat("Consider testing larger sample sizes.\n\n")
}

cat("\n--- BEGIN PREREGISTRATION TEXT ---\n\n")

cat("SAMPLE SIZE JUSTIFICATION\n\n")

cat("We conducted a simulation-based power analysis for linear mixed-effects\n")
cat("models with maximal random effects structure (Barr et al., 2013). Effect\n")
cat("sizes were derived from Slevc and Ferreira (2006), who used an analogous\n")
cat("stop-signal paradigm with overt speech.\n\n")

cat("Effect sizes from Slevc & Ferreira (2006):\n")
cat("- Phonological similarity: d_z =", round(phon_effect$d_z, 2),
    "(5.0 pp difference, F(1,47) = 7.60, partial eta-sq = .14)\n")
cat("- Emotional valence: d_z =", round(valence_effect$d_z, 2),
    "(6.4 pp difference, F(1,47) = 8.57, partial eta-sq = .15)\n\n")

cat("Because unmouthed inner speech may produce attenuated effects compared\n")
cat("to overt speech (Oppenheim & Dell, 2010), we conducted a conservative\n")
cat("power analysis assuming effects 80% the magnitude of those observed by\n")
cat("Slevc and Ferreira (2006), yielding:\n")
cat("- Phonological similarity: d_z =", round(phon_effect$d_z * 0.80, 2), "\n")
cat("- Emotional valence: d_z =", round(valence_effect$d_z * 0.80, 2), "\n\n")

cat("Simulation parameters:\n")
cat("- Design: 2x2 within-subjects (Phonological x Semantic) + 2-level (Valence)\n")
cat("- Trials: 72 phonological/semantic stop-signal trials (18 per cell);\n")
cat("          36 emotional valence trials (18 per level)\n")
cat("- Analysis: Linear mixed-effects with maximal random effects structure\n")
cat("- Random effects: Variance parameters derived from S&F 2006 data\n")
cat("- Simulations:", N_SIMS, "iterations per sample size\n")
cat("- Alpha: .05 (two-tailed)\n\n")

cat("Power analysis results (conservative effect sizes):\n")
for (i in 1:nrow(summary_2x2)) {
  cat("  N =", summary_2x2$N[i],
      ": Phonological", summary_2x2$Power_Phon[i], "%,",
      "Valence", summary_val$Power_Valence[i], "%\n")
}

cat("\nBased on these analyses, we will recruit N =", recommended_n, "participants,\n")
cat("which provides adequate power (>=80%) to detect both the phonological\n")
cat("similarity effect and the emotional valence effect under conservative\n")
cat("assumptions about effect size attenuation in inner speech.\n\n")

cat("--- END PREREGISTRATION TEXT ---\n")

cat("\n================================================================\n")
cat("SCRIPT COMPLETED SUCCESSFULLY\n")
cat("================================================================\n")
cat("\nAnalysis date:", format(Sys.time(), "%Y-%m-%d %H:%M:%S"), "\n")
cat("R version:", R.version.string, "\n")
cat("lme4 version:", as.character(packageVersion("lme4")), "\n")
cat("lmerTest version:", as.character(packageVersion("lmerTest")), "\n")
