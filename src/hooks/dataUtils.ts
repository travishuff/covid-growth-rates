export function addCommas(num: number) {
  if (num > 1000000) {
    return (num / 1000000).toFixed(2) + 'M';
  }
  if (num > 100000) {
    return (num / 1000).toFixed(0) + 'k';
  }
  if (num > 10000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  if (num === null) return;

  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

function transformData(timelineData: {}) {
  let prev = 0;
  const growthNumbers: number[] = [];
  let prevDeaths = 0;

  const dataArr = Object.entries(timelineData)
  .map(([date, casesObj]: [string, any]) => {
    const growthNum: number = prev !== 0 ? Math.round((casesObj.affected/prev - 1) * 100) : 0;
    growthNumbers.push(growthNum);
    const growth = prev !== 0 ? `${growthNum}%` : 'n/a';
    const newCases = casesObj.affected - prev;
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
    ? `${Math.round((threeDay.reduce((all, item) => all += item)) / 3)}%`
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
    ]
  });
}


export function getState(json: any) {
  const stateData = json.reduce((all: any, item: any) => {
    all[item.date] = { affected: item.positive, deaths: item.death };
    return all;
  }, {});

  const stateDataModifiedDate = Object.entries(stateData).reduce((all: any, [date, numCases]: [any, any]) => {
    if (date < 20200308) { return all; }

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


export function getCountry(json: any) {
  const casesObj = json.timeline.cases;
  const deathsObj = json.timeline.deaths;
  let timelineData: any = {};
  Object.entries(casesObj).forEach(([date, cases]) => {
    if (Date.parse(date) < 1583654400000) { return; } // start timeline at 3/8/20

    timelineData[date] = {
      affected: cases,
      deaths: deathsObj[date],
    };
  });

  return transformData(timelineData);
}
