---
title: Detecting sharp-wave ripples in primate hippocampal recordings
period: Jan – Apr 2026
summary: An honours-thesis pipeline that turns raw Plexon recordings into curated sharp-wave ripple events for analysis.
tools: [MATLAB, Brainstorm, Plexon .pl2]
order: 1
---

Sharp-wave ripples (SWRs) are brief, high-frequency oscillations (roughly 100–250 Hz, depending on species) riding on a large hippocampal sharp wave; they coincide with the replay of recent experience and are thought to drive memory consolidation in the neocortex. Detecting them reliably is the first problem in any ripple study: thresholds that work in one recording miss events or admit artefacts in the next.

## What I built

- A preprocessing workflow in Brainstorm and MATLAB that imports Plexon `.pl2` recordings, converts them into analysable formats and filters the local field potential into the ripple band.
- A threshold-based detection step with documented parameters, so that every run can be reproduced from the raw files.
- A literature review of machine-learning approaches to ripple detection, which identified open problems in generalising detectors across species and recording set-ups.

## What comes next

I studied and briefly tested the rippl-AI toolbox, which applies convolutional, recurrent and gradient-boosted models to ripple detection, and proposed it as future work; it was not part of the thesis results.

*Replace this text with your own summary; add figures by placing images in `/public/images/` and linking them here.*
