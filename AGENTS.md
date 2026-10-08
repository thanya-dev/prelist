# Prototype Instructions

Brief Detail places recruitment postings and Product Option in separate tabs below the persistent Brief summary. Default to ประกาศหานักรีวิว; show posting/product counts on tabs. Preserve calendar month, view, search and status filters while switching tabs. Empty Product Option shows ยังไม่มีสินค้า with เพิ่มสินค้า linking to Brief Edit.

Job Posting campaign type options are stacked vertically in this order: Normal, Confidential campaign, Private campaign. Use the supplied Thai descriptions and blue selected radio-card styling. Persist all three values (`normal`, `confidential`, `private`) through draft/save/edit and display the saved type on Detail.

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

Use the Buddy Review logo directly from `https://manage.buddyreview.co/_next/static/media/logo-m-color.94a8241e.svg` in this prototype.

Projects use a unified lifecycle and status filter: `Draft` → `Prelist` → `On Going` → `Complete`. Draft/Prelist use the lightweight creator-sourcing form; moving to On Going/Complete requires the full Project Setup fields.

The Project List supports combined filtering by lifecycle status and `Created by`.

On Project Detail, place the lifecycle status badge at the top-right of the project summary card.

The `Broadcast งาน` action opens a confirmation modal without showing Project ID, Quotation, or CF count.

The Prelist toolbar provides an Excel-compatible export of influencer names and visible profile data.

Campaign cards open a dedicated Campaign Detail page modeled after the Buddy Review Campaign Task dashboard.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

Job Posting Detail includes an “แก้ไขประกาศ” action that opens the existing posting form with saved values and returns to the detail page after saving.

Job posting reviewer lists and cards provide Accept / Reject actions, a Reject filter tab, and display the status plus the buyer who made the decision. Persist decisions separately per job posting.

Reviewer actions reflect current status: hide Accept / Reject after a decision; rejected reviewers have no send-to-Sale action. Show send-to-Sale only for accepted reviewers awaiting submission. Open reviewer profiles by clicking the username; do not show separate profile buttons.

Job posting reviewer filter tabs are ทั้งหมด, ทีมงานเลือกแล้ว, ลูกค้าเลือกแล้ว, and Reject. Do not show separate Accept or เลือกลูกค้า tabs.

On reviewer cards, place Accept / Reject actions in the bottom footer, after all reviewer details.

Reviewer footer actions place Reject on the left and Accept on the right. Customer-selected reviewers show “ลูกค้าเลือกแล้ว” and rejected reviewers show “ถูก Reject” in place of the action buttons.

The เพิ่มนักรีวิว action offers single entry and Bulk Upload with CSV/TSV upload or pasted username/platform columns, a template, preview, duplicate validation, and job-specific persistence. Added reviewers start pending.

Job posting reviewers support checkboxes in list and card views, select-all for the visible tab, a selection count, clear selection, and Excel-compatible CSV export of selected reviewers only. Preserve selection across tabs and views.

The reviewer selection/export toolbar floats fixed at the bottom of the viewport, centered within the main content area, with space below the reviewer list to avoid covering cards.

Align the Export Excel button to the right edge of the floating reviewer selection toolbar.

The floating reviewer toolbar has one primary Export Excel action only. Do not relabel secondary actions as Export Excel using CSS pseudo-elements.

Reviewer export is restricted to team-selected reviewers only. Disable other checkboxes and restrict select-all and export to eligible reviewers.

Campaign Task > APPROVED follows the supplied Buddy Review screenshot: Approved Influencers heading, account/reach/follower totals, platform breakdown and filters, display columns, username search, Import post/Update comments actions, and a dense horizontally scrollable account table with workflow columns.

Campaign Task starts with Influencer List (renamed from Approved). Remove Request, Brand Approve, and Final Approve stage tabs. Include an Import Influencer action in Influencer List.

Influencer List Import Influencer offers Brief ID and CSV modes. Brief ID searches existing posting briefs and previews customer-selected reviewers, excluding accounts already in the campaign, with selectable import rows.

Job posting reviewer status navigation includes ยืนยันรับงานแล้ว, opening the user-provided Claude artifact URL in a new tab.

The Back action on Brief Detail navigates directly to /briefs (Brief list), regardless of browser history.

The announcement section (/briefs and /job-postings lists) defaults to a monthly Calendar with a Table toggle, shared status/search state, date-derived Thai recruitment statuses, Bangkok today highlighting, and actual inclusive recruitment spans split across week/month boundaries into non-overlapping lanes. Undated drafts link to the draft-filtered Table. Use consistent status badges in both views and a clear-filter empty state.

Correction: the recruitment Calendar/Table section belongs inside Brief Detail (/briefs/NRI202609058), below the brief summary, and shows only postings linked to that Brief ID. /briefs remains the Brief list.

Back and Cancel actions use explicit parent routes: Brief Detail → Brief list; Job Posting Detail → its linked Brief; posting create → originating Brief (or Brief list); posting edit → posting detail; project create → Project list; project edit → Project detail; Campaign Project → parent Project. Sidebar Projects always opens Project list.

The /briefs list uses the heading “รายการ Brief”, bounded thumbnails, readable brief titles, and a search empty state with a clear-search action.

Posting search empty states keep a clear 20px gap between the no-results message and the clear-filter button.

Job posting reviewer tabs use สมัคร, ทีมงานเลือกแล้ว, ลูกค้าเลือกแล้ว, Reject. ทีมงานเลือกแล้ว means every applicant awaiting a Buyer or PM decision. Posting and Brief edit actions overlay the avatar inside their summary cards, using the Project edit-chip pattern.

Recruitment status filter pills include a colored circular dot before each label, matching the corresponding status badge color (ทั้งหมด uses purple).

Recruitment status filters show counts in parentheses, scoped to the current Brief and current search, independent of the selected status and calendar month.

## คำสั่งสำหรับ AI developer

อ่าน `AGENTS.md` ที่ root ก่อนเริ่มงานทุกครั้ง กติกาส่วนนี้ใช้กับทั้งโปรเจกต์ รวมถึงไฟล์ใหม่ที่จะเพิ่มในอนาคต อ่านข้อกำหนดของ prototype ด้านบนและ config ที่มีอยู่ก่อนแก้ไข หากข้อกำหนดด้านบนมีการแก้ไขตามลำดับ ให้ใช้ข้อแก้ไขล่าสุด เช่น รายชื่อนักรีวิวใช้แท็บ สมัคร, ทีมงานเลือกแล้ว, ลูกค้าเลือกแล้ว, Reject และ Calendar อยู่ใน Brief Detail

### Stack และขอบเขตการแก้ไข

