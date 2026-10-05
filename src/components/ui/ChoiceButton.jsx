import { CheckCircle } from '@phosphor-icons/react';
export function ChoiceButton({ selected, onClick, children, className = '', ariaLabel }) {
  return (
    <button
      type="button"
      aria-label={ariaLabel ?? (typeof children === 'string' ? children : undefined)}
      aria-pressed={selected}
      className={`choice-button ${selected ? 'selected' : ''} ${className}`}
      onClick={onClick}
    >
      {selected && <CheckCircle weight="fill" />}
      {children}
    </button>
  );
}
