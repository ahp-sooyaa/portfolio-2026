import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";

const yearMonth = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Use YYYY-MM, e.g. 2024-01");

// One folder per project: src/content/projects/<slug>/index.md, with its images beside it.
// The folder name is the slug, ready for a future /projects/[slug] page.
const projects = defineCollection({
  loader: glob({ pattern: "*/index.md", base: "./src/content/projects", generateId: ({ entry }) => entry.split("/")[0] }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        summary: z.string(),
        thumbnail: z
          .object({
            src: image(),
            alt: z.string().min(1, "Thumbnail alt text is required"),
          })
          .optional(),
        tags: z.array(z.string()).min(1),
        liveUrl: z.url().optional(),
        repoUrl: z.url().optional(),
        featured: z.boolean().default(false),
        // How a non-featured project shows on the home page: a card in the grid, or a row in "More experiments".
        layout: z.enum(["card", "list"]).default("card"),
        // Steps shown in the featured project's side panel.
        highlights: z.array(z.string()).optional(),
        order: z.number(),
        date: z.coerce.date().optional(),
        // Set when the Markdown body holds a case study, published at /projects/[slug].
        hasDetail: z.boolean().default(false),
        // Quick facts shown at the top of a case study.
        role: z.string().optional(),
        timeframe: z.string().optional(),
        status: z.enum(["live", "released", "in-progress", "archived"]).optional(),
      })
      .refine((p) => p.liveUrl || p.repoUrl, { message: "Add a liveUrl or repoUrl" }),
});

const experience = defineCollection({
  loader: file("./src/content/experience.json"),
  schema: z.object({
    company: z.string(),
    companyUrl: z.url().optional(),
    role: z.string(),
    start: yearMonth,
    end: yearMonth.optional(),
    description: z.string(),
  }),
});

const link = z.object({ label: z.string(), url: z.url() });

const site = defineCollection({
  loader: file("./src/content/site.json"),
  schema: z.object({
    name: z.string(),
    handle: z.string(),
    title: z.string(),
    description: z.string(),
    role: z.string(),
    company: link,
    badges: z.array(z.string()),
    bio: z.string(),
    facts: z.array(z.object({ label: z.string(), value: z.string() })),
    email: z.email(),
    twitterHandle: z.string().startsWith("@").optional(),
    socials: z.array(link),
    sections: z.object({
      work: z.object({ heading: z.string(), intro: z.string() }),
      experience: z.object({ heading: z.string(), intro: z.string() }),
      stack: z.object({ heading: z.string() }),
    }),
    stack: z.array(z.object({ group: z.string(), items: z.array(z.string()).min(1) })),
    learning: z.array(z.object({ title: z.string(), detail: z.string() })),
  }),
});

export const collections = { projects, experience, site };
