import { Users, NotePencil, Square, CheckSquare, Circle, RadioButton } from '@phosphor-icons/react';
import { PlatformLogo } from '../../components/shared/PlatformLogo.jsx';
export const CREATOR_PLATFORM_CONTENT_TYPES = {
  TikTok: ['Post', 'Repost', 'Comment', 'Live'],
  Facebook: ['Post', 'Comment', 'Share'],
  'Facebook Page': ['Post', 'Reels', 'Live'],
  Instagram: ['Post', 'Reels', 'Story', 'Live', 'Comment'],
  YouTube: ['Post', 'Short Video', 'Live'],
  X: ['Post', 'Quote Tweet', 'Repost / Retweet', 'Reply'],
  Lemon8: ['Post'],
};

export const CONTENT_SCOPE_GROUPS = [
  { label: 'Post / Reels', types: ['Post', 'Reels', 'Video', 'Review'] },
  { label: 'Share / Quote tweet', types: ['Share', 'Quote Tweet'] },
  { label: 'Story / Short video / Live', types: ['Story', 'Short Video', 'Live'] },
  {
    label: 'Repost / Retweet / Reply / Comment',
    types: ['Repost', 'Repost / Retweet', 'Reply', 'Comment'],
  },
];
const PLATFORM_ORDER = [
  'TikTok',
  'Facebook',
  'Facebook Page',
  'Instagram',
  'YouTube',
  'X',
  'Lemon8',
];

