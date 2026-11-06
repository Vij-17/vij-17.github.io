---
title: Sharp-wave ripples in the primate hippocampus during associative memory
period: Jan – Apr 2026
summary: Detecting sharp-wave ripples in wide-band LFP recordings from the primate hippocampus during a rapid associative learning task.
tools: [MATLAB, Brainstorm, Plexon .pl2]
order: 1
---

BSc (Honours) thesis, Department of Life Sciences, GITAM Deemed to be University. Supervisor: Dr Niranjan A. Kambi.

## Abstract

Sharp-wave ripples (SWRs) are brief high-frequency oscillations in the hippocampal local field potential (LFP) that accompany the reactivation of recent experience and are thought to support memory consolidation. I analysed hippocampal LFPs recorded with linear-array electrodes from a non-human primate performing a context-dependent associative (episodic-like) memory task. After correcting acquisition lags in the 40 kHz Plexon wide-band recordings with a custom MATLAB routine, I preprocessed the signals in Brainstorm (resampling to 1,250 Hz, 100–250 Hz band-pass filtering, DC removal, 60 Hz notch filtering, z-scoring, rectification and envelope extraction) and detected ripples as envelope events exceeding 3 SD for at least 20 ms. Across 1,043 trials in one session, 1,340 candidate ripples were detected and aligned to task events. Preliminary results suggest that ripple timing differs between correct and error trials, and 120–140 Hz high-gamma activity appeared during long inter-trial intervals.

These results come from a single session and need validation across sessions. As a next step, I reviewed machine-learning ripple detectors (rippl-AI: CNN, LSTM, XGBoost) and proposed benchmarking them against spectral detection.
