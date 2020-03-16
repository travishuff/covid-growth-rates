import React, { useMemo } from 'react';
import { useFetchVirusStats } from './useFetchVirusStats'
import DataRows from './DataRows'

import './App.css';


function App() {
  const {
    caliStats,
    usStats,
    loading,
    error,
  } = useFetchVirusStats();

  const tableHeading = useMemo(() => (
    <tr className="table-heading">
      <td className="date">Date</td>
      <td className="cases"># new cases</td>
      <td className="growth">Day over day growth rate</td>
    </tr>
  ), []);

  return (
    <div className="App">

      <header className="App-header">
        <p className="title">
          California Virus Growth Rates
        </p>
      </header>
      <div>
        { loading &&
        <div>Loading data...</div> }

        { error &&
        <div>Error occured getting data.</div> }

        <table>
          <tbody>
            { tableHeading }
            <DataRows data={ caliStats } />
          </tbody>
        </table>
      </div>

      <header className="App-header">
        <p className="title">
          United States Virus Growth Rates
        </p>
      </header>
      <div>
        { loading &&
        <div>Loading data...</div> }

        { error &&
        <div>Error occured getting data.</div> }

        <table>
          <tbody>
            { tableHeading }
            <DataRows data={ usStats } />
          </tbody>
        </table>
      </div>

      <p className="credits">
        Data from Johns Hopkins CSSE repository
        <br />
        <a href="https://github.com/CSSEGISandData/COVID-19">https://github.com/CSSEGISandData/COVID-19</a>
      </p>

    </div>
  );
}

export default App;
