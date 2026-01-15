import { useEffect, useState } from "react";
import "./dashboard.css";

const API = "http://localhost:4000";

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function AdminDashboard() {
  const [content, setContent] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    (async () => {
      const res = await fetch(`${API}/content`);
      const data = await res.json();
      setContent(data);
    })();
  }, []);

  if (!localStorage.getItem("token")) {
    return <div className="adminPage"><div className="adminWrap">not logged in</div></div>;
  }

  if (!content) {
    return <div className="adminPage"><div className="adminWrap">loading…</div></div>;
  }

  async function save(key) {
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

    setStatus("saved ✅");
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
          <button className="adminLogout" onClick={logout}>logout</button>
        </div>

        <div className="adminCard">
          <div className="adminGrid">
            <div className="adminField">
              <label className="adminLabel">home hero title</label>
              <input
                className="adminInput"
                value={content["home.hero.title"] || ""}
                onChange={(e) =>
                  setContent({ ...content, ["home.hero.title"]: e.target.value })
                }
              />
              <button className="adminSave" onClick={() => save("home.hero.title")}>
                save
              </button>
            </div>

            <div className="adminField">
              <label className="adminLabel">home hero subtitle</label>
              <input
                className="adminInput"
                value={content["home.hero.subtitle"] || ""}
                onChange={(e) =>
                  setContent({ ...content, ["home.hero.subtitle"]: e.target.value })
                }
              />
              <button className="adminSave" onClick={() => save("home.hero.subtitle")}>
                save
              </button>
            </div>

            <div className="adminField">
              <label className="adminLabel">about text</label>
              <textarea
                className="adminTextarea"
                rows={5}
                value={content["about.text"] || ""}
                onChange={(e) =>
                  setContent({ ...content, ["about.text"]: e.target.value })
                }
              />
              <button className="adminSave" onClick={() => save("about.text")}>
                save
              </button>
            </div>

            <div className="adminField">
              <label className="adminLabel">services list</label>
              <input
                className="adminInput"
                value={content["services.list"] || ""}
                onChange={(e) =>
                  setContent({ ...content, ["services.list"]: e.target.value })
                }
              />
              <button className="adminSave" onClick={() => save("services.list")}>
                save
              </button>
            </div>

            {status ? <pre className="adminStatus">{status}</pre> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
