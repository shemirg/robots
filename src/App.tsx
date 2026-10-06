import { useEffect } from 'react';
import { Header } from './components/Header';
import { WarehouseMap } from './components/WarehouseMap';
import { RobotList } from './components/RobotList';
import { RobotDetails } from './components/RobotDetails';
import { useAppDispatch } from './store/hooks';
import { tickRobots } from './store/robotsSlice';

export default function App() {
  const dispatch = useAppDispatch();

  // Mock realtime movement
  useEffect(() => {
    const id = setInterval(() => {
      dispatch(tickRobots());
    }, 50); // ~20 fps
    return () => clearInterval(id);
  }, [dispatch]);

  return (
    <div className="h-full flex flex-col">
      <Header />
      <div className="flex-1 flex min-h-0">
        {/* Left sidebar — robot list */}
        <aside className="w-64 shrink-0 border-r border-slate-700 bg-slate-900 flex flex-col">
          <RobotList />
        </aside>

        {/* Center — map */}
        <main className="flex-1 min-w-0">
          <WarehouseMap />
        </main>

        {/* Right sidebar — details */}
        <aside className="w-72 shrink-0 border-l border-slate-700 bg-slate-900 flex flex-col">
          <RobotDetails />
        </aside>
      </div>
    </div>
  );
}
