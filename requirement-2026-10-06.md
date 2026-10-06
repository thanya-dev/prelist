# Table of Contents (สารบัญ)
- [[Story 1] Brief Management: List & Details](#story-1-brief-management-list--details)
- [[Story 2] Centralized Brief Setup: Create & Edit](#story-2-centralized-brief-setup-create--edit)
- [[Story 3] Job Posting Workflow: Draft & Publish](#story-3-job-posting-workflow-draft--publish)
- [[Story 4] Job Posting: Creator Criteria Setup](#story-4-job-posting-creator-criteria-setup)
- [[Story 5] Job Posting: Campaign Periods Setup](#story-5-job-posting-campaign-periods-setup)
- [[Story 6] Job Posting: Detail View & Engagement Tracking](#story-6-job-posting-detail-view--engagement-tracking)
- [[Story 7] Reviewer Management: Selection & Export](#story-7-reviewer-management-selection--export)
- [[Story 8] Campaign Task: Influencer Import & Management](#story-8-campaign-task-influencer-import--management)
- [[Story 9] Global Navigation: Sidebar Reorganization](#story-9-global-navigation-sidebar-reorganization)

---

# [Story 1] Brief Management: List & Details

## Business Problem
PM / Buyer ไม่สามารถดูภาพรวมและติดตามสถานะประกาศรับสมัครหลายงานที่มาจาก Brief เดียวกันได้อย่างรวดเร็ว

## Goal
ผู้ใช้สามารถมองเห็นรายการ Brief ทั้งหมด พร้อมทราบจำนวนประกาศและสถานะรับสมัครของแต่ละ Brief ได้ทันทีจากหน้ารวมและหน้า Detail ของ Brief

## Users and Responsibilities
| Role | Responsibility |
|---|---|
| PM / Buyer | ดูภาพรวมรายการ Brief และตรวจสอบสถานะประกาศหานักรีวิว |

## Scope
### In Scope
- หน้า Brief List (`/briefs`)
- หน้า Brief Detail (`/briefs/:id`) เฉพาะส่วน Summary และแท็บ
- ปฏิทินรับสมัคร (Calendar) และตารางประกาศ (Table view) ในหน้า Brief Detail
- การกรองและค้นหา Brief

### Out of Scope
- การสร้างและแก้ไข Brief (ยกไป Story อื่น)

## Business Rules
1. Total Posting ของ Brief คำนวณจากจำนวน Posting ID ที่ไม่ซ้ำและเชื่อมกับ Brief นั้น
2. แต่ละ Posting มีสถานะรับสมัครได้เพียงสถานะเดียว (แบบร่าง, รอเปิดรับ, เปิดรับสมัคร, ปิดรับสมัคร)
3. สถานะคำนวณจากช่วงวันที่รับสมัครเทียบกับวันปัจจุบัน (Asia/Bangkok)
4. การนับจำนวนจะไม่ถูกลดทอนจากการค้นหา (Search) ในหน้า List
5. ปฏิทินแสดงเฉพาะประกาศที่อยู่ใน Brief ปัจจุบันเท่านั้น
6. หากไม่มี Product option ให้แสดงสถานะ "ยังไม่มีสินค้า" ในแท็บที่เกี่ยวข้อง

## Fields & Validation
| Field Name | Type | Rules / Validation | Required |
|---|---|---|---|
| Search | Text | ค้นหาจากชื่อ หรือ Brief ID | No |
| Filter Status | Dropdown/Tabs | แบบร่าง, รอเปิดรับ, เปิดรับสมัคร, ปิดรับสมัคร | No |

## User Flow
1. เข้าสู่เมนู "ประกาศหานักรีวิว" หรือ "Briefs"
2. ดูรายการ Brief List พร้อมสถิติจำนวนประกาศตามสถานะ
3. ค้นหา Brief จากชื่อหรือ Brief ID
4. คลิกเปิด Brief เข้าสู่หน้า Brief Detail
5. สลับแท็บ "ประกาศหานักรีวิว" และ "Product Option"
6. ดูปฏิทินรับสมัครหรือสลับเป็นมุมมองตาราง

## Conditions and Results
| Condition | System behavior | Next state or actor |
|---|---|---|
| ค้นหาไม่พบรายการ Brief | แสดง Empty State "ไม่พบบรีฟ" พร้อมปุ่มล้างคำค้นหา | ผู้ใช้กดล้างคำค้นหาเพื่อดูทั้งหมด |
| คลิกประกาศใน Calendar/Table | นำทางไปยังหน้า Job Posting Detail ของประกาศนั้น | ระบบแสดงข้อมูล Job Posting |
| กดปุ่ม Back ในหน้า Brief Detail | นำทางกลับไปยัง Brief list เสมอ | ระบบแสดงหน้า Brief List |

## Acceptance Criteria
1. หน้า Brief List ต้องแสดงตัวนับสถานะประกาศครบทุกสถานะ แม้ว่าจำนวนจะเป็น 0
2. เปลี่ยนเดือนใน Calendar หรือเปลี่ยนสถานะตัวกรอง ต้องไม่ทำให้ยอดรวมของสถานะ (Status Pills) ด้านบนเปลี่ยน
3. Highlight วันนี้ใน Calendar อ้างอิงตามเวลา Asia/Bangkok
4. เมื่อสลับแท็บระหว่าง ประกาศหานักรีวิว และ Product Option จะต้องคงสถานะตัวกรองเดิมไว้

## Open Questions
1. -

## References
- **Flow:** [Link / Soon]
- **Prototype:** https://prelist-mu.vercel.app/
- **Design:** https://github.com/thanya-dev/prelist/tree/main

---

# [Story 2] Centralized Brief Setup: Create & Edit

## Business Problem
PM / Buyer ต้องกรอกข้อมูลแบรนด์และสินค้ายืนพื้นซ้ำๆ เมื่อสร้างประกาศหลายงานสำหรับแคมเปญเดียวกัน

## Goal
ผู้ใช้สามารถบันทึกข้อมูลหลัก (โลโก้, ชื่อโปรเจกต์, แบรนด์, รหัส Brief, สินค้า) เป็นข้อมูลกลางเพื่อนำไปสืบทอดสู่ประกาศอื่นๆ ได้

## Users and Responsibilities
| Role | Responsibility |
|---|---|
| PM / Buyer | สร้าง แก้ไข ข้อมูลกลางระดับ Brief และ Product Options |

## Scope
### In Scope
- ฟอร์มการสร้างและแก้ไข Brief
- การจัดการ Brief IDs (รหัสอ้างอิง)
- การจัดการ Product Options ใน Brief

### Out of Scope
- การเชื่อมต่อกับระบบ Inventory จัดส่งสินค้าจริง

## Business Rules
1. สร้าง Brief ไม่เท่ากับการสร้าง Job Posting อัตโนมัติ (เป็นข้อมูลคนละชุด)
2. Brief 1 รายการรองรับหลาย Brief IDs (`briefNumbers`) โดยไม่ซ้ำกันในระบบ
3. โลโก้, Project Name, Brand เป็น Required field
4. Product Option หากมีการเพิ่มรายการ ต้องระบุชื่อและรูปภาพ
5. รูปแบบ Brief ID ต้องประกอบด้วย Prefix (3 ตัวอักษร) ปีค.ศ. (4 หลัก) เดือน (2 หลัก) ลำดับ (3 หลัก) เช่น NRI202610001
6. การแก้ไข Brief ข้อมูลจะนำไปใช้เป็นค่าเริ่มต้นสำหรับ Job Posting ที่จะสร้างใหม่เท่านั้น ไม่แก้ไขประกาศเก่า

## Fields & Validation
| Field Name | Type | Rules / Validation | Required |
|---|---|---|---|
| Logo (Cover Image) | Image (PNG/JPG/JPEG) | ขนาดไฟล์ไม่เกิน 3 MB | Yes |
| Project Name | Text | - | Yes |
| Brand | Text | - | Yes |
| Brief IDs | Array of String | รูปแบบ Prefix 3 ตัวอักษร + ปีค.ศ. 4 หลัก + เดือน 2 หลัก + ลำดับ 3 หลัก (เช่น NRI202610001) ห้ามซ้ำในระบบ | Yes (อย่างน้อย 1) |
| Product Option: Name | Text | - | Yes (ถ้ามีการเพิ่ม Product Option) |
| Product Option: Image | Image (PNG/JPG/JPEG) | ต้องมีรูปภาพ | Yes (ถ้ามีการเพิ่ม Product Option) |

## User Flow
1. คลิก "สร้างบรีฟ" จาก Brief List หรือ "แก้ไขบรีฟ" จาก Brief Detail
2. อัปโหลดโลโก้แบรนด์
3. ระบุ Project Name และ Brand
4. เพิ่ม และจัดการ Brief IDs (ลากเปลี่ยนลำดับได้)
5. เพิ่ม และจัดการ Product Options
6. กดปุ่มบันทึก

## Conditions and Results
| Condition | System behavior | Next state or actor |
|---|---|---|
| กรอก Brief ID ผิดรูปแบบ | แสดง Error "รูปแบบ Brief ID ไม่ถูกต้อง" ใต้ฟิลด์นั้น | ผู้ใช้แก้ Brief ID |
| บันทึกข้อมูลสำเร็จ (Create) | จัดเก็บข้อมูล และนำทางไปยังหน้า Detail ของ Brief ที่เพิ่งสร้าง | ระบบแสดง Brief Detail |
| บันทึกข้อมูลสำเร็จ (Edit) | อัปเดตข้อมูล และนำทางไปยังหน้า Detail ของ Brief ปัจจุบัน | ระบบแสดง Brief Detail |
| เพิ่มรายการสินค้าแต่ใส่รูปไม่ครบ | แสดง Error และไม่อนุญาตให้บันทึก Brief | ผู้ใช้ต้องใส่รูปภาพหรือลบสินค้านั้นทิ้ง |

## Acceptance Criteria
1. สามารถบันทึกรูปภาพนามสกุล PNG/JPG/JPEG ขนาดไม่เกิน 3 MB ได้
2. หากบันทึกไม่ผ่านเนื่องจาก validation ข้อมูลที่กรอกไว้ก่อนหน้าต้องไม่หายไป
3. การแก้ไขลำดับ Brief IDs เมื่อบันทึกสำเร็จ ต้องอ้างอิง URL หน้า Detail ใหม่ด้วย Brief ID หลัก
4. สินค้าเก่าที่ไม่มีรูปสามารถแสดงผลได้ แต่สินค้าใหม่ต้องบังคับอัปโหลดรูปภาพเสมอ

## Open Questions
1. -

## References
- **Flow:** [Link / Soon]
- **Prototype:** https://prelist-mu.vercel.app/
- **Design:** https://github.com/thanya-dev/prelist/tree/main

---

# [Story 3] Job Posting Workflow: Draft & Publish

## Business Problem
ผู้ใช้กรอกประกาศรับสมัครไม่เสร็จ และระบบไม่มีฟังก์ชันการเก็บร่าง ทำให้ต้องสูญเสียข้อมูลหากต้องออกจากหน้าจอ

## Goal
ผู้ใช้สามารถบันทึกร่างประกาศ (Draft) ที่ข้อมูลไม่ครบได้ และเผยแพร่ (Publish) ประกาศเมื่อกรอกข้อมูลที่จำเป็นครบถ้วน

## Users and Responsibilities
| Role | Responsibility |
|---|---|
| PM / Buyer | สร้าง บันทึกร่าง แก้ไข และเผยแพร่ประกาศ |

## Scope
### In Scope
- การสร้าง และแก้ไขประกาศรับนักรีวิว
- การบันทึก Draft และ Publish
- Basic Information Field & Campaign Type
- การเชื่อมต่อประกาศเข้ากับ Brief ต้นทาง

### Out of Scope
- Workflow การอนุมัติเผยแพร่ประกาศ

## Business Rules
1. "Save as Draft" บังคับกรอกเพียง Title เท่านั้น ค่าอื่นๆ เก็บเท่าที่ผู้ใช้กรอกได้ทั้งหมด
2. "Publish" บังคับกรอกข้อมูลครบทุก Required field ของระบบ
3. สถานะการประกาศจะคำนวณจากวันที่รับสมัครเมื่อทำการ Publish เท่านั้น 
4. การสร้างประกาศจากหน้า Brief จะนำข้อมูล Project Name, Brand, และ Logo จาก Brief มาเป็นค่าเริ่มต้น
5. Campaign Type ต้องเลือกเพียง 1 รูปแบบ (Normal, Confidential, Private)
6. แต้มคะแนนสะสม (Reward Points) จะไม่มีให้กรอกอีกต่อไป

## Fields & Validation
| Field Name | Type | Rules / Validation | Required |
|---|---|---|---|
| Campaign Title | Text | - | Yes (บังคับสำหรับ Save as Draft ด้วย) |
| Project Name | Text | ดึงค่าจาก Brief ต้นทาง | Yes (สำหรับ Publish) |
| Brand | Text | ดึงค่าจาก Brief ต้นทาง | Yes (สำหรับ Publish) |
| Cover Image | Image | ดึงค่าจาก Brief ต้นทาง | Yes (สำหรับ Publish) |
| Campaign Type | Radio | เลือกได้ 1 ค่า (Normal, Confidential, Private) | Yes (สำหรับ Publish) |

## User Flow
1. กดปุ่ม สร้างประกาศ จาก Brief Detail ต้นทาง
2. ระบบตั้งค่าเริ่มต้น (Title, Brand, Logo) โดยดึงจาก Brief ต้นทาง
3. ผู้ใช้ระบุ Campaign Type
4. ผู้ใช้กรอกข้อมูลส่วนต่างๆ ของประกาศ
5. เลือกว่าจะ "Save as Draft" หรือ "สร้างประกาศ" (Publish)

## Conditions and Results
| Condition | System behavior | Next state or actor |
|---|---|---|
| ผู้ใช้คลิก Save as Draft แต่ Title ว่าง | ไม่บันทึก และแสดง Error ใต้ฟิลด์ Title | ผู้ใช้ต้องระบุ Title |
| ผู้ใช้คลิก Save as Draft สำเร็จ | จัดเก็บข้อมูลบางส่วน และเปลี่ยนสถานะประกาศเป็น "แบบร่าง" | ระบบนำทางไป Job Posting Detail |
| ผู้ใช้คลิก สร้างประกาศ (Publish) แต่ข้อมูลไม่ครบ | ไม่บันทึก และแสดง Error ตามฟิลด์ที่ขาดหาย | ผู้ใช้กรอกข้อมูลให้ครบ |
| ผู้ใช้คลิก สร้างประกาศ สำเร็จ | จัดเก็บข้อมูล และปรับสถานะประกาศตามวันที่ปัจจุบัน | ระบบนำทางไป Job Posting Detail |

## Acceptance Criteria
1. สามารถ Save as Draft โดยมีข้อมูลเฉพาะ Campaign Title ได้ และข้อมูลฟิลด์อื่นๆ ที่ผู้ใช้กรอกค้างไว้จะต้องไม่สูญหายเมื่อเปิดแก้ไขอีกครั้ง
2. การเลือก Campaign Type ค่าต้องถูกบันทึกและรักษาสถานะได้อย่างถูกต้อง แม้จะเป็นการ Save as Draft
3. การแก้ไข (Edit) ประกาศจะต้องบันทึกค่ากลับลงไปใน Posting ID เดิมเสมอ และไม่รีเซ็ตยอด View / Applicant เดิม
4. ไม่พบช่องกรอกข้อมูล "แต้มรางวัล" ในฟอร์มประกาศ

## Open Questions
1. สำหรับ Private campaign ระบบการทำงานของ Public link ควรแสดงผลอย่างไรหากไม่มีการเปิดรับสมัคร?

## References
- **Flow:** [Link / Soon]
- **Prototype:** https://prelist-mu.vercel.app/
- **Design:** https://github.com/thanya-dev/prelist/tree/main

---

# [Story 4] Job Posting: Creator Criteria Setup

## Business Problem
การตั้งเงื่อนไขนักรีวิวไม่ชัดเจน ทำให้กลุ่มเป้าหมายนักรีวิวไม่ตรงกับที่แคมเปญต้องการ และเลือกแพลตฟอร์มที่ไม่สอดคล้องกับประเภทงาน

## Goal
ผู้ใช้สามารถกำหนดเกณฑ์อายุ ผู้ติดตาม เพศ แพลตฟอร์ม และรูปแบบ Content ได้อย่างถูกต้อง โดยระบบจะกลั่นกรองและห้ามเลือก Scope ที่แพลตฟอร์มไม่รองรับ

## Users and Responsibilities
| Role | Responsibility |
|---|---|
| PM / Buyer | กำหนดเกณฑ์คุณสมบัตินักรีวิว และ Content Scope ในประกาศ |

## Scope
### In Scope
- ส่วน Target Influencer และ Target Post (Goals)
- ส่วนการกำหนดเกณฑ์อายุ และผู้ติดตาม (MIN/MAX)
- ส่วนเพศ และข้อมูลเป้าหมาย (Target Group)
- ส่วน Platform และ Scope / Content Types

### Out of Scope
- ระบบคัดเลือกผู้สมัครอัตโนมัติอ้างอิงจาก Criteria

## Business Rules
1. Target Influencer ต้อง ≥ 1
2. Target Post ต้อง ≥ 0 (สามารถกำหนดเป็น 0 ได้)
3. Age MIN/MAX และ Follower MIN/MAX ต้องมีค่าครบทั้งคู่สำหรับ Publish และ MIN ≤ MAX
4. ข้อมูล Scope/Content types ที่ให้เลือก ต้องแสดงเฉพาะประเภทที่ใช้งานได้กับ Platform ที่ถูกเลือกไว้
5. หากผู้ใช้เอาติ๊ก Platform ออก ระบบจะล้าง Scope ที่ขัดแย้งทิ้งโดยอัตโนมัติ
6. Gender สามารถเลือกได้หลายค่า (เก็บค่าเป็น Array)

## Fields & Validation
| Field Name | Type | Rules / Validation | Required |
|---|---|---|---|
| Target Influencer | Number | ต้อง ≥ 1 (จำนวนเต็มบวก) | Yes (สำหรับ Publish) |
| Target Post | Number | ต้อง ≥ 0 (จำนวนเต็มบวก หรือ 0) | Yes (สำหรับ Publish) |
| Target Group | Text | - | Yes (สำหรับ Publish) |
| Gender | Checkboxes | เลือกได้หลายค่า (เก็บค่าเป็น Array) | Yes (สำหรับ Publish) |
| Age MIN / MAX | Number | MIN ≤ MAX | Yes (สำหรับ Publish) |
| Follower MIN / MAX | Number | MIN ≤ MAX | Yes (สำหรับ Publish) |
| Platform | Checkboxes | เลือกได้อย่างน้อย 1 ค่า | Yes (สำหรับ Publish) |
| Scope / Content Types | Radio/Checkbox | ตัวเลือกจำกัดตาม Platform ที่เลือก หากเอา Platform ออก Scope ที่ขัดแย้งจะถูกล้างทิ้ง | Yes (สำหรับ Publish) |

## User Flow
1. เปิดหน้าสร้าง/แก้ไขประกาศ เลื่อนไปยังส่วน Creator Criteria
2. ระบุจำนวนเป้าหมาย Influencer และ Post
3. เลือกเพศ ระบุ Target Group และกำหนดช่วงอายุ / ผู้ติดตามขั้นต่ำและสูงสุด
4. เลือก Platform รับงาน (เช่น Facebook, Instagram, TikTok)
5. เลือก Scope ประเภทคอนเทนต์ (จำกัดตัวเลือกตาม Platform)

## Conditions and Results
| Condition | System behavior | Next state or actor |
|---|---|---|
| ระบุค่าตัวเลขติดลบ หรือทศนิยม | ไม่บันทึก และแสดง Error ใต้ฟิลด์เมื่อกด Publish | ผู้ใช้ต้องแก้ไขเป็นจำนวนเต็มบวก |
| เอา Platform ออกจน Scope เดิมใช้งานไม่ได้ | ล้างข้อมูล Scope เดิมทิ้ง | ผู้ใช้เลือก Scope ใหม่อีกครั้ง |
| ระบุค่า MIN มากกว่า MAX | ไม่บันทึก และแสดง Error แจ้งช่วงที่ไม่ถูกต้องเมื่อกด Publish | ผู้ใช้เปลี่ยนให้ MIN ≤ MAX |

## Acceptance Criteria
1. ระบบไม่ปิดกั้นหากผู้ใช้กรอก Target Post เป็น 0 (สามารถทำได้)
2. เมื่อผู้ใช้กลับมา Edit ประกาศ ค่า Platform และ Scope ทั้งหมดที่เลือกไว้จะต้องถูกต้องตรงกับที่เคยบันทึกไว้
3. ข้อมูล Gender ที่บันทึกต้องรองรับหลายค่าได้

## Open Questions
1. -

## References
- **Flow:** [Link / Soon]
- **Prototype:** https://prelist-mu.vercel.app/
- **Design:** https://github.com/thanya-dev/prelist/tree/main

---

# [Story 5] Job Posting: Campaign Periods Setup

## Business Problem
ผู้ใช้มักสับสนระหว่างช่วงเปิดรับสมัคร และช่วงลงมือทำคอนเทนต์ ทำให้เกิดปัญหาว่าเริ่มงานก่อนที่การรับสมัครจะเสร็จสิ้น

## Goal
ผู้ใช้สามารถกำหนดช่วงเวลารับสมัคร และช่วงเวลาทำแคมเปญแยกจากกันได้ชัดเจน โดยระบบบังคับให้ช่วงแคมเปญต้องไม่เกิดก่อนวันปิดรับสมัคร

## Users and Responsibilities
| Role | Responsibility |
|---|---|
| PM / Buyer | กำหนดช่วงวันที่รับสมัครและกำหนดการทำแคมเปญ |

## Scope
### In Scope
- ส่วนระยะเวลารับสมัคร (Apply Start Date, Deadline)
- ส่วนระยะเวลาทำแคมเปญ (Start Date, End Date)

### Out of Scope
- ระบบเตือน (Notifications) หรือกำหนดเวลา Timezone อัตโนมัติตาม Browser (กำหนดให้ยึดที่วันที่)

## Business Rules
1. Publish rule: Deadline ≥ Apply Start Date
2. Publish rule: Start Date ≥ Deadline (ช่วงทำแคมเปญต้องเกิดหลังปิดรับสมัคร)
3. Publish rule: End Date ≥ Start Date
4. ค่าวันที่ใน Draft rule: สามารถว่างได้ หรือเรียงผิดลำดับเวลาได้ (ยังไม่มีผลจนกว่าจะ Publish)
5. วันที่เก็บข้อมูลในรูปแบบ ISO calendar date `YYYY-MM-DD` (ปีค.ศ.) แต่แสดงผลบน UI เป็น พ.ศ. (ปี+543)
6. หากปิดรับสมัครและเริ่มรับสมัครวันเดียวกัน ถือว่าผ่านกฎ

## Fields & Validation
| Field Name | Type | Rules / Validation | Required |
|---|---|---|---|
| Apply Start Date | Date | รูปแบบ ISO YYYY-MM-DD | Yes (สำหรับ Publish) |
| Deadline (Apply End Date) | Date | Deadline ≥ Apply Start Date | Yes (สำหรับ Publish) |
| Start Date (Campaign) | Date | Start Date ≥ Deadline | Yes (สำหรับ Publish) |
| End Date (Campaign) | Date | End Date ≥ Start Date | Yes (สำหรับ Publish) |

## User Flow
1. เปิดหน้าสร้าง/แก้ไขประกาศ เลื่อนไปยังส่วน ระยะเวลาของแคมเปญ
2. ระบุช่วงเวลาเปิด - ปิดรับสมัคร
3. ระบุช่วงเวลาเริ่ม - สิ้นสุดแคมเปญ

## Conditions and Results
| Condition | System behavior | Next state or actor |
|---|---|---|
| กำหนดวันเริ่มแคมเปญ ก่อนวันปิดรับสมัคร | ไม่อนุญาตให้ Publish และแสดง Error เตือนลำดับเวลา | ผู้ใช้แก้ไขให้ถูกต้อง |
| บันทึกแบบร่าง (Draft) โดยยังไม่ได้ระบุวันครบ | บันทึกข้อมูลค้างไว้ตามปกติ | ข้ามการตรวจสอบวันที่ |

## Acceptance Criteria
1. สามารถกำหนดวันเริ่มต้น และวันสิ้นสุดในหมวดหมู่เดียวกันเป็นวันเดียวกันได้ (เช่น 6-6 ต.ค.)
2. หากขาดวันใดวันหนึ่งไประหว่างการระบุ จะไม่สามารถ Publish ได้ แต่ยังคง Save as Draft ได้
3. การสลับหน้าจอระหว่าง Desktop และ Mobile ฟอร์มต้องไม่ทับซ้อนและจัดลำดับให้อ่านง่าย
4. บันทึกข้าม Timezone จะต้องเก็บเป็นวันที่ตายตัว และปีใน Storage ยังคงเป็น ค.ศ. เสมอ

## Open Questions
1. -

## References
- **Flow:** [Link / Soon]
- **Prototype:** https://prelist-mu.vercel.app/
- **Design:** https://github.com/thanya-dev/prelist/tree/main

---

# [Story 6] Job Posting: Detail View & Engagement Tracking

## Business Problem
ข้อมูลหน้ารายละเอียด Job Posting จัดเรียงไม่เป็นลำดับ ทำให้ตรวจสอบความถูกต้องยาก และระบบวิเคราะห์ข้อมูล (Viewer count) ไม่แสดงผล

## Goal
หน้ารายละเอียดประกาศแสดงข้อมูลในรูปแบบเดียวกับ Form ที่ใช้สร้าง และแสดงค่ายอดวิว (Viewer Count) ได้อย่างถูกต้อง

## Users and Responsibilities
| Role | Responsibility |
|---|---|
| PM / Buyer | ตรวจสอบข้อมูลประกาศฉบับเต็ม และดูยอดความน่าสนใจของประกาศ (Views) |

## Scope
### In Scope
- หน้า Job Posting Detail View Layout
- การแสดงยอดคนดูประกาศ (Viewer count / Applicant count)

### Out of Scope
- ระบบ Analytics การจับเก็บข้อมูล View/Visit จากผู้ใช้จริง (ใช้ข้อมูล Mock)
- ระบบแจ้งเตือน / Log history

## Business Rules
1. Layout หน้ารายละเอียดต้องเรียง: Setting (Campaign type) > Creator Criteria > Job Information (Periods) > Compensation > Basic Information
2. Applicant count และ Viewer count ผูกกับ Posting ID นั้นๆ โดยตรง
3. Viewer count ใช้ label ว่า `เปิดดูประกาศ` หน่วยเป็น `คน`
4. หากข้อมูลฟิลด์ใดไม่ได้ระบุไว้ (เช่นในกรณีแบบร่าง) ให้แสดงว่า "ยังไม่ระบุ" ห้ามแทนที่ด้วย Sample data มั่วๆ
5. ไม่มีข้อมูล Reward Points บนหน้ารายละเอียด (ถูกถอดออกแล้ว)

## Fields & Validation
| Field Name | Type | Rules / Validation | Required |
|---|---|---|---|
| Viewer Count | Number | อ่านอย่างเดียว, ค่าเริ่มต้น 0 | - |
| Applicant Count | Number | อ่านอย่างเดียว, ค่าเริ่มต้น 0 | - |

## User Flow
1. คลิกเข้าชม Job Posting จากหน้า Brief
2. ดูยอด `เปิดดูประกาศ` บนแผง Summary
3. เลื่อนตรวจสอบข้อมูลส่วน Criteria, Periods และ Compensation
4. กดแก้ไขประกาศจากหน้าต่างนี้เพื่อไปยังหน้า Form

## Conditions and Results
| Condition | System behavior | Next state or actor |
|---|---|---|
| ไม่พบค่า Viewer count ของประกาศนี้ | แสดงตัวเลขยอดเปิดดูประกาศเป็น 0 คน | ไม่มี |
| ไม่มีข้อมูลบางส่วนเพราะยังเป็นแบบร่าง | ปรากฏข้อมูลเฉพาะส่วนที่มี ส่วนที่ไม่มีให้ใช้ "ยังไม่ระบุ" | ไม่มี |

## Acceptance Criteria
1. ลำดับ Layout ในหน้า Detail แสดงผลตรงกันกับฟอร์มสร้างแบบร้อยเปอร์เซ็นต์
2. ค่า Viewer Count กรณีที่ไม่มีข้อมูลจะต้องไม่ Error และใช้ค่า 0
3. เมื่อผู้ใช้แก้ไข (Edit) ประกาศ ค่า Applicant Count และ Viewer Count จะต้องไม่โดนรีเซ็ตหรือเปลี่ยนแปลง
4. ข้อมูล Product Options จะต้องไม่มาปรากฏบนหน้านี้

## Open Questions
1. -

## References
- **Flow:** [Link / Soon]
- **Prototype:** https://prelist-mu.vercel.app/
- **Design:** https://github.com/thanya-dev/prelist/tree/main

---

# [Story 7] Reviewer Management: Selection & Export

## Business Problem
PM / Buyer ไม่สามารถจัดการรายชื่อผู้สมัครแบบ Batch Action ได้ และไม่มีช่องทางให้ค้นหาคัดกรองหรือจัดการผู้สมัครแบ่งตามแท็บอย่างชัดเจน

## Goal
ผู้ใช้สามารถเรียกดูผู้สมัครแบ่งตามสถานะ, อนุมัติ / ปฏิเสธ ผู้สมัครจากบนการ์ดหรือผ่านการเลือกหลายคน (Checkboxes), นำเข้ารายชื่อใหม่ และส่งออกรายชื่อผู้สมัครที่ทีมงานเลือกเป็นไฟล์ Excel ได้

## Users and Responsibilities
| Role | Responsibility |
|---|---|
| PM / Buyer | จัดการและคัดเลือกนักรีวิวที่สมัคร หรือนำเข้ารายชื่อใหม่ |

## Scope
### In Scope
- ระบบแท็บรายการนักรีวิว (ทั้งหมด, สมัคร, ทีมงานเลือกแล้ว, ลูกค้าเลือกแล้ว, Reject)
- การใช้ Checkboxes และ Select All
- Actions: อนุมัติ (Accept) / ปฏิเสธ (Reject)
- แถบ Toolbar จัดการ Batch action ด้านล่างจอ
- การอัปโหลดเพิ่มนักรีวิว และการ Export รายชื่อ

### Out of Scope
- Workflow การคัดเลือกระหว่างลูกค้ายืนยันกลับ
- หน้าโปรไฟล์เต็มรูปแบบของนักรีวิว

## Business Rules
1. แท็บนักรีวิวแบ่งเป็น "ทั้งหมด" "สมัคร" "ทีมงานเลือกแล้ว" "ลูกค้าเลือกแล้ว" "Reject"
2. สถานะ "ทีมงานเลือกแล้ว" หมายถึงผู้สมัครรอการตัดสินใจจากลูกค้า/PM หรือพร้อมให้ลูกค้าอนุมัติ
3. ปุ่ม Accept และ Reject ต้องอยู่เรียงกันด้านล่างของการ์ด (Reject ซ้าย, Accept ขวา)
4. การกด Accept/Reject ถือเป็นการให้ Decision หากทำการตัดสินใจแล้ว ปุ่มจะหายไปและแสดงป้ายสถานะแทน
5. Floating Toolbar ด้านล่างจอมีคำสั่งเดียวคือ Export Excel
6. Checkboxes สำหรับเลือกหลายคนและส่งออก (Export) เฉพาะนักรีวิวที่อยู่ในสถานะ "ทีมงานเลือกแล้ว" เท่านั้น
7. การเพิ่มนักรีวิว สามารถอัปโหลดแบบ Bulk ด้วย CSV/TSV วางข้อมูล 2 คอลัมน์ (username, platform) ระบบจะดึงคนเข้าสู่สถานะรอพิจารณา 

## Fields & Validation
| Field Name | Type | Rules / Validation | Required |
|---|---|---|---|
| Bulk Upload (CSV/TSV) | File / Paste Text | ต้องมี 2 คอลัมน์ (username, platform), ตรวจสอบ username ห้ามซ้ำกัน | Yes (เมื่อใช้อัปโหลด) |
| Reviewer Checkbox | Boolean | อนุญาตให้ติ๊กเลือกได้เฉพาะนักรีวิวในสถานะ "ทีมงานเลือกแล้ว" | No |

## User Flow
1. เปิด Job Posting Detail เลื่อนลงไปส่วนรายชื่อนักรีวิว
2. สลับแท็บสถานะเพื่อดูคนต่างๆ
3. กดปุ่ม อนุมัติ (Accept) บนการ์ดคนใดคนหนึ่ง
4. กดติ๊กเลือก Checkbox นักรีวิวบนแท็บ "ทีมงานเลือกแล้ว" 
5. แถบ Floating Toolbar ปรากฏด้านล่าง ผู้ใช้กดปุ่ม Export Excel 
6. ผู้ใช้กดปุ่ม เพิ่มนักรีวิว และเลือก Bulk Upload พร้อมใส่ข้อมูล

## Conditions and Results
| Condition | System behavior | Next state or actor |
|---|---|---|
| นักรีวิวถูกกด ปฏิเสธ (Reject) | การ์ดนำปุ่ม Action ออก และแสดงป้ายสถานะ "ถูก Reject" | ย้ายไปยังแท็บ Reject |
| นักรีวิวถูกลูกค้าเลือก | การ์ดนำปุ่ม Action ออก และแสดงป้ายสถานะ "ลูกค้าเลือกแล้ว" | ย้ายไปยังแท็บ ลูกค้าเลือกแล้ว |
| ติ๊ก Checkbox นอกสถานะ "ทีมงานเลือกแล้ว" | ระบบป้องกัน ไม่แสดงให้เลือกหรือไม่อนุญาต | ไม่มี |

## Acceptance Criteria
1. แท็บ Reject ต้องแสดงผลรายการที่ถูกปฏิเสธ โดยไม่มีปุ่มพิจารณาอื่นๆ เหลืออยู่
2. ระบบ Floating Toolbar จะต้องปรากฏขึ้นและแสดงปุ่ม Export เฉพาะรายชื่อที่ติ๊กเลือกเท่านั้น 
3. การอัปโหลดเพิ่มนักรีวิวด้วย CSV ต้องมีการตรวจสอบ Username ซ้ำกันด้วย
4. ปุ่ม Accept/Reject จะไม่แสดงขึ้นมาหากผู้ใช้คนนั้นมีการให้ Decision ไปแล้ว
5. รองรับระบบแบ่งหน้า (Pagination)

## Open Questions
1. -

## References
- **Flow:** [Link / Soon]
- **Prototype:** https://prelist-mu.vercel.app/
- **Design:** https://github.com/thanya-dev/prelist/tree/main

---

# [Story 8] Campaign Task: Influencer Import & Management

## Business Problem
หน้าจอจัดการแคมเปญ (Campaign Detail) ล้าหลังและมีโครงสร้างไม่ตรงกับ Flow งานจริงที่ Buddy Review ใช้งาน ส่งผลให้จัดการและติดตามนักรีวิวทำได้ยาก

## Goal
ปรับปรุงส่วน Influencer List บนหน้าจอ Campaign ให้เหมือนกับระบบ Buddy Review (Approved Influencers Dashboard) รวมทั้งมีฟังก์ชันดึง Influencer เข้ามาร่วมโดยอิงจาก Job Posting

## Users and Responsibilities
| Role | Responsibility |
|---|---|
| PM / Buyer | นำนักรีวิวที่เลือกเข้าสู่โปรเจกต์ Campaign และติดตามสถานะความคืบหน้า |

## Scope
### In Scope
- โครงสร้าง Dashboard (Influencer List)
- ระบบ Import Influencer
- ตารางบัญชีนักรีวิวพร้อมคอลัมน์และสถิติภาพรวม

### Out of Scope
- Request, Brand Approve, Final Approve stages tabs
- ระบบ Analytics ที่อิงข้อมูล API จริง

## Business Rules
1. แท็บจัดการเริ่มต้นใช้ชื่อ "Influencer List"
2. หน้า Influencer List จะต้องมีส่วน Header สถิติ: account/reach/follower totals และ platform breakdown
3. ผู้ใช้สามารถ "Import Influencer" ดึงคนจาก Brief ID ต้นทาง หรือจาก CSV
4. การดึงคนจาก Brief ID จะต้องดึงเฉพาะนักรีวิวที่อยู่ในสถานะ "ลูกค้าเลือกแล้ว" มาแสดง และไม่รวมคนที่ถูก import มาใน campaign นี้แล้ว
5. การกระทำบนหน้า Campaign Task เป็นการแยก Snapshot จาก Posting จะไม่ส่งผลย้อนกลับไปกระทบ Posting

## Fields & Validation
| Field Name | Type | Rules / Validation | Required |
|---|---|---|---|
| Brief ID Search | Text | ค้นหา Brief ID ที่มีในระบบเพื่อดึงคนเฉพาะสถานะ "ลูกค้าเลือกแล้ว" (ไม่ดึงคนที่อยู่ในแคมเปญนี้แล้วซ้ำ) | Yes (ถ้า Import ด้วยโหมด Brief ID) |
| CSV Import | File | ไฟล์ CSV สำหรับนำเข้ารายชื่อนักรีวิว | Yes (ถ้า Import ด้วยโหมด CSV) |

## User Flow
1. กดคลิกเลือก Campaign Card เข้ามาสู่หน้า Campaign Detail
2. ไปที่แท็บ Influencer List เพื่อดูตารางนักรีวิวที่อยู่ในการทำงานแล้ว
3. ตรวจสอบสถิติการกระจายของ Platform และ Follower Reach 
4. กดปุ่ม Import Influencer
5. เลือกว่านำเข้าด้วยการพิมพ์ Brief ID หรือ CSV
6. เลือกลิสต์รายชื่อที่ระบบคัดมาแสดงให้ และกดยืนยัน

## Conditions and Results
| Condition | System behavior | Next state or actor |
|---|---|---|
| ค้นหาด้วย Brief ID (โหมด Import) | ระบบดึงเฉพาะคนที่ลูกค้าอนุมัติแล้วมาให้เลือก | ผู้ใช้ติ๊กเลือกคนและนำเข้า |
| มีคนที่อยู่ใน Campaign List นี้แล้ว และอยู่ใน Brief ต้นทางด้วย | ระบบกรองชื่อซ้ำออกจากการค้นหา ไม่โผล่มาให้ import ซ้ำ | ไม่มี |

## Acceptance Criteria
1. หน้า Campaign Task ไม่มีแท็บ Request, Brand Approve, หรือ Final Approve อีกต่อไป
2. หน้าแสดงผลตารางนักรีวิว จะต้องเลื่อนตารางแนวนอนได้ (dense horizontally scrollable table)
3. ระบบสามารถสืบค้นด้วย Brief ID และดึงคนมาจาก Posting ภายใต้ Brief นั้นเฉพาะที่ผ่านการอนุมัติแล้วได้
4. ระบบต้องป้องกันไม่ให้นำเข้าคนซ้ำซ้อนกัน

## Open Questions
1. -

## References
- **Flow:** [Link / Soon]
- **Prototype:** https://prelist-mu.vercel.app/
- **Design:** https://github.com/thanya-dev/prelist/tree/main

---

# [Story 9] Global Navigation: Sidebar Reorganization

## Business Problem
เมนู Sidebar จัดวางกระจัดกระจาย ไม่เชื่อมโยงกับการใช้งานตาม Business Unit ที่แบ่งกันอย่างชัดเจน

## Goal
จัดการโครงสร้าง Sidebar ใหม่โดยแยกเป็นหมวดหมู่ "Business Website" และ "KOL discovery" ทำให้การเข้าถึงเครื่องมือหลักชัดเจนขึ้น

## Users and Responsibilities
| Role | Responsibility |
|---|---|
| All Users | ค้นหาและเข้าถึงเมนูส่วนต่างๆ ของระบบ |

## Scope
### In Scope
- การจัดวาง Navigation link ด้านซ้ายมือของระบบ

### Out of Scope
- การสร้างหน้าจอใหม่ที่ไม่ได้ผูกอยู่กับเมนูเดิม

## Business Rules
1. ส่วน Business Website จะรวมเมนู Projects ไว้ด้านล่างสุด
2. ส่วน KOL discovery ประกอบด้วยเมนู: Discovery, ประกาศหานักรีวิว, Explore ตามลำดับ
3. เมนู "ประกาศหานักรีวิว" ให้นำทางไปสู่ `/briefs` (Brief List)
4. หากอยู่ใน Sidebar ใดที่คลิก Projects ให้นำทางเปิดที่หน้า Project List ทันที

## Fields & Validation
| Field Name | Type | Rules / Validation | Required |
|---|---|---|---|
| ไม่มี Input Fields | - | เป็นเพียงส่วนการนำทาง (Navigation) | - |

## User Flow
1. ผู้ใช้ตรวจสอบแถบ Sidebar ค้นหากลุ่ม KOL discovery
2. คลิกเลือก ประกาศหานักรีวิว
3. ผู้ใช้ไปที่ Business Website เลื่อนลงล่างสุด และคลิกเมนู Projects 

## Conditions and Results
| Condition | System behavior | Next state or actor |
|---|---|---|
| คลิก ประกาศหานักรีวิว | นำทางไปที่ Brief List Page | แสดงหน้ารายการ Brief |
| คลิก Projects | นำทางไปที่ Project List Page | แสดงหน้ารายการโปรเจกต์ |

## Acceptance Criteria
1. ลำดับของ Navigation ฝั่งซ้ายจะต้องถูกแบ่งออกเป็น Section ตามกำหนด และไล่เรียงตามที่ระบุไว้
2. ลิงก์ทุกตัวบน Sidebar ต้องทำงานได้อย่างถูกต้อง

## Open Questions
1. -

## References
- **Flow:** [Link / Soon]
- **Prototype:** https://prelist-mu.vercel.app/
- **Design:** https://github.com/thanya-dev/prelist/tree/main
