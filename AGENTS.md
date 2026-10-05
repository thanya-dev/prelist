# Prototype Instructions

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

Reviewer export is restricted to customer-selected reviewers only. Disable other checkboxes and restrict select-all and export to eligible reviewers.

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

Job Posting forms place required campaign type at the top: Normal (default) and Confidential campaign, with descriptions and blue selected radio cards matching the supplied reference. Basic Information is the final section: centered square brand logo with upload/remove, full-width Campaign Title (existing name) and Campaign Subtitle, followed by editable Brand and Owner / Assign Buyer. Persist campaignType and subtitle with draft/edit data; drafts still require only the title. This supersedes keeping Job Posting Basic Information unchanged; Brief and Project forms remain unchanged.

Job Posting forms use the supplied Thai campaign-period layout: heading ระยะเวลาของแคมเปญ and its helper text, recruitment dates first, campaign dates second, paired labeled inputs with a dash and calendar icons. Display dates as day / month / Buddhist year while preserving ISO date values in saved data. This supersedes the previous Working / Event Date above Application Period order.

Job Posting Detail and linked posting lists (Calendar and Table) show per-posting announcement viewer and applicant counts. Display missing viewer counts as 0 คน; prototype viewer counts are sample data.

Announcement viewer-count labels use “เปิดดูประกาศ” in Job Posting Detail and linked posting Calendar/Table views.

Prototype announcement sample counts use a 10% viewer-to-applicant conversion (viewerCount = applicants × 10). Draft and upcoming seed postings with no applicants use zero viewers.

Job Posting Detail shows the saved fields from the current Job Posting form, including campaign type, complete Creator Criteria, campaign periods, compensation/benefit, reference link, and Basic Information. Use the saved reviewer target and show missing information explicitly rather than substituting invented sample values.

Job Posting Detail and Job Posting forms follow the existing Buddy Review design system: Bai Jamjuree typography, purple primary actions, consistent section headings, borders and 4px spacing. Keep the required blue selected campaign/criteria options and scope visual changes to these posting screens.
