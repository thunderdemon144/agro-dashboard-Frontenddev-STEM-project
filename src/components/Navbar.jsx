import { Sprout } from 'lucide-react';

export default function Navbar({ isAuto }) {
  return (
    <header className="bg-white border-b border-zinc-200 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center space-x-3">
        <div className="p-1.5 rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-900">
          <Sprout className="w-5 h-5" />
        </div>
        <div className="flex items-baseline space-x-2.5">
          <h1 className="text-base font-semibold tracking-tight text-zinc-900">
            AgroIoT Monitor
          </h1>
          <span className="text-xs text-zinc-400">/</span>
          <span className="text-xs font-medium text-zinc-500">Вузол: Теплиця №1 (ESP32)</span>
        </div>
      </div>

      <div className="flex items-center space-x-2.5 text-xs">
        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md border border-zinc-200 bg-zinc-50 text-zinc-700 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
          <span>Зв'язок: Активний</span>
        </div>

        <div
          className={`px-2.5 py-1 rounded-md border font-medium ${
            isAuto
              ? 'border-zinc-200 bg-zinc-50 text-zinc-800'
              : 'border-amber-300 bg-amber-50 text-amber-800'
          }`}
        >
          {isAuto ? 'Режим: Автоматичний' : 'Режим: Ручний'}
        </div>
      </div>
    </header>
  );
}
