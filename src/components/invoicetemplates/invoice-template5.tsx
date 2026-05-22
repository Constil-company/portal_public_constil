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

const InvoiceTemplate5: React.FC<Props> = ({ invoiceData }) => {
    return (
        <div className="p-12 max-w-4xl mx-auto font-light">
            {/* Header */}
            <div className="flex justify-between items-start mb-16">
                <div>
                    {invoiceData.logo && (
                        <img src={invoiceData.logo} alt="Company Logo" className="h-12 mb-6 opacity-90" />
                    )}
                    <h2 className="text-3xl text-gray-800">{invoiceData.from}</h2>
                </div>
                <div className="text-right">
                    <h1 className="text-5xl text-gray-800 mb-6">Invoice</h1>
                    <div className="space-y-1 text-gray-600">
                        <p>No. {invoiceData.invoiceNumber}</p>
                        <p>Issued: {invoiceData.invoiceDate}</p>
                        <p>Due: {invoiceData.expirationDate}</p>
                    </div>
                </div>
            </div>

            {/* Bill To Section */}
            <div className="mb-16">
                <p className="text-sm text-gray-500 mb-4">BILL TO</p>
                <div className="border-l-2 border-gray-200 pl-4">
                    <p className="text-xl text-gray-800 mb-2">{invoiceData.billTo}</p>
                    <p className="text-gray-600">{invoiceData.billToAddress}</p>
                </div>
            </div>

            {/* Items Table */}
            <div className="mb-16">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left py-4 text-sm text-gray-500 font-normal">DESCRIPTION</th>
                            <th className="text-right py-4 text-sm text-gray-500 font-normal">AMOUNT</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-gray-100">
                            <td className="py-6 text-gray-800">{invoiceData.itemName}</td>
                            <td className="py-6 text-right text-gray-800">${invoiceData.itemValue}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td className="pt-8 text-sm text-gray-500 font-normal">TOTAL AMOUNT</td>
                            <td className="pt-8 text-right text-2xl text-gray-800">${invoiceData.amount}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* Terms and Conditions */}
            <div className="mb-16">
                <p className="text-sm text-gray-500 mb-4">TERMS AND CONDITIONS</p>
                <div className="border-l-2 border-gray-200 pl-4">
                    <p className="text-gray-600">{invoiceData.terms}</p>
                </div>
            </div>

            {/* Signature */}
            <div className="text-right">
                {invoiceData.signature && (
                    <div className="inline-block">
                        <img src={invoiceData.signature} alt="Signature" className="h-12 mb-2 opacity-90" />
                        <div className="border-t border-gray-200 pt-2">
                            <p className="text-sm text-gray-500">Authorized Signature</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InvoiceTemplate5; 