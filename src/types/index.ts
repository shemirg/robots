export type RobotStatus = 'idle' | 'moving' | 'loading' | 'error' | 'charging';

export interface Robot {
  id: string;
  name: string;
  x: number;
  y: number;
  rotation: number; // degrees
  status: RobotStatus;
  battery: number; // 0-100
  currentTask: string | null;
  speed: number; // units per second for mock animation
}

export interface WarehouseZone {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export interface Rack {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Task {
  id: string;
  robotId: string;
  from: string;
  to: string;
  status: 'pending' | 'in_progress' | 'done';
  createdAt: number;
}
export type TaskPickMode = 'idle' | 'picking_from' | 'picking_to';

export interface WarehouseConfig {
  width: number;
  height: number;
  zones: WarehouseZone[];
  racks: Rack[];
}