- โปรเจกต์ใช้ React, JavaScript/JSX, Vite, React Router และ Tailwind CSS ผ่าน `@tailwindcss/vite`
- ใช้ npm และรักษา `package-lock.json` เมื่อเพิ่มหรือเปลี่ยน dependency
- คง JavaScript/JSX ตามโปรเจกต์เดิม ไม่ย้ายทั้งโปรเจกต์เป็น TypeScript เว้นแต่ผู้ใช้ขอ
- งาน refactor หรือ formatting ต้องรักษา logic, behavior, routes, assets และสัญญาข้อมูลเดิม เปลี่ยนเฉพาะขอบเขตที่ผู้ใช้ขอ
- ก่อนเปลี่ยนส่วนใด ให้ดู component หรือ flow ที่คล้ายกันและใช้รูปแบบเดิมของโปรเจกต์

### โครงสร้างไฟล์

| ตำแหน่ง                   | หน้าที่                                                           |
| ------------------------- | ----------------------------------------------------------------- |
| `src/app/`                | ตั้งค่าแอป, routes และ providers                                  |
| `src/pages/`              | ประกอบหน้าจาก components ของฟีเจอร์                               |
| `src/features/<feature>/` | UI, business logic, hooks, API/data access และ types เฉพาะฟีเจอร์ |
| `src/components/ui/`      | UI พื้นฐาน เช่น Button, Input, Modal                              |
| `src/components/layout/`  | โครงหน้าจอ เช่น Sidebar, Header, Layout                           |
| `src/components/shared/`  | ส่วนที่ใช้ร่วมกันหลายฟีเจอร์ เช่น EmptyState                      |
| `src/hooks/`              | Hooks ที่ใช้ร่วมกันทั้งแอป                                        |
| `src/lib/`                | ตั้งค่าเครื่องมือหรือบริการ เช่น API client                       |
| `src/utils/`              | ฟังก์ชันทั่วไป เช่น จัดรูปแบบวันที่                               |
| `src/types/`              | Types ที่ใช้ร่วมกันหลายฟีเจอร์ เมื่อมีการใช้ types จริง           |
| `src/styles/`             | Global styles และ design tokens                                   |

อย่ารวม UI และ business logic ทุกฟีเจอร์กลับเข้า `App.jsx` ให้ pages เน้นการประกอบหน้า ส่วน logic เฉพาะฟีเจอร์อยู่ใน features สร้างโฟลเดอร์เมื่อมีหน้าที่จริง ไม่ต้องเพิ่มโฟลเดอร์ว่างให้ครบตาราง

### Naming convention

| ประเภท                  | รูปแบบ / ตัวอย่าง                                                    |
| ----------------------- | -------------------------------------------------------------------- |
| โฟลเดอร์                | `kebab-case`: `campaigns/`, `job-postings/`                          |
| React component และไฟล์ | `PascalCase`: `CampaignForm.jsx`                                     |
| Page                    | `PascalCase` + `Page`: `CampaignDetailPage.jsx`                      |
| Layout                  | `PascalCase` + `Layout`: `DashboardLayout.jsx`                       |
| Hook และไฟล์            | `camelCase` ขึ้นต้นด้วย `use`: `useCampaigns.js`                     |
| ไฟล์ทั่วไป              | `camelCase`: `campaignApi.js`, `formatDate.js`                       |
| ตัวแปร / properties     | `camelCase`: `campaignId`, `selectedReviewers`                       |
| ฟังก์ชัน                | `camelCase` เริ่มด้วยคำกริยา: `createCampaign`, `formatDate`         |
| Boolean                 | ขึ้นต้นด้วย `is`, `has`, `can`, `should`: `isLoading`, `canEdit`     |
| ค่าคงที่ระดับโมดูล      | `UPPER_SNAKE_CASE`: `PRELIST_REVIEWERS`, `DEFAULT_PAGE_SIZE`         |
| Type / Interface        | `PascalCase`: `Campaign`, `CampaignFormValues` ไม่เติม `I` หรือ `T`  |
| Component props type    | ชื่อ Component + `Props`: `CampaignFormProps`                        |
| Schema                  | `camelCase` + `Schema`: `campaignFormSchema`                         |
| Context / Provider      | `PascalCase` + `Context` / `Provider`: `AuthContext`, `AuthProvider` |
| Test                    | ชื่อไฟล์เดิม + `.test`: `CampaignForm.test.jsx`                      |
| CSS Module เมื่อจำเป็น  | ชื่อ Component + `.module.css`: `CampaignForm.module.css`            |
| URL path ใหม่           | `kebab-case`: `/deal-sheets/:dealSheetId`                            |

- Event handler ภายใน component ใช้ `handle` เช่น `handleSubmit`, `handleDelete`
- Callback ผ่าน props ใช้ `on` เช่น `onSubmit`, `onDelete`, `onConfirm`
- ฟังก์ชันทำงานจริงใช้คำกริยาตรง ๆ เช่น `deleteCampaign`
- รายการใช้พหูพจน์ (`campaigns`) รายการเดียวใช้เอกพจน์ (`selectedCampaign`)
- API/data access ตั้งชื่อให้รู้ผลลัพธ์: `getCampaigns`, `getCampaignById`, `createCampaign`, `updateCampaign`, `deleteCampaign`
- หลีกเลี่ยงชื่อกว้าง เช่น `data`, `item`, `temp` เมื่อมีชื่อเฉพาะที่ชัดกว่า
- ใช้ `create` สำหรับสร้าง, `update` สำหรับแก้ข้อมูล, `submit` สำหรับส่งเข้าสู่ขั้นตอนถัดไป
- Boolean เป็นประโยคบอกเล่า เช่น `isEnabled` เพื่อหลีกเลี่ยงปฏิเสธซ้อน
- สถานะของ domain เดียวกันใช้ชุดค่าเดียวกัน และแยกข้อความแสดงผลภาษาไทยออกจากค่าที่ใช้ในโค้ดเมื่อเพิ่มหรือปรับ logic สถานะ
- รักษาชื่อและค่าตามสัญญา backend/localStorage เดิม หาก frontend ใช้รูปแบบต่างกัน ให้แปลงที่ชั้น API/data access และดูแล compatibility ไม่เปลี่ยนข้อมูลเก่าเงียบ ๆ

### Tailwind CSS และ spacing

