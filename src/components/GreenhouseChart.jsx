import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function GreenhouseChart({ data }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg text-white">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold">Динаміка кліматичних показників</h3>
          <p className="text-xs text-slate-400 mt-0.5">Оперативний моніторинг температури та вологості за добу</p>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block"></span>
            <span className="text-slate-300">Температура (°C)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-sky-400 inline-block"></span>
            <span className="text-slate-300">Вологість (%)</span>
          </div>
        </div>
      </div>

      <div className="h-72 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="time" stroke="#64748b" textAnchor="end" tick={{ fontSize: 12 }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }}
            />
            <Line type="monotone" dataKey="temp" stroke="#34d399" strokeWidth={3} dot={false} activeDot={{ r: 6 }} name="Температура (°C)" />
            <Line type="monotone" dataKey="humidity" stroke="#38bdf8" strokeWidth={3} dot={false} activeDot={{ r: 6 }} name="Вологість (%)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
