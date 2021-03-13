import { useEffect, useState } from 'react';
import { getState, getCountry } from './dataUtils'

const states: any = {
  ca: 'California',
  tx: 'Texas',
  az: 'Arizona',
  ut: 'Utah',
  ny: 'New York',
  fl: 'Florida',
  // la: 'Louisiana',
  // il: 'Illinois',
  mi: 'Michigan',
};

const countries: any = {
  'usa': 'United States',
  'canada': 'Canada',
  'uk': 'United Kingdom',
  // 'china': 'China',
  'italy': 'Italy',
  'india': 'India',
  's.%20korea': 'South Korea',
  'sweden': 'Sweden',
};

export function useFetchVirusStats() {
  const [stateStats, setStateStats] = useState([]);
  const [countryStats, setCountryStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async function fetchData() {
      setLoading(true);
      setError(false);

      const countryFetchesPromise = Promise.all(Object.keys(countries).map(country => {
        return fetch(`https://disease.sh/v3/covid-19/historical/${country}?lastdays=all`)
        .then(res => res.json())
        .then(json => [countries[country], getCountry(json)])
        .catch(err => {
          console.error(err);
          setError(true);
          setLoading(false);
        });
      }));

      const stateFetchesPromise = Promise.all(Object.keys(states).map(state => {
        return fetch(`https://api.covidtracking.com/api/v1/states/${state}/daily.json`)
        .then(res => res.json())
        .then(json => [states[state], getState(json)])
        .catch(err => {
          console.error(err);
          setError(true);
          setLoading(false);
        });
      }));

      const [countryFetches, stateFetches]: [any, any] = await Promise.all([
        countryFetchesPromise,
        stateFetchesPromise,
      ]);

      if (countryFetches && stateFetches) {
        setLoading(false);
        setCountryStats(countryFetches);
        setStateStats(stateFetches);
      }
    })();
  }, []);

  return {
    stats: [
      stateStats,
      countryStats,
    ],
    loading,
    error,
  }
}
