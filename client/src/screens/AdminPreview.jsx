// AdminPreview.jsx
export default function AdminPreview({ active, content, currentSection }) {
  function val(key) {
    return (content?.[key] ?? "").toString();
  }

  return (
    <aside className="adminPreview">
      <div className="adminPreviewCard">
        <div className="adminPreviewHead">
          <div className="adminPreviewTitle">preview</div>
          <div className="adminPreviewSub">how this reads on the site</div>
        </div>

        {active === "home" ? (
          <div className="adminPreviewBody">
            <div className="adminPreviewKicker">home hero</div>
            <div className="adminPreviewH1">{val("home.hero.title") || "—"}</div>
            <div className="adminPreviewP">{val("home.hero.subtitle") || "—"}</div>
          </div>
        ) : null}

        {active === "about" ? (
          <div className="adminPreviewBody">
            <div className="adminPreviewKicker">about</div>
            <div className="adminPreviewP preWrap">{val("about.text") || "—"}</div>
          </div>
        ) : null}

        {active === "services" ? (
          <div className="adminPreviewBody">
            <div className="adminPreviewKicker">services</div>

            {(val("services.list") || "")
              ? (val("services.list") || "")
                  .split(/[\n,]+/g)
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .slice(0, 12)
                  .map((s, i) => (
                    <div key={i} className="adminPreviewChip">
                      {s}
                    </div>
                  ))
              : "—"}

            <div className="adminPreviewHint">tip: separate items with commas or new lines</div>
          </div>
        ) : null}
      </div>

      <div className="adminPreviewCard">
        <div className="adminPreviewHead">
          <div className="adminPreviewTitle">details</div>
          <div className="adminPreviewSub">keys + character counts</div>
        </div>

        <div className="adminMeta">
          {currentSection.fields.map((f) => (
            <div key={f.key} className="adminMetaRow">
              <div className="adminMetaKey">{f.key}</div>
              <div className="adminMetaVal">{val(f.key).length} chars</div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
