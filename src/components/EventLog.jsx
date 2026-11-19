import { Terminal, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

export default function EventLog({ logs }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg text-white">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <Terminal className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold">Журнал подій та системних сповіщень</h3>
        </div>
        <span className="text-xs text-slate-400">Останні {logs.length} записів</span>
      </div>

      <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
        {logs.map((log) => (
          <div
            key={log.id}
            className={`flex items-start justify-between p-3 rounded-xl border text-xs ${
              log.type === 'warning'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                : log.type === 'action'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-300'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              {log.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
              {log.type === 'action' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
              {log.type === 'info' && <Info className="w-4 h-4 text-sky-400 shrink-0" />}
              <span>{log.message}</span>
            </div>
            <span className="text-slate-400 font-mono ml-4 shrink-0">{log.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
