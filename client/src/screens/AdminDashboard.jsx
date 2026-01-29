import { useMemo, useState } from "react";
import "./dashboard.css";

import { SECTIONS } from "./contentSchema";
import { useContentEditor } from "./useContentEditor";
import AdminSidebar from "./AdminSidebar";
import AdminField from "./AdminField";
import AdminPreview from "./AdminPreview";

export default function AdminDashboard() {
  const [active, setActive] = useState("home");
  const { content, status, getValue, setField, isDirty, save } = useContentEditor();

  const currentSection = useMemo(
    () => SECTIONS.find((s) => s.id === active) || SECTIONS[0],
    [active]
  );

  if (!localStorage.getItem("token")) {
    return (
      <div className="adminPage">
        <div className="adminWrap">not logged in</div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="adminPage">
        <div className="adminWrap">loading…</div>
      </div>
    );
  }

  function logout() {
    localStorage.removeItem("token");
    window.location.reload();
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
          <AdminSidebar sections={SECTIONS} active={active} onSelect={setActive} />

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
                    const value = getValue(field.key);
                    const dirty = isDirty(field.key);

                    return (
                      <AdminField
                        key={field.key}
                        field={field}
                        value={value}
                        dirty={dirty}
                        onChange={(v) => setField(field.key, v)}
                        onSave={() => save(field.key)}
                      />
                    );
                  })}
                </div>
              </div>

              {/* preview */}
              <AdminPreview active={active} content={content} currentSection={currentSection} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
