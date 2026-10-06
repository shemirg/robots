import { Group, Image as KonvaImage, Circle, Text, Rect } from 'react-konva';
import type { Robot } from '../types';
import { STATUS_COLORS } from '../data/mock';
import { useHtmlImage } from '../hooks/useHtmlImage';

export const ROBOT_SIZE = 36;
 
const ROBOT_IMAGE_URL = '/robots/agv.svg';

interface RobotMarkerProps {
    robot: Robot;
    isSelected: boolean;
    onSelect: (id: string) => void;
}

export function RobotMarker({ robot, isSelected, onSelect }: RobotMarkerProps) {
    const { image, status } = useHtmlImage(ROBOT_IMAGE_URL);
    const color = STATUS_COLORS[robot.status] || '#94a3b8';
    const half = ROBOT_SIZE / 2;

    return (
        <Group
            x={robot.x}
            y={robot.y}
            rotation={robot.rotation}
            onClick={(e) => {
                e.cancelBubble = true;
                onSelect(robot.id);
            }}
            onTap={(e) => {
                e.cancelBubble = true;
                onSelect(robot.id);
            }}
        >
            {isSelected && (
                <Circle
                    radius={half + 10}
                    stroke="#38bdf8"
                    strokeWidth={2}
                    dash={[5, 4]}
                />
            )}

            <Circle
                radius={half + 3}
                stroke={color}
                strokeWidth={3}
                opacity={0.9}
            />

            {status === 'loaded' && image ? (
                <KonvaImage
                    image={image}
                    x={-half}
                    y={-half}
                    width={ROBOT_SIZE}
                    height={ROBOT_SIZE}
                    shadowColor="black"
                    shadowBlur={8}
                    shadowOpacity={0.35}
                    shadowOffsetY={2}
                />
            ) : (
                <Rect
                    x={-half}
                    y={-half}
                    width={ROBOT_SIZE}
                    height={ROBOT_SIZE}
                    fill={color}
                    cornerRadius={6}
                    opacity={0.85}
                />
            )}

            <Circle
                x={0}
                y={-half - 2}
                radius={4}
                fill={color}
                stroke="#0f172a"
                strokeWidth={1}
            />

            <Text
                x={-28}
                y={half + 6}
                width={56}
                text={robot.name}
                fontSize={11}
                fill="#e2e8f0"
                align="center"
                fontStyle="bold"
                rotation={-robot.rotation}
                shadowColor="black"
                shadowBlur={4}
                shadowOpacity={0.8}
            />
        </Group>
    );
}