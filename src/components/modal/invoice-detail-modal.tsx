/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { Box, Chip, Typography, Modal, Fade, Backdrop } from "@mui/material";
// Added FaTimes for the close icon
import { FaTrash, FaDownload,  FaTimes } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import { InvoiceModel } from "../../models/invoice";

import { PdfComponent } from "../viewsestimated/pdf-view";
import { showConfirmToast } from "../messagealert/confirm-toast";
import { invoiceContext } from "../../context/invoice-context";
import { toast } from "react-toastify";
import { getTokens } from "../../constants/storage/functions";

interface InvoiceDetailModalProps {
  open: boolean;
  onClose: () => void;
  invoice: InvoiceModel;

}

export const InvoiceDetailModal = ({ open, onClose, invoice }: InvoiceDetailModalProps) => {
  const { invoiceDelete, setEstimations, estimations, setInvoices, invoices } = useContext(invoiceContext);
  const [blob, setBlob] = useState<Uint8Array | null>(null);
  // const navigate = useNavigate();

    useEffect(() => {
        // Verifica se a URL do PDF existe no estado da rota
        const fetchPdf = async () => {

            if (invoice.documentUrl && typeof invoice.documentUrl === 'string') {
                // Verifica se a URL é válida
                try {
                    new URL(invoice.documentUrl);

                    const token = getTokens();
                    if (!token?.accessToken) {                        
                        return;
                    }
                    const response = await fetch(invoice.documentUrl, {
                        headers: {
                            'Authorization': `Bearer ${token.accessToken}`
                        }
                    });
                    const blob = await response.arrayBuffer();
                    setBlob(new Uint8Array(blob));
                } catch (e) {
                    console.error('Invalid PDF URL:', invoice.documentUrl);
                    
                }
            }
        };
        fetchPdf();
    }, [invoice.documentUrl]);

  const handleDeleteInvoice = () => {
    const invoiceId = invoice.id ?? "";
    const kind = invoice.kind ?? "";
    showConfirmToast({
      message: "You won't be able to revert this!",
      onConfirm: () => {
        invoiceDelete({ invoiceId });
        if (kind === "E") {
          setEstimations([...estimations.filter((item) => item.id !== invoiceId)]);
        } else {
          setInvoices([...invoices.filter((item) => item.id !== invoiceId)]);
        }
        onClose();
      },
    });
  };

  const handleDownloadInvoice = async () => {
    if (!blob) {
      toast.error('No PDF available for download.');
      return;
    }

    try {
      // Cria um URL temporário para o Blob
      const blobData = new Blob([blob], { type: 'application/pdf' });
      const blobUrl = window.URL.createObjectURL(blobData);

      const link = document.createElement("a");
      link.href = blobUrl;

      link.download = `Invoice_${invoice.invoiceId || "unknown"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {

      toast.error('Failed to download the PDF. Please try again.');
    }
  };

  // const handleShareInvoice = () => {
  //   if (!invoice || !invoice.documentUrl) {
  //     console.error("Missing client or invoice data");
  //     alert("Client data is missing. Cannot share invoice.");
  //     return;
  //   }

  //   navigate("/invoices/share", {
  //     state: {

  //       invoice,
  //       pdfUrl: invoice.documentUrl,
  //     },
  //   });
  // };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={open}>
        <Box className="fixed right-0 top-0 h-full w-full md:w-[30%] bg-[#0B0D2C] text-white shadow-lg p-5 border-[#ffffff1a] overflow-y-auto">
          {/* START: Added Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white p-2 z-20 hover:bg-[#ffffff1a] rounded-full"
            aria-label="Close"
            style={{ lineHeight: 0 }} // Helps ensure icon is centered if text properties interfere
          >
            <FaTimes size={20} />
          </button>
          {/* END: Added Close Button */}

          {/* Ensure padding at the top doesn't make content overlap with a fixed/absolute close button if not handled by existing layout*/}
          {/* The existing p-5 on the Box should provide enough space, but content starts below */}
          <div>
            {/*  <Chip
              label={invoice?.settled ? "Paid" : "UNPAID"}
              size="small"
              // Adjusted margin-top to ensure it doesn't overlap with the new close button
              // Original: className="font-bold mb-2 mt-4 mr-4"
              className="font-bold mb-2 mt-8 sm:mt-4 mr-4" // Added mt-8 for smallest screens, revert to mt-4 for sm+
              sx={invoice?.settled
                ? { backgroundColor: "#B4DFC0", color: "#34A853", borderRadius: "4px" }
                : { backgroundColor: "#FDD1D1", color: "#f4777f", borderRadius: "4px" }
              }
            /> */}
            <Chip
              label={`Viewed: ${invoice?.clientView} view`}
              size="small"
              // Adjusted margin-top to ensure it doesn't overlap with the new close button
              // Original: className="font-bold mb-2 mt-4"
              className="font-bold mb-2 mt-8 sm:mt-4" // Added mt-8 for smallest screens, revert to mt-4 for sm+
              sx={{ backgroundColor: "#1F2145FF", borderRadius: "4px", padding: "15px", color: "#f5f5f5" }}
            />
            <div className="mt-2 mb-2">
              <Typography variant="h6" className="font-bold">
                {invoice?.kind === "E" ? "Estimates" : "Invoice"} #{invoice?.invoiceId}
              </Typography>

              <Typography variant="body2" className="text-gray-300 mb-4">
                {invoice?.serviceName}
                
              </Typography>

              <Typography variant="body2" className="text-gray-300 mb-4 " style={{ display: 'none' }}>
                {invoice?.clientEmail}
                
              </Typography>

              <Typography variant="body2" className="text-gray-300">

              </Typography>

            </div>
          </div>
          <Box className="bg-white text-black p-4 mt-4 mb-4 rounded-lg shadow-md flex justify-center">
            {blob && <PdfComponent pdfUrl={blob} />}
          </Box>
          <div>
           

             <Typography variant="body2" className="font-bold">
                {invoice?.kind === "E" ? "Estimates Options" : "Invoice Options"}
              </Typography>
            <Box className="mt-2 flex flex-col gap-2">
              <button
                onClick={handleDeleteInvoice}
                className="flex items-center gap-2 text-white py-2 px-4 rounded cursor-pointer hover:bg-[#ffffff1a] transition-colors"
                aria-label="Delete invoice"
              >
                <FaTrash />   {invoice?.kind === "E" ? "Delete the Estimates" : "Delete the Invoice"}
              </button>
              <button
                onClick={handleDownloadInvoice}
                className="flex items-center gap-2 text-white py-2 px-4 rounded cursor-pointer hover:bg-[#ffffff1a] transition-colors"
                aria-label="Download invoice PDF"
              >
                <FaDownload />{invoice?.kind === "E" ? " Download Estimates" : " Download Invoice"}
              </button>
              {/* <button
                onClick={handleShareInvoice}
                className="flex items-center gap-2 text-white py-2 px-4 rounded cursor-pointer hover:bg-[#ffffff1a] transition-colors"
                aria-label="Share invoice"

              >
                <FaShareAlt />  {invoice?.kind === "E" ? "Share the Estimates" : "Share the Invoice"}
              </button> */}
            </Box>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
};