import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function GreenhouseChart({ data }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-zinc-100">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900">Телеметрія мікроклімату</h3>
          <p className="text-xs text-zinc-500">Інтервал опитування сенсорів: 6 с</p>
        </div>
        <div className="flex items-center space-x-4 text-xs font-medium text-zinc-600">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-0.5 bg-zinc-900 inline-block"></span>
            <span>Температура (°C)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-0.5 bg-sky-600 inline-block"></span>
            <span>Вологість (%)</span>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, left: -22, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
            <XAxis dataKey="time" stroke="#a1a1aa" tick={{ fontSize: 11, fill: '#71717a' }} tickLine={false} />
            <YAxis stroke="#a1a1aa" tick={{ fontSize: 11, fill: '#71717a' }} tickLine={false} domain={['auto', 'auto']} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#e4e4e7',
                borderRadius: '0.5rem',
                color: '#18181b',
                fontSize: '12px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
              }}
            />
            <Line
              type="monotone"
              dataKey="temp"
              stroke="#18181b"
              strokeWidth={2}
              dot={{ r: 2.5, fill: '#18181b' }}
              activeDot={{ r: 5 }}
              isAnimationActive={false}
              name="Температура (°C)"
            />
            <Line
              type="monotone"
              dataKey="humidity"
              stroke="#0284c7"
              strokeWidth={2}
              dot={{ r: 2.5, fill: '#0284c7' }}
              activeDot={{ r: 5 }}
              isAnimationActive={false}
              name="Вологість (%)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
