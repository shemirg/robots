import { useRef, useEffect, useState, useCallback } from 'react';
import { Stage, Layer, Rect, Text, Group, Line } from 'react-konva';
import type Konva from 'konva';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectRobot, pickTaskLocation, cancelTaskPick } from '../store/robotsSlice';
import { WAREHOUSE } from '../data/mock';
import { RobotMarker } from './RobotMarker';

export function WarehouseMap() {
  const dispatch = useAppDispatch();
  const robots = useAppSelector((s) => s.robots.robots);
  const selectedId = useAppSelector((s) => s.robots.selectedRobotId);
  const filterStatus = useAppSelector((s) => s.robots.filterStatus);
  const taskPickMode = useAppSelector((s) => s.robots.taskPickMode);
  const taskPickFrom = useAppSelector((s) => s.robots.taskPickFrom);

  const isPicking = taskPickMode !== 'idle';

  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const [size, setSize] = useState({ width: 800, height: 600 });
  const [scale, setScale] = useState(0.7);
  const [stagePos, setStagePos] = useState({ x: 40, y: 40 });
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setSize({ width, height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handleWheel = useCallback(
    (e: Konva.KonvaEventObject<WheelEvent>) => {
      e.evt.preventDefault();
      const stage = stageRef.current;
      if (!stage) return;

      const oldScale = scale;
      const pointer = stage.getPointerPosition();
      if (!pointer) return;

      const scaleBy = 1.08;
      const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
      const clamped = Math.max(0.25, Math.min(2.5, newScale));

      const mousePointTo = {
        x: (pointer.x - stagePos.x) / oldScale,
        y: (pointer.y - stagePos.y) / oldScale,
      };

      setScale(clamped);
      setStagePos({
        x: pointer.x - mousePointTo.x * clamped,
        y: pointer.y - mousePointTo.y * clamped,
      });
    },
    [scale, stagePos]
  );

  const filtered =
    filterStatus === 'all'
      ? robots
      : robots.filter((r) => r.status === filterStatus);

  const handleLocationClick = (name: string) => {
    if (!isPicking) return;
    dispatch(pickTaskLocation(name));
  };

  return (
    <div ref={containerRef} className="w-full h-full relative bg-slate-900 overflow-hidden">
      {/* Zoom controls */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1">
        <button
          onClick={() => setScale((s) => Math.min(2.5, s * 1.15))}
          className="w-9 h-9 rounded-lg bg-slate-800/90 border border-slate-600 text-slate-200 hover:bg-slate-700 text-lg font-bold"
          title="Приблизить"
        >
          +
        </button>
        <button
          onClick={() => setScale((s) => Math.max(0.25, s / 1.15))}
          className="w-9 h-9 rounded-lg bg-slate-800/90 border border-slate-600 text-slate-200 hover:bg-slate-700 text-lg font-bold"
          title="Отдалить"
        >
          −
        </button>
        <button
          onClick={() => {
            setScale(0.7);
            setStagePos({ x: 40, y: 40 });
          }}
          className="w-9 h-9 rounded-lg bg-slate-800/90 border border-slate-600 text-slate-200 hover:bg-slate-700 text-xs"
          title="Сбросить"
        >
          1:1
        </button>
      </div>

      {/* Подсказка режима выбора задачи */}
      {isPicking && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 bg-sky-900/95 border border-sky-500/60 text-sky-100 text-sm px-4 py-2 rounded-xl shadow-lg">
          <span>
            {taskPickMode === 'picking_from' &&
              'Кликните точку «откуда» (зона или ряд)'}
            {taskPickMode === 'picking_to' && (
              <>
                Кликните точку «куда»
                {taskPickFrom && (
                  <span className="text-sky-300"> · откуда: {taskPickFrom}</span>
                )}
              </>
            )}
          </span>
          <button
            onClick={() => dispatch(cancelTaskPick())}
            className="text-xs px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-600"
          >
            Esc / отмена
          </button>
        </div>
      )}

      <div className="absolute bottom-3 left-3 z-10 text-xs text-slate-400 bg-slate-900/80 px-2 py-1 rounded">
        Масштаб: {(scale * 100).toFixed(0)}%
        {hoveredLocation && isPicking && (
          <span className="text-sky-300"> · {hoveredLocation}</span>
        )}
        {!isPicking && ' · Колесо — zoom · Drag — перемещение'}
      </div>

      <Stage
        ref={stageRef}
        width={size.width}
        height={size.height}
        scaleX={scale}
        scaleY={scale}
        x={stagePos.x}
        y={stagePos.y}
        draggable={!isPicking}
        onWheel={handleWheel}
        onDragEnd={(e) => {
          setStagePos({ x: e.target.x(), y: e.target.y() });
        }}
        onClick={(e) => {
          if (e.target === e.target.getStage()) {
            if (isPicking) return;
            dispatch(selectRobot(null));
          }
        }}
      >
        <Layer>
          {/* Floor */}
          <Rect
            x={0}
            y={0}
            width={WAREHOUSE.width}
            height={WAREHOUSE.height}
            fill="#1e293b"
            stroke="#334155"
            strokeWidth={2}
          />

          {/* Grid */}
          {Array.from({ length: Math.ceil(WAREHOUSE.width / 50) + 1 }).map((_, i) => (
            <Line
              key={`gv-${i}`}
              points={[i * 50, 0, i * 50, WAREHOUSE.height]}
              stroke="#334155"
              strokeWidth={0.5}
              opacity={0.4}
            />
          ))}
          {Array.from({ length: Math.ceil(WAREHOUSE.height / 50) + 1 }).map((_, i) => (
            <Line
              key={`gh-${i}`}
              points={[0, i * 50, WAREHOUSE.width, i * 50]}
              stroke="#334155"
              strokeWidth={0.5}
              opacity={0.4}
            />
          ))}

          {/* Zones */}
          {WAREHOUSE.zones.map((z) => {
            const isFrom = taskPickFrom === z.name;
            const isHover = hoveredLocation === z.name;
            const highlight = isPicking;

            return (
              <Group
                key={z.id}
                onClick={(e) => {
                  e.cancelBubble = true;
                  handleLocationClick(z.name);
                }}
                onTap={(e) => {
                  e.cancelBubble = true;
                  handleLocationClick(z.name);
                }}
                onMouseEnter={() => {
                  if (isPicking) {
                    setHoveredLocation(z.name);
                    const stage = stageRef.current;
                    if (stage) stage.container().style.cursor = 'pointer';
                  }
                }}
                onMouseLeave={() => {
                  setHoveredLocation(null);
                  const stage = stageRef.current;
                  if (stage) stage.container().style.cursor = 'default';
                }}
              >
                <Rect
                  x={z.x}
                  y={z.y}
                  width={z.width}
                  height={z.height}
                  fill={
                    highlight
                      ? isFrom
                        ? '#0e7490'
                        : isHover
                          ? '#0369a1'
                          : '#1d4ed8'
                      : z.color
                  }
                  stroke={highlight ? (isFrom ? '#22d3ee' : '#38bdf8') : '#475569'}
                  strokeWidth={highlight ? 3 : 1}
                  cornerRadius={4}
                  opacity={highlight ? 0.85 : 0.7}
                  shadowColor={highlight ? '#38bdf8' : undefined}
                  shadowBlur={highlight ? 12 : 0}
                  shadowOpacity={highlight ? 0.5 : 0}
                />
                <Text
                  x={z.x + 8}
                  y={z.y + 8}
                  text={z.name}
                  fontSize={13}
                  fill={highlight ? '#e0f2fe' : '#94a3b8'}
                  fontStyle="bold"
                />
                {isFrom && (
                  <Text
                    x={z.x + 8}
                    y={z.y + 28}
                    text="ОТКУДА"
                    fontSize={11}
                    fill="#67e8f9"
                    fontStyle="bold"
                  />
                )}
              </Group>
            );
          })}

          {/* Racks */}
          {WAREHOUSE.racks.map((r) => {
            const isFrom = taskPickFrom === r.name;
            const isHover = hoveredLocation === r.name;
            const highlight = isPicking;

            return (
              <Group
                key={r.id}
                onClick={(e) => {
                  e.cancelBubble = true;
                  handleLocationClick(r.name);
                }}
                onTap={(e) => {
                  e.cancelBubble = true;
                  handleLocationClick(r.name);
                }}
                onMouseEnter={() => {
                  if (isPicking) {
                    setHoveredLocation(r.name);
                    const stage = stageRef.current;
                    if (stage) stage.container().style.cursor = 'pointer';
                  }
                }}
                onMouseLeave={() => {
                  setHoveredLocation(null);
                  const stage = stageRef.current;
                  if (stage) stage.container().style.cursor = 'default';
                }}
              >
                <Rect
                  x={r.x}
                  y={r.y}
                  width={r.width}
                  height={r.height}
                  fill={
                    highlight
                      ? isFrom
                        ? '#0e7490'
                        : isHover
                          ? '#0284c7'
                          : '#1e40af'
                      : '#475569'
                  }
                  stroke={highlight ? (isFrom ? '#22d3ee' : '#38bdf8') : '#64748b'}
                  strokeWidth={highlight ? 2 : 1}
                  cornerRadius={2}
                  shadowColor={highlight ? '#38bdf8' : undefined}
                  shadowBlur={highlight ? 8 : 0}
                  shadowOpacity={highlight ? 0.4 : 0}
                />
              </Group>
            );
          })}

          {/* Robots */}
          {filtered.map((robot) => (
            <RobotMarker
              key={robot.id}
              robot={robot}
              isSelected={robot.id === selectedId}
              onSelect={(id) => {
                if (isPicking) return;
                dispatch(selectRobot(id));
              }}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}