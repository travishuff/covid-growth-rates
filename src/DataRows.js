import React, { Fragment } from 'react';

function DataRows({ stats, showOlderData = false }) {
  const recentStats = stats.slice(0).splice(-5);

  const returnRow = (date, numCases, growthRate) => (
    <tr key={ `${date}${numCases}` }>
      <td className="date">{ date }</td>
      <td className="cases">{ numCases }</td>
      <td className="growth">
        { growthRate }
      </td>
    </tr>
  );

  return (
    <Fragment>
      { showOlderData && stats.map(([date, numCases, growthRate]) => {
        return numCases > 0 && returnRow(date, numCases, growthRate);
      }) }
      { !showOlderData && recentStats.map(([date, numCases, growthRate]) => {
        return numCases > 0 && returnRow(date, numCases, growthRate);
      }) }
    </Fragment>
  );
}

export default DataRows;
