import React from 'react';
import { useFetchVirusStats } from './useFetchVirusStats'
import StatTable from './StatTable'

import './App.css';


function App() {
  const {
    error,
    loading,
    stats,
  } = useFetchVirusStats();

  return (
    <div className="App">
      <div className="app-title">
        COVID-19 Growth Tracker
      </div>

      { loading &&
        <div>Loading data...</div> }

      { error &&
      <div>Error occured getting data.</div> }

      { stats.map(entity => {
          return entity.map(([location, stats]) => {
            return (
              <StatTable
                location={ location }
                key={ location }
                stats={ stats }
              />
            );
          })
      }) }

      <p className="credits">
        Data from Johns Hopkins CSSE repository
        <br />
        <a href="https://github.com/CSSEGISandData/COVID-19">https://github.com/CSSEGISandData/COVID-19</a>
      </p>

      <p className="credits">
        Source code for this repository
        <br />
        <a href="https://github.com/travishuff/covid-growth-rates">https://github.com/travishuff/covid-growth-rates</a>
      </p>

    </div>
  );
}

export default App;
