import { useRef, useState } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, CaretRight, Copy, Trash, UploadSimple } from '@phosphor-icons/react';
import { getBriefById } from '../briefs/briefApi.js';
import { CampaignPostingSource } from './CampaignPostingSource.jsx';
import {
  applyCampaignPostingSource,
  getCampaignPostingFields,
  POSTING_CAMPAIGN_FIELDS,
} from './campaignPostingSource.js';
import { Field } from '../../components/ui/Field.jsx';
import { LogoUploadField } from '../../components/shared/LogoUploadField.jsx';
import { CONTENT_SCOPE_GROUPS } from '../job-postings/creatorCriteriaOptions.js';
import { DEFAULT_CAMPAIGN, getCampaignById, saveCampaign } from './campaignApi.js';
import { SEED_PROJECTS } from '../projects/projectSeeds.js';
import { getCurrentUser } from '../../lib/currentUser.js';

const WORK_OPTIONS = [
  ['post', 'ส่งโพสต์อย่างเดียว'],
  ['idea-draft-post', 'ส่งคอนเทนต์ไอเดีย, ดราฟต์ และโพสต์', 'เหมาะสำหรับงานวิดีโอ'],
  ['draft-post', 'ส่งดราฟต์และโพสต์'],
];
const SCOPE_OPTIONS = CONTENT_SCOPE_GROUPS.map((scope) => [scope.label, scope.label]);
const MAX_FILE_SIZE = 3 * 1024 * 1024;
// The brand logo defaults from the source posting but stays editable in the campaign.
const LOCKED_POSTING_FIELDS = POSTING_CAMPAIGN_FIELDS.filter((key) => key !== 'cover');

function isHttpUrl(value) {
  try {
    return ['http:', 'https:'].includes(new URL(value.trim()).protocol);
  } catch {
    return false;
  }
}

