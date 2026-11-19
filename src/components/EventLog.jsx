import { Terminal } from 'lucide-react';

export default function EventLog({ logs }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-zinc-100">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-zinc-500" />
          <h3 className="text-sm font-semibold text-zinc-900">Системний журнал подій</h3>
        </div>
        <span className="text-xs text-zinc-400 tabular-nums">Записів: {logs.length}</span>
      </div>

      <div className="divide-y divide-zinc-100 max-h-52 overflow-y-auto font-mono text-xs">
        {logs.map((log) => (
          <div key={log.id} className="py-2 flex items-baseline justify-between gap-4">
            <div className="flex items-baseline space-x-2.5">
              <span
                className={`uppercase text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                  log.type === 'warning'
                    ? 'bg-rose-100 text-rose-700'
                    : log.type === 'action'
                    ? 'bg-zinc-200 text-zinc-800'
                    : 'bg-zinc-100 text-zinc-600'
                }`}
              >
                {log.type === 'warning' ? 'ALERT' : log.type === 'action' ? 'CTRL' : 'INFO'}
              </span>
              <span className="text-zinc-800 font-sans">{log.message}</span>
            </div>
            <span className="text-zinc-400 shrink-0 tabular-nums">{log.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
