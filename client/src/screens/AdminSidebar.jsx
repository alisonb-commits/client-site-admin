// AdminSidebar.jsx
export default function AdminSidebar({ sections, active, onSelect }) {
  return (
    <aside className="adminSidebar">
      <div className="adminSidebarTitle">sections</div>

      {sections.map((s) => (
        <button
          key={s.id}
          className={`adminNavItem ${active === s.id ? "isActive" : ""}`}
          onClick={() => onSelect(s.id)}
          type="button"
        >
          <div className="adminNavMain">{s.title}</div>
          <div className="adminNavSub">{s.description}</div>
        </button>
      ))}
    </aside>
  );
}