export function CreatorCriteriaFields({
  values,
  onChange,
  onTogglePlatform,
  onSelectScope,
  errors,
  showGoals = true,
}) {
  const renderError = (key) =>
    errors[key] && (
      <small className="field-error" role="alert">
        {errors[key]}
      </small>
    );
  const renderNumber = (key, label, min = 0) => (
    <input
      aria-label={label}
      type="number"
      min={min}
      value={values[key]}
      onChange={(event) => onChange(key, event.target.value)}
    />
  );
  const renderRange = (label, minKey, maxKey, errorKey) => (
    <div className="creator-field">
      <div className="creator-label">
        {label} <b>*</b>
      </div>
      <div className="creator-range">
        <label>
          <span>MIN</span>
          {renderNumber(minKey, `${label} MIN`)}
        </label>
        <span> - </span>
        <label>
          <span>MAX</span>
          {renderNumber(maxKey, `${label} MAX`)}
        </label>
      </div>
      {renderError(errorKey)}
    </div>
  );
  return (
    <div className="creator-criteria-reference">
      {showGoals && (
        <section className="creator-panel">
          <h3>Goals</h3>
          {[
            ['target', 'Target influencer', 'จำนวนนักรีวิวทั้งหมดในแคมเปญ', 'คน', Users, 1],
            ['targetPost', 'Target post', 'จำนวนโพสต์ทั้งหมดในแคมเปญ', 'โพสต์', NotePencil, 0],
          ].map(([key, label, hint, unit, Icon, min]) => (
            <div className="creator-field" key={key}>
              <label className="creator-label" htmlFor={`creator-${key}`}>
                {label} <b>*</b>
              </label>
              <p>{hint}</p>
              <div className="creator-unit">
                <div>
                  <Icon size={18} />
                  <input
                    id={`creator-${key}`}
                    type="number"
                    min={min}
                    value={values[key]}
                    onChange={(event) => onChange(key, event.target.value)}
                  />
                </div>
                <span>{unit}</span>
              </div>
              {renderError(key)}
            </div>
          ))}
        </section>
      )}
      <section className="creator-panel">
        <label className="creator-label" htmlFor="creator-target-group">
          Target group
        </label>
        <p>บอกเป้าหมายนักรีวิวในแคมเปญ</p>
        <input
          id="creator-target-group"
          value={values.targetGroup}
          onChange={(event) => onChange('targetGroup', event.target.value)}
          placeholder="เช่น Facebook 3K or above"
        />
      </section>
      <section className="creator-panel">
        <h3>เงื่อนไขนักรีวิว</h3>
        <div className="creator-field">
          <div className="creator-label">
            เพศ <b>*</b>
          </div>
          <div className="creator-options">
            {[
              ['ชาย', 'ผู้ชาย'],
              ['หญิง', 'ผู้หญิง'],
            ].map(([value, label]) => (
              <label
                className={`creator-option ${values.genders.includes(value) ? 'is-selected' : ''}`}
                key={value}
              >
                <input
                  type="checkbox"
                  checked={values.genders.includes(value)}
                  onChange={() =>
                    onChange(
                      'genders',
                      values.genders.includes(value)
                        ? values.genders.filter((gender) => gender !== value)
                        : [...values.genders, value],
                    )
                  }
                />
                {values.genders.includes(value) ? (
                  <CheckSquare
                    aria-hidden="true"
                    weight="fill"
                    className="creator-control is-checked"
                    size={18}
                  />
                ) : (
                  <Square aria-hidden="true" className="creator-control" size={18} />
                )}
                {label}
              </label>
            ))}
          </div>
          {renderError('gender')}
        </div>
        {renderRange('อายุ', 'ageMin', 'ageMax', 'age')}
        {renderRange('ผู้ติดตาม', 'followerMin', 'followerMax', 'follower')}
      </section>
      <section className="creator-panel">
        <h3>
          ช่องทางรีวิวงาน <b>*</b>
        </h3>
        <p>เลือก Social Media ที่ต้องการให้นักรีวิว รีวิวสินค้า</p>
        <div className="creator-options creator-platforms">
          {PLATFORM_ORDER.map((platform) => (
            <label
              className={`creator-option ${values.platforms.includes(platform) ? 'is-selected' : ''}`}
              key={platform}
            >
              <input
                type="checkbox"
                checked={values.platforms.includes(platform)}
                onChange={() => onTogglePlatform(platform)}
              />
              {values.platforms.includes(platform) ? (
                <CheckSquare
                  aria-hidden="true"
                  weight="fill"
                  className="creator-control is-checked"
                  size={18}
                />
              ) : (
                <Square aria-hidden="true" className="creator-control" size={18} />
              )}
              <div>
                <div className="creator-platform-name">
                  <PlatformLogo platform={platform} />
                  {platform}
                </div>
                <small>
                  สโคปงาน:{' '}
                  <span>
                    {CREATOR_PLATFORM_CONTENT_TYPES[platform]
                      .map((type) => (type === 'Repost / Retweet' ? 'Retweet' : type))
                      .join(', ')}
                  </span>
                </small>
              </div>
            </label>
          ))}
        </div>
        {renderError('platforms')}
      </section>
      <section className="creator-panel">
        <h3>
          สโคปงาน <b>*</b>
        </h3>
        <p>เลือกสโคปงานที่ต้องการให้นักรีวิวทำ ตาม Social media ที่คุณระบุไว้</p>
        <div className="creator-options">
          {CONTENT_SCOPE_GROUPS.map((scope) => {
            const isEnabled = values.platforms.some((platform) =>
              CREATOR_PLATFORM_CONTENT_TYPES[platform]?.some((type) => scope.types.includes(type)),
            );
            return (
              <label
                className={`creator-option ${values.contentScope === scope.label ? 'is-selected' : ''} ${!isEnabled ? 'is-disabled' : ''}`}
                key={scope.label}
              >
                <input
                  type="radio"
                  name="creator-content-scope"
                  disabled={!isEnabled}
                  checked={values.contentScope === scope.label}
                  onChange={() => onSelectScope(scope)}
                />
                {values.contentScope === scope.label ? (
                  <RadioButton
                    aria-hidden="true"
                    weight="fill"
                    className="creator-control is-checked"
                    size={18}
                  />
                ) : (
                  <Circle aria-hidden="true" className="creator-control" size={18} />
                )}
                {scope.label}
              </label>
            );
          })}
        </div>
        {renderError('contentTypes')}
      </section>
    </div>
  );
}
