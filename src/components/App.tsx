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
      <div>API error occurred while fetching data.</div> }

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
        Country-level data source:
        <br />
        <a href="https://disease.sh/">https://disease.sh/</a>
      </p>

      <p className="credits">
        State-level data source (NYT COVID-19 data):
        <br />
        <a href="https://github.com/nytimes/covid-19-data">https://github.com/nytimes/covid-19-data</a>
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
