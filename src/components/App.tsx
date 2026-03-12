import { useCallback, useState } from 'react';
import { useFetchVirusStats } from '../hooks/useFetchVirusStats';
import TabGroup from './TabGroup';
import ComparisonChart from './ComparisonChart';
import MetricSelector from './MetricSelector';
import TimeRangeSelector from './TimeRangeSelector';
import SummaryCard from './SummaryCard';
import DetailTable from './DetailTable';
import type { Tab } from './TabGroup';
import type { Metric } from './MetricSelector';
import type { TimeRange } from './TimeRangeSelector';
import '../App.css';

function App() {
  const { stateStats, countryStats, loading, error } = useFetchVirusStats();

  const [activeTab, setActiveTab] = useState<Tab>('states');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [metric, setMetric] = useState<Metric>('newCases');
  const [timeRange, setTimeRange] = useState<TimeRange>(365);

  const locations = activeTab === 'states' ? stateStats : countryStats;

  const selectedData = selectedLocation
    ? locations.find(([name]) => name === selectedLocation)
    : null;

  const handleTabChange = useCallback((tab: Tab) => {
    setActiveTab(tab);
    setSelectedLocation(null);
  }, []);

  const handleCardClick = useCallback((name: string) => {
    setSelectedLocation((prev) => (prev === name ? null : name));
  }, []);

  return (
    <div className="App">
      <div className="app-title">COVID-19 Growth Tracker</div>
      <div className="app-subtitle">
        Comparing historical case and death trends across locations
      </div>

      <TabGroup activeTab={activeTab} onTabChange={handleTabChange} />

      <div aria-live="polite">
        {loading && (
          <div>
            <div className="skeleton skeleton-chart" />
            <div className="cards-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton skeleton-card" />
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="error-banner" role="alert">
            Some data sources failed to load. Showing available data.
          </div>
        )}
      </div>

      {!loading && locations.length > 0 && (
        <>
          <ComparisonChart
            locations={locations}
            metric={metric}
            timeRange={timeRange}
          />

          <div className="controls-row">
            <MetricSelector metric={metric} onChange={setMetric} />
            <TimeRangeSelector range={timeRange} onChange={setTimeRange} />
          </div>

          <div className="cards-grid">
            {locations.map(([name, stats], i) => (
              <SummaryCard
                key={name}
                location={name}
                stats={stats}
                index={i}
                selected={selectedLocation === name}
                metric={metric}
                onClick={() => handleCardClick(name)}
              />
            ))}
          </div>

          {selectedData && (
            <DetailTable
              location={selectedData[0]}
              stats={selectedData[1]}
            />
          )}
        </>
      )}

      <div className="credits">
        Country data: <a href="https://disease.sh/">disease.sh</a>
        {' | '}
        State data: <a href="https://github.com/nytimes/covid-19-data">NYT COVID-19 data</a>
        {' | '}
        <a href="https://github.com/travishuff/covid-growth-rates">Source code</a>
      </div>
    </div>
  );
}

export default App;
