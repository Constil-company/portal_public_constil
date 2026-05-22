import { ArrowLeft, Download, Loader2, Mail } from "lucide-react";

interface TemplatePreviewToolbarProps {
  onBack: () => void;
  onDownload: () => void;
  onSendEmail: () => void;
  isDownloading: boolean;
  isSendingEmail: boolean;
  documentLabel: string;
}

export function TemplatePreviewToolbar({
  onBack,
  onDownload,
  onSendEmail,
  isDownloading,
  isSendingEmail,
  documentLabel,
}: TemplatePreviewToolbarProps) {
  const busy = isDownloading || isSendingEmail;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 pb-4 border-b border-gray-100">
      <button
        type="button"
        onClick={onBack}
        disabled={busy}
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary disabled:opacity-50 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to templates
      </button>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onDownload}
          disabled={busy}
          className="inline-flex items-center justify-center gap-2 min-h-[40px] px-4 text-sm font-medium text-gray-800 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          {isDownloading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          {isDownloading ? "Generating…" : "Download PDF"}
        </button>
        <button
          type="button"
          onClick={onSendEmail}
          disabled={busy}
          className="inline-flex items-center justify-center gap-2 min-h-[40px] px-4 text-sm font-semibold text-white bg-primary rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {isSendingEmail ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Mail className="w-4 h-4" />
          )}
          {isSendingEmail ? "Sending…" : `Email ${documentLabel}`}
        </button>
      </div>
    </div>
  );
}