- ใช้ Tailwind utility classes ใน JSX เป็นหลัก ส่วน recipe ที่ใช้ร่วมกันใช้ `@apply` ใน `@layer components` ได้
- ใช้ theme และ brand tokens ใน `src/styles/global.css` คงสี Buddy Review และฟอนต์ Bai Jamjuree
- ระยะหลักของ container, card, section และ form grid ใช้สเกล 4px เช่น 8/12/16/20/24/32px
- ค่าอ้างอิงของ UI ปัจจุบัน: section/form grid gap 24px, label/input gap 8px, ระหว่าง project cards 20px; บนมือถือ card padding 12px และ content gap 16px
- รักษาระยะ 20px ระหว่างข้อความไม่พบประกาศกับปุ่มล้าง filter ตามข้อกำหนดเดิม
- ใช้ค่าเฉพาะได้เมื่อจำเป็นต่อ calendar/table geometry หรือ visual source อย่าปัดค่าทั้งหมดโดยไม่ตรวจหน้าจอ
- หลีกเลี่ยง inline spacing styles ที่ทับ responsive utilities
- คง explicit reset ปัจจุบันไว้ Tailwind Preflight ยังไม่ได้เปิดใช้ อย่าเพิ่มโดยไม่ตรวจผลต่อ headings, tables และ forms
- ตรวจ desktop และ viewport แคบเมื่อแก้ layout: ชื่อไม่ทับ badge, ข้อความปุ่มอ่านได้ และ fixed footer/toolbar ไม่บังเนื้อหาท้ายหน้า
- รัน server และเปิด preview เองเมื่อแก้ UI พร้อมตรวจภาพหน้าจอจริงตามข้อกำหนดด้านบน

### Prettier และการจัดรูปแบบ

- ใช้ config เดิมใน `.prettierrc.json` เป็น source of truth และรักษา `.prettierignore`
- กติกาปัจจุบัน: `semi: true`, `singleQuote: true`, `tabWidth: 2`, `useTabs: false`, `trailingComma: 'all'`, `printWidth: 100`
- หลังแก้ไฟล์ รัน `npm run format` และ `npm run format:check` ให้ผ่าน
- อย่าสร้าง formatter config ซ้ำ หรือเปลี่ยน style ตามความชอบของ agent
- `.prettierignore` ข้าม `node_modules`, `dist`, `build`, `coverage`, lockfile, visual artifacts และไฟล์ Sites ที่ต้องคงไว้ อย่าลบ ignore เดิมโดยไม่มีเหตุผลจากงาน
- งาน formatting อย่างเดียวต้องเปลี่ยนเฉพาะรูปแบบ ไม่เปลี่ยน logic, behavior, ชื่อไฟล์, ตัวแปร หรือโครงสร้างโปรเจกต์
- ตรวจ diff ก่อนส่งงาน หากไม่มี Git ให้เทียบกับ snapshot ก่อนแก้ อย่าอ้างว่าตรวจ diff แล้วหากไม่มีหลักฐาน

### การตรวจงานและส่งมอบ

1. อ่าน scripts จาก `package.json` และรักษา scripts เดิมเมื่อเพิ่ม script ใหม่
2. รัน `npm run format:check` หลังแก้ไฟล์
3. เมื่อแก้ code, dependencies หรือ build config ให้รัน `npm run build` และ `npm run test:sites`
4. หากมี lint/typecheck scripts ให้รันด้วย ปัจจุบันยังไม่มีสอง scripts นี้ ให้รายงานตามจริง ไม่สร้าง scripts หรือแปลง stack เพียงเพื่อให้มี check
5. ตรวจพฤติกรรมที่เกี่ยวกับงานและหน้าจอจริงเมื่อแก้ UI โดยไม่เปลี่ยนข้อมูลจริงนอกขอบเขต
6. รักษาไฟล์ Sites ที่ระบุด้านบน และตรวจ output ที่ build ต้องสร้างก่อนส่งต่อ Sites
7. สรุปว่าแก้อะไร, ตรวจอะไรผ่าน และข้อจำกัดที่เหลือ หากพบปัญหาเดิมหรือปัญหานอกขอบเขต ให้รายงานแยก อย่าขยายงานไปแก้เงียบ ๆ

อัปเดต `AGENTS.md` เมื่อผู้ใช้ให้กติกาหรือการตัดสินใจที่ควรใช้ต่อในรอบหน้า โดยไม่บันทึกข้อมูลลับหรือรายละเอียดชั่วคราวของแต่ละงาน

The Brief list shows each Brief’s total linked job postings and counts for every recruitment status, using the same Bangkok date-derived statuses as Brief Detail. Show zero counts as well.

Job posting creation offers Save as Draft alongside Public Link creation. Draft saving requires only the posting name, preserves partial form values and the originating Brief ID, and returns to the linked Brief. Explicit drafts remain drafts regardless of recruitment dates; saving through the regular action publishes them.

Job Posting Detail displays the announcement viewer count in its summary card. Counts are scoped to each posting and preserved when editing; prototype seed counts are sample data, not live analytics.

Job posting forms stack Working / Event Date above Application Period vertically on all screen sizes. Keep Start Date and End Date paired within each section.

The Brief list's primary action is สร้างบรีฟ and opens /briefs/create. Brief creation includes Basic Information only: required Project Name and Brand, optional Cover Image (PNG/JPG/JPEG up to 3 MB). Store briefs separately from postings and show new briefs in the list/detail with linked-posting counts. New job postings default Project Name, Brand, and Cover Image from their originating Brief, remain editable, and default Owner / Assign Buyer to the active user's email. Editing postings preserves their saved values. Brief form Back/Cancel returns to /briefs.

Brief Detail’s แก้ไขบรีฟ action opens /briefs/:id/edit using the same form as /briefs/create, with saved Project Name, Brand, and Cover Image. Save updates the existing Brief; Save, Back, and Cancel return to its Brief Detail.

Platform required fields show a circular social media logo before each platform name in Project and Job Posting forms.

Job Posting Creator Criteria follows the supplied campaign-create reference: stacked white Goals (Target influencer and Target post), Target group, reviewer gender checkboxes and paired age/follower MIN/MAX inputs, two-column platform cards with circular logos and scope hints, and grouped scope radio options with blue selected states. Apply this only to Job Posting forms; keep Project forms and Basic Information unchanged. Preserve all criteria when saving drafts and editing.

Job Posting forms place required campaign type at the top: Normal (default) and Confidential campaign, with descriptions and blue selected radio cards matching the supplied reference. Basic Information is the final section: centered square brand logo with upload/remove, full-width Campaign Title (existing name) and Campaign Subtitle, followed by editable Brand and Owner / Assign Buyer. Persist campaignType and subtitle with draft/edit data; drafts still require only the title. This supersedes keeping Job Posting Basic Information unchanged; Brief and Project forms remain unchanged. The Job Posting form wrapper uses a centered layout with max-width: 800px, similar to Campaign Step 1.

