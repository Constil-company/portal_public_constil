/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Typography, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { SendInvoiceEmailRequest } from "../../api/invoices";
import { sendInvoiceByEmail } from "../../services/invoices-service";
import { getTokens } from "../../constants/storage/functions";
import { PdfComponent } from "../viewsestimated/pdf-view";

export default function EmailInvoice() {
  
  const [blob, setBlob] = useState<Uint8Array | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { invoice, pdfUrl } = location.state || {};

  const [description, setDescription] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");

  const userData = JSON.parse(localStorage.getItem("v1-buepay-user-data") || "{}");
  const senderEmail = userData.user?.email || "";


  useEffect(() => {
    if (!invoice || !pdfUrl) {
      toast.error("Invoice or PDF not found.");
      navigate("/404");
      return;
    }
    setRecipientEmail(invoice.clientEmail || "");
    setSummary(`Invoice ${invoice.invoiceId || ""}`);
  }, [invoice, pdfUrl, navigate]);

      useEffect(() => {
          // Verifica se a URL do PDF existe no estado da rota
          const fetchPdf = async () => {
              const urlFromState = pdfUrl;
              if (urlFromState && typeof urlFromState === 'string') {
                  // Verifica se a URL é válida
                  try {
                      new URL(urlFromState);
                      
                      const token = getTokens(); 

                      if (!token || !token.accessToken) {
                          toast.error("Authentication token not found.");
                          return;
                      }
                      
                      const response = await fetch(urlFromState, {
                          headers: {
                              'Authorization': `Bearer ${token.accessToken}`
                          }
                      });
                      const blob = await response.arrayBuffer();
                      setBlob(new Uint8Array(blob));
                  } catch (e) {
                      console.error('Invalid PDF URL:', urlFromState);
                      
                  }
              }
          };
          fetchPdf();
    }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!senderEmail) {
      toast.error("Sender email not found.");
      return;
    }
    if (!recipientEmail) {
      toast.error("Recipient email is required.");
      return;
    }
    if (!description) {
      setError("Description cannot be empty.");
      return;
    }
    if (description.length > 500) {
      setError("Description cannot exceed 500 characters.");
      return;
    }

    const payload: SendInvoiceEmailRequest = {
      clientId: invoice.clientId,
      invoiceId: invoice.id,
      message: description,
 
    };

    try {
       await sendInvoiceByEmail(payload);
      toast.success("Email sent successfully!");
     // navigate("/invoices");
    } catch (error) {
      toast.error("Error sending email. Please try again.");
      console.error("Send error:", error);
    }
  };

  return (
    <div className="container mx-auto">
      
      <div className="p-6 mx-auto rounded-2xl shadow-md w-full bg-white">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="input-group flex flex-col mt-5">
                <label className="uppercase mb-2 text-[#1A1E50]">From</label>
                <TextField
                  type="email"
                  disabled
                  value={senderEmail}
                  fullWidth
                  className="h-[50px]"
                  InputProps={{ readOnly: true }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      "&:hover fieldset": { borderColor: "#9ED0FF" },
                      "&.Mui-focused fieldset": { borderColor: "#9ED0FF" },
                    },
                  }}
                />
              </div>
              <div className="input-group flex flex-col mt-4">
                <label className="uppercase mb-2 text-[#1A1E50]">Send to</label>
                <TextField
                  type="email"
                  disabled
                  value={recipientEmail}
                  fullWidth
                  className="h-[50px]"
                  InputProps={{ readOnly: true }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      "&:hover fieldset": { borderColor: "#9ED0FF" },
                      "&.Mui-focused fieldset": { borderColor: "#9ED0FF" },
                    },
                  }}
                />
              </div>

              <div className="input-group flex flex-col mt-4">
                <label className="uppercase mb-2 text-[#1A1E50]">SUMMARY</label>
                <TextField
                  value={summary}
                  disabled
                  fullWidth
                  className="h-[50px]"
                  InputProps={{ readOnly: true }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      "&:hover fieldset": { borderColor: "#9ED0FF" },
                      "&.Mui-focused fieldset": { borderColor: "#9ED0FF" },
                    },
                  }}
                />
              </div>
              <div className="input-group flex flex-col mt-4">
                <label className="uppercase mb-2 text-[#1A1E50]">DESCRIPTION</label>
                <TextField
                  multiline
                  rows={4}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setError("");
                  }}
                  placeholder="Dear Client"
                  fullWidth
                  error={!!error}
                  helperText={error || `${description.length}/500 characters`}
                  inputProps={{ maxLength: 500 }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      "&:hover fieldset": { borderColor: "#9ED0FF" },
                      "&.Mui-focused fieldset": { borderColor: "#9ED0FF" },
                    },
                  }}
                />
              </div>
            </div>
            <div className="p-4 flex flex-col border-l border-dashed border-gray-300">
              <h1 className="text-[#1A1E50] font-semibold">ATTACHMENT</h1>
              <div className="border border-gray-200 rounded flex flex-col justify-center items-center p-4">
                {pdfUrl ? (
                  <div className="bg-white text-black rounded-lg shadow-md flex justify-center w-full">
                    {blob && <PdfComponent pdfUrl={blob} />}
                  </div>
                ) : (
                  <Typography variant="body2" color="error">
                    No PDF available
                  </Typography>
                )}
              </div>
            </div>
          </div>
          <div className="border border-gray-300 mt-6"></div>
          <div className="flex justify-end gap-3 mb-5 mt-3">
            <button
              type="submit"
              className="mt-4 p-3 w-50 rounded-full bg-[#12153A] text-white hover:bg-[#1A1E50] transition-colors duration-300"
            >
              Send Email
            </button>
          </div>
        </form>
      </div>
      
    </div>
  );
}
