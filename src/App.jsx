import { useState, useEffect, useRef } from 'react';
import { Thermometer, Droplets, Sun, Activity, AlertCircle } from 'lucide-react';
import Navbar from './components/Navbar';
import SectorTabs from './components/SectorTabs';
import MetricCard from './components/MetricCard';
import ControlPanel from './components/ControlPanel';
import GreenhouseChart from './components/GreenhouseChart';
import EventLog from './components/EventLog';

const initialSectors = [
  {
    id: 'sec-1',
    name: 'Сектор №1 · Томати',
    minTemp: 18,
    maxTemp: 28,
    minHumidity: 55,
    targetHumidity: 68,
    temp: 24.6,
    humidity: 66.0,
    light: '45 200',
    co2: '410',
    isAuto: true,
    pumpActive: false,
    fanActive: false,
    chart: [
      { time: '12:00', temp: 23.2, humidity: 68.0 },
      { time: '13:00', temp: 24.0, humidity: 67.2 },
      { time: '14:00', temp: 24.3, humidity: 66.5 },
      { time: '15:00', temp: 24.6, humidity: 66.0 },
    ],
  },
  {
    id: 'sec-2',
    name: 'Сектор №2 · Огірки',
    minTemp: 20,
    maxTemp: 30,
    minHumidity: 65,
    targetHumidity: 76,
    temp: 26.4,
    humidity: 74.5,
    light: '38 900',
    co2: '435',
    isAuto: true,
    pumpActive: false,
    fanActive: false,
    chart: [
      { time: '12:00', temp: 25.1, humidity: 76.0 },
      { time: '13:00', temp: 25.8, humidity: 75.4 },
      { time: '14:00', temp: 26.1, humidity: 74.9 },
      { time: '15:00', temp: 26.4, humidity: 74.5 },
    ],
  },
  {
    id: 'sec-3',
    name: 'Сектор №3 · Розсада',
    minTemp: 19,
    maxTemp: 26,
    minHumidity: 60,
    targetHumidity: 72,
    temp: 22.8,
    humidity: 70.2,
    light: '29 400',
    co2: '395',
    isAuto: true,
    pumpActive: false,
    fanActive: false,
    chart: [
      { time: '12:00', temp: 21.9, humidity: 71.5 },
      { time: '13:00', temp: 22.3, humidity: 71.0 },
      { time: '14:00', temp: 22.5, humidity: 70.6 },
      { time: '15:00', temp: 22.8, humidity: 70.2 },
    ],
  },
];

export default function App() {
  const [sectors, setSectors] = useState(initialSectors);
  const [activeId, setActiveId] = useState('sec-1');
  const [showOnlyAlerts, setShowOnlyAlerts] = useState(false);
  const [logs, setLogs] = useState([
    { id: 1, time: '15:00:00', type: 'info', message: 'Систему диспетчеризації запущено. Підключено 3 сенсорні вузли ESP32.' },
  ]);

  const activeSector = sectors.find((s) => s.id === activeId) || sectors[0];

  const sectorsRef = useRef(sectors);
  useEffect(() => {
    sectorsRef.current = sectors;
  }, [sectors]);

  const addLog = (message, type = 'info') => {
    const now = new Date().toLocaleTimeString('uk-UA');
    setLogs((prev) => [{ id: Date.now() + Math.random(), time: now, type, message }, ...prev.slice(0, 24)]);
  };

  const updateSector = (id, patch) => {
    setSectors((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const handleToggleAuto = (newVal) => {
    updateSector(activeSector.id, { isAuto: newVal });
    addLog(
      `[${activeSector.name}] ${newVal ? 'Увімкнено автоматичний режим.' : 'Переведено в ручний контроль.'}`,
      'action'
    );
  };

  const handleTogglePump = (newVal) => {
    updateSector(activeSector.id, { pumpActive: newVal });
    addLog(
      `[${activeSector.name}] Оператор ${newVal ? 'запустив полив' : 'зупинив полив'}.`,
      'action'
    );
  };

  const handleToggleFan = (newVal) => {
    updateSector(activeSector.id, { fanActive: newVal });
    addLog(
      `[${activeSector.name}] Оператор ${newVal ? 'увімкнув вентиляцію' : 'вимкнув вентиляцію'}.`,
      'action'
    );
  };

  const triggerAnomaly = () => {
    const spikeTemp = Number((activeSector.maxTemp + 3.4).toFixed(1));
    const dropHum = Number((activeSector.minHumidity - 9.0).toFixed(1));
    updateSector(activeSector.id, { temp: spikeTemp, humidity: dropHum });
    addLog(
      `[${activeSector.name}] Аварійне відхилення: ${spikeTemp}°C, вологість ${dropHum}%.`,
      'warning'
    );
  };

  // Фонове опитування всіх 3 секторів кожні 6 секунд
  useEffect(() => {
    const interval = setInterval(() => {
      const timeLabel = new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      setSectors((prevSectors) =>
        prevSectors.map((sec) => {
          let tempDelta = (Math.random() - 0.48) * 0.3;
          if (sec.fanActive) tempDelta = -0.6;
          const nextTemp = Number(Math.max(15, Math.min(42, sec.temp + tempDelta)).toFixed(1));

          let nextFan = sec.fanActive;
          if (sec.isAuto && nextTemp > sec.maxTemp && !sec.fanActive) {
            nextFan = true;
            addLog(`[${sec.name}] Автоматика: перегрів (${nextTemp}°C). Активовано вентиляцію.`, 'warning');
          } else if (sec.isAuto && nextTemp <= sec.maxTemp - 3 && sec.fanActive) {
            nextFan = false;
            addLog(`[${sec.name}] Автоматика: температуру нормалізовано (${nextTemp}°C).`, 'info');
          }

          let humDelta = (Math.random() - 0.52) * 0.4;
          if (sec.pumpActive) humDelta = +1.4;
          const nextHum = Number(Math.max(30, Math.min(95, sec.humidity + humDelta)).toFixed(1));

          let nextPump = sec.pumpActive;
          if (sec.isAuto && nextHum < sec.minHumidity && !sec.pumpActive) {
            nextPump = true;
            addLog(`[${sec.name}] Автоматика: низька вологість (${nextHum}%). Запущено полив.`, 'warning');
          } else if (sec.isAuto && nextHum >= sec.targetHumidity && sec.pumpActive) {
            nextPump = false;
            addLog(`[${sec.name}] Автоматика: вологість у нормі (${nextHum}%). Полив зупинено.`, 'info');
          }

          return {
            ...sec,
            temp: nextTemp,
            humidity: nextHum,
            fanActive: nextFan,
            pumpActive: nextPump,
            chart: [...sec.chart.slice(-9), { time: timeLabel, temp: nextTemp, humidity: nextHum }],
          };
        })
      );
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const isTempAlert = activeSector.temp > activeSector.maxTemp;
  const isHumAlert = activeSector.humidity < activeSector.minHumidity;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col font-sans antialiased">
      <Navbar isAuto={activeSector.isAuto} />

      <main className="flex-1 p-6 max-w-6xl mx-auto w-full space-y-5">
        {/* Навігація по секторах + фільтр */}
        <SectorTabs
          sectors={sectors}
          activeId={activeSector.id}
          onSelect={setActiveId}
          showOnlyAlerts={showOnlyAlerts}
          setShowOnlyAlerts={setShowOnlyAlerts}
        />

        {/* Заголовок сектора + тест збою */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">{activeSector.name}</h2>
            <p className="text-xs text-zinc-500">
              Допустимі межі: {activeSector.minTemp}–{activeSector.maxTemp} °C · вологість від {activeSector.minHumidity} %
            </p>
          </div>
          <button
            onClick={triggerAnomaly}
            className="flex items-center space-x-1.5 bg-white hover:bg-rose-50 border border-zinc-300 hover:border-rose-300 px-3 py-1.5 rounded-lg text-zinc-700 hover:text-rose-700 text-xs font-medium transition-colors cursor-pointer"
          >
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Тест аварійного відхилення</span>
          </button>
        </div>

        {/* Картки метрик */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Температура"
            value={activeSector.temp}
            unit="°C"
            icon={Thermometer}
            status={isTempAlert ? `Вище ${activeSector.maxTemp}°C` : activeSector.fanActive ? 'Охолодження' : 'Норма'}
            isAlert={isTempAlert}
          />
          <MetricCard
            title="Вологість ґрунту"
            value={activeSector.humidity}
            unit="%"
            icon={Droplets}
            status={isHumAlert ? `Нижче ${activeSector.minHumidity}%` : activeSector.pumpActive ? 'Триває полив' : 'Норма'}
            isAlert={isHumAlert}
          />
          <MetricCard
            title="Освітленість"
            value={activeSector.light}
            unit="lux"
            icon={Sun}
            status="Штатний рівень"
            isAlert={false}
          />
          <MetricCard
            title="Рівень CO₂"
            value={activeSector.co2}
            unit="ppm"
            icon={Activity}
            status="Норма"
            isAlert={false}
          />
        </div>

        {/* Графік */}
        <GreenhouseChart data={activeSector.chart} />

        {/* Керування */}
        <ControlPanel
          isAuto={activeSector.isAuto}
          setIsAuto={handleToggleAuto}
          pumpActive={activeSector.pumpActive}
          setPumpActive={handleTogglePump}
          fanActive={activeSector.fanActive}
          setFanActive={handleToggleFan}
        />

        {/* Журнал */}
        <EventLog logs={logs} />
      </main>
    </div>
  );
}
