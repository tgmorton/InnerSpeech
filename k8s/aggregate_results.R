#!/usr/bin/env Rscript
# Aggregate power analysis results from K8s jobs
# Run this after all jobs complete to combine results

library(dplyr)

results_dir <- commandArgs(trailingOnly = TRUE)[1]
if (is.na(results_dir)) results_dir <- "/results"

cat("Aggregating results from:", results_dir, "\n\n")

# Find all result files
files <- list.files(results_dir, pattern = "power_.*\\.csv", full.names = TRUE)
cat("Found", length(files), "result files\n\n")

# Read and combine
all_results <- lapply(files, read.csv) %>% bind_rows()

# Split by analysis type
results_2x2 <- all_results %>% filter(analysis == "2x2") %>% arrange(n)
results_val <- all_results %>% filter(analysis == "valence") %>% arrange(n)

cat("==============================================\n")
cat("2x2 DESIGN (Phonological x Semantic)\n")
cat("==============================================\n")
print(results_2x2 %>% select(n, convergence, power_phon, power_sem, power_int))

cat("\n==============================================\n")
cat("VALENCE DESIGN\n")
cat("==============================================\n")
print(results_val %>% select(n, convergence, power_val))

# Find minimum N for 80% power
min_n_phon <- results_2x2$n[which(results_2x2$power_phon >= 0.80)[1]]
min_n_val <- results_val$n[which(results_val$power_val >= 0.80)[1]]

cat("\n==============================================\n")
cat("RECOMMENDATIONS\n")
cat("==============================================\n")
cat("Minimum N for 80% power (Phonological):", ifelse(is.na(min_n_phon), ">100", min_n_phon), "\n")
cat("Minimum N for 80% power (Valence):", ifelse(is.na(min_n_val), ">100", min_n_val), "\n")

recommended_n <- max(min_n_phon, min_n_val, na.rm = TRUE)
if (!is.na(recommended_n)) {
  cat("\nRecommended sample size: N =", recommended_n, "\n")
  cat("Conservative (for inner speech): N =", ceiling(recommended_n * 1.5), "\n")
}

# Save combined results
write.csv(all_results, file.path(results_dir, "power_analysis_combined.csv"), row.names = FALSE)
cat("\nCombined results saved to:", file.path(results_dir, "power_analysis_combined.csv"), "\n")
