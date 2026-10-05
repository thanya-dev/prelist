export const Field = ({ label, required, children, hint }) => (
  <label className="field gap-2">
    <span>
      {label} {required && <b>*</b>}
    </span>
    {hint && <small>{hint}</small>}
    {children}
  </label>
);
