export function addCommas(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

function transformData(timelineData) {
  let prev = 0;
  const growthNumbers = [];

  const dataArr = Object.entries(timelineData)
  .map(([date, totalCases]) => {
    const growthNum = prev !== 0 ? Math.round((totalCases/prev - 1) * 100) : 0;
    growthNumbers.push(growthNum);
    const growth = prev !== 0 ? `${growthNum}%` : 'n/a';
    const newCases = totalCases - prev;
    prev = totalCases;

    return [
      date,
      totalCases,
      newCases,
      growth,
    ];
  });

  const threeDay = [];
  const rollingAverageArray = growthNumbers.map(item => {
    threeDay.push(item);
    if (threeDay.length > 3) threeDay.shift();

    return threeDay.length === 3
    ? `${Math.round((threeDay.reduce((all, item) => all += item)) / 3)}%`
    : 'n/a';
  });

  return dataArr.map(([date, totalCases, newCases, growth]) => {
    return [
      date,
      totalCases,
      newCases,
      growth,
      rollingAverageArray.shift(),
    ]
  });
}


export function getState(json) {
  const stateData = json.reduce((all, item) => {
    all[item.date] = item.positive;
    return all;
  }, {});

  const stateDataModifiedDate = Object.entries(stateData).reduce((all, [date, numCases]) => {
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


export function getCountry(json) {
  const timelineData = json.timeline.cases;

  return transformData(timelineData);
}