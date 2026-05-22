import { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { colors } from "../../styles/design-system";

interface DataPoint {
  label: string;
  invoices: number;
  estimates: number;
}

interface TrendItem {
  created_at?: string;
}

interface TrendLineChartProps {
  invoices: TrendItem[];
  estimates: TrendItem[];
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-md border border-gray-100 p-4 rounded-xl shadow-lg">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 border-b border-gray-50 pb-2">
          Day {label}
        </p>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-xs font-bold text-gray-700">Invoices</span>
            </div>
            <span className="text-xs font-black text-primary">{payload[0]?.value}</span>
          </div>
          <div className="flex items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-trading-up" />
              <span className="text-xs font-bold text-gray-700">Estimates</span>
            </div>
            <span className="text-xs font-black text-trading-up">{payload[1]?.value}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const formatMonthLabel = (monthKey: string) => {
  const [, month] = monthKey.split("-").map(Number);
  return new Date(2000, month - 1, 1).toLocaleDateString("en-US", { month: "long" });
};

/** All 12 months for a given calendar year (January → December). */
const buildMonthsForYear = (year: number) =>
  Array.from({ length: 12 }, (_, i) => `${year}-${String(i + 1).padStart(2, "0")}`);

const getAvailableYears = (invoices: TrendItem[], estimates: TrendItem[]) => {
  const years = new Set<number>([new Date().getFullYear()]);

  [...invoices, ...estimates].forEach((item) => {
    if (!item.created_at) return;
    const y = new Date(item.created_at).getFullYear();
    if (!Number.isNaN(y)) years.add(y);
  });

  return Array.from(years).sort((a, b) => b - a);
};

const buildChartData = (
  monthKey: string,
  invoices: TrendItem[],
  estimates: TrendItem[],
): DataPoint[] => {
  const [year, month] = monthKey.split("-").map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  const stats: DataPoint[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const invCount =
      invoices.filter((inv) => inv.created_at?.startsWith(dateStr)).length || 0;
    const estCount =
      estimates.filter((est) => est.created_at?.startsWith(dateStr)).length || 0;

    stats.push({
      label: String(day),
      invoices: invCount,
      estimates: estCount,
    });
  }

  return stats;
};

export default function TrendLineChart({ invoices, estimates }: TrendLineChartProps) {
  const yearOptions = useMemo(
    () => getAvailableYears(invoices, estimates),
    [invoices, estimates],
  );

  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonthNum, setSelectedMonthNum] = useState(now.getMonth() + 1);

  const activeYear = yearOptions.includes(selectedYear) ? selectedYear : yearOptions[0];
  const monthOptions = useMemo(() => buildMonthsForYear(activeYear), [activeYear]);
  const activeMonth = `${activeYear}-${String(selectedMonthNum).padStart(2, "0")}`;

  const chartData = useMemo(
    () => buildChartData(activeMonth, invoices, estimates),
    [activeMonth, invoices, estimates],
  );

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 sm:p-8 min-h-[520px]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">
            Business Velocity
          </h3>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-trading-up animate-pulse" />
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Daily activity by month
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Year
            </span>
            <select
              value={activeYear}
              onChange={(e) => handleYearChange(Number(e.target.value))}
              className="min-w-[100px] text-sm font-medium text-gray-800 bg-white border border-gray-200 rounded-lg px-3 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Month
            </span>
            <select
              value={selectedMonthNum}
              onChange={(e) => setSelectedMonthNum(Number(e.target.value))}
              className="min-w-[160px] text-sm font-medium text-gray-800 bg-white border border-gray-200 rounded-lg px-3 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            >
              {monthOptions.map((monthKey) => {
                const month = Number(monthKey.split("-")[1]);
                return (
                  <option key={monthKey} value={month}>
                    {formatMonthLabel(monthKey)}
                  </option>
                );
              })}
            </select>
          </label>

          <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-100">
              <div className="w-2.5 h-2.5 rounded-full bg-primary" />
              <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                Invoices
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-100">
              <div className="w-2.5 h-2.5 rounded-full bg-trading-up" />
              <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                Estimates
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-[380px] sm:h-[440px] lg:h-[480px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 16, right: 16, left: 0, bottom: 8 }}>
            <defs>
              <linearGradient id="colorInvoices" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.primary} stopOpacity={0.3} />
                <stop offset="95%" stopColor={colors.primary} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorEstimates" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.tradingUp} stopOpacity={0.3} />
                <stop offset="95%" stopColor={colors.tradingUp} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
              dy={15}
              interval="preserveStartEnd"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
              allowDecimals={false}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#e2e8f0", strokeWidth: 1, strokeDasharray: "4 4" }}
            />
            <Area
              type="monotone"
              dataKey="invoices"
              stroke={colors.primary}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorInvoices)"
              animationDuration={1500}
              activeDot={{ r: 6, strokeWidth: 0, fill: colors.primary }}
            />
            <Area
              type="monotone"
              dataKey="estimates"
              stroke={colors.tradingUp}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorEstimates)"
              animationDuration={1800}
              activeDot={{ r: 6, strokeWidth: 0, fill: colors.tradingUp }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
