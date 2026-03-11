import { Fragment } from 'react';
import type { StatRow } from '../hooks/dataUtils';
import { addCommas } from '../hooks/dataUtils'

function DataRows({ stats, showOlderData = false }: { stats: StatRow[], showOlderData: boolean }) {
  const recentStats = stats.slice(-7);

  const returnRow = (
    date: string,
    totalDeaths: number,
    newDeaths: number,
    totalCases: number,
    newCases: number,
    dayOverDay: string,
    rollingAverage: string
  ) => (
    <tr key={ `${date}${totalCases}${rollingAverage}` }>
      <td className="date">{ date }</td>
      <td className="death-cases">{ addCommas(totalDeaths) }</td>
      <td className="death-growth-cases">{ addCommas(newDeaths) }</td>
      <td className="cases">{ addCommas(totalCases) }</td>
      <td className="cases">{ addCommas(newCases) }</td>
      <td className="growth">{ dayOverDay }</td>
      { showOlderData && <td className="rolling-growth">{ rollingAverage }</td> }
    </tr>
  );

  return (
    <Fragment>
      { showOlderData && stats.map((stat) => {
        return stat.totalCases > 0 && returnRow(
          stat.date,
          stat.totalDeaths,
          stat.newDeaths,
          stat.totalCases,
          stat.newCases,
          stat.dayOverDay,
          stat.rollingAverage
        );
      }) }
      { !showOlderData && recentStats.map((stat) => {
        return stat.totalCases > 0 && returnRow(
          stat.date,
          stat.totalDeaths,
          stat.newDeaths,
          stat.totalCases,
          stat.newCases,
          stat.dayOverDay,
          stat.rollingAverage
        );
      }) }
    </Fragment>
  );
}

export default DataRows;
