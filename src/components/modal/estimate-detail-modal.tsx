/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { Box, Chip, Typography, Modal, Fade, Backdrop } from "@mui/material";
// Added FaTimes for the close icon
import { FaTrash, FaDownload,  FaTimes } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import { EstimateModel } from "../../models/estimate";

import { PdfComponent } from "../viewsestimated/pdf-view";
import { showConfirmToast } from "../messagealert/confirm-toast";
import { useDeleteEstimateMutation } from "../../services/rtkapi/invoiceApi";
import { toast } from "react-toastify";
import { getTokens } from "../../constants/storage/functions";

interface EstimateDetailModalProps {
  open: boolean;
  onClose: () => void;
  estimate: EstimateModel;

}

export const EstimateDetailModal = ({ open, onClose, estimate }: EstimateDetailModalProps) => {
  const [deleteEstimate] = useDeleteEstimateMutation();
  const [blob, setBlob] = useState<Uint8Array | null>(null);
  // const navigate = useNavigate();

    useEffect(() => {
        // Verifica se a URL do PDF existe no estado da rota
        const fetchPdf = async () => {

            if (estimate.documentUrl && typeof estimate.documentUrl === 'string') {
                // Verifica se a URL é válida
                try {
                    new URL(estimate.documentUrl);

                    const token = getTokens();
                    if (!token?.accessToken) {                        
                        return;
                    }
                    const response = await fetch(estimate.documentUrl, {
                        headers: {
                            'Authorization': `Bearer ${token.accessToken}`
                        }
                    });
                    const blob = await response.arrayBuffer();
                    setBlob(new Uint8Array(blob));
                } catch (e) {
                    console.error('Invalid PDF URL:', estimate.documentUrl);
                    
                }
            }
        };
        fetchPdf();
    }, [estimate.documentUrl]);

  const handleDeleteEstimate = () => {
    const estimateId = estimate.id ?? "";
    showConfirmToast({
      message: "You won't be able to revert this!",
      onConfirm: async () => {
        try {
          await deleteEstimate(estimateId).unwrap();
          toast.success("Estimate deleted successfully");
          onClose();
        } catch (error) {
           console.error("Failed to delete estimate", error);
           toast.error("Failed to delete estimate");
        }
      },
    });
  };

  const handleDownloadEstimate = async () => {
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

      link.download = `Estimate_${estimate.estimateId || "unknown"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {

      toast.error('Failed to download the PDF. Please try again.');
    }
  };

  // const handleShareEstimate = () => {
  //   if (!estimate || !estimate.documentUrl) {
  //     console.error("Missing client or estimate data");
  //     alert("Client data is missing. Cannot share estimate.");
  //     return;
  //   }

  //   navigate("/estimates/share", {
  //     state: {

  //       estimate,
  //       pdfUrl: estimate.documentUrl,
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
              label={estimate?.settled ? "Paid" : "UNPAID"}
              size="small"
              // Adjusted margin-top to ensure it doesn't overlap with the new close button
              // Original: className="font-bold mb-2 mt-4 mr-4"
              className="font-bold mb-2 mt-8 sm:mt-4 mr-4" // Added mt-8 for smallest screens, revert to mt-4 for sm+
              sx={estimate?.settled
                ? { backgroundColor: "#B4DFC0", color: "#34A853", borderRadius: "4px" }
                : { backgroundColor: "#FDD1D1", color: "#f4777f", borderRadius: "4px" }
              }
            /> */}
            <Chip
              label={`Viewed: ${estimate?.clientView} view`}
              size="small"
              // Adjusted margin-top to ensure it doesn't overlap with the new close button
              // Original: className="font-bold mb-2 mt-4"
              className="font-bold mb-2 mt-8 sm:mt-4" // Added mt-8 for smallest screens, revert to mt-4 for sm+
              sx={{ backgroundColor: "#1F2145FF", borderRadius: "4px", padding: "15px", color: "#f5f5f5" }}
            />
            <div className="mt-2 mb-2">
              <Typography variant="h6" className="font-bold">
                {estimate?.kind === "E" ? "Estimates" : "Estimate"} #{estimate?.estimateId}
              </Typography>

              <Typography variant="body2" className="text-gray-300 mb-4">
                {estimate?.serviceName}
                
              </Typography>

              <Typography variant="body2" className="text-gray-300 mb-4 " style={{ display: 'none' }}>
                {estimate?.clientEmail}
                
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
                {estimate?.kind === "E" ? "Estimates Options" : "Estimate Options"}
              </Typography>
            <Box className="mt-2 flex flex-col gap-2">
              <button
                onClick={handleDeleteEstimate}
                className="flex items-center gap-2 text-white py-2 px-4 rounded cursor-pointer hover:bg-[#ffffff1a] transition-colors"
                aria-label="Delete estimate"
              >
                <FaTrash />   {estimate?.kind === "E" ? "Delete the Estimates" : "Delete the Estimate"}
              </button>
              <button
                onClick={handleDownloadEstimate}
                className="flex items-center gap-2 text-white py-2 px-4 rounded cursor-pointer hover:bg-[#ffffff1a] transition-colors"
                aria-label="Download estimate PDF"
              >
                <FaDownload />{estimate?.kind === "E" ? " Download Estimates" : " Download Estimate"}
              </button>
              {/* <button
                onClick={handleShareEstimate}
                className="flex items-center gap-2 text-white py-2 px-4 rounded cursor-pointer hover:bg-[#ffffff1a] transition-colors"
                aria-label="Share estimate"

              >
                <FaShareAlt />  {estimate?.kind === "E" ? "Share the Estimates" : "Share the Estimate"}
              </button> */}
            </Box>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
};