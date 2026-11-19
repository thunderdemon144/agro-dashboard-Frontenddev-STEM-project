export default function SectorTabs({ sectors, activeId, onSelect, showOnlyAlerts, setShowOnlyAlerts }) {
  const visibleSectors = showOnlyAlerts
    ? sectors.filter((s) => s.temp > s.maxTemp || s.humidity < s.minHumidity)
    : sectors;

  const alertCount = sectors.filter((s) => s.temp > s.maxTemp || s.humidity < s.minHumidity).length;

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {visibleSectors.length === 0 ? (
          <span className="text-xs text-zinc-500 px-2 py-1">Аварійних секторів немає</span>
        ) : (
          visibleSectors.map((sector) => {
            const isAlert = sector.temp > sector.maxTemp || sector.humidity < sector.minHumidity;
            const isActive = sector.id === activeId;

            return (
              <button
                key={sector.id}
                onClick={() => onSelect(sector.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium border transition-colors flex items-center space-x-2 cursor-pointer ${
                  isActive
                    ? 'bg-zinc-900 text-white border-zinc-900'
                    : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isAlert ? 'bg-rose-500' : 'bg-emerald-500'
                  }`}
                ></span>
                <span>{sector.name}</span>
                <span className={`tabular-nums ${isActive ? 'text-zinc-400' : 'text-zinc-400'}`}>
                  ({sector.temp}°C / {sector.humidity}%)
                </span>
              </button>
            );
          })
        )}
      </div>

      {/* Фільтр проблемних секторів */}
      <button
        onClick={() => setShowOnlyAlerts(!showOnlyAlerts)}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
          showOnlyAlerts
            ? 'bg-rose-50 text-rose-700 border-rose-300'
            : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
        }`}
      >
        {showOnlyAlerts ? 'Показати всі сектори' : `Тільки аварійні (${alertCount})`}
      </button>
    </div>
  );
}
