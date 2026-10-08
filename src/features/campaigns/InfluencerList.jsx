import { PlatformLogo } from '../../components/shared/PlatformLogo.jsx';
import { useState } from 'react';
import {
  ArrowSquareOut,
  CalendarBlank,
  CaretDown,
  Check,
  CurrencyDollar,
  LinkSimple,
  List,
  MagnifyingGlass,
  NotePencil,
  Plus,
  Sparkle,
  SquaresFour,
  UploadSimple,
  User,
  X,
  ChatCircle,
} from '@phosphor-icons/react';
import { getJobPostings } from '../job-postings/jobPostingApi.js';
import { PRELIST_REVIEWERS } from '../projects/prelistSeeds.js';
export function InfluencerList() {
  const [query, setQuery] = useState('');
  const [platforms, setPlatforms] = useState([]);
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [hiddenColumns, setHiddenColumns] = useState([]);
  const [notice, setNotice] = useState('');
  const [importOpen, setImportOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [importMode, setImportMode] = useState('brief');
  const [briefId, setBriefId] = useState('');
  const [briefResults, setBriefResults] = useState(null);
  const [briefSelection, setBriefSelection] = useState([]);
  const findBriefInfluencers = () => {
    const job = getJobPostings().find(
      (item) => item.brief.toLowerCase() === briefId.trim().toLowerCase(),
    );
    if (!job) {
      setBriefResults(null);
      setImportError('ไม่พบ Brief ID นี้ในระบบ');
      return;
    }
    let decisions = {};
    try {
      decisions = JSON.parse(localStorage.getItem('buddy-reviewer-decisions')) || {};
    } catch {}
    const candidates = PRELIST_REVIEWERS.filter(
      (item, index) => index % 2 === 0 && decisions[`${job.id}:${item.id}`]?.status !== 'Reject',
    ).map((item) => ({
      name: item.username,
      platform: {
        instagram: 'Instagram',
        tiktok: 'Tiktok',
        facebook: 'Facebook',
      }[item.platform],
      followers: String(item.followers),
      image: item.images[0],
    }));
    const available = candidates.filter(
      (item) =>
        !accounts.some(
          (existing) =>
            existing.name.toLowerCase() === item.name.toLowerCase() &&
            existing.platform === item.platform,
        ),
    );
    setBriefResults({
      job,
      available,
      skipped: candidates.length - available.length,
    });
    setBriefSelection(available.map((item) => `${item.platform}:${item.name}`));
    setImportError(
      available.length
        ? ''
        : 'ไม่มีนักรีวิวที่ลูกค้าเลือกแล้วให้ Import หรือรายชื่อมีอยู่ในแคมเปญแล้ว',
    );
  };
  const [importError, setImportError] = useState('');
  const [importedAccounts, setImportedAccounts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('campaign-imported-influencers')) || [];
    } catch {
      return [];
    }
  });
  const seedAccounts = [
    {
      name: 'AOMMTH',
      platform: 'Youtube',
      followers: '5',
      budget: '500',
      email: 'aom.thanya@hotmail.com',
      phone: '0882337749',
      avatar: 'a',
      color: '#ff541c',
    },
    {
      name: 'AOMMTHZ',
      platform: 'Instagram',
      followers: '412',
      email: 'aom.thanya@hotmail.com',
      phone: '0882337749',
      avatar: '🐱',
    },
    {
      name: 'AUNGISHAPPY',
      platform: 'Tiktok',
      followers: '4,254',
      image: PRELIST_REVIEWERS[1].images[0],
    },
    {
      name: 'BUDDYREVIEW_TH',
      platform: 'Instagram',
      followers: '3,684',
      budget: '50,000',
      avatar: 'bdy',
      color: '#4328d6',
    },
    {
      name: 'BUDDYREVIEW.TH',
      platform: 'Tiktok',
      followers: '21,892',
      budget: '50,000',
      avatar: 'bdy',
      color: '#4328d6',
    },
    {
      name: 'CANNAPJ',
      platform: 'Tiktok',
      followers: '204,823',
      email: 'Cnpj2009@gmail.com',
      phone: '0946593399',
      line: 'cannnnaa',
      image: PRELIST_REVIEWERS[3].images[0],
    },
  ];
  const accounts = [...seedAccounts, ...importedAccounts];
  const importInfluencers = () => {
    if (importMode === 'brief') {
      const added =
        briefResults?.available.filter((item) =>
          briefSelection.includes(`${item.platform}:${item.name}`),
        ) || [];
      if (!added.length) {
        setImportError('ค้นหา Brief ID และเลือกรายชื่อก่อน Import');
        return;
      }
      const next = [...importedAccounts, ...added];
      localStorage.setItem('campaign-imported-influencers', JSON.stringify(next));
      setImportedAccounts(next);
      setImportOpen(false);
      setQuery('');
      setPlatforms([]);
      setNotice(`Import จาก Brief ${briefResults.job.brief} จำนวน ${added.length} คนเรียบร้อยแล้ว`);
      setBriefResults(null);
      setBriefSelection([]);
      return;
    }
    const rows = importText
      .replace(/^\uFEFF/, '')
      .trim()
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => line.split(/[\t,]/).map((cell) => cell.trim().replace(/^"|"$/g, '')))
      .filter((row, index) => !(index === 0 && /^(username|name)$/i.test(row[0])));
    if (!rows.length) {
      setImportError('กรุณาเพิ่มรายชื่อ');
      return;
    }
    const seen = new Set(
      accounts.map((item) => `${item.platform.toLowerCase()}:${item.name.toLowerCase()}`),
    );
    const added = [];
    for (const [index, [name, platform]] of rows.entries()) {
      const validPlatform = [
        'Instagram',
        'Facebook',
        'FacebookPage',
        'Twitter',
        'Youtube',
        'Tiktok',
        'Lemon8',
      ].find((p) => p.toLowerCase() === platform?.toLowerCase());
      if (!name || !validPlatform) {
        setImportError(`แถว ${index + 1}: ระบุ Username และ Platform ให้ถูกต้อง`);
        return;
      }
      const key = `${validPlatform.toLowerCase()}:${name.toLowerCase()}`;
      if (seen.has(key)) {
        setImportError(`รายชื่อซ้ำ: ${name}`);
        return;
      }
      seen.add(key);
      added.push({
        name,
        platform: validPlatform,
        followers: '—',
        avatar: name[0],
        color: '#4328d6',
      });
    }
    const next = [...importedAccounts, ...added];
    localStorage.setItem('campaign-imported-influencers', JSON.stringify(next));
    setImportedAccounts(next);
    setImportOpen(false);
    setImportText('');
    setQuery('');
    setPlatforms([]);
    setNotice(`Import Influencer ${added.length} คนเรียบร้อยแล้ว`);
  };
  const columnNames = [
    'Social Account',
    'Note',
    'Budget',
    'Followers/ Subscribers',
    'Contact',
    'Point',
    'Due Date',
    'Payment',
    'Paid',
    'Confirmed',
    'Status',
    'Content Idea',
    'Draft',
    'Content',
    'Comment',
    'Stat',
    'Edit',
    'Leave',
    'Socials',
  ];
  const shown = accounts.filter(
    (item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) &&
      (!platforms.length || platforms.includes(item.platform)),
  );
  const exportRows = () => {
    const csv =
      '\uFEFFSocial Account,Platform,Followers,Budget\r\n' +
      shown
        .map((item) =>
          [item.name, item.platform, item.followers, item.budget || '']
            .map((v) => `"${v}"`)
            .join(','),
        )
        .join('\r\n');
    const url = URL.createObjectURL(
      new Blob([csv], {
        type: 'text/csv;charset=utf-8',
      }),
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = 'approved-influencers.csv';
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const action = (label, item, icon, extra = '') => (
    <button
      className={`approved-icon ${extra}`}
      aria-label={`${label} ${item.name}`}
      onClick={() => setNotice(`${label}: ${item.name}`)}
    >
      {icon}
    </button>
  );
  return (
    <section className="confirm-list-panel pt-6 pb-16 text-[#484848]">
      <div className="confirm-list-actions flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap items-center gap-4 min-w-0">
          <h2 className="m-0 mr-2 text-xl font-bold">CONFIRM LIST</h2>
          <a
            className="reviewer-confirmed-link"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#4f46e5',
              fontWeight: 'bold',
              textDecoration: 'none',
              fontSize: '14px',
            }}
            href="https://claude.ai/artifact/8KepmjLCRHFnrS1UymmkMF?sk=uqAPxJo4shj0XPax0LAx3A"
            target="_blank"
            rel="noopener noreferrer"
          >
            ยืนยันรับงานแล้ว <ArrowSquareOut size={15} />
          </a>
        </div>
        <button
          className="inline-flex items-center gap-1 text-sm bg-[#e9e6ff] text-[#6545ff] p-2 rounded hover:bg-[#d8d2ff] transition-colors"
          aria-label="List view"
        >
          <List weight="bold" size={20} />
        </button>
        <button
          className="inline-flex items-center gap-1 text-sm text-[#7f8ca4] p-2 rounded hover:bg-[#f4f4f5] transition-colors"
          aria-label="Grid view"
          onClick={() => setNotice('แสดงรายชื่อในมุมมองตาราง')}
        >
          <SquaresFour weight="fill" size={20} />
        </button>
        <button
          className="inline-flex items-center gap-2 text-sm text-[#7f8ca4] px-3 py-2 rounded border border-[#dce4ee] hover:bg-[#f4f4f5] transition-colors"
          onClick={exportRows}
        >
          <UploadSimple weight="fill" /> Export
        </button>
        <button
          className="inline-flex items-center gap-2 text-sm text-[#7f8ca4] px-3 py-2 rounded border border-[#dce4ee] hover:bg-[#f4f4f5] transition-colors"
          onClick={() => setNotice('External payment')}
        >
          <CurrencyDollar /> External payment
        </button>
        <button
          className="sm:ml-auto inline-flex items-center gap-2 text-sm font-semibold text-white bg-[#6545ff] px-5 py-2 rounded-lg hover:shadow-lg hover:-translate-y-[1px] transition-all"
          onClick={() => {
            setImportOpen(true);
            setImportError('');
          }}
        >
          <UploadSimple size={18} /> Import Influencer
        </button>
        <button
          className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-[#6545ff] px-5 py-2 rounded-lg hover:shadow-lg hover:-translate-y-[1px] transition-all"
          onClick={() => setNotice('เลือกนักรีวิวจากตารางเพื่อจัดการลิงก์โพสต์')}
        >
          <LinkSimple size={18} /> Import post
        </button>
      </div>
      <div className="grid grid-cols-1 min-[500px]:grid-cols-3 gap-4 sm:gap-6 mt-6 mb-2">
        <div>
          <strong className="block text-[28px] font-bold leading-tight">
            {31 + importedAccounts.length}
          </strong>
          <span className="block text-sm leading-snug mt-1 text-[#7f8ca4]">
            TOTAL
            <br />
            ACCOUNT
          </span>
        </div>
        <div>
          <strong className="block text-[28px] font-bold leading-tight">156,467</strong>
          <span className="block text-sm leading-snug mt-1 text-[#7f8ca4]">
            TOTAL ESTIMATED
            <br />
            REACH
          </span>
        </div>
        <div>
          <strong className="block text-[28px] font-bold leading-tight">9,124,022</strong>
          <span className="block text-sm leading-snug mt-1 text-[#7f8ca4]">
            TOTAL ESTIMATED
            <br />
            FOLLOWER
          </span>
        </div>
      </div>
      <p className="mt-1 mb-6 text-sm text-[#7f8ca4]">
        IG - <b className="text-[#273348]">5</b> │ FB - <b className="text-[#273348]">3</b> │ PAGE -{' '}
        <b className="text-[#273348]">5</b> │ twitter - <b className="text-[#273348]">4</b> │ yt -{' '}
        <b className="text-[#273348]">4</b> │ tiktok - <b className="text-[#273348]">7</b> │ lemon8
        - <b className="text-[#273348]">3</b>
      </p>
      <div className="px-3">
        <div className="relative w-[210px]">
          <button
            className="w-full flex justify-between items-center p-3 border border-[#bbb] rounded text-sm font-semibold text-[#484848]"
            onClick={() => setColumnsOpen(!columnsOpen)}
          >
            Display Columns <CaretDown className="text-[#6545ff]" />
          </button>
          {columnsOpen && (
            <div className="absolute z-10 top-[48px] bg-white p-4 shadow-lg w-[230px] max-h-[300px] overflow-auto border border-[#e5e7eb] rounded-md">
              {columnNames.slice(1).map((name) => (
                <label
                  key={name}
                  className="flex items-center gap-2 mb-2 text-sm cursor-pointer hover:text-[#6545ff]"
                >
                  <input
                    type="checkbox"
                    className="accent-[#6545ff] w-4 h-4 cursor-pointer"
                    checked={!hiddenColumns.includes(name)}
                    onChange={() =>
                      setHiddenColumns((current) =>
                        current.includes(name)
                          ? current.filter((v) => v !== name)
                          : [...current, name],
                      )
                    }
                  />
                  {name}
                </label>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-4 mt-4 mb-6">
          {['Instagram', 'Facebook', 'FacebookPage', 'Twitter', 'Youtube', 'Tiktok', 'Lemon8'].map(
            (name) => (
              <label
                key={name}
                className="flex items-center gap-2 text-sm cursor-pointer hover:text-[#6545ff]"
              >
                <input
                  type="checkbox"
                  className="accent-[#6545ff] w-[18px] h-[18px] cursor-pointer"
                  checked={platforms.includes(name)}
                  onChange={() =>
                    setPlatforms((current) =>
                      current.includes(name)
                        ? current.filter((v) => v !== name)
                        : [...current, name],
                    )
                  }
                />
                <PlatformLogo platform={name} size={20} />
                {name}
              </label>
            ),
          )}
        </div>
        <div className="flex flex-wrap justify-between items-center gap-3">
          <label className="flex items-center gap-2 p-2 bg-white border border-[#dce4ee] rounded-md w-full max-w-[320px] focus-within:border-[#6545ff] focus-within:ring-2 focus-within:ring-[#6545ff]/20 transition-all">
            <input
              className="min-w-0 flex-1 border-none outline-none text-[#273348] placeholder-[#7f8ca4] text-sm px-2"
              placeholder="Search by Username"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <MagnifyingGlass className="text-[#7f8ca4]" size={20} />
          </label>
          <button
            className="flex items-center gap-2 bg-[#6545ff] text-white text-sm font-semibold py-2 px-6 rounded-md hover:shadow-lg hover:-translate-y-[1px] transition-all whitespace-nowrap"
            onClick={() => setNotice('อัปเดตความคิดเห็นเรียบร้อยแล้ว')}
          >
            <LinkSimple size={18} /> Update comments
          </button>
        </div>
      </div>
      {notice && (
        <p className="approved-notice" role="status">
          {notice}
          <button onClick={() => setNotice('')} aria-label="ปิดข้อความ">
            <X />
          </button>
        </p>
      )}
      <div className="approved-table-wrap">
        <table className="approved-table">
          <thead>
            <tr>
              {columnNames
                .filter((name) => !hiddenColumns.includes(name))
                .map((name) => (
                  <th key={name}>{name}</th>
                ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((item, index) => {
              const cells = [
                <div className="approved-account">
                  <span
                    className="approved-avatar"
                    style={{
                      background: item.color || '#e7e3dd',
                    }}
                  >
                    {item.image ? <img src={item.image} alt="" /> : item.avatar}
                  </span>
                  <div>
                    <b>
                      <PlatformLogo platform={item.platform} size={20} />
                      {item.name}
                    </b>
                    {action('Chat', item, <ChatCircle />, 'approved-chat purple')}
                  </div>
                </div>,
                action('Note', item, <NotePencil weight="fill" />),
                <div className="approved-budget">
                  {action(
                    'Budget',
                    item,
                    <CurrencyDollar weight="fill" />,
                    item.budget ? 'purple' : '',
                  )}
                  <b>{item.budget}</b>
                </div>,
                <span>
                  <User weight="fill" /> {item.followers}
                </span>,
                item.email ? (
                  <div className="approved-contact">
                    {item.line && <span>▣ {item.line}</span>}
                    <span>✉ {item.email}</span>
                    <span>☎ {item.phone}</span>
                  </div>
                ) : (
                  <span className="approved-unregistered">NOT REGISTER</span>
                ),
                index === 0 ? (
                  <small>
                    OFFER
                    <br />
                    <b>0</b>
                  </small>
                ) : (
                  '-'
                ),
                action(
                  'Due date',
                  item,
                  <>
                    <NotePencil /> Edit
                  </>,
                ),
                action('Payment', item, <CurrencyDollar weight="fill" />, 'purple'),
                action('Paid', item, <CurrencyDollar weight="fill" />),
                action('Confirmed', item, <Check weight="bold" />),
                action(
                  'Status',
                  item,
                  <CalendarBlank weight="fill" />,
                  index === 0 ? 'orange' : 'muted',
                ),
                action(
                  'Content idea',
                  item,
                  <Sparkle weight="fill" />,
                  index === 0 ? 'blue' : 'muted',
                ),
                action(
                  'Draft',
                  item,
                  <List weight="fill" />,
                  index === 0 || index === 3 ? 'orange' : '',
                ),
                action('Content', item, <LinkSimple weight="bold" />, index === 0 ? 'purple' : ''),
                <button
                  className="approved-comment"
                  onClick={() => setNotice(`เพิ่มความคิดเห็น: ${item.name}`)}
                >
                  <Plus /> เพิ่ม
                </button>,
                action('Stat', item, <Sparkle weight="fill" />, index === 0 ? 'purple' : 'muted'),
                action('Edit', item, <NotePencil weight="fill" />),
                action('Leave', item, <X weight="bold" />),
                action('Socials', item, <ArrowSquareOut />),
              ];
              return (
                <tr key={item.name}>
                  {cells.map((cell, cellIndex) =>
                    hiddenColumns.includes(columnNames[cellIndex]) ? null : (
                      <td key={columnNames[cellIndex]}>{cell}</td>
                    ),
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
        {!shown.length && <p className="approved-empty">ไม่พบนักรีวิว</p>}
      </div>
      {importOpen && (
        <div className="modal-backdrop" onClick={() => setImportOpen(false)}>
          <section
            className="reviewer-profile-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Import Influencer"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="secondary-button"
              onClick={() => setImportOpen(false)}
              aria-label="ปิด Import"
            >
              <X />
            </button>
            <h2>Import Influencer</h2>
            <div className="reviewer-add-tabs">
              <button
                className={importMode === 'brief' ? 'primary' : 'secondary-button'}
                onClick={() => {
                  setImportMode('brief');
                  setImportError('');
                }}
              >
                จาก Brief ID
              </button>
              <button
                className={importMode === 'csv' ? 'primary' : 'secondary-button'}
                onClick={() => {
                  setImportMode('csv');
                  setImportError('');
                }}
              >
                จาก CSV
              </button>
            </div>
            <div className="reviewer-add-fields">
              {importMode === 'brief' ? (
                <>
                  <p>นำเข้านักรีวิวที่ลูกค้าเลือกแล้วจากประกาศที่เชื่อมกับ Brief</p>
                  <label>
                    Brief ID
                    <input
                      value={briefId}
                      onChange={(event) => {
                        setBriefId(event.target.value);
                        setBriefResults(null);
                        setBriefSelection([]);
                        setImportError('');
                      }}
                      placeholder="เช่น NRI202609058"
                    />
                  </label>
                  <button className="secondary-button" onClick={findBriefInfluencers}>
                    ค้นหา Brief
                  </button>
                  {briefResults && (
                    <div className="reviewer-upload-preview">
                      <strong>{briefResults.job.name}</strong>
                      <p>
                        พร้อม Import {briefResults.available.length} คน · มีในแคมเปญแล้ว{' '}
                        {briefResults.skipped} คน
                      </p>
                      {briefResults.available.map((item) => {
                        const key = `${item.platform}:${item.name}`;
                        return (
                          <label
                            key={key}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <input
                              style={{
                                width: 'auto',
                              }}
                              type="checkbox"
                              checked={briefSelection.includes(key)}
                              onChange={() =>
                                setBriefSelection((current) =>
                                  current.includes(key)
                                    ? current.filter((value) => value !== key)
                                    : [...current, key],
                                )
                              }
                            />
                            {item.name} · {item.platform}
                          </label>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <p>อัปโหลด CSV/TSV หรือวางรายชื่อ: username, platform</p>
                  <a
                    download="campaign-influencers-template.csv"
                    href={
                      'data:text/csv;charset=utf-8,' +
                      encodeURIComponent('username,platform\ncreator.name,Instagram\n')
                    }
                  >
                    ดาวน์โหลดไฟล์ตัวอย่าง CSV
                  </a>
                  <label>
                    ไฟล์รายชื่อ
                    <input
                      type="file"
                      accept=".csv,.tsv"
                      onChange={async (event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          setImportText(await file.text());
                          setImportError('');
                        }
                      }}
                    />
                  </label>
                  <label>
                    รายชื่อ
                    <textarea
                      value={importText}
                      onChange={(event) => setImportText(event.target.value)}
                      placeholder={'username,platform\ncreator.name,Instagram'}
                    />
                  </label>
                  <small>Instagram, Facebook, FacebookPage, Twitter, Youtube, Tiktok, Lemon8</small>
                </>
              )}
              {importError && (
                <p className="field-error" role="alert">
                  {importError}
                </p>
              )}
            </div>
            <div className="reviewer-add-tabs">
              <button className="secondary-button" onClick={() => setImportOpen(false)}>
                ยกเลิก
              </button>
              <button className="primary" onClick={importInfluencers}>
                Import Influencer{importMode === 'brief' ? ` (${briefSelection.length})` : ''}
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
