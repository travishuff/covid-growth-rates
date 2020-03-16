import { useEffect, useState } from 'react';
import { getCali, getUS } from './dataUtils'

export function useFetchVirusStats() {
  const [caliStats, setCaliStats] = useState();
  const [usStats, setUSStats] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async function fetchData() {
      console.log('Fetching Data...');
      setLoading(true);
      setError(false);

      fetch('https://coronavirus-tracker-api.herokuapp.com/confirmed')
        .then(res => res.json())
        .then(json => {
          setLoading(false);
          const caliData = getCali(json);
          const usData = getUS(json);
          setCaliStats(caliData);
          setUSStats(usData);
        })
        .catch(err => {
          setError(true);
          console.error('error:', err.message);
          setLoading(false);
        });
    })();
  }, []);

  return {
    caliStats,
    usStats,
    loading,
    error,
  }
}