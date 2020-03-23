import React, { Fragment } from 'react';

function DataRows({ stats, showOlderData = false }) {
  const recentStats = stats.slice(0).splice(-7);

  const returnRow = (date, numCases, newCases, growthRate, threeDay) => (
    <tr key={ `${date}${numCases}${threeDay}` }>
      <td className="date">{ date }</td>
      <td className="cases">{ numCases }</td>
      <td className="cases">{ newCases }</td>
      <td className="growth">{ growthRate }</td>
      <td className="rolling-growth">{ threeDay }</td>
    </tr>
  );

  return (
    <Fragment>
      { showOlderData && stats.map(([date, numCases, newCases, growthRate, threeDay]) => {
        return returnRow(date, numCases, newCases, growthRate, threeDay);
      }) }
      { !showOlderData && recentStats.map(([date, numCases, newCases, growthRate, threeDay]) => {
        return returnRow(date, numCases, newCases, growthRate, threeDay);
      }) }
    </Fragment>
  );
}

export default DataRows;
