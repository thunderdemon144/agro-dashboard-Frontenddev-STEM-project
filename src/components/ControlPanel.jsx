import { Droplet, Wind, Power, Sliders } from 'lucide-react';

export default function ControlPanel({ isAuto, setIsAuto, pumpActive, setPumpActive, fanActive, setFanActive }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg text-white">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <Sliders className="w-5 h-5 text-emerald-400" />
          <h2 className="text-base font-bold">Оперативна диспетчеризація та керування</h2>
        </div>
        <div className="text-xs text-slate-400">Виконавчі модулі IoT-вузла</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Перемикач режиму */}
        <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Режим роботи</span>
            <p className="text-sm font-medium text-white mt-1">Автоматичне регулювання за датчиками</p>
          </div>
          <button
            onClick={() => setIsAuto(!isAuto)}
            className={`mt-4 w-full py-2.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center space-x-2 ${
              isAuto
                ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>{isAuto ? 'Режим: Авто (Увімкнено)' : 'Режим: Ручний'}</span>
          </button>
        </div>

        {/* Керування поливом */}
        <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Система поливу</span>
            <p className="text-sm font-medium text-white mt-1">Сектор №1 (Капельний полив)</p>
          </div>
          <button
            disabled={isAuto}
            onClick={() => setPumpActive(!pumpActive)}
            className={`mt-4 w-full py-2.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center space-x-2 ${
              isAuto
                ? 'opacity-50 cursor-not-allowed bg-slate-700 text-slate-400'
                : pumpActive
                  ? 'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
            }`}
          >
            <Droplet className="w-4 h-4" />
            <span>{pumpActive ? 'Вимкнути полив' : 'Увімкнути полив'}</span>
          </button>
        </div>

        {/* Керування вентиляцією */}
        <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Вентиляція / Клімат</span>
            <p className="text-sm font-medium text-white mt-1">Витяжні кулери купола</p>
          </div>
          <button
            disabled={isAuto}
            onClick={() => setFanActive(!fanActive)}
            className={`mt-4 w-full py-2.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center space-x-2 ${
              isAuto
                ? 'opacity-50 cursor-not-allowed bg-slate-700 text-slate-400'
                : fanActive
                  ? 'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
            }`}
          >
            <Wind className="w-4 h-4" />
            <span>{fanActive ? 'Зупинити вентиляцію' : 'Запустити вентиляцію'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
