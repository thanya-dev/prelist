# UI spacing audit

ตรวจจากภาพหน้าจอจริงของ prototype ในรอบนี้ที่ 1440 × 900 และ 390 × 844; ตรวจความกว้างขั้นต่ำ 320px เพิ่มใน Announcement Create, Brief modal และ Campaign Detail.

## จุดที่แก้

- [P2] Announcement cards: browser heading margins และ utility margins บวกกับ grid gap ทำให้พื้นที่ว่างซ้ำ → reset direct headings/paragraphs และใช้ gap 24px desktop / 16px mobile, heading/helper 8px. ฟอร์ม desktop สั้นลงจาก 3579px เป็น 3264px โดยไม่ตัดฟิลด์.
- [P1] Confirm List: แถบเครื่องมือและแถวค้นหาทำให้หน้ามือถือกว้าง 866px → wrap actions, min-width ของ search, ปรับ totals และให้เลื่อนเฉพาะ account table. ตรวจหลังแก้ pageWidth 390px ที่ viewport 390px.
- [P1] Posting reviewers: ตารางและแถบ filters/actions ทำให้หน้า mobile กว้าง 1076px → table scroll container, scrollable tabs, actions แยกแถว; toolbar คง fixed และมีพื้นที่ท้ายหน้า. หลังแก้ pageWidth ไม่เกิน viewport.
- [P2] Reviewer cards: ปรับ minmax ให้ย่อได้เมื่อพื้นที่จริงน้อยกว่า 320px.
- [P2] Project Campaign List: reset heading margins, spacing 12px ใน action row และรักษาข้อความปุ่มให้อ่านเป็นบรรทัดเดียว.
- [P2] Campaign Preview: ลด margin ของแต่ละ label/group และระยะก่อน creation metadata ให้สัมพันธ์กับ sections อื่น.
- [P2] Date inputs ใน Announcement ที่ 320px: คู่วันที่มี intrinsic width ทำให้ pageWidth 337px → จัดแนวตั้งเมื่อ ≤480px และให้ field grid ย่อได้. ตรวจหลังแก้ pageWidth 320px.
- Helper text ใช้ margin 0 เพื่อไม่บวกซ้ำกับ label/input gap; textarea ใช้ฟอนต์เดียวกับแอป.

## ภาพก่อน–หลัง

![Announcement spacing comparison](ui-audit/spacing-comparison.png)

## หน้าจอที่ตรวจ

| ขั้น | หน้าจอ/สถานะ                    | ผลตรวจ                                                 | Desktop                                                   | Mobile                                                   |
| ---- | ------------------------------- | ------------------------------------------------------ | --------------------------------------------------------- | -------------------------------------------------------- |
| 1    | Project List                    | ตรวจแล้ว — filter/card spacing อ่านได้                 | [ภาพ](ui-audit/after/01-project-list-desktop.png)         | [ภาพ](ui-audit/after/01-project-list-mobile.png)         |
| 2    | Project Detail (On Going)       | ตรวจแล้ว — summary, badge และ information cards        | [ภาพ](ui-audit/after/02-project-detail-desktop.png)       | [ภาพ](ui-audit/after/02-project-detail-mobile.png)       |
| 3    | Brief List                      | ตรวจแล้ว — titles, badges, search และ gutters          | [ภาพ](ui-audit/after/03-brief-list-desktop.png)           | [ภาพ](ui-audit/after/03-brief-list-mobile.png)           |
| 4    | Brief Detail ล่าสุด             | ตรวจแล้ว — Table only, summary และ filters             | [ภาพ](ui-audit/after/04-brief-detail-desktop.png)         | [ภาพ](ui-audit/after/04-brief-detail-mobile.png)         |
| 5    | Brief Edit modal                | ตรวจแล้ว — bounded width, footer และ labels            | [ภาพ](ui-audit/after/05-brief-modal-desktop.png)          | [ภาพ](ui-audit/after/05-brief-modal-mobile.png)          |
| 6    | Announcement Create             | แก้แล้ว — heading/helper/field spacing ซ้ำ             | [ภาพ](ui-audit/after/06-posting-create-desktop.png)       | [ภาพ](ui-audit/after/06-posting-create-mobile.png)       |
| 7    | Announcement Edit               | แก้แล้ว — spacing เหมือน Create                        | [ภาพ](ui-audit/after/07-posting-edit-desktop.png)         | [ภาพ](ui-audit/after/07-posting-edit-mobile.png)         |
| 8    | Announcement Detail             | ตรวจแล้ว — summary และ information sections            | [ภาพ](ui-audit/after/08-posting-detail-desktop.png)       | [ภาพ](ui-audit/after/08-posting-detail-mobile.png)       |
| 9    | Campaign Influencer List        | ตรวจแล้ว — filters, table และ import panel             | [ภาพ](ui-audit/after/09-campaign-detail-desktop.png)      | [ภาพ](ui-audit/after/09-campaign-detail-mobile.png)      |
| 10   | Campaign Create Step 1          | ตรวจแล้ว — wizard และ source selection                 | [ภาพ](ui-audit/after/10-campaign-create-desktop.png)      | [ภาพ](ui-audit/after/10-campaign-create-mobile.png)      |
| 11   | Campaign Edit Step 1            | ตรวจแล้ว — saved source/layout                         | [ภาพ](ui-audit/after/11-campaign-edit-desktop.png)        | [ภาพ](ui-audit/after/11-campaign-edit-mobile.png)        |
| 12   | Campaign Confirm List           | แก้แล้ว — toolbar wraps และ table scroll เฉพาะส่วน     | [ภาพ](ui-audit/after/12-confirm-list-desktop.png)         | [ภาพ](ui-audit/after/12-confirm-list-mobile.png)         |
| 13   | Posting reviewer Table          | แก้แล้ว — tabs, actions และ table ไม่ขยายทั้งหน้า      | [ภาพ](ui-audit/after/13-reviewers-desktop.png)            | [ภาพ](ui-audit/after/13-reviewers-mobile.png)            |
| 14   | Campaign Step 2                 | แก้แล้ว — compact Preview spacing และ audit/footer gap | [ภาพ](ui-audit/after/14-campaign-step2-desktop.png)       | [ภาพ](ui-audit/after/14-campaign-step2-mobile.png)       |
| 15   | Project Campaign List           | แก้แล้ว — heading/action spacing และปุ่มไม่แตกบรรทัด   | [ภาพ](ui-audit/after/15-project-campaigns-desktop.png)    | [ภาพ](ui-audit/after/15-project-campaigns-mobile.png)    |
| 16   | Brief linked-announcement Table | ตรวจแล้ว — horizontally scrollable table               | [ภาพ](ui-audit/after/17-posting-table-desktop.png)        | [ภาพ](ui-audit/after/17-posting-table-mobile.png)        |
| 17   | Reviewer card view              | แก้แล้ว — grid ย่อได้ตามพื้นที่มือถือ                  | [ภาพ](ui-audit/after/18-reviewer-cards-desktop.png)       | [ภาพ](ui-audit/after/18-reviewer-cards-mobile.png)       |
| 18   | Add reviewer modal              | ตรวจแล้ว — fields และขนาด modal                        | [ภาพ](ui-audit/after/19-reviewer-add-modal-desktop.png)   | [ภาพ](ui-audit/after/19-reviewer-add-modal-mobile.png)   |
| 19   | Project Detail (Draft)          | ตรวจแล้ว — missing fields/summary/cards                | [ภาพ](ui-audit/after/20-project-draft-desktop.png)        | [ภาพ](ui-audit/after/20-project-draft-mobile.png)        |
| 20   | Brief search empty state        | ตรวจแล้ว — message และ clear action                    | [ภาพ](ui-audit/after/21-search-empty-desktop.png)         | [ภาพ](ui-audit/after/21-search-empty-mobile.png)         |
| 21   | Announcement save confirmation  | ตรวจแล้ว — bounded Preview และ footer actions          | [ภาพ](ui-audit/after/22-posting-confirmation-desktop.png) | [ภาพ](ui-audit/after/22-posting-confirmation-mobile.png) |

## ภาพรวมที่ตรวจด้วยสายตา

![Desktop overview](ui-audit/after/desktop-all.png)

![Mobile verification](ui-audit/after/verification-overview.png)

## การตรวจประกอบ

- ตรวจ document scroll width จาก browser DOM: main pages 11 สถานะไม่ล้นที่ 390px; Confirm List, reviewer Table/card, Campaign Step 2, modal และ empty states ตรวจเพิ่มหลังแก้.
- ตารางกว้างตั้งใจให้เลื่อนภายใน table container; tabs ที่ยาวตั้งใจให้เลื่อนเฉพาะแถบ tabs.
- Build และ Sites worker tests ผ่าน 4/4. ไฟล์ที่แก้ผ่าน Prettier; ตรวจ diff whitespace แล้ว.
- ตรวจ browser console errors ในหน้าที่ทดสอบล่าสุด ไม่พบ error.

## ขอบเขตและข้อจำกัด

- เป็นการตรวจ UI/spacing และ responsive ของ local prototype ไม่ใช่ accessibility certification หรือ exhaustive business-flow test. ไม่ได้ส่งข้อความ, publish, Accept/Reject หรือเปลี่ยนข้อมูลจริงระหว่าง audit.
- Project Create/Edit เปิดระบบ Buddy Review ภายนอก จึงไม่รวมใน local UI audit. ยังไม่ได้ตรวจทุก browser, ทุก viewport และทุกความยาวข้อมูลที่เป็นไปได้.
- ระหว่าง audit มีการอัปเดต Brief Detail เป็น Table only และลบ Product Option จาก UI. ภาพก่อนแก้บางภาพแสดง UI ก่อนอัปเดต; ภาพ after/04 และ after/17 ตรวจใหม่จากเวอร์ชันล่าสุด. ภาพหมายเลข 16 เก็บเป็นประวัติและไม่ถือเป็นผลตรวจ UI ปัจจุบัน.
- ไฟล์ requirement และ source อื่นมีการเปลี่ยนอยู่แล้ว จึงไม่ได้ย้อนไฟล์เหล่านั้นเพื่อทำ spacing audit.

ผลตรวจ: ไม่เหลือปัญหา spacing/overflow ระดับ P1/P2 ในสถานะและ viewport ที่ตรวจ.
