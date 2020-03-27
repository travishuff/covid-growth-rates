import { useEffect, useState } from 'react';
import { getState, getCountry } from './dataUtils'

const states = {
  CA: 'California',
  NY: 'New York',
  LA: 'Louisiana',
  TX: 'Texas',
  IL: 'Illinois',
};

const countries = {
  'usa': 'United States',
  'china': 'China',
  'italy': 'Italy',
  's.%20korea': 'South Korea',
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

      const countryFetches = await Promise.all(Object.keys(countries).map(country => {
        return fetch(`https://corona.lmao.ninja/v2/historical/${country}`)
        .then(res => res.json())
        .then(json => {
          return [countries[country], getCountry(json)];
        })
        .catch(err => {
          setError(true);
          setLoading(false);
        });
      }));

      const stateFetches = await Promise.all(Object.keys(states).map(state => {
        return fetch(`https://covidtracking.com/api/states/daily?state=${state}`)
        .then(res => res.json())
        .then(json => {
          return [states[state], getState(json)];
        })
        .catch(err => {
          setError(true);
          setLoading(false);
        });
      }));

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
