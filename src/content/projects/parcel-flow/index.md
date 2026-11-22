---
title: Parcel Flow
summary: A delivery management system for parcels once they reach the office. It covers rider assignment, delivery status, COD and fee collection, merchant settlements and rider payouts.
tags: [Next.js, TypeScript, PostgreSQL, Expo]
liveUrl: https://parcel-flow-production.up.railway.app/
repoUrl: https://github.com/ahp-sooyaa/parcel-flow
featured: true
highlights:
  - Parcel arrives at office
  - Assign rider
  - Out for delivery → Delivered
  - Collect COD + fees
  - Settle merchants · pay riders
order: 1
hasDetail: true
role: Solo, from domain research and spec to design, build and release
timeframe: May – Nov 2026
status: live
thumbnail:
  src: ./thumbnail.webp
  alt: "Parcel Flow landing page with a live parcels table showing township, rider and delivery status"
---

## Overview

Parcel Flow runs the back office of a small courier in Yangon. Parcels are logged when they reach the office, assigned to riders and tracked until they are delivered or returned. Every kyat of cash on delivery (COD) and delivery fee is traced through to a merchant settlement or a rider payout.

There are four roles: super admin, office admin, merchant and rider. Admins work in a Next.js web app. Riders also have an Android app built with Expo. A public demo lets anyone sign in as an admin, a merchant or a rider with one click, and its data resets every night.

## The problem

I designed it for a delivery business my sister was planning to start. Small Yangon couriers tend to work the same way:

- Merchants arrange pickups on Telegram.
- Customers pay cash on delivery.
- Fees depend on the township and the parcel's weight.
- Merchants are paid out once a week.

That money loop usually lives in spreadsheets and chat threads. Riders come back with cash, and someone has to work out which merchant is owed what, after fees, and which riders have handed over their cash. A single mistyped number makes the totals impossible to trust.

So the goal wasn't only parcel tracking. It was to make the **money** follow the parcels automatically, and to make every correction explain itself.

## Approach

### Specs before code

Before writing code I wrote a project specification covering the domain, roles, status flows and UI rules, plus a separate note on technical services. Each feature after that went through an [OpenSpec](https://github.com/ahp-sooyaa/parcel-flow/tree/dev/openspec) proposal, design and task list. Twenty-five of those changes are archived in the repo, from the auth foundation to the Android release build. They tell the project's story better than the commit log does.

### Architecture

- **Web app:** Next.js 16 with the App Router and Cache Components, Tailwind and shadcn/ui.
- **Data:** PostgreSQL on Supabase through Drizzle ORM.
- **Auth:** Better Auth with admin-created username and password accounts.
- **Other services:** Cloudflare R2 for proof-of-delivery photos and bank receipts, Sentry for errors, Railway for hosting.
- **Rider app:** Expo lives in `mobile/` in the same repo and talks to a versioned `/api/mobile/v1` API.

A native app can't call Next.js server actions. So the route handlers and the server actions both call one shared operations layer, and validation, ownership checks, status rules and money side effects live in a single place.

## Key decisions

**Money is derived, never entered.** A delivered or returned parcel creates *financial items*: COD owed to the merchant, fees owed to the courier, and a payout line for the rider. A settlement or payout only groups items that already exist, so nobody types an amount twice and every total traces back to parcels.

**Corrections carry a reason and their side effects.** Admins sometimes need to change a status or reassign a rider after the fact. Each correction records why it was made and adjusts the affected financial items, so the audit trail stays intact.

**Permissions are checked on the server, every time.** Every server action re-checks the actor's role and ownership. The Next.js proxy only handles routing and is never relied on for security.

**Realtime goes through the server.** The browser never holds Supabase keys. A route handler subscribes to Supabase Realtime with the service key and streams only the rows the signed-in user is allowed to see, over server-sent events. The rider app uses the same stream.

## Challenges

**A public demo for a money app.** A useful demo has to let strangers change data without being able to break it. Demo mode does the following:

- Visitors sign in through one-click role links, which are rate limited and accept POST requests only.
- Account and pricing changes are blocked on the server.
- Better Auth's endpoints are limited to signing in, signing out and reading the session.
- Uploads are replaced with sample files.

**Fast nightly resets.** The demo database lives in another region, so seeding through thousands of queries was slow. Instead, the seed runs once locally through the app's own data layer and is saved as a JSON snapshot. The nightly reset loads that snapshot in one transaction with a few dozen queries and shifts every date so the newest records land on today. It also refuses to run if it finds accounts the demo didn't create.

**Measured performance.** Data-layer and navigation tuning was driven by benchmark baselines committed in `benchmarks/`, not guesswork.

## Outcome

- A live demo covering the whole parcel and money loop for admins, merchants and riders.
- 118 commits and 25 spec-driven changes. Tests include unit and component tests (Bun), integration tests against a real database, and end-to-end tests of the money loop (Playwright).
- An Android rider app with live updates, delivery proof photos, failure reports and merchant returns, plus EAS build profiles ready for release.
- The business plans changed, so Parcel Flow is now source-available under the PolyForm Noncommercial license.

## What I'd do next

- An offline action queue and push notifications for riders, the two features deliberately left out of the app's first version.
- Merchant screens in the mobile app, then an iOS build from the same Expo codebase.
- Moving pickup booking into the app, which today still happens on Telegram.
