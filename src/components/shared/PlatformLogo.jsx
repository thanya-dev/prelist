import { FacebookLogo, InstagramLogo, TiktokLogo, YoutubeLogo, XLogo } from '@phosphor-icons/react';

const PLATFORM_LOGOS = {
  TikTok: { icon: TiktokLogo, background: '#111111', color: '#ffffff' },
  Instagram: {
    icon: InstagramLogo,
    background: 'linear-gradient(135deg, #833ab4, #e1306c, #fcb045)',
    color: '#ffffff',
  },
  Facebook: { icon: FacebookLogo, background: '#1877f2', color: '#ffffff' },
  'Facebook Page': { icon: FacebookLogo, background: '#1877f2', color: '#ffffff' },
  YouTube: { icon: YoutubeLogo, background: '#ff0000', color: '#ffffff' },
  Lemon8: { background: '#ffef00', color: '#111111' },
  X: { icon: XLogo, background: '#111111', color: '#ffffff' },
};

export function PlatformLogo({ platform }) {
  const logo = PLATFORM_LOGOS[platform];
  if (!logo) return null;
  const Icon = logo.icon;
  return (
    <span
      aria-hidden="true"
      className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
      style={{ background: logo.background, color: logo.color }}
    >
      {Icon ? (
        <Icon size={16} weight="fill" style={{ color: logo.color }} />
      ) : (
        <span className="text-[7px] font-bold">Lemon8</span>
      )}
    </span>
  );
}
