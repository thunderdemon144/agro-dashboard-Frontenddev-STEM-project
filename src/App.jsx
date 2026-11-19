import { useState, useEffect } from 'react';
import { Thermometer, Droplets, Sun, Activity, Flame } from 'lucide-react';
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

  const addLog = (message, type = 'info') => {
    const now = new Date().toLocaleTimeString('uk-UA');
    setLogs((prev) => [{ id: Date.now() + Math.random(), time: now, type, message }, ...prev.slice(0, 19)]);
  };

  // Обробники перемикачів із записом у журнал
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

  // Кнопка для демонстрації критичної ситуації на захисті
  const triggerAnomaly = () => {
    setTemp(31.4);
    setHumidity(46.0);
    addLog('КРИТИЧНЕ ВІДХИЛЕННЯ: зафіксовано перегрів (31.4°C) та падіння вологості ґрунту (46%)!', 'warning');
  };

  // Головний цикл оновлення телеметрії кожні 4 секунди
  useEffect(() => {
    const interval = setInterval(() => {
      setTemp((prevTemp) => {
        let change = (Math.random() - 0.48) * 0.4;
        if (fanActive) change = -0.6; // Вентиляція охолоджує повітря
        const nextTemp = Number(Math.max(15, Math.min(40, prevTemp + change)).toFixed(1));

        // Автоматична реакція системи в режимі Auto
        if (isAuto && nextTemp > 28 && !fanActive) {
          setFanActive(true);
          addLog(`Автоматика: температура ${nextTemp}°C перевищила поріг. Запущено вентиляцію.`, 'warning');
        } else if (isAuto && nextTemp <= 25 && fanActive) {
          setFanActive(false);
          addLog(`Автоматика: температура стабілізувалася (${nextTemp}°C). Вентиляцію вимкнено.`, 'info');
        }

        return nextTemp;
      });

      setHumidity((prevHum) => {
        let change = (Math.random() - 0.52) * 0.5;
        if (pumpActive) change = +1.2; // Полив підвищує вологість
        const nextHum = Number(Math.max(30, Math.min(95, prevHum + change)).toFixed(1));

        if (isAuto && nextHum < 55 && !pumpActive) {
          setPumpActive(true);
          addLog(`Автоматика: вологість впала до ${nextHum}%. Активовано автополив.`, 'warning');
        } else if (isAuto && nextHum >= 68 && pumpActive) {
          setPumpActive(false);
          addLog(`Автоматика: вологість досягла норми (${nextHum}%). Полив зупинено.`, 'info');
        }

        // Оновлюємо графік новими показниками
        const timeLabel = new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setChartData((prevChart) => [
          ...prevChart.slice(-9), // Тримаємо останні 10 точок, щоб графік не стискався
          { time: timeLabel, temp, humidity: nextHum },
        ]);

        return nextHum;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isAuto, pumpActive, fanActive, temp]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar isAuto={isAuto} />

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Верхній банер + кнопка тестової аномалії */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/20 p-6 rounded-2xl shadow-xl">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Моніторинг клімату теплиці в реальному часі</h2>
            <p className="text-sm text-slate-400 mt-1">Збір телеметрії з датчиків ESP32 та керування виконавчими механізмами.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={triggerAnomaly}
              className="flex items-center space-x-2 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 px-4 py-2 rounded-xl text-rose-300 text-xs font-semibold transition-all cursor-pointer"
            >
              <Flame className="w-4 h-4 text-rose-400" />
              <span>Симулювати перегрів / посуху</span>
            </button>
          </div>
        </div>

        {/* Сітка карток датчиків */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <MetricCard
            title="Температура повітря"
            value={temp}
            unit="°C"
            icon={Thermometer}
            status={temp > 28 ? 'Перегрів!' : fanActive ? 'Охолодження' : 'Норма'}
            trend={fanActive ? 'Знижується (-)' : 'Стабільно'}
          />
          <MetricCard
            title="Вологість ґрунту"
            value={humidity}
            unit="%"
            icon={Droplets}
            status={humidity < 55 ? 'Критично низька!' : pumpActive ? 'Полив активний' : 'Оптимально'}
            trend={pumpActive ? 'Зростає (+)' : 'У межах норми'}
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
            trend="Без аномалій"
          />
        </div>

        {/* Графік телеметрії */}
        <GreenhouseChart data={chartData} />

        {/* Панель керування */}
        <ControlPanel
          isAuto={isAuto}
          setIsAuto={handleToggleAuto}
          pumpActive={pumpActive}
          setPumpActive={handleTogglePump}
          fanActive={fanActive}
          setFanActive={handleToggleFan}
        />

        {/* Журнал подій */}
        <EventLog logs={logs} />
      </main>
    </div>
  );
}
