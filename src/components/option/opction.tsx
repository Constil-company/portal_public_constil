import { CardContent, Typography, Tabs, Tab } from '@mui/material';
import { useState } from 'react';
import SubscriptionIcon from '../../assets/image/subscription-icon.png';
import { useNavigate } from 'react-router-dom';
import OpcInvoiceEstimate from '../opcinvoiceestimate/opc-estimate';
const Option = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);
  const newinvoice = () => {
    navigate('/newinvoice');
  };
  const renderTabContent = () => {
    switch (selectedTab) {
      case 0:
        return (
          <>
            <div className="text-center w--full">
              <div className="flex items-center justify-center">
                <img src={SubscriptionIcon} alt="" width={300} draggable="false" className="pointer-events-none" />
              </div>
              <h2 className="text-2xl font-semibold">Create your invoice in seconds! 🧾</h2>
              <p className="text-gray-600 mt-2">
                Add the details, generate the document, and <br />
                send it to the client with ease. Start now!
              </p>
              <button
                onClick={newinvoice}
                className="mt-4 bg-[#12153A] hover:bg-[#1A1E50] text-white p-3 w-2xs rounded-full cursor-pointer transition duration-300">
                Create new invoice
              </button>
            </div>
          </>
        );
      case 1:
        return 'Paid invoices content';
      case 2:
        return 'Invoices to be paid content';
      case 3:
        return 'Set by email content';
      case 4:
        return 'Deleted invoices content';
      default:
        return 'Select a tab';
    }
  };

  return (
    <div className="flex h-screen ">
      <OpcInvoiceEstimate />

      {/* Main Content */}
      <div className="w-2/3 p-6 ml-6 rounded-2xl shadow">
        {/* Tabs */}
        <Tabs value={selectedTab} onChange={(_, newValue) => setSelectedTab(newValue)} className="mb-4">
          <Tab label="All the Envoices" className="!text-red-500" />
          <Tab label="Paid Invoices" />
          <Tab label="Invoices to be paid" />
          <Tab label="Set by email" />
          <Tab label="Deleted" />
        </Tabs>

        {/* Content */}
        <div className="flex flex-col items-center justify-center py-12 ">
          <CardContent className="text-center">
            <Typography variant="h6" className="mt-4">
              {renderTabContent()}
            </Typography>
          </CardContent>
        </div>
      </div>
    </div>
  );
};

export default Option;
