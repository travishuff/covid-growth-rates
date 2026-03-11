import { addCommas, getStatesFromNytCsv, getCountry } from './dataUtils';

describe('addCommas', () => {
  it('formats numbers over 1 million as M', () => {
    expect(addCommas(1500000)).toBe('1.50M');
    expect(addCommas(2000000)).toBe('2.00M');
  });

  it('formats numbers over 100k as k (no decimal)', () => {
    expect(addCommas(150000)).toBe('150k');
    expect(addCommas(999999)).toBe('1000k');
  });

  it('formats numbers over 10k as k (one decimal)', () => {
    expect(addCommas(15000)).toBe('15.0k');
    expect(addCommas(99999)).toBe('100.0k');
  });

  it('formats small numbers with comma separators', () => {
    expect(addCommas(1234)).toBe('1,234');
    expect(addCommas(999)).toBe('999');
    expect(addCommas(0)).toBe('0');
  });
});

describe('getCountry', () => {
  const mockCountryJson = {
    timeline: {
      cases: {
        '3/7/20': 500,
        '3/8/20': 600,
        '3/9/20': 800,
        '3/10/20': 1000,
        '3/11/20': 1300,
      },
      deaths: {
        '3/7/20': 5,
        '3/8/20': 8,
        '3/9/20': 12,
        '3/10/20': 18,
        '3/11/20': 25,
      },
    },
  };

  it('returns an array of data rows', () => {
    const result = getCountry(mockCountryJson);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('each row has expected fields', () => {
    const result = getCountry(mockCountryJson);
    result.forEach(row => {
      expect(row).toEqual(expect.objectContaining({
        date: expect.any(String),
        totalDeaths: expect.any(Number),
        newDeaths: expect.any(Number),
        totalCases: expect.any(Number),
        newCases: expect.any(Number),
        dayOverDay: expect.any(String),
        rollingAverage: expect.any(String),
      }));
    });
  });

  it('filters out entries before 3/8/20', () => {
    const result = getCountry(mockCountryJson);
    // 3/7/20 is before 3/8/20 (1583654400000), so it should be excluded
    const dates = result.map(row => row.date);
    expect(dates).not.toContain('3/7/20');
  });

  it('calculates new cases correctly', () => {
    const result = getCountry(mockCountryJson);
    // 3/9/20: 800 - 600 = 200 new cases
    const march9 = result.find(row => row.date === '3/9/20');
    expect(march9).toBeDefined();
    expect(march9!.newCases).toBe(200);
  });

  it('calculates death growth correctly', () => {
    const result = getCountry(mockCountryJson);
    // 3/9/20: 12 - 8 = 4 new deaths
    const march9 = result.find(row => row.date === '3/9/20');
    expect(march9!.newDeaths).toBe(4);
  });
});

describe('getStatesFromNytCsv', () => {
  const mockCsv = [
    'date,state,fips,cases,deaths',
    '2020-03-07,California,06,50,1',
    '2020-03-08,California,06,60,2',
    '2020-03-09,California,06,80,3',
    '2020-03-08,Texas,48,30,0',
    '2020-03-09,Texas,48,45,1',
  ].join('\n');

  it('returns stats for requested states', () => {
    const result = getStatesFromNytCsv(mockCsv, ['California', 'Texas']);
    expect(result.length).toBe(2);
    const california = result.find(([state]) => state === 'California');
    expect(california).toBeDefined();
    expect(california![1].length).toBeGreaterThan(0);
  });

  it('filters out entries before 2020-03-08', () => {
    const result = getStatesFromNytCsv(mockCsv, ['California']);
    const dates = result[0][1].map(row => row.date);
    expect(dates).not.toContain('3/7/20');
  });

  it('calculates new cases correctly', () => {
    const result = getStatesFromNytCsv(mockCsv, ['California']);
    const march9 = result[0][1].find(row => row.date === '3/9/20');
    expect(march9).toBeDefined();
    expect(march9!.newCases).toBe(20);
  });
});
