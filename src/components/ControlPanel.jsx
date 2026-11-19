import { Droplet, Wind, Sliders } from 'lucide-react';

export default function ControlPanel({ isAuto, setIsAuto, pumpActive, setPumpActive, fanActive, setFanActive }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100">
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-zinc-500" />
          <h2 className="text-sm font-semibold text-zinc-900">Керування виконавчими механізмами</h2>
        </div>
        <span className="text-xs text-zinc-400">Контур №1</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Режим */}
        <div className="border border-zinc-200 rounded-lg p-4 flex flex-col justify-between bg-zinc-50/50">
          <div>
            <span className="text-xs font-medium text-zinc-500">Контур регулювання</span>
            <p className="text-sm font-medium text-zinc-900 mt-0.5">
              {isAuto ? 'Автоматичний (за порогами)' : 'Ручний диспетчерський'}
            </p>
          </div>
          <button
            onClick={() => setIsAuto(!isAuto)}
            className={`mt-4 w-full py-2 px-3 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              isAuto
                ? 'bg-zinc-900 text-white border-zinc-900 hover:bg-zinc-800'
                : 'bg-white text-zinc-900 border-zinc-300 hover:bg-zinc-100'
            }`}
          >
            {isAuto ? 'Перемкнути на ручний режим' : 'Повернути авторежим'}
          </button>
        </div>

        {/* Полив */}
        <div className="border border-zinc-200 rounded-lg p-4 flex flex-col justify-between bg-zinc-50/50">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500">Клапан поливу</span>
              <span className={`text-xs font-medium ${pumpActive ? 'text-sky-700' : 'text-zinc-400'}`}>
                {pumpActive ? 'Увімкнено' : 'Вимкнено'}
              </span>
            </div>
            <p className="text-sm font-medium text-zinc-900 mt-0.5">Крапельна лінія (Сектор 1)</p>
          </div>
          <button
            disabled={isAuto}
            onClick={() => setPumpActive(!pumpActive)}
            className={`mt-4 w-full py-2 px-3 rounded-lg text-xs font-medium border transition-colors flex items-center justify-center space-x-1.5 ${
              isAuto
                ? 'bg-zinc-100 text-zinc-400 border-zinc-200 cursor-not-allowed'
                : pumpActive
                ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 cursor-pointer'
                : 'bg-white text-zinc-900 border-zinc-300 hover:bg-zinc-100 cursor-pointer'
            }`}
          >
            <Droplet className="w-3.5 h-3.5" />
            <span>{pumpActive ? 'Зупинити подачу води' : 'Запустити полив'}</span>
          </button>
        </div>

        {/* Вентиляція */}
        <div className="border border-zinc-200 rounded-lg p-4 flex flex-col justify-between bg-zinc-50/50">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500">Витяжна вентиляція</span>
              <span className={`text-xs font-medium ${fanActive ? 'text-emerald-700' : 'text-zinc-400'}`}>
                {fanActive ? 'Працює' : 'Зупинено'}
              </span>
            </div>
            <p className="text-sm font-medium text-zinc-900 mt-0.5">Привід фрамуг та кулерів</p>
          </div>
          <button
            disabled={isAuto}
            onClick={() => setFanActive(!fanActive)}
            className={`mt-4 w-full py-2 px-3 rounded-lg text-xs font-medium border transition-colors flex items-center justify-center space-x-1.5 ${
              isAuto
                ? 'bg-zinc-100 text-zinc-400 border-zinc-200 cursor-not-allowed'
                : fanActive
                ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 cursor-pointer'
                : 'bg-white text-zinc-900 border-zinc-300 hover:bg-zinc-100 cursor-pointer'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>{fanActive ? 'Вимкнути вентиляцію' : 'Увімкнути вентиляцію'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
