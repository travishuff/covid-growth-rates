function transformData(timelineData) {
  let prev = 0;
  const growthNumbers = [];

  const dataArr = Object.entries(timelineData)
  // .sort((a, b) => {
  //   return new Date(a[0]) - new Date(b[0]);
  // })
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


export function getState(state, json) {
  const stateData = json.confirmed
  .filter(item => item['Province/State'] === state)[0];
  delete stateData['Province/State'];
  delete stateData['Country/Region'];
  delete stateData['Lat'];
  delete stateData['Long'];
  console.log(stateData);

  return transformData(stateData);
}


export function getCountry(json) {
  const timelineData = json.timeline.cases;

  return transformData(timelineData);
}