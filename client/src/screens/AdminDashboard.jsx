import { useEffect, useMemo, useState } from "react";
import "./dashboard.css";

const API = "http://localhost:4000";

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function AdminDashboard() {
  const [content, setContent] = useState(null);
  const [initialContent, setInitialContent] = useState(null); // snapshot for dirty-check
  const [status, setStatus] = useState("");
  const [active, setActive] = useState("home"); // "home" | "about" | "services"

  const sections = useMemo(
    () => [
      {
        id: "home",
        title: "home",
        description: "hero content shown on the homepage",
        fields: [
          { key: "home.hero.title", label: "home hero title", type: "text" },
          { key: "home.hero.subtitle", label: "home hero subtitle", type: "text" },
        ],
      },
      {
        id: "about",
        title: "about",
        description: "about section content",
        fields: [{ key: "about.text", label: "about text", type: "textarea", rows: 7 }],
      },
      {
        id: "services",
        title: "services",
        description: "services shown on the site",
        fields: [{ key: "services.list", label: "services list", type: "text" }],
      },
    ],
    []
  );

  const currentSection = sections.find((s) => s.id === active) || sections[0];

  useEffect(() => {
    (async () => {
      const res = await fetch(`${API}/content`);
      const data = await res.json();
      setContent(data);
      setInitialContent(data); // store snapshot once loaded
    })();
  }, []);

  if (!localStorage.getItem("token")) {
    return (
      <div className="adminPage">
        <div className="adminWrap">not logged in</div>
      </div>
    );
  }

  if (!content || !initialContent) {
    return (
      <div className="adminPage">
        <div className="adminWrap">loading…</div>
      </div>
    );
  }

  function isDirty(key) {
    const a = (content[key] ?? "").toString();
    const b = (initialContent[key] ?? "").toString();
    return a !== b;
  }

  function setField(key, value) {
    setContent((prev) => ({ ...prev, [key]: value }));
  }

  async function save(key) {
    if (!isDirty(key)) return;

    setStatus(`saving ${key}…`);

    const res = await fetch(`${API}/content/${encodeURIComponent(key)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({ value: content[key] || "" }),
    });

    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error || "save failed");
      return;
    }

    // update snapshot for this key (mark clean)
    setInitialContent((prev) => ({ ...prev, [key]: content[key] || "" }));

    setStatus("saved ✅");
    setTimeout(() => setStatus(""), 1200);
  }

  function logout() {
    localStorage.removeItem("token");
    window.location.reload();
  }

  function renderField(field) {
    const value = content[field.key] || "";

    if (field.type === "textarea") {
      return (
        <textarea
          className="adminTextarea"
          rows={field.rows || 6}
          value={value}
          onChange={(e) => setField(field.key, e.target.value)}
        />
      );
    }

    return (
      <input
        className="adminInput"
        value={value}
        onChange={(e) => setField(field.key, e.target.value)}
      />
    );
  }

  return (
    <div className="adminPage">
      <div className="adminGlow" />

      <div className="adminWrap">
        <div className="adminHeaderCard">
          <div>
            <h2 className="adminTitle">admin dashboard</h2>
            <p className="adminSub">edit content and save to database</p>
          </div>
          <button className="adminLogout" onClick={logout}>
            logout
          </button>
        </div>

        <div className="adminLayout">
          <aside className="adminSidebar">
            <div className="adminSidebarTitle">sections</div>

            {sections.map((s) => (
              <button
                key={s.id}
                className={`adminNavItem ${active === s.id ? "isActive" : ""}`}
                onClick={() => setActive(s.id)}
                type="button"
              >
                <div className="adminNavMain">{s.title}</div>
                <div className="adminNavSub">{s.description}</div>
              </button>
            ))}
          </aside>

          <main className="adminMain">
  <div className="adminMainGrid">
    {/* editor */}
    <div className="adminCard">
      <div className="adminSectionHead">
        <div>
          <div className="adminSectionTitle">{currentSection.title}</div>
          <div className="adminSectionDesc">{currentSection.description}</div>
        </div>

        {status ? <div className="adminPill">{status}</div> : null}
      </div>

      <div className="adminGrid">
        {currentSection.fields.map((field) => {
          const dirty = isDirty(field.key);

          return (
            <div key={field.key} className="adminField">
              <div className="adminFieldTop">
                <label className="adminLabel">{field.label}</label>
                {dirty ? <span className="adminDirty">edited</span> : null}
              </div>

              {renderField(field)}

              <button
                className="adminSave"
                onClick={() => save(field.key)}
                type="button"
                disabled={!dirty}
                title={dirty ? "save changes" : "no changes to save"}
              >
                save
              </button>
            </div>
          );
        })}
      </div>
    </div>

    {/* preview */}
    <aside className="adminPreview">
      <div className="adminPreviewCard">
        <div className="adminPreviewHead">
          <div className="adminPreviewTitle">preview</div>
          <div className="adminPreviewSub">how this reads on the site</div>
        </div>

        {active === "home" ? (
          <div className="adminPreviewBody">
            <div className="adminPreviewKicker">home hero</div>
            <div className="adminPreviewH1">{content["home.hero.title"] || "—"}</div>
            <div className="adminPreviewP">{content["home.hero.subtitle"] || "—"}</div>
          </div>
        ) : null}

        {active === "about" ? (
          <div className="adminPreviewBody">
            <div className="adminPreviewKicker">about</div>
            <div className="adminPreviewP preWrap">{content["about.text"] || "—"}</div>
          </div>
        ) : null}

        {active === "services" ? (
          <div className="adminPreviewBody">
            <div className="adminPreviewKicker">services</div>
            <div className="adminPreviewP">
              {(content["services.list"] || "")
                ? (content["services.list"] || "")
                    .split(/[\n,]+/g)
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .slice(0, 12)
                    .map((s, i) => <div key={i} className="adminPreviewChip">{s}</div>)
                : "—"}
            </div>
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
              <div className="adminMetaVal">{(content[f.key] || "").length} chars</div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  </div>
</main>

        </div>
      </div>
    </div>
  );
}
