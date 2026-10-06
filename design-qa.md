# Job Posting campaign type and Basic Information QA

final result: passed

## Evidence and scope

- Sources: `/Users/thanya/Desktop/Screenshot 2569-10-04 at 16.19.37.png` (1504 × 852) and `/Users/thanya/Desktop/Screenshot 2569-10-04 at 16.14.02.png` (1448 × 530).
- Source normalization: density 2, producing 752 × 426 and 724 × 265 CSS-sized images.
- Implementation: `http://127.0.0.1:5180/job-postings/create?briefId=NRI202609058`.
- Desktop viewport: 1440 × 722, screenshot content width 1425 excluding scrollbar, density 1. Existing form container remains 860px wide.
- Browser captures: `artifacts/campaign-form/desktop-final.png`, `artifacts/campaign-form/mobile-final.png`.
- Full-region combined comparisons opened: `artifacts/campaign-form/basic-comparison-final.png`, `artifacts/campaign-form/type-comparison-final.png`.
- Focused Basic Information capture: `artifacts/campaign-form/basic-final.png`. The combined captures are already focused on readable fields, so additional detail crops were unnecessary.
- Mobile viewport: 390 × 844; no horizontal overflow. The final fields can be scrolled above the existing fixed footer.
- Matched states: Normal selected; full-width title/subtitle with reference sample text. Logo intentionally uses the originating Brief’s saved image rather than replacing user data with the screenshot’s sample logo.
- Scope is Job Posting only. Brief and Project forms remain unchanged.

## Findings and comparison history

1. Initial browser inspection found label/input spacing was smaller than image 1 and the campaign-type heading spacing/size was larger than image 2. Result blocked.
2. Increased title/subtitle label gaps to 16px; reduced campaign-type heading to 16px and its following gap to 12px.
3. Captured desktop-final and mobile-final, opened both final side-by-side comparison images, and verified the same UI states. No actionable P0/P1/P2 findings remain.

## Fidelity surfaces

- Typography: preserves the mandated Bai Jamjuree font; 16px title/subtitle and type fields, 18px logo label, 14px type descriptions. Source font metrics differ slightly, intentionally retaining the project font.
- Layout: centered 120 × 120 logo, overlay remove control, title then subtitle in full-width rows, 24px desktop panel padding. Campaign type uses stacked radio cards, matching the source anatomy. Basic Information is the final section after Reference Brief.
- Color: white cards, pale blue selected type, blue outline and description, muted unselected description, red required markers.
- Assets: saved or inherited brand image remains sharp with object-fit contain. Phosphor provides remove and radio icons. An empty image uses the existing upload affordance pattern.
- Copy: both campaign type labels and Thai descriptions match image 2; โลโก้แบรนด์, Campaign Title and Campaign Subtitle match image 1. Brand search and Owner / Assign Buyer remain below these fields for compatibility with the existing form.

## Verification

- Normal is selected by default; selecting Confidential and switching back works.
- Campaign Title continues to use the existing `name` contract. Subtitle and campaignType are new persisted fields; legacy records default to Normal and empty subtitle.
- Title/subtitle inputs and logo removal tested in the browser without saving changes to existing records.
- Isolated in-memory storage test passed for confidential type/subtitle edits, preserving image and viewer counts, and partial drafts with an empty subtitle and image.
- Draft saves still require only the title. Publishing requires the logo and subtitle shown as required in the reference.
- Browser console error log checked: empty.
- format, format:check, build and all four test:sites checks passed.
- Snapshot diff reviewed; Sites infrastructure files are intact.

## Limitations and follow-up polish

- Campaign type is a persisted prototype form setting. This task does not implement an applicant-facing authorization system for confidential content.
- P3: native project font and responsive form width differ from the isolated source crops. The source’s sample logo is intentionally not substituted for the saved Brief logo.

## Implementation checklist

- [x] Campaign type cards and persistence.
- [x] Basic Information moved to the end and styled from image 1.
- [x] Brand search, owner, draft requirements and parent navigation preserved.
- [x] Desktop/mobile capture and visual comparison.
- [x] Build and format verification.

## Campaign Create/Edit — 2026-10-06

Source: four screenshots in `/Users/thanya/Downloads/screencapture-manage-test-buddyreview-co-campaign-create-qu2sMepIyS-2026-10-06-19_11_{31,43,50,56}.png`.
Implementation: Chrome tab 1557469775, browser screenshot evidence in this session, `/campaigns/page-promotion-facebook/edit`.
Desktop viewport 1440px wide; narrow viewport 390 × 844. Source is 2× density (2880px wide); desktop screenshots are 1×. Step 4 source and implementation were displayed in the same comparison tool output. Step 2 desktop and narrow full-page images were inspected. Sample campaign values intentionally differ from the reference.

Typography uses existing Bai Jamjuree; body increased from 14 to 16px after comparison. Pale panels, blue selected cards, border colors, two-column preview/form composition and spacing follow the supplied references. Existing campaign image and social logos are reused. Actual campaign data replaces reference sample titles and dates.

Iteration: radio controls originally stretched vertically because of inherited input styling; fixed explicit 16px radio dimensions and top alignment. Completed step checkmarks received explicit white color after contrast inspection. Narrow viewport stacks form cards and preview without horizontal overflow.

Interactions checked: step navigation, preserved values across steps, Brief text entry and formatting markers, copy campaign, create/save, return to Campaign Detail, reopen saved edit values. Browser error logs: none observed.

Remaining P2: Brief editor provides text and formatting markers rather than a full rich-text editor; native logo upload and removal differ visually from the reference image overlay. Uploads are limited to 3 MB per file for prototype localStorage persistence, instead of the larger production limits shown in the reference. Screenshot artifacts are in tool output, not saved to disk. These differences prevent a strict 1:1 fidelity pass.

final result: blocked

## Two-step campaign follow-up — 2026-10-06

The approved flow supersedes the four-step screenshot structure: source selection then editable campaign settings. Desktop (1440px) and narrow (390 × 844) browser screenshots were inspected in this session. Editable settings use two columns on desktop and one on narrow screens. Inherited data is collapsed with a lock icon; optional settings are also collapsed. Browser checks confirmed two step items, Edit starting on step 2, editable selected-reviewer brief, preservation of saved points/link/Do content, direct save to Campaign Detail, manual-entry fallback validation and source selection through Brief ID. No browser console errors observed. Strict fidelity limitations from the earlier four-step implementation remain outside this scoped change.
