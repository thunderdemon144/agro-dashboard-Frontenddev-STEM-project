import { Sprout, Wifi } from 'lucide-react';

export default function Navbar({ isAuto }) {
  return (
    <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-white shadow-md">
      <div className="flex items-center space-x-3">
        <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
          <Sprout className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-wide">
            AgroIoT <span className="text-emerald-400">Greenhouse</span>
          </h1>
          <p className="text-xs text-slate-400">Система моніторингу та диспетчеризації теплиці №1</p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700 text-xs text-emerald-400">
          <Wifi className="w-4 h-4 animate-pulse" />
          <span className="font-medium">ESP32 Online</span>
        </div>

        <div
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border text-xs font-medium ${
            isAuto
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isAuto ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
            }`}
          ></span>
          <span>{isAuto ? 'Режим: Автоматичний' : 'Режим: Ручне керування'}</span>
        </div>
      </div>
    </header>
  );
}
