import { useEffect, useId, useRef, useState } from 'react';
import { CaretDown } from '@phosphor-icons/react';

export function SpecialCriteriaSelect({ values, options, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [panelStyle, setPanelStyle] = useState({});
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const searchRef = useRef(null);
  const panelId = useId();

  useEffect(() => {
    if (!isOpen) return;
    const updatePosition = () => {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom - 16;
      const spaceAbove = rect.top - 16;
      const opensAbove = spaceBelow < 240 && spaceAbove > spaceBelow;
      const maxHeight = Math.min(400, opensAbove ? spaceAbove : spaceBelow);
      setPanelStyle({
        position: 'fixed',
        left: rect.left,
        width: rect.width,
        maxHeight,
        ...(opensAbove ? { bottom: window.innerHeight - rect.top + 8 } : { top: rect.bottom + 8 }),
        zIndex: 80,
      });
    };
    const handleOutsideClick = (event) => {
      if (!containerRef.current?.contains(event.target)) setIsOpen(false);
    };
    updatePosition();
    searchRef.current?.focus();
    window.addEventListener('resize', updatePosition);
    document.addEventListener('scroll', updatePosition, true);
    document.addEventListener('pointerdown', handleOutsideClick);
    return () => {
      window.removeEventListener('resize', updatePosition);
      document.removeEventListener('scroll', updatePosition, true);
      document.removeEventListener('pointerdown', handleOutsideClick);
    };
  }, [isOpen]);
  const availableOptions = [...new Set([...options, ...values])];
  const filteredOptions = availableOptions.filter((option) =>
    option.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()),
  );
  return (
    <div
      ref={containerRef}
      className="grid gap-2"
      onKeyDown={(event) => {
        if (isOpen && event.key === 'Escape') {
          event.stopPropagation();
          event.preventDefault();
          setIsOpen(false);
          triggerRef.current?.focus();
        }
      }}
    >
      <span className="announcement-field-label">Special Criteria</span>
      <button
        ref={triggerRef}
        type="button"
        aria-label="Special Criteria"
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-2 rounded-md border border-solid border-[#dce4ee] bg-white p-3 text-left"
        onClick={() => {
          setSearch('');
          setIsOpen(!isOpen);
        }}
      >
        <span>
          {values.length ? `เลือกแล้ว ${values.length} รายการ` : 'เลือกคุณสมบัติ (เลือกได้หลายข้อ)'}
        </span>
        <CaretDown />
      </button>
      {isOpen && (
        <div
          id={panelId}
          style={panelStyle}
          className="box-border flex flex-col gap-3 overflow-hidden rounded-md border border-solid border-[#dce4ee] bg-white p-3 shadow-xl"
        >
          <input
            ref={searchRef}
            type="search"
            aria-label="ค้นหา Special Criteria"
            placeholder="ค้นหาคุณสมบัตินักรีวิว..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full shrink-0 rounded-md border border-solid border-[#dce4ee] px-3 py-2 text-base leading-6"
          />
          <div
            className="grid min-h-0 gap-1 overflow-y-auto"
            role="group"
            aria-label="รายการคุณสมบัตินักรีวิว"
          >
            {filteredOptions.map((option) => (
              <label
                key={option}
                className="flex min-h-12 cursor-pointer items-start gap-3 rounded px-3 py-3 text-base leading-6 hover:bg-[#f7f9fb]"
              >
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 shrink-0"
                  checked={values.includes(option)}
                  onChange={() =>
                    onChange(
                      values.includes(option)
                        ? values.filter((value) => value !== option)
                        : [...values, option],
                    )
                  }
                />
                <span className="break-words">{option}</span>
              </label>
            ))}
            {filteredOptions.length === 0 && (
              <p className="px-3 py-4 text-base text-[#6b7280]" role="status">
                ไม่พบคุณสมบัติที่ค้นหา
              </p>
            )}
          </div>
        </div>
      )}
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {values.map((value) => (
            <button
              key={value}
              type="button"
              aria-label={`ลบคุณสมบัติ ${value}`}
              className="max-w-full rounded bg-[#eff6ff] px-3 py-2 text-left text-sm text-[#2563eb] break-words"
              onClick={() => onChange(values.filter((entry) => entry !== value))}
            >
              {value} ×
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
