import React, { Fragment } from 'react';
import { addCommas } from '../hooks/dataUtils'

function DataRows({ stats, showOlderData = false }) {
  const recentStats = stats.slice(0).splice(-7);

  const returnRow = (date, numCases, numDeaths, newCases, growthRate, threeDay) => (
    <tr key={ `${date}${numCases}${threeDay}` }>
      <td className="date">{ date }</td>
      <td className="cases">{ addCommas(numCases) }</td>
      <td className="cases">{ addCommas(numDeaths) }</td>
      <td className="cases">{ addCommas(newCases) }</td>
      <td className="growth">{ growthRate }</td>
      { showOlderData && <td className="rolling-growth">{ threeDay }</td> }
    </tr>
  );

  return (
    <Fragment>
      { showOlderData && stats.map(([date, numCases, numDeaths, newCases, growthRate, threeDay]) => {
        return numCases > 0 && returnRow(date, numCases, numDeaths, newCases, growthRate, threeDay);
      }) }
      { !showOlderData && recentStats.map(([date, numCases, numDeaths, newCases, growthRate, threeDay]) => {
        return numCases > 0 && returnRow(date, numCases, numDeaths, newCases, growthRate, threeDay);
      }) }
    </Fragment>
  );
}

export default DataRows;
