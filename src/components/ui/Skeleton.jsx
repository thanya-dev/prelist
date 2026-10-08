export function Skeleton({ className = '', style = {} }) {
  return (
    <div
      className={`animate-pulse bg-slate-200 rounded ${className}`}
      style={style}
    />
  );
}