Job Posting forms use the supplied Thai campaign-period layout: heading ระยะเวลาของแคมเปญ and its helper text, recruitment dates first, campaign dates second, paired labeled inputs with a dash and calendar icons. Display dates as day / month / Buddhist year while preserving ISO date values in saved data. This supersedes the previous Working / Event Date above Application Period order.

Job Posting Detail and linked posting lists (Calendar and Table) show per-posting announcement viewer and applicant counts. Display missing viewer counts as 0 คน; prototype viewer counts are sample data.

Announcement viewer-count labels use “เปิดดูประกาศ” in Job Posting Detail and linked posting Calendar/Table views.

Prototype announcement sample counts use a 10% viewer-to-applicant conversion (viewerCount = applicants × 10). Draft and upcoming seed postings with no applicants use zero viewers.

Job Posting Detail shows the saved fields from the current Job Posting form, including campaign type, complete Creator Criteria, campaign periods, compensation/benefit, reference link, and Basic Information. Use the saved reviewer target and show missing information explicitly rather than substituting invented sample values.

Job Posting Detail and Job Posting forms follow the existing Buddy Review design system: Bai Jamjuree typography, purple primary actions, consistent section headings, borders and 4px spacing. Keep the required blue selected campaign/criteria options and scope visual changes to these posting screens.

All pages use fluid content widths that expand with the viewport, without desktop maximum-width caps. Preserve responsive outer gutters, sidebar space, and readable internal layouts; the floating reviewer toolbar follows the main content width. Modals retain bounded widths.

Project Detail does not show the Lifecycle card or its numbered status stepper. Keep the project summary status badge. Project Detail does not show status-change buttons, including “เปลี่ยนเป็น On Going”.

Project Detail displays brand logo, project name, Project ID, Assign PM, all quotation numbers (first is Main) with saved addition metadata, all Brief numbers and Groups, Goal (Target Influencer, Target Post, Target Reach), Budget (Total project cost, Contingency cost), and creation/update metadata. Keep the existing Buddy Review styles, display zero values, and show missing saved data explicitly.

Project Create and Edit actions open https://manage.buddyreview.co/project/create/uGvkPwRGps in a new tab. Remove local Project Create/Edit forms; legacy form routes return to the Project list. Project Detail continues showing saved project information. This supersedes prior local Project form requirements.

Campaign Create/Edit follows the four supplied campaign-create screenshots: Setting → Campaign info → Brief → Payment offer & Reward. Setting has OP, Group, campaign status/type, periods, workflow, demographic toggles. Steps 2–4 show a settings preview beside the form. Keep campaign form data separate from job postings, persist edits, and return to Campaign Detail after save. Use blue selected options and blue wizard navigation as shown in these campaign references.

Campaign Step 1 can select a source job posting by Brief ID. Import and persist a per-campaign source snapshot; show its identity in the form/preview and Campaign Detail. Only overlapping posting fields are read-only (campaign type, title/subtitle/logo, Creator Criteria, recruitment/campaign periods, general brief and benefit). Keep campaign-only settings editable. Missing source values remain missing rather than using invented defaults. The selected-reviewer Brief section (file/link) remains editable. Persist the source association and read-only behavior when reopening Edit. Selecting another posting replaces inherited values; clearing the source restores the campaign's previous values.

Campaign Create/Edit now uses two steps: เลือกประกาศต้นทาง → ตั้งค่าแคมเปญเพิ่มเติม. The second step shows editable campaign-only fields, selected-reviewer Brief and points; inherited posting data is collapsed under ดูข้อมูลจากประกาศ with a lock icon, not repeated as disabled form inputs. Additional optional campaign settings are collapsed. Editing a campaign with a source posting opens directly on step 2, with an explicit change-source action. Campaigns without a source can still be entered manually in the same two-step flow. This supersedes the earlier four-step form layout.

Campaign source selection has no Brief ID search/input. Offer only Brief IDs saved by PM on the parent Project (`briefNumbers` / legacy `briefNumber`), then postings linked to the selected Brief. Automatically select a sole project Brief. If the Project has no Brief ID, show a missing-project-Brief message instead of offering unrelated global Brief IDs. Preserve saved source snapshots on Edit.

Campaign ดูข้อมูลจากประกาศ reuses JobPostingSummary and JobPostingInformation from Job Posting Detail, including the same cards, field layout, icons, platform logos and date formatting. Render the saved source posting snapshot without Campaign edits; keep this view read-only and preserve the collapsed panel. The shared summary only shows an edit action when explicitly given onEdit.

Campaign Step 1 is Setting / ตั้งค่าแคมเปญ and contains posting selection plus Assign OP, Group, campaign status, and follower-demographic toggles, stacked vertically. Step 2 has a Preview campaign setting card on the left using current saved/form values and stacked editable fields on the right. Retain the two-step flow, shared read-only posting panel and editable selected-reviewer Brief. This supersedes placing OP/Group/status/demographics on step 2 and its two-column editable-card grid.

Campaign Step 1 form shell is centered with max-width: 800px (an explicit exception to the fluid-width rule); Step 2 stays fluid. Campaign action footer is sticky at the bottom of the viewport, with an opaque background, stacking priority and mobile safe-area spacing. Keep footer in document flow so the final content remains reachable.

Campaign Step 2 is labeled รายละเอียดงานสำหรับนักรีวิว with helper text ระบุขั้นตอนส่งงาน บรีฟ และแต้มรางวัลสำหรับแคมเปญนี้.

On Campaign Step 2, source posting identity (name, Brief/Job IDs), change-source action and shared read-only ดูข้อมูลจากประกาศ panel belong inside Preview campaign setting. Keep editable workflow, selected-reviewer Brief and reward fields in the right form column.

Campaign Step 2 Preview campaign setting now shows only the source posting name as a link to its Job Posting Detail and the Brief ID · Job ID line. Remove other settings, change-source action and expandable posting details from this Preview. This supersedes the earlier expanded Preview contents; source selection and shared posting details in Step 1 remain available.

Correction: only the posting portion of Campaign Preview is compact (linked posting title and actual Brief ID · Job ID); retain Project, OP, Group, status/type, periods, workflow and demographics beneath it. Step 2 helper text is ระบุข้อมูลสำหรับทำงาน. This supersedes removing all other Preview settings.

Campaign Step 2 shows Product option, shipping, Do, Don’t, example images and example videos openly as sibling cards alongside the reward section. Remove the ตั้งค่าเพิ่มเติม (ไม่บังคับ) accordion; these fields must not be hidden.

Campaign Preview labels its source posting section ประกาศ using the same dt/dd styling as Project and Assign OP. Step 1 has editable ชื่อแคมเปญ immediately below Assign OP; selecting a posting defaults it to the posting title. Campaign name is an exception to inherited read-only fields: persist user edits across save/reopen without overwriting from the source, while Preview still shows the original source posting title.

