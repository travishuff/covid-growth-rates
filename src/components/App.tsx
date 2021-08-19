import React from 'react';
import { useFetchVirusStats } from '../hooks/useFetchVirusStats'
import StatTable from './StatTable'
import '../App.css';

function App() {
  const { error, loading, stats } = useFetchVirusStats();

  return (
    <div className="App">
      <div className="app-title">
        COVID-19 Growth Tracker
      </div>

      { loading &&
        <div>Loading data...</div> }

      { error &&
      <div>API error occured getting data!</div> }

      { stats && stats.map(entity => {
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
        Country-level data source from Johns Hopkins CSSE repository:
        <br />
        <a href="https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data/csse_covid_19_time_series">https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data/csse_covid_19_time_series</a>
      </p>

      <p className="credits">
        State-level data source:
        <br />
        <a href="https://covidtracking.com/about-tracker/">https://covidtracking.com/about-tracker/</a>
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
