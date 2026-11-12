---
title: Detection of sharp-wave ripples and investigating their role in primate memory
period: Jan – Apr 2026
summary: BSc honours thesis. Detecting sharp-wave ripples in wide-band LFP recordings from the primate hippocampus during a context-dependent associative memory task.
tools: [MATLAB, Brainstorm, Plexon .pl2]
order: 1
---

Honours research thesis, Department of Life Sciences, GITAM University. Supervisor: Dr Niranjan A. Kambi.

## Abstract

Sharp-wave ripples (SWRs) are brief high-frequency oscillations in the hippocampal local field potential (LFP) that accompany the reactivation of recent experience and are thought to support memory consolidation. I analysed hippocampal LFPs recorded with linear-array electrodes from a non-human primate performing a context-dependent associative (episodic-like) memory task. After correcting acquisition lags in the 40 kHz Plexon wide-band recordings with a custom MATLAB routine, I preprocessed the signals in Brainstorm (resampling to 1,250 Hz, 100–250 Hz band-pass filtering, DC removal and 60 Hz notch filtering, z-scoring, rectification and envelope extraction) and detected ripples as envelope events exceeding 3 SD for at least 20 ms. More than 1,300 candidate ripples were detected across over 1,000 trials and aligned to task events. This preliminary single-session analysis revealed task-related patterns in ripple timing and high-gamma activity during inter-trial intervals.

## Next steps

I reviewed machine-learning ripple detectors (rippl-AI: CNN, LSTM, XGBoost) and proposed three next steps:

- validating the findings across recording sessions;
- benchmarking machine-learning detection against spectral detection;
- analysing simultaneous recordings from other brain regions, to relate hippocampal events to wider network activity during each trial.
