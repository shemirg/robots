import type { Robot, WarehouseConfig, Task } from '../types';

export const WAREHOUSE: WarehouseConfig = {
  width: 1200,
  height: 1000,
  zones: [
    { id: 'z1', name: 'Зона приёмки', x: 20, y: 20, width: 280, height: 160, color: '#1e3a5f' },
    { id: 'z2', name: 'Зона отгрузки', x: 900, y: 20, width: 280, height: 160, color: '#1e3a5f' },
    { id: 'z3', name: 'Зарядка', x: 20, y: 820, width: 200, height: 160, color: '#1a3a2a' },
  ],
  racks: [
    // Row 1
    { id: 'r1',name: 'Ряд R-1', x: 80, y: 220, width: 40, height: 180 },
    { id: 'r2',name: 'Ряд R-2', x: 160, y: 220, width: 40, height: 180 },
    { id: 'r3',name: 'Ряд R-3', x: 240, y: 220, width: 40, height: 180 },
    { id: 'r4',name: 'Ряд R-4', x: 320, y: 220, width: 40, height: 180 },
    { id: 'r5',name: 'Ряд R-5', x: 400, y: 220, width: 40, height: 180 },
    { id: 'r6',name: 'Ряд R-6', x: 480, y: 220, width: 40, height: 180 },
    { id: 'r7',name: 'Ряд R-7', x: 560, y: 220, width: 40, height: 180 },
    { id: 'r8',name: 'Ряд R-8', x: 640, y: 220, width: 40, height: 180 },
    { id: 'r9',name: 'Ряд R-9', x: 720, y: 220, width: 40, height: 180 },
    { id: 'r10',name: 'Ряд R-10', x: 800, y: 220, width: 40, height: 180 },
    { id: 'r11',name: 'Ряд R-11', x: 880, y: 220, width: 40, height: 180 },
    { id: 'r12',name: 'Ряд R-12', x: 960, y: 220, width: 40, height: 180 },
    // Row 2
    { id: 'r13',name: 'Ряд R-13', x: 80, y: 440, width: 40, height: 160 },
    { id: 'r14',name: 'Ряд R-14', x: 160, y: 440, width: 40, height: 160 },
    { id: 'r15',name: 'Ряд R-15', x: 240, y: 440, width: 40, height: 160 },
    { id: 'r16',name: 'Ряд R-16', x: 320, y: 440, width: 40, height: 160 },
    { id: 'r17',name: 'Ряд R-17', x: 400, y: 440, width: 40, height: 160 },
    { id: 'r18',name: 'Ряд R-18', x: 480, y: 440, width: 40, height: 160 },
    { id: 'r19',name: 'Ряд R-19', x: 560, y: 440, width: 40, height: 160 },
    { id: 'r20',name: 'Ряд R-20', x: 640, y: 440, width: 40, height: 160 },
    { id: 'r21',name: 'Ряд R-21', x: 720, y: 440, width: 40, height: 160 },
    { id: 'r22',name: 'Ряд R-22', x: 800, y: 440, width: 40, height: 160 },
    { id: 'r23',name: 'Ряд R-23', x: 880, y: 440, width: 40, height: 160 },
    { id: 'r24',name: 'Ряд R-24', x: 960, y: 440, width: 40, height: 160 },

    // 3
    { id: 'r25',name: 'Ряд R-25', x: 80, y: 660, width: 100, height: 100 },
    { id: 'r251',name: 'Ряд R-251', x: 220, y: 660, width: 100, height: 100 },
    { id: 'r26',name: 'Ряд R-26', x: 360, y: 660, width: 100, height: 100 },
    { id: 'r27',name: 'Ряд R-27', x: 500, y: 660, width: 100, height: 100 },
    { id: 'r28',name: 'Ряд R-28', x: 640, y: 660, width: 100, height: 100 },
    { id: 'r29',name: 'Ряд R-29', x: 780, y: 660, width: 100, height: 100 },
    { id: 'r30',name: 'Ряд R-30', x: 920, y: 660, width: 80, height: 100 },
  ],
};

export const INITIAL_ROBOTS: Robot[] = [
  {
    id: 'bot-1',
    name: 'AGV-01',
    x: 150,
    y: 100,
    rotation: 90,
    status: 'idle',
    battery: 87,
    currentTask: null,
    speed: 40,
  },
  {
    id: 'bot-2',
    name: 'AGV-02',
    x: 500,
    y: 350,
    rotation: 0,
    status: 'moving',
    battery: 62,
    currentTask: 'Перемещение паллеты A-12 → Зона отгрузки',
    speed: 55,
  },
  {
    id: 'bot-3',
    name: 'AGV-03',
    x: 750,
    y: 500,
    rotation: 180,
    status: 'loading',
    battery: 45,
    currentTask: 'Погрузка в ряд R-18',
    speed: 30,
  },
  {
    id: 'bot-4',
    name: 'AGV-04',
    x: 100,
    y: 880,
    rotation: 0,
    status: 'charging',
    battery: 23,
    currentTask: null,
    speed: 0,
  },
  {
    id: 'bot-5',
    name: 'AGV-05',
    x: 1050,
    y: 100,
    rotation: 270,
    status: 'idle',
    battery: 91,
    currentTask: null,
    speed: 45,
  },
  {
    id: 'bot-6',
    name: 'AGV-06',
    x: 300,
    y: 600,
    rotation: 45,
    status: 'error',
    battery: 55,
    currentTask: null,
    speed: 0,
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    robotId: 'bot-2',
    from: 'Ряд R-05',
    to: 'Зона отгрузки',
    status: 'in_progress',
    createdAt: Date.now() - 120000,
  },
  {
    id: 'task-2',
    robotId: 'bot-3',
    from: 'Зона приёмки',
    to: 'Ряд R-18',
    status: 'in_progress',
    createdAt: Date.now() - 60000,
  },
];

export const STATUS_LABELS: Record<string, string> = {
  idle: 'Свободен',
  moving: 'В движении',
  loading: 'Погрузка',
  error: 'Ошибка',
  charging: 'Зарядка',
};

export const STATUS_COLORS: Record<string, string> = {
  idle: '#22c55e',
  moving: '#3b82f6',
  loading: '#f59e0b',
  error: '#ef4444',
  charging: '#a855f7',
};
