import { getCollection, getEntry } from "astro:content";

export async function getProfile() {
  const entry = await getEntry("site", "profile");
  if (!entry) throw new Error("Missing profile in src/content/site.json");
  return entry.data;
}

export async function getProjects() {
  const projects = await getCollection("projects");
  return projects.sort((a, b) => a.data.order - b.data.order);
}

export async function getExperience() {
  const items = await getCollection("experience");
  return items.sort((a, b) => b.data.start.localeCompare(a.data.start));
}

const monthFormat = new Intl.DateTimeFormat("en", { month: "short", year: "numeric", timeZone: "UTC" });

/** "2024-01" → "Jan 2024" */
export function formatYearMonth(value: string) {
  return monthFormat.format(new Date(`${value}-01T00:00:00Z`));
}

/** A link to a GitHub profile (no repo path) is labelled "GitHub" rather than "Repository". */
export function repoLabel(url: string) {
  const { hostname, pathname } = new URL(url);
  const segments = pathname.split("/").filter(Boolean);
  return hostname === "github.com" && segments.length < 2 ? "GitHub" : "Repository";
}
