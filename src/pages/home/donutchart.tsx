interface DonutChartProps {
  title: string;
  data: {
    label: string;
    value: number;
    color: string;
  }[];
}

export default function DonutChart({ title, data }: DonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const thisMonth = total > 0 ? '+4.3%' : '0%';

  let currentAngle = -90;
  const arcs = data.map((item) => {
    const percentage = total > 0 ? (item.value / total) * 100 : 0;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = 50 + 40 * Math.cos(startRad);
    const y1 = 50 + 40 * Math.sin(startRad);
    const x2 = 50 + 40 * Math.cos(endRad);
    const y2 = 50 + 40 * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;

    const pathData = [
      `M 50 50`,
      `L ${x1} ${y1}`,
      `A 40 40 0 ${largeArc} 1 ${x2} ${y2}`,
      `Z`,
    ].join(' ');

    return { ...item, pathData, percentage };
  });

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <p className="text-xs text-gray-500">This Month {thisMonth}</p>
      </div>

      <div className="flex items-center gap-8">
        <div className="relative" style={{ width: '180px', height: '180px' }}>
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-0">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="20" />
            {arcs.map((arc, i) => (
              <path
                key={i}
                d={arc.pathData}
                fill={arc.color}
                opacity="0.9"
              />
            ))}
            <circle cx="50" cy="50" r="25" fill="white" />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <p className="text-2xl font-bold text-gray-900">
              $ {(total / 1000).toFixed(0)}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {data.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm text-gray-600">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
