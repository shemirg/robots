import { useAppSelector } from '../store/hooks';
import { STATUS_COLORS } from '../data/mock';

export function Header() {
  const robots = useAppSelector((s) => s.robots.robots);

  const counts = {
    idle: robots.filter((r) => r.status === 'idle').length,
    moving: robots.filter((r) => r.status === 'moving').length,
    loading: robots.filter((r) => r.status === 'loading').length,
    charging: robots.filter((r) => r.status === 'charging').length,
    error: robots.filter((r) => r.status === 'error').length,
  };

  return (
    <header className="h-12 shrink-0 border-b border-slate-700 bg-slate-900/95 flex items-center px-4 gap-6">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-sky-600 flex items-center justify-center text-white text-xs font-bold">
          W
        </div>
        <span className="font-semibold text-slate-100 text-sm">Warehouse Map</span>
        <span className="text-xs text-slate-500 hidden sm:inline">прототип</span>
      </div>

      <div className="flex items-center gap-3 ml-auto text-xs">
        {(Object.entries(counts) as [keyof typeof counts, number][]).map(([status, count]) => (
          <div key={status} className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: STATUS_COLORS[status] }}
            />
            <span className="text-slate-400">{count}</span>
          </div>
        ))}
      </div>
    </header>
  );
}
