# Framework Philosophies

This document outlines the goals, ideas, and roadmap for the rg-bot library (as well as our public-facing libraries in general). This is a living document, and we encourage players to participate and contribute to this document.

## Core Facts

The following is a list of facts that we would like to make true over time.

#### 80% of users with less than 6 year of JavaScript experience should be able to articulate what the provided examples / templates do
Making this goal a reality ensures that most new players who may not be coding experts can jump right in and begin programming bots on the Regression Games platform. This is measured by conducting user-interviews and surveys with potential players. 

**Measurement Approach:** Survey / Interview
**Desired sample size per test**: 10-15 users
**Most recent test results:** Not yet obtained

### 100% of users with great than 1 year of JavaScript experience should be able to articulate what the provided examples / templates do


### A user that encounters an error within our library that they must recover from should immediately have one next step available to them
Focusing on this goal ensures that we increase the chance that a player never gets stuck on a library-related issue. Players should spend their time focusing on their strategies, rather than the intricacies of code. When a fatal error occurs that requires the user to fix their code, we should make every attempt to point them in the right direction. Examples of this include:
* Logging errors that make direct suggestions to fix (e.g. "Invalid item name. Make sure that the item name is a valid id (e.g 'spruce_log') instead of the displayed name (e.g. 'Spruce Log'). The list of valid items can be found at https://...")
* Logging errors that include links to documentaton for next steps (e.g. "... To see approaches to fix this, visit https://...")

**Measurement Approach:** Internal Audit
**Most recent test results:** Not yet obtained

## Design Patterns

WIP
