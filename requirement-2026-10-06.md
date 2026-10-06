# PO Development Brief — Brief Management & Job Posting

วันที่: 6 ตุลาคม 2569 (2026-10-06)  
กลุ่มผู้ใช้งานหลัก: PM / Buyer  
สถานะเอกสาร: Requirement สำหรับพัฒนาและใช้เป็นเกณฑ์ตรวจรับ

## 1. เป้าหมายและปัญหาที่ต้องแก้

PM / Buyer ต้องจัดการข้อมูลกลางของ Brief และสร้างประกาศรับนักรีวิวหลายประกาศภายใต้ Brief เดียวได้ โดยไม่ต้องกรอกข้อมูลแบรนด์ซ้ำทุกครั้ง และไม่สูญเสียข้อมูลเมื่อยังกรอกประกาศไม่ครบ

ผลลัพธ์ที่ต้องการ:

- มองจาก Brief list แล้วทราบจำนวนประกาศและสถานะการรับสมัครของแต่ละ Brief ได้ทันที
- สร้างและแก้ไข Brief เป็นข้อมูลกลางได้ โดยไม่ต้องสร้าง Job Posting ไปพร้อมกัน
- เก็บประกาศที่ยังไม่พร้อมเป็น Draft และเผยแพร่เมื่อข้อมูลผ่าน validation
- ข้อมูลที่บันทึกจากฟอร์มต้องแสดงบน Detail ตรงกัน และไม่เปลี่ยนข้อมูลของประกาศอื่น
- ใช้ข้อมูลวันที่ สถิติ และความสัมพันธ์ Brief–Posting ชุดเดียวกันทุกหน้าที่แสดงผล

เอกสารนี้ขยาย 7 Stories เดิมให้มี business rules และ acceptance criteria ที่ตรวจสอบได้ พร้อมใช้ข้อกำหนดล่าสุดใน `AGENTS.md` แทนข้อกำหนดที่ถูก supersede แล้ว การพบ behavior ใน prototype ไม่ถือว่าพฤติกรรมนั้นถูกต้องตาม requirement โดยอัตโนมัติ

## 2. ขอบเขตและข้อมูลที่แต่ละส่วนรับผิดชอบ

| Entity      | หน้าที่ทางธุรกิจ                          | ข้อมูลที่เป็นเจ้าของ                                                                                                           | ความสัมพันธ์                                           |
| ----------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| Brief       | รวมข้อมูลแบรนด์และประกาศของงานเดียวกัน    | Project Name, Brand, logo, ordered Brief IDs, Product option                                                                   | หนึ่ง Brief มีหลาย Brief IDs และหลาย Job Postings      |
| Job Posting | กำหนดรายละเอียดการเปิดรับนักรีวิวแต่ละงาน | ประเภท, title/subtitle, criteria, periods, compensation/benefit, reference link, reward points, owner, applicant/viewer counts | แต่ละ Posting เชื่อมกับ Brief ต้นทาง                   |
| Campaign    | จัดการงานหลังเลือกประกาศต้นทาง            | การตั้งค่าและข้อมูลทำงานเฉพาะ Campaign รวมถึง source snapshot                                                                  | นำข้อมูล Posting และผลิตภัณฑ์จาก Brief ไปเป็น snapshot |

**In scope:** Brief list/detail/create/edit, linked-posting Calendar/Table, Posting create/draft/edit/detail และผลต่อข้อมูลต้นทางของ Campaign

**Out of scope:** เปลี่ยนฟอร์ม Project, พัฒนา Campaign wizard ใหม่ทั้ง flow, เปลี่ยน reviewer decision workflow, ทำระบบนับวิวจริง, ระบบ inventory/จัดส่งจริง, เพิ่มระบบสิทธิ์ใหม่ หรือทำ backend ใหม่ทั้งระบบ

Role PM / Buyer ในเอกสารระบุผู้ใช้งานหลัก ไม่ได้กำหนด permission matrix ใหม่ หากนำขึ้น production ต้องยืนยันสิทธิ์จากระบบจริงก่อนพัฒนา API

## 3. Business rules กลาง

### 3.1 ความสัมพันธ์และการอ้างอิง Brief

1. Brief และ Posting เป็นคนละรายการข้อมูล การสร้าง Brief ห้ามสร้าง Posting อัตโนมัติ
2. Brief เก็บ `briefNumbers` เป็นลำดับที่ผู้ใช้จัดไว้ หมายเลขแรกเป็น `id` หลักสำหรับ route; หมายเลขอื่นอ้างถึง Brief เดียวกัน
3. ข้อมูลเดิมที่มีเฉพาะ `id` ให้อ่านเป็น Brief ที่มีหมายเลขเดียวได้
4. เมื่อเปลี่ยนหมายเลขหลักหรือ reorder ให้ route ใหม่ใช้หมายเลขแรก และเก็บหมายเลขเดิมเป็น alias เพื่อไม่ให้ Posting/Project ที่เคยอ้างถึงสูญหาย
5. การนับ Posting ต้อง resolve หมายเลขหลัก หมายเลขรอง และ alias ก่อนเปรียบเทียบ Brief; นับ Posting ID เดียวเพียงครั้งเดียว
6. การแก้ Brief ไม่เขียนทับชื่อ แบรนด์ หรือโลโก้ที่บันทึกแล้วใน Posting ข้อมูลกลางมีผลเป็นค่าเริ่มต้นสำหรับประกาศใหม่
7. Campaign ที่บันทึก source snapshot แล้วต้องคง snapshot เดิม การแก้ Brief หรือ Posting ภายหลังไม่ควรเปลี่ยน Campaign ย้อนหลังโดยไม่มี action เปลี่ยน source

### 3.2 สถานะประกาศและวันที่

แยก **สถานะการบันทึก** (`Draft` / เผยแพร่แล้ว) ออกจาก **สถานะการรับสมัครที่แสดงผล** ห้ามใช้ lifecycle ของ Project (`Draft → Prelist → On Going → Complete`) แทนสถานะการรับสมัคร

