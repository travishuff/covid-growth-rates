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

      { Object.entries(stats).map(([location, stats]) => {
        return (
          <StatTable
            error={ error }
            loading={ loading }
            location={ location }
            key={ location }
            stats={ stats }
          />
        );
      }) }

      <p className="credits">
        Data from Johns Hopkins CSSE repository
        <br />
        <a href="https://github.com/CSSEGISandData/COVID-19">https://github.com/CSSEGISandData/COVID-19</a>
      </p>

    </div>
  );
}

export default App;
