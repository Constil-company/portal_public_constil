/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Calendar, ClipboardList, User } from "lucide-react";
import { showConfirmToast } from "../messagealert/confirm-toast";
import {
  useDeleteEstimateMutation,
  useLazyGetEstimateDetailQuery,
} from "../../services/rtkapi/invoiceApi";
import EstimateTemplateModal from "../modal/estimate-template-modal";
import { useNavigate } from "react-router-dom";
import { formatCurrency, formatDisplayDate } from "../common/format-display-date";

interface EstimateCardProps {
  estimateData: {
    id: string;
    estimate_number: string;
    estimate_date: string;
    due_date: string;
    client?: string;
    clientId?: string;
    total_amount: string;
    template_number?: number;
    client_name?: string;
  };
  onClickDetail?: () => void;
  onDeleted?: () => void;
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

const EstimateCard = ({ estimateData, onClickDetail, onDeleted }: EstimateCardProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [getEstimateDetail] = useLazyGetEstimateDetailQuery();
  const [_estimateDetail, setEstimateDetail] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [deleteEstimate] = useDeleteEstimateMutation();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleView = async () => {
    handleClose();
    setLoading(true);
    try {
      const result = await getEstimateDetail({ estimate_id: estimateData.id }).unwrap();
      setEstimateDetail(result.data);
      setModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch estimate detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEstimate = (estimateId: string) => {
    showConfirmToast({
      message: "You won't be able to revert this!",
      onConfirm: async () => {
        try {
          await deleteEstimate(estimateId).unwrap();
          if (onDeleted) onDeleted();
        } catch (error) {
          console.error("Delete failed:", error);
        }
      },
    });
  };

  const handleUpdateEstimate = () => {
    navigate(`/estimates/new?id=${estimateData.id}`, { state: { estimateId: estimateData.id } });
  };

  return (
    <>
      <div
        className="w-full rounded-xl border border-gray-200 bg-white p-4 hover:border-primary/40 transition-colors cursor-pointer"
        onClick={onClickDetail}
        role={onClickDetail ? "button" : undefined}
      >
        <div className="flex items-start justify-between gap-2 mb-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ClipboardList className="h-5 w-5" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Estimate</p>
              <p className="text-base font-semibold text-gray-900 truncate">
                {estimateData.estimate_number || "—"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClick}
            className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
            aria-label="Estimate options"
          >
            <MoreVertIcon sx={{ fontSize: 18 }} />
          </button>

          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem onClick={handleView} disabled={loading}>
              View
            </MenuItem>
            <MenuItem onClick={handleView} disabled={loading}>
              Download
            </MenuItem>
            <MenuItem onClick={handleUpdateEstimate}>Edit</MenuItem>
            <MenuItem onClick={() => handleDeleteEstimate(estimateData.id)}>Delete</MenuItem>
          </Menu>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <MetaRow
            label="Client"
            value={estimateData.client_name || "—"}
            icon={User}
          />
          <MetaRow
            label="Issued"
            value={formatDisplayDate(estimateData.estimate_date)}
            icon={Calendar}
          />
          <MetaRow
            label="Due"
            value={formatDisplayDate(estimateData.due_date)}
            icon={Calendar}
          />
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-xs font-medium text-gray-500">Total amount</span>
          <p className="text-lg font-bold text-primary tabular-nums">
            {formatCurrency(estimateData.total_amount)}
            <span className="text-xs font-normal text-gray-400 ml-1">USD</span>
          </p>
        </div>
      </div>

      <EstimateTemplateModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        estimateId={estimateData.id}
        templateNumber={estimateData?.template_number}
      />
    </>
  );
};

export default EstimateCard;