ให้ `today` เป็นวันที่ตาม `Asia/Bangkok`, `start` เป็นวันเปิดรับสมัคร และ `end` เป็นวันปิดรับสมัคร โดยเปรียบเทียบระดับวัน ไม่ใช่เวลาของเครื่องผู้ใช้

| ลำดับตรวจ | เงื่อนไข                                              | สถานะที่แสดง                              |
| --------- | ----------------------------------------------------- | ----------------------------------------- |
| 1         | explicit Draft แม้มีวันรับสมัครครบ                    | แบบร่าง                                   |
| 2         | ข้อมูลเก่าขาดวัน/วันที่ใช้ไม่ได้/วันเริ่มมากกว่าวันจบ | แบบร่าง (fallback สำหรับข้อมูลไม่สมบูรณ์) |
| 3         | เผยแพร่แล้ว และ today < start                         | รอเปิดรับ                                 |
| 4         | เผยแพร่แล้ว และ start ≤ today ≤ end                   | เปิดรับสมัคร                              |
| 5         | เผยแพร่แล้ว และ today > end                           | ปิดรับสมัคร                               |

- วันเปิดและวันปิดนับรวมทั้งสองวัน ประกาศที่เปิดและปิดวันเดียวกันเปิดรับในวันนั้น
- หลัง publish ต้องใช้วันที่คำนวณสถานะใหม่ ไม่บังคับให้ทุกประกาศเป็นเปิดรับสมัครทันที
- ใช้กติกาเดียวกันใน Brief list, Brief Detail Calendar/Table และ Posting Detail
- เก็บวันที่แบบ ISO calendar date `YYYY-MM-DD` ปี ค.ศ.; แสดงเป็นวัน / เดือน / ปี พ.ศ. โดยเพิ่มปี 543 เฉพาะตอนแสดงผล
- ค่าว่างของวันที่ยังเป็นค่าว่าง ไม่แปลงเป็นวันนี้หรือวันที่ตัวอย่าง

### 3.3 ความหมายของค่าว่างและเลขศูนย์

- `0` เป็นค่าที่มีความหมาย ต้องแสดง เช่น จำนวนประกาศ จำนวนผู้สมัคร จำนวนวิว และ Target Post ที่อนุญาตให้เป็นศูนย์
- ฟิลด์รายละเอียดที่ไม่เคยบันทึกให้แสดง `ยังไม่ระบุ` ไม่สร้างค่าแทนจาก sample data
- Viewer count ที่ไม่มีค่าใช้ `0 คน` ตามกติกาของ metric นี้โดยเฉพาะ
- รายการ products ที่เป็น `[]` หมายถึงผู้ใช้ตั้งใจไม่มีสินค้า ต้องไม่ดึง legacy fallback กลับมาอีก
- การแก้ไขต้องคง ID, Brief association, counts และข้อมูลเดิมที่ไม่ได้อยู่ในขอบเขตการแก้ไข

## 4. Story 1 — ดูภาพรวมประกาศจาก Brief list และ Brief Detail

**ความต้องการของ PO:** PM / Buyer ต้องทราบว่าแต่ละ Brief มีประกาศเท่าไรและอยู่ช่วงใดของการรับสมัคร โดยตัวเลขต้องเชื่อถือและอธิบายได้

### หน้ารายการ Brief

- Route `/briefs`, heading `รายการ Brief`, primary action `สร้างบรีฟ` ไป `/briefs/create`
- แสดง Project Name เป็นชื่อหลัก, Brand เป็นชื่อรอง, โลโก้ขนาดจำกัด และ Brief numbers ทั้งหมดเป็น badges
- ค้นหาได้จากชื่อและหมายเลข Brief ทุกหมายเลขที่บันทึกไว้
- แต่ละ Brief แสดง total linked postings และจำนวน แบบร่าง / รอเปิดรับ / เปิดรับสมัคร / ปิดรับสมัคร ครบทุกสถานะ แม้เป็น 0
- Brief ที่เพิ่งสร้างและยังไม่มีประกาศต้องปรากฏใน list และมีทุก count เป็น 0

### กติกาการนับและการกรอง

1. Total ของ Brief = จำนวน Posting ID ไม่ซ้ำที่ resolve แล้วเชื่อมกับ Brief นั้น
2. แต่ละ Posting อยู่ได้เพียงสถานะเดียว; ผลรวมทั้งสี่สถานะต้องเท่ากับ total
3. Search ของ Brief list กรองรายการ Brief ไม่ลดจำนวนประกาศของ Brief ที่ยังแสดงอยู่
4. ภายใน Brief Detail ตัวเลขบน status filter คำนวณจากประกาศของ Brief ปัจจุบันที่ตรงกับ search โดยยังไม่ใช้ status ที่เลือกและเดือน Calendar ที่เปิดอยู่
5. ผลลัพธ์ Calendar/Table จึงค่อยใช้ status ที่เลือก; Calendar จำกัดการวาดตามช่วงเดือนที่ดู
6. Status filter มีจุดสีตาม badge; `ทั้งหมด` ใช้สีม่วง และแสดง count ในวงเล็บ

### Brief Detail และ linked postings

- Summary อยู่เหนือแท็บเสมอ; แท็บเริ่มต้น `ประกาศหานักรีวิว` และมี `Product Option` พร้อมจำนวนบนแท็บ
- Calendar/Table อยู่ใน Brief Detail และแสดงเฉพาะประกาศของ Brief นั้น ไม่ย้าย Calendar ไปหน้า Brief list
- ค่าเริ่มต้นเป็น monthly Calendar; toggle Table ใช้ search/status เดียวกัน
- เปลี่ยนแท็บ Product Option แล้วกลับมาต้องคงเดือน, view, search และ status เดิม
- Calendar วาดช่วงรับสมัครจริงแบบ inclusive แยกข้ามสัปดาห์/เดือน และจัด lane ไม่ให้ประกาศทับกัน; highlight วันนี้ตาม Bangkok
- Draft ที่ไม่มีวันที่ไม่ถูกสร้างช่วงวันที่สมมติ ให้มีทางไป Table ที่กรองแบบร่าง
- คลิกประกาศไป Detail ของ Posting นั้น; Back จาก Brief Detail กลับ `/briefs` โดยตรง
- ไม่พบประกาศจาก filter ให้มี action ล้าง filter และมีระยะ 20px จากข้อความถึงปุ่ม
- Product Option ว่างแสดง `ยังไม่มีสินค้า` และ `เพิ่มสินค้า` ไป Brief Edit

