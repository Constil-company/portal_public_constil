import PermIdentitySharpIcon from '@mui/icons-material/PermIdentitySharp';
import { Description, Tune } from "@mui/icons-material";
import { DeleteOutline } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import InvoiceTemplate1 from '../invoicetemplates/invoice-template1';
import InvoiceTemplate2 from '../invoicetemplates/invoice-template2';
import InvoiceTemplate3 from '../invoicetemplates/invoice-template3';
import InvoiceTemplate4 from '../invoicetemplates/invoice-template4';
import InvoiceTemplate5 from '../invoicetemplates/invoice-template5';

const ViewsInvoices = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const invoiceRef = useRef<HTMLDivElement>(null);
    const { invoiceData } = location.state || {};

    const handleDownloadPDF = async () => {
        if (!invoiceRef.current) {
            alert('Conteúdo da invoice não encontrado');
            return;
        }

        try {
            // Aguarda o conteúdo ser renderizado completamente
            await new Promise(resolve => setTimeout(resolve, 1000));

            const element = invoiceRef.current;

            // Configurações específicas para capturar apenas o template
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                allowTaint: true,
                foreignObjectRendering: true,
                // Remove elementos desnecessários
                ignoreElements: (element) => {
                    return !element.closest('[data-invoice-content]');
                }
            });

            // Configuração do PDF em formato A4
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            // Calcula as dimensões mantendo a proporção
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            const pageWidth = pdf.internal.pageSize.getWidth();
            const imgWidth = pageWidth - 20; // 10mm de margem em cada lado
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            // Adiciona a imagem centralizada
            pdf.addImage(
                imgData,
                'JPEG',
                10, // margem esquerda
                10, // margem superior
                imgWidth,
                imgHeight
            );

            // Nome do arquivo com data e número da invoice
            const date = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
            const fileName = `invoice_${invoiceData?.invoiceNumber || date}.pdf`;

            pdf.save(fileName);

        } catch (err) {
            console.error('Erro detalhado:', err);
            alert(`Erro ao gerar PDF: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
        }
    };

    // Verifica se o conteúdo está pronto e suas dimensões
    useEffect(() => {
        if (invoiceRef.current) {
            // console.log('Conteúdo disponível com dimensões:', {
            //     width: invoiceRef.current.offsetWidth,
            //     height: invoiceRef.current.offsetHeight,
            //     scrollWidth: invoiceRef.current.scrollWidth,
            //     scrollHeight: invoiceRef.current.scrollHeight
            // });
        }
    }, [invoiceData]);

    const renderTemplate = () => {
        if (!invoiceData) return null;

        switch (invoiceData.templateId) {
            case 1:
                return <InvoiceTemplate1 invoiceData={invoiceData} />;
            case 2:
                return <InvoiceTemplate2 invoiceData={invoiceData} />;
            case 3:
                return <InvoiceTemplate3 invoiceData={invoiceData} />;
            case 4:
                return <InvoiceTemplate4 invoiceData={invoiceData} />;
            case 5:
                return <InvoiceTemplate5 invoiceData={invoiceData} />;
            default:
                return <InvoiceTemplate1 invoiceData={invoiceData} />;
        }
    };

    if (!invoiceData) {
        return (
            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="text-center w-full max-w-md mx-auto">
                    <p className="text-lg sm:text-xl text-gray-600 mb-4">Nenhuma invoice selecionada</p>
                    <button
                        onClick={() => navigate('/forminvoice')}
                        className="w-full sm:w-auto px-6 py-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300"
                    >
                        Criar Nova Invoice
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 md:py-6 lg:py-8">
                <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-6">
                    {/* Sidebar */}
                    <div className="w-full lg:w-72 lg:shrink-0">
                        <div className="bg-[#0F172A] p-3 sm:p-4 md:p-6 flex flex-col text-white shadow rounded-xl gap-3 sm:gap-4 lg:sticky lg:top-4">
                            <div className="flex items-center lg:flex-col justify-center p-3 shadow rounded cursor-pointer !bg-[#9ED0FF] transition-colors duration-300 hover:bg-[#8BC0FF]">
                                <PermIdentitySharpIcon className="mr-2 lg:mr-0 lg:mb-2 w-5 h-5 sm:w-6 sm:h-6" />
                                <span className="text-sm sm:text-base">Factura Pre-forma</span>
                            </div>

                            <div className="rounded-2xl">
                                <h2 className="text-gray-400 text-xs sm:text-sm md:text-base">INVOICE OPTIONS</h2>
                                <div className="mt-2 sm:mt-3 space-y-2 sm:space-y-3">
                                    <div className="flex items-center gap-2 text-white cursor-pointer hover:opacity-80 transition-opacity duration-300">
                                        <DeleteOutline className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                                        <span className="text-xs sm:text-sm md:text-base">Delete the Invoice</span>
                                    </div>
                                    {/* <div
                                        className="flex items-center gap-2 text-white cursor-pointer hover:opacity-80 transition-opacity duration-300"
                                        onClick={() => navigate("/invoices/share")}
                                    >
                                        <SendOutlined className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                                        <span className="text-xs sm:text-sm md:text-base font-medium">Share the Invoice</span>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        <div className="bg-white rounded-xl sm:rounded-2xl p-3 border border-gray-200 shadow-sm">
                            {/* Header */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 md:mb-8">
                                <div className="mb-3 sm:mb-0">
                                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600 mb-1 sm:mb-2">INVOICES</h1>
                                    <span className="text-xs sm:text-sm md:text-base text-gray-700 font-semibold">{invoiceData.from}</span>
                                </div>
                                <button
                                    onClick={handleDownloadPDF}
                                    className="w-full sm:w-auto min-w-[200px] px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-full bg-[#098891] hover:bg-[#58a0a5] text-white transition-all duration-300 font-medium flex items-center justify-center gap-2 text-xs sm:text-sm md:text-base"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                    Download PDF
                                </button>
                            </div>

                            {/* Invoice Template and State Card Container */}
                            <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-6">
                                {/* Invoice Template */}
                                <div className="flex-1 min-w-0 order-2 lg:order-1">
                                    <div className="bg-gray-50 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4">
                                        <div 
                                            ref={invoiceRef}
                                            data-invoice-content="true"
                                            className="bg-white rounded-lg shadow-lg p-3 sm:p-4 md:p-6 lg:p-8 w-full max-w-4xl mx-auto overflow-auto"
                                        >
                                            {renderTemplate()}
                                        </div>
                                    </div>
                                </div>

                                {/* Invoice State Card */}
                                <div className="w-full lg:w-56 lg:shrink-0 order-1 lg:order-2">
                                    <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-100">
                                        <div className="border-b border-gray-300 pb-2 mb-2 sm:mb-3">
                                            <h2 className="text-gray-500 text-xs sm:text-sm font-semibold">INVOICE STATE</h2>
                                        </div>
                                        <div className="flex items-center gap-2 mb-2 sm:mb-3">
                                            <Description className="text-red-300 w-4 h-4 sm:w-5 sm:h-5" />
                                            <span className="text-gray-600 text-xs sm:text-sm">State:</span>
                                            <span className="text-green-600 text-xs sm:text-sm">Created</span>
                                            <a href="#" className="text-blue-400 text-xs font-medium ml-auto hover:text-blue-500 transition-colors duration-300">
                                                CHANGE
                                            </a>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Tune className="text-red-300 w-4 h-4 sm:w-5 sm:h-5" />
                                            <span className="text-gray-600 text-xs sm:text-sm font-medium">Style:</span>
                                            <span className="text-green-600 text-xs sm:text-sm font-semibold truncate max-w-[80px] sm:max-w-[100px]">{invoiceData.templateName}</span>
                                            <a href="#" className="text-blue-400 text-xs font-medium ml-auto whitespace-nowrap hover:text-blue-500 transition-colors duration-300">
                                                CHANGE
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center gap-3 mt-4 sm:mt-6 md:mt-8">
                                <button
                                    onClick={handleDownloadPDF}
                                    className="w-full sm:w-auto min-w-[200px] px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-full bg-[#098891] hover:bg-[#58a0a5] text-white transition-all duration-300 font-medium flex items-center justify-center gap-2 text-xs sm:text-sm md:text-base"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                    Download PDF
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewsInvoices;
