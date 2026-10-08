const PLATFORM_LOGOS = {
  instagram: 'Instagram.png',
  tiktok: 'Tiktok.png',
  facebook: 'Facebook.png',
  facebookpage: 'FB Page.png',
  fbpage: 'FB Page.png',
  youtube: 'Youtube.png',
  lemon8: 'Lemon8.png',
  twitter: 'Twitter.png',
  x: 'x.png',
};

export function PlatformLogo({ platform, size = 24 }) {
  const logo =
    PLATFORM_LOGOS[
      String(platform || '')
        .toLowerCase()
        .replace(/[\s_-]/g, '')
    ];
  if (!logo) return null;
  return (
    <img
      src={`/assets/social/${encodeURIComponent(logo)}`}
      alt=""
      aria-hidden="true"
      className="inline-block shrink-0 rounded-full object-contain align-middle"
      width={size}
      height={size}
      style={{ width: size, height: size }}
    />
  );
}