### Acceptance criteria

- [ ] Brief มี Draft 1, upcoming 1, open 2, closed 1 ต้องแสดง total 5 และ counts 1/1/2/1
- [ ] Posting ที่อ้างหมายเลขรองหรือ alias ถูกนับใน Brief เดียวกันและไม่ถูกนับซ้ำ
- [ ] เปลี่ยนเดือนหรือ status filter แล้ว counts ของ status pills ไม่เปลี่ยน; เปลี่ยน search แล้ว counts เปลี่ยนตามผลค้นหา
- [ ] ในวันเปิดและวันปิด ประกาศยังมีสถานะเปิดรับสมัคร; วันถัดจากวันปิดเป็นปิดรับสมัคร
- [ ] Browser ที่ตั้ง timezone อื่นแสดงสถานะและ today highlight ตรงกับ Bangkok
- [ ] ไม่พบ Brief จาก search ต้องมี action ล้าง search; ไม่ซ่อน Brief ใหม่ที่ total เป็น 0
- [ ] สลับแท็บหรือ Calendar/Table แล้วไม่ล้าง state ที่ระบุข้างต้น

## 5. Story 2 — สร้างและแก้ไข Brief เป็นข้อมูลกลาง

**ความต้องการของ PO:** ผู้ใช้ต้องบันทึก identity, หมายเลขอ้างอิง และสินค้าไว้ที่ Brief เพื่อใช้ร่วมกับหลายประกาศ โดยเปลี่ยนเลข Brief ได้โดยไม่ทำลายความสัมพันธ์เดิม

### ลำดับฟอร์มและข้อมูล

ลำดับ: **โลโก้ → Project Name → Brand → Brief IDs → Product option** ใช้ฟอร์มเดียวกันสำหรับ create/edit โดย edit โหลดค่าที่บันทึกไว้ทั้งหมด

| ฟิลด์                       | Required       | Validation และ behavior                                         |
| --------------------------- | -------------- | --------------------------------------------------------------- |
| โลโก้แบรนด์ (`image`)       | ใช่            | PNG/JPG/JPEG ≤3 MB; ต้องมีรูปก่อน Save; upload/remove/preview   |
| Project Name (`name`)       | ใช่            | Trim whitespace; ค่าว่างหรือมีแต่ช่องว่างบันทึกไม่ได้           |
| Brand (`brand`)             | ใช่            | Free text เท่านั้น ไม่มี dropdown/autocomplete; trim ก่อนบันทึก |
| Brief IDs (`briefNumbers`)  | อย่างน้อย 1    | ทุกรายการต้องครบรูปแบบ `XXXYYYYMMNNN` และไม่ซ้ำ                 |
| Product option (`products`) | ไม่บังคับเพิ่ม | ถ้าเพิ่มรายการใหม่ ต้องมีชื่อและรูป; description ไม่บังคับ      |

### กติกา Brief IDs

- `XXX`: ตัวอักษรอังกฤษ 3 ตัว
- `YYYY`: ปี ค.ศ. 4 หลัก
- `MM`: เดือน 01–12
- `NNN`: running sequence 000–999
- ตัวอย่างที่ถูกต้อง: `NRI202610001`; เดือน 00/13, ตัวเลขใน prefix หรือส่วนใดไม่ครบต้อง reject
- หมายเลขไม่ซ้ำทั้งในฟอร์มเดียวกันและข้าม Brief; การแก้ Brief ใช้หมายเลขเดิมของตัวเองได้
- มีเพิ่ม/ลบ/ลากเรียงและ keyboard arrow reorder; บันทึกตามลำดับใหม่ ไม่ sort อัตโนมัติ
- ห้ามลบจนไม่เหลือหมายเลขที่ valid; Save ต้องตรวจทุกรายการ ไม่ตรวจแค่หมายเลขแรก
- หมายเลขเดิมที่ยังเป็น alias ต้องไม่เปิดให้ Brief อื่นนำไปใช้จนเกิดความกำกวม

### กติกา Product option

- อยู่ที่ Brief เท่านั้น ไม่เพิ่มส่วนนี้ใน Posting form/detail
- เพิ่มรายการเป็น numbered rows ที่ลากเรียงและลบได้; เก็บลำดับตามที่ผู้ใช้จัดไว้
- เก็บแต่ละรายการเป็น `{ name, image, description }`
- รูปสินค้าใหม่รองรับ PNG/JPG/JPEG/AVIF ≤3 MB; ชื่อและรูปเป็น required รายรายการ
- เมื่อเพิ่มแถวแล้วข้อมูลไม่ครบ ให้แสดง error ของแถวนั้นและไม่บันทึกทั้ง Brief; ผู้ใช้ลบแถวเพื่อไม่เอารายการนั้นได้
- Legacy string products normalize ให้แสดง/แก้ได้โดยไม่บังคับเติมรูปย้อนหลัง
- Brief ที่ยังไม่มี products ของตัวเองใช้ linked-posting legacy products เป็น fallback ได้; หลัง Save Brief ต้องใช้ products ที่บันทึก รวมถึง `[]`
- Detail แสดงรูป ชื่อ คำอธิบาย และลำดับที่บันทึกไว้; จำนวนบนแท็บตรงกับจำนวนสินค้า

### Visual requirements และ navigation

