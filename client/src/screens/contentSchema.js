export const SECTIONS = [
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
    fields: [
      { key: "about.text", label: "about text", type: "textarea", rows: 7 },
    ],
  },
  {
    id: "services",
    title: "services",
    description: "services shown on the site",
    fields: [{ key: "services.list", label: "services list", type: "text" }],
  },
];
