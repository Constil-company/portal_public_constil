/* eslint-disable @typescript-eslint/no-explicit-any */
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import imageLogo from '../../assets/image/image.png';
import { SkeletonLoader } from '../common/skeleton-loader';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { format } from 'date-fns';
import { useGetPackageBuyQuery } from '../../services/rtkapi/invoiceApi';

export const BillingTable = () => {
  const { data: rawResponse, isLoading } = useGetPackageBuyQuery();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg w-full">
        <SkeletonLoader lines={6} />
      </div>
    );
  }

  // Extract the wallet data based on API_DOCUMENTATION.md {wallet: {...}, subscription: {...}}
  const packages = rawResponse?.wallet || rawResponse?.data?.wallet || rawResponse?.data || rawResponse;

  const walletFeatures = [
    {
      label: 'Estimates',
      remaining: packages?.estimate_remaining ?? packages?.remaining_estimates ?? 0,
      unlimited: packages?.estimate_unlimited === true,
    },
    {
      label: 'Invoices',
      remaining: packages?.invoice_remaining ?? packages?.remaining_invoices ?? 0,
      unlimited: packages?.invoice_unlimited === true,
    },
    {
      label: 'AI Estimates',
      remaining: packages?.ai_estimate_remaining ?? packages?.remaining_ai_estimates ?? 0,
      unlimited: packages?.ai_estimate_unlimited === true,
    },
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      {/* WALLET SUMMARY TABLE */}
      <div className="w-full overflow-x-auto rounded-[18px] shadow-sm border border-gray-100 bg-white">
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '18px' }}>
          <Table>
            <TableHead className="bg-gray-50/50">
              <TableRow>
                <TableCell className="font-bold text-[#12153A]">Resource</TableCell>
                <TableCell className="font-bold text-[#12153A]">Remaining</TableCell>
                <TableCell className="font-bold text-[#12153A]">Access</TableCell>
                <TableCell className="font-bold text-[#12153A]">Last Updated</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {walletFeatures.map((item, index) => (
                <TableRow key={index} className="hover:bg-gray-50/30 transition-colors">
                  <TableCell className="text-gray-700 font-medium">{item.label}</TableCell>

                  <TableCell className="text-gray-900 font-bold">
                    {item.unlimited ? (
                      <span className="text-indigo-600">∞ Unlimited</span>
                    ) : (
                      item.remaining
                    )}
                  </TableCell>

                  <TableCell>
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.unlimited 
                        ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' 
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}>
                      {item.unlimited ? 'Unlimited' : 'Limited'}
                    </div>
                  </TableCell>

                  <TableCell className="text-gray-500 text-sm">
                    {packages?.updated_at
                      ? format(new Date(packages.updated_at), 'MMM dd, yyyy')
                      : 'N/A'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* FEATURES CARD */}
      <div className="bg-white p-8 rounded-[18px] border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-8 bg-indigo-500 rounded-full"></div>
          <h3 className="text-xl font-bold text-[#12153A]">Your Usage Limits</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* FEATURES LIST */}
          <div className="lg:col-span-6 grid grid-cols-1 gap-4">
            {walletFeatures.map((item, i) => (
              <div key={i} className={`flex gap-4 items-center p-4 rounded-2xl transition border ${
                item.unlimited ? 'bg-indigo-50/20 border-indigo-100' : 'bg-gray-50/30 border-gray-100'
              }`}>
                <div className={`p-2 rounded-xl scale-90 ${item.unlimited ? 'bg-indigo-100 text-indigo-600' : 'bg-blue-100 text-blue-600'}`}>
                  <CheckCircleIcon sx={{ fontSize: 20 }} />
                </div>

                <div>
                  <h4 className="font-bold text-[#12153A] text-[15px]">
                    {item.label}
                  </h4>

                  <p className="text-gray-500 text-xs font-medium mt-1">
                    {item.unlimited
                      ? 'No limits applied to this resource'
                      : `${item.remaining} credits available for use`}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* IMAGE */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end xl:pr-12">
            <div className="relative">
              <div className="absolute -inset-4 bg-indigo-50 rounded-full blur-2xl opacity-50"></div>
              <img src={imageLogo} alt="Quota" className="relative w-64 h-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};