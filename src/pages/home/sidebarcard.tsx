import { InvoiceModel } from '../../models/invoice';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Typography } from '@mui/material';

interface SidebarInvoiceCardProps {
    invoice: InvoiceModel;
    onMenuClick: (event: React.MouseEvent<HTMLElement>, invoice: InvoiceModel) => void;
}
const SidebarInvoiceCard = ({ invoice, onMenuClick }: SidebarInvoiceCardProps) => {
    const isInvoice = !!invoice.invoice_number;
    const isEstimate = !!invoice.estimate_number;

    const amount = Number(invoice.total_amount || 0).toLocaleString('en-US', {
        maximumFractionDigits: 0,
    });


 

    return (
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-3 cursor-pointer hover:shadow-md transition">
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
                <div className=" p-1 rounded-lg text-red bg-gray-200">
                    <span className="text-sm ">
                        Paid
                    </span>
                </div>
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        onMenuClick(e, invoice);
                    }}
                    className="text-gray-600 hover:text-gray-800 cursor-pointer">
                    <MoreVertIcon style={{ fontSize: '20px' }} />
                </div>
            </div>

            <Typography className="text-gray-900 font-semibold text-base mb-2">
                {isInvoice
                    ? `Invoice #${invoice.invoice_number}`
                    : isEstimate
                        ? `Estimate #${invoice.estimate_number}`
                        : '#—'}
            </Typography>

            {/* Dates */}
         

            {/* Total */}
            <Typography className="text-[#448AFF] font-bold text-sm">
                {amount} USD
            </Typography>
        </div>
    );
};
export default SidebarInvoiceCard;