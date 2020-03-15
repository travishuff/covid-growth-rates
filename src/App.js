import React, { useEffect, useState } from 'react';

import './App.css';

function App() {
  const [stats, setStats] = useState();
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
          const cali = json.locations.filter(item => item.province === 'California')[0].history;
          console.log('cali stats:', cali);

          const sortedArray = Object.entries(cali)
          .map(([date, number]) => [date, number])
          .sort((a, b) => {
            return new Date(a[0]) - new Date(b[0]);
          });

          setStats(sortedArray);
        })
        .catch(err => {
          setError(true);
          console.log('error:', err.message);
          setLoading(false);
        });
    })();
  }, []);

  let prev = 0;
  const caliDates = (
    stats && stats.map(([date, numCases]) => {
      const el = numCases > 0 && (
        <tr key={ `${date}${numCases}` }>
          <td className="date">{ date }</td>
          <td className="cases">{ numCases }</td>
          <td className="growth">{ prev !== 0 && Math.round((numCases/prev - 1) * 100) }%</td>
        </tr>
      );
      prev = numCases;
      return el;
    })
  );

  return (
    <div className="App">

      <header className="App-header">
        <p>
          California Virus Growth Rates
        </p>
        <p>
          Data from Johns Hopkins CSSE repository
          <br />
          <a href="https://github.com/CSSEGISandData/COVID-19">https://github.com/CSSEGISandData/COVID-19</a>
        </p>
      </header>
      <div>
        { loading &&
        <div>Loading data...</div> }

        { error &&
        <div>Error occured getting data.</div> }

        <table>
          <tbody>
            <tr className="table-heading">
              <td className="date">Date</td>
              <td className="cases"># cases</td>
              <td className="growth">DoD growth</td>
            </tr>
            { caliDates }
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default App;
