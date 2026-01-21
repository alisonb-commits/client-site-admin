// useContentEditor.js
import { useEffect, useState } from "react";
import { getContent, putContentValue } from "./api";

export function useContentEditor() {
  const [content, setContent] = useState(null);
  const [initialContent, setInitialContent] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    (async () => {
      const data = await getContent();
      setContent(data);
      setInitialContent(data);
    })();
  }, []);

  function getValue(key) {
    return (content?.[key] ?? "").toString();
  }

  function setField(key, value) {
    setContent((prev) => ({ ...(prev || {}), [key]: value }));
  }

  function isDirty(key) {
    const a = (content?.[key] ?? "").toString();
    const b = (initialContent?.[key] ?? "").toString();
    return a !== b;
  }

  async function save(key) {
    if (!content || !initialContent) return;
    if (!isDirty(key)) return;

    setStatus(`saving ${key}…`);

    const value = content[key] || "";
    const { ok, data } = await putContentValue(key, value);

    if (!ok) {
      setStatus(data?.error || "save failed");
      return false;
    }

    // mark clean
    setInitialContent((prev) => ({ ...(prev || {}), [key]: value }));

    setStatus("saved ✅");
    setTimeout(() => setStatus(""), 1200);
    return true;
  }

  return {
    content,
    status,
    getValue,
    setField,
    isDirty,
    save,
  };
}
