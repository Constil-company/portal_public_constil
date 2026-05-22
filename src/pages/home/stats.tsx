import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
}

export default function StatsCardMain({ title, value, subtitle, icon: Icon }: StatsCardProps) {
  return (
    <div className="h-full min-w-0 bg-white border border-gray-200 rounded-xl p-3.5">
      <div className="flex items-start gap-2.5 min-w-0">
        <div
          className="flex shrink-0 items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-primary mt-0.5"
          aria-hidden
        >
          <Icon className="w-4 h-4" strokeWidth={2} />
        </div>

        <div className="min-w-0 flex-1">
          <h3
            className="text-[11px] font-semibold text-gray-500 leading-tight whitespace-nowrap overflow-hidden text-ellipsis"
            title={title}
          >
            {title}
          </h3>
          <p className="text-xl font-bold text-gray-900 tabular-nums leading-tight mt-1">{value}</p>
          <p
            className="text-[10px] text-gray-500 mt-1 leading-snug whitespace-nowrap overflow-hidden text-ellipsis"
            title={subtitle}
          >
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
