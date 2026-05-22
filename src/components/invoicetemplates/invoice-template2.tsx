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

const InvoiceTemplate2: React.FC<Props> = ({ invoiceData }) => {
    return (
        <div className="p-8 max-w-4xl mx-auto">
            {/* Header with blue accent */}
            <div className="bg-blue-50 p-6 rounded-xl mb-8">
                <div className="flex justify-between items-start">
                    <div>
                        {invoiceData.logo && (
                            <img src={invoiceData.logo} alt="Company Logo" className="h-20 mb-4" />
                        )}
                        <h2 className="text-2xl font-bold text-blue-800">{invoiceData.from}</h2>
                    </div>
                    <div className="text-right">
                        <h1 className="text-5xl font-bold text-blue-800 mb-4">INVOICE</h1>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <p className="text-gray-600">Invoice #: {invoiceData.invoiceNumber}</p>
                            <p className="text-gray-600">Date: {invoiceData.invoiceDate}</p>
                            <p className="text-gray-600">Due Date: {invoiceData.expirationDate}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bill To Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-blue-800 text-lg font-semibold mb-4">BILL TO:</h3>
                    <p className="text-gray-800 font-medium text-lg mb-2">{invoiceData.billTo}</p>
                    <p className="text-gray-600">{invoiceData.billToAddress}</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-blue-800 text-lg font-semibold mb-4">AMOUNT DUE:</h3>
                    <p className="text-4xl font-bold text-blue-800">${invoiceData.amount}</p>
                </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
                <table className="w-full bg-white rounded-xl overflow-hidden shadow-sm">
                    <thead className="bg-blue-50">
                        <tr>
                            <th className="text-left py-4 px-6 text-blue-800">Description</th>
                            <th className="text-right py-4 px-6 text-blue-800">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-gray-100">
                            <td className="py-4 px-6">{invoiceData.itemName}</td>
                            <td className="text-right py-4 px-6">${invoiceData.itemValue}</td>
                        </tr>
                    </tbody>
                    <tfoot className="bg-blue-50">
                        <tr>
                            <td className="py-4 px-6 font-bold text-blue-800">Total</td>
                            <td className="text-right py-4 px-6 font-bold text-blue-800">
                                ${invoiceData.amount}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* Terms and Conditions */}
            <div className="bg-gray-50 p-6 rounded-xl mb-8">
                <h3 className="text-blue-800 text-lg font-semibold mb-4">TERMS AND CONDITIONS:</h3>
                <p className="text-gray-600">{invoiceData.terms}</p>
            </div>

            {/* Signature */}
            <div className="text-right">
                {invoiceData.signature && (
                    <div className="inline-block">
                        <img src={invoiceData.signature} alt="Signature" className="h-20 mb-2" />
                        <div className="border-t-2 border-blue-200 pt-2">
                            <p className="text-blue-800 text-sm font-medium">Authorized Signature</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InvoiceTemplate2; 