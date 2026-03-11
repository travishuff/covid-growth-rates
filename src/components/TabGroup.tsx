export type Tab = 'states' | 'countries';

interface TabGroupProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

function TabGroup({ activeTab, onTabChange }: TabGroupProps) {
  const tabs: { id: Tab; label: string }[] = [
    { id: 'states', label: 'US States' },
    { id: 'countries', label: 'Countries' },
  ];

  return (
    <div className="tab-group" role="tablist" aria-label="Data category">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className="tab-btn"
          role="tab"
          aria-selected={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default TabGroup;
