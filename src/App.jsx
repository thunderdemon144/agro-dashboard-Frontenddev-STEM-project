import { useState, useEffect, useRef } from 'react';
import { Thermometer, Droplets, Sun, Activity, AlertCircle } from 'lucide-react';
import Navbar from './components/Navbar';
import MetricCard from './components/MetricCard';
import ControlPanel from './components/ControlPanel';
import GreenhouseChart from './components/GreenhouseChart';
import EventLog from './components/EventLog';

const initialChartData = [
  { time: '12:00', temp: 23.2, humidity: 70.0 },
  { time: '13:00', temp: 24.0, humidity: 69.2 },
  { time: '14:00', temp: 24.5, humidity: 68.8 },
  { time: '15:00', temp: 24.8, humidity: 68.5 },
];

export default function App() {
  const [isAuto, setIsAuto] = useState(true);
  const [pumpActive, setPumpActive] = useState(false);
  const [fanActive, setFanActive] = useState(false);

  const [temp, setTemp] = useState(25.1);
  const [humidity, setHumidity] = useState(68.5);
  const [chartData, setChartData] = useState(initialChartData);
  const [logs, setLogs] = useState([
    { id: 1, time: '15:00:00', type: 'info', message: 'Ініціалізація панелі диспетчеризації. Зв’язок із вузлом ESP32 встановлено.' },
  ]);

  const stateRef = useRef({ isAuto, pumpActive, fanActive, temp, humidity });
  useEffect(() => {
    stateRef.current = { isAuto, pumpActive, fanActive, temp, humidity };
  }, [isAuto, pumpActive, fanActive, temp, humidity]);

  const addLog = (message, type = 'info') => {
    const now = new Date().toLocaleTimeString('uk-UA');
    setLogs((prev) => [{ id: Date.now() + Math.random(), time: now, type, message }, ...prev.slice(0, 19)]);
  };

  const handleToggleAuto = (newVal) => {
    setIsAuto(newVal);
    addLog(
      newVal ? 'Переведено в автоматичний режим регулювання мікроклімату.' : 'Увімкнено ручний диспетчерський контроль.',
      'action'
    );
  };

  const handleTogglePump = (newVal) => {
    setPumpActive(newVal);
    addLog(newVal ? 'Оператор увімкнув систему крапельного поливу (Сектор №1).' : 'Оператор вимкнув полив.', 'action');
  };

  const handleToggleFan = (newVal) => {
    setFanActive(newVal);
    addLog(newVal ? 'Оператор запустив витяжну вентиляцію купола.' : 'Оператор зупинив вентиляцію.', 'action');
  };

  const triggerAnomaly = () => {
    setTemp(31.4);
    setHumidity(46.0);
    addLog('Критичне відхилення: зафіксовано перегрів (31.4°C) та падіння вологості ґрунту (46%).', 'warning');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const { isAuto: auto, pumpActive: pump, fanActive: fan, temp: curTemp, humidity: curHum } = stateRef.current;

      let tempDelta = (Math.random() - 0.48) * 0.3;
      if (fan) tempDelta = -0.6;
      const nextTemp = Number(Math.max(15, Math.min(40, curTemp + tempDelta)).toFixed(1));

      if (auto && nextTemp > 28 && !fan) {
        setFanActive(true);
        addLog(`Автоматика: температура ${nextTemp}°C перевищила поріг (28°C). Запущено вентиляцію.`, 'warning');
      } else if (auto && nextTemp <= 25 && fan) {
        setFanActive(false);
        addLog(`Автоматика: температура стабілізувалася (${nextTemp}°C). Вентиляцію вимкнено.`, 'info');
      }

      let humDelta = (Math.random() - 0.52) * 0.4;
      if (pump) humDelta = +1.4;
      const nextHum = Number(Math.max(30, Math.min(95, curHum + humDelta)).toFixed(1));

      if (auto && nextHum < 55 && !pump) {
        setPumpActive(true);
        addLog(`Автоматика: вологість впала до ${nextHum}%. Активовано автополив.`, 'warning');
      } else if (auto && nextHum >= 68 && pump) {
        setPumpActive(false);
        addLog(`Автоматика: вологість досягла норми (${nextHum}%). Полив зупинено.`, 'info');
      }

      setTemp(nextTemp);
      setHumidity(nextHum);

      const timeLabel = new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setChartData((prevChart) => [
        ...prevChart.slice(-9),
        { time: timeLabel, temp: nextTemp, humidity: nextHum },
      ]);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col font-sans antialiased">
      <Navbar isAuto={isAuto} />

      <main className="flex-1 p-6 max-w-6xl mx-auto w-full space-y-5">
        {/* Заголовок робочої області */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">Оперативні показники середовища</h2>
            <p className="text-xs text-zinc-500">Діапазон норми: 18–28 °C / 55–80 % вологості</p>
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
            value={temp}
            unit="°C"
            icon={Thermometer}
            status={temp > 28 ? 'Перевищення норми' : fanActive ? 'Охолодження' : 'Норма'}
            isAlert={temp > 28}
          />
          <MetricCard
            title="Вологість ґрунту"
            value={humidity}
            unit="%"
            icon={Droplets}
            status={humidity < 55 ? 'Нижче порогу' : pumpActive ? 'Триває полив' : 'Норма'}
            isAlert={humidity < 55}
          />
          <MetricCard
            title="Освітленість"
            value="45 200"
            unit="lux"
            icon={Sun}
            status="Штатний рівень"
            isAlert={false}
          />
          <MetricCard
            title="Рівень CO₂"
            value="410"
            unit="ppm"
            icon={Activity}
            status="Норма"
            isAlert={false}
          />
        </div>

        {/* Графік */}
        <GreenhouseChart data={chartData} />

        {/* Керування */}
        <ControlPanel
          isAuto={isAuto}
          setIsAuto={handleToggleAuto}
          pumpActive={pumpActive}
          setPumpActive={handleTogglePump}
          fanActive={fanActive}
          setFanActive={handleToggleFan}
        />

        {/* Журнал */}
        <EventLog logs={logs} />
      </main>
    </div>
  );
}