- ฟอร์มกลางจอ max-width 800px; pale shell `#f7f9fb`, gap/padding 24px, white cards ไม่มี shadow ตาม reference
- โลโก้ 120×120px อยู่เหนือชื่อ; empty state เส้นประแดง กล้องพร้อมเครื่องหมายบวก และ helper รูปแบบ/ขนาดอยู่ในช่องรูป
- เมื่อมีรูป ไม่แสดง upload helper ใต้ saved logo; remove อยู่มุมขวาบน; error `กรุณาเพิ่มรูป` อยู่ใต้ช่อง
- Footer เป็นแถวเดียว: Cancel ซ้าย, Create/Save ขวา ทั้ง desktop/mobile
- Create Save สำเร็จเปิด `/briefs/:primaryId` ของ Brief ใหม่; Create Back/Cancel กลับ `/briefs`
- Edit Save สำเร็จเปิด Detail ของหมายเลขหลักใหม่; Edit Back/Cancel กลับ Detail เดิมโดยไม่บันทึก

### Acceptance criteria

- [ ] ไม่มีรูป / ชื่อว่าง / Brand เป็นช่องว่าง / Brief ID invalid ต้องบันทึกไม่ได้และชี้ error ตรงฟิลด์
- [ ] รูปขนาดเกินกำหนดหรือชนิดไม่รองรับไม่ถูกบันทึก และไม่ทำให้รูป valid เดิมหายโดยไม่ตั้งใจ
- [ ] Brief IDs ซ้ำในฟอร์มหรือกับ Brief อื่นต้องถูก reject; ใช้ ID เดิมของตนเองตอน Edit ได้
- [ ] Reorder ID รองขึ้นเป็นรายการแรกแล้ว Save เปิด route ใหม่; Posting ที่อ้าง ID เก่ายังปรากฏครบ
- [ ] สร้าง Brief สำเร็จแล้วมีรายการเดียวใน list และไม่มี Posting ถูกสร้างเพิ่ม
- [ ] Edit ชื่อ/Brand/รูปของ Brief ไม่เปลี่ยนค่าที่เคยบันทึกใน Posting หรือ Campaign snapshot
- [ ] ลบสินค้าทั้งหมดแล้ว Save ต้องได้ `products: []` และไม่ดึง legacy products กลับมา
- [ ] สินค้า legacy ที่ไม่มีรูปยังอ่านได้; สินค้าใหม่ที่ไม่มีรูปบันทึกไม่ได้

## 6. Story 3 — บันทึก Posting เป็น Draft และเผยแพร่ภายหลัง

**ความต้องการของ PO:** ผู้ใช้ต้องเก็บงานที่ยังกรอกไม่ครบได้ โดย Draft ไม่กลายเป็นประกาศเผยแพร่เพราะถึงวันที่รับสมัคร

### Decision table ของ action

| Action                            | Validation                           | ผลต่อข้อมูล                                                                 | ปลายทาง                                                     |
| --------------------------------- | ------------------------------------ | --------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Create: Save as Draft             | Campaign Title หลัง trim ต้องไม่ว่าง | สร้าง Posting แบบ explicit Draft, เก็บ partial values และ originating Brief | Brief ต้นทาง; ไม่มีต้นทางกลับ Brief list                    |
| Create: สร้างประกาศ (Public Link) | Publish validation ผ่าน              | สร้าง Posting เผยแพร่แล้ว; derive recruitment status จากวัน                 | Brief ต้นทาง; ไม่มีต้นทางกลับ Brief list                    |
| Edit: บันทึกการแก้ไข              | Publish validation ผ่าน              | Update ID เดิม; ถ้าเดิม Draft ให้เผยแพร่                                    | Posting Detail เดิม                                         |
| Back / Cancel                     | ไม่ save                             | ไม่สร้าง/แก้รายการข้อมูล                                                    | Create กลับ Brief ต้นทางหรือ list; Edit กลับ Posting Detail |

### Business rules

1. Draft ตรวจ required เฉพาะ title ไม่บังคับ criteria, วันที่, subtitle, reward หรือ compensation ครบเหมือน publish
2. เก็บทุก partial field ที่ผู้ใช้กรอก เช่นเลือกเพศไว้, ใส่ MIN แต่ยังไม่ใส่ MAX, ใส่วันที่เดียว ไม่ตัดทิ้งเพราะฟอร์มยังไม่ครบ
3. Draft มีวันที่ผ่านไปแล้วหรืออยู่ในช่วงรับสมัครก็ยังเป็นแบบร่าง
4. Publish เป็น explicit action; ถ้า validation ไม่ผ่านต้องคง Draft เดิมและค่าที่ผู้ใช้กรอกในฟอร์ม
5. Edit ต้อง update Posting เดิม ไม่สร้าง ID ใหม่ และไม่รีเซ็ต applicant/viewer counts หรือ reviewer decisions
6. หลัง reload/open Edit ให้ได้ข้อมูลที่บันทึกครบ รวมถึง source Brief, campaignType และ subtitle
7. Public Link ใน prototype ไม่ถือว่าได้ทำ public-page service, access control หรือ analytics จริงแล้ว

### Acceptance criteria

- [ ] กรอกเฉพาะ title แล้ว Save as Draft สำเร็จและกลับ Brief ต้นทาง
- [ ] title เป็นช่องว่างล้วน Save as Draft ไม่สำเร็จ และไม่สร้าง record
- [ ] Draft ที่มีวันที่รับสมัครตรงกับวันนี้ยังแสดงแบบร่างทุกหน้า
- [ ] Draft มีข้อมูลบางส่วน เมื่อ reopen Edit ต้องได้ค่าเดิม ไม่ถูกแทนด้วย defaults ของ Brief ปัจจุบัน
- [ ] Publish Draft ที่ข้อมูลไม่ครบไม่ได้; เมื่อครบแล้ว Save ต้องเปลี่ยนเป็นสถานะที่คำนวณจากวันที่
- [ ] Edit แล้ว ID, Brief association, counts และ reviewer decisions เดิมยังอยู่

## 7. Story 4 — แสดงยอดเปิดดูประกาศและผู้สมัคร

**ความต้องการของ PO:** ให้ทีมเห็นจำนวนผู้เปิดดูและผู้สมัครของแต่ละประกาศ โดยไม่ทำให้เข้าใจว่าข้อมูล prototype เป็น analytics จริง

### Business rules

