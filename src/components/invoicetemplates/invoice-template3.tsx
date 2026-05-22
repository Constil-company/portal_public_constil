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

const InvoiceTemplate3: React.FC<Props> = ({ invoiceData }) => {
    return (
        <div className="relative p-8 max-w-4xl mx-auto">
            {/* Blue Side Band */}
            <div className="absolute top-0 left-0 w-24 h-full bg-blue-600 rounded-l-xl"></div>

            <div className="relative ml-32">
                {/* Header */}
                <div className="flex justify-between items-start mb-12">
                    <div>
                        {invoiceData.logo && (
                            <img src={invoiceData.logo} alt="Company Logo" className="h-24 mb-4" />
                        )}
                        <h2 className="text-3xl font-bold text-gray-800">{invoiceData.from}</h2>
                    </div>
                    <div className="text-right">
                        <h1 className="text-6xl font-bold text-blue-600 mb-6">INVOICE</h1>
                        <div className="space-y-1">
                            <p className="text-gray-600">Invoice #: <span className="font-semibold text-gray-800">{invoiceData.invoiceNumber}</span></p>
                            <p className="text-gray-600">Date: <span className="font-semibold text-gray-800">{invoiceData.invoiceDate}</span></p>
                            <p className="text-gray-600">Due Date: <span className="font-semibold text-gray-800">{invoiceData.expirationDate}</span></p>
                        </div>
                    </div>
                </div>

                {/* Bill To Section */}
                <div className="mb-12">
                    <h3 className="text-blue-600 text-xl font-bold mb-4">BILL TO</h3>
                    <div className="bg-gray-50 p-6 rounded-r-xl border-l-4 border-blue-600">
                        <p className="text-xl font-bold text-gray-800 mb-2">{invoiceData.billTo}</p>
                        <p className="text-gray-600">{invoiceData.billToAddress}</p>
                    </div>
                </div>

                {/* Items Table */}
                <div className="mb-12">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-2 border-blue-600">
                                <th className="text-left py-4 text-blue-600 font-bold">Description</th>
                                <th className="text-right py-4 text-blue-600 font-bold">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-gray-200">
                                <td className="py-6">{invoiceData.itemName}</td>
                                <td className="text-right py-6">${invoiceData.itemValue}</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr className="border-t-2 border-blue-600">
                                <td className="py-6 text-xl font-bold text-blue-600">Total Amount</td>
                                <td className="text-right py-6 text-xl font-bold text-blue-600">
                                    ${invoiceData.amount}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Terms and Conditions */}
                <div className="mb-12">
                    <h3 className="text-blue-600 text-xl font-bold mb-4">TERMS AND CONDITIONS</h3>
                    <div className="bg-gray-50 p-6 rounded-r-xl border-l-4 border-blue-600">
                        <p className="text-gray-600">{invoiceData.terms}</p>
                    </div>
                </div>

                {/* Signature */}
                <div className="text-right">
                    {invoiceData.signature && (
                        <div className="inline-block">
                            <img src={invoiceData.signature} alt="Signature" className="h-24 mb-2" />
                            <div className="border-t-2 border-blue-600 pt-2">
                                <p className="text-blue-600 font-semibold">Authorized Signature</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InvoiceTemplate3; 