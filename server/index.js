import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Початковий стан секторів у пам'яті сервера
let sectors = [
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
];

let logs = [
  {
    id: 1,
    time: new Date().toLocaleTimeString('uk-UA'),
    type: 'info',
    message: 'Сервер телеметрії запущено. Опитування віртуальних контролерів ESP32 активне.',
  },
];

function addLog(message, type = 'info') {
  const time = new Date().toLocaleTimeString('uk-UA');
  logs.unshift({ id: Date.now() + Math.random(), time, type, message });
  if (logs.length > 30) logs.pop();
}

// Серверний цикл симуляції телеметрії кожні 5 секунд
setInterval(() => {
  const timeLabel = new Date().toLocaleTimeString('uk-UA', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  sectors = sectors.map((sec) => {
    let tempDelta = (Math.random() - 0.48) * 0.3;
    if (sec.fanActive) tempDelta = -0.6;
    const nextTemp = Number(Math.max(15, Math.min(42, sec.temp + tempDelta)).toFixed(1));

    let nextFan = sec.fanActive;
    if (sec.isAuto && nextTemp > sec.maxTemp && !sec.fanActive) {
      nextFan = true;
      addLog(`[${sec.name}] Автоматика: перегрів (${nextTemp}°C). Активовано вентиляцію.`, 'warning');
    } else if (sec.isAuto && nextTemp <= sec.maxTemp - 3 && sec.fanActive) {
      nextFan = false;
      addLog(`[${sec.name}] Автоматика: температуру стабілізовано (${nextTemp}°C).`, 'info');
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
  });
}, 5000);

// --- REST API ЕНДПОІНТИ ---

// 1. Отримати актуальний стан секторів і логів
app.get('/api/state', (req, res) => {
  res.json({ sectors, logs });
});

// 2. Додати новий сектор
app.post('/api/sectors', (req, res) => {
  const { name, minTemp = 18, maxTemp = 28, minHumidity = 55 } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Назва сектора обов’язкова' });
  }

  const now = new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const startTemp = Number(((Number(minTemp) + Number(maxTemp)) / 2).toFixed(1));
  const startHum = Number(minHumidity) + 10;

  const newSector = {
    id: `sec-${Date.now()}`,
    name: name.trim(),
    minTemp: Number(minTemp),
    maxTemp: Number(maxTemp),
    minHumidity: Number(minHumidity),
    targetHumidity: Number(minHumidity) + 12,
    temp: startTemp,
    humidity: startHum,
    light: '41 000',
    co2: '405',
    isAuto: true,
    pumpActive: false,
    fanActive: false,
    chart: [{ time: now, temp: startTemp, humidity: startHum }],
  };

  sectors.push(newSector);
  addLog(`Підключено новий вузол моніторингу: "${newSector.name}".`, 'action');
  res.status(201).json(newSector);
});

// 3. Видалити сектор
app.delete('/api/sectors/:id', (req, res) => {
  const { id } = req.params;
  if (sectors.length <= 1) {
    return res.status(400).json({ error: 'Неможливо видалити останній активний сектор' });
  }

  const target = sectors.find((s) => s.id === id);
  if (!target) return res.status(404).json({ error: 'Сектор не знайдено' });

  sectors = sectors.filter((s) => s.id !== id);
  addLog(`Вузол "${target.name}" відключено та видалено із системи.`, 'warning');
  res.json({ success: true });
});

// 4. Керування виконавчими механізмами (Авто / Полив / Вентиляція)
app.patch('/api/sectors/:id/controls', (req, res) => {
  const { id } = req.params;
  const { isAuto, pumpActive, fanActive } = req.body;

  const sector = sectors.find((s) => s.id === id);
  if (!sector) return res.status(404).json({ error: 'Сектор не знайдено' });

  if (typeof isAuto === 'boolean') {
    sector.isAuto = isAuto;
    addLog(`[${sector.name}] ${isAuto ? 'Увімкнено автоматичний режим.' : 'Переведено в ручний контроль.'}`, 'action');
  }
  if (typeof pumpActive === 'boolean') {
    sector.pumpActive = pumpActive;
    addLog(`[${sector.name}] Оператор ${pumpActive ? 'запустив полив' : 'зупинив полив'}.`, 'action');
  }
  if (typeof fanActive === 'boolean') {
    sector.fanActive = fanActive;
    addLog(`[${sector.name}] Оператор ${fanActive ? 'увімкнув вентиляцію' : 'вимкнув вентиляцію'}.`, 'action');
  }

  res.json(sector);
});

// 5. Симуляція аварії на конкретному секторі
app.post('/api/sectors/:id/anomaly', (req, res) => {
  const sector = sectors.find((s) => s.id === req.params.id);
  if (!sector) return res.status(404).json({ error: 'Сектор не знайдено' });

  sector.temp = Number((sector.maxTemp + 3.5).toFixed(1));
  sector.humidity = Number((sector.minHumidity - 9.0).toFixed(1));
  addLog(`[${sector.name}] Аварійне відхилення: ${sector.temp}°C, вологість ${sector.humidity}%.`, 'warning');

  res.json(sector);
});

app.listen(PORT, () => {
  console.log(`AgroIoT Backend API running on http://localhost:${PORT}`);
});
