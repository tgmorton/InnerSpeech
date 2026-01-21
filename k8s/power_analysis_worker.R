#!/usr/bin/env Rscript
# =============================================================================
# Power Analysis Worker Script for K8s Indexed Jobs
# Each worker handles one sample size + analysis type combination
# =============================================================================

args <- commandArgs(trailingOnly = TRUE)

# Get job parameters from environment or args
job_index <- as.integer(Sys.getenv("JOB_COMPLETION_INDEX", "0"))
n_sims <- as.integer(Sys.getenv("N_SIMS", "500"))
output_dir <- Sys.getenv("OUTPUT_DIR", "/results")

cat("==============================================\n")
cat("Power Analysis Worker\n")
cat("==============================================\n")
cat("Job index:", job_index, "\n")
cat("N simulations:", n_sims, "\n")
cat("Output dir:", output_dir, "\n")

# Load packages
suppressPackageStartupMessages({
  library(lme4)
  library(lmerTest)
  library(dplyr)
  library(parallel)
})

set.seed(42 + job_index)  # Different seed per job for independent simulations

# =============================================================================
# JOB INDEX MAPPING
# =============================================================================
# Indices 0-5:  2x2 analysis for sample sizes 30, 40, 48, 60, 80, 100
# Indices 6-11: Valence analysis for sample sizes 30, 40, 48, 60, 80, 100

sample_sizes <- c(30, 40, 48, 60, 80, 100)

if (job_index < 6) {
  analysis_type <- "2x2"
  n_subj <- sample_sizes[job_index + 1]
} else {
  analysis_type <- "valence"
  n_subj <- sample_sizes[job_index - 6 + 1]
}

cat("Analysis type:", analysis_type, "\n")
cat("Sample size:", n_subj, "\n")
cat("==============================================\n\n")

# =============================================================================
# EFFECT SIZES FROM S&F 2006
# =============================================================================

exp2_n <- 48
exp2_phon_dissim_mean <- 37.2
exp2_phon_sim_mean <- 32.2
exp2_phon_ci_halfwidth <- 3.7
exp2_sem_dissim_mean <- 34.8
exp2_sem_sim_mean <- 34.5
exp2_sem_ci_halfwidth <- 2.9

exp5_neutral_mean <- 58.8
exp5_valent_mean <- 65.2
exp5_valence_ci_halfwidth <- 4.4

# Calculate effect sizes
calc_effect_size <- function(mean_diff, ci_halfwidth, n, df = n - 1) {
  t_crit <- qt(0.975, df = df)
  se <- ci_halfwidth / t_crit
  sd_diff <- se * sqrt(n)
  d_z <- mean_diff / sd_diff
  return(list(mean_diff = mean_diff, sd_diff = sd_diff, d_z = d_z))
}

phon_mean_diff <- exp2_phon_dissim_mean - exp2_phon_sim_mean
phon_effect <- calc_effect_size(phon_mean_diff, exp2_phon_ci_halfwidth, exp2_n)
sem_mean_diff <- exp2_sem_dissim_mean - exp2_sem_sim_mean
valence_mean_diff <- exp5_valent_mean - exp5_neutral_mean
valence_effect <- calc_effect_size(valence_mean_diff, exp5_valence_ci_halfwidth, exp2_n)

# Simulation parameters
grand_mean <- mean(c(exp2_phon_dissim_mean, exp2_phon_sim_mean,
                     exp2_sem_dissim_mean, exp2_sem_sim_mean)) / 100
# Conservative effect sizes (80% of S&F 2006) to account for inner speech attenuation
CONSERVATIVE_FACTOR <- 0.80
phon_effect_size <- (-phon_mean_diff / 100) * CONSERVATIVE_FACTOR
sem_effect_size <- sem_mean_diff / 100
valence_grand_mean <- mean(c(exp5_neutral_mean, exp5_valent_mean)) / 100
valence_effect_size <- (valence_mean_diff / 100) * CONSERVATIVE_FACTOR

# Random effects
total_sd <- phon_effect$sd_diff / 100
icc_subject <- 0.20
icc_item <- 0.10
tau_subj <- sqrt(icc_subject) * total_sd
tau_item <- sqrt(icc_item) * total_sd
sigma <- sqrt(1 - icc_subject - icc_item) * total_sd
tau_subj_phon <- abs(phon_effect_size) * 0.5
tau_subj_sem <- abs(phon_effect_size) * 0.5
tau_item_phon <- abs(phon_effect_size) * 0.25
tau_item_sem <- abs(phon_effect_size) * 0.25

