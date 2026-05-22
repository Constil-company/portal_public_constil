import React from "react";
import { useDispatch } from "react-redux";
import { setSubscriptionOpen } from "../../redux/subscriptionSlice";

type AlertType = "warning" | "urgent" | "critical";

interface AlertBannerProps {
  type: AlertType;
  message: string;
}

const AlertBanner: React.FC<AlertBannerProps> = ({ type, message }) => {
  const dispatch = useDispatch();
  const baseStyle =
    "w-full rounded-lg px-4 py-3 flex justify-between items-center text-sm";

  const styles: Record<AlertType, string> = {
    warning: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    urgent: "bg-orange-50 text-orange-700 border border-orange-200",
    critical: "bg-red-50 text-red-700 border border-red-200",
  };

  return (
    <div className={`${baseStyle} ${styles[type]}`}>
      <span>{message}</span>
      <button
        type="button"
        className="btn-primary shrink-0 !h-8 !py-0 !px-4 !text-xs"
        onClick={() => dispatch(setSubscriptionOpen(true))}
      >
        Renew Now
      </button>
    </div>
  );
};

export default AlertBanner;
