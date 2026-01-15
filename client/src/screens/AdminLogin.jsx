import { useState } from "react";
import "./auth.css";

const API = "http://localhost:4000";

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | error | success
  const [showPw, setShowPw] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setMessage("logging in…");

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      // ✅ Debug: see what server actually returns
      console.log("LOGIN RESPONSE:", data);

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "login failed");
        return;
      }

      // ✅ Make sure token exists
      const token = data.token;
      if (!token) {
        setStatus("error");
        setMessage("login succeeded but no token returned (check server response)");
        return;
      }

      setStatus("success");
      setMessage("login successful");

      // ✅ bulletproof: update app if possible, otherwise store + reload
      if (typeof onLogin === "function") {
        onLogin(token);
      } else {
        localStorage.setItem("token", token);
        window.location.reload(); // forces App.jsx to re-check token
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMessage("network error");
    }
  }

  return (
    <div className="authPage">
      <div className="authLeft">
        <div className="authCard">
          <div className="authHeader">
            <span className="authBadge">admin</span>
            <h1>sign in</h1>
            <p>manage site content securely</p>
          </div>

          <form className="authForm" onSubmit={handleSubmit}>
            <label className="authLabel">
              <span>email</span>
              <input
  className="authInput"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  type="email"
  placeholder="admin@test.com"
/>

            </label>

            <label className="authLabel">
              <span>password</span>
              <div className="authPwRow">
                <input
  className="authInput"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  type={showPw ? "text" : "password"}
  placeholder="your password"
/>

                <button
                  className="authPwToggle"
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                >
                  {showPw ? "hide" : "show"}
                </button>
              </div>
            </label>

            <button className="authButton" type="submit" disabled={status === "loading"}>
              {status === "loading" ? "signing in…" : "sign in"}
            </button>

            {message ? (
              <div
                className={[
                  "authMessage",
                  status === "error" ? "isError" : "",
                  status === "success" ? "isSuccess" : "",
                ].join(" ")}
              >
                {message}
              </div>
            ) : null}
          </form>

          <div className="authFooter">
            <span>client-side-admin</span>
            <span className="dot" />
            <span>jwt protected</span>
          </div>
        </div>
      </div>

      <div className="authRight">
        <div className="authGlow" />
      </div>
    </div>
  );
}
