export function InputField({
  id,
  label,
  tooltip,
  value,
  onChange,
  placeholder = "0.00",
  prefix = "$",
  type = "number",
}) {
  return (
    <label className="field" htmlFor={id}>
      <span className="field-title">
        {label}
        {tooltip ? (
          <span className="field-tip" title={tooltip} aria-label={tooltip}>
            ?
          </span>
        ) : null}
      </span>
      <div className="field-input-wrap">
        <span className="field-prefix">{prefix}</span>
        <input
          id={id}
          className="field-input"
          type={type}
          min="0"
          step="any"
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
        />
      </div>
    </label>
  );
}
