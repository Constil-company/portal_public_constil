import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const InvoiceViews = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const [invoice] = useState({ pdfUrl: location.state?.pdfUrl });

    const handleDownloadPDF = async () => {
        
    };

 

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Botões de ação */}
                <div className="mb-6 flex justify-end gap-4">
                    <button
                        onClick={() => navigate('/forminvoice')}
                        className="px-6 py-3 rounded-full border-2 border-[#1A1E50] text-[#1A1E50] hover:bg-gray-100 transition-all duration-300 font-medium"
                    >
                        Voltar
                    </button>
                    <button
                        onClick={handleDownloadPDF}
                        className="px-6 py-3 rounded-full bg-[#12153A] hover:bg-[#1A1E50] text-white transition-all duration-300 font-medium"
                    >
                        Download PDF
                    </button>
                </div>

                {/* Preview da Invoice */}
                <div className="bg-white shadow-xl rounded-xl overflow-hidden">
                <Document file={invoice.pdfUrl} >
                <Page pageNumber={1} />
                </Document>
                </div>
            </div>
        </div>
    );
};

export default InvoiceViews; 