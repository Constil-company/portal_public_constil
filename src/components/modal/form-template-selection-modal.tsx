import { Modal, Box, IconButton, Typography, CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckIcon from "@mui/icons-material/Check";
import { Eye, Loader2 } from "lucide-react";

export type FormTemplateItem = {
  id: number;
  src: string;
  alt: string;
};

interface FormTemplateSelectionModalProps {
  open: boolean;
  onClose: () => void;
  documentType: "Invoice" | "Estimate";
  templates: FormTemplateItem[];
  isLoading?: boolean;
  selectedTemplateId: number | null;
  onSelectTemplate: (id: number) => void;
  loadingTemplateId: number | null;
  onViewTemplate: (id: number) => void;
  downloadChecked: boolean;
  onDownloadCheckedChange: (checked: boolean) => void;
  emailChecked: boolean;
  onEmailCheckedChange: (checked: boolean) => void;
  onConfirm: () => void;
  previewOpen: boolean;
  onPreviewClose: () => void;
  onPreviewBack: () => void;
  previewHtml: string;
}

export function FormTemplateSelectionModal({
  open,
  onClose,
  documentType,
  templates,
  isLoading = false,
  selectedTemplateId,
  onSelectTemplate,
  loadingTemplateId,
  onViewTemplate,
  downloadChecked,
  onDownloadCheckedChange,
  emailChecked,
  onEmailCheckedChange,
  onConfirm,
  previewOpen,
  onPreviewClose,
  onPreviewBack,
  previewHtml,
}: FormTemplateSelectionModalProps) {
  const canConfirm = Boolean(selectedTemplateId && (downloadChecked || emailChecked));

  return (
    <>
      <Modal
        open={open}
        onClose={(_event, reason) => {
          if (reason === "backdropClick") return;
          onClose();
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "95%",
            maxWidth: 1100,
            bgcolor: "#fff",
            borderRadius: "16px",
            border: "1px solid #eaecef",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)",
            overflow: "hidden",
            maxHeight: "92vh",
            display: "flex",
            flexDirection: "column",
            outline: "none",
          }}
        >
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: { xs: 2, sm: 3 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 2,
                pb: 2,
                mb: 1,
                borderBottom: "1px solid #f3f4f6",
              }}
            >
              <Box sx={{ minWidth: 0, pr: 4 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "#111827", fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
                >
                  Select the {documentType} template
                </Typography>
                <Typography variant="body2" sx={{ color: "#6b7280", mt: 0.5 }}>
                  Choose a layout, preview it with your data, then confirm download or email options.
                </Typography>
              </Box>
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
                <CloseIcon />
              </IconButton>
            </Box>

            {isLoading ? (
              <Box display="flex" justifyContent="center" py={8}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <Typography variant="caption" sx={{ color: "#9ca3af", display: "block", mb: 2 }}>
                  {templates.length} templates available
                </Typography>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, 1fr)",
                      md: "repeat(3, 1fr)",
                    },
                    gap: 2,
                  }}
                >
                  {templates.map((t) => {
                    const isSelected = selectedTemplateId === t.id;
                    const isViewLoading = loadingTemplateId === t.id;

                    return (
                      <Box
                        key={t.id}
                        component="article"
                        onClick={() => onSelectTemplate(t.id)}
                        sx={{
                          border: isSelected ? "2px solid #22c55e" : "1px solid #e5e7eb",
                          borderRadius: "12px",
                          overflow: "hidden",
                          cursor: "pointer",
                          position: "relative",
                          bgcolor: "#fff",
                          transition: "box-shadow 0.2s, border-color 0.2s",
                          "&:hover": {
                            borderColor: isSelected ? "#22c55e" : "#93c5fd",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                          },
                        }}
                      >
                        {isSelected && (
                          <Box
                            sx={{
                              position: "absolute",
                              top: 10,
                              right: 10,
                              zIndex: 2,
                              background: "#22c55e",
                              p: 0.6,
                              borderRadius: "50%",
                              display: "flex",
                            }}
                          >
                            <CheckIcon sx={{ color: "#fff", fontSize: 18 }} />
                          </Box>
                        )}

                        <Box
                          sx={{
                            position: "relative",
                            aspectRatio: "3/4",
                            bgcolor: "#f9fafb",
                            borderBottom: "1px solid #f3f4f6",
                            overflow: "hidden",
                          }}
                        >
                          <Box
                            component="img"
                            src={t.src}
                            alt={t.alt}
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                              p: 1.5,
                              display: "block",
                            }}
                          />
                          {isViewLoading && (
                            <Box
                              sx={{
                                position: "absolute",
                                inset: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor: "rgba(255,255,255,0.85)",
                              }}
                            >
                              <Loader2 className="w-8 h-8 text-[#0b0e3f] animate-spin" />
                            </Box>
                          )}
                        </Box>

                        <Box sx={{ px: 2, pt: 1.5, pb: 1 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600, color: "#111827", lineHeight: 1.3 }}
                          >
                            Template {t.id}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#6b7280",
                              display: "block",
                              mt: 0.25,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {t.alt}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            px: 2,
                            pb: 2,
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Box
                            component="button"
                            type="button"
                            onClick={() => onViewTemplate(t.id)}
                            disabled={isViewLoading}
                            sx={{
                              flex: 1,
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 0.5,
                              background: "#0b0e3f",
                              color: "white",
                              py: 1,
                              px: 1.5,
                              borderRadius: "8px",
                              border: "none",
                              cursor: isViewLoading ? "wait" : "pointer",
                              fontSize: "0.8125rem",
                              fontWeight: 600,
                              opacity: isViewLoading ? 0.7 : 1,
                              "&:hover": { bgcolor: "#151a5c" },
                            }}
                          >
                            <Eye size={14} />
                            {isViewLoading ? "Loading..." : "View"}
                          </Box>
                          <Box
                            component="button"
                            type="button"
                            onClick={() => onSelectTemplate(t.id)}
                            sx={{
                              flex: 1,
                              background: isSelected ? "#ecfdf5" : "#22c55e",
                              color: isSelected ? "#15803d" : "white",
                              py: 1,
                              px: 1.5,
                              borderRadius: "8px",
                              border: isSelected ? "1px solid #22c55e" : "none",
                              cursor: "pointer",
                              fontSize: "0.8125rem",
                              fontWeight: 600,
                              "&:hover": {
                                bgcolor: isSelected ? "#d1fae5" : "#16a34a",
                              },
                            }}
                          >
                            {isSelected ? "Selected" : "Select"}
                          </Box>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>

                <Box
                  sx={{
                    borderTop: "1px solid #e5e7eb",
                    pt: 2,
                    mt: 3,
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "space-between",
                    alignItems: { xs: "stretch", sm: "center" },
                    gap: 2,
                    bgcolor: "#fff",
                  }}
                >
                  <Typography variant="body2" sx={{ color: "#6b7280" }}>
                    {selectedTemplateId ? "1 template selected" : "Please select a template"}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 2,
                      alignItems: "center",
                      justifyContent: { xs: "stretch", sm: "flex-end" },
                    }}
                  >
                    {selectedTemplateId && (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
                        <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                          <input
                            type="checkbox"
                            checked={downloadChecked}
                            onChange={(e) => onDownloadCheckedChange(e.target.checked)}
                            style={{ marginRight: "8px" }}
                          />
                          <Typography variant="body2">Download document</Typography>
                        </label>
                        <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                          <input
                            type="checkbox"
                            checked={emailChecked}
                            onChange={(e) => onEmailCheckedChange(e.target.checked)}
                            style={{ marginRight: "8px" }}
                          />
                          <Typography variant="body2">Send by email</Typography>
                        </label>
                      </Box>
                    )}

                    <Box sx={{ display: "flex", gap: 1.5 }}>
                      <Box
                        component="button"
                        type="button"
                        onClick={onClose}
                        sx={{
                          background: "#f3f4f6",
                          color: "#111827",
                          py: 1.25,
                          px: 2.25,
                          borderRadius: "8px",
                          border: "none",
                          cursor: "pointer",
                          fontWeight: 600,
                          fontSize: "0.875rem",
                        }}
                      >
                        Cancel
                      </Box>
                      <Box
                        component="button"
                        type="button"
                        disabled={!canConfirm}
                        onClick={onConfirm}
                        sx={{
                          background: canConfirm ? "#0b0e3f" : "#9ca3af",
                          color: "white",
                          py: 1.25,
                          px: 3,
                          borderRadius: "8px",
                          border: "none",
                          cursor: canConfirm ? "pointer" : "not-allowed",
                          fontWeight: 600,
                          fontSize: "0.875rem",
                        }}
                      >
                        Confirm Select
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Modal>

      <Modal open={previewOpen} onClose={onPreviewClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "95%", sm: "85%", md: "70%" },
            maxWidth: 1000,
            bgcolor: "#fff",
            borderRadius: "16px",
            border: "1px solid #eaecef",
            p: { xs: 2, sm: 3 },
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)",
            overflowY: "auto",
            maxHeight: "92vh",
            outline: "none",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <IconButton onClick={onPreviewBack} aria-label="Back to templates">
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" sx={{ ml: 1, fontWeight: 600 }}>
              Preview Template
            </Typography>
          </Box>
          <Box
            sx={{
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              overflow: "hidden",
              bgcolor: "#f9fafb",
            }}
          >
            <iframe
              title={`${documentType} template preview`}
              srcDoc={previewHtml}
              style={{ width: "100%", height: "min(75vh, 720px)", border: "none", display: "block" }}
            />
          </Box>
        </Box>
      </Modal>
    </>
  );
}
