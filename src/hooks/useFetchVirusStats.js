import { useEffect, useState } from 'react';
import { getState, getCountry } from './dataUtils'

const states = [
  // 'Los Angeles, CA',
  'California',
  'New York',
  'Texas',
  'Illinois',
];

const countries = {
  'US': 'United States',
  'CN': 'China',
  'IT': 'Italy',
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

      fetch('https://coronavirus-tracker-api.herokuapp.com/confirmed')
        .then(res => res.json())
        .then(json => {
          setLoading(false);
          const countriesMapped = Object.keys(countries).map(country => {
            return [countries[country], getCountry(country, json)];
          });
          const statesMapped = states.map(state => {
            return [state, getState(state, json)];
          });
          setCountryStats(countriesMapped);
          setStateStats(statesMapped);
        })
        .catch(err => {
          setError(true);
          setLoading(false);
        });
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
