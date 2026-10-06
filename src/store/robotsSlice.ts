import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Robot, Task, RobotStatus, TaskPickMode } from '../types';
import { INITIAL_ROBOTS, INITIAL_TASKS } from '../data/mock';

interface RobotsState {
  robots: Robot[];
  tasks: Task[];
  selectedRobotId: string | null;
  filterStatus: RobotStatus | 'all';
  taskPickMode: TaskPickMode;  // 'idle' | 'picking_from' | 'picking_to'
  taskPickFrom: string | null;
}

const initialState: RobotsState = {
  robots: INITIAL_ROBOTS,
  tasks: INITIAL_TASKS,
  selectedRobotId: null,
  filterStatus: 'all',
  taskPickMode: 'idle',
  taskPickFrom: null,
};

const robotsSlice = createSlice({
  name: 'robots',
  initialState,
  reducers: {
    startTaskPick(state) {
      state.taskPickMode = 'picking_from'
    },
    cancelTaskPick(state) {
      state.taskPickMode = 'idle';
      state.taskPickFrom = null;
    },
    pickTaskLocation(state, action: PayloadAction<string>) {
      const name = action.payload
      if (state.taskPickMode === 'picking_from') {
        state.taskPickFrom = name;
        state.taskPickMode = 'picking_to';
      } else if (state.taskPickMode === 'picking_to' && state.taskPickFrom && state.taskPickFrom !== name) {
        // создать task, robot.status = 'moving', mode = 'idle'
        console.log('first')
      }
    },
    selectRobot(state, action: PayloadAction<string | null>) {
      state.selectedRobotId = action.payload;
      state.taskPickMode = 'idle';
      state.taskPickFrom = null;
    },
    setFilterStatus(state, action: PayloadAction<RobotStatus | 'all'>) {
      state.filterStatus = action.payload;
    },
    updateRobotPosition(
      state,
      action: PayloadAction<{ id: string; x: number; y: number; rotation?: number }>
    ) {
      const robot = state.robots.find((r) => r.id === action.payload.id);
      if (robot) {
        robot.x = action.payload.x;
        robot.y = action.payload.y;
        if (action.payload.rotation !== undefined) {
          robot.rotation = action.payload.rotation;
        }
      }
    },
    updateRobotStatus(
      state,
      action: PayloadAction<{ id: string; status: RobotStatus; battery?: number }>
    ) {
      const robot = state.robots.find((r) => r.id === action.payload.id);
      if (robot) {
        robot.status = action.payload.status;
        if (action.payload.battery !== undefined) {
          robot.battery = action.payload.battery;
        }
      }
    },
    assignTask(
      state,
      action: PayloadAction<{ robotId: string; from: string; to: string }>
    ) {
      const { robotId, from, to } = action.payload;
      const robot = state.robots.find((r) => r.id === robotId);
      if (!robot || robot.status === 'error' || robot.status === 'charging') return;

      console.log(from, to)
      const task: Task = {
        id: `task-${Date.now()}`,
        robotId,
        from,
        to,
        status: 'in_progress',
        createdAt: Date.now(),
      };
      state.tasks.unshift(task);
      robot.currentTask = `${from} → ${to}`;
      robot.status = 'moving';
    },
    clearTask(state, action: PayloadAction<string>) {
      const robot = state.robots.find((r) => r.id === action.payload);
      if (robot) {
        robot.currentTask = null;
        robot.status = 'idle';
      }
      state.tasks = state.tasks.filter((t) => t.robotId !== action.payload || t.status === 'done');
    },
    // Mock movement tick
    tickRobots(state) {
      state.robots.forEach((robot) => {
        if (robot.status !== 'moving') return;

        // Simple wandering movement for demo
        const rad = (robot.rotation * Math.PI) / 180;
        const dx = Math.cos(rad) * (robot.speed * 0.016);
        const dy = Math.sin(rad) * (robot.speed * 0.016);

        let newX = robot.x + dx;
        let newY = robot.y + dy;

        // Bounce off walls
        if (newX < 30 || newX > 1170) {
          robot.rotation = 180 - robot.rotation;
          newX = Math.max(30, Math.min(1170, newX));
        }
        if (newY < 30 || newY > 770) {
          robot.rotation = -robot.rotation;
          newY = Math.max(30, Math.min(770, newY));
        }

        robot.x = newX;
        robot.y = newY;

        // Slowly drain battery
        if (Math.random() < 0.02) {
          robot.battery = Math.max(0, robot.battery - 1);
          if (robot.battery < 15) {
            robot.status = 'error';
            robot.currentTask = null;
          }
        }
      });
    },
  },
});

export const {
  selectRobot,
  setFilterStatus,
  updateRobotPosition,
  updateRobotStatus,
  assignTask,
  clearTask,
  tickRobots,
  startTaskPick,
  cancelTaskPick,
  pickTaskLocation
} = robotsSlice.actions;

export default robotsSlice.reducer;
