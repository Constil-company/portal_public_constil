

interface FormInvoiceProps {
    onClose: () => void;
}

const AiInvoiceForm = ({ onClose }: FormInvoiceProps) => {
    console.log(onClose);
    return (
        <>

            <div className="min-h-screen absolute md:relative md:flex mt-16 md:mt-0 lg:mt-0 inset-0 ">
                <div className="  py-4 sm:py-8">
                    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                        {/* ===== MAIN FORM ===== */}
                        <div className="flex-1">
                            <form className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg min-h-[calc(100vh-4rem)]">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">

                                    <div className="lg:col-span-2 space-y-4 sm:space-y-6">

                                        {/* Invoice Header */}
                                        <label className="block text-sm font-semibold mb-2 text-gray-700">
                                            Invoice Header Text
                                        </label>

                                        <hr className="border-gray-300" />

                                        {/* FROM Section */}
                                        <div className="mb-5">
                                            <div className="flex flex-col sm:flex-row justify-between">
                                                <label className="text-sm font-semibold uppercase text-gray-700">
                                                    FROM
                                                </label>
                                                <span className="text-sm font-semibold text-blue-400 hover:underline cursor-pointer">
                                                    Edit Business Profile
                                                </span>
                                            </div>

                                            <div className="p-2">
                                                <p className="text-gray-500 text-sm">Business Name Here</p>
                                            </div>
                                        </div>

                                        <hr className="border-gray-300" />

                                        {/* CLIENT NAME */}
                                        <div className="mb-10">
                                            <div className="flex flex-col sm:flex-row justify-between">
                                                <label className="text-sm font-semibold uppercase text-gray-700">
                                                    CLIENT NAME
                                                </label>
                                                <span className="text-sm font-semibold text-blue-400 hover:underline cursor-pointer">
                                                    New Client
                                                </span>
                                            </div>

                                            <select className="w-full h-12 px-4 rounded-lg border border-gray-300">
                                                <option>Select Client</option>
                                                <option>Client 1</option>
                                                <option>Client 2</option>
                                            </select>
                                        </div>

                                        <hr className="border-gray-300 my-5" />

                                        {/* ==== DISCOUNT & TAX CARDS ==== */}


                                        {/* Totals Box */}
                                        <div>
                                            <h3 className="text-[#1A1E50] font-semibold mb-1">Upload files</h3>
                                            <p className="text-gray-400 text-sm mb-4">
                                                Select and upload the files of your choice
                                            </p>

                                            <div className="border-2 border-dashed border-[#D6D9E4] rounded-xl p-6 flex flex-col items-center justify-center bg-[#FAFBFC]">
                                                {/* Cloud Icon */}
                                                <div className="w-12 h-12 mb-3 opacity-60">
                                                    <img src="/icons/cloud-upload.svg" alt="upload" />
                                                </div>

                                                <p className="text-gray-500 text-sm mb-1">Choose a file or drag & drop it here</p>
                                                <p className="text-gray-400 text-xs mb-4">JPEG, PNG, and PDF formats, up to 50MB</p>

                                                <button className="bg-white border border-gray-300 px-5 py-2 rounded-full text-sm text-[#1A1E50] shadow-sm hover:bg-gray-50">
                                                    Browse File
                                                </button>
                                            </div>
                                        </div>

                                        {/* ================= UPLOADING FILE CARD ================= */}
                                        <div className="bg-white rounded-xl p-4 shadow border border-gray-100 flex items-center gap-4">
                                            {/* File Icon */}
                                            <div className="w-10 h-10">
                                                <img src="/icons/pdf-icon.svg" alt="pdf" />
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-[#1A1E50] font-medium">Estimates</span>
                                                    <span className="text-gray-400 text-xs">Uploading...</span>
                                                </div>

                                                {/* Progress Bar */}
                                                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                                    <div className="bg-[#3B82F6] h-2 w-[60%] rounded-full"></div>
                                                </div>

                                                <p className="text-xs text-gray-400 mt-1">60 KB of 120 KB</p>
                                            </div>
                                        </div>

                                        {/* Add new item */}
                                        <button className="flex items-center gap-2 text-sm text-[#1A1E50] hover:text-blue-600">
                                            <span>Add new item</span>
                                            <svg width="18" height="18" fill="#1A1E50"><path d="M..." /></svg>
                                        </button>

                                        {/* ================= TOTALS BOX (EXACT MATCH) ================= */}
                                        <div className="p-6 rounded-xl bg-white border border-gray-200 w-full">
                                            <div className="flex flex-col w-full text-gray-600 space-y-3 text-sm">

                                                <div className="flex justify-between">
                                                    <span>Subtotal</span>
                                                    <span className="font-medium">USD 0,00</span>
                                                </div>

                                                <div className="flex justify-between">
                                                    <span className="flex items-center gap-2">Tax total
                                                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">0.0%</span>
                                                    </span>
                                                    <span className="font-medium">USD 0,00</span>
                                                </div>

                                                <div className="flex justify-between">
                                                    <span className="flex items-center gap-2">Discount total
                                                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">0.0%</span>
                                                    </span>
                                                    <span className="font-medium">USD 0,00</span>
                                                </div>

                                                <div className="border-t pt-3 flex justify-between items-center">
                                                    <span className="font-semibold text-[#1A1E50] text-base flex items-center gap-2">
                                                        TOTAL <span className="text-xs text-gray-400">USD</span>
                                                    </span>

                                                    <span className="font-bold text-blue-600 text-lg">USD 0,000</span>
                                                </div>

                                            </div>
                                        </div>

                                        {/* Payment Terms */}
                                        <div>
                                            <label className="block text-sm uppercase font-semibold mb-2 text-gray-700">
                                                PAYMENT TERMS
                                            </label>
                                            <select className="w-full h-[50px] px-4 rounded-lg border border-gray-300">
                                                <option>DUE ON RECEIPT</option>
                                                <option>10 DAYS</option>
                                                <option>30 DAYS</option>
                                            </select>
                                        </div>

                                        {/* Notes */}
                                        <div>
                                            <label className="block text-sm uppercase font-semibold mb-2 text-gray-700">
                                                NOTES
                                            </label>
                                            <textarea
                                                className="w-full h-[90px] p-4 rounded-lg border border-gray-300 resize-none"
                                                placeholder="Additional notes"
                                            ></textarea>
                                        </div>
                                    </div>

                                    {/* ================= RIGHT PANEL ================= */}
                                    <div className="space-y-6 p-4 sm:p-6 border-t-2 lg:border-t-0 lg:border-l-2 border-dashed border-gray-300">
                                        <div className="flex flex-col items-center">

                                            {/* Logo Upload */}
                                            <div className="border-2 border-dashed border-gray-300 w-full max-w-xs rounded-lg h-[150px] flex items-center justify-center bg-white">
                                                <span className="text-gray-600 text-sm">Upload Logo</span>
                                            </div>

                                            {/* Dates */}
                                            <div className="w-full mt-6 space-y-6">
                                                <div>
                                                    <label className="block text-sm font-semibold uppercase text-gray-700">
                                                        INVOICE DATE
                                                    </label>
                                                    <input type="date" className="w-full h-[50px] px-4 rounded-lg border border-gray-300" />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-semibold uppercase text-gray-700">
                                                        INVOICE DUE
                                                    </label>
                                                    <input type="date" className="w-full h-[50px] px-4 rounded-lg border border-gray-300" />
                                                </div>

                                                {/* Signature */}
                                                <div className="border-2 border-dashed border-gray-300 w-full rounded-lg h-[100px] flex items-center justify-center">
                                                    <span className="text-gray-600 text-sm">Attach Signature</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* ================= BUTTONS ================= */}
                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <div className="flex flex-col sm:flex-row justify-end gap-4">

                                        <button className="h-[48px] px-6 rounded-full bg-white border border-gray-200 hover:bg-gray-100 text-[#1A1E50] w-full sm:w-auto">
                                            Cancel
                                        </button>

                                        <button className="h-[48px] px-6 rounded-full bg-gray-100 border border-gray-300 text-gray-700 w-full sm:w-auto">
                                            Save Draft
                                        </button>

                                        <button className="h-[48px] px-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
                                            Create Invoice
                                        </button>
                                    </div>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>




        </>
    );
};


export default AiInvoiceForm;