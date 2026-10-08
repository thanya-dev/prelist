# Campaign Influencer List QA

Source visual: user-attached Influencer List reference (1581 × 623 px).
Implementation: [influencer-list-preview.png](./influencer-list-preview.png), browser-rendered Campaign Detail `/campaigns/page-promotion-facebook`.
State: Influencer List, ทั้งหมด selected, five sample rows.
Viewport: desktop browser default, captured 1905 × 951 px; mobile override 390 × 844 CSS px, reset after inspection. Source is a content-only crop; implementation includes existing Campaign stage navigation. Compare table regions proportionally, not surrounding Campaign chrome.

## Findings

- Content and controls: all five names, campaign titles, platforms, via details, reviewer types, statuses and campaign codes match the supplied reference. Filter counts are 5 / 3 / 1 / 1. Confirm List retains the existing account table.
- Typography: retained project-required Bai Jamjuree; hierarchy uses semibold names, muted secondary data and compact badges. Source font is not supplied, so an exact font match is not claimed.
- Layout: five-column white bordered rounded table, divider after reviewer column, pill filters above, comfortable row spacing. Mobile keeps a readable minimum table width with horizontal scrolling.
- Colors: purple active filter, orange Buyer, purple waiting, green confirmed, slate secondary information and pale borders follow the source.
- Images: real illustration image assets from DiceBear and existing shared social-logo icons. Avatars differ from the exact source illustrations because their original files were not provided; this is a remaining visual fidelity limitation.

## Interactions verified

- Buyer filter returns three rows; waiting and confirmed return one each; all restores five.
- Confirmed campaign-code copy shows a success message.
- Reviewer name opens its sample profile information and closes correctly.
- No browser console errors were recorded.
- Desktop and 390px mobile screenshots inspected.

## Remaining verification limitation

The user attachment is visible in conversation, but was not available as a local image for the skill-required combined-image comparison. Exact avatar fidelity and the normalized combined comparison remain unverified.

final result: blocked

Implementation and interaction checks are complete; blocked applies to the stricter image-to-code fidelity gate, not the requested sample-data table behavior.
