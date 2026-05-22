import React from 'react';

interface InvoiceData {
    from: string;
    billTo: string;
    billToAddress: string;
    amount: string;
    itemName: string;
    itemValue: string;
    terms: string;
    invoiceNumber: string;
    invoiceDate: string;
    expirationDate: string;
    logo: string | null;
    signature: string | null;
}

interface Props {
    invoiceData: InvoiceData;
}

const InvoiceTemplate4: React.FC<Props> = ({ invoiceData }) => {
    return (
        <div className="p-8 max-w-4xl mx-auto">
            {/* Header with red accent */}
            <div className="bg-red-50 rounded-t-xl">
                <div className="bg-red-600 text-white p-8 rounded-t-xl">
                    <div className="flex justify-between items-start">
                        <div>
                            {invoiceData.logo && (
                                <img src={invoiceData.logo} alt="Company Logo" className="h-16 mb-4 bg-white p-2 rounded-lg" />
                            )}
                            <h2 className="text-2xl font-bold">{invoiceData.from}</h2>
                        </div>
                        <div className="text-right">
                            <h1 className="text-5xl font-bold mb-2">INVOICE</h1>
                            <p className="text-red-100">#{invoiceData.invoiceNumber}</p>
                        </div>
                    </div>
                </div>
                <div className="p-8">
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <p className="text-gray-600">Date Issued</p>
                            <p className="text-xl font-semibold text-gray-800">{invoiceData.invoiceDate}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Due Date</p>
                            <p className="text-xl font-semibold text-gray-800">{invoiceData.expirationDate}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="bg-white shadow-xl rounded-b-xl p-8">
                {/* Bill To Section */}
                <div className="mb-12">
                    <h3 className="text-red-600 text-sm font-bold uppercase tracking-wider mb-4">Bill To</h3>
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <p className="text-xl font-bold text-gray-800 mb-2">{invoiceData.billTo}</p>
                        <p className="text-gray-600">{invoiceData.billToAddress}</p>
                    </div>
                </div>

                {/* Items Table */}
                <div className="mb-12">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="text-left py-4 text-red-600 text-sm font-bold uppercase tracking-wider">
                                    Description
                                </th>
                                <th className="text-right py-4 text-red-600 text-sm font-bold uppercase tracking-wider">
                                    Amount
                                </th>
                            </tr>
                        </thead>
                        <tbody className="border-t border-b border-gray-200">
                            <tr>
                                <td className="py-6">{invoiceData.itemName}</td>
                                <td className="text-right py-6">${invoiceData.itemValue}</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td className="pt-6 text-red-600 font-bold">Total Amount</td>
                                <td className="pt-6 text-right text-2xl font-bold text-red-600">
                                    ${invoiceData.amount}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Terms and Conditions */}
                <div className="mb-12">
                    <h3 className="text-red-600 text-sm font-bold uppercase tracking-wider mb-4">
                        Terms and Conditions
                    </h3>
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <p className="text-gray-600">{invoiceData.terms}</p>
                    </div>
                </div>

                {/* Signature */}
                <div className="text-right">
                    {invoiceData.signature && (
                        <div className="inline-block">
                            <img src={invoiceData.signature} alt="Signature" className="h-16 mb-2" />
                            <div className="border-t-2 border-red-200 pt-2">
                                <p className="text-red-600 text-sm font-bold uppercase tracking-wider">
                                    Authorized Signature
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InvoiceTemplate4; 