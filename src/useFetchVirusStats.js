import { useEffect, useState } from 'react';
import { getCali, getNewYork, getUS } from './dataUtils'

export function useFetchVirusStats() {
  const [caliStats, setCaliStats] = useState();
  const [newYorkStats, setNewYorkStats] = useState();
  const [usStats, setUSStats] = useState();
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
          const caliData = getCali(json);
          const newYorkData = getNewYork(json);
          const usData = getUS(json);
          setCaliStats(caliData);
          setNewYorkStats(newYorkData);
          setUSStats(usData);
        })
        .catch(err => {
          setError(true);
          setLoading(false);
        });
    })();
  }, []);

  return {
    stats: {
      'California': caliStats,
      'New York': newYorkStats,
      'United States': usStats,
    },
    loading,
    error,
  }
}