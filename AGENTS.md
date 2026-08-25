# Agent Guide

## Repository Overview

This is a Vite + React + TypeScript single-page app for the COVID-19 Growth Tracker. It compares historical COVID case and death trends for a fixed set of US states and countries.

The app is deployed on Netlify:

- Production URL: https://covid-growth-tracker.netlify.app/
- Default branch: `master`
- Package manager/runtime for repo work: Bun

## Required Tooling

- Use Bun, not npm or yarn.
- The pinned package manager is `bun@1.3.14` in `package.json`.
- Keep `.node-version` at `22` unless you are intentionally changing Netlify/runtime alignment.

Common commands:

```sh
bun install
bun run dev
bun run lint
bun run typecheck
bun run build
bun run test
```

Before opening or updating a PR that changes code, run:

```sh
bun install --frozen-lockfile
bun run lint
bun run typecheck
bun run build
bun run test
```

For docs-only changes, a full app validation run is usually unnecessary; inspect the diff and verify any edited links or badges if relevant.

## Files And Generated Artifacts

Commit source/config/docs files only. Do not commit generated or local-only artifacts:

- `node_modules/`
- `dist/`
- `build/`
- `coverage/`
- `.DS_Store`
- local `.env*` files

`bun.lock` is the canonical lockfile. Do not reintroduce `package-lock.json`.

## App Structure

- Entry point: `src/index.tsx`
- Main app shell: `src/components/App.tsx`
- Data fetching hook: `src/hooks/useFetchVirusStats.ts`
- Data shaping utilities: `src/hooks/dataUtils.ts`
- Global styles: `src/index.css` and `src/App.css`
- Test setup: `src/setupTests.ts`
- Vite config: `vite.config.ts`
- Vitest config: `vitest.config.ts`

The app version is read from `package.json` in Vite/Vitest config and injected as `__APP_VERSION__`. If you touch version behavior, update or preserve `src/vite-env.d.ts`.

## Data Model And Fetching

The app fetches live data from:

- disease.sh historical country endpoint
- NYT COVID-19 `us-states.csv`

`useFetchVirusStats` uses `Promise.allSettled` so partial data can still render when one source fails. Preserve this graceful degradation behavior unless the task explicitly asks otherwise.

Data rows use the `StatRow` interface in `src/hooks/dataUtils.ts`:

- `date`
- `totalDeaths`
- `newDeaths`
- `totalCases`
- `newCases`
- `dayOverDay`
- `rollingAverage`

The timeline starts at March 8, 2020. Country data uses `M/D/YY` keys from disease.sh; state data uses ISO dates from the NYT CSV and is converted to the same display shape.

## Testing Notes

Tests use Vitest + React Testing Library + JSDOM.

- `src/setupTests.ts` mocks Chart.js and `react-chartjs-2` because JSDOM does not implement canvas.
- App tests mock `globalThis.fetch`; do not rely on live network calls in tests.
- Prefer adding focused tests near the code being changed:
  - data transformations: `src/hooks/dataUtils.test.ts`
  - app flows: `src/App.test.tsx`
  - component behavior: component-specific `*.test.tsx`

If you change data parsing, date handling, growth calculations, or failure handling, add or update tests.

## Style And Implementation Conventions

- Keep TypeScript strictness intact.
- Prefer small function components with typed props.
- Reuse existing exported UI types:
  - `Tab` from `TabGroup`
  - `Metric` from `MetricSelector`
  - `TimeRange` from `TimeRangeSelector`
  - `StatRow` from `dataUtils`
- Use `globalThis` rather than Node-only globals in browser/JSDOM test code.
- Keep external data parsing in `src/hooks/dataUtils.ts`; avoid scattering parsing logic through components.
- Preserve accessible controls and semantic roles, especially tabs, buttons, alerts, and chart/table context.

## GitHub Workflows And PR Rules

CI runs from `.github/workflows/nodejs.yml` and uses Bun:

- `bun install --frozen-lockfile`
- `bun run lint`
- `bun run typecheck`
- `bun run build`
- `bun run test`

PR titles must follow Conventional Commits. Valid examples:

- `feat: add country comparison`
- `fix(chart): handle empty data`
- `feat!: remove legacy data source`
- `docs: fix CI badge`
- `chore: update dependencies`

Allowed types are:

- `build`
- `chore`
- `ci`
- `docs`
- `feat`
- `fix`
- `perf`
- `refactor`
- `revert`
- `style`
- `test`

The semver label workflow reads PR title, body, and commit messages:

- breaking-change signals apply `semver:major`
- clear `feat:` signals apply `semver:minor`
- patch changes stay unlabeled

The version bump workflow runs after a PR is merged into `master` or `main`:

- `semver:major` bumps major
- `semver:minor` bumps minor
- no semver label bumps patch

It updates `package.json`, refreshes `bun.lock`, commits the version bump, and pushes it back to the base branch.

## Dependency Updates

When updating dependencies:

1. Use Bun commands, for example `bun update --latest` or `bun add`.
2. Keep `package.json` ranges explicit, usually caret ranges. Avoid `"latest"` ranges.
3. Keep `@types/node` aligned with the repo runtime hint unless intentionally changing runtime support.
4. Run the full validation suite after the lockfile changes.
5. If a toolchain major exposes type issues, prefer small compatibility fixes over disabling strictness.

## Badges And README

README badges should reflect current `master` state:

- Bun CI badge should use the workflow file URL:
  `https://github.com/travishuff/covid-growth-rates/actions/workflows/nodejs.yml/badge.svg?branch=master`
- Version badge reads `package.json` from GitHub.
- Netlify badge uses the Netlify badge API and links to the Netlify project deploys page.

If badge behavior changes, verify the rendered SVG title/status, not only the HTTP status code.

## Deployment Notes

There are no checked-in Netlify config files. The app is a client-rendered Vite SPA. Treat deployment/runtime changes as configuration-sensitive and keep repo-side changes minimal unless the task asks for a broader deployment migration.

Keep `.node-version` unless you have confirmed the Netlify/runtime setup no longer needs it.