# =============================================================================
# SIMULATION FUNCTIONS
# =============================================================================

simulate_2x2_data <- function(n_subj, n_items_per_cell = 18) {
  subj_effects <- data.frame(
    subject = 1:n_subj,
    u0 = rnorm(n_subj, 0, tau_subj),
    u_phon = rnorm(n_subj, 0, tau_subj_phon),
    u_sem = rnorm(n_subj, 0, tau_subj_sem)
  )

  n_total_items <- n_items_per_cell * 4
  item_effects <- data.frame(
    item = 1:n_total_items,
    w0 = rnorm(n_total_items, 0, tau_item),
    w_phon = rnorm(n_total_items, 0, tau_item_phon),
    w_sem = rnorm(n_total_items, 0, tau_item_sem)
  )

  conditions <- expand.grid(phon = c(-0.5, 0.5), sem = c(-0.5, 0.5))
  data_list <- list()
  item_counter <- 1

  for (cond in 1:nrow(conditions)) {
    phon_val <- conditions$phon[cond]
    sem_val <- conditions$sem[cond]

    for (i in 1:n_items_per_cell) {
      current_item <- item_counter
      item_counter <- item_counter + 1

      for (s in 1:n_subj) {
        eta <- grand_mean +
          (phon_effect_size + subj_effects$u_phon[s] + item_effects$w_phon[current_item]) * phon_val +
          (sem_effect_size + subj_effects$u_sem[s] + item_effects$w_sem[current_item]) * sem_val +
          subj_effects$u0[s] + item_effects$w0[current_item] + rnorm(1, 0, sigma)

        data_list[[length(data_list) + 1]] <- data.frame(
          subject = s, item = current_item,
          phon = phon_val, sem = sem_val,
          prop_halt = pmax(0, pmin(1, eta))
        )
      }
    }
  }

  data <- bind_rows(data_list)
  data$subject <- factor(data$subject)
  data$item <- factor(data$item)
  return(data)
}

simulate_valence_data <- function(n_subj, n_items_per_level = 18) {
  tau_s_val <- abs(valence_effect_size) * 0.5
  tau_i_val <- abs(valence_effect_size) * 0.25

  subj_effects <- data.frame(
    subject = 1:n_subj,
    u0 = rnorm(n_subj, 0, tau_subj),
    u_val = rnorm(n_subj, 0, tau_s_val)
  )

  n_total_items <- n_items_per_level * 2
  item_effects <- data.frame(
    item = 1:n_total_items,
    w0 = rnorm(n_total_items, 0, tau_item),
    w_val = rnorm(n_total_items, 0, tau_i_val)
  )

  data_list <- list()
  item_counter <- 1

  for (valence in c(-0.5, 0.5)) {
    for (i in 1:n_items_per_level) {
      current_item <- item_counter
      item_counter <- item_counter + 1

      for (s in 1:n_subj) {
        eta <- valence_grand_mean +
          (valence_effect_size + subj_effects$u_val[s] + item_effects$w_val[current_item]) * valence +
          subj_effects$u0[s] + item_effects$w0[current_item] + rnorm(1, 0, sigma)

        data_list[[length(data_list) + 1]] <- data.frame(
          subject = s, item = current_item, valence = valence,
          prop_halt = pmax(0, pmin(1, eta))
        )
      }
    }
  }

  data <- bind_rows(data_list)
  data$subject <- factor(data$subject)
  data$item <- factor(data$item)
  return(data)
}

run_single_sim_2x2 <- function(n_subj) {
  dat <- simulate_2x2_data(n_subj)

  tryCatch({
    model <- lmer(prop_halt ~ phon * sem + (1 + phon + sem | subject) + (1 + phon + sem | item),
                  data = dat, control = lmerControl(optimizer = "bobyqa", optCtrl = list(maxfun = 100000)))
    coef_table <- summary(model)$coefficients
    return(data.frame(
      n_subj = n_subj,
      p_phon = coef_table["phon", "Pr(>|t|)"],
      p_sem = coef_table["sem", "Pr(>|t|)"],
      p_interaction = coef_table["phon:sem", "Pr(>|t|)"],
      converged = TRUE
    ))
  }, error = function(e) {
    tryCatch({
      model <- lmer(prop_halt ~ phon * sem + (1 + phon + sem | subject) + (1 | item),
                    data = dat, control = lmerControl(optimizer = "bobyqa"))
      coef_table <- summary(model)$coefficients
      return(data.frame(
        n_subj = n_subj,
        p_phon = coef_table["phon", "Pr(>|t|)"],
        p_sem = coef_table["sem", "Pr(>|t|)"],
        p_interaction = coef_table["phon:sem", "Pr(>|t|)"],
        converged = TRUE
      ))
    }, error = function(e2) {
      return(data.frame(n_subj = n_subj, p_phon = NA, p_sem = NA, p_interaction = NA, converged = FALSE))
    })
  })
}

run_single_sim_valence <- function(n_subj) {
  dat <- simulate_valence_data(n_subj)

  tryCatch({
    model <- lmer(prop_halt ~ valence + (1 + valence | subject) + (1 + valence | item),
                  data = dat, control = lmerControl(optimizer = "bobyqa", optCtrl = list(maxfun = 100000)))
    coef_table <- summary(model)$coefficients
    return(data.frame(n_subj = n_subj, p_valence = coef_table["valence", "Pr(>|t|)"], converged = TRUE))
  }, error = function(e) {
    tryCatch({
      model <- lmer(prop_halt ~ valence + (1 + valence | subject) + (1 | item),
                    data = dat, control = lmerControl(optimizer = "bobyqa"))
      coef_table <- summary(model)$coefficients
      return(data.frame(n_subj = n_subj, p_valence = coef_table["valence", "Pr(>|t|)"], converged = TRUE))
    }, error = function(e2) {
      return(data.frame(n_subj = n_subj, p_valence = NA, converged = FALSE))
    })
  })
}

# =============================================================================
# RUN SIMULATIONS
# =============================================================================

cat("Starting", n_sims, "simulations...\n")

results_list <- list()
for (i in 1:n_sims) {
  if (i %% 50 == 0) cat("  Simulation", i, "of", n_sims, "\n")

  if (analysis_type == "2x2") {
    results_list[[i]] <- run_single_sim_2x2(n_subj)
  } else {
    results_list[[i]] <- run_single_sim_valence(n_subj)
  }
}

results_df <- bind_rows(results_list)

# =============================================================================
# CALCULATE AND SAVE RESULTS
# =============================================================================

alpha <- 0.05
converged <- results_df[results_df$converged == TRUE, ]
n_converged <- nrow(converged)
convergence_rate <- n_converged / n_sims

if (analysis_type == "2x2") {
  power_phon <- mean(converged$p_phon < alpha, na.rm = TRUE)
  power_sem <- mean(converged$p_sem < alpha, na.rm = TRUE)
  power_int <- mean(converged$p_interaction < alpha, na.rm = TRUE)

  summary_row <- data.frame(
    analysis_type = analysis_type,
    n_subj = n_subj,
    n_sims = n_sims,
    convergence_rate = convergence_rate,
    power_phon = power_phon,
    power_sem = power_sem,
    power_interaction = power_int,
    power_valence = NA
  )

  cat("\nResults:\n")
  cat("  Converged:", n_converged, "/", n_sims, "(", round(100 * convergence_rate, 1), "%)\n")
  cat("  Power (Phonological):", round(power_phon * 100, 1), "%\n")
  cat("  Power (Semantic):", round(power_sem * 100, 1), "%\n")
  cat("  Power (Interaction):", round(power_int * 100, 1), "%\n")

} else {
  power_val <- mean(converged$p_valence < alpha, na.rm = TRUE)

  summary_row <- data.frame(
    analysis_type = analysis_type,
    n_subj = n_subj,
    n_sims = n_sims,
    convergence_rate = convergence_rate,
    power_phon = NA,
    power_sem = NA,
    power_interaction = NA,
    power_valence = power_val
  )

  cat("\nResults:\n")
  cat("  Converged:", n_converged, "/", n_sims, "(", round(100 * convergence_rate, 1), "%)\n")
  cat("  Power (Valence):", round(power_val * 100, 1), "%\n")
}

# Save results
output_file <- file.path(output_dir, sprintf("power_results_%s_n%d.csv", analysis_type, n_subj))
write.csv(summary_row, output_file, row.names = FALSE)
cat("\nResults saved to:", output_file, "\n")

# Also save raw simulation results
raw_output_file <- file.path(output_dir, sprintf("raw_results_%s_n%d.rds", analysis_type, n_subj))
saveRDS(results_df, raw_output_file)
cat("Raw results saved to:", raw_output_file, "\n")

cat("\n==============================================\n")
cat("Job", job_index, "complete!\n")
cat("==============================================\n")