- Label viewer count ใช้ `เปิดดูประกาศ` และหน่วย `คน` ใน Posting Detail และ linked-posting Calendar/Table
- Applicant count และ viewer count ผูกกับ Posting ID ไม่ใช่ Brief หรือ Campaign
- ค่าที่ไม่มี viewerCount แสดง 0 คน; ค่า 0 ที่บันทึกไว้ต้องไม่ถูกแทนด้วย sample อื่น
- Prototype seed ใช้ `viewerCount = applicants × 10` เพื่อให้ conversion ตัวอย่างเป็น 10%; Draft/upcoming seeds ที่ไม่มีผู้สมัครใช้ 0 views
- สูตรนี้ใช้จัดเตรียม sample data ไม่ใช่สูตรคำนวณ analytics ตอน runtime และไม่ recalibrate count ทุกครั้งที่ Edit
- ไม่เพิ่ม viewerCount จากการเปิด Detail ภายในระบบเอง
- ไม่ตีความ Target Influencer เป็น applicant count; เป้าหมายและจำนวนผู้สมัครเป็นคนละค่า

### Acceptance criteria

- [ ] Seed มีผู้สมัคร 12 คน แสดงเปิดดูประกาศ 120 คน; seed ไม่มีผู้สมัครแสดง 0 คน
- [ ] Posting ไม่มี viewerCount แสดง 0 คนได้โดยไม่ error
- [ ] แก้ title/criteria ของ Posting แล้ว counts เดิมไม่เปลี่ยน
- [ ] เปิด Posting A ไม่เปลี่ยน count ของ A หรือ B และไม่รวม count ของทั้ง Brief มาเป็นยอดของ A
- [ ] Detail/Calendar/Table แสดง counts ของ Posting เดียวกันตรงกัน

## 8. Story 5 — สืบทอดข้อมูลตั้งต้นและจัดฟอร์ม Posting

**ความต้องการของ PO:** ลดการกรอกซ้ำตอนสร้างประกาศ แต่ผู้ใช้ยังปรับประกาศเฉพาะงานได้ และ Edit ต้องรักษาค่าที่เคยเลือกไว้

### Initial values และการบันทึก

| ข้อมูล                                                            | Create จาก Brief                           | Edit                                                     |
| ----------------------------------------------------------------- | ------------------------------------------ | -------------------------------------------------------- |
| Campaign Title (`name`)                                           | ใช้ Project Name ของ Brief เป็นค่าเริ่มต้น | ใช้ชื่อที่ Posting บันทึก                                |
| Brand / logo                                                      | Copy จาก Brief; แก้และ remove ได้          | ใช้ค่า Posting ไม่ดึงค่าจาก Brief มา overwrite           |
| Owner / Assign Buyer                                              | Email ของ active user                      | คง owner ที่บันทึก ไม่เปลี่ยนเป็น user ที่เปิด Edit      |
| Campaign Type                                                     | `normal`                                   | คง `normal` / `confidential` / `private` ที่บันทึก       |
| Subtitle / Criteria / periods / compensation / reference / points | ใช้ข้อมูลของฟอร์มใหม่ตามกติกาแต่ละฟิลด์    | ใช้ค่าที่บันทึก; missing legacy values ไม่แทนด้วย sample |
| Products                                                          | ไม่อยู่ใน Posting form                     | อยู่ที่ Brief; ห้ามเพิ่มสินค้ากลับใน Posting             |

ไม่เพิ่มฟิลด์ Project Name ซ้ำใน Posting Basic Information: ใน flow นี้ชื่อจาก Brief เป็นค่าเริ่มต้นของ Campaign Title ส่วนชื่อ Project ของ Brief ยังอยู่ที่ Brief

### Campaign Type

เรียงการ์ดแนวตั้งตามลำดับนี้ เลือกได้หนึ่งค่า และใช้ selected state สีฟ้า:

| Value          | Label                 | คำอธิบาย                                                                             |
| -------------- | --------------------- | ------------------------------------------------------------------------------------ |
| `normal`       | Normal                | แคมเปญทั่วไป นักรีวิวจะเห็นรายละเอียดแคมเปญตั้งแต่ขั้นตอนการสมัครเลย                 |
| `confidential` | Confidential campaign | เฉพาะนักรีวิวที่ผ่านการคัดเลือกเท่านั้น ที่เห็นรายละเอียดแคมเปญได้                   |
| `private`      | Private campaign      | แคมเปญส่วนตัว ไม่เปิดรับสมัคร (ทีมงานต้องเป็นคนเลือกและจัดการงานแทนนักรีวิวเท่านั้น) |

ค่าทั้งสามต้อง round-trip ผ่าน Create/Draft/Edit/Detail ได้ ห้ามแปลง private เป็น normal ตอน save หรือตอนอ่านข้อมูล กติกาการเปิดเผยข้อมูลและการรับสมัครของ public service ต้องยืนยันแยกตามหัวข้อ 12

### ลำดับ section

Campaign Type → Creator Criteria → Job Information/periods → Compensation → Reward points → Reference Brief → Basic Information

Basic Information เป็น section สุดท้าย: square logo กึ่งกลางพร้อม upload/remove, full-width Campaign Title, Campaign Subtitle, Brand, Owner / Assign Buyer

### Publish validation

ตารางนี้เป็นเป้าหมายของการตรวจรับ ไม่ใช่การรับรองว่า prototype ตรวจครบแล้ว:

