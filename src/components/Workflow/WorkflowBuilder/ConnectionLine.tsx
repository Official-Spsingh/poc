import React from 'react';
import { ConnectionDrag, Position } from '../../../../types';

interface ConnectionLineProps {
  start: Position;
  end: Position;
  isDragging?: boolean;
  onRemove?: () => void;
}

const ConnectionLine: React.FC<ConnectionLineProps> = ({ start, end, isDragging, onRemove }) => {
  const dx = end.x - start.x;
  const path = `M ${start.x} ${start.y} C ${start.x + Math.abs(dx) / 1.5} ${start.y}, ${end.x - Math.abs(dx) / 1.5} ${end.y}, ${end.x} ${end.y}`;

  return (
    <g className="group">
      <path
        d={path}
        fill="none"
        stroke={isDragging ? "#3b82f6" : "#cbd5e1"}
        strokeWidth={isDragging ? "3" : "2"}
        strokeDasharray={isDragging ? "5,5" : "0"}
        className="transition-all duration-75"
      />
      {!isDragging && onRemove && (
        <g onClick={(e) => { e.stopPropagation(); onRemove(); }} className="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
          <circle cx={(start.x + end.x) / 2} cy={(start.y + end.y) / 2} r="10" className="fill-rose-500" />
          <path 
            d={`M ${(start.x + end.x) / 2 - 3} ${(start.y + end.y) / 2 - 3} L ${(start.x + end.x) / 2 + 3} ${(start.y + end.y) / 2 + 3} M ${(start.x + end.x) / 2 + 3} ${(start.y + end.y) / 2 - 3} L ${(start.x + end.x) / 2 - 3} ${(start.y + end.y) / 2 + 3}`} 
            stroke="white" strokeWidth="1.5"
          />
        </g>
      )}
    </g>
  );
};

export default ConnectionLine;
