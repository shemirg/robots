import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectRobot, setFilterStatus } from '../store/robotsSlice';
import { STATUS_LABELS, STATUS_COLORS } from '../data/mock';
import type { RobotStatus } from '../types';

const FILTERS: Array<RobotStatus | 'all'> = ['all', 'idle', 'moving', 'loading', 'charging', 'error'];

export function RobotList() {
  const dispatch = useAppDispatch();
  const robots = useAppSelector((s) => s.robots.robots);
  const selectedId = useAppSelector((s) => s.robots.selectedRobotId);
  const filterStatus = useAppSelector((s) => s.robots.filterStatus);

  const filtered =
    filterStatus === 'all' ? robots : robots.filter((r) => r.status === filterStatus);

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-slate-700">
        <h2 className="text-sm font-semibold text-slate-200 mb-2">Роботы ({robots.length})</h2>
        <div className="flex flex-wrap gap-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => dispatch(setFilterStatus(f))}
              className={`px-2 py-0.5 rounded text-xs transition-colors ${
                filterStatus === f
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {f === 'all' ? 'Все' : STATUS_LABELS[f]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 && (
          <p className="text-slate-500 text-sm p-4">Нет роботов с таким статусом</p>
        )}
        {filtered.map((robot) => {
          const isSelected = robot.id === selectedId;
          const color = STATUS_COLORS[robot.status];

          return (
            <button
              key={robot.id}
              onClick={() => dispatch(selectRobot(robot.id))}
              className={`w-full text-left px-4 py-3 border-b border-slate-800 transition-colors ${
                isSelected ? 'bg-slate-800/80' : 'hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="font-medium text-sm text-slate-100">{robot.name}</span>
                <span className="ml-auto text-xs text-slate-500">{STATUS_LABELS[robot.status]}</span>
              </div>

              {/* Battery bar */}
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${robot.battery}%`,
                      backgroundColor:
                        robot.battery > 40 ? '#22c55e' : robot.battery > 20 ? '#f59e0b' : '#ef4444',
                    }}
                  />
                </div>
                <span className="text-xs text-slate-400 w-8 text-right">{robot.battery}%</span>
              </div>

              {robot.currentTask && (
                <p className="text-xs text-slate-500 mt-1 truncate">{robot.currentTask}</p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