| ฟิลด์                        | Required ตอน Publish   | กติกา / ข้อความ error                                        |
| ---------------------------- | ---------------------- | ------------------------------------------------------------ |
| Campaign Type                | ใช่                    | ค่าอยู่ใน enum ทั้งสาม; `กรุณาเลือกประเภทแคมเปญ`             |
| Campaign Title               | ใช่                    | ไม่ว่างหลัง trim; `กรุณาระบุชื่อประกาศ`                      |
| Brand                        | ใช่                    | ไม่ว่างหลัง trim; `กรุณาระบุแบรนด์`                          |
| Owner                        | ใช่                    | รูปแบบ email ถูกต้อง; `กรุณาระบุอีเมลผู้รับผิดชอบให้ถูกต้อง` |
| Logo                         | ใช่ตามฟอร์มปัจจุบัน    | รูปที่รองรับ; `กรุณาอัปโหลดโลโก้แบรนด์`                      |
| Subtitle                     | ใช่ตามฟอร์มปัจจุบัน    | ไม่ว่างหลัง trim; `กรุณาระบุ Campaign Subtitle`              |
| Short Brief                  | ใช่ตาม required marker | ไม่ว่าง; ไม่เกิน 500 ตัวอักษร; `กรุณาระบุรายละเอียดงาน`      |
| Creator Criteria             | ใช่ตาม Story 6         | ใช้กติกาด้านล่าง                                             |
| Recruitment / Campaign dates | ใช่                    | ใช้กติกา Story 7                                             |
| Compensation Type            | ใช่ตาม required marker | ต้องเป็นตัวเลือกที่รองรับ; `กรุณาเลือกประเภทค่าตอบแทน`       |
| Reference Brief Link         | ไม่บังคับ              | ถ้ากรอกต้องเป็น HTTP/HTTPS URL; `กรุณาระบุลิงก์ให้ถูกต้อง`   |
| Reward points                | ตาม pointType          | ใช้กติกาด้านล่าง                                             |

ฟิลด์ที่ข้อกำหนดเดิมระบุ optional แต่ prototype เปลี่ยนเป็น required ต้องยืนยันตามหัวข้อ 12 ก่อนถือว่า production scope ได้รับอนุมัติ

### Reward points และผลต่อ Campaign

- เป็นข้อมูลของ Posting Create/Edit/Detail เก็บ `pointType` / `points` ใน Draft ด้วย
- Fix point ต้องเป็นจำนวนเต็ม ≥0; ค่าว่างไม่เท่ากับ 0; invalid แสดง `ระบุแต้มเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป`
- ใช้อัตราแสดงมูลค่า 10 points = 1 บาท เช่น 100 points = 10 บาท
- Auto point เก็บประเภทการคำนวณตามที่เลือก ไม่สร้างสูตร Auto ใหม่โดยอาศัยสมมติฐาน
- Campaign ที่นำ source Posting ไปใช้รับ points แบบ read-only; source เก่าไม่มี fields ให้ preserve legacy Campaign points และแสดง missing source points อย่างชัดเจน
- Campaign รับ products จาก linked Brief และบันทึกใน source snapshot; ไม่ย้าย ownership ของสินค้าไป Campaign

### Acceptance criteria

- [ ] สร้างจาก Brief แล้วชื่อ/Brand/รูปเป็นค่าเริ่มต้น; เปลี่ยนที่ Posting แล้ว Brief ไม่เปลี่ยน
- [ ] Save/Edit ทั้งสาม campaign types ได้ครบ และ Detail แสดง saved type
- [ ] ผู้ใช้ B เปิด Edit ประกาศของผู้ใช้ A แล้ว owner ไม่เปลี่ยนเป็น B อัตโนมัติ
- [ ] Clear รูปหรือ subtitle แล้ว Save Draft ได้ถ้ามี title แต่ Publish ต้องแสดง validation ตาม contract ที่ยืนยัน
- [ ] Fix point 0 บันทึกได้, -1/ทศนิยม/ค่าว่างไม่ผ่าน Publish; Draft เก็บข้อมูลที่กรอกค้างไว้ได้
- [ ] ไม่พบ products section ใน Posting form/detail และ Campaign source snapshot เดิมไม่เปลี่ยนเพราะแก้ Brief

## 9. Story 6 — กำหนด Creator Criteria

**ความต้องการของ PO:** ทีมระบุกลุ่มนักรีวิว เป้าหมาย และประเภทงานได้อย่างชัดเจน และระบบไม่บันทึก scope ที่ขัดกับ platform

### Layout และข้อมูล

- Goals (Target Influencer, Target Post) เป็น stacked white cards
- Target group เป็นข้อมูลกลุ่มเป้าหมายที่บันทึกได้
- Gender เป็น checkboxes เลือกหลายค่าได้
- Age และ Follower มี MIN/MAX คู่กัน
- Platform cards สองคอลัมน์บน desktop ปรับให้เหมาะกับ mobile; ใช้ circular social logo และ scope hints
- Scope เป็น grouped radio options, selected state สีฟ้า
- เปลี่ยนเฉพาะ Posting screens ไม่เปลี่ยน Project form

### Business validation

| ฟิลด์                           | Publish rule                                                     | Draft rule             |
| ------------------------------- | ---------------------------------------------------------------- | ---------------------- |
| Target Influencer (`reviewers`) | จำนวนเต็ม ≥1                                                     | เก็บ partial value ได้ |
| Target Post (`targetPost`)      | จำนวนเต็ม ≥0; 0 ต้องคงเป็น 0                                     | เก็บ partial value ได้ |
| Target group                    | ไม่บังคับ; เก็บข้อความที่ระบุ                                    | เก็บได้                |
| Gender                          | เลือกอย่างน้อยหนึ่งค่า ตามฟอร์มปัจจุบัน                          | ยังไม่เลือกได้         |
| Age MIN/MAX                     | ต้องครบทั้งคู่ตามฟอร์มปัจจุบัน, จำนวนเต็ม ≥0 และ MIN ≤ MAX       | เก็บข้างเดียวได้       |
| Follower MIN/MAX                | ต้องครบทั้งคู่ตามฟอร์มปัจจุบัน, จำนวนเต็ม ≥0 และ MIN ≤ MAX       | เก็บข้างเดียวได้       |
| Platforms                       | อย่างน้อยหนึ่ง platform ที่ระบบรองรับ                            | ไม่เลือกได้            |
| Scope / contentTypes            | Scope ที่เลือกต้องมี content type ที่ใช้ได้กับ platform ที่เลือก | เก็บเท่าที่เลือกไว้ได้ |

### Dependency ของ platform และ scope

1. เลือก platform แล้วตัวเลือก scope ต้องสะท้อน content types ที่ platform รองรับ ไม่ให้เลือก type ที่ไม่มีช่องทางทำงาน
2. เลือก scope แล้ว derive `contentTypes` จากจุดร่วมระหว่าง types ของ scope และ platforms ที่เลือก
3. ยกเลิก platform ต้องตัด contentTypes ที่ไม่รองรับออก; ถ้า scope เดิมใช้ไม่ได้กับ platform ที่เหลือให้ล้าง scope
4. ไม่บังคับ per-platform scope คนละค่าถ้า UI ใช้ grouped scope ร่วมกัน; ข้อกำหนดเก่าที่เขียนว่าแต่ละ platform ต้องมี radio ของตนเองถูกแทนด้วยกติกานี้
5. Gender แบบหลายค่าให้เก็บ array เป็นข้อมูลหลัก พร้อมอ่านข้อมูลเก่าที่มีค่า gender เดี่ยวได้
6. ไม่มี business rule เพิ่มให้ Target Post ต้องมากกว่า Target Influencer หรือให้ระบบคัด/Reject ผู้สมัครอัตโนมัติจาก criteria

### Acceptance criteria

- [ ] เลือกหลาย platform และ scope แล้ว reopen Edit ได้ platforms, scope และ contentTypes ตรงเดิม
- [ ] ลบ platform สุดท้ายที่รองรับ scope ปัจจุบันแล้ว scope/contentTypes ที่ใช้ไม่ได้ต้องถูกล้าง
- [ ] MIN = MAX เป็นค่าที่ผ่าน; MIN > MAX ต้องไม่ผ่าน Publish และแจ้ง error ของช่วงที่ผิด
- [ ] ตัวเลขติดลบหรือทศนิยมใน target/age/follower ต้องไม่ผ่าน Publish
- [ ] Target Post 0 ไม่ถูกแสดงเป็น missing; Draft มี MIN อย่างเดียวสามารถ Save/reopen ได้
- [ ] Detail แสดง Target Influencer จาก saved reviewers ไม่ใช้เลขตัวอย่างคงที่

## 10. Story 7 — ระยะเวลารับสมัครและระยะเวลาทำแคมเปญ

**ความต้องการของ PO:** ผู้ใช้ต้องเข้าใจช่วงรับสมัครและช่วงทำงานแยกกัน และเห็นวันที่แบบไทยโดยระบบยังเก็บวันที่มาตรฐาน

### Layout

หัวข้อ `ระยะเวลาของแคมเปญ` พร้อม helper `ช่วงเวลาทำแคมเปญต้องเริ่มหลังจากวันที่ปิดรับสมัครเป็นต้นไป`

แสดงระยะเวลารับสมัครก่อนระยะเวลาทำแคมเปญในแนวตั้งทุกหน้าจอ แต่ Start/End ของแต่ละช่วงต้องยังเป็นคู่ มี dash และ calendar icon

| ฟิลด์               | Saved field      | Publish validation                                  |
| ------------------- | ---------------- | --------------------------------------------------- |
| วันที่เปิดรับสมัคร  | `applyStartDate` | Required; valid calendar date                       |
| วันที่ปิดรับสมัคร   | `deadline`       | Required; deadline ≥ applyStartDate                 |
| วันที่เริ่มทำแคมเปญ | `startDate`      | Required; startDate ≥ deadline ตามคำว่า “เป็นต้นไป” |
| วันสุดท้ายของแคมเปญ | `endDate`        | Required; endDate ≥ startDate                       |

- Draft ไม่บังคับครบทั้งสี่วันและไม่บังคับผ่าน chronology ก่อนบันทึก
- ช่วงที่เปิด/ปิดวันเดียวกันผ่าน; ห้าม reject เพราะเท่ากัน
- UI `6 / 10 / 2569` ต้อง save เป็น `2026-10-06`; reopen แล้ววันที่ไม่เลื่อน
- ข้อมูลเก่าที่เป็น timestamp ให้อ่านตาม compatibility ของระบบเดิม ไม่เปลี่ยนปีใน storage เป็น พ.ศ.
- ไม่เพิ่มเงื่อนไข “ห้ามวันที่ย้อนหลัง” เพราะยังไม่มี requirement นี้
- ไม่เปลี่ยนวันที่แคมเปญอัตโนมัติเมื่อแก้วันรับสมัคร ให้แสดง error และให้ผู้ใช้แก้เอง

### Acceptance criteria

- [ ] รับสมัคร 6–6 ต.ค. และเริ่มทำแคมเปญ 6 ต.ค. ผ่านตามกติกาวันเท่ากัน
- [ ] วันปิดรับสมัครก่อนวันเปิด หรือวันจบแคมเปญก่อนวันเริ่ม ต้องไม่ผ่าน Publish
- [ ] เริ่มทำแคมเปญก่อนปิดรับสมัครต้องไม่ผ่าน และแจ้งข้อผิดพลาดของช่วงแคมเปญ
- [ ] ขาดวันใดวันหนึ่ง Publish ไม่ได้ แต่ Draft ได้ถ้า title ไม่ว่าง
- [ ] Save/reopen ใน timezone ต่างกันแล้ววันเดิม และปีใน storage ยังคงเป็น ค.ศ.
- [ ] Desktop/mobile แสดง recruitment ก่อน campaign และไม่มีวันที่ถูกซ่อนหรือ input ทับกัน

## 11. Detail, error handling และเกณฑ์ส่งมอบร่วม

### Posting Detail

- Summary แสดง identity, saved campaign type, `เปิดดูประกาศ` และ applicant count ของ Posting ปัจจุบัน
- แสดง saved Creator Criteria ครบ, periods, Short Brief, compensation/benefit, reference link, points และ Basic Information
- ค่าที่ขาดแสดง `ยังไม่ระบุ`; ห้ามเติม sample age/follower/target/points เพื่อให้หน้าดูครบ
- Action `แก้ไขประกาศ` อยู่บน avatar ตาม edit-chip pattern และเปิด Edit ด้วยค่าที่บันทึก
- Back ไป linked Brief โดยตรง; หากไม่มีต้นทางให้กลับ Brief list
- Product option แสดงที่ Brief Detail เท่านั้น

### Validation และ failure behavior

- Validation ไม่ผ่านให้คงค่าที่กรอก แสดง inline error ใกล้ฟิลด์ และไม่เปลี่ยน record/สถานะ/route
- หากการบันทึกไม่สำเร็จ ห้ามแสดง success หรือ navigate ออกจากฟอร์ม; แจ้งให้ retry ได้โดยไม่ต้องกรอกใหม่
- ห้าม fallback จาก route Edit ที่ไม่พบข้อมูลไปสร้างรายการใหม่เงียบ ๆ; แสดงไม่พบข้อมูลและทางกลับ parent
- การตรวจ duplicate ต้องครอบคลุมทุก Brief number และตรวจซ้ำ ณ จุดบันทึก; production ต้องมีการป้องกัน concurrent duplicate ไม่พึ่ง frontend อย่างเดียว
- การกด Back/Cancel ไม่บันทึก; confirm unsaved changes ยังไม่อยู่ในขอบเขตที่ยืนยัน

### Design และ development constraints

- Buddy Review design system: Bai Jamjuree, purple primary actions, consistent headings/borders และ spacing สเกล 4px
- Campaign Type และ criteria ที่เลือกใช้สีฟ้าตาม reference
- หน้า list/detail ใช้ fluid width; Brief form เป็นข้อยกเว้น max-width 800px; modal มี bounded width
- Mobile ต้องไม่มี title ทับ badge, ปุ่มตัดข้อความ หรือ footer บังเนื้อหาสุดท้าย
- แยก logic ของ entity และรักษา storage/backend contracts เดิม; prototype ปัจจุบันใช้ localStorage ไม่ใช่ production persistence

### Checklist สำหรับ Dev / QA

- [ ] ทดสอบ create/edit/draft/publish และ navigation ตามแต่ละ story
- [ ] ทดสอบ count invariants, aliases, วันที่ boundary, timezone และ empty states
- [ ] ทดสอบข้อมูล legacy: ไม่มี briefNumbers, products เป็น string, ไม่มี viewerCount และไม่มี points
- [ ] ทดสอบ reload หลัง Save และตรวจว่าค่าที่บันทึกครบ ไม่ถูก default overwrite
- [ ] ตรวจ desktop และ viewport แคบจากหน้าจอจริง
- [ ] รัน format:check, build และ test:sites เมื่อมีการแก้ code ตามกติกาโปรเจกต์
- [ ] เก็บไฟล์ Sites และ build outputs ที่ AGENTS.md ระบุครบก่อน handoff

## 12. ประเด็นที่ต้องให้ PO ยืนยันก่อน production implementation

รายการนี้ระบุสิ่งที่ยังไม่มีข้อสรุป ไม่ให้ Dev ตัดสินกติกาธุรกิจเองหรือถือ behavior ที่ขาด validation ใน prototype เป็น final requirement

| ประเด็น               | สิ่งที่ทราบแล้ว                                                                  | สิ่งที่ต้องยืนยัน                                                                                |
| --------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Required ตอน Publish  | Prototype บังคับ logo/subtitle/gender/age/follower; เอกสารเดิมบางรายการ optional | จะยืนยัน required ตามฟอร์มปัจจุบันหรือกลับไป optional โดย UI marker/validation ต้องตรงกัน        |
| Private campaign      | บันทึก enum และ description ว่าไม่เปิดรับสมัครได้                                | Public Link, recruitment dates/status/counts ของ private ต้องทำงานอย่างไร; ห้ามเดากติกายกเว้นเอง |
| Confidential campaign | เฉพาะผู้ผ่านการคัดเลือกเห็นรายละเอียด                                            | ฟิลด์ใดถูกซ่อนในหน้าสาธารณะ และ “ผ่านการคัดเลือก” ใช้ decision state ใด                          |
| วันเริ่มทำแคมเปญ      | Helper ใช้คำว่า “หลังจากวันที่ปิดรับสมัครเป็นต้นไป”                              | เอกสารนี้ใช้ ≥; หากต้องการวันถัดไปให้เปลี่ยน rule และ helper พร้อมกัน                            |
| Draft ระหว่าง Edit    | Create มี Save as Draft; regular Edit save publish Draft                         | ต้องการ Save Draft ต่อจากหน้า Edit หรือไม่; ยังไม่เพิ่ม action นี้โดยปริยาย                      |
| Auto point            | มี pointType และอัตราแสดงมูลค่า 10 points/บาท                                    | สูตร, trigger และข้อมูลต้นทางของการคำนวณจริง                                                     |
| Compensation          | มี 4 ประเภทและแสดง budget/benefit ตามประเภท                                      | Budget/benefit เป็น required เมื่อใด, ขอบเขตตัวเลข, และจัดการค่าที่ซ่อนเมื่อเปลี่ยนประเภทอย่างไร |
| Brief ID uniqueness   | ห้ามซ้ำในฟอร์ม/ข้าม Brief และต้องคง alias                                        | Case sensitivity ของ prefix และช่วงปีที่ธุรกิจอนุญาต                                             |
| Analytics production  | Prototype ใช้ sample counts ราย Posting                                          | นิยาม view/person/unique view, event source, refresh และ bot/internal traffic                    |
| Upload production     | รูปมีประเภทและขนาดจำกัด                                                          | นิยาม 3 MB เป็น byte threshold ใด และบริการจัดเก็บไฟล์จริง                                       |

**ข้อสังเกตจาก code ณ วันที่เอกสาร:** Posting form ยังตรวจ Publish ไม่ครบทุก required marker เช่น dates, Short Brief, Brand/Owner และ Compensation รวมทั้ง integer validation ของ age/follower ยังไม่ครบ เอกสารนี้ระบุเป้าหมายสำหรับ Dev/QA; การอัปเดตเอกสารครั้งนี้ไม่ได้แก้โค้ดหรือรับรองว่า acceptance criteria ผ่านแล้ว
