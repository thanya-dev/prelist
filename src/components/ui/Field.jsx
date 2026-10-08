export const Field = ({ label, required, children, hint, error }) => (
  <label className="field gap-2">
    <span>
      {label} {required && <b className="text-[#f05b60]">*</b>}
    </span>
    {hint && <small>{hint}</small>}
    {children}
    {error && <small className="field-error text-[#f05b60] mt-1">{error}</small>}
  </label>
);
