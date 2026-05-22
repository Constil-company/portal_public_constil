/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Copy } from 'lucide-react';
import { DeleteOutline, SendOutlined } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { PdfComponent } from './pdf-view';
import MessageBox from '../messagealert/message';
import { getTokens } from '../../constants/storage/functions';

const ViewsEstimateComponent = ({ title }: { title?: string }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [invoiceLink, setInvoiceLink] = useState('');
  const [isGeneratingPDF] = useState(false);
  const [blob, setBlob] = useState<Uint8Array | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' }>({ text: '', type: 'success' });
  // SVG Icon for Invoices
  const InvoiceIcon = ({ className }: { className?: string }) => (
    <svg
      width="32"
      height="32"
      viewBox="0 0 34 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}>
      <path
        d="M17 16.5C20.912 16.5 24.0833 13.422 24.0833 9.625C24.0833 5.82804 20.912 2.75 17 2.75C13.088 2.75 9.91667 5.82804 9.91667 9.625C9.91667 13.422 13.088 16.5 17 16.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M27.2142 21.6425L22.1991 26.5101C22.0008 26.7026 21.8166 27.06 21.7741 27.3213L21.505 29.1775C21.4058 29.8512 21.8875 30.3188 22.5816 30.2225L24.4941 29.9613C24.7633 29.92 25.1458 29.7413 25.33 29.5488L30.3449 24.6813C31.2091 23.8426 31.6199 22.8663 30.3449 21.6288C29.0841 20.405 28.0783 20.8038 27.2142 21.6425Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M26.4917 22.3438C26.9167 23.8288 28.1066 24.9837 29.6366 25.3962"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.8308 30.25C4.8308 24.9288 10.285 20.625 17 20.625C18.4733 20.625 19.89 20.8312 21.2075 21.2162"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  useEffect(() => {
    // Verifica se a URL do PDF existe no estado da rota
    const fetchPdf = async () => {
      const urlFromState = location.state?.pdfUrl;
      if (urlFromState && typeof urlFromState === 'string') {
        // Verifica se a URL é válida
        try {
          new URL(urlFromState);
          setInvoiceLink(urlFromState);
          const token = getTokens();
          if (!token?.accessToken) {
            setMessage({ text: 'Authentication token not found', type: 'error' });
            return;
          }
          const response = await fetch(urlFromState, {
            headers: {
              Authorization: `Bearer ${token.accessToken}`,
            },
          });
          const blob = await response.arrayBuffer();
          setBlob(new Uint8Array(blob));
        } catch (e: any) {
          console.error('Invalid PDF URL:', urlFromState);
        }
      }
    };
    fetchPdf();
  }, [location.state]);

  const handleDownloadPDF = async () => {
    if (!blob) {
      setMessage({ text: 'No PDF available to download', type: 'error' });
      return;
    }
    try {
    
      const blobData = new Blob([blob], { type: 'application/pdf' });
      const blobUrl = window.URL.createObjectURL(blobData);

      // Cria o link para download
      const link = document.createElement('a');
      link.href = blobUrl;

      // Formata a data para o nome do arquivo
      const pad = (num: number) => num.toString().padStart(2, '0');
      const now = new Date();
      const year = now.getFullYear();
      const month = pad(now.getMonth() + 1);
      const day = pad(now.getDate());
      const hours = pad(now.getHours());
      const minutes = pad(now.getMinutes());
      const seconds = pad(now.getSeconds());
      const filename = `invoice_${year}_${month}_${day}_${hours}_${minutes}_${seconds}.pdf`;

      link.download = filename;
      document.body.appendChild(link);
      // Dispara o clique para iniciar o download
      link.click();

      // Define the success message
      setMessage({ text: 'PDF downloaded successfully!', type: 'success' });

      // Clean up resources
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(link);
    } catch (error) {
      setMessage({ text: 'Unable to download PDF, please try again later', type: 'error' });
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 w-[100%]">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 md:py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-6 ">
          {/* Sidebar */}
          <div className="w-full lg:w-72 lg:shrink-0">
            <div className="bg-[#0F172A] h-[100%] p-3 sm:p-4 md:p-6 flex flex-col text-white shadow rounded-xl gap-3 sm:gap-4 lg:sticky lg:top-4">
              <div className="flex items-center lg:flex-col justify-center p-3 shadow rounded cursor-pointer !bg-[#448AFF] transition-colors duration-300">
                <InvoiceIcon className="mb-1 sm:mb-2 text-white" />
                <span className="text-sm sm:text-base uppercase">Create {title ?? ''}</span>
              </div>

              <div className="rounded-2xl">
                <h2 className="text-gray-400 text-xs sm:text-sm md:text-base uppercase">{title ?? ''} OPTIONS</h2>
                <div className="mt-2 sm:mt-3 space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2 text-white cursor-pointer hover:opacity-80 transition-opacity duration-300">
                    <DeleteOutline className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-xs sm:text-sm md:text-base uppercase">Delete {title ?? ''}</span>
                  </div>
                  <div
                    className="flex items-center gap-2 text-white cursor-pointer hover:opacity-80 transition-opacity duration-300"
                    onClick={() => navigate('/sendinvoices')}>
                    <SendOutlined className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-xs sm:text-sm md:text-base font-medium uppercase">Share {title ?? ''}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1  w-full">
            <div className="bg-white rounded-xl sm:rounded-2xl p-3 border border-gray-200 shadow-sm">
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 md:mb-8">
                <div className="mb-3 sm:mb-0">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600 mb-1 sm:mb-2 uppercase">
                    {title ?? ''}
                  </h1>

                  <MessageBox message={message.text} type={message.type} />
                </div>
              </div>

              {/* Invoice Content */}
              <div className="flex flex-col w-full lg:flex-row gap-3">
                {/* Invoice Template */}
                <div className="flex-[3] min-w-0 order-2 lg:order-1">
                  <div className="bg-gray-50 rounded-lg sm:rounded-xl" style={{ minHeight: '800px', padding: '0' }}>
                    {blob && <PdfComponent pdfUrl={blob} />}
                  </div>
                </div>

                {/* Side Cards */}
                <div className="w-full lg:w-64 lg:shrink-0 order-1 lg:order-2 space-y-3 sm:space-y-4">
                  {/* Email Recipients Card */}
                  <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-100 shadow-sm">
                    <div className="border-b border-gray-200 pb-2 mb-3">
                      <h2 className="text-gray-700 text-sm sm:text-base font-semibold uppercase">Email Recipients</h2>
                    </div>
                    <div className="space-y-3">
                      <label className="block text-xs sm:text-sm text-gray-600 font-medium">EMAIL</label>
                      <input
                        type="email"
                        placeholder="Enter recipient email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2.5 border border-gray-300 rounded-lg text-sm"
                      />
                      <button className="w-full bg-[#002D5B] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-[#003d7a] transition-colors duration-300">
                        Send Email
                      </button>
                    </div>
                  </div>

                  {/* Invoice Link Card */}
                  <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-gray-700 text-sm sm:text-base font-semibold mb-1 uppercase">
                          {title ?? ''} Link
                        </h2>
                        <a
                          href={invoiceLink}
                          className="text-orange-500 text-xs sm:text-sm font-medium block max-w-[180px] truncate"
                          title={invoiceLink}
                          target="_blank"
                          rel="noopener noreferrer">
                          {invoiceLink}
                        </a>
                      </div>
                      <button className="text-gray-500 hover:text-gray-700 transition-colors duration-300 p-1.5 hover:bg-gray-100 rounded-lg">
                        <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-3 mt-4 sm:mt-6 md:mt-8">
                <button
                  onClick={handleDownloadPDF}
                  disabled={isGeneratingPDF}
                  className={`w-full cursor-pointer sm:w-auto min-w-[200px] px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-full ${
                    isGeneratingPDF ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#098891] hover:bg-[#58a0a5]'
                  } text-white transition-all duration-300 font-medium flex items-center justify-center gap-2 text-xs sm:text-sm md:text-base`}>
                  {isGeneratingPDF ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        viewBox="0 0 20 20"
                        fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Download PDF
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewsEstimateComponent;