Campaign Step 1 does not show the ดูข้อมูลจากประกาศ expandable panel. Selected posting is a compact confirmation card: ประกาศที่เลือก label, title, Brief ID · Job ID, a short read-only explanation and a separate action row for ดูประกาศต้นทาง / ยกเลิกการใช้ประกาศ. Keep selection/import logic and editable campaign name intact.

Campaign forms use a consistent typography hierarchy across both steps: page title 24px/600, step heading 20px/600, card headings 18px/600, field labels 14px/500, entered values and primary options 16px/400, helper text 14px/400, and compact Preview labels/metadata 13px. Inputs must not inherit bold weight from Field labels. Keep Bai Jamjuree and scope these refinements to Campaign forms.

Reward points (แต้มรางวัลสำหรับงานนี้: Fix point / Auto point, points and 10-point-per-baht value) belong to Job Posting Create/Edit/Detail, not the Campaign form. Persist pointType/points in postings including drafts and edits; inherit saved posting points into campaigns as read-only source values. Preserve existing campaign points when a legacy source posting has no point fields. Missing legacy posting points are shown explicitly, not as invented zero values.

Campaign selected-reviewer Brief is required on Create/Edit: provide at least one uploaded brief file or a valid HTTP/HTTPS brief link before saving. Show a required marker, clear inline validation, and keep this section editable even when a source posting is selected.

Product option belongs to Job Posting Create/Edit/Detail, not Campaign forms. Allow adding/removing product entries and preserve products in drafts/edits. Detail displays saved products or ยังไม่ระบุ. Campaigns inherit saved source posting products as read-only data; preserve legacy campaign products when the source has no products field.

Campaign Detail header uses normal document flow for identity, controls and tabs, with consistent 24px section gaps. Keep workflow stages 24px below the header, secondary statuses 16px below stages and compact 12px button gaps; allow wrapping and horizontal tab scrolling on narrow screens.

Campaign Create/Edit posting selection uses compact checkbox rows, title/Job ID search, All/Selected tabs with counts, six-row pagination, per-row source links and clear selection. Preserve multiple selection across search, pages and Brief changes; do not repeat selected postings as large summary cards. Only offer Briefs linked to the parent Project and retain saved snapshots on Edit.

Campaign posting selection rows show a compact circular posting Avatar. Remove the Selected tab; use one posting list with a selected count, search and pagination. This supersedes the previous All/Selected tabs requirement.

Job Posting JOB20260901’s ดูหน้าประกาศ action opens https://www.buddyreview.co/campaign/EMr3CC9K56/preview in a new tab.

Brief Create/Edit form content is centered with a maximum width of 800px and retains responsive outer gutters. This is an explicit exception to the fluid-width rule.

Brief Create/Edit fields use a single vertical column on all screen sizes, ordered Project Name, Brand, Cover Image, within the centered 800px maximum-width form.

Brief Create/Edit logo field follows the supplied reference: centered 240px square, โลโก้แบรนด์ required label, contained image preview with a top-right remove button, camera upload placeholder with PNG/JPG up to 3 MB helper, red dashed empty border and กรุณาเพิ่มรูป message. A logo is now required to save a Brief, superseding the optional Cover Image rule. Keep Project Name and Brand stacked above it and store the logo in the existing image field.

Brief Create/Edit logo upload and preview are 120 × 120px, superseding the earlier 240px size. Scale the placeholder and top-right remove button to fit this size.

Brief Create/Edit places the centered 120px logo field above Project Name and Brand. Logo label, format/size helper and validation text use 1rem; place the helper outside the square below it to avoid cramped text. This supersedes the previous logo-last field order.

Brief logo reference correction: keep file-format/size helper inside the empty dashed upload square below a camera-with-plus icon; do not show this helper beneath a saved logo. Keep 120px square and 1rem text, logo above Project Name, and the missing-image message below the square. This supersedes the helper-outside rule.

Brief Create/Edit includes a required editable Brief ID below the logo. Validate allowed English letters, digits, hyphens/underscores and duplicate IDs. Saving navigates to the entered ID; renamed Briefs keep legacy ID aliases so linked postings and Project Brief selections resolve to the current ID without losing saved Campaign snapshots.

Brief Create/Edit uses the supplied repeatable Brief list: numbered rows, drag handles, delete actions, เพิ่มบรีฟ and per-part validation for XXXYYYYMMNNN (three English letters, four-digit AD year, month 01–12, sequence 000–999). Persist ordered briefNumbers; first number is the primary route ID and other numbers resolve to the same Brief. Reject duplicate numbers within a form and across Briefs; support keyboard arrow reordering. This supersedes the single Brief ID input and permissive ID format.

Brief Create/Edit field order is logo → Project Name → Brand → Brief IDs → Product option. Product option belongs to Brief Create/Edit/Detail and is removed from Job Posting forms/detail. Persist products on Briefs; surface existing linked-posting products as a legacy fallback until the Brief saves its own products, including an explicit empty list. Campaign source imports inherit products from the linked Brief; preserve existing saved campaign snapshots. This supersedes posting-owned Product option.

Brief Create/Edit uses the supplied Project form visual reference: white page/header, centered pale #f7f9fb form shell (800px maximum) with 24px padding/gaps, separate white minimally rounded cards without shadows for logo/name/Brand, Brief IDs and Product option. Remove the numbered Basic Information heading and subtitle. Use pale input borders, slate text, blue add actions, green ID validation and centered footer actions with purple primary. Keep existing Brief fields and behavior; do not add Project-only fields from the reference.

Brief Product option follows the supplied product references: empty numbered เพิ่ม product row; added items have draggable numbered rows and pale cards with required image upload (PNG/JPG/JPEG/AVIF ≤3 MB), required product name, optional description and top-right delete. Persist product objects {name,image,description}, display images/name/description on Brief Detail, and preserve legacy string products by normalizing them without requiring missing legacy images. Keep desktop image/form columns and stack on mobile.

Brief Create/Edit footer places Cancel at the left edge and Create/Save at the right edge of an 800px maximum-width action row, on desktop and mobile. Keep buttons in one horizontal row; this supersedes centered/stacked Brief footer actions.

Brief Create/Edit Brand is a required free-text input, with no options, autocomplete or dropdown. Preserve existing values and trim whitespace on save; reject blank/whitespace-only values. This supersedes the Brand picker for Brief forms only.

Brief List and Brief Detail share the same summary identity layout: Project Name as the title, Brand as the subtitle, and all saved Brief numbers as badges beneath it (legacy fallback to id). Use a shared BriefSummary component; keep list posting counts and detail edit-chip behavior. Search all saved Brief numbers in the list.

