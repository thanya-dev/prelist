# Requirement — ประกาศหานักรีวิวและหน้าภายใน

วันที่ตรวจ: 8 ตุลาคม 2026 (Asia/Bangkok) · รูปแบบ: Jira User Story — Thanya PO Style

เอกสารนี้ครอบคลุมเมนูประกาศหานักรีวิว: Brief List, Brief Detail, Brief Create/Edit, Announcement Create/Edit/Copy, Job Posting Detail และรายชื่อนักรีวิว รวม navigation, modal, confirmation, selection และ export ไม่แก้แอปและไม่สร้าง Jira tickets จริง Project/Campaign ครอบคลุมเฉพาะ dependency ของประกาศ ไม่ขยายเป็น requirement ของโมดูลเหล่านั้น

หลักฐาน: [Prototype](https://prelist-mu.vercel.app/briefs), [GitHub](https://github.com/thanya-dev/prelist), [Field Inventory](page-field-inventory.md), [กติกาปัจจุบัน](AGENTS.md), [requirement เดิม](requirement-2026-10-06.md) และ Source Code ใน workspace อ้างอิง Source ณ รอบตรวจบน workspace (HEAD e84e35719c33ad66940fe867f72e060384b216df พร้อม working-tree changes ระหว่างรอบงาน); ใช้ข้อกำหนดล่าสุดที่ผู้ใช้ระบุเมื่อกติกา supersede กัน ไม่ได้ยืนยันว่า requirement เดิมทุกข้อผ่าน business sign-off

คำจำกัดความหลักฐาน:

- **Implemented**: ตรวจพบใน Source Code; ไม่เท่ากับผ่านการทดสอบ end-to-end หรือพร้อม production
- **Specified**: มีข้อกำหนดจากผู้ใช้/AGENTS.md รองรับ แต่ยังไม่ยืนยัน implementation ครบ
- **Gap**: implementation แตกต่างจาก Specified
- **Pending Confirmation**: ไม่พบหลักฐานเพียงพอ ห้ามถือเป็น business rule ที่อนุมัติแล้ว

ได้เปิด Prototype จริงแบบอ่านอย่างเดียว: Brief List → Create Brief modal → ยกเลิก → Brief Detail NRI202609058 → Create Announcement modal และตรวจ fields ที่แสดง รวม Job Posting Detail → รายชื่อนักรีวิว ไม่บันทึกข้อมูล/ตัดสินใจนักรีวิว/ส่งข้อความภายนอก การ persist, export และสถานะหลัง save อ้างอิง static source inspection ไม่ใช่ผล mutation test ไม่ได้เทียบทุกไฟล์ของ remote branch กับ workspace

ผู้ใช้หลักใน Story คือ Buyer / PM ตามเอกสารเดิม แต่ prototype active account เป็น Buyer ตัวอย่าง ไม่มี authentication หรือ role authorization guard ที่ยืนยันสิทธิ์ PM/Buyer แยกกัน สิทธิ์สร้าง/แก้ไข/คัดเลือกตาม role และขอบเขตการเห็นงานของผู้อื่นเป็น Pending Confirmation ไม่กำหนดว่า Owner เท่านั้นแก้ไขได้

## Functional Inventory grouped by Module

| Module                    | หน้า / Entry point                              | ความสามารถ / สถานะหลักฐาน                                                                                                     | Story  |
| ------------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------ |
| Brief                     | Sidebar ประกาศหานักรีวิว → /briefs              | รายการชื่อ/เลขบรีฟ, copy ID, search, 10 ต่อหน้า, total/status counts รวมศูนย์, loading/empty; Implemented                     | BRF-01 |
| Brief                     | สร้างบรีฟ; /briefs/create → parent + modal      | เลขบรีฟเดียว + ชื่อ, inline format/duplicate validation, confirmation, create; Implemented                                    | BRF-02 |
| Brief                     | /briefs/:id; แก้ไขบรีฟ; legacy edit route       | แก้เลข/ชื่อ, เก็บ metadata เดิม, alias, confirmation; Implemented แต่ mock Brief บางรายการ update ไม่ได้                      | BRF-03 |
| Announcement list         | ใต้ summary ของ Brief Detail                    | Table only, linked scope, search/status counts, 10 ต่อหน้า, copy Job ID, open detail, empty/clear; Implemented                | ANN-01 |
| Announcement              | สร้างประกาศใน Brief Detail; legacy create route | Continuous modal, owner/status, criteria, compensation, title/subtitle/rich text, confirm; Implemented                        | ANN-02 |
| Announcement draft        | ร่าง ใน form → confirm save                     | Title-only และ partial save; Specified / Gap                                                                                  | ANN-03 |
| Announcement edit         | Summary edit; legacy edit route                 | Prefill, persist fields, keep IDs/counts, status changes, preserve hidden legacy; Implemented                                 | ANN-04 |
| Announcement copy         | ทำสำเนาประกาศบน Detail                          | Prefill + (สำเนา), new ID/count reset; Implemented ใน modal แต่ new-tab requirement เป็น Gap                                  | ANN-05 |
| Announcement detail       | /job-postings/:id → ข้อมูลประกาศ                | Summary 4 rows, criteria/wage/product value/details, copy IDs, missing/zero, safe rich text, Back; Implemented                | ANN-06 |
| Announcement distribution | พรีวิวประกาศ / คัดลอกลิงก์สมัคร                 | External sample preview, placeholder application URLs, disabled states; Implemented mock; real endpoints Pending Confirmation | ANN-07 |
| Reviewers                 | รายชื่อนักรีวิว                                 | สมัคร/ทีมงานเลือกแล้ว/ลูกค้าเลือกแล้ว/Reject, List/Card, 24 ต่อหน้า, profile click, stats; Implemented sample data            | REV-01 |
| Reviewers                 | Accept / Reject ต่อรายการ                       | Confirmation, two-stage Accept, per-posting decisions; Implemented; actor display/identity เป็น Gap                           | REV-02 |
| Reviewers                 | Checkboxes / fixed toolbar                      | Cross-tab/view selection, current-page select-all, clear, bulk Accept/Reject; Implemented; exact eligibility conflict         | REV-03 |
| Reviewers                 | Export CSV (N) บนทีมงานเลือกแล้ว                | BOM CSV selected profiles; Implemented; team-only eligibility / Excel label เป็น Gap                                          | REV-04 |
| Reviewers                 | เพิ่มนักรีวิว single / Bulk Upload              | CSV/TSV/paste/template/preview/duplicates/pending per job; Specified ไม่มี entry point                                        | REV-05 |
| Reviewers                 | ส่ง Sale / ยืนยันรับงานแล้ว                     | accepted awaiting submission; external confirmation page; Specified ไม่มี accessible flow                                     | REV-06 |

ไม่มี local /job-postings list route; /briefs คือหน้ารวม ไม่มี Delete Brief/Delete Announcement, sorting control, reviewer search, Product Option, Calendar หรือ wizard ใน flow ปัจจุบัน ไม่สร้าง Story ให้ฟังก์ชันเหล่านี้โดยเดาเอง

## Proposed Story Breakdown

| ID     | Story Title                                             | ขอบเขตที่ทดสอบแยกได้                                  |
| ------ | ------------------------------------------------------- | ----------------------------------------------------- |
| BRF-01 | [Brief] ค้นหาและดูรายการบรีฟ                            | List/search/counts/pagination/copy ID                 |
| BRF-02 | [Brief] สร้างบรีฟ                                       | Create modal/validate/confirm/navigation              |
| BRF-03 | [Brief] แก้ไขบรีฟและรักษาความสัมพันธ์                   | Edit/rename/alias/preserved data                      |
| ANN-01 | [Announcement] ดูประกาศที่เชื่อมกับบรีฟ                 | Detail summary/table/filter/counts/pagination         |
| ANN-02 | [Announcement] สร้างประกาศรับสมัคร                      | Complete Active/Inactive form/confirm                 |
| ANN-03 | [Announcement] บันทึกประกาศเป็นร่าง                     | Title-only/partial values/publish later               |
| ANN-04 | [Announcement] แก้ไขข้อมูลและสถานะประกาศ                | Saved prefill/update/status/counts                    |
| ANN-05 | [Announcement] ทำสำเนาประกาศ                            | New-tab prefill/new record isolation                  |
| ANN-06 | [Announcement] ดูรายละเอียดประกาศ                       | Summary/current field layout/safe content             |
| ANN-07 | [Announcement] พรีวิวและคัดลอกลิงก์สมัคร                | External actions/eligibility/clipboard                |
| REV-01 | [Reviewer] ดูรายชื่อนักรีวิวตามสถานะ                    | Status tabs/list-card/pagination/profile              |
| REV-02 | [Reviewer] คัดเลือกหรือ Reject นักรีวิว                 | Individual decision/confirmation/persist              |
| REV-03 | [Reviewer] เลือกและตัดสินใจนักรีวิวเป็นกลุ่ม            | Selection/bulk decision/toolbar                       |
| REV-04 | [Reviewer] Export นักรีวิวที่ทีมงานเลือก                | Selected-only Excel-compatible CSV                    |
| REV-05 | [Reviewer] เพิ่มนักรีวิวรายคนและนำเข้ารายชื่อ           | Specified; missing field rules explicitly pending     |
| REV-06 | [Reviewer] ส่งต่อผู้ผ่านการคัดเลือกและดูการยืนยันรับงาน | Specified integration; missing endpoint/roles pending |

## Story Dependencies

- BRF-01 → BRF-02/BRF-03; ANN-01 ใช้ Brief identity และ canonical alias จาก BRF-03
- ANN-01 → ANN-02; ANN-03/ANN-04/ANN-05 ใช้ field contract และ validation matrix ของ ANN-02 ไม่ทำ Story ซ้ำราย field
- ANN-06 ใช้ข้อมูลจาก ANN-02/03/04/05; ANN-07 ใช้ identity/status เดียวกับ ANN-01/06
- REV-01 ใช้ posting identity จาก ANN-06; REV-02 เป็น status contract สำหรับ REV-03/04
- REV-05 ส่ง reviewer records ให้ REV-01/02 และ applicant count ให้ ANN-01/06; REV-06 ใช้ final accepted status จาก REV-02
- Campaign downstream: การนำเข้าผู้สมัครและ source snapshot ต้องใช้ Brief/Posting IDs และ reviewer decisions ที่แยกตามประกาศ ห้ามถือว่าโค้ด Campaign พร้อมรับข้อมูลทุกประเภทแล้ว ไม่เขียน Campaign stories ซ้ำจาก requirement เดิมในเอกสารนี้

## Identified Gaps / Pending Confirmations

| ID   | Classification                     | หลักฐาน / ผลกระทบ / ข้อกำหนดที่จะใช้                                                                                                                                                                                |
| ---- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| G-01 | Gap                                | JobPostingForm.handleSave ตรวจ subtitle/details/owner/platform/followers/amounts ทุกสถานะ แม้ร่าง; ANN-03 คง intended title only ตาม AGENTS                                                                         |
| G-02 | Gap                                | SPECIAL_CRITERIA_OPTIONS มี .sort(th) ทำให้ผิดลำดับที่ผู้ใช้ให้; ANN-02 ต้องคง 42 รายการตามลำดับต้นฉบับ                                                                                                             |
| G-03 | Gap                                | Optional working dates ไม่มี input และไม่มีใน current Detail แม้ AGENTS ระบุให้คงไว้; label/validation ใหม่ Pending Confirmation, legacy saved dates ยังอยู่                                                        |
| G-04 | Gap                                | ทำสำเนาประกาศเปิด modal ในแท็บเดิม; copy Draft อยู่ original Detail; intended new-tab และ draft กลับ Brief ตาม ANN-05                                                                                               |
| G-05 | Gap                                | canSelect รวม no decision และ TeamAccept; export จาก selected IDs จึงอาจมีผู้สมัครที่ยังไม่ผ่านทีม; REV-04 บังคับ team-only ตาม AGENTS                                                                              |
| G-06 | Pending Confirmation               | AGENTS ทีมงานเลือกแล้ว = awaiting Buyer/PM แต่ code tab เฉพาะ TeamAccept และ pending อยู่สมัคร; สอง-stage model ใน REV-02 เป็น implemented baseline ต้องยืนยัน actor/transition ก่อน production                     |
| G-07 | Pending Confirmation               | select-all ปัจจุบันเฉพาะหน้า 24 คน; “visible tab” ใน AGENTS อาจหมายถึงทุกหน้าที่ผ่าน filter; REV-03 ระบุ baseline current page จนมีคำตัดสิน                                                                         |
| G-08 | Gap                                | ไม่มีเพิ่มนักรีวิว, single/Bulk Upload, ส่ง Sale หรือยืนยันรับงานแล้วบน current Detail; hook ส่ง Sale อย่างเดียวไม่ใช่ complete workflow                                                                            |
| G-09 | Gap                                | Decision by hardcoded email; ไม่แสดง buyer ใน card footer; single ไม่มี date แต่ bulk มี ISO timestamp; role enforcement ไม่พบ                                                                                      |
| G-10 | Gap                                | Username ทุกคนเปิด Facebook Buddy Review URL เดียว ไม่ใช่ profile ของคนนั้น                                                                                                                                         |
| G-11 | Gap                                | Legacy status ใน List derive Bangkok date แต่ Detail badge/link eligibility ดู saved flags; ANN-06/07 ต้องตรงกับ status ที่ผู้ใช้เห็น ต้องยืนยันว่าปิดตาม legacy date แล้ว disable link ด้วยหรือไม่                 |
| G-12 | Pending Confirmation               | Table copy URL = https://buddyreview.co/apply/{JobID}; Detail = https://bdy.link/{lowercase ID}; preview URL/ภาพ fixed ไม่ reflect form; ไม่พบ API สร้าง public/short links                                         |
| G-13 | Gap                                | updateBrief หา original จาก SEED_BRIEFS 2 ตัวและ saved briefs ไม่รวม MOCKED_BRIEFS 25 ตัว; edit sample NRI202610001 อาจปิด modal โดยไม่ persist; BRF-03 ต้องไม่รายงาน save สำเร็จเมื่อไม่ update                    |
| G-14 | Gap                                | Unknown Job ID fallback เป็น SEED_JOB_POSTINGS[0]; unknown Brief ยัง render summary placeholder และเปิด create ได้; not-found UX/error text ต้อง PO ยืนยัน ห้ามอ้างว่ามี already implemented                        |
| G-15 | Pending Confirmation               | ไม่มี backend, concurrency conflict, cross-device persistence, authentication หรือ authorization; save exceptions ไม่ถูกแสดงเป็น inline error; clipboard success ไม่รอ writeText สำเร็จ                             |
| G-16 | Pending Confirmation               | Summary applicant count จาก saved count (v2 ใช้ max(saved, stored reviewers)); reviewer tab อ่าน seed rows เท่านั้น ไม่อ่าน stored reviewers; จึงอาจต่างกัน ต้องกำหนด production source of truth                    |
| G-17 | Implemented / inventory correction | jobPostingApi.resolvePostingBrief resolve saved posting.brief ผ่าน getBriefById ก่อน list/count filter; จึงไม่ยืนยัน gap “rename แล้ว posting หาย” ตาม inventory เดิม เก็บ regression AC ของ aliases แทน            |
| G-18 | Gap / inventory correction         | BriefSummary ปัจจุบันไม่แสดง Brand/logo แม้ inventory ระบุว่ามี; earlier AGENTS ขอ identity title/Brand/bounded thumbnail แต่ compact latest form ไม่ยืนยันว่าจะเอา legacy display ออก ต้อง PO ยืนยัน display scope |
| G-19 | Pending Confirmation               | Renderer รองรับ links/images/colors แต่ editor มีเพียง text formatting และ paste plain text; image-only ไม่ผ่าน text-required validation ไม่กำหนด upload/link/color editor เพิ่มโดยไม่มีคำตัดสิน                    |
| G-20 | Specified conflict                 | Reward points เคยอยู่ postings ใน AGENTS แต่ current continuous form/Detail ไม่มี points; ยังไม่มีคำสั่ง remove points ชัดเจน ต้องยืนยันว่าจะคง/คืน UI หรือถือ obsolete ไม่เติม field ลง current form spec โดยเดา   |

ข้อสังเกตเพิ่มจาก Source / UI:

- **G-21 — Gap:** Handler บล็อกเมื่อ Owner/รายละเอียดงานว่าง แต่ Owner Field ไม่รับ errors.owner และ Rich Text ไม่ render errors.shortBriefHtml หรือ aria-invalid จึงไม่รับประกันว่าข้อความผิดพลาด/scroll/focus จะชี้ช่องรายละเอียดงานได้ โดยเฉพาะเมื่อช่องอื่นถูกต้องทั้งหมด AC validation ของ ANN-02 ต้องครอบคลุมกรณีนี้
- **G-22 — Gap:** Toolbar ปัจจุบันเรียง Export CSV → Reject → Accept และ Accept เป็น primary ด้านขวา แตกต่างจาก requirement ที่ให้ Export Excel เป็น primary เดียวและชิดขวา ไม่ relabel ด้วย CSS pseudo-elements ต้องยืนยันตำแหน่ง bulk decision actions เมื่อแก้ toolbar โดยคงเป้าหมายของ REV-03/04
- **G-16 — Visible evidence:** Live JOB20260901 แสดงผู้สมัคร 0 คนใน summary แต่ tab รายชื่อนักรีวิว (100) และสมัคร (100) เนื่องจาก seed rows เป็นอีกแหล่งข้อมูล จึงไม่ใช้จำนวนตัวอย่างนี้เป็น production source of truth

เปรียบเทียบ requirement-2026-10-06.md: Calendar/Table, Product Option, repeatable/logo/Brand Brief form, campaign type choices/targets/period wizard ไม่ใช่ current UI contract แล้ว ใช้ latest user decisions (Table only, 2-field Brief modal, continuous Confidential announcement, manual status, no Product Option/Benefit) แทน Scope/Reference UI ถูก remove แต่ hidden saved content ต้องไม่ถูกลบ การมี mock counts/seed reviewer metrics/active email/fixed URLs ไม่ใช่ analytics, live sourcing หรือ production permission

## Shared field contract — Announcement Create/Edit

ตารางนี้เป็น Field Specification ของ ANN-02 และเป็น shared dependency ของ ANN-03/04/05 เพื่อไม่ทำซ้ำทุก Story ลำดับจริงของฟอร์ม: Owner → สถานะประกาศ → คุณสมบัตินักรีวิว (Platform, Follower Range, Special Criteria) → รายละเอียดค่าตอบแทน → ข้อมูลประกาศ ไม่มี wizard/Next/Previous

| Section                            | Label                             | Field Type                | Validation Rules                                                                                                                                                                                                                                                                               |
| ---------------------------------- | --------------------------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Owner (card ไม่มี section heading) | Owner / Assign Buyer              | Select                    | Active/Inactive: required nonblank ใน handler; ร่าง: optional ตาม intended contract G-01; default active user email ตัวอย่าง thanya@buddyreview.co; options saved/current email + thanya@buddyreview.co, nattaya@buddyreview.co, itsariya@buddyreview.co; ไม่ตรวจ email format/role membership |
| สถานะประกาศ                        | ร่าง / เปิดรับสมัคร / ปิดรับสมัคร | Radio                     | ค่า draft/active/inactive; create default active; edit explicit Draft → draft ไม่เช่นนั้น saved status หรือ active; helper เปิดหรือปิดรับสมัครด้วยสถานะ; colored dots/blue selected; handler ไม่ตรวจ enum แยก                                                                                  |
| คุณสมบัตินักรีวิว                  | Platform                          | Checkbox (multiple)       | Active/Inactive ≥1: Instagram, TikTok, YouTube, Facebook, Facebook Page, X, Lemon8; ร่าง optional; circular logo; saved legacy values ไม่ลบทิ้งเงียบ ๆ                                                                                                                                         |
| คุณสมบัตินักรีวิว                  | Follower Range — MIN              | Text numeric              | Active/Inactive required finite ≥0, MAX ≥MIN; input รับ digits และ safe integer; grouped commas; save numeric ไม่มี comma; ร่างอนุญาต empty; หน่วย followers ไม่ใช่คน                                                                                                                          |
| คุณสมบัตินักรีวิว                  | Follower Range — MAX              | Text numeric              | Active/Inactive required finite ≥MIN; input digits/safe integer; error ปัจจุบันรวมที่ MIN; ร่างเก็บ partial range ได้ ไม่มี verified upper business cap                                                                                                                                        |
| คุณสมบัตินักรีวิว                  | Special Criteria                  | Searchable Multi-select   | Optional ทุกสถานะ; 42 options ในรายการด้านล่าง; retain legacy selected values; ไม่เพิ่ม custom option ใหม่; search ไม่ล้าง selection; empty search result ไม่พบคุณสมบัติที่ค้นหา                                                                                                               |
| Special Criteria dropdown          | ค้นหาคุณสมบัตินักรีวิว...         | Search                    | Optional; trim/case-insensitive match option text; ไม่มี max length; ใช้เฉพาะ dropdown ไม่บันทึกเป็น criteria                                                                                                                                                                                  |
| รายละเอียดค่าตอบแทน                | ค่าจ้างรวมค่าเดินทาง (บาท)        | Text decimal              | Active/Inactive required finite ≥0; 0 ถูกต้อง; UI digits และ decimal point เดียว; comma display; save number; legacy fallback wage ก่อน budgetMin; ร่างเก็บ empty/partial ได้; ไม่พบ currency precision limit                                                                                  |
| รายละเอียดค่าตอบแทน                | ค่าสินค้า (บาท)                   | Text decimal              | Active/Inactive required finite ≥0; 0 ถูกต้อง; comma display, save number; ร่าง empty ได้; helper หากไม่มีให้ระบุ 0; ไม่ใช่ Product Option                                                                                                                                                     |
| ข้อมูลประกาศ                       | ชื่อประกาศ (Announcement Title)   | Text                      | Required ทุกสถานะ; trim แล้วไม่ว่าง; new default Brief.name; copy name +(สำเนา); ไม่มี verified max length                                                                                                                                                                                     |
| ข้อมูลประกาศ                       | คำอธิบายประกาศ (Subtitle)         | Text                      | Active/Inactive required trim nonblank; ร่าง optional; save values.subtitle ตาม entered value และ confidential subtitle trimmed                                                                                                                                                                |
| ข้อมูลประกาศ                       | รายละเอียดงาน                     | Rich Text                 | Active/Inactive required plain-text.trim ไม่ว่าง; ร่าง optional; bold/italic/underline/bullets/numbered/remove-format; paste plain text; save sanitized HTML + plain text; image-only ยังไม่ผ่าน G-19                                                                                          |
| Save confirmation                  | พรีวิวประกาศ                      | Read-only external action | ไม่มี input; fixed sample Preview image/URL; เปิดแท็บใหม่ ไม่ persist และไม่สะท้อน unsaved form จริง                                                                                                                                                                                           |

Optional working dates เป็น Specified/G-03 แต่ไม่มี exact current label/controls ให้ยืนยัน จึงไม่สร้าง field labels ใหม่ Required marker ใน UI ไม่ใช้เป็นหลักฐานเดี่ยว: rules ข้างต้นตรวจจาก handleSave และ input change guards; Draft exceptions เป็น intended ที่ยังเป็น Gap

### Special Criteria options — ลำดับที่ผู้ใช้ให้

รายการนี้คัดจาก array literal ก่อน .sort ใน announcementForm.js; wording คงเดิม (รวม spelling ของ options) ทุกข้อ optional และเลือกหลายข้อได้

1. คนมีผมหงอก
2. คนมีสิว
3. คนสายตาสั้น
4. คนใส่รีเทนเนอร์
5. คนอายุ 50+ คนสูงวัย
6. ต้องย้อมผมจริง
7. Blue Collar
8. พนักงานราชการ / ข้าราชการ
9. คนต่างจังหวัด
10. คนเลี้ยงสุนัข / แมว
11. คนเลี้ยงปลา / ปลาสวยงาม
12. คนชอบเดินป่า
13. คนชอบงาน Concert / Festival
14. คนที่ชื่นชอบงานศิลปะ / แฟนอาร์ต / ผลงานออริจินอล / งานแฮนด์เมด / งานอีเวนต์อาร์ต
15. Plus Size
16. Review Beauty
17. Before - After
18. คนขับรถยนต์ไฟฟ้า / EV
19. มีรถจักรยานยนต์
20. Students / University Students
21. นักศึกษา ป โท
22. นักกีฬา ทั่วไป ไม่ใช่ทีมชาติ
23. พ่อค้าแม่ค้า
24. คน Look Premium
25. Cooking
26. Foodie
27. React Series / MV
28. Fandom
29. Healthy
30. Fitness / Sport
31. Cover Dance
32. Family
33. Mom & Kids
34. Home Decoration
35. นัก Live / Affliiated นายหน้าขายของ
36. IT / Gadget
37. Travel
38. คู่รัก
39. ชาวสวน
40. กลุ่มช่าง
41. Dance Challenge
42. รีวิว SKU ชิ้นต่อไป (ราคาต่อ SKU)

## BRF-01

### Story Title

[Brief] ค้นหาและดูรายการบรีฟ

### User Story

As a Buyer / PM,
I want to ค้นหาบรีฟและเห็นจำนวนประกาศตามสถานะ,
So that เลือกงานที่จะจัดการได้จากหน้ารวม.

### Description

Implemented: เข้า Sidebar ประกาศหานักรีวิวเพื่อดูรายการ Brief ไม่รวม Project List หรือการสร้างประกาศแยกโดยไม่มี Brief

### Functional Requirements

FR-01: เมื่อเปิดเมนู แสดง /briefs หัวข้อ รายการ Brief และรายการชื่อ/Brief numbers ที่บันทึกไว้ พร้อมปุ่มสร้างบรีฟ

FR-02: เมื่อค้นหา ให้ trim/case-insensitive ค้น name/title/brand/id/briefNumbers และกลับหน้า 1; ไม่มี sorting control ให้กำหนดใหม่

FR-03: แสดง total linked postings และ ร่าง/เปิดรับสมัคร/ปิดรับสมัคร ครบรวม 0 ของแต่ละ Brief; ไม่ลด counts เพราะ pagination ของประกาศ

FR-04: แบ่ง Briefs 10 ต่อหน้า ปุ่มเลขหน้า/ก่อน/ถัดไป จำกัดตามผลค้นหา; เมื่อยังโหลดแสดง skeleton ตัวอย่างไม่ใช่ API progress

FR-05: เมื่อคลิกชื่อ/เปิด Brief ไป /briefs/:id; copy Brief ID ไม่เปิด Detail และแสดง feedback; เมื่อไม่พบแสดงไม่พบบรีฟและล้างคำค้นหา

### Field Specification

| Section      | Label                           | Field Type       | Validation Rules                                  |
| ------------ | ------------------------------- | ---------------- | ------------------------------------------------- |
| Search       | ค้นหาด้วยชื่อบรีฟ หรือ Brief ID | Text             | Optional; trim/case-insensitive; reset page 1     |
| Pagination   | หน้าปัจจุบัน                    | Page controls    | 10 Briefs/หน้า; ไม่มีผลต่อ linked counts          |
| รายการ Brief | Brief ID                        | Read-only / copy | ข้อมูล saved briefNumbers หรือ id; ไม่แก้จาก List |

### Business Rules

BR-01: ใช้ canonical Brief relationship และ aliases; counts ใช้สถานะตาม ANN-01

BR-02: ไม่มี verified role-based visibility; saved/sample data ไม่ใช่ API results

BR-03: ชื่อ/เลขบรีฟตรวจเห็นใน live UI; Brand/logo display เป็น G-18 ไม่อ้างว่ามีในปัจจุบัน

### Acceptance Criteria

AC-01: ค้นหาเลขบรีฟ

Given มีบรีฟเลข NRI202609058

When ค้นหา nri202609058 พร้อมช่องว่างหัวท้าย

Then เห็นบรีฟดังกล่าวและอยู่หน้า 1

AC-02: จำนวนศูนย์

Given Brief ไม่มีประกาศ

When เปิด List

Then total และทั้งสามสถานะแสดง 0

AC-03: แบ่งหน้า

Given มีผลค้นหา 27 Briefs

When เปิดหน้า 3

Then แสดง 7 Briefs และปุ่มถัดไป disabled

AC-04: ล้างคำค้นหา

Given คำค้นหาไม่ตรงบรีฟใด

When กดล้างคำค้นหา

Then คำค้นหาว่างและเห็นรายการอีกครั้ง

AC-05: Copy identity

Given มี Brief ID

When กด copy ID

Then คัดลอก ID โดยยังอยู่ List

### References

- Prototype: [/briefs](https://prelist-mu.vercel.app/briefs)
- Source Code: [src/pages/BriefListPage.jsx](src/pages/BriefListPage.jsx), [src/features/briefs/briefApi.js](src/features/briefs/briefApi.js), [src/features/briefs/BriefSummary.jsx](src/features/briefs/BriefSummary.jsx)
- Related Stories: BRF-02, BRF-03, ANN-01

## BRF-02

### Story Title

[Brief] สร้างบรีฟ

### User Story

As a Buyer / PM,
I want to สร้างบรีฟจากเลขงานและชื่อ,
So that รวมประกาศที่จะเปิดรับสมัครไว้ในงานเดียว.

### Description

Implemented: สร้างบรีฟเปิด bounded modal เหนือ List; ไม่มี Brand/logo/Product Option fields

### Functional Requirements

FR-01: เมื่อกดสร้างบรีฟ เปิด modal สอง fields ตามลำดับเลขบรีฟแล้วชื่อ; legacy /briefs/create เปิด List พร้อม modal

FR-02: ตรวจรูปแบบเลข inline/blur/save พร้อมรูปแบบและตัวอย่าง NRI202610001; duplicate ทั้ง primary/legacy alias ห้าม save

FR-03: เมื่อกดสร้างและข้อมูลถูกต้อง แสดงยืนยันสร้างบรีฟ; ยืนยันจึง persist และเปิด /briefs/{new ID}; ยกเลิก confirmation กลับฟอร์มที่กรอกไว้

FR-04: ปิด/ยกเลิก/backdrop/Escape dismiss โดยไม่ navigate ไม่เขียน record รักษาคำค้นหา/หน้า List; lock scroll และ trap/restore focus

### Field Specification

| Section                        | Label                                  | Field Type | Validation Rules                                                                                                                                                                              |
| ------------------------------ | -------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Identity (card ไม่มีหัวข้อแยก) | เลขบรีฟ (Brief Number / Work Order ID) | Text       | Required; uppercase/trim; XXXYYYYMMNNN = A–Z 3 + AD year 4 + month 01–12 + sequence 000–999; รวม 12 ตัว; check while typing/blur/save; reject duplicate including aliases; ไม่ตรวจช่วงปีเพิ่ม |
| Identity (card ไม่มีหัวข้อแยก) | ชื่อบรีฟ (Brief Name)                  | Text       | Required trimmed nonblank; ไม่มี min/max length ที่ยืนยัน                                                                                                                                     |

### Business Rules

BR-01: มี editable Brief Number หนึ่งค่าเท่านั้น; เก็บ Brief แยกจาก postings

BR-02: Create ไม่มี linked postings ให้แสดง counts 0; ไม่สร้าง posting อัตโนมัติ

BR-03: ไม่กำหนด permission restriction เพิ่มจน PO ยืนยัน; persistence error UX ยังไม่ implemented G-15

### Acceptance Criteria

AC-01: สร้างสำเร็จ

Given เลขใหม่ถูก format และชื่อไม่ว่าง

When ยืนยันสร้างบรีฟ

Then มี Brief ใหม่และเปิด Detail ของ ID ที่ uppercase

AC-02: ไม่ครบ

Given เลขหรือชื่อว่าง/whitespace

When กดสร้าง

Then แสดง error และไม่เปิด confirmation/ไม่สร้าง record

AC-03: เลขผิดรูปแบบ

Given เลข ABC202613001 หรือ ABC20261001

When blur หรือกดสร้าง

Then แสดง Thai format error และ save ไม่ได้

AC-04: ซ้ำ alias

Given เลขที่กรอก resolve ไป Brief เดิม

When กดสร้าง

Then แจ้งถูกใช้งานแล้วและไม่สร้างซ้ำ

AC-05: ยกเลิก

Given List มี query และ page ก่อนเปิด modal

When ปิด modal

Then อยู่ List และ query/page เดิม ไม่มี record ใหม่

### References

- Prototype: [/briefs](https://prelist-mu.vercel.app/briefs)
- Source Code: [src/features/briefs/BriefFormModal.jsx](src/features/briefs/BriefFormModal.jsx), [src/features/briefs/BriefNumbersField.jsx](src/features/briefs/BriefNumbersField.jsx), [src/features/briefs/briefApi.js](src/features/briefs/briefApi.js), [src/app/AppRoutes.jsx](src/app/AppRoutes.jsx)
- Related Stories: BRF-01, BRF-03

## BRF-03

### Story Title

[Brief] แก้ไขบรีฟและรักษาความสัมพันธ์

### User Story

As a Buyer / PM,
I want to แก้ชื่อหรือเลขบรีฟโดยไม่เสียประกาศเดิม,
So that ปรับข้อมูลอ้างอิงงานได้อย่างต่อเนื่อง.

### Description

Implemented บางส่วน/Gap G-13: Edit เปิด modal เหนือ Detail และใช้ field contract เดียวกับ Create

### Functional Requirements

FR-01: เมื่อกดแก้ไขบรีฟ prefill เลขปัจจุบันและชื่อ; legacy edit URL เปิด parent Detail พร้อม modal

FR-02: ตรวจตาม BRF-02 แต่เลขที่ resolve เป็น Brief ตัวเองไม่ถือ duplicate; เลขของ Brief อื่นห้าม save

FR-03: เมื่อยืนยัน ให้ update Brief เดิม; ID เดิมคง Detail เดิมและ refresh; ID เปลี่ยนเปิด canonical Detail ใหม่

FR-04: รักษา Brand/images/products/metadata เดิมแม้ไม่มี UI editor; legacy route IDs และ posting associations resolve ไป Brief ใหม่

FR-05: ยกเลิก/ปิดรักษา underlying search/filter/page; การ update ต้อง persist จริง ไม่ปิดเสมือนสำเร็จเมื่อหา record ไม่พบ (G-13)

### Field Specification

ใช้ตาราง Field Specification ของ BRF-02 ทุก field; default เปลี่ยนเป็น saved Brief และ duplicate check ยกเว้น Brief ตัวเอง

### Business Rules

BR-01: ไม่มี add/delete/reorder Brief Number controls; legacy aliases คงใช้อ้างอิงได้

BR-02: การเปลี่ยน identity ไม่แก้ source snapshot ของ Campaign ที่บันทึกไว้โดยเงียบ

BR-03: MOCKED_BRIEFS update gap ไม่ได้แปลว่า business ห้ามแก้ sample; intended ทุก Brief ที่เปิด Edit ได้ต้อง save ได้

### Acceptance Criteria

AC-01: แก้ชื่อ

Given Brief มี linked postings

When ยืนยันเปลี่ยนชื่อโดยคงเลข

Then Detail/List แสดงชื่อใหม่และ linked counts คงอยู่หลัง reload

AC-02: เปลี่ยนเลข

Given Brief เดิมเชื่อม posting และมีเลขใหม่ไม่ซ้ำ

When ยืนยันเปลี่ยนเลข

Then เปิด Detail เลขใหม่; เข้าเลขเก่ายัง resolve และ posting list/counts ไม่หาย

AC-03: เก็บข้อมูลเดิม

Given Brief มี Brand/image/products เดิม

When แก้เฉพาะเลข/ชื่อ

Then hidden saved content ยังอยู่

AC-04: แก้ mock record

Given เปิด Edit ของ NRI202610001

When ยืนยันชื่อใหม่แล้ว reload

Then ชื่อใหม่ยังอยู่; เป็น gap acceptance ไม่ใช่ผลทดสอบที่ผ่าน

AC-05: ยกเลิก

Given ฟอร์มแก้มี unsaved values

When ปิด

Then ข้อมูล saved ไม่เปลี่ยนและ filter/page Detail คงเดิม

### References

- Prototype: [/briefs/NRI202609058](https://prelist-mu.vercel.app/briefs/NRI202609058)
- Source Code: [src/features/briefs/BriefFormModal.jsx](src/features/briefs/BriefFormModal.jsx), [src/features/briefs/briefApi.js](src/features/briefs/briefApi.js), [src/features/job-postings/jobPostingApi.js](src/features/job-postings/jobPostingApi.js), [src/pages/BriefDetailPage.jsx](src/pages/BriefDetailPage.jsx)
- Related Stories: BRF-02, ANN-01

## ANN-01

### Story Title

[Announcement] ดูประกาศที่เชื่อมกับบรีฟ

### User Story

As a Buyer / PM,
I want to ค้นหาและติดตามประกาศเฉพาะบรีฟที่เลือก,
So that จัดการรับสมัครแต่ละงานได้โดยไม่ปะปน.

### Description

Implemented: Brief Detail summary และ Table only อยู่บน page ไม่ครอบ enclosing section card

### Functional Requirements

FR-01: เปิด Brief Detail แสดงชื่อ/Brief numbers และ linked announcements เฉพาะ canonical Brief; กลับไป /briefs โดยตรง

FR-02: แสดง heading/create action, status filters ทั้งหมด/ร่าง/เปิดรับสมัคร/ปิดรับสมัครพร้อม colored dots/counts, search แล้ว Table/pagination; ไม่แสดง Calendar/Product Option

FR-03: ค้นชื่อประกาศ/ชื่อแคมเปญ (campaignName หรือ brand fallback) case-insensitive และ trim; ใช้ร่วมกับสถานะ; เปลี่ยน search/status กลับหน้า 1

FR-04: counts คิดจาก current Brief + search ก่อนกรองสถานะและ pagination; แสดง 0; Table มี No./ประกาศ/สถานะ/เปิดดูประกาศ/ผู้สมัคร/Action

FR-05: ประกาศแสดง title, subtitle หรือ brand fallback, copy Job ID; คลิก title/ดูรายละเอียดงาน เปิด posting Detail; link actions ตาม ANN-07

FR-06: paginate filtered 10 ต่อหน้า พร้อม range/เลขหน้า/ก่อนถัดไป; ถ้าไม่พบแสดงข้อความและล้างตัวกรองห่าง 20px; clear คืน query ว่าง/ทั้งหมด/page1

### Field Specification

| Section        | Label                                       | Field Type          | Validation Rules                                                |
| -------------- | ------------------------------------------- | ------------------- | --------------------------------------------------------------- |
| Search         | ค้นหาชื่อประกาศ / ชื่อแคมเปญ                | Text                | Optional; name + campaignName/brand; reset page                 |
| Status filters | ทั้งหมด / ร่าง / เปิดรับสมัคร / ปิดรับสมัคร | Single-select pills | Default ทั้งหมด; counts independent of selected status/page     |
| Table          | เปิดดูประกาศ / ผู้สมัคร                     | Read-only           | Saved per posting; missing 0 คน; mock counts ไม่ live analytics |

### Business Rules

BR-01: manual: explicit Draft → ร่าง; inactive → ปิด; อื่น → เปิด; legacy: explicit Draft/ช่วงสมัครไม่ครบหรือไม่ถูกต้อง → ร่าง; Bangkok today > deadline → ปิด; อื่น → เปิด (ไม่มี upcoming แยก)

BR-02: ก่อน legacy applyStartDate ยังถูกแสดงเปิดรับสมัครตาม current helper ไม่เปลี่ยนเป็น upcoming โดยเดา

BR-03: ไม่มี sorting; applicant/view counts ต้องไม่รวม posting อื่น; seed ratio 10:1 เป็น sample เท่านั้นไม่ใช้คำนวณ live views

### Acceptance Criteria

AC-01: Scope

Given มี postings ต่าง Brief

When เปิด NRI202609058

Then เห็นเฉพาะประกาศที่ resolve เชื่อม Brief นี้

AC-02: Counts หลัง filter

Given search match 15 records หลายสถานะ

When เลือกเปิดรับสมัคร

Then table กรองเปิด แต่ pills ยังนับทั้งสามจาก 15 search matches

AC-03: Pagination

Given มี 32 filtered announcements

When ไปหน้า 4

Then เห็น rows31–32 และ range31–32 จาก 32; next disabled

AC-04: Reset page

Given อยู่หน้า 3

When เปลี่ยน query/status

Then เริ่มหน้า 1

AC-05: Empty

Given query ไม่ตรงประกาศ

When กดล้างตัวกรอง

Then query ว่าง/ทั้งหมด/page1; gap message-button20px

AC-06: Legacy date

Given legacy valid range และ Bangkok today เท่ากับ deadline

When ดูสถานะ

Then ยังเปิด; วันถัดไปปิด

### References

- Prototype: [/briefs/NRI202609058](https://prelist-mu.vercel.app/briefs/NRI202609058)
- Source Code: [src/pages/BriefDetailPage.jsx](src/pages/BriefDetailPage.jsx), [src/features/job-postings/PostingCalendarList.jsx](src/features/job-postings/PostingCalendarList.jsx), [src/features/job-postings/recruitmentStatuses.js](src/features/job-postings/recruitmentStatuses.js), [src/features/job-postings/jobPostingApi.js](src/features/job-postings/jobPostingApi.js)
- Related Stories: BRF-03, ANN-02, ANN-06, ANN-07

## ANN-02

### Story Title

[Announcement] สร้างประกาศรับสมัคร

### User Story

As a Buyer / PM,
I want to สร้างประกาศที่มีคุณสมบัติและค่าตอบแทนครบ,
So that สื่อสารงานให้ผู้สมัครและเปิดหรือปิดรับสมัครได้.

### Description

Implemented Active/Inactive: Continuous modal เหนือ Brief Detail; common form fields ตาม shared contract; Draft แยก ANN-03

### Functional Requirements

FR-01: เปิดสร้างประกาศจาก Brief พร้อม default title จาก Brief และ Owner จาก active account; status default เปิดรับสมัคร; ไม่ใช้ wizard

FR-02: กรอกทุก field ตาม shared field contract รวม selectable platforms, follower numbers, Special Criteria, amounts, title/subtitle/rich text

FR-03: Special Criteria dropdown float ไม่ดัน layout มี search/scroll/multiple selection/chips remove; Escape ปิด dropdown ก่อน form; labels wrap text16/24px และ item ≥48px; คงต้นฉบับ 42 options ไม่ sort (G-02)

FR-04: Follower/amount display commas; follower digits only; amounts decimal/zero/empty ระหว่างกรอก; values ที่ save ไม่มี comma

FR-05: กดสร้างประกาศเปิด confirmation แม้ fields ยังไม่ครบตามปัจจุบัน; กลับไปแก้ไข/ปิด confirmation ไม่เสียค่า; ยืนยันจึง validate และ persist; invalid scroll ไป first error ไม่สร้าง record

FR-06: เมื่อผ่าน Active/Inactive save เกิด Job ID ใหม่ linked Brief, counts เป็น 0, status ตามที่เลือกแล้วเปิด Job Detail

FR-07: form scroll ภายใน bounded modal/footer มองเห็น; ปิด Cancel/backdrop/Escape ไม่ navigate/ไม่ save; trap/restore focus, background inert และ body scroll lock

### Field Specification

ใช้ Shared field contract — Announcement Create/Edit และ Special Criteria options ทั้ง 42 ข้างต้น ซึ่งเป็นส่วนของ Story นี้

### Business Rules

BR-01: new campaignType = confidential คงที่; ไม่มีเลือก Normal/Private, logos/brand/target/gender/age/generated Target Group Name/Scope/Reference/Benefit/Product Option controls

BR-02: Special Criteria optional; ไม่กำหนด require จาก asterisk อย่างเดียว

BR-03: new Published + announcementStatus active/inactive และ recruitmentMode manual; ไม่มี recruitment date controls

BR-04: Optional working dates/points ยัง G-03/G-20 ไม่ปลอมว่ามี field แล้ว; preserved hidden legacy เป็น ANN-04

BR-05: จำนวนเริ่ม 0; save confirmation preview เป็น sample ไม่ใช่ draft preview จริง; persistence browser-local เท่านั้น

### Acceptance Criteria

AC-01: Create Active

Given ครบ required fields wage0/product0/followers0–1000

When ยืนยันสร้าง

Then เปิด new Job Detail active, counts เป็น 0, linked Brief

AC-02: Inactive

Given เลือกปิดรับสมัครและครบ fields

When ยืนยัน

Then save Published+inactive และ Detail แสดงปิด

AC-03: Invalid fields

Given subtitle/details/platform ว่างหรือ MAX<MIN

When ยืนยัน

Then ไม่สร้าง record; แสดง errors และเลื่อนไป invalid แรก

AC-04: Numeric format

Given กรอก wage10000.50/product0 และ follower10000

When save แล้วเปิด Edit

Then display10,000.5/0/10,000 และ savednumeric ไม่ comma

AC-05: Criteria search

Given เลือก Foodie แล้ว searchHealthy

When เลือก Healthy และปิด dropdown

Then สองค่าคงอยู่; search ไม่ล้าง Foodie

AC-06: Cancel confirm

Given กรอก form และเปิด confirmation

When กลับไปแก้ไข

Then ค่าเดิมครบ ไม่มี new record

AC-07: Dismiss

Given Brief table มี filter/page เดิม

When เปิดแล้วปิด form

Then filter/page คงเดิม focus กลับ trigger และ bodyscroll คืน

### References

- Prototype: [/briefs/NRI202609058](https://prelist-mu.vercel.app/briefs/NRI202609058)
- Source Code: [src/features/job-postings/JobPostingForm.jsx](src/features/job-postings/JobPostingForm.jsx), [src/features/job-postings/JobPostingFormModal.jsx](src/features/job-postings/JobPostingFormModal.jsx), [src/features/job-postings/JobPostingSaveModal.jsx](src/features/job-postings/JobPostingSaveModal.jsx), [src/features/job-postings/SpecialCriteriaSelect.jsx](src/features/job-postings/SpecialCriteriaSelect.jsx), [src/features/job-postings/announcementForm.js](src/features/job-postings/announcementForm.js)
- Related Stories: ANN-01, ANN-03, ANN-04, ANN-05, ANN-06

## ANN-03

### Story Title

[Announcement] บันทึกประกาศเป็นร่าง

### User Story

As a Buyer / PM,
I want to เก็บประกาศที่ยังกรอกไม่ครบเป็นร่าง,
So that กลับมาทำข้อมูลต่อโดยไม่เผยแพร่งาน.

### Description

Specified / Gap G-01: ใช้สถานะร่างใน common form; ไม่ยืนยันว่ามีปุ่ม Save as Draft แยกใน UI ล่าสุด

### Functional Requirements

FR-01: เมื่อเลือกร่าง ให้ save ได้เมื่อ titletrim ไม่ว่าง แม้ fields อื่นไม่ครบ; confirmation ยังใช้ flow เดียวกับ ANN-02

FR-02: เก็บ partial entered values และ originating Brief โดยไม่แทนช่องว่างด้วย sample/default ที่ประดิษฐ์

FR-03: เมื่อสร้าง Draft สำเร็จกลับ linked Brief (ไม่มี Brief กลับ list); explicitDraft ไม่เปลี่ยนตาม legacy dates; disableapplicationlink

FR-04: เปิด EditDraft เติมข้อมูลและเปลี่ยน Active/Inactive ต้องผ่าน full validation ก่อน published ตาม ANN-04

### Field Specification

ใช้ shared contract ของ ANN-02 ทุก field; สำหรับ draft required เฉพาะชื่อประกาศ; partial follower/amount/criteria/subtitle/details allowed ส่วน rules ของ invalid non-empty draft values นอก input guards เป็น Pending Confirmation

### Business Rules

BR-01: Draft = status Draft + announcementStatus draft + recruitmentMode manual

BR-02: ไม่สร้าง seed applicants และไม่ copy decisions; publishedvalidation ต้องไม่ถูกข้ามด้วย draft ก่อนหน้า

BR-03: ปัจจุบัน handleSave ยังตรวจครบ: AC นี้เป็น intended gap ไม่ใช่ testpassed

### Acceptance Criteria

AC-01: Title-only

Given new form มี title และเลือก draft; ช่องอื่นว่าง

When ยืนยัน save

Then สร้าง draft และกลับ Brief โดยไม่ error ช่อง optional

AC-02: Title invalid

Given เลือก draft และ titlewhitespace

When save

Then ไม่สร้าง record และแสดงกรุณาระบุชื่อประกาศ

AC-03: Partial persistence

Given draft มี platform หนึ่งกับ MIN เท่านั้นและรายละเอียดบางส่วน

When save แล้ว Edit

Then คืนค่าที่มีและคง MAX/amount ว่าง

AC-04: Draft dates

Given draft เดิมมี legacy dates อยู่ในช่วง

When เปิด List/Detail

Then ยังแสดงร่างและ linkdisabled

AC-05: Publish incomplete

Given เปิด draft ที่ไม่ครบ

When เปลี่ยน active แล้ว save

Then full validation ไม่ผ่านและ savedDraft เดิมไม่เปลี่ยน

### References

- Prototype: [/briefs/NRI202609058](https://prelist-mu.vercel.app/briefs/NRI202609058)
- Source Code: [src/features/job-postings/JobPostingForm.jsx](src/features/job-postings/JobPostingForm.jsx), [src/pages/BriefDetailPage.jsx](src/pages/BriefDetailPage.jsx), [src/features/job-postings/recruitmentStatuses.js](src/features/job-postings/recruitmentStatuses.js)
- Related Stories: ANN-02, ANN-04, ANN-07

## ANN-04

### Story Title

[Announcement] แก้ไขข้อมูลและสถานะประกาศ

### User Story

As a Buyer / PM,
I want to แก้ไขประกาศที่บันทึกไว้,
So that ปรับงานและสถานะรับสมัครโดยไม่เสียผู้สมัครหรือข้อมูลเดิม.

### Description

Implemented: summary edit เปิด common form เหนือ posting Detail ไม่ใช่ standalonepage

### Functional Requirements

FR-01: เปิด Edit จาก summary หรือ legacy /job-postings/:id/edit พร้อม saved fields; ไม่ overwriteOwner/title ด้วย current Brief default

FR-02: ใช้ criteria fallback จาก saved options/free text/meaningfultargetGroup/gender/actualages และตัดอายุ - ปี/อายุ – ปี; wage ใช้ wage ก่อน budgetMin

FR-03: แสดง legacy values ที่ไม่อยู่ใน 42options เป็น selected ที่ retain ได้; richtextsanitize และ legacy plain text เปิดแก้ได้

FR-04: เมื่อ save → confirm → validate ตาม status: intendedDrafttitle only/ActiveInactivefull; keepJobID/BriefID/applicant/view counts/decisions; close และอยู่ Detail เดิม

FR-05: save ผ่าน form ใหม่เปลี่ยน legacy เป็น confidential/version2/manual; hiddenoldfields เช่น dates/benefit/products/reference ต้องไม่ลบ

FR-06: ยกเลิกไม่เปลี่ยน record; รักษา Detailtab/reviewerfilters/view/selection; ไม่บันทึกอัตโนมัติ

### Field Specification

ใช้ shared field contract ของ ANN-02; saved defaults และ legacy fallbacks ตาม FR; ไม่มี field JobID/BriefID/counts ที่แก้ไขได้

### Business Rules

BR-01: Active↔Inactive หรือ published→Draft ทำได้ผ่าน common radio ใน current handler; ไม่มี verifiedrole approval/campaigndependencyblock

BR-02: conversionlegacy→manual ไม่ใช้ dates ควบคุมสถานะหลัง save ใหม่; เป็นการเปลี่ยน contract ที่ต้องแสดงใน handoff

BR-03: count preservation ไม่ใช่จำนวน analytics เพิ่มอัตโนมัติ

### Acceptance Criteria

AC-01: Prefill

Given posting มี saved owner/options/wage/HTML

When เปิด Edit

Then เห็นค่าปัจจุบันไม่ใช่ default Brief ใหม่

AC-02: Edit persist

Given มี viewers120/applicants12/decision แล้ว

When เปลี่ยน title และ confirmsave

Then ID/Brief/counts/decisions คงเดิมและ reload เห็น title ใหม่

AC-03: Zero fallback

Given legacywage0 และ budgetMin500

When เปิด Edit

Then wage เป็น 0 ไม่ใช้ 500

AC-04: Remove placeholder

Given legacycriteria มีอายุ – ปีและ Foodie

When เปิด Edit

Then Foodie คงอยู่ ไม่มี emptyageplaceholder

AC-05: Status transition

Given publishedactive ครบ fields

When เปลี่ยน inactive แล้ว save

Then Detail/List ปิดรับสมัครและ linkdisabled

AC-06: Cancel state

Given Detail เปิด reviewertab และมี selection

When เปิด Edit แล้ว Cancel

Then saved values ไม่เปลี่ยนและ tab/filter/selection คงเดิม

### References

- Prototype: [/job-postings/JOB20260901](https://prelist-mu.vercel.app/job-postings/JOB20260901)
- Source Code: [src/features/job-postings/JobPostingForm.jsx](src/features/job-postings/JobPostingForm.jsx), [src/features/job-postings/announcementForm.js](src/features/job-postings/announcementForm.js), [src/features/job-postings/jobPostingApi.js](src/features/job-postings/jobPostingApi.js), [src/features/job-postings/JobPostingDetail.jsx](src/features/job-postings/JobPostingDetail.jsx)
- Related Stories: ANN-02, ANN-03, ANN-06, REV-01

## ANN-05

### Story Title

[Announcement] ทำสำเนาประกาศ

### User Story

As a Buyer / PM,
I want to ทำสำเนาประกาศเดิมเป็นงานใหม่,
So that ลดการกรอกซ้ำโดยไม่กระทบผู้สมัครของต้นฉบับ.

### Description

Implemented บางส่วน/Gap G-04: current label ทำสำเนาประกาศบน Detail; intendednew tabprefilled Create

### Functional Requirements

FR-01: กดทำสำเนาประกาศจาก pageactions ด้านนอก Editmodal เปิด prefilled Create ในแท็บใหม่ตาม Specified; currentmodal แท็บเดิมเป็น Gap

FR-02: prefillsaved fields/linked Brief ตาม ANN-02/04 ต่อ title (สำเนา); ไม่สร้าง record จน saveDraft/Active/Inactive และยืนยัน

FR-03: save เกิด newJobID resetapplicants/viewers0 ไม่คัดลอก reviewerdecisions/addedreviewers; ต้นฉบับไม่เปลี่ยน

FR-04: copyDraft กลับ linked Brief ในแท็บใหม่; published เปิด newDetail; Cancel ไม่มี record ใหม่

### Field Specification

ใช้ shared field contract ของ ANN-02; default จาก source posting, name suffix (สำเนา), IDs/counts เป็น systemgenerated ไม่เป็น editablefield

### Business Rules

BR-01: copy ไม่ใช่ Edit ไม่มีการเปลี่ยน original ID

BR-02: originBrief ต้องรักษา canonicalassociation; productionIDcollisionrule ยัง Pending Confirmation

BR-03: ไม่ทดสอบ new tabpersist จริง; codecurrentusemodal และ draftcallback อยู่ original Detail

### Acceptance Criteria

AC-01: Open copy

Given ต้นฉบับมี saved data

When กดทำสำเนา

Then เปิด Create แท็บใหม่ prefill และ title suffix; original tab ไม่เปลี่ยน

AC-02: No eager create

Given เปิด prefilled Create

When Cancel

Then จำนวน postings ไม่เพิ่ม

AC-03: New identity

Given ต้นฉบับมี applicants/decisions

When save สำเนา published

Then new ID counts เป็น 0 ไม่มี inherited decisions และ original unchanged

AC-04: Draft destination

Given copy เลือก draft และ title ไม่ว่าง

When confirm

Then กลับ linked Brief ใน new tab และเห็น newDraft

### References

- Prototype: [/job-postings/JOB20260901](https://prelist-mu.vercel.app/job-postings/JOB20260901)
- Source Code: [src/features/job-postings/JobPostingDetail.jsx](src/features/job-postings/JobPostingDetail.jsx), [src/features/job-postings/JobPostingForm.jsx](src/features/job-postings/JobPostingForm.jsx), [src/app/AppRoutes.jsx](src/app/AppRoutes.jsx)
- Related Stories: ANN-02, ANN-03, ANN-04

## ANN-06

### Story Title

[Announcement] ดูรายละเอียดประกาศ

### User Story

As a Buyer / PM,
I want to ดูข้อมูลประกาศที่บันทึกไว้,
So that ตรวจข้อกำหนดงานก่อนจัดการผู้สมัคร.

### Description

Implemented บางส่วน: default ข้อมูลประกาศ; current label รายละเอียดงานไม่ใช่ field ชื่อรายละเอียดงานเพิ่มเติมตาม AGENTS

### Functional Requirements

FR-01: เมื่อเปิด Detail แสดง summary4rows: title/status และ edittopright, subtitle, copyBrief/JobID, เปิดดูประกาศ/ผู้สมัคร; savedmissingcounts0

FR-02: แสดง tabs ข้อมูลประกาศ(default)/รายชื่อนักรีวิวพร้อม rowcount; summarycounts ยัง savedper posting ไม่แทนด้วย target

FR-03: ข้อมูลประกาศแสดงคุณสมบัตินักรีวิว SpecialCriteria/Platform/FollowerRange, ค่าตอบแทน wage/productvalue, ข้อมูลประกาศเฉพาะรายละเอียดงาน; title/subtitle ไม่ซ้ำ card

FR-04: labels เหนือ valuesgap8px ทุก viewport; missing -, actualzero แสดง 0; followerunitfollowers; logos ก่อน platformname

FR-05: safe richtextretainbold/italic/underline/lists/allowed links/images/colors; legacy plain textfallback; unsafe active content ไม่ render; formatting exampleJOB20260901 แยก label จาก savedcontent

FR-06: Back ไป linked Brief หรือ/briefs ตรง; clipboardIDsfeedback ตาม ANN-07; legacybadge ควรตรง List ตาม ANN-01 แต่ current ต่าง G-11

### Field Specification

| Section             | Label                                        | Field Type          | Validation Rules                                                     |
| ------------------- | -------------------------------------------- | ------------------- | -------------------------------------------------------------------- |
| Summary             | ชื่อประกาศ / Subtitle / สถานะ                | Read-only           | saved fields; statuscurrent flags / legacy conflictG-11              |
| Summary             | Brief / Job ID                               | Read-only / Copy    | savedcanonicalBrief/id; missing-และ copydisabled                     |
| Summary             | เปิดดูประกาศ / ผู้สมัคร                      | Read-only           | savedper posting; missing0 คน; ไม่ live                              |
| คุณสมบัตินักรีวิว   | Special Criteria / Platform / Follower Range | Read-only           | saved + Edit-compatiblelegacyfallback; empty-; followerunitfollowers |
| รายละเอียดค่าตอบแทน | ค่าจ้างรวมค่าเดินทาง (บาท) / ค่าสินค้า (บาท) | Read-only           | savedwage/budgetMinfallback; groupednumber; zero0/empty-             |
| ข้อมูลประกาศ        | รายละเอียดงาน                                | Read-only Rich Text | saved sanitizedHTML หรือ legacytext; empty-; example แยก             |

### Business Rules

BR-01: ไม่แสดง Benefit/ProductOption/targets/generatedgroup/scope/reference เป็น current UI; optionaldates/points เป็น pending G-03/G-20

BR-02: unknownID ต้องไม่สรุปว่ามี not-found page แล้ว; currentfallback ผิด identity เป็น G-14

BR-03: seed formatting example ไม่ใช่ข้อมูล saved และไม่เอาไป inherit อัตโนมัติ

### Acceptance Criteria

AC-01: Data fidelity

Given savedtitle/subtitle/counts

When เปิด Detail

Then ทั้ง 4rows ตรง saved values

AC-02: Missing and zero

Given wage0/productvalue ว่าง/followerrange ว่าง

When ดู information

Then wage0, productvalue-, followers- ไม่เติม sample

AC-03: Rich text safety

Given savedHTML มี bold/validHTTPSlink และ script

When ดู Detail

Then bold/link ยังใช้ได้ script ไม่ทำงาน

AC-04: Legacy criteria

Given legacy มี meaningfulage/gender และไม่มี options

When ดู Detail/Edit

Then ใช้ fallback เดียวกันไม่เห็นอายุ - ปี

AC-05: Back

Given เข้าผ่าน externalhistory แต่ joblinked Brief

When กดกลับ

Then ไป linked Brief ไม่ใช่ historyprevious

AC-06: Consistent status

Given legacydeadline ผ่านแล้ว

When ดู List แล้ว Detail

Then badge ต้องปิดเหมือน List; currentGap ยังไม่ผ่าน

### References

- Prototype: [/job-postings/JOB20260901](https://prelist-mu.vercel.app/job-postings/JOB20260901)
- Source Code: [src/features/job-postings/JobPostingSummary.jsx](src/features/job-postings/JobPostingSummary.jsx), [src/features/job-postings/JobPostingInformation.jsx](src/features/job-postings/JobPostingInformation.jsx), [src/features/job-postings/announcementRichText.js](src/features/job-postings/announcementRichText.js), [src/features/job-postings/JobPostingDetail.jsx](src/features/job-postings/JobPostingDetail.jsx)
- Related Stories: ANN-01, ANN-04, ANN-07, REV-01

## ANN-07

### Story Title

[Announcement] พรีวิวและคัดลอกลิงก์สมัคร

### User Story

As a Buyer / PM,
I want to พรีวิวประกาศและคัดลอกลิงก์สมัคร,
So that ตรวจงานและแบ่งปันช่องทางรับสมัคร.

### Description

Implementedmock: externalpreview และ clipboardbuttons; realdynamiclinks/previewPending Confirmation

### Functional Requirements

FR-01: พรีวิวประกาศบน Detail และ saveconfirmation เปิด BuddyReviewpreview ในแท็บใหม่ ไม่ save หรือปิด confirmation

FR-02: เมื่อ copyBrief/JobID ให้คัดลอกค่าของ record ที่กดพร้อม success feedback ไม่ navigate

FR-03: copylink จาก Table/Detail enabled เมื่อ current explicit status ไม่ Draft และ announcementStatus ไม่ inactive; disabled มี helper ต้องเปิดรับสมัครแคมเปญก่อน

FR-04: ไม่กล่าวว่า prototype สร้าง shortlink/publiclink จริง; URL สองหน้าต่างกันตาม G-12 ต้องตกลง canonical URL ก่อน production

FR-05: กรณี clipboard ไม่พร้อม/เขียนไม่สำเร็จให้กำหนด error UX ก่อน release; current hook ไม่ await/catch ไม่ใช้ toast เป็น proof ว่าสำเร็จ

### Business Rules

BR-01: fixed preview = https://www.buddyreview.co/campaign/EMr3CC9K56/preview ทุก record เป็น sample

BR-02: Table URLhttps://buddyreview.co/apply/{id}; Detailhttps://bdy.link/{id.lowercase}; ยังไม่ยืนยันทั้งสอง URL สมัครได้จริง

BR-03: legacyclosedlink ยัง enabled จาก flags แม้ badgeclosed: intendedeligibility ต้องยืนยัน G-11 ไม่สร้าง businesspolicy เพิ่ม

### Acceptance Criteria

AC-01: Preview

Given Detail หรือ confirmation เปิดอยู่

When กดพรีวิว

Then เปิด fixedexternalpreviewnew tab และไม่ persist ข้อมูล

AC-02: Draft blocked

Given postingexplicitDraft

When ดู copylink

Then disabled และมี helper ไม่ copy

AC-03: Inactive blocked

Given manualinactive

When ดู Table/Detail

Then copydisabled ทั้งสองหน้า

AC-04: Current URL behavior

Given manualactiveIDJOB123

When copy จาก Table และ Detail

Then current mock ได้ apply/JOB123 และ bdy.link/job123 ตามลำดับ; productioncanonical ยัง pending

AC-05: Identity copy

Given มี Brief/JobID

When copy แต่ละ ID

Then clipboard ตรงค่าที่กดไม่ใช่ title/URL

### References

- Prototype: [/job-postings/JOB20260901](https://prelist-mu.vercel.app/job-postings/JOB20260901)
- Source Code: [src/features/job-postings/PostingCalendarList.jsx](src/features/job-postings/PostingCalendarList.jsx), [src/features/job-postings/JobPostingDetail.jsx](src/features/job-postings/JobPostingDetail.jsx), [src/features/job-postings/JobPostingSaveModal.jsx](src/features/job-postings/JobPostingSaveModal.jsx), [src/hooks/useCopy.js](src/hooks/useCopy.js)
- Related Stories: BRF-01, ANN-01, ANN-06

## REV-01

### Story Title

[Reviewer] ดูรายชื่อนักรีวิวตามสถานะ

### User Story

As a Buyer / PM,
I want to ดูผู้สมัครและสถานะการคัดเลือกใน List หรือ Card,
So that เปรียบเทียบโปรไฟล์และเลือกผู้เหมาะสม.

### Description

Implementedsample: tab รายชื่อนักรีวิว; sourcePRELIST_REVIEWERS เฉพาะ seedposting ไม่ใช่ liveapplicant API

### Functional Requirements

FR-01: เปิดรายชื่อนักรีวิว default สมัคร/list; subtabs สมัคร/ทีมงานเลือกแล้ว/ลูกค้าเลือกแล้ว/Reject พร้อม counts

FR-02: current filter สมัคร=no decision/pending; team=TeamAccept; customer=Accept; Reject=Reject; tabchangepage1

FR-03: List/Card แสดง username/platform/followers/likes/EngageLv/EstReach/age/gender/portfolio/sampleapplytime ตาม data; viewchange ไม่เปลี่ยน decisions/selection

FR-04: 24 ต่อหน้าและ Previous/Next/page buttons; ไม่มี verifiedreviewersearch/sortcontrols

FR-05: username เป็น profileentry ไม่มี separateprofilebutton; currentfixedBuddyReviewFacebooklink เป็น Gap ให้ใช้ actualsavedprofile URL เมื่อมี datasource

FR-06: เมื่อไม่มี rows ไม่สร้าง samplereviewers ใน newposting; exactempty-messageUXPending Confirmation

### Field Specification

| Section             | Label                                              | Field Type    | Validation Rules                                                     |
| ------------------- | -------------------------------------------------- | ------------- | -------------------------------------------------------------------- |
| Reviewer navigation | สมัคร / ทีมงานเลือกแล้ว / ลูกค้าเลือกแล้ว / Reject | Tabs          | default สมัคร; source filtereddecisions; countsallrows ไม่เฉพาะ page |
| View                | List / Card                                        | Toggle        | defaultlist; preserve selection                                      |
| Profiles            | Username / Platform / profile metrics              | Read-only     | sample/savedprofiledata; missing handling ใน productionpending       |
| Pagination          | หน้า                                               | Page controls | 24rows/page; tabchange กลับ 1                                        |

### Business Rules

BR-01: ทีมงานเลือกแล้ว semanticconflictG-06 ต้องยืนยัน; table นี้รายงาน current filter ไม่แอบเปลี่ยน pending เป็น team

BR-02: count ใน tab ใช้ reviewerrowlength ไม่ใช่ savedsummaryapplicants; G-16 ต้องตกลง source of truth

BR-03: profiledata/สมัครเมื่อ hardcodedsample ไม่ใช้เป็น verifiedanalytics

### Acceptance Criteria

AC-01: Filter

Given reviewers มี 4statuses

When สลับแต่ละ tab

Then rows ตรง current mapping และ counts ไม่ตาม pagination

AC-02: Views

Given เลือก eligibleID ไว้

When สลับ List/Card

Then IDselection และ decisions คงเดิม

AC-03: Pagination

Given สมัครมากกว่า 24

When ไปหน้า 2 แล้วเปลี่ยน Reject

Then Reject เริ่มหน้า 1

AC-04: No invented applicants

Given newpostingapplicants เป็น 0

When เปิด reviewertab

Then ไม่มี PRELIST_REVIEWERS เติมให้อัตโนมัติ

AC-05: Profile source

Given reviewer มี actual profile URL ใน futureadapter

When คลิก username

Then เปิดคนนั้น new tab; currentfixedURL เป็น gap

### References

- Prototype: [/job-postings/JOB20260901](https://prelist-mu.vercel.app/job-postings/JOB20260901)
- Source Code: [src/features/job-postings/JobPostingDetail.jsx](src/features/job-postings/JobPostingDetail.jsx), [src/features/projects/prelistSeeds.js](src/features/projects/prelistSeeds.js), [src/features/job-postings/useReviewerDecisions.js](src/features/job-postings/useReviewerDecisions.js)
- Related Stories: ANN-06, REV-02, REV-03, REV-05

## REV-02

### Story Title

[Reviewer] คัดเลือกหรือ Reject นักรีวิว

### User Story

As a Buyer / PM,
I want to ยืนยันการ Accept หรือ Reject ผู้สมัครรายคน,
So that แยกผู้ผ่านการคัดเลือกและติดตามผู้ตัดสินใจได้.

### Description

Implementedtwo-stage Accept; actorpermissionsPending ConfirmationG-06/G-09 ไม่ถือว่า buttonvisibility เป็น authorization

### Functional Requirements

FR-01: แสดง Reject ซ้าย/Accept ขวาใน cardfooter หลัง details; กดเปิด confirmationaction และจำนวน 1 ยังไม่ mutate

FR-02: ยืนยัน Accept จาก no decision/pending→TeamAccept; จาก TeamAccept→Accept; Reject จาก pending/team→Reject ตาม current handler

FR-03: ยกเลิก/close/backdropconfirmation ไม่เปลี่ยน decision; เมื่อ confirmupdateper posting แล้ว tabcounts/rows เปลี่ยน

FR-04: Acceptfinal แสดงลูกค้าเลือกแล้วและ Rejectfinal แสดงถูก Reject แทน buttons; team ยังมี buttons เพื่อ second-stage

FR-05: persiststatus และผู้ตัดสินใจแยก posting/reviewer; displaybuyerdecisionidentity ตาม Specified (currentfooter ไม่แสดง); ไม่ใช้ sample email เป็น productionactor

### Business Rules

BR-01: current status pending→TeamAccept→Accept มี Reject ทางออกก่อน final; ไม่มี verifiedUndo/Reopendecision

BR-02: finalAccept/Reject ไม่มี decision buttons; conflictingearlierhide-after-anydecision ไม่ใช้ลบ secondstage เงียบๆ ต้องยืนยัน G-06

BR-03: ผู้ตัดสินใจจริงและสิทธิ์ Buyer/PM รวม timestampcontractpending; currentbyfixedemail single ไม่ savedate

BR-04: ตัดสินใจหนึ่ง posting ไม่เปลี่ยนอีก posting แม้ reviewer ID เหมือนกัน

### Acceptance Criteria

AC-01: Team accept

Given pending reviewer

When กด Accept แล้วยืนยัน

Then อยู่ TeamAccept และ tabteamcount เพิ่ม

AC-02: Customer accept

Given TeamAccept reviewer

When Accept แล้วยืนยัน

Then อยู่ Accept customerselected ไม่มี buttons

AC-03: Reject

Given pending หรือ TeamAccept

When Reject แล้วยืนยัน

Then อยู่ Reject แสดงถูก Reject ไม่มี decision buttons

AC-04: Cancel

Given เปิด decisionconfirmation

When Cancel

Then decision/counts ไม่เปลี่ยน

AC-05: Isolation

Given reviewer ID เดียวอยู่ posting A/B

When Reject ใน A แล้ว reload

Then AReject B ไม่เปลี่ยน

AC-06: Decision actor display

Given saveddecision มี actual buyer

When แสดง List/Card

Then เห็น status และ buyer ผู้ตัดสินใจ; currentdisplaygap

### References

- Prototype: [/job-postings/JOB20260901](https://prelist-mu.vercel.app/job-postings/JOB20260901)
- Source Code: [src/features/job-postings/JobPostingDetail.jsx](src/features/job-postings/JobPostingDetail.jsx), [src/features/job-postings/useReviewerDecisions.js](src/features/job-postings/useReviewerDecisions.js)
- Related Stories: REV-01, REV-03, REV-06

## REV-03

### Story Title

[Reviewer] เลือกและตัดสินใจนักรีวิวเป็นกลุ่ม

### User Story

As a Buyer / PM,
I want to เลือกผู้สมัครหลายคนและยืนยันการตัดสินใจครั้งเดียว,
So that ลดงานซ้ำขณะคัดเลือกจำนวนมาก.

### Description

Implementedbaseline: selectioncurrent page/cross views และ bulk; toolbarrestriction กับ exportSpecified เป็น G-05

### Functional Requirements

FR-01: แสดง checkbox และ select-all ใน List/Card; current decision eligibility ไม่มี decision หรือ TeamAccept; finalAccept/Rejectdisabled

FR-02: select-all เลือก/ยกเลิก eligible เฉพาะ current page24rows ตาม baseline; จำนวน selected รวม ข้าม tabs, views และ pages; clearselection ล้างทั้งหมด

FR-03: รักษา selection เมื่อเปลี่ยน tab/view/page และเปิดปิด Editmodal; reloadpersistence ไม่ได้ Specified สำหรับ selection

FR-04: bulkAccept/Rejectdisabled เมื่อไม่มี eligible chosen; click แสดง confirmationaction/จำนวน; Cancel ไม่ mutate

FR-05: Confirm ใช้ transition เดียวกับ REV-02 ต่อ record และ saveper posting; clearselection หลัง success; currentbulk เพิ่ม date/sentBynull

FR-06: fixedtoolbarbottomcenter ตาม mainwidth มี space ท้าย list ไม่บัง cards; export ชิดขวา เป็น primaryexport เดียว; currentCSVlabel ตาม REV-04

### Field Specification

| Section            | Label                        | Field Type               | Validation Rules                                                                                          |
| ------------------ | ---------------------------- | ------------------------ | --------------------------------------------------------------------------------------------------------- |
| Reviewer selection | Checkbox / select-all        | Checkbox                 | currenteligiblepending(no decision)/TeamAccept; final states disabled; select-allcurrent pagebaselineG-07 |
| Floating toolbar   | เลือก N คน / Clear selection | Read-only count / Action | derivedeligibleIDs; cross-tab/viewpreserve                                                                |

### Business Rules

BR-01: การ select เพื่อ decisions กับ team-onlyexport ต้องแยก policy ชัดเจน; AGENTS บอก disableothercheckboxes แต่ pendingbulkcurrent ใช้ checkbox เดียวกัน เป็น POdecision ไม่แอบกำหนด UI ใหม่

BR-02: export ต้องกรอง TeamAccept ทุกครั้งตาม REV-04 แม้ selection มี pending

BR-03: currentexplicitpendingdecisionobject ถูก matchesTab เป็นสมัครแต่ canDecide ไม่ eligible; inconsistency ต้องยืนยัน/แก้ก่อน production

### Acceptance Criteria

AC-01: Select current page

Given 25eligiblepending ในสมัคร

When select-all หน้า 1

Then baseline เลือก 24 ไม่รวมหน้า 2; scopefinalpending

AC-02: Preserve

Given เลือก ID แล้วสลับ tab/card/page

When กลับ tab เดิม

Then ID ยัง selected และ count ตรง

AC-03: Bulk transition

Given selectedpending2/team1

When bulkAcceptconfirm

Then pending2→TeamAccept/team1→Accept และ selection ล้าง

AC-04: Bulk cancel

Given selected2records

When Reject แล้ว Cancel

Then status และ selection ยังเดิม

AC-05: Final restriction

Given Accept/Rejectfinal

When attemptselection

Then checkboxdisabled ไม่รวม bulk

AC-06: Toolbar

Given อยู่ 390px หรือ 320px และ lastcard

When scroll ท้าย

Then toolbar ไม่บัง lastcontent และ actions อ่านได้

### References

- Prototype: [/job-postings/JOB20260901](https://prelist-mu.vercel.app/job-postings/JOB20260901)
- Source Code: [src/features/job-postings/JobPostingDetail.jsx](src/features/job-postings/JobPostingDetail.jsx), [src/styles/global.css](src/styles/global.css)
- Related Stories: REV-01, REV-02, REV-04

## REV-04

### Story Title

[Reviewer] Export นักรีวิวที่ทีมงานเลือก

### User Story

As a Buyer / PM,
I want to Export เฉพาะนักรีวิวที่ทีมงานเลือกและฉันเลือกไว้,
So that ส่งข้อมูลโปรไฟล์ที่พร้อมพิจารณาต่อเป็นไฟล์เปิดใน Excel.

### Description

ImplementedCSV / GapG-05: current labelExport CSV (N); intendedprimarylabelExport Excel ตาม AGENTS

### Functional Requirements

FR-01: ใน team-selected tab มี exportselectedaction; currentfixedtoolbarCSVbutton แต่ intendedlabelExportExcel และชิดขวา primary เดียว

FR-02: ก่อน download กรอง selected เฉพาะ TeamAccept ห้าม pending/Acceptfinal/Reject ออกไฟล์แม้ selection ข้าม tab

FR-03: ไฟล์ Excel-compatibleUTF-8BOMCSV ชื่อ reviewers-{JobID}.csv columns Username/Platform/Followers/Est. Reach; escapequotes/delimiters

FR-04: ไม่มี eligibleselected ไม่ download; หลัง successclearselection และแจ้งจำนวน export; ไม่ exportallunselected

FR-05: export ไม่เปลี่ยน status/decision และไม่นับเป็นส่ง Sale

### Business Rules

BR-01: ไฟล์เป็น CSV ไม่ใช่ XLSX แม้ button ชื่อ ExportExcel

BR-02: eligibleTeamAccept เท่านั้น specified; currentcanSelect ยังรวม pending เป็น gap

BR-03: การรักษา selection หลัง export ไม่ได้ specified เดิม; ใช้ currentclearselectionbaseline

### Acceptance Criteria

AC-01: Selected-only

Given TeamAcceptA/B แต่เลือก A

When export

Then ไฟล์มี A ไม่มี B และ headers4columns

AC-02: Cross-tab guard

Given เลือก pendingC และ TeamAcceptA

When export จาก team tab

Then มี A เท่านั้น ไม่มี C

AC-03: Zero eligible

Given selection มีแต่ pending

When attemptExport

Then ไม่ downloadfile

AC-04: Encoding

Given username มีไทย/quote/comma

When downloadCSV

Then UTF-8BOM และ quoted cells ครบเปิดใน Excel อ่านถูก

AC-05: No decision mutation

Given selectedTeamAccept

When export

Then status ยัง TeamAccept selection ล้างพร้อม notice

### References

- Prototype: [/job-postings/JOB20260901](https://prelist-mu.vercel.app/job-postings/JOB20260901)
- Source Code: [src/features/job-postings/JobPostingDetail.jsx](src/features/job-postings/JobPostingDetail.jsx)
- Related Stories: REV-02, REV-03

## REV-05

### Story Title

[Reviewer] เพิ่มนักรีวิวรายคนและนำเข้ารายชื่อ

### User Story

As a Buyer / PM,
I want to เพิ่มนักรีวิวรายคนหรือ BulkUpload เข้าประกาศ,
So that รวบรวมรายชื่อในงานที่ถูกต้องโดยตรวจซ้ำก่อนนำเข้า.

### Description

Specified / GapG-08 ไม่มี current UI/handler ให้ยืนยัน fields เพิ่ม; Story นี้ยังมี Pending Confirmation ก่อน Dev เริ่ม validation รายละเอียด

### Functional Requirements

FR-01: เพิ่มนักรีวิวต้องเสนอ singleentry และ BulkUpload; scope เฉพาะ posting ที่เปิดอยู่

FR-02: BulkUpload รับ CSV/TSVfile หรือ pasteusername/platformcolumns มี template/preview และ duplicatevalidation ก่อน persist

FR-03: ผู้ใช้ตรวจ preview และยืนยันจึงเพิ่ม; cancel ไม่เพิ่ม; reviewer ใหม่เริ่ม pending ไม่สร้าง acceptdecision

FR-04: persistaddedreviewersper posting และให้ Detail อ่าน records เดียวกัน; ห้าม seednew announcement ด้วย globalPRELIST_REVIEWERS

FR-05: ชื่อ field/username format/platformnormalization/file limits/invalid-rowhandling/duplicate key ต้อง PO ยืนยัน ไม่อ้าง rules จาก Campaignimport เป็น postingrules

### Field Specification

| Section                                      | Label                                                            | Field Type  | Validation Rules                                                                      |
| -------------------------------------------- | ---------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------- |
| Single entry — section/label ยังไม่ verified | Username (concept; exact UI Pending Confirmation)                | Text        | Required concept for profile identity; regex/length/normalizationPending Confirmation |
| Single entry — section/label ยังไม่ verified | Platform (concept; exact UI Pending Confirmation)                | Select      | Platform columns: Specified; allowed import aliases/optionsPending Confirmation       |
| Bulk Upload — proposed entry                 | CSV/TSV upload (exact label Pending Confirmation)                | File Upload | CSV/TSVSpecified; MIME/size/header/encoding limitsPending Confirmation                |
| Bulk Upload — proposed entry                 | วาง username/platform columns (exact label Pending Confirmation) | Textarea    | PastedcolumnsSpecified; parser/errorstrategyPending Confirmation                      |
| Bulk Upload preview                          | Preview rows (exact label Pending Confirmation)                  | Read-only   | showparsedrows/duplicateerrors; no save before confirm                                |

### Business Rules

BR-01: ห้าม copydecision จากอีก posting; duplicateswithinfile/existing job ต้องตรวจแต่ exactidentitykey ยังไม่ verified

BR-02: Actual profile metrics ไม่สร้างตัวเลข sample ให้ imported reviewers โดยไม่มี datasource

BR-03: field tables เป็น concepts ที่ documentSpecified ชัดเจนไม่ใช่ exactprototypefields; ต้อง finalizelabels/rules ก่อน implementation

### Acceptance Criteria

AC-01: Single happy path

Given posting และ single fields ผ่าน finalized rules

When confirmadd

Then record อยู่ posting นี้และ statuspending

AC-02: Bulk happy path

Given validnonduplicatedCSV/TSV ตาม finalized template

When preview แล้ว confirm

Then เพิ่มเฉพาะ preview records ทั้งหมดใน posting นี้

AC-03: Duplicate detection

Given input มี identity ซ้ำตาม PO-approved key

When preview

Then ระบุ duplicate และไม่ persist ก่อนผู้ใช้แก้/confirm ตาม approved policy

AC-04: Cancel

Given previewparsedrows แล้ว

When Cancel

Then addedreviewercount ไม่เพิ่ม

AC-05: Job isolation

Given import ใน posting A

When เปิด posting B

Then ไม่เห็น Aimports เพราะคนละงาน

### References

- Prototype: [/job-postings/JOB20260901](https://prelist-mu.vercel.app/job-postings/JOB20260901)
- Source Code: [src/features/job-postings/JobPostingDetail.jsx](src/features/job-postings/JobPostingDetail.jsx), [src/features/job-postings/jobPostingApi.js](src/features/job-postings/jobPostingApi.js), [AGENTS.md](AGENTS.md)
- Related Stories: REV-01, REV-02, ANN-06

## REV-06

### Story Title

[Reviewer] ส่งต่อผู้ผ่านการคัดเลือกและดูการยืนยันรับงาน

### User Story

As a Buyer / PM,
I want to ส่งผู้ผ่านลูกค้าเลือกต่อ Sale และเปิดหน้าการยืนยันรับงาน,
So that ติดตามการส่งต่องานหลังการคัดเลือก.

### Description

Specified / GapG-08: sendToSales มี hook แต่ไม่มี action ใน current UI; externalClaudeartifact URL ไม่พบค่าที่ตรวจได้ใน sources รอบนี้

### Functional Requirements

FR-01: เสนอ send-toSale เฉพาะ Acceptfinal ที่ยังไม่ส่ง; rejected ไม่มี action; team/pending ไม่ eligible ตาม Specified

FR-02: เมื่อส่งให้บันทึกผู้ส่ง per posting และไม่เสนอ action ซ้ำ; current hook เพียง localmarker ไม่มี actual Sale integration

FR-03: ยืนยันรับงานแล้วใน statusnavigation เปิด user-supplied Claude artifact URLnew tab; destinationURL/labelposition ต้องยืนยันก่อนเพิ่ม

FR-04: ไม่เปลี่ยน Accept เป็น confirmed เพียงเพราะเปิด externalpage; confirmationdata/statussync/notificationcontractPending Confirmation

### Business Rules

BR-01: awaitingsubmission ใน prototypehook คือ Accept และไม่มี sentBy; businessconfirmationstate/API ยังไม่ verified

BR-02: ไม่มี permissionmatrixSale/Buyer/PM หรือ deliveryretry/errorcontract; ห้ามอ้างว่าส่งข้อความ/ข้อมูลจริงแล้ว

BR-03: ห้าม inventartifact URL หรือ actual sent buyer identity

### Acceptance Criteria

AC-01: Eligibility

Given มี pending/team/Reject/Acceptunsent

When ดู actions

Then send-toSale เฉพาะ Acceptunsent

AC-02: Prevent repeat

Given Accept มี sentBy แล้ว

When กลับหน้าเดิม

Then ไม่เสนอส่งซ้ำ

AC-03: Record isolation

Given ส่ง Accept ใน posting A

When ดู posting B ที่ reviewer ID เดียว

Then sent marker ของ B ไม่เปลี่ยน

AC-04: External confirmed view

Given PO ให้ artifact URL และ entry point approved แล้ว

When กดยืนยันรับงานแล้ว

Then เปิด URL ที่ให้ใน new tab โดยไม่แก้ decision ของ posting

### References

- Prototype: [/job-postings/JOB20260901](https://prelist-mu.vercel.app/job-postings/JOB20260901)
- Source Code: [src/features/job-postings/useReviewerDecisions.js](src/features/job-postings/useReviewerDecisions.js), [src/features/job-postings/JobPostingDetail.jsx](src/features/job-postings/JobPostingDetail.jsx), [AGENTS.md](AGENTS.md)
- Related Stories: REV-02, REV-05

## Quality Gate และขอบเขตการรับงาน

- ครอบคลุม accessible routes/actions: Sidebar, Brief list/search/pagination/counts/copy/create, Brief detail/back/edit, linked Table/search/status/pagination/ID/link/detail/create, Announcement form/dropdown/editor/confirm/preview/cancel, Detail tabs/copy/edit/copy link, reviewers status/view/page/checkbox/clear/individual/bulk/export และ legacy redirects
- แยก Create/Edit/Copy/Draft/View/Approval/Export; ไม่แยก Story ตาม component; common form/modal/validation อ้าง contract เดียวไม่เขียนซ้ำทุก Story
- ตรวจ mandatory field columns และ actual option labels รวม 42 criteria / 7 platforms / 3 statuses / Owner options; ทุก requirement ระบุ Implemented/Specified/Gap/Pending และแยก UI input guards จาก save handler
- AC ของ Gap คือเกณฑ์งานที่จะต้องทำ ไม่ใช่รายงานว่า Prototype ผ่านแล้ว; AC ที่มี Pending ต้องปิดคำตัดสินก่อน QA ใช้เป็น release gate
- ไม่มี Delete/sorting/auth role policy/real analytics/public link generation/integration ที่สร้างขึ้นเอง; ไม่ดึง out-of-scope Campaign inventory รอบเก่ามาอ้างว่า verified แล้ว
- ไม่ได้ทดลอง save/rename/import/decisions/export จริง; เอกสารนี้ไม่ใช่ UAT sign-off ทุก Story ที่เกี่ยวกับ production persistence/roles/errors ต้องมี contract เพิ่มตาม G-15
- งานรอบนี้เป็น Markdown เท่านั้น ไม่มี app code/dependency/build config แก้ไข จึงไม่มี build/test ผลใหม่ให้กล่าวอ้าง
