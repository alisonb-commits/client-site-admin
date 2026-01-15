import { useEffect, useState } from "react";

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
    return <div style={{ padding: 24 }}>not logged in</div>;
  }

  if (!content) return <div style={{ padding: 24 }}>loading…</div>;

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
    <div style={{ padding: 24, fontFamily: "system-ui", maxWidth: 800 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>admin dashboard</h2>
        <button onClick={logout}>logout</button>
      </div>

      <p style={{ opacity: 0.8 }}>edit content and save to database</p>

      <div style={{ display: "grid", gap: 16, marginTop: 20 }}>
        <div>
          <label>home hero title</label>
          <input
            style={{ width: "100%", marginTop: 6 }}
            value={content["home.hero.title"] || ""}
            onChange={(e) => setContent({ ...content, ["home.hero.title"]: e.target.value })}
          />
          <button style={{ marginTop: 8 }} onClick={() => save("home.hero.title")}>
            save
          </button>
        </div>

        <div>
          <label>home hero subtitle</label>
          <input
            style={{ width: "100%", marginTop: 6 }}
            value={content["home.hero.subtitle"] || ""}
            onChange={(e) => setContent({ ...content, ["home.hero.subtitle"]: e.target.value })}
          />
          <button style={{ marginTop: 8 }} onClick={() => save("home.hero.subtitle")}>
            save
          </button>
        </div>

        <div>
          <label>about text</label>
          <textarea
            style={{ width: "100%", marginTop: 6 }}
            rows={5}
            value={content["about.text"] || ""}
            onChange={(e) => setContent({ ...content, ["about.text"]: e.target.value })}
          />
          <button style={{ marginTop: 8 }} onClick={() => save("about.text")}>
            save
          </button>
        </div>

        <div>
          <label>services list</label>
          <input
            style={{ width: "100%", marginTop: 6 }}
            value={content["services.list"] || ""}
            onChange={(e) => setContent({ ...content, ["services.list"]: e.target.value })}
          />
          <button style={{ marginTop: 8 }} onClick={() => save("services.list")}>
            save
          </button>
        </div>
      </div>

      {status ? <pre style={{ marginTop: 16 }}>{status}</pre> : null}
    </div>
  );
}