Brief Detail uses the Project Detail design system for summary identity, purple underline tabs, white bordered section cards, slate typography and consistent 24px spacing (12px card padding on mobile). Preserve recruitment Calendar/Table controls, tab counts and Product Option behavior.

Requirement documents should be written as detailed PO briefs for developers: explain business goals, scope, entity ownership, business rules and dependencies, validation, state transitions, edge cases, navigation and testable acceptance criteria. Distinguish confirmed requirements, current prototype behavior and unresolved PO decisions; do not silently invent business rules.

Job Posting Create/Edit sections are numbered: 1 Setting (Owner / Assign Buyer and campaign type), 2 Creator Criteria, 3 Job Information (existing short brief and periods plus Reference Brief), 4 Compensation. Keep Basic Information and reward points. Owner is shown only in Setting. Compensation options stack vertically; only the selected option expands its budget/product fields immediately beneath it. Product / Benefit Detail offers saved products from the originating Brief or Other free text; persist the chosen product snapshot/source with the existing benefit text for draft/save/edit compatibility.

Job Posting Create/Edit uses the Project form visual system already applied to Brief forms: white page/header, centered 800px pale #f7f9fb shell, white minimally rounded cards without shadows, slate typography, pale 6px-radius inputs, 24px section gaps and purple primary footer actions. Use plain section headings without numbered chips. Keep the four section groups, conditional Compensation fields and blue selected campaign/criteria styling.

Job Posting Create/Edit Job Information field order is Short Brief → Reference Brief → campaign periods. Place Reference Brief directly below Short Brief.

Job Posting Create/Edit uses a Campaign-style four-step wizard: Setting → Creator Criteria → Job Information → Compensation. Basic Information belongs to Job Information; reward points belong to Compensation. Keep Reference Brief below Short Brief. Preserve entered data across steps, provide Previous/Next and clickable step navigation, keep Save as Draft available on Create, and show publish/save on the last step. Final validation opens the step containing the first error. Use the existing Campaign stepper and blue wizard navigation while retaining Project-style form cards.

Job Posting wizard shows a Campaign-style centered “Step N: Title” and Thai helper above the shell. Each functional section is a separate white card: Setting splits Owner and campaign type; Creator Criteria keeps its groups as sibling cards; Job Information splits Short Brief, Reference Brief, campaign periods and Basic Information; Compensation and reward points remain separate cards.

Job Posting wizard Basic Information (brand logo, Campaign Title, Campaign Subtitle and Brand) is in Step 2 above Creator Criteria, superseding its earlier Step 3 placement. Validation of these fields navigates to Step 2.

Job Posting Step 2 places Basic Information (logo, Campaign Title, Campaign Subtitle and Brand) directly after the Creator Criteria scope section, superseding its earlier placement above Creator Criteria.

Job Posting forms remove the editable Brand field while retaining originating/saved brand data. Confidential campaign adds a separate card after scope and before Basic Information for pending/rejected reviewers: orange-highlighted audience heading, fixed Buddy Review logo, required separate Campaign Title and Subtitle. Persist confidentialTitle/confidentialSubtitle through draft/save/edit; require these only when publishing Confidential, and preserve them when switching type.

Confidential Job Posting Basic Information displays “ข้อมูลที่แสดงสำหรับ นักรีวิวที่ผ่านการคัดเลือกเท่านั้น” above the editable brand logo, with the selected-reviewer phrase blue. Its saved title/subtitle labels are Confidential campaign Title and Confidential Campaign Subtitle. Normal/Private retain existing labels; separate pending/rejected information remains above this card.

Job Posting Edit has a pale-blue คัดลอกประกาศ button at the upper right like the Campaign reference. Open a new Create wizard prefilled from the saved posting in a new tab, retain its linked Brief and form values, suffix the title with (สำเนา), use a new ID on save and reset applicants/viewers. Do not copy reviewer decisions or create a posting until Draft/Publish is clicked.

Private Campaign Job Posting Create/Edit hides the recruitment period inputs and recruitment-dependent helper text. Keep campaign working dates available and preserve entered recruitment dates when switching campaign types within the form. Recruitment dates are not required for Private Campaign.

Job Posting publish/create and edit save validate first, then show a confirmation dialog offering an optional Preview action opening https://www.buddyreview.co/campaign/EMr3CC9K56/preview in a new tab. Preview does not save or close the dialog. Confirm persists the posting; create confirmation navigates to /job-postings/JOB20260901, while edit confirmation returns to the edited posting Detail. Draft saving retains its existing direct-save flow.

Job Posting JOB20261001’s ดูหน้าประกาศ action opens https://www.buddyreview.co/campaign/EMr3CC9K56/preview in a new tab, matching JOB20260901.

Correction: clicking the final Job Posting Create/Edit save action opens the Preview/confirmation modal immediately, including incomplete forms. Confirm then validates, closes the modal and navigates to the first invalid step when needed; persist and navigate only after validation passes. This supersedes validation before showing the dialog.

Job Posting save confirmation modal centers Preview as the primary action with a new-tab helper. Separate footer places กลับไปแก้ไข on the left and the outlined confirmation action on the right. Keep the modal compact, bounded and responsive; preserve save/Preview behavior.

Job Posting Detail places its แก้ไข action at the top-right of the summary card instead of overlaying the avatar. Reserve space so it does not overlap the title on desktop or mobile. Brief edit placement remains unchanged.

Job Posting reviewer selection toolbar keeps select-all and the count left-aligned, with the count formatted (เลือก N คน). Group bulk Reject / Accept actions at the right edge, preserving Reject before Accept.

The bulk Reject button in the Job Posting reviewer selection toolbar uses a red outline, red text/icon and white background, with a pale-red hover state. Keep the disabled state when no reviewers are selected.

Campaign Task stage tabs start with Influencer List → Confirm List → Content Idea → Drafting → Posts. Confirm List is the renamed existing Influencer List and retains its table and tools. The new Influencer List is a separate tab before Confirm List; its data and workflow are not yet specified.

Campaign Influencer List follows the supplied five-row reference: status pills ทั้งหมด, รอทีมงานตรวจสอบ, รอนักรีวิวยืนยัน, นักรีวิวยืนยันแล้ว with counts and filtering; table columns นักรีวิว, แคมเปญ, ประเภทนักรีวิว, สถานะ, รหัสแคมเปญ. Include profile/platform and via information, campaign platforms, Normal or ยังไม่ระบุ, colored status badges and copyable confirmed codes; unconfirmed codes show ยังไม่ยืนยัน. Use reference sample rows until a data source is specified; keep Confirm List separate.

Campaign Influencer List hides the ADMIN IGNORED, BRAND IGNORED, CANCELED and RESERVED secondary-status row. Keep its own status filter pills 24px below the campaign stage tabs. Other stages retain their existing secondary-status row.

