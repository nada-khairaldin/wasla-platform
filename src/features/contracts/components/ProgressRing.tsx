interface ProgressRingProps {
  completedHours: number;
  totalHours: number;
  size?: number;
  strokeWidth?: number;
}

export function ProgressRing({
  completedHours,
  totalHours,
  size = 96,
  strokeWidth = 8, 
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = totalHours > 0 ? Math.min(completedHours / totalHours, 1) : 0;
  const dashoffset = circumference * (1 - progress);
  const center = size / 2;

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="-rotate-90 absolute inset-0"
        style={{ transform: "rotate(-90deg)" }}
      >
     
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#E9EDF0" 
          strokeWidth={strokeWidth}
        />
        
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#efcf85" 
          strokeWidth={strokeWidth}
          strokeLinecap="butt" 
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
    </div>
  );
}