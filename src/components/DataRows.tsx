import React, { Fragment } from 'react';
import { addCommas } from '../hooks/dataUtils'

function DataRows({ stats, showOlderData = false }: { stats: [], showOlderData: boolean }) {
  const recentStats = stats.slice(0).splice(-7);

  const returnRow = (
    date: string,
    numDeaths: number,
    deathGrowth: number,
    numCases: number,
    newCases: number,
    growthRate: number,
    threeDay: number
  ) => (
    <tr key={ `${date}${numCases}${threeDay}` }>
      <td className="date">{ date }</td>
      <td className="death-cases">{ addCommas(numDeaths) }</td>
      <td className="death-growth-cases">{ addCommas(deathGrowth) }</td>
      <td className="cases">{ addCommas(numCases) }</td>
      <td className="cases">{ addCommas(newCases) }</td>
      <td className="growth">{ growthRate }</td>
      { showOlderData && <td className="rolling-growth">{ threeDay }</td> }
    </tr>
  );

  return (
    <Fragment>
      { showOlderData && stats.map(([date, numDeaths, deathGrowth, numCases, newCases, growthRate, threeDay]: [string, number, number, number, number, number, number]) => {
        return numCases > 0 && returnRow(date, numDeaths, deathGrowth, numCases, newCases, growthRate, threeDay);
      }) }
      { !showOlderData && recentStats.map(([date, numDeaths, deathGrowth, numCases, newCases, growthRate, threeDay]: [string, number, number, number, number, number, number]) => {
        return numCases > 0 && returnRow(date, numDeaths, deathGrowth, numCases, newCases, growthRate, threeDay);
      }) }
    </Fragment>
  );
}

export default DataRows;
