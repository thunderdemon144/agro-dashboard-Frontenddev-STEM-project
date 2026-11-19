import { useState, useEffect } from 'react';
import { Thermometer, Droplets, Sun, Activity, AlertCircle } from 'lucide-react';
import Navbar from './components/Navbar';
import SectorTabs from './components/SectorTabs';
import MetricCard from './components/MetricCard';
import ControlPanel from './components/ControlPanel';
import GreenhouseChart from './components/GreenhouseChart';
import EventLog from './components/EventLog';

const API_URL = 'http://localhost:3001/api';

export default function App() {
  const [sectors, setSectors] = useState([]);
  const [logs, setLogs] = useState([]);
  const [activeId, setActiveId] = useState('');
  const [showOnlyAlerts, setShowOnlyAlerts] = useState(false);
  const [serverOnline, setServerOnline] = useState(true);

  const fetchState = async () => {
    try {
      const res = await fetch(`${API_URL}/state`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setSectors(data.sectors);
      setLogs(data.logs);
      setServerOnline(true);

      if (data.sectors.length > 0) {
        setActiveId((prev) =>
          data.sectors.some((s) => s.id === prev) ? prev : data.sectors[0].id
        );
      }
    } catch {
      setServerOnline(false);
    }
  };

  useEffect(() => {
    fetchState();
    const timer = setInterval(fetchState, 3000);
    return () => clearInterval(timer);
  }, []);

  const activeSector = sectors.find((s) => s.id === activeId) || sectors[0];

  const handleAddSector = async (payload) => {
    const res = await fetch(`${API_URL}/sectors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const created = await res.json();
      await fetchState();
      setActiveId(created.id);
    }
  };

  const handleDeleteSector = async (id) => {
    await fetch(`${API_URL}/sectors/${id}`, { method: 'DELETE' });
    await fetchState();
  };

  const updateControls = async (patch) => {
    if (!activeSector) return;
    await fetch(`${API_URL}/sectors/${activeSector.id}/controls`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    await fetchState();
  };

  const triggerAnomaly = async () => {
    if (!activeSector) return;
    await fetch(`${API_URL}/sectors/${activeSector.id}/anomaly`, { method: 'POST' });
    await fetchState();
  };

  if (!serverOnline) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6 font-sans">
        <div className="bg-white border border-zinc-200 rounded-xl p-6 max-w-md text-center space-y-2">
          <h2 className="text-base font-semibold text-zinc-900">Сервер телеметрії недоступний</h2>
          <p className="text-xs text-zinc-500">
            Запустіть бекенд у другому терміналі командою <code className="bg-zinc-100 px-1.5 py-0.5 rounded">node server/index.js</code>
          </p>
        </div>
      </div>
    );
  }

  if (!activeSector) return null;

  const isTempAlert = activeSector.temp > activeSector.maxTemp;
  const isHumAlert = activeSector.humidity < activeSector.minHumidity;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col font-sans antialiased">
      <Navbar isAuto={activeSector.isAuto} />

      <main className="flex-1 p-6 max-w-6xl mx-auto w-full space-y-5">
        <SectorTabs
          sectors={sectors}
          activeId={activeSector.id}
          onSelect={setActiveId}
          showOnlyAlerts={showOnlyAlerts}
          setShowOnlyAlerts={setShowOnlyAlerts}
          onAddSector={handleAddSector}
          onDeleteSector={handleDeleteSector}
        />

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

        <GreenhouseChart data={activeSector.chart} />

        <ControlPanel
          isAuto={activeSector.isAuto}
          setIsAuto={(val) => updateControls({ isAuto: val })}
          pumpActive={activeSector.pumpActive}
          setPumpActive={(val) => updateControls({ pumpActive: val })}
          fanActive={activeSector.fanActive}
          setFanActive={(val) => updateControls({ fanActive: val })}
        />

        <EventLog logs={logs} />
      </main>
    </div>
  );
}
