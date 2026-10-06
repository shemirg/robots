import { useRef, useEffect, useState, useCallback } from 'react';
import type Konva from 'konva';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { pickTaskLocation, selectRobot } from '../store/robotsSlice';
import { WAREHOUSE, STATUS_COLORS } from '../data/mock';
import useImage from 'use-image';
import { Stage, Layer, Rect, Text, Group, Line } from 'react-konva';
import { RobotMarker } from './RobotMarker';


const ROBOT_SIZE = 28;


export function WarehouseMap() {
  const dispatch = useAppDispatch();
  const robots = useAppSelector((s) => s.robots.robots);
  const selectedId = useAppSelector((s) => s.robots.selectedRobotId);
  const filterStatus = useAppSelector((s) => s.robots.filterStatus);
  const taskPickMode = useAppSelector((s) => s.robots.taskPickMode);
  const taskPickFrom = useAppSelector((s) => s.robots.taskPickFrom);

  const isPicking = taskPickMode !== 'idle'

  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const [size, setSize] = useState({ width: 800, height: 600 });
  const [scale, setScale] = useState(0.7);
  const [stagePos, setStagePos] = useState({ x: 40, y: 40 });

  // Resize observer
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

  const handleWheel = useCallback((e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = scale;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const scaleBy = 1.02;
    // const scaleBy = 1.08;
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
  }, [scale, stagePos]);

  const filtered = filterStatus === 'all'
    ? robots
    : robots.filter((r) => r.status === filterStatus);


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
          onClick={() => { setScale(0.7); setStagePos({ x: 40, y: 40 }); }}
          className="w-9 h-9 rounded-lg bg-slate-800/90 border border-slate-600 text-slate-200 hover:bg-slate-700 text-xs"
          title="Сбросить"
        >
          1:1
        </button>
      </div>

      <div className="absolute bottom-3 left-3 z-10 text-xs text-slate-400 bg-slate-900/80 px-2 py-1 rounded">
        Масштаб: {(scale * 100).toFixed(0)}% · Колесо — zoom · Drag — перемещение
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
          // click on empty space deselects
          if (e.target === e.target.getStage()) {
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

          <Group>
            {/* Zones */}
            {WAREHOUSE.zones.map((z) => (
              <Group
                key={z.id}
                onClick={() => dispatch(pickTaskLocation({ mode: 'idle', name: z.name }))}
              >
                <Rect
                  x={z.x}
                  y={z.y}
                  width={z.width}
                  height={z.height}
                  fill={isPicking ? '#D43F51' : z.color}
                  stroke="#475569"
                  strokeWidth={1}
                  cornerRadius={4}
                  opacity={0.7}
                />
                <Text
                  x={z.x + 8}
                  y={z.y + 8}
                  text={z.name}
                  fontSize={13}
                  fill="#94a3b8"
                  fontStyle="bold"
                />
              </Group>
            ))}

            {/* Racks */}
            {WAREHOUSE.racks.map((r) => (
              <Group
                key={r.id}
                onClick={() => dispatch(pickTaskLocation({ mode: 'idle', name: r.name }))}
              >
                <Rect
                  x={r.x}
                  y={r.y}
                  width={r.width}
                  height={r.height}
                  fill={isPicking ? '#D43F51' : "#475569"}
                  // fill="#475569"
                  stroke="#64748b"
                  strokeWidth={1}
                  cornerRadius={2}
                  data={{ myData: r.id }}
                  onClick={(e) => {

                    const node = e.target;

                    // Получаем координаты, имя, id или кастомные данные
                    console.log('ID элемента:', node.id());
                    console.log('Имя элемента:', node.name());
                    console.log('Позиция X, Y:', node.x(), node.y());

                    console.log('Кастомные данные:', node.getAttr('data'));

                    // console.log(e.target, e.target.getStage())
                    // click on empty space deselects
                    if (e.target === e.target.getStage()) {
                      dispatch(selectRobot(null));
                    }
                  }}
                />
              </Group>
            ))}
          </Group>
          {/* Robots */}
          {filtered.map((robot) => (
            <RobotMarker
              key={robot.id}
              robot={robot}
              isSelected={robot.id === selectedId}
              onSelect={(id) => {
                if(isPicking) return
                dispatch(selectRobot(id))
              }}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}
