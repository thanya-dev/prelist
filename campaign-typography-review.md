# Campaign typography review

Scope: Step 1 Setting and Step 2 reviewer work details. Browser screenshots captured before and after the change in this conversation, at desktop width 1440 and mobile width 390 (844px height). Screenshot evidence is in conversation tool outputs; no standalone screenshot files were saved.

Findings corrected:

1. Setting input/select values inherited 14px/600 from Field labels. They now use 16px/400, while labels use 14px/500.
2. Setting hints used browser small-text defaults around 11.67px; radio hints used 12px while other descriptions used 14px. Form hints now use 14px/400 and 1.6 line height.
3. Preview title used 700 while other card headings used 600. Card headings now use 18px/600; step headings 20px/600; page title 24px/600.
4. The selected-reviewer brief qualifier now uses 14px/400 separately from the 18px section heading. Compact Preview labels and metadata use 13px.

Step 1: labels, helpers and input values are consistent. Step 2: cards, options, uploads, rewards and Preview use the same hierarchy. Mobile capture confirms readable wrapping and no horizontal overflow (document width equals 390px viewport). Existing sticky actions remain visible.

Evidence limits: this checks rendered typography and wrapping, not a comprehensive accessibility audit. Screenshot-only evidence cannot establish screen-reader behavior. No data was changed during these typography checks.

Validation: Prettier check and frontend Vite compilation pass. Full Sites build/package test still fails because the pre-existing .openai/hosting.json input is missing.
