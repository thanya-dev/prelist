import { Fragment } from 'react';
import { ProjectAudit } from './ProjectAudit.jsx';
export function ProjectInformation({ project }) {
  const formatValue = (value, unit = '') =>
    value === '' || value == null || !Number.isFinite(Number(value))
      ? 'ไม่ระบุ'
      : `${Number(value).toLocaleString('th-TH')} ${unit}`;
  const descriptions = {
    ใบเสนอราคาของโปรเจกต์: 'หมายเลขใบเสนอราคาที่ใช้ในการเสนอขายให้แบรนด์',
    Brief: 'หมายเลขบรีฟจากแบรนด์',
    Group: 'สำหรับโปรเจกต์แบบ Year Plan หรือโปรเจกต์ที่ต้องการจัดกลุ่มแคมเปญ',
    Goal: 'เป้าหมายของโปรเจกต์ทั้งจำนวนนักรีวิว จำนวนโพสต์ และจำนวนการเข้าถึง',
    Budget:
      'งบประมาณที่แบรนด์กำหนดสำหรับโปรเจกต์นี้ ครอบคลุมค่าใช้จ่ายต่างๆ เช่น ค่าจ้างนักรีวิว ค่า Production ค่า OT พนักงาน Buddy review และค่าโฆษณา เป็นต้น',
  };
  const sections = [
    [
      'ข้อมูลโปรเจกต์',
      [
        ['ชื่อโปรเจกต์', project.name],
        ['Project ID', project.id],
        ['Assign PM', project.assignPM || project.owner],
      ],
    ],
    [
      'ใบเสนอราคาของโปรเจกต์',
      (project.quotations || [project.quote])
        .filter(Boolean)
        .map((quote, index) => [`${index + 1}. ${index === 0 ? 'Main' : 'Quotation'}`, quote]),
    ],
    [
      'Brief',
      (project.briefNumbers || [project.briefNumber])
        .filter(Boolean)
        .map((brief, index) => [`${index + 1}.`, brief]),
    ],
    [
      'Group',
      (project.groups || [project.group])
        .filter(Boolean)
        .map((group, index) => [`${index + 1}.`, group]),
    ],
    [
      'Goal',
      [
        ['Target Influencer', formatValue(project.target, 'คน')],
        ['Target Post', formatValue(project.targetPost, 'โพสต์')],
        ['Target Reach', formatValue(project.targetReach, 'เข้าถึง')],
      ],
    ],
    [
      'Budget',
      [
        ['Total project cost', formatValue(project.totalCost, 'บาท')],
        ['Contingency cost', formatValue(project.contingencyCost, 'บาท')],
      ],
    ],
  ];
  return (
    <div className="project-information mt-6 space-y-6">
      <div className="detail-grid">
        {sections.map(([title, rows]) => (
          <Fragment key={title}>
            {title === 'Goal' && <h2 className="col-span-full">Goal &amp; Budget</h2>}
            <section className="detail-card">
              <h2>{title}</h2>
              {descriptions[title] && (
                <p className="mb-4 text-sm text-gray-500">{descriptions[title]}</p>
              )}
              <dl>
                {rows.length ? (
                  rows.map(([label, value], index) => (
                    <div key={index}>
                      <dt>{label}</dt>
                      <dd>
                        {value || 'ไม่ระบุ'}
                        {title === 'ใบเสนอราคาของโปรเจกต์' && (
                          <div className="mt-2 text-xs text-gray-500">
                            เพิ่มเมื่อ{' '}
                            {project.quotationMetadata?.[index]?.createdAt
                              ? new Intl.DateTimeFormat('th-TH', {
                                  dateStyle: 'short',
                                  timeZone: 'Asia/Bangkok',
                                }).format(new Date(project.quotationMetadata[index].createdAt))
                              : 'ไม่ระบุ'}{' '}
                            · โดย {project.quotationMetadata?.[index]?.createdBy || 'ไม่ระบุ'}
                          </div>
                        )}
                      </dd>
                    </div>
                  ))
                ) : (
                  <div>
                    <dd>ยังไม่มีข้อมูล</dd>
                  </div>
                )}
              </dl>
            </section>
          </Fragment>
        ))}
      </div>
      <ProjectAudit project={project} />
    </div>
  );
}
