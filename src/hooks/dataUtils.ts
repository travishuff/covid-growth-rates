export interface StatRow {
  date: string;
  totalDeaths: number;
  newDeaths: number;
  totalCases: number;
  newCases: number;
  dayOverDay: string;
  rollingAverage: string;
}

interface CasesEntry {
  affected: number;
  deaths: number;
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

const ISO_DATE_CUTOFF = '2020-03-08';
const MDY_DATE_CUTOFF = Date.UTC(2020, 2, 8);

function parseMdyDateToTimestamp(date: string): number {
  const [month, day, year] = date.split('/').map(Number);
  const fullYear = year < 100 ? 2000 + year : year;
  return Date.UTC(fullYear, month - 1, day);
}

function formatIsoDateToMdy(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${Number(month)}/${Number(day)}/${year.slice(2)}`;
}

function transformData(timelineData: Record<string, CasesEntry>): StatRow[] {
  let prev = 0;
  const growthNumbers: number[] = [];
  let prevDeaths = 0;

  const rows = Object.entries(timelineData)
  .sort(([dateA], [dateB]) => parseMdyDateToTimestamp(dateA) - parseMdyDateToTimestamp(dateB))
  .map(([date, casesObj]) => {
    const growthNum: number = prev !== 0 ? Math.round((casesObj.affected/prev - 1) * 100) : 0;
    growthNumbers.push(growthNum);

    const growth = prev !== 0 ? `${growthNum}%` : 'n/a';
    const newCases = Number(casesObj.affected) - prev;
    prev = casesObj.affected;

    const deathGrowth = prevDeaths !== 0 ? casesObj.deaths - prevDeaths : 0;
    prevDeaths = casesObj.deaths;

    return {
      date,
      totalDeaths: casesObj.deaths,
      newDeaths: deathGrowth,
      totalCases: casesObj.affected,
      newCases,
      dayOverDay: growth,
    };
  });

  const threeDay: number[] = [];
  const rollingAverageArray = growthNumbers.map(item => {
    threeDay.push(item);
    if (threeDay.length > 3) threeDay.shift();

    return threeDay.length === 3
    ? `${Math.round((threeDay.reduce((all, item) => all + item)) / 3)}%`
    : 'n/a';
  });

  return rows.map((row, index) => ({
    ...row,
    rollingAverage: rollingAverageArray[index],
  }));
}


export function getStatesFromNytCsv(csvText: string, states: string[]): [string, StatRow[]][] {
  if (!csvText.trim()) {
    return [];
  }

  const stateSet = new Set(states);
  const timelineByState: Record<string, Record<string, CasesEntry>> = {};
  states.forEach(state => {
    timelineByState[state] = {};
  });

  const lines = csvText.trim().split(/\r?\n/);
  const header = lines.shift();
  if (!header) {
    return [];
  }

  const columns = header.split(',');
  const dateIndex = columns.indexOf('date');
  const stateIndex = columns.indexOf('state');
  const casesIndex = columns.indexOf('cases');
  const deathsIndex = columns.indexOf('deaths');

  if (dateIndex === -1 || stateIndex === -1 || casesIndex === -1 || deathsIndex === -1) {
    return [];
  }

  for (const line of lines) {
    if (!line) continue;
    const parts = line.split(',');
    const state = parts[stateIndex];
    if (!stateSet.has(state)) continue;

    const isoDate = parts[dateIndex];
    if (isoDate < ISO_DATE_CUTOFF) continue;

    const cases = Number(parts[casesIndex]);
    const deaths = Number(parts[deathsIndex]);
    timelineByState[state][formatIsoDateToMdy(isoDate)] = {
      affected: Number.isFinite(cases) ? cases : 0,
      deaths: Number.isFinite(deaths) ? deaths : 0,
    };
  }

  return states
    .map((state) => [state, transformData(timelineByState[state] ?? {})] as [string, StatRow[]])
    .filter(([, stats]) => stats.length > 0);
}


export function getCountry(json: CountryApiResponse): StatRow[] {
  if (!json?.timeline?.cases || !json?.timeline?.deaths) {
    return [];
  }
  const casesObj = json.timeline.cases;
  const deathsObj = json.timeline.deaths;
  const timelineData: Record<string, CasesEntry> = {};
  Object.entries(casesObj).forEach(([date, cases]) => {
    if (parseMdyDateToTimestamp(date) < MDY_DATE_CUTOFF) { return; } // start timeline at 3/8/20

    timelineData[date] = {
      affected: cases,
      deaths: deathsObj[date],
    };
  });

  return transformData(timelineData);
}
