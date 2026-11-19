export default function MetricCard({ title, value, unit, icon: Icon, status, isAlert }) {
  return (
    <div
      className={`bg-white rounded-xl p-5 border transition-colors flex flex-col justify-between ${
        isAlert ? 'border-rose-300 bg-rose-50/30' : 'border-zinc-200'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">{title}</span>
        <Icon className={`w-4 h-4 ${isAlert ? 'text-rose-600' : 'text-zinc-400'}`} />
      </div>

      <div className="my-3 flex items-baseline space-x-1.5">
        <span className="text-3xl font-semibold tracking-tight text-zinc-900 tabular-nums">
          {value}
        </span>
        <span className="text-sm font-medium text-zinc-500">{unit}</span>
      </div>

      <div className="pt-2.5 border-t border-zinc-100 flex items-center justify-between text-xs">
        <span className="text-zinc-500">Стан</span>
        <span
          className={`font-medium ${
            isAlert ? 'text-rose-600' : 'text-emerald-700'
          }`}
        >
          {status}
        </span>
      </div>
    </div>
  );
}
