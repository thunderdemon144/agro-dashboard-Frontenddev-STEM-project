export default function MetricCard({ title, value, unit, icon: Icon, status, trend }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg hover:border-slate-700 transition-all flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-400">{title}</span>
        <div className="p-2.5 rounded-xl bg-slate-800/60 text-emerald-400 border border-slate-700/50">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="my-4">
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold tracking-tight text-white">{value}</span>
          <span className="text-sm font-semibold text-slate-400">{unit}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-800/60 text-xs">
        <span className="text-slate-400">Статус: <strong className="text-emerald-400">{status}</strong></span>
        <span className="text-emerald-400 font-medium">{trend}</span>
      </div>
    </div>
  );
}
