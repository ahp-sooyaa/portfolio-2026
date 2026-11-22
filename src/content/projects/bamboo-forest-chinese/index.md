---
title: Bamboo Forest Chinese
summary: A bilingual site in Burmese and English for a Chinese teacher in Yangon, with posts, class schedules and free short-lesson series. Content is edited through Pages CMS.
tags: [Astro, Pages CMS, Cloudflare Pages]
liveUrl: https://bambooforestchinese.pages.dev
repoUrl: https://github.com/ahp-sooyaa/bambooforestchinese
order: 5
hasDetail: true
role: Spec, build, content model and CMS setup
timeframe: Jul 2026
status: live
thumbnail:
  src: ./thumbnail.webp
  alt: "Bamboo Forest Chinese home page in Burmese, with the teacher's profile, social links and latest posts"
---

## Overview

Bamboo Forest Chinese is the home on the web for a Mandarin teacher in Yangon. It holds blog posts, a catalogue of classes with clear status, and free lesson series. The interface is Burmese first, with English second and Chinese terms throughout. The teacher edits everything in a hosted CMS, without touching code.

## The problem

The teacher's students find her on **TikTok and Facebook**. A new class or short lesson is posted there, and people message the Facebook page to ask questions and enroll. That works for reach, but posts get buried quickly. There was no permanent, shareable page for a class's schedule, level and price, or for a lesson series someone wants to work through from the start.

The site needed to do four things:

- Give every class and lesson series a stable link to share from social posts.
- Put Burmese first, for learners in Myanmar.
- Cost close to nothing to run.
- Be editable by a non-developer.

Some things were deliberately out of scope: payments, accounts, a contact form and a custom domain. Enrollment stays in Messenger, where it already works.

## Approach

I started with a written project spec covering goals and non-goals, the content model, the locale strategy and hosting. Then I built on the open-source **astro-narrow** theme instead of designing from scratch. It's a clean, readable blog theme and saved weeks.

There are four content collections, each split by locale:

| Collection | Holds |
| --- | --- |
| Posts | Articles on learning Chinese, culture and study tips |
| Classes | Course listings with status, level, format, schedule, price and enroll link |
| Series | Ordered chapters of free short lessons, pointing at posts |
| Pages | About, contact and the like |

Class status (upcoming, ongoing or completed) is set by hand in frontmatter rather than worked out from dates. Classes start late and run over, and the teacher should decide what "ongoing" means.

## Key decisions

**Burmese as the default locale.** `my` is the primary locale and `en` is secondary, with a fallback when a translation is missing so a page doesn't break. Breadcrumbs and navigation handle both languages.

**Git-backed CMS instead of a backend.** [Pages CMS](https://pagescms.org) edits the Markdown in the GitHub repo through a friendly UI. There's no database or server to pay for, and every edit is a commit. Image uploads land in `public/images/`, and series chapters are saved as Astro content IDs so the references keep working.

**Static hosting on the free tier.** Cloudflare Pages deploys on every push, which includes every CMS save. Cloudflare Web Analytics gives privacy-friendly stats without a cookie banner.

## Challenges

- **Burmese slugs.** Auto-generated slugs from Burmese titles make unreadable URLs. The CMS setup and the documented workflow require setting the file path when creating an entry, for example `en/test-post.md`.
- **CMS references.** Series chapters have to save as IDs like `my/tones-basics`, not file names. I checked this with a written smoke test after connecting the CMS.
- **GPL licensing.** The theme is GPL-3.0, so the site's source stays under GPL-3.0 with the attribution kept intact.

## Outcome

The site is live on `bambooforestchinese.pages.dev`, and the teacher is already publishing through the CMS, including class flyers and new posts. Each class or series now has a link that can go in a TikTok bio or a Facebook post. <!-- TODO(user): add any results, e.g. enrollments or traffic, if you can share them. -->

## What I'd do next

- A custom domain once the brand settles.
- Structured data for classes, so they show up better in search.
- A simple enrollment form as a fallback for people who don't use Messenger.
