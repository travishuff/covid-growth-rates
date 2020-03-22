import React, { Fragment } from 'react';

function DataRows({ stats, showOlderData = false }) {
  const recentStats = stats.slice(0).splice(-7);

  const returnRow = (date, numCases, newCases, growthRate) => (
    <tr key={ `${date}${numCases}` }>
      <td className="date">{ date }</td>
      <td className="cases">{ numCases }</td>
      <td className="cases">{ newCases }</td>
      <td className="growth">
        { growthRate }
      </td>
    </tr>
  );

  return (
    <Fragment>
      { showOlderData && stats.map(([date, numCases, newCases, growthRate]) => {
        return numCases > 0 && returnRow(date, numCases, newCases, growthRate);
      }) }
      { !showOlderData && recentStats.map(([date, numCases, newCases, growthRate]) => {
        return numCases > 0 && returnRow(date, numCases, newCases, growthRate);
      }) }
    </Fragment>
  );
}

export default DataRows;
