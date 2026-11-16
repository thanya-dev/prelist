import { ArrowSquareOut, CaretDown, GenderFemale, GenderMale } from '@phosphor-icons/react';
import { INFLUENCER_PROFILE_URL } from './influencerProfiles.js';

/**
 * Header for one Influencer profile group on the reviewer list, or for the shared
 * "no Influencer profile" group when `group.profile` is null. Group-wide decisions go through
 * the header checkbox and the floating selection toolbar; the profile name links to the profile.
 * `checkState` is 'all' | 'some' | 'none'.
 */
export function InfluencerGroupHeader({
  group,
  isExpanded,
  checkState,
  isCheckDisabled,
  onToggleExpanded,
  onToggleCheck,
}) {
  const { profile } = group;
  const groupName = profile ? profile.name : 'ไม่มี Influencer Profile';
  return (
    // Clicking anywhere on the header toggles the group; the checkbox, profile link and caret
    // button keep their own behavior (the caret stays the keyboard-accessible control).
    <div
      className={`influencer-group-header ${profile ? '' : 'is-unprofiled'}`}
      onClick={(event) => {
        if (!event.target.closest('a, input, button')) onToggleExpanded();
      }}
    >
      <input
        type="checkbox"
        aria-label={`เลือกทุก social ของ ${groupName}`}
        checked={checkState === 'all'}
        ref={(element) => {
          if (element) element.indeterminate = checkState === 'some';
        }}
        disabled={isCheckDisabled}
        onChange={onToggleCheck}
      />
      <div className="influencer-group-identity">
        {profile ? (
          <a
            className="influencer-group-name influencer-profile-link"
            href={INFLUENCER_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`เปิดโปรไฟล์ ${profile.name} ในแท็บใหม่`}
          >
            <strong>{profile.name}</strong>
            <ArrowSquareOut size={14} aria-hidden="true" />
          </a>
        ) : (
          <strong className="influencer-group-name">{groupName}</strong>
        )}
        <div className="influencer-group-meta">
          {profile ? (
            <span className="influencer-group-demo">
              {profile.gender === 'MALE' ? (
                <GenderMale weight="bold" size={14} />
              ) : profile.gender === 'FEMALE' ? (
                <GenderFemale weight="bold" size={14} />
              ) : null}
              {profile.gender || '-'} · {profile.age === '' ? '-' : `${profile.age} ปี`}
            </span>
          ) : (
            <span>Social ที่ยังไม่ผูกกับ Influencer Profile</span>
          )}
        </div>
      </div>
      <button
        type="button"
        className={`influencer-group-toggle ${isExpanded ? '' : 'is-collapsed'}`}
        aria-expanded={isExpanded}
        aria-label={`${isExpanded ? 'หุบ' : 'กาง'} social ของ ${groupName}`}
        onClick={onToggleExpanded}
      >
        <CaretDown size={16} weight="bold" />
      </button>
    </div>
  );
}
