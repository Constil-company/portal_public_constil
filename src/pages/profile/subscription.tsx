import { CurrentPlanCard } from "../../components/myProfile/current-plan-card";
import { BillingTable } from "../../components/myProfile/billing-table";

export function Subscription() {
    
// ....
    return (
        <div className="flex flex-col gap-6">
            <CurrentPlanCard />

            <BillingTable />
        </div>
    );
}