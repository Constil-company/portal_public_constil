import React from 'react';
import type { InvoiceData } from '../../types/invoice';

interface Props {
    invoiceData: InvoiceData;
}

const InvoiceTemplate1: React.FC<Props> = ({ invoiceData }) => {
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-start mb-8">
                <div>
                    {invoiceData.logo && (
                        <img src={invoiceData.logo} alt="Company Logo" className="h-16 mb-4" />
                    )}
                    <h2 className="text-2xl font-bold text-gray-800">{invoiceData.from}</h2>
                </div>
                <div className="text-right">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">INVOICE</h1>
                    <p className="text-gray-600">Invoice #: {invoiceData.invoiceNumber}</p>
                    <p className="text-gray-600">Date: {invoiceData.invoiceDate}</p>
                    <p className="text-gray-600">Due Date: {invoiceData.expirationDate}</p>
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-gray-600 text-sm font-semibold mb-2">BILL TO:</h3>
                <p className="text-gray-800 font-medium">{invoiceData.billTo}</p>
                <p className="text-gray-600">{invoiceData.billToAddress}</p>
            </div>

            <div className="mb-8">
                <table className="w-full">
                    <thead>
                        <tr className="border-b-2 border-gray-300">
                            <th className="text-left py-2">Description</th>
                            <th className="text-right py-2">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-gray-200">
                            {/* <td className="py-3">{invoiceData.itemName}</td> */}
                            {/* <td className="text-right py-3">${invoiceData.itemValue}</td> */}
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr className="border-t-2 border-gray-300">
                            <td className="py-3 font-bold">Total</td>
                            <td className="text-right py-3 font-bold">${invoiceData.amount}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
{/* ... */}
{/* ... */}
            <div className="mb-8">
                <h3 className="text-gray-600 text-sm font-semibold mb-2">TERMS AND CONDITIONS:</h3>
                <p className="text-gray-600">{invoiceData.terms}</p>
            </div>

            <div className="text-right">
                {invoiceData.signature && (
                    <div className="inline-block">
                        <img src={invoiceData.signature} alt="Signature" className="h-16 mb-2" />
                        <div className="border-t border-gray-400 pt-1">
                            <p className="text-gray-600 text-sm">Authorized Signature</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InvoiceTemplate1; 