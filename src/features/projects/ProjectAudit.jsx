export function ProjectAudit({ project }) {
  const formatDate = (value) =>
    value
      ? new Intl.DateTimeFormat('th-TH', {
          dateStyle: 'short',
          timeStyle: 'short',
          timeZone: 'Asia/Bangkok',
        }).format(new Date(value))
      : 'ไม่ระบุ';
  return (
    <div className="project-audit audit-note flex flex-wrap gap-4">
      <div>
        สร้างเมื่อ {formatDate(project?.createdAt)}
        <br />
        โดย {project?.createdBy || 'ไม่ระบุ'}
      </div>
      <div>
        แก้ไขล่าสุดเมื่อ {formatDate(project?.updatedAt)}
        <br />
        โดย {project?.updatedBy || 'ไม่ระบุ'}
      </div>
    </div>
  );
}
