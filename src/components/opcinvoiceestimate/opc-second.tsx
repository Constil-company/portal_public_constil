import { useNavigate, useLocation } from "react-router-dom";
import InvoiceIcone from "../../assets/icons/invoiceicone";
import { useState } from "react";

export default function OpcSecond() {
  const navigate = useNavigate();
  const location = useLocation();

  const activeHexColor = "#448AFF";
  const [activeTab, setActiveTab] = useState("invoices");

  const isActive = (paths: string[]) => {
    return paths.some((path) => location.pathname.startsWith(path));
  };

  const invoicesPaths = ["/invoices", "/invoices/share"];
  const isInvoiceActive = isActive(invoicesPaths);

  const getButtonVisuals = (isActiveButton: boolean) => {
    if (isActiveButton) {
      return {
        backgroundColor: activeHexColor,
        textColor: "text-white",
        iconColorClass: "text-white",
      };
    } else {
      return {
        backgroundColor: "white",
        textColor: "text-slate-700",
        iconColorClass: "text-black",
      };
    }
  };

  const invoiceVisuals = getButtonVisuals(isInvoiceActive);

  return (
    <div
      className="lg:bg-[#0F172A]  rounded-xl flex flex-col 
                 w-full h-auto 
                 md:p-2 space-y-2 
                 sm:p-3 sm:space-y-3 
                 lg:w-[170px]  lg:p-2 lg:space-y-5"
    >
      {/* ======= Desktop Sidebar (≥1024px) ======= */}
      <div className="hidden lg:flex flex-col gap-5">
        <div
          onClick={() => {
            setActiveTab("invoices");
            navigate("/invoices");
          }}
          style={{ backgroundColor: invoiceVisuals.backgroundColor }}
          className={`
            ${invoiceVisuals.textColor} 
            flex flex-col items-center justify-center 
            shadow-md rounded-xl cursor-pointer 
            hover:opacity-95 
            transition-all duration-300
            p-5 min-h-[40px]
          `}
        >
          <InvoiceIcone className={`mb-1 ${invoiceVisuals.iconColorClass}`} />
          <span className="font-semibold text-base">Invoices</span>
        </div>
    

        {/* <button
          onClick={() => navigate("/invoices/support")}
          className="flex items-center justify-center gap-2 w-full text-[#448AFF] text-sm font-medium bg-transparent hover:bg-[#10184D] rounded-lg py-3 transition-colors"
        >
          <ShareIcon size={16} />
          <span>Share the Invoice</span>
        </button> */}
      </div>

      {/* ======= Mobile / Tablet Tabs (<1024px) ======= */}
 <div className="lg:hidden flex items-center justify-around w-full bg-white shadow-md rounded-xl py-2">
  {/* Invoices Tab */}
  <button
    onClick={() => {
      setActiveTab("invoices");
      navigate("/invoices");
    }}
    className={`flex flex-col items-center justify-center px-3 py-1 ${
      activeTab === "invoices" ? "text-[#448AFF]" : "text-gray-600"
    }`}
  >
    <InvoiceIcone
      className={`mb-1 ${
        activeTab === "invoices" ? "text-[#448AFF]" : "text-gray-500"
      }`}
    />
    <span className="text-xs font-semibold">Invoices</span>
  </button>

  {/* AI Invoices Tab */}

</div>

    </div>
  );
}
