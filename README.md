# COVID-19 Growth Tracker

![Node.js CI](https://github.com/travishuff/covid-growth-rates/workflows/Node.js%20CI/badge.svg)
[![Netlify Status](https://api.netlify.com/api/v1/badges/80e2fa0b-df3c-4024-bae7-ac82e706c4f7/deploy-status)](https://app.netlify.com/projects/covid-growth-tracker/deploys)

## Overview

COVID-19 Growth Tracker is a small data dashboard that highlights how quickly cases and deaths are changing over time. It combines country-level historical data with US state-level data, then presents daily counts, day-over-day growth, and rolling averages in a compact table and chart.

## Production

Live site: [covid-growth-tracker.netlify.app](https://covid-growth-tracker.netlify.app/)

## Data sources

- Country-level data: [disease.sh](https://disease.sh/)
- US state-level data: [NYT COVID-19 Data Repository](https://github.com/nytimes/covid-19-data)

## What the app shows

- Daily new cases and deaths
- Day-over-day growth percentages
- 14-day change summaries
- A sparkline chart for recent case trends
- Toggles to expand older data

## Local development

1. Install dependencies:
   - `npm install`
2. Start the dev server:
   - `npm run dev`
3. Open the app:
   - http://localhost:3000

## Scripts

- `npm run dev` – start the Vite dev server
- `npm run build` – build for production (outputs to `dist/`)
- `npm run preview` – preview the production build locally
- `npm test` – run unit tests
- `npm run lint` – run ESLint
- `npm run typecheck` – run TypeScript in no-emit mode
