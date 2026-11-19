import { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';

export default function SectorTabs({
  sectors,
  activeId,
  onSelect,
  showOnlyAlerts,
  setShowOnlyAlerts,
  onAddSector,
  onDeleteSector,
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [maxTemp, setMaxTemp] = useState(28);
  const [minHumidity, setMinHumidity] = useState(55);

  const visibleSectors = showOnlyAlerts
    ? sectors.filter((s) => s.temp > s.maxTemp || s.humidity < s.minHumidity)
    : sectors;

  const alertCount = sectors.filter((s) => s.temp > s.maxTemp || s.humidity < s.minHumidity).length;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddSector({ name, maxTemp, minHumidity });
    setName('');
    setIsAdding(false);
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-3 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {visibleSectors.length === 0 ? (
            <span className="text-xs text-zinc-500 px-2 py-1">Аварійних секторів немає</span>
          ) : (
            visibleSectors.map((sector) => {
              const isAlert = sector.temp > sector.maxTemp || sector.humidity < sector.minHumidity;
              const isActive = sector.id === activeId;

              return (
                <div
                  key={sector.id}
                  onClick={() => onSelect(sector.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center space-x-2 cursor-pointer ${
                    isActive
                      ? 'bg-zinc-900 text-white border-zinc-900'
                      : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isAlert ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
                  <span>{sector.name}</span>
                  <span className="tabular-nums text-zinc-400">
                    ({sector.temp}°C / {sector.humidity}%)
                  </span>
                  {sectors.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSector(sector.id);
                      }}
                      title="Видалити сектор"
                      className={`ml-1 p-0.5 rounded hover:text-rose-500 transition-colors cursor-pointer ${
                        isActive ? 'text-zinc-400' : 'text-zinc-400'
                      }`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })
          )}

          {/* Кнопка відкриття форми додавання */}
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium border border-dashed border-zinc-300 text-zinc-600 hover:text-zinc-900 hover:border-zinc-400 flex items-center space-x-1 transition-colors cursor-pointer"
          >
            {isAdding ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            <span>{isAdding ? 'Скасувати' : 'Додати сектор'}</span>
          </button>
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

      {/* Стерильна форма додавання нового сектора */}
      {isAdding && (
        <form
          onSubmit={handleSubmit}
          className="pt-3 border-t border-zinc-100 flex flex-wrap items-end gap-3 text-xs"
        >
          <div>
            <label className="block text-zinc-500 mb-1">Назва сектора / культури</label>
            <input
              type="text"
              required
              placeholder="Напр.: Сектор №3 · Перець"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-zinc-300 rounded-lg px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-zinc-900 w-56"
            />
          </div>
          <div>
            <label className="block text-zinc-500 mb-1">Макс. темп. (°C)</label>
            <input
              type="number"
              value={maxTemp}
              onChange={(e) => setMaxTemp(e.target.value)}
              className="border border-zinc-300 rounded-lg px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-zinc-900 w-24 tabular-nums"
            />
          </div>
          <div>
            <label className="block text-zinc-500 mb-1">Мін. вологість (%)</label>
            <input
              type="number"
              value={minHumidity}
              onChange={(e) => setMinHumidity(e.target.value)}
              className="border border-zinc-300 rounded-lg px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-zinc-900 w-24 tabular-nums"
            />
          </div>
          <button
            type="submit"
            className="bg-zinc-900 hover:bg-zinc-800 text-white font-medium px-4 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            Підключити вузол
          </button>
        </form>
      )}
    </div>
  );
}