function readFileAsDataUrl(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

export function CampaignForm() {
  const location = useLocation();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const saved = isEditing ? getCampaignById(id) : null;
  const project =
    SEED_PROJECTS.find(
      (entry) => entry.id === (saved?.projectId || searchParams.get('projectId')),
    ) || SEED_PROJECTS[0];
  const [values, setValues] = useState(() =>
    applyCampaignPostingSource(
      saved ||
        location.state?.copiedCampaign || {
          ...DEFAULT_CAMPAIGN,
          id: '',
          sourcePostings: [],
          name: '',
          subtitle: '',
          group: '',
          status: 'draft',
          assignOp: getCurrentUser().email,
          projectId: project.id,
          projectName: project.name,
          cover: project.image || '',
          applicationStart: '',
          applicationEnd: '',
          campaignStart: '',
          campaignEnd: '',
        },
    ),
  );
  const [error, setError] = useState('');
  const [logoError, setLogoError] = useState('');
  const [sourceBriefId, setSourceBriefId] = useState(() => {
    const briefIds = [
      ...new Set(
        (project.briefNumbers || [project.briefNumber])
          .filter(Boolean)
          .map((briefId) => getBriefById(briefId)?.id || briefId),
      ),
    ];
    const savedBrief = saved?.sourcePostings?.[0]?.brief || saved?.sourcePosting?.brief;
    return getBriefById(savedBrief)?.id || savedBrief || (briefIds.length === 1 ? briefIds[0] : '');
  });
  const sourcePostingRef = useRef(null);
  const hasSource = values.sourcePostings?.length > 0;
  const isLocked = (key) => hasSource && LOCKED_POSTING_FIELDS.includes(key);

  const handleChange = (key, value) => {
    setError('');
    setValues((current) =>
      current.sourcePostings?.length > 0 && LOCKED_POSTING_FIELDS.includes(key)
        ? current
        : { ...current, [key]: value },
    );
  };
  const handleSelectPosting = (postings) => {
    setError('');
    setValues((current) => {
      if (!postings || postings.length === 0) {
        const { sourcePostings, sourcePosting, sourceOriginalValues, ...remaining } = current;
        return { ...remaining, ...sourceOriginalValues, sourcePostings: [] };
      }
      const sourceOriginalValues =
        current.sourceOriginalValues ||
        Object.fromEntries(['name', ...POSTING_CAMPAIGN_FIELDS].map((key) => [key, current[key]]));
      return {
        ...current,
        ...getCampaignPostingFields(postings),
        briefLink:
          current.sourcePostings?.length > 0
            ? current.briefLink
            : (postings[0].briefLink ?? current.briefLink),
        sourcePostings: structuredClone(postings),
        sourceOriginalValues,
      };
    });
  };

  // Inherited (locked) fields cannot be fixed here, so they never block saving.
  const isMissing = (key) => !isLocked(key) && !String(values[key] ?? '').trim();
  const briefLink = values.briefLink || '';
  const hasValidBrief = Boolean(values.briefFiles?.length) || isHttpUrl(briefLink);
  const missingFields = [
    isMissing('assignOp') && 'Assign OP',
    isMissing('group') && 'Group',
    isMissing('workflow') && 'งานที่นักรีวิวต้องส่ง',
    isMissing('contentScope') && 'สโคปงาน',
    isMissing('cover') && 'โลโก้แบรนด์',
    !String(values.name ?? '').trim() && 'Campaign Title',
    isMissing('subtitle') && 'Campaign Subtitle',
    !hasValidBrief && 'รายละเอียดบรีฟ',
  ].filter(Boolean);
  const canSave = missingFields.length === 0;

  const handleSave = () => {
    if (!canSave) return;
    try {
      const now = new Date().toISOString();
      const campaign = {
        ...values,
        name: values.name.trim(),
        id: id || `campaign-${Date.now()}`,
        createdAt: values.createdAt || now,
        createdBy: values.createdBy || getCurrentUser().email,
        updatedAt: now,
        updatedBy: getCurrentUser().email,
      };
      saveCampaign(campaign);
      navigate(`/campaigns/${campaign.id}`);
    } catch {
      setError('บันทึกไม่สำเร็จ พื้นที่จัดเก็บอาจเต็ม กรุณาลดจำนวนไฟล์แล้วลองใหม่');
    }
  };
  const handleCancel = () => navigate(isEditing ? `/campaigns/${id}` : `/projects/${project.id}`);

  const renderChoices = (key, options) => (
    <div className="cw-choices">
      {options.map(([value, label, hint]) => (
        <label key={value} className={`cw-choice ${values[key] === value ? 'selected' : ''}`}>
          <input
            type="radio"
            name={key}
            disabled={isLocked(key)}
            checked={values[key] === value}
            onChange={() => handleChange(key, value)}
          />
          <div>
            <strong>{label}</strong>
            {hint && <p>{hint}</p>}
          </div>
        </label>
      ))}
    </div>
  );

  if (isEditing && !saved)
    return (
      <div className="p-8">
        <h1>ไม่พบแคมเปญ</h1>
        <button onClick={() => navigate(`/projects/${project.id}`)}>กลับหน้าโปรเจกต์</button>
      </div>
    );
  return (
    <main className="campaign-wizard">
      <nav className="cw-breadcrumb">
        <button onClick={() => navigate('/')}>Projects</button>
        <CaretRight />
        <button onClick={() => navigate(`/projects/${project.id}`)}>{project.name}</button>
        <CaretRight />
        {isEditing && (
          <>
            <button onClick={() => navigate(`/campaigns/${id}`)}>{saved.name}</button>
            <CaretRight />
          </>
        )}
        <b>{isEditing ? 'Edit campaign' : 'Create campaign'}</b>
      </nav>
      <header className="cw-header">
        <button className="cw-link" onClick={handleCancel}>
          <ArrowLeft /> กลับหน้า{isEditing ? 'แคมเปญ' : 'โปรเจกต์'}
        </button>
        <h1>{isEditing ? 'Edit Campaign' : 'Create Campaign'}</h1>
        {isEditing && (
          <button
            className="cw-copy"
            onClick={() => {
              navigate(`/campaigns/create?projectId=${project.id}`, {
                state: {
                  copiedCampaign: {
                    ...values,
                    id: '',
                    name: hasSource ? values.name : `${values.name} (Copy)`,
                    createdAt: undefined,
                    createdBy: undefined,
                    updatedAt: undefined,
                    updatedBy: undefined,
                  },
                },
              });
            }}
          >
            <Copy /> คัดลอกแคมเปญ
          </button>
        )}
      </header>
      <div className="cw-layout cw-focused-layout">
        <div className="cw-form-shell">
          <section className="cw-panel">
            <Field label="Assign OP" required hint="เลือก Operation ผู้ดูแลแคมเปญนี้">
              <select
                value={values.assignOp}
                onChange={(event) => handleChange('assignOp', event.target.value)}
              >
                {[...new Set([values.assignOp, getCurrentUser().email, 'yanisa@buddyreview.co'])]
                  .filter(Boolean)
                  .map((email) => (
                    <option key={email}>{email}</option>
                  ))}
              </select>
            </Field>
          </section>
          <CampaignPostingSource
            project={project}
            sourcePostings={values.sourcePostings || []}
            onSelect={handleSelectPosting}
            briefId={sourceBriefId}
            onBriefChange={setSourceBriefId}
            error=""
            selectRef={sourcePostingRef}
            savedPosting={saved?.sourcePostings?.[0] || saved?.sourcePosting || null}
            campaignId={id || ''}
          />
          <section className="cw-panel">
            <Field
              label="Group"
              required
              hint="โปรเจกต์นี้มีการจัดกลุ่ม กรุณาเลือกกลุ่มสำหรับแคมเปญนี้"
            >
              <select
                value={values.group}
                onChange={(event) => handleChange('group', event.target.value)}
              >
                <option value="">เลือกกลุ่ม</option>
                {['Group1', 'Group2', 'Group3'].map((group) => (
                  <option key={group}>{group}</option>
                ))}
              </select>
            </Field>
          </section>
          <section className="cw-panel">
            <h3>
              งานที่นักรีวิวต้องส่ง <em>*</em>
            </h3>
            {renderChoices('workflow', WORK_OPTIONS)}
          </section>
          <section className="cw-panel">
            <h3>
              สโคปงาน <em>*</em>
            </h3>
            <p>เลือกสโคปงานที่ต้องการให้นักรีวิวทำ</p>
            {isLocked('contentScope') && !values.contentScope && <p>ยังไม่ระบุ</p>}
            {renderChoices('contentScope', SCOPE_OPTIONS)}
          </section>
          <section className="cw-panel">
            <LogoUploadField
              id="campaign-logo-upload"
              value={values.cover}
              error={logoError}
              onChange={(cover) => {
                setLogoError('');
                handleChange('cover', cover);
              }}
              onError={setLogoError}
            />
            <Field label="Campaign Title" required>
              <input
                value={values.name ?? ''}
                onChange={(event) => handleChange('name', event.target.value)}
              />
            </Field>
            <Field label="Campaign Subtitle" required>
              <input
                value={values.subtitle ?? ''}
                readOnly={isLocked('subtitle')}
                placeholder={isLocked('subtitle') ? 'ยังไม่ระบุ' : undefined}
                onChange={(event) => handleChange('subtitle', event.target.value)}
              />
            </Field>
          </section>
          <section className="cw-panel" aria-label="รายละเอียดบรีฟ">
            <h3>
              รายละเอียดบรีฟ <small>สำหรับนักรีวิวที่ผ่านการคัดเลือก</small> <em>*</em>
            </h3>
            <p>กรุณาแนบไฟล์บรีฟหรือระบุลิงก์บรีฟอย่างน้อย 1 อย่าง</p>
            <div className="cw-upload-group">
              <label className="cw-upload">
                <UploadSimple size={24} />
                <span>ไฟล์บรีฟ</span>
                <small>PPTX, PDF, PNG, JPG, JPEG • ต้นแบบรองรับไม่เกิน 3 MB</small>
                <input
                  type="file"
                  accept=".ppt,.pptx,.pdf,.png,.jpg,.jpeg"
                  multiple
                  onChange={async (event) => {
                    const files = [...event.target.files];
                    if (files.some((file) => file.size > MAX_FILE_SIZE))
                      return setError('ไฟล์ในต้นแบบต้องมีขนาดไม่เกิน 3 MB ต่อไฟล์');
                    const attachments = await Promise.all(
                      files.map(async (file) => ({
                        name: file.name,
                        url: await readFileAsDataUrl(file),
                      })),
                    );
                    handleChange('briefFiles', [...(values.briefFiles || []), ...attachments]);
                  }}
                />
              </label>
              {(values.briefFiles || []).map((file, index) => (
                <div className="cw-file" key={index}>
                  <a href={file.url} target="_blank" rel="noreferrer">
                    {file.name}
                  </a>
                  <button
                    type="button"
                    aria-label={`ลบ ${file.name}`}
                    onClick={() =>
                      handleChange(
                        'briefFiles',
                        values.briefFiles.filter((_, position) => position !== index),
                      )
                    }
                  >
                    <Trash />
                  </button>
                </div>
              ))}
            </div>
            <p className="cw-or">หรือ</p>
            <Field
              label="ลิงก์บรีฟ"
              error={
                briefLink.trim() && !isHttpUrl(briefLink)
                  ? 'กรุณาระบุลิงก์บรีฟที่ถูกต้อง (http:// หรือ https://) หรือแนบไฟล์บรีฟ'
                  : ''
              }
            >
              <input
                type="url"
                value={briefLink}
                aria-invalid={Boolean(briefLink.trim() && !isHttpUrl(briefLink))}
                onChange={(event) => handleChange('briefLink', event.target.value)}
                placeholder="https://..."
              />
            </Field>
          </section>
        </div>
      </div>
      {error && (
        <p className="cw-error" role="alert">
          {error}
        </p>
      )}
      <div className="cw-audit">
        {values.createdAt ? (
          <>
            สร้างเมื่อ{' '}
            {new Date(values.createdAt).toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })} โดย{' '}
            {values.createdBy}
            <span>แก้ไขล่าสุด โดย {values.updatedBy || '-'}</span>
          </>
        ) : (
          'แคมเปญใหม่'
        )}
      </div>
      <footer className="cw-footer">
        <button className="cw-back" onClick={handleCancel}>
          ยกเลิก
        </button>
        <button
          className="cw-next"
          onClick={handleSave}
          disabled={!canSave}
          title={canSave ? undefined : `กรุณาระบุ: ${missingFields.join(', ')}`}
        >
          {isEditing ? 'บันทึกการแก้ไข' : 'สร้างแคมเปญ'}
        </button>
      </footer>
    </main>
  );
}
