import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { assignTask, clearTask, selectRobot, startTaskPick } from '../store/robotsSlice';
import { STATUS_LABELS, STATUS_COLORS } from '../data/mock';

const LOCATIONS = [
  'Зона приёмки',
  'Зона отгрузки',
  'Ряд R-01',
  'Ряд R-05',
  'Ряд R-10',
  'Ряд R-18',
  'Зарядка',
];

export function RobotDetails() {
  const dispatch = useAppDispatch();
  const taskPickMode = useAppSelector((s) => s.robots.taskPickMode);
  const selectedId = useAppSelector((s) => s.robots.selectedRobotId);
  const robot = useAppSelector((s) =>
    s.robots.robots.find((r) => r.id === selectedId)
  );
  const tasks = useAppSelector((s) =>
    s.robots.tasks.filter((t) => t.robotId === selectedId)
  );

  const [from, setFrom] = useState(LOCATIONS[0]);
  const [to, setTo] = useState(LOCATIONS[1]);

  if (!robot) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500 text-sm p-6 text-center">
        Выберите робота на карте или в списке
      </div>
    );
  }

  const color = STATUS_COLORS[robot.status];
  const canAssign =
    robot.status === 'idle' || robot.status === 'moving' || robot.status === 'loading';

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-700 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
            <h2 className="text-base font-semibold text-slate-100">{robot.name}</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{STATUS_LABELS[robot.status]}</p>
        </div>
        <button
          onClick={() => dispatch(selectRobot(null))}
          className="text-slate-500 hover:text-slate-300 text-lg leading-none"
        >
          ×
        </button>
      </div>

      {/* Stats */}
      <div className="px-4 py-3 space-y-3 border-b border-slate-700">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-slate-500">Позиция</p>
            <p className="text-slate-200">
              X: {Math.round(robot.x)}, Y: {Math.round(robot.y)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Направление</p>
            <p className="text-slate-200">{Math.round(robot.rotation)}°</p>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-500">Батарея</span>
            <span className="text-slate-300">{robot.battery}%</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${robot.battery}%`,
                backgroundColor:
                  robot.battery > 40 ? '#22c55e' : robot.battery > 20 ? '#f59e0b' : '#ef4444',
              }}
            />
          </div>
        </div>

        {robot.currentTask && (
          <div>
            <p className="text-xs text-slate-500 mb-1">Текущая задача</p>
            <p className="text-sm text-slate-200">{robot.currentTask}</p>
            <button
              onClick={() => dispatch(clearTask(robot.id))}
              className="mt-2 text-xs text-red-400 hover:text-red-300"
            >
              Отменить задачу
            </button>
          </div>
        )}
      </div>

      {/* Assign task */}
      <div className="px-4 py-3 border-b border-slate-700">
        <h3 className="text-sm font-medium text-slate-200 mb-3">Назначить задание</h3>

        {!canAssign ? (
          <p className="text-xs text-slate-500">
            Робот недоступен ({STATUS_LABELS[robot.status]})
          </p>
        ) : (
          taskPickMode !== 'idle' ?
            <div className="space-y-2">
              <div>
                <label className="text-xs text-slate-500">Откуда</label>
                <select
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-full mt-0.5 bg-slate-800 border border-slate-600 rounded-lg px-2 py-1.5 text-sm text-slate-200"
                >
                  {LOCATIONS.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500">Куда</label>
                <select
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full mt-0.5 bg-slate-800 border border-slate-600 rounded-lg px-2 py-1.5 text-sm text-slate-200"
                >
                  {LOCATIONS.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => {
                  if (from !== to) {
                    dispatch(assignTask({ robotId: robot.id, from, to }));
                  }
                }}
                disabled={from === to}
                className="w-full mt-1 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:bg-slate-700 disabled:text-slate-500 text-sm font-medium text-white transition-colors"
              >
                Отправить
              </button>
            </div>
            :
            <button
              onClick={() => dispatch(startTaskPick())}
              className="w-full mt-1 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:bg-slate-700 disabled:text-slate-500 text-sm font-medium text-white transition-colors"
            >
              Выбрать задачу на карте
            </button>
        )}
      </div>

      {/* Task history */}
      {tasks.length > 0 && (
        <div className="px-4 py-3">
          <h3 className="text-sm font-medium text-slate-200 mb-2">Задачи</h3>
          <ul className="space-y-2">
            {tasks.map((t) => (
              <li key={t.id} className="text-xs bg-slate-800/60 rounded-lg px-3 py-2">
                <span className="text-slate-300">{t.from} → {t.to}</span>
                <span className="block text-slate-500 mt-0.5">
                  {t.status === 'in_progress' ? 'В работе' : t.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
