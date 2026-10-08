import { PlatformLogo } from './PlatformLogo.jsx';

export function PlatformIcons({ platforms = [], size = 16 }) {
  if (!platforms.length) return null;
  return (
    <div className="flex shrink-0 items-center gap-2" aria-label="Platform">
      {platforms.map((platform) => (
        <span
          key={platform}
          className="inline-flex items-center justify-center leading-none"
          role="img"
          aria-label={platform}
          title={platform}
        >
          <PlatformLogo platform={platform} size={size} />
        </span>
      ))}
    </div>
  );
}
