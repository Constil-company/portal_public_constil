import { Chip } from "@mui/material";

import { SubscriptionHistoryResponseStatusEnum } from "../../api/subscription";

interface BillingChipProps {
    status: SubscriptionHistoryResponseStatusEnum | undefined;
}

const BillingChip = ({ status }: BillingChipProps) => {
    if (!status) return "N/A";


    return (
        <Chip
            
            label={status}
            sx={{
                // backgroundColor: style.backgroundColor,
                paddingX: '8px'
            }}
        />
    );
};

export default BillingChip;
