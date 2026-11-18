import { useState } from 'react';
import { Thermometer, Droplets, Sun, Activity } from 'lucide-react';
import Navbar from './components/Navbar';
import MetricCard from './components/MetricCard';
import ControlPanel from './components/ControlPanel';

export default function App() {
  const [isAuto, setIsAuto] = useState(true);
  const [pumpActive, setPumpActive] = useState(false);
  const [fanActive, setFanActive] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Вітальне інфо */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/20 p-6 rounded-2xl shadow-xl">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Моніторинг клімату теплиці в реальному часі</h2>
            <p className="text-sm text-slate-400 mt-1">Збір телеметрії з датчиків ESP32 та керування виконавчими механізмами.</p>
          </div>
          <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-xl text-emerald-300 text-xs font-semibold">
            <Activity className="w-4 h-4 animate-spin text-emerald-400" />
            <span>Статус: Дані оновлюються штатно</span>
          </div>
        </div>

        {/* Сітка карток датчиків */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <MetricCard
            title="Температура повітря"
            value="24.8"
            unit="°C"
            icon={Thermometer}
            status="Норма"
            trend="+0.4°C за годину"
          />
          <MetricCard
            title="Вологість ґрунту"
            value="68.5"
            unit="%"
            icon={Droplets}
            status={pumpActive ? "Полив активний" : "Оптимально"}
            trend="-1.2% за годину"
          />
          <MetricCard
            title="Рівень освітленості"
            value="45200"
            unit="lux"
            icon={Sun}
            status="День"
            trend="Пік активності"
          />
          <MetricCard
            title="Концентрація CO2"
            value="410"
            unit="ppm"
            icon={Activity}
            status="Стабільно"
            trend="Без звітних аномалій"
          />
        </div>

        {/* Панель керування */}
        <ControlPanel
          isAuto={isAuto}
          setIsAuto={setIsAuto}
          pumpActive={pumpActive}
          setPumpActive={setPumpActive}
          fanActive={fanActive}
          setFanActive={setFanActive}
        />
      </main>
    </div>
  );
}
