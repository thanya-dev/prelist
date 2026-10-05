import { Check, Plus, Trash } from '@phosphor-icons/react';
export function Repeater({ title, subtitle, value, setValue, placeholder, validation }) {
  return (
    <section className="form-card repeater">
      <h3>{title}</h3>
      {subtitle && <p>{subtitle}</p>}
      {value.map((item, index) => (
        <div className="repeat-row" key={`${title}-${index}`}>
          <span className="drag">⠿</span>
          <b>{index + 1}.</b>
          <input
            value={item}
            onChange={(event) =>
              setValue(
                value.map((old, itemIndex) => (itemIndex === index ? event.target.value : old)),
              )
            }
            placeholder={placeholder}
          />
          {value.length > 1 && (
            <button
              onClick={() => setValue(value.filter((_, itemIndex) => itemIndex !== index))}
              aria-label="ลบ"
            >
              <Trash />
            </button>
          )}
        </div>
      ))}
      {validation && (
        <div className="validation">
          <Check /> XXX: ตัวอักษร <Check /> YYYY: ปี ค.ศ. <Check /> MM: 01-12 <Check /> NNN: 000-999
        </div>
      )}
      <button className="add-row" onClick={() => setValue([...value, ''])}>
        <Plus /> เพิ่ม{title.toLowerCase()}
      </button>
    </section>
  );
}