Campaign Influencer List displays the buyer-review status as รอทีมงานตรวจสอบ in filters, table badges and profile information, superseding Buyer ตรวจสอบ. Preserve the existing internal status value and orange badge styling.

Brief Create/Edit labels the name field Brief Name (stored in existing name), has exactly one editable Brief ID with existing format/duplicate validation, and retains Product Option. Remove repeatable ID add/delete/reorder controls; keep legacy IDs resolving after edits. Goals belong to Campaign Create/Edit: editable Target influencer and Target post, including campaigns with source postings, saved independently of inherited posting criteria. Brief has no Goals section.

Announcement Create/Edit keeps the existing four-step wizard but uses Confidential only, no campaign-type choice, target counts, image uploads or separate gender/age inputs. Special Criteria is a combined free-text field for expertise and demographic requirements. Target Group Name is generated from Special Criteria, Platform and Follower Range. Scope of Work uses a template and a short editable supplement (200 characters). Owner remains editable; compensation explicitly stores wage including travel and Product Value (zero allowed). Recruitment is controlled by Active/Inactive, separate from Draft; no recruitment dates. Retain optional campaign working dates and legacy saved values for compatibility. New-format Detail shows actual applicant count instead of targets. Manual-status undated announcements remain reachable from Calendar's undated Table link; old date-based announcements keep existing behavior until saved through the new form.
Campaign forms add an Announcement ID selector without replacing the existing source picker. Campaign Influencer List previews applicants from linked project announcements, allows selecting import rows, excludes rejected accounts and duplicates, and persists imported reviewers per campaign. Imported applicants start รอทีมงานตรวจสอบ. New announcements have no global seed applicants; legacy sample announcements retain their sample reviewers.

Brief Create/Edit is a compact single-card form with exactly two fields, ordered Brief Number / Work Order ID then Brief Name. Remove Brand, logo/product images, Product Option and redundant sections/ID check chips from the form. Require only these two fields, retaining current ID format and duplicate validation, explicit navigation and legacy ID aliases. Edit updates name/ID only, preserving previously saved Brand/images/products without requiring them. This supersedes all prior Brief form field/image/product requirements; do not delete existing saved content.

Announcement Create/Edit displays all sections in one continuous form, without wizard stepper, step titles or Next/Previous actions. Keep the current section order, fields, draft/save confirmation and persistence; validation scrolls to the first invalid field on the same page. This supersedes the announcement four-step wizard.

Brief Create/Edit uses a bounded modal over Brief List / Brief Detail with the existing two fields. Remove standalone Brief form pages. Create opens from สร้างบรีฟ; Edit opens from the summary edit action. Cancel, close, backdrop and Escape dismiss without navigating; preserve underlying filters/tab/calendar state. Creation saves and opens the new Brief Detail; editing refreshes Detail and navigates only if its ID changes. Legacy /briefs/create and /briefs/:id/edit links open the corresponding parent page with its modal. Include focus trapping/restoration and body scroll lock. Product Option has no add action because product editing was removed from Brief forms.

Brief Detail recruitment postings use Table only. Remove Calendar mode and the Calendar/Table toggle from Brief Detail, retaining search, status filters/counts and linked-posting scope. This supersedes previous Brief Detail Calendar requirements.

Remove Product Option from every page, including tabs, product lists, add/edit controls and campaign source inheritance. Preserve previously saved product data for compatibility. Compensation Product Value and benefit fields remain separate from Product Option. This supersedes all earlier Product Option UI requirements.

Brief Number in the Create/Edit modal validates XXXYYYYMMNNN inline while typing and on blur/save: three English letters, four AD-year digits, month 01–12 and sequence 000–999 (12 characters total). Normalize letters to uppercase, show the format/example and clear Thai errors, reject duplicate IDs including legacy aliases, and block invalid saves.

UI spacing recipes use container gap as the main source of spacing; reset direct heading/paragraph margins rather than adding duplicate margins. Dense reviewer/Confirm tables must scroll inside bounded containers without widening the document. Keep filter/action bars readable by wrapping actions and scrolling long tab rows. Verify desktop, 390px and relevant 320px cases when changing forms/tables; Announcement optional working dates stack at ≤480px for readable inputs.

Announcement Create/Edit uses Draft / Active / Inactive radio options. Draft saves require only a title and preserve partial fields; Active/Inactive saves require full validation. Combine Special Criteria, Platform and Follower Range into one section. Remove generated Target Group Name from announcement forms and Detail. Place Announcement Title, Subtitle and additional job details together in the final section of forms and Detail; job details use a rich text editor and retain formatting on save/reopen/Detail with safe rendering and legacy plain-text compatibility.

Announcement forms remove the Confidential helper and use เปิดหรือปิดรับสมัครด้วยสถานะ. Show matching colored status dots in Draft/Active/Inactive radios and Detail. Rename the criteria section คุณสมบัตินักรีวิว; Special Criteria is a multiple-selection dropdown with saved selections and legacy free-text compatibility. Follower MIN–MAX inputs have a centered dash and comma grouping while saved values remain numeric. Remove Scope of Work and Reference Brief Link UI/validation without erasing legacy saved values. Compensation labels are ค่าจ้างรวมค่าเดินทาง (บาท) and ค่าสินค้า (บาท).

Announcement Special Criteria uses the fixed 42-option list in SPECIAL_CRITERIA_OPTIONS (src/features/job-postings/announcementForm.js), in the user-supplied order and exact wording. Allow multiple selections, retain legacy selected values when editing, and replace the provisional custom-add UI with this supplied list.

Announcement compensation inputs ค่าจ้างรวมค่าเดินทาง (บาท) and ค่าสินค้า (บาท) display comma-grouped prices while typing and editing (for example 10,000). Preserve decimal entry, zero and empty draft values; save numeric amounts without formatting commas.

Special Criteria must not show the empty legacy age placeholder อายุ - ปี (including อายุ – ปี). Do not generate it from blank age bounds, and omit that placeholder when reopening saved criteria; retain meaningful criteria and actual saved age ranges.

Announcement status controls use a compact layout: group the heading and helper closely, place Draft / Active / Inactive alongside them on desktop, and stack options on narrow screens. Remove the redundant visible Status label; retain colored dots, blue selected states and accessible radio grouping.

Job Posting Detail summary and information cards follow the current continuous Announcement Create/Edit form for all postings, including legacy records. Show current field labels/order, actual applicants, status, title/subtitle, criteria, optional working dates and wage/product value; use the same legacy criteria and wage fallback as Edit without deleting saved legacy fields.

