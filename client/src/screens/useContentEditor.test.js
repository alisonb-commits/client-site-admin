import { describe, expect, test, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useContentEditor } from "./useContentEditor";

vi.mock("./api", () => {
  return {
    getContent: vi.fn(async () => ({
      "home.hero.title": "Hello",
    })),
    putContentValue: vi.fn(async () => ({ ok: true, data: {} })),
  };
});

describe("useContentEditor", () => {
  test("marks field dirty when value changes", async () => {
    const { result } = renderHook(() => useContentEditor());

    // wait a tick for initial load
    await new Promise((r) => setTimeout(r, 0));

    expect(result.current.isDirty("home.hero.title")).toBe(false);

    act(() => {
      result.current.setField("home.hero.title", "New Title");
    });

    expect(result.current.isDirty("home.hero.title")).toBe(true);
  });
});
