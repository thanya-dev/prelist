import { getBriefById } from '../briefs/briefApi.js';
import { CampaignSettingPreview } from './CampaignSettingPreview.jsx';
import { useState, useRef } from 'react';
import { useNavigate, useParams, useSearchParams, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  CaretRight,
  Check,
  Copy,
  CalendarBlank,
  UploadSimple,
  Trash,
  Plus,
  DotsSixVertical,
  TextB,
  TextItalic,
  TextUnderline,
  Link,
} from '@phosphor-icons/react';
import { CampaignPostingSource } from './CampaignPostingSource.jsx';
import {
  applyCampaignPostingSource,
  getCampaignPostingFields,
  POSTING_CAMPAIGN_FIELDS,
} from './campaignPostingSource.js';
import { LockSimple } from '@phosphor-icons/react';
import { Field } from '../../components/ui/Field.jsx';
import { CreatorCriteriaFields } from '../job-postings/CreatorCriteriaFields.jsx';
import { DEFAULT_CAMPAIGN, getCampaignById, saveCampaign } from './campaignApi.js';
import { SEED_PROJECTS } from '../projects/projectSeeds.js';
import { getCurrentUser } from '../../lib/currentUser.js';
const STEPS = [
  ['Setting', 'ตั้งค่าแคมเปญ'],
  ['Campaign info', 'ข้อมูลหลักแคมเปญ'],
  ['Brief', 'บรีฟทั้งหมด'],
  ['Payment offer & Reward', 'แต้มและรางวัล'],
];
const STATUS_OPTIONS = [
  ['draft', 'DRAFT', 'ร่างแคมเปญไว้ก่อน ยังไม่เปิดรับสมัคร (นักรีวิวจะยังไม่เห็นแคมเปญ)'],
  [
    'active',
    'ACTIVE CAMPAIGN',
    'เปิดรับสมัครนักรีวิวในระบบ (นักรีวิวที่ตรงเงื่อนไขแคมเปญจะเห็นและสมัครงานได้)',
  ],
  ['completed', 'COMPLETED', 'จบแคมเปญนี้เลย นักรีวิวส่งงานครบและอนุมัติการจ่ายเงินแล้วทั้งหมด'],
];
const TYPE_OPTIONS = [
  ['normal', 'Normal', 'แคมเปญทั่วไป นักรีวิวจะเห็นรายละเอียดแคมเปญตั้งแต่ขั้นตอนการสมัครเลย'],
  [
    'confidential',
    'Confidential campaign',
    'เฉพาะนักรีวิวที่ผ่านการคัดเลือกเท่านั้น ที่เห็นรายละเอียดแคมเปญได้',
  ],
  [
    'private',
    'Private campaign',
    'แคมเปญส่วนตัว ไม่เปิดรับสมัคร (ทีมงานต้องเป็นคนเลือกและจัดการงานแทนนักรีวิวเท่านั้น)',
  ],
];
const WORK_OPTIONS = [
  ['post', 'ส่งโพสต์อย่างเดียว'],
  ['idea-draft-post', 'ส่งคอนเทนต์ไอเดีย, ดราฟต์ และโพสต์', 'เหมาะสำหรับงานวิดีโอ'],
  ['draft-post', 'ส่งดราฟต์และโพสต์'],
];
export function CampaignForm() {
  const briefRef = useRef(null);
  const selectedBriefRef = useRef(null);
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
          name: '',
          subtitle: '',
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
  const [step, setStep] = useState(() =>
    isEditing && (saved?.sourcePostings?.length || saved?.sourcePosting) ? 1 : 0,
  );
  const [error, setError] = useState('');
  const [selectedBriefError, setSelectedBriefError] = useState('');
  const [sourceBriefId, setSourceBriefId] = useState(() => {
    const briefIds = [
      ...new Set(
        (project.briefNumbers || [project.briefNumber])
          .filter(Boolean)
          .map((briefId) => getBriefById(briefId)?.id || briefId),
      ),
    ];
    return (
      getBriefById(saved?.sourcePostings?.[0]?.brief)?.id ||
      saved?.sourcePostings?.[0]?.brief ||
      getBriefById(saved?.sourcePosting?.brief)?.id ||
      saved?.sourcePosting?.brief ||
      (briefIds.length === 1 ? briefIds[0] : '')
    );
  });
  const [sourcePostingError, setSourcePostingError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const sourcePostingRef = useRef(null);
  const isLocked = (key) =>
    Boolean(values.sourcePostings?.length > 0) && POSTING_CAMPAIGN_FIELDS.includes(key);
  const onChange = (key, value) => {
    if (key === 'briefLink' || key === 'briefFiles') setSelectedBriefError('');
    setFormErrors((current) => ({ ...current, [key]: '' }));
    setValues((current) =>
      current.sourcePostings?.length > 0 && POSTING_CAMPAIGN_FIELDS.includes(key)
        ? current
        : { ...current, [key]: value },
    );
  };
  const handleSelectPosting = (postings) => {
    setSourcePostingError('');
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
    setError('');
  };
  const renderLockHint = (key) =>
    isLocked(key) && (
      <small className="cw-lock-hint">
        <LockSimple /> ข้อมูลจากประกาศ · แก้ไขไม่ได้
      </small>
    );
  const handleStep = (next) => {
    setStep(next);
    setError('');
    window.scrollTo(0, 0);
  };
  const handleNext = () => {
    if (step === 0) {
      let hasError = false;
      let newErrors = {};

      if (!values.assignOp) {
        newErrors.assignOp = 'กรุณาเลือก Assign OP';
        hasError = true;
      }
      if (!values.group) {
        newErrors.group = 'กรุณาเลือก Group';
        hasError = true;
      }

      if (sourceBriefId && !values.sourcePostings?.length) {
        setSourcePostingError(`กรุณาเลือกประกาศใน ${sourceBriefId}`);
        sourcePostingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        hasError = true;
      }

      setFormErrors(newErrors);

      if (hasError) return;

      return handleStep(1);
    }
    if (
      !Number.isInteger(Number(values.target)) ||
      Number(values.target) < 1 ||
      values.targetPost === '' ||
      !Number.isInteger(Number(values.targetPost)) ||
      Number(values.targetPost) < 0
    )
      return setError(
        'กรุณาระบุ Target influencer อย่างน้อย 1 คน และ Target post ตั้งแต่ 0 เป็นจำนวนเต็ม',
      );
    if (
      !values.sourcePostings?.length &&
      ((values.applicationStart &&
        values.applicationEnd &&
        values.applicationStart > values.applicationEnd) ||
        (values.campaignStart && values.campaignEnd && values.campaignStart > values.campaignEnd))
    )
      return setError('วันที่สิ้นสุดต้องไม่ก่อนวันที่เริ่มต้น');
    if (
      step === 1 &&
      !values.sourcePostings?.length &&
      (!values.name.trim() ||
        !values.subtitle.trim() ||
        Number(values.target) < 1 ||
        !values.platforms.length ||
        !values.genders.length)
    )
      return setError('กรุณาระบุชื่อ, Subtitle, Target influencer, เพศ และช่องทางรีวิว');
    if (!values.briefFiles?.length) {
      let hasValidBriefLink = false;
      try {
        hasValidBriefLink = ['http:', 'https:'].includes(new URL(values.briefLink.trim()).protocol);
      } catch {
        /* An empty or invalid URL cannot satisfy the required brief. */
      }
      if (!hasValidBriefLink) {
        setSelectedBriefError(
          values.briefLink.trim()
            ? 'กรุณาระบุลิงก์บรีฟที่ถูกต้อง (http:// หรือ https://) หรือแนบไฟล์บรีฟ'
            : 'กรุณาแนบไฟล์บรีฟหรือระบุลิงก์บรีฟอย่างน้อย 1 อย่าง',
        );
        selectedBriefRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
    }
    setSelectedBriefError('');
    try {
      const now = new Date().toISOString();
      const campaign = {
        ...values,
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
  const renderChoices = (key, options) => (
    <div className="cw-choices">
      {options.map(([value, label, hint]) => (
        <label key={value} className={`cw-choice ${values[key] === value ? 'selected' : ''}`}>
          <input
            type="radio"
            name={key}
            disabled={isLocked(key)}
            checked={values[key] === value}
            onChange={() => onChange(key, value)}
          />
          <div>
            {key === 'status' ? (
              <span className={`cw-status ${value}`}>{label}</span>
            ) : (
              <strong>{label}</strong>
            )}
            {hint && <p>{hint}</p>}
          </div>
        </label>
      ))}
    </div>
  );
  const renderField = (key, label, type = 'text') => (
    <Field label={label}>
      <input
        type={type}
        min={type === 'number' ? 0 : undefined}
        value={values[key]}
        readOnly={isLocked(key)}
        placeholder={isLocked(key) ? 'ยังไม่ระบุ' : undefined}
        onChange={(event) => onChange(key, event.target.value)}
      />
      {renderLockHint(key)}
    </Field>
  );
  const renderRepeater = (key, title, hint) => (
    <section className="cw-panel">
      <h3>{title}</h3>
      <p>{hint}</p>
      {values[key].map((value, index) => (
        <div className="cw-repeat" key={index}>
          <DotsSixVertical />
          <textarea
            aria-label={`${title} ${index + 1}`}
            value={value}
            onChange={(event) =>
              onChange(
                key,
                values[key].map((entry, position) =>
                  position === index ? event.target.value : entry,
                ),
              )
            }
          />
          <button
            type="button"
            aria-label={`ลบ ${title} ${index + 1}`}
            onClick={() =>
              onChange(
                key,
                values[key].filter((_, position) => position !== index),
              )
            }
          >
            <Trash />
          </button>
        </div>
      ))}
      <button type="button" className="cw-link" onClick={() => onChange(key, [...values[key], ''])}>
        <Plus /> เพิ่ม
      </button>
    </section>
  );
  const renderUpload = (key, label, accept, hint) => (
    <div className="cw-upload-group">
      <label className="cw-upload">
        <UploadSimple size={24} />
        <span>{label}</span>
        <small>{hint}</small>
        <input
          type="file"
          accept={accept}
          multiple
          onChange={async (event) => {
            const files = [...event.target.files];
            if (files.some((file) => file.size > 3 * 1024 * 1024)) {
              setError('ไฟล์ในต้นแบบต้องมีขนาดไม่เกิน 3 MB ต่อไฟล์');
              return;
            }
            const attachments = await Promise.all(
              files.map(
                (file) =>
                  new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve({ name: file.name, url: reader.result });
                    reader.readAsDataURL(file);
                  }),
              ),
            );
            onChange(key, [...values[key], ...attachments]);
          }}
        />
      </label>
      {values[key].map((file, index) => (
        <div className="cw-file" key={index}>
          <a href={file.url} target="_blank" rel="noreferrer">
            {file.name}
          </a>
          <button
            type="button"
            aria-label={`ลบ ${file.name}`}
            onClick={() =>
              onChange(
                key,
                values[key].filter((_, position) => position !== index),
              )
            }
          >
            <Trash />
          </button>
        </div>
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
            <button onClick={() => navigate(`/campaigns/${id}`)}>{values.name}</button>
            <CaretRight />
          </>
        )}
        <b>{isEditing ? 'Edit campaign' : 'Create campaign'}</b>
      </nav>
      <header className="cw-header">
        <button
          className="cw-link"
          onClick={() => navigate(isEditing ? `/campaigns/${id}` : `/projects/${project.id}`)}
        >
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
                    name: values.sourcePostings?.length ? values.name : `${values.name} (Copy)`,
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
      <ol className="cw-stepper">
        {STEPS.map(([title, subtitle], index) => (
          <li key={title} className={index <= step ? 'active' : ''}>
            <button
              type="button"
              onClick={() => index < step && handleStep(index)}
              disabled={index > step}
            >
              <span className="cw-step-number">{index < step ? <Check /> : index + 1}</span>
              <span>
                {title}
                <small>{subtitle}</small>
              </span>
            </button>
          </li>
        ))}
      </ol>
      <div className="cw-step-title">
        <h2>
          Step {step + 1}: {STEPS[step][0]}
        </h2>
        <p>{STEPS[step][1]}</p>
      </div>
      <div className={`cw-layout ${step === 1 ? 'cw-preview-layout' : 'cw-focused-layout'}`}>
        {step === 1 && <CampaignSettingPreview campaign={values} project={project} />}
        <div className="cw-form-shell">
          {step === 0 && (
            <>
              <CampaignPostingSource
                project={project}
                sourcePostings={values.sourcePostings || []}
                onSelect={handleSelectPosting}
                briefId={sourceBriefId}
                onBriefChange={(id) => {
                  setSourceBriefId(id);
                  setSourcePostingError('');
                }}
                error={sourcePostingError}
                selectRef={sourcePostingRef}
              />
              <section className="cw-panel">
                <Field
                  label="Assign OP"
                  required
                  hint="เลือก Operation ผู้ดูแลแคมเปญนี้"
                  error={formErrors.assignOp}
                >
                  <select
                    aria-invalid={Boolean(formErrors.assignOp)}
                    value={values.assignOp}
                    onChange={(event) => onChange('assignOp', event.target.value)}
                  >
                    {[
                      ...new Set([
                        values.assignOp,
                        getCurrentUser().email,
                        'yanisa@buddyreview.co',
                      ]),
                    ].map((email) => (
                      <option key={email}>{email}</option>
                    ))}
                  </select>
                </Field>
                <Field
                  label="Group"
                  required
                  hint="โปรเจกต์นี้มีการจัดกลุ่ม กรุณาเลือกกลุ่มสำหรับแคมเปญนี้"
                  error={formErrors.group}
                >
                  <select
                    aria-invalid={Boolean(formErrors.group)}
                    value={values.group}
                    onChange={(event) => onChange('group', event.target.value)}
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
                  สถานะแคมเปญ <em>*</em>
                </h3>
                {renderChoices('status', STATUS_OPTIONS)}
              </section>
              <section className="cw-panel">
                <h3>แสดงข้อมูลผู้ติดตามของนักรีวิว</h3>
                <p>เลือกข้อมูลที่ต้องการให้แสดงในหน้าจัดการแคมเปญ</p>
                {['Gender', 'Age', 'Country', 'Province'].map((label) => (
                  <label className="cw-toggle" key={label}>
                    <input
                      type="checkbox"
                      role="switch"
                      checked={values.demographics.includes(label)}
                      onChange={() =>
                        onChange(
                          'demographics',
                          values.demographics.includes(label)
                            ? values.demographics.filter((value) => value !== label)
                            : [...values.demographics, label],
                        )
                      }
                    />
                    {label}
                  </label>
                ))}
              </section>{' '}
            </>
          )}
          {step === 1 && (
            <section className="cw-panel">
              <h3>Goals</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Field label="Target influencer" required hint="จำนวนนักรีวิวทั้งหมดในแคมเปญ">
                  <input
                    type="number"
                    min="1"
                    value={values.target ?? ''}
                    onChange={(event) => onChange('target', event.target.value)}
                  />
                </Field>
                <Field label="Target post" required hint="จำนวนโพสต์ทั้งหมดในแคมเปญ">
                  <input
                    type="number"
                    min="0"
                    value={values.targetPost ?? ''}
                    onChange={(event) => onChange('targetPost', event.target.value)}
                  />
                </Field>
              </div>
            </section>
          )}
          {step === 1 && (
            <>
              {!values.sourcePostings?.length && (
                <>
                  <section className="cw-panel">
                    <h3>
                      ประเภทแคมเปญ <em>*</em>
                    </h3>
                    {renderLockHint('campaignType')}
                    {isLocked('campaignType') && !values.campaignType && <p>ยังไม่ระบุ</p>}
                    {renderChoices('campaignType', TYPE_OPTIONS)}
                  </section>
                  <section className="cw-panel">
                    <h3>ระยะเวลาของแคมเปญ</h3>
                    {renderLockHint('campaignStart')}
                    <p>ช่วงเวลาทำแคมเปญต้องเริ่มหลังจากวันที่ปิดรับสมัครเป็นต้นไป</p>
                    {[
                      [
                        'ระยะเวลารับสมัคร',
                        'applicationStart',
                        'applicationEnd',
                        'วันที่เปิดรับสมัคร',
                        'วันที่ปิดรับสมัคร',
                      ],
                      [
                        'ระยะเวลาทำแคมเปญ',
                        'campaignStart',
                        'campaignEnd',
                        'วันที่เริ่มทำแคมเปญ',
                        'วันสุดท้ายของแคมเปญ',
                      ],
                    ].map(([title, start, end, startLabel, endLabel]) => (
                      <div className="cw-date-section" key={start}>
                        <h4>{title}</h4>
                        <div className="cw-date-pair">
                          <DateInput
                            label={startLabel}
                            disabled={isLocked(start)}
                            value={values[start]}
                            onChange={(value) => onChange(start, value)}
                          />
                          <span>-</span>
                          <DateInput
                            label={endLabel}
                            disabled={isLocked(end)}
                            value={values[end]}
                            onChange={(value) => onChange(end, value)}
                          />
                        </div>
                      </div>
                    ))}
                  </section>
                </>
              )}
              <section className="cw-panel">
                <h3>
                  งานที่นักรีวิวต้องส่ง <em>*</em>
                </h3>
                {renderChoices('workflow', WORK_OPTIONS)}
              </section>
            </>
          )}
          {step === 1 && !values.sourcePostings?.length && (
            <>
              {renderLockHint('target')}
              {values.sourcePostings?.length > 0 && (
                <p className="cw-lock-hint">
                  ช่องที่ไม่มีข้อมูลในประกาศแสดงเป็นค่าว่าง / ยังไม่ระบุ
                </p>
              )}
              <fieldset className="cw-inherited-fields" disabled={isLocked('target')}>
                <CreatorCriteriaFields
                  showGoals={false}
                  values={values}
                  errors={{}}
                  onChange={onChange}
                  onTogglePlatform={(platform) =>
                    onChange(
                      'platforms',
                      values.platforms.includes(platform)
                        ? values.platforms.filter((entry) => entry !== platform)
                        : [...values.platforms, platform],
                    )
                  }
                  onSelectScope={(scope) => onChange('contentScope', scope.label)}
                />
              </fieldset>
              <section className="cw-panel">
                <div className="cw-logo">
                  <label>
                    โลโก้แบรนด์ <em>*</em>
                    {values.cover && <img src={values.cover} alt="โลโก้แบรนด์" />}
                    <input
                      type="file"
                      disabled={isLocked('cover')}
                      accept="image/png,image/jpeg"
                      onChange={(event) => {
                        const file = event.target.files[0];
                        if (!file) return;
                        if (
                          file.size > 3 * 1024 * 1024 ||
                          !['image/png', 'image/jpeg'].includes(file.type)
                        )
                          return setError('เลือกภาพ PNG/JPG ขนาดไม่เกิน 3 MB');
                        const reader = new FileReader();
                        reader.onload = () => onChange('cover', reader.result);
                        reader.readAsDataURL(file);
                      }}
                    />
                  </label>
                  {!values.cover && isLocked('cover') && <p>ยังไม่ระบุโลโก้ในประกาศ</p>}
                  {renderLockHint('cover')}
                  {values.cover && !isLocked('cover') && (
                    <button type="button" onClick={() => onChange('cover', '')}>
                      ลบโลโก้
                    </button>
                  )}
                </div>
                {renderField('subtitle', 'Campaign Subtitle *')}
              </section>
            </>
          )}
          {step === 1 && (
            <>
              {!values.sourcePostings?.length && (
                <>
                  {' '}
                  <section className="cw-panel">
                    <h3>
                      รายละเอียดบรีฟ <small>ทั่วไป</small>
                    </h3>
                    <p>แสดงรายละเอียดบรีฟสำหรับนักรีวิวทุกคน</p>
                    <fieldset className="cw-inherited-fields" disabled={isLocked('brief')}>
                      <div className="cw-editor-bar">
                        <span>Prompt</span>
                        {[
                          [TextB, 'ตัวหนา', '**'],
                          [TextUnderline, 'ขีดเส้นใต้', '__'],
                          [TextItalic, 'ตัวเอียง', '*'],
                        ].map(([Icon, label, marker]) => (
                          <button
                            key={label}
                            type="button"
                            aria-label={label}
                            onClick={() => {
                              const editor = briefRef.current;
                              const start = editor.selectionStart;
                              const end = editor.selectionEnd;
                              onChange(
                                'brief',
                                values.brief.slice(0, start) +
                                  marker +
                                  values.brief.slice(start, end) +
                                  marker +
                                  values.brief.slice(end),
                              );
                            }}
                          >
                            <Icon />
                          </button>
                        ))}
                        <span>16px</span>
                        <button
                          type="button"
                          aria-label="เพิ่มลิงก์ในบรีฟ"
                          onClick={() => onChange('brief', values.brief + '\n[ข้อความ](https://)')}
                        >
                          <Link />
                        </button>
                      </div>
                      <textarea
                        readOnly={isLocked('brief')}
                        placeholder={isLocked('brief') ? 'ยังไม่ระบุ' : undefined}
                        className="cw-editor"
                        ref={briefRef}
                        aria-label="รายละเอียดบรีฟ"
                        value={values.brief}
                        onChange={(event) => onChange('brief', event.target.value)}
                      />
                    </fieldset>
                    {renderLockHint('brief')}
                  </section>
                </>
              )}
              <section
                className="cw-panel"
                ref={selectedBriefRef}
                aria-label="รายละเอียดบรีฟสำหรับนักรีวิวที่ผ่านการคัดเลือก"
              >
                <h3>
                  รายละเอียดบรีฟ <small>สำหรับนักรีวิวที่ผ่านการคัดเลือก</small> <em>*</em>
                </h3>
                <p>กรุณาแนบไฟล์บรีฟหรือระบุลิงก์บรีฟอย่างน้อย 1 อย่าง</p>
                {renderUpload(
                  'briefFiles',
                  'ไฟล์บรีฟ',
                  '.ppt,.pptx,.pdf,.png,.jpg,.jpeg',
                  'PPTX, PDF, PNG, JPG, JPEG • ต้นแบบรองรับไม่เกิน 3 MB',
                )}
                <p className="cw-or">หรือ</p>
                <Field label="ลิงก์บรีฟ">
                  <input
                    type="url"
                    value={values.briefLink}
                    onChange={(event) => onChange('briefLink', event.target.value)}
                    aria-invalid={Boolean(selectedBriefError)}
                    aria-describedby={selectedBriefError ? 'selected-brief-error' : undefined}
                    placeholder="https://..."
                  />
                </Field>
                {selectedBriefError && (
                  <small id="selected-brief-error" className="field-error" role="alert">
                    {selectedBriefError}
                  </small>
                )}
              </section>{' '}
            </>
          )}
          {step === 1 && (
            <>
              {!values.sourcePostings?.length && (
                <>
                  <section className="cw-panel cw-reward">
                    <h3>รางวัลพิเศษ</h3>
                    <p>
                      รางวัลเพิ่มเติมนอกเหนือจากแต้ม
                      หรือสำหรับแคมเปญที่ต้องการให้ผลตอบแทนเป็นสิ่งของแทน
                    </p>
                    <input
                      readOnly={isLocked('reward')}
                      maxLength={isLocked('reward') ? undefined : 125}
                      value={values.reward}
                      placeholder={
                        isLocked('reward') ? 'ยังไม่ระบุ' : 'เช่น รับฟรี! สินค้า จำนวน 2 ชิ้น'
                      }
                      onChange={(event) => onChange('reward', event.target.value)}
                    />
                    {renderLockHint('reward')}
                    {!isLocked('reward') && (
                      <small className="cw-counter">{values.reward.length}/125</small>
                    )}
                  </section>{' '}
                </>
              )}
            </>
          )}
          {step === 1 && (
            <>
              <section className="cw-panel">
                <h3>
                  ส่งของให้นักรีวิว <em>*</em>
                </h3>
                {renderChoices('shipping', [
                  [
                    'self',
                    'นักรีวิวต้องซื้อเอง',
                    'หากให้นักรีวิวซื้อเอง ควรบอกสถานที่หรือช่องทางสำหรับซื้อสินค้า',
                  ],
                  [
                    'team',
                    'ทีมงานส่งสินค้าให้นักรีวิว',
                    'ทีมงานสามารถอัปเดตเลขพัสดุของนักรีวิวได้ในแท็บ Influencer List',
                  ],
                  ['none', 'ไม่ต้องจัดส่ง', 'สำหรับสินค้าที่ไม่ต้องจัดส่ง เช่น แอปพลิเคชัน'],
                ])}
              </section>
              {renderRepeater('dos', 'Do', 'ขั้นตอนที่ต้องทำในแคมเปญ')}
              {renderRepeater('donts', "Don't", 'ข้อห้ามในแคมเปญ')}
              <section className="cw-panel">
                <h3>ตัวอย่างภาพรีวิว</h3>
                <p>แสดงให้นักรีวิวเห็นตัวอย่างงานในหน้ารายละเอียดแคมเปญ</p>
                {renderUpload(
                  'exampleImages',
                  'อัปโหลดภาพรีวิว',
                  'image/*',
                  'PNG, JPG, JPEG ขนาดไม่เกิน 3 MB',
                )}
              </section>
              <section className="cw-panel">
                <h3>ตัวอย่างวิดีโอรีวิว</h3>
                {renderUpload(
                  'exampleVideos',
                  'อัปโหลดวิดีโอรีวิว',
                  'video/*',
                  'ต้นแบบรองรับไฟล์ไม่เกิน 3 MB',
                )}
              </section>
            </>
          )}
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
        {step > 0 && (
          <button className="cw-back" onClick={() => handleStep(step - 1)}>
            <ArrowLeft /> ย้อนกลับ
          </button>
        )}
        <button className="cw-next" disabled>
          ต่อไป
          <CaretRight />
        </button>
      </footer>
    </main>
  );
}
function DateInput({ label, value, onChange, disabled }) {
  const [year, month, day] = value.split('-');
  return (
    <label className="field">
      <span>
        {label} <em>*</em>
      </span>
      <div className="campaign-date-input">
        <span aria-hidden="true">
          {value
            ? `${Number(day)} / ${Number(month)} / ${Number(year) + 543}`
            : disabled
              ? 'ยังไม่ระบุ'
              : 'วัน / เดือน / ปี'}
        </span>
        <span className="campaign-date-icon">
          <CalendarBlank />
        </span>
        <input
          aria-label={label}
          disabled={disabled}
          type="date"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </label>
  );
}