Announcement Create/Edit opens in a bounded modal over Brief Detail / Job Posting Detail, reusing the continuous form and save confirmation. Scroll the form inside the modal and keep its action footer visible. Close, Cancel, backdrop and Escape dismiss without navigating, preserving underlying filters/tabs/selection; trap and restore focus and lock body scroll. Legacy create/edit URLs open the appropriate parent with its modal; retain draft/public save destinations and saved fields. This supersedes standalone announcement form pages.

Announcement Create/Edit sponsor product / Benefit textarea has a minimum of three visible text lines, with vertical resizing available.

Remove sponsor product / Benefit detail from Announcement Create/Edit and Job Posting Detail. Preserve existing saved benefit values for compatibility. This supersedes the three-line Benefit textarea requirement; wage and product value remain.

Job Posting คัดลอกประกาศ action belongs on Job Posting Detail outside the edit modal, alongside the page actions. Keep its new-tab prefilled Create behavior; remove the copy button from the modal.

Special Criteria dropdown options use 16px text with 24px line height and at least 48px item height; allow long labels to wrap and keep the options list scrollable.

Announcement Create/Edit uses consistent 18px/28px semibold section titles and 16px/24px medium field/group labels (including Special Criteria, Platform, Follower Range and job details). Use 8px label/control gaps, 24px between groups/cards on desktop, and 16px groups/cards with 12px card padding on mobile. Keep status helper compact and compensation helper grouped with its heading.

Special Criteria dropdown floats above the form without shifting layout and includes search within the dropdown. Filter options without clearing selected criteria; retain multi-selection and legacy values.

Announcement status labels are ร่าง (Draft), เปิดรับสมัคร (Active), and ปิดรับสมัคร (Inactive) in forms, Detail and linked-posting lists. Preserve internal saved status values and legacy date-based recruitment behavior.

Job Posting Detail summary uses four rows: title followed by status (edit stays top-right), Subtitle, copyable Brief / Job ID, then เปิดดูประกาศ / ผู้สมัคร counts. Use saved per-posting counts.

Job Posting Detail ข้อมูลประกาศ section shows only รายละเอียดงานเพิ่มเติม; title/subtitle remain in the summary. Missing information displays a hyphen (-), including empty follower ranges and rich text. Preserve actual zero counts/amounts.

Follower Range represents follower counts and uses followers as its unit, never คน. Empty ranges remain -.

Job Posting Detail fields stack labels above values on every viewport with an 8px gap. Additional job details support safe clickable links, images, text colors, bold and italic. JOB20260901 includes a clearly labeled formatting example separate from saved content.

Brief Detail announcement Table paginates filtered results at 10 postings per page with Previous/Next, page numbers and visible result range. Search/status changes reset to page 1; counts cover all matching results. Include additional clearly named mock announcements linked to NRI202609058 to demonstrate pagination.

Brief Detail announcement heading/create action, filters, search, table and pagination sit directly on the page without an enclosing section card. Keep a single heading and the table’s own bounded scrolling surface.

All social media platform icons across the website use the supplied files in `public/assets/social` through the shared `PlatformLogo` component. Preserve saved platform values and support legacy spelling/case aliases.

All create/edit forms disable their create/save action until required fields pass the same validation used on submit, including trimmed text, ranges and Brief ID format/uniqueness. Announcement Draft requires only a title; Active/Inactive requires all mandatory fields. This supersedes opening announcement confirmation with incomplete required fields.

Brief Detail announcement table typography follows the Buddy Review hierarchy: primary row information uses 16px/24px; status badges/filter labels, table headings, subtitles, Job IDs and row actions use 14px/20px. Preserve these sizes on narrow viewports and scroll the table inside its bounded surface.

Job Posting Detail typography follows the announcement design system: title 24px/32px (20px/28px on mobile), section headings 18px/28px semibold, field labels 16px/24px medium, values/subtitle/counts 16px/24px, and status badges/Brief–Job IDs 14px/20px. Use the shared posting summary/information styles consistently across saved announcements.

Brief Detail announcement rows show Platform with shared social logos, Follower Range (followers) and Special Criteria from saved posting data, using the same legacy criteria fallback as Detail. Place เปิดดูประกาศ and ผู้สมัคร counts below Job ID inside the announcement cell, replacing their separate columns. Missing criteria/ranges/platforms show a hyphen; preserve zero counts and bounded horizontal table scrolling.

Brief Detail announcement table places Follower Range beneath the platform list within the Platform cell, with a small field label. Remove the separate Follower Range column.

Brief Detail announcement table shows each Special Criteria entry on its own line, with 8px gaps. Separate legacy middle-dot/newline entries for display only; preserve saved values and show a hyphen when empty.

Brief Detail announcement Follower Range uses compact English count notation (K/M, for example 10K, 100K, 10M), with up to one decimal place. Keep numeric saved bounds unchanged, zero visible and missing bounds as hyphens.

Brief Detail announcement table combines Platform and Special Criteria into a single คุณสมบัตินักรีวิว column. Stack platform logos/names, compact Follower Range, then individually stacked Special Criteria with a field label; remove the separate Special Criteria column.

Brief Detail announcement Platform appears immediately after the posting title in the same row as 16px logos only, with accessible platform names/tooltips. Remove platforms from คุณสมบัตินักรีวิว; that column retains compact Follower Range and line-separated Special Criteria.

Brief Detail announcement table removes Follower Range display and names the criteria column Special Criteria. Show only line-separated Special Criteria entries in that cell without repeating its label; retain saved follower bounds and other screens.

Job Posting Detail summary shows saved social platform logos immediately after the title in the same row, using shared PlatformLogo at 16px with accessible names/tooltips. Keep status after the title/logo group and allow long titles to wrap responsively.

Social platform icons beside announcement titles use inline-flex wrappers with centered alignment and no text line-height gap, so the 16px logos align vertically with the title text.

Job Posting Detail พรีวิวประกาศ action uses the Eye icon.

Reusable presentational components belong in `src/components/ui` or `src/components/shared`. Keep feature-specific state, persistence, validation and domain option constants in `src/features`; reuse shared components through props while preserving existing UI and behavior.

Extract duplicated general-purpose function logic into `src/utils` and reuse it through imports. Preserve each caller's defaults and behavior; keep domain-specific validation, status rules and data access in their feature.

Job Posting reviewer lists show matching table/card skeletons during pagination and after confirmed individual or bulk Accept/Reject decisions. Preserve reviewer filters, selection and saved decisions; disable bulk actions during loading and keep the current page within the available result range.

Prioritize fast initial loading and responsive interactions. Avoid artificial page-loading delays for locally available data; preserve the explicitly required reviewer pagination/decision skeletons. Preload split routes on user intent rather than eagerly loading all pages.
