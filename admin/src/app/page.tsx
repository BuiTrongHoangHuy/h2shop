import SalesResults from "@/components/sales-results"
import RevenueChart from "@/components/revenue-chart"
import TopSellingGoods from "@/components/top-selling-goods"

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <SalesResults />
      <RevenueChart />
      <TopSellingGoods />
    </div>
  )
}
