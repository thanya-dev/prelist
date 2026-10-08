# Announcement form typography and spacing review

1. Top of Edit modal: fixed. Status heading was 18.72px/700 while other sections were 18px/600; group labels mixed 14px and 18px. Current section headings are 18px/28px/600 and field labels 16px/24px/500. Evidence: posting-form-typography-before.png and posting-form-typography-after.png.
2. Compensation and announcement information: fixed. Grouped compensation helper with its heading at 8px; all labels sit 8px above their controls. Desktop section/card gap stays 24px. The last editor remains reachable above the sticky footer. Evidence: posting-form-spacing-after.png.
3. Mobile: code uses 12px card padding and 16px group/card gaps. Visual verification could not finish because the browser connection detached repeatedly. No mobile screenshot is claimed for this run.

Long labels retain wrapping; platform controls are grouped with an accessible label. This focused check does not establish complete accessibility compliance. Save/data behavior was not changed.

Validation: npm run format, npm run format:check, npm run build and npm run test:sites passed (4 tests). Build retains its bundle-size warning.
