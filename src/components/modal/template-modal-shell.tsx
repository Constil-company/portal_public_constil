import { Modal, Box, IconButton } from "@mui/material";
import { X } from "lucide-react";
import type { ReactNode } from "react";

interface TemplateModalShellProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  isPreview?: boolean;
  children: ReactNode;
}

export function TemplateModalShell({
  open,
  onClose,
  title,
  subtitle,
  isPreview = false,
  children,
}: TemplateModalShellProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 1.5, sm: 2 },
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: isPreview ? 1100 : 920,
          maxHeight: "92vh",
          bgcolor: "#fff",
          borderRadius: "16px",
          border: "1px solid #eaecef",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          outline: "none",
        }}
      >
        <header className="flex items-start justify-between gap-4 border-b border-gray-100 px-4 sm:px-6 py-4 shrink-0 bg-white">
          <div className="min-w-0 pr-8">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">{title}</h2>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1 leading-snug">{subtitle}</p>
            )}
          </div>
          <IconButton
            onClick={onClose}
            aria-label="Close"
            size="small"
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              color: "#707a8a",
              "&:hover": { bgcolor: "#f5f5f5" },
            }}
          >
            <X className="w-5 h-5" />
          </IconButton>
        </header>

        <div className="flex-1 overflow-y-auto thin-scrollbar px-4 sm:px-6 py-4 sm:py-5">
          {children}
        </div>
      </Box>
    </Modal>
  );
}
