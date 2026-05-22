/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Calendar, FileText, User } from "lucide-react";
import { InvoiceModel } from "../../models/invoice";
import "react-toastify/dist/ReactToastify.css";
import { showConfirmToast } from "../messagealert/confirm-toast";
import { useDeleteInvoiceMutation } from "../../services/rtkapi/invoiceApi";
import InvoiceTemplateModal from "../modal/invoice-template-modal";
import { toast } from "react-toastify";
import { formatCurrency, formatDisplayDate } from "../common/format-display-date";

interface InvoiceCardProps {
  invoicesData: InvoiceModel;
  onClickDetail?: () => void;
  kind?: string;
}

function MetaRow({ label, value, icon: Icon }: { label: string; value: string; icon?: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">{label}</p>
      <p className="text-sm text-gray-800 truncate flex items-center gap-1.5 mt-0.5">
        {Icon && <Icon className="w-3.5 h-3.5 shrink-0 text-gray-400" />}
        <span className="truncate">{value}</span>
      </p>
    </div>
  );
}

const InvoiceCard = ({ invoicesData }: InvoiceCardProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const navigate = useNavigate();
  const [deleteInvoice] = useDeleteInvoiceMutation();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleDeleteInvoice = (invoiceId: string) => {
    showConfirmToast({
      message: "You won't be able to revert this!",
      onConfirm: async () => {
        try {
          await deleteInvoice(invoiceId).unwrap();
          toast.success("Invoice deleted successfully");
        } catch (error: any) {
          console.error("Delete failed:", error);
          toast.error(error?.data?.message || "Failed to delete invoice");
        }
      },
    });
  };

  const handleView = () => {
    handleClose();
    setTemplateModalOpen(true);
  };

  const handleCreateInvoice = () => {
    navigate(`/invoices/new?id=${invoicesData.id}`, {
      state: {
        invoiceId: invoicesData.id,
        id: invoicesData.id,
        invoice_id: invoicesData.id,
      },
    });
  };

  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white p-4 hover:border-primary/40 transition-colors">
      <div className="flex items-start justify-between gap-2 mb-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileText className="h-5 w-5" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Invoice</p>
            <p className="text-base font-semibold text-gray-900 truncate">
              {invoicesData.invoice_number || "—"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleClick}
          className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
          aria-label="Invoice options"
        >
          <MoreVertIcon sx={{ fontSize: 18 }} />
        </button>

        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuItem onClick={handleView}>View</MenuItem>
          <MenuItem onClick={handleView}>Download</MenuItem>
          <MenuItem onClick={handleCreateInvoice}>Edit</MenuItem>
          <MenuItem onClick={() => handleDeleteInvoice(invoicesData.id ?? "")}>Delete</MenuItem>
        </Menu>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <MetaRow
          label="Client"
          value={invoicesData.client_name || "—"}
          icon={User}
        />
        <MetaRow
          label="Issued"
          value={formatDisplayDate(invoicesData.invoice_date)}
          icon={Calendar}
        />
        <MetaRow
          label="Due"
          value={formatDisplayDate(invoicesData.due_date)}
          icon={Calendar}
        />
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className="text-xs font-medium text-gray-500">Total amount</span>
        <p className="text-lg font-bold text-primary tabular-nums">
          {formatCurrency(invoicesData.total_amount)}
          <span className="text-xs font-normal text-gray-400 ml-1">USD</span>
        </p>
      </div>

      <InvoiceTemplateModal
        open={templateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
        templateNumber={invoicesData?.template_number}
        invoiceId={invoicesData.id ?? ""}
      />
    </div>
  );
};

export default InvoiceCard;
