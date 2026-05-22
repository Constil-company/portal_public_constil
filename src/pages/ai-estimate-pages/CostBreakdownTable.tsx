
import { ChevronDown } from "lucide-react"

interface TradeItem {
  id: string
  trade: string
  items: {
    item: string
    qty: number
    unit: string
    unitCost: number
    material: number
    labor: number
    total: number
  }[]
  color: "orange" | "yellow" | "green" | "blue"
  totalCost: number
}

interface CostBreakdownTableProps {
  trade: TradeItem
  isExpanded: boolean
  onToggle: () => void
}

const colorMap = {
  orange: "text-orange-500",
  yellow: "text-yellow-500",
  green: "text-green-500",
  blue: "text-blue-500",
}

const bgColorMap = {
  orange: "bg-orange-50 hover:bg-orange-100",
  yellow: "bg-yellow-50 hover:bg-yellow-100",
  green: "bg-green-50 hover:bg-green-100",
  blue: "bg-blue-50 hover:bg-blue-100",
}

export function CostBreakdownTable({ trade, isExpanded, onToggle }: CostBreakdownTableProps) {
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={onToggle}
        className={`w-full px-6 py-4 flex items-center justify-between ${bgColorMap[trade.color]}`}
      >
        <div className="flex items-center gap-3">
          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
          <span className={`inline-block w-2 h-2 rounded-full bg-${trade.color}-500`} />
          <span className={`font-medium ${colorMap[trade.color]}`}>{trade.trade}</span>
          <span className="text-sm text-muted-foreground">{trade.items.length} items</span>
        </div>
        <span className="font-bold text-foreground">
          ${trade.totalCost.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </span>
      </button>

      {isExpanded && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Item</th>
                <th className="px-6 py-3 text-center text-sm font-medium text-muted-foreground">Qty</th>
                <th className="px-6 py-3 text-center text-sm font-medium text-muted-foreground">Unit</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-muted-foreground">Unit Cost</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-muted-foreground">Material</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-muted-foreground">Labor</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-muted-foreground">Total</th>
                <th className="px-6 py-3 text-center text-sm font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {trade.items.map((item, idx) => (
                <tr key={idx} className="border-b border-border hover:bg-muted">
                  <td className="px-6 py-3 text-sm text-foreground">{item.item}</td>
                  <td className="px-6 py-3 text-sm text-center text-foreground">
                    {item.qty.toLocaleString("en-US", { minimumFractionDigits: 0 })}
                  </td>
                  <td className="px-6 py-3 text-sm text-center text-blue-600">{item.unit}</td>
                  <td className="px-6 py-3 text-sm text-right text-foreground">${item.unitCost.toFixed(2)}</td>
                  <td className="px-6 py-3 text-sm text-right text-foreground">
                    ${item.material.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-3 text-sm text-right text-foreground">
                    ${item.labor.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-3 text-sm text-right text-foreground font-medium">
                    ${item.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-3 text-center">
                    <button className="text-muted-foreground hover:text-foreground">✎</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
