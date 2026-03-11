export type StatRow = [string, number, number, number, number, string, string];

interface CasesEntry {
  affected: number;
  deaths: number;
}

interface StateApiEntry {
  date: number;
  positive: number;
  death: number;
}

interface CountryApiResponse {
  timeline: {
    cases: Record<string, number>;
    deaths: Record<string, number>;
  };
}

export function addCommas(num: number): string {
  if (num > 1000000) {
    return (num / 1000000).toFixed(2) + 'M';
  }
  if (num > 100000) {
    return (num / 1000).toFixed(0) + 'k';
  }
  if (num > 10000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  if (num === null) return '';

  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

function transformData(timelineData: Record<string, CasesEntry>): StatRow[] {
  let prev = 0;
  const growthNumbers: number[] = [];
  let prevDeaths = 0;

  const dataArr = Object.entries(timelineData)
  .map(([date, casesObj]) => {
    const growthNum: number = prev !== 0 ? Math.round((casesObj.affected/prev - 1) * 100) : 0;
    growthNumbers.push(growthNum);

    const growth = prev !== 0 ? `${growthNum}%` : 'n/a';
    const newCases = Number(casesObj.affected) - prev;
    prev = casesObj.affected;

    const deathGrowth = prevDeaths !== 0 ? casesObj.deaths - prevDeaths : 0;
    prevDeaths = casesObj.deaths;

    return [
      date,
      casesObj.deaths,
      deathGrowth,
      casesObj.affected,
      newCases,
      growth,
    ];
  });

  const threeDay: number[] = [];
  const rollingAverageArray = growthNumbers.map(item => {
    threeDay.push(item);
    if (threeDay.length > 3) threeDay.shift();

    return threeDay.length === 3
    ? `${Math.round((threeDay.reduce((all, item) => all + item)) / 3)}%`
    : 'n/a';
  });

  return dataArr.map(([date, totalDeaths, deathGrowth, totalCases, newCases, growth]) => {
    return [
      date,
      totalDeaths,
      deathGrowth,
      totalCases,
      newCases,
      growth,
      rollingAverageArray.shift(),
    ] as StatRow;
  });
}


export function getState(json: StateApiEntry[]): StatRow[] {
  const stateData = json.reduce((all: Record<string, CasesEntry>, item) => {
    all[item.date] = { affected: item.positive, deaths: item.death };
    return all;
  }, {});

  const stateDataModifiedDate = Object.entries(stateData).reduce((all: Record<string, CasesEntry>, [date, numCases]) => {
    if (Number(date) < 20200308) { return all; }

    const newDate = date.toString();
    const year = newDate.slice(0, 2);
    const month = newDate.slice(4, 6);
    const day = newDate.slice(6);
    const formattedDate = `${month}/${day}/${year}`
    all[formattedDate] = numCases;
    return all;
  }, {});

  return transformData(stateDataModifiedDate);
}


export function getCountry(json: CountryApiResponse): StatRow[] {
  const casesObj = json.timeline.cases;
  const deathsObj = json.timeline.deaths;
  const timelineData: Record<string, CasesEntry> = {};
  Object.entries(casesObj).forEach(([date, cases]) => {
    if (Date.parse(date) < 1583654400000) { return; } // start timeline at 3/8/20

    timelineData[date] = {
      affected: cases,
      deaths: deathsObj[date],
    };
  });

  return transformData(timelineData);
}
