export type TabType = "register" | "products";

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  const tabs: { key: TabType; label: string }[] = [
    { key: "register", label: "Register" },
    { key: "products", label: "Products" },
  ];

  return (
    <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === tab.key
              ? "bg-white text-brand-600 shadow-sm"
              : "text-gray-600 hover:text-brand-600 hover:bg-white/50"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;
