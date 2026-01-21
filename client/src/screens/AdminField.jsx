// AdminField.jsx
export default function AdminField({ field, value, dirty, onChange, onSave }) {
  const isTextarea = field.type === "textarea";

  return (
    <div className="adminField">
      <div className="adminFieldTop">
        <label className="adminLabel">{field.label}</label>
        {dirty ? <span className="adminDirty">edited</span> : null}
      </div>

      {isTextarea ? (
        <textarea
          className="adminTextarea"
          rows={field.rows || 6}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className="adminInput"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      <button
        className="adminSave"
        onClick={onSave}
        type="button"
        disabled={!dirty}
        title={dirty ? "save changes" : "no changes to save"}
      >
        save
      </button>
    </div>
  );
}
