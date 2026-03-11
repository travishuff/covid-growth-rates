import { useEffect, useState } from 'react';
import type { StatRow } from './dataUtils';
import { getStatesFromNytCsv, getCountry } from './dataUtils';

const states = [
  'California',
  'Texas',
  'Arizona',
  'Utah',
  'New York',
  'Florida',
  'Michigan',
];

const countries: Record<string, string> = {
  'usa': 'United States',
  'canada': 'Canada',
  'uk': 'United Kingdom',
  // 'china': 'China',
  'italy': 'Italy',
  'india': 'India',
  's.%20korea': 'South Korea',
  'sweden': 'Sweden',
};

const NYT_STATES_URL = 'https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv';

type LocationStats = [string, StatRow[]][];

async function fetchJson<T>(url: string, signal: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

async function fetchText(url: string, signal: AbortSignal): Promise<string> {
  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }
  return res.text();
}

export function useFetchVirusStats() {
  const [stateStats, setStateStats] = useState<LocationStats>([]);
  const [countryStats, setCountryStats] = useState<LocationStats>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    (async function fetchData() {
      setLoading(true);
      setError(false);

      try {
        const countryPromises = Object.keys(countries).map(async (country) => {
          const json = await fetchJson<Parameters<typeof getCountry>[0]>(
            `https://disease.sh/v3/covid-19/historical/${country}?lastdays=all`,
            signal
          );
          return [countries[country], getCountry(json)] as [string, StatRow[]];
        });

        const [countrySettledResult, stateCsvResult] = await Promise.allSettled([
          Promise.allSettled(countryPromises),
          fetchText(NYT_STATES_URL, signal),
        ]);

        if (signal.aborted) {
          return;
        }

        let hadError = false;
        let nextCountryStats: LocationStats = [];
        let nextStateStats: LocationStats = [];

        if (countrySettledResult.status === 'fulfilled') {
          const settled = countrySettledResult.value;
          nextCountryStats = settled
            .filter((result): result is PromiseFulfilledResult<[string, StatRow[]]> => result.status === 'fulfilled')
            .map((result) => result.value);
          hadError = settled.some((result) => result.status === 'rejected');
        } else {
          hadError = true;
        }

        if (stateCsvResult.status === 'fulfilled') {
          nextStateStats = getStatesFromNytCsv(stateCsvResult.value, states);
        } else {
          hadError = true;
        }

        setCountryStats(nextCountryStats);
        setStateStats(nextStateStats);
        setLoading(false);
        setError(hadError);
      } catch (err) {
        if (signal.aborted) {
          return;
        }
        console.error(err);
        setLoading(false);
        setError(true);
      }
    })();

    return () => {
      controller.abort();
    };
  }, []);

  return {
    stateStats,
    countryStats,
    stats: [
      stateStats,
      countryStats,
    ],
    loading,
    error,
  }
}
