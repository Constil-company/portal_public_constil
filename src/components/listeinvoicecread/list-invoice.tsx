/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from 'react';
import { InvoiceModel } from '../../models/invoice';
import { SkeletonLoader } from '../common/skeleton-loader';
import InvoiceCard from '../iteminvoices/item-invoices';
import { InvoiceDetailModal } from '../modal/invoice-detail-modal';
import imageBlur from '../../assets/logo/notificacao.svg';
import { Pagination, Tab, Tabs } from '@mui/material';
import PlanLimitModal from '../modal/plan-limit-modal';
import FormInvoice from '../../components/formnewinvoice/forminvoice';
import { useAllInvoicesQuery, useGetInvoicesQuery } from '../../services/rtkapi/invoiceApi';
import { useNavigate } from 'react-router-dom';

const ListInvoiceCreatedS = () => {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const { data: searchData } = useAllInvoicesQuery({ name: search }, { skip: !search });

  const [planLimitModalOpen, setPlanLimitModalOpen] = useState<boolean>(false);
  const [planName, setPlanName] = useState<string>('');
  const itemsPerPage = 9;
  const navigate = useNavigate();
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceModel | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState<boolean>(false);
  const [showNewInvoiceForm, setShowNewInvoiceForm] = useState<boolean>(false);

  const { data, isLoading, refetch } = useGetInvoicesQuery();
  
  useEffect(() => {
    refetch();
  }, [refetch]);
  const invoices: InvoiceModel[] = InvoiceModel.fromListResponse(search ? searchData?.data || [] : data?.data || []);
  const filteredInvoices = invoices.filter((inv) => search ? inv.client_name?.toLowerCase().includes(search.toLowerCase()) : true);

  const totalInvoices = filteredInvoices.length;

  const totalPages = Math.ceil(totalInvoices / itemsPerPage);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => setPage(value);
  const handleOpenDetail = (invoice: InvoiceModel) => {
    setSelectedInvoice(invoice);
    setDetailModalOpen(true);
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCloseDetail = () => {
    setDetailModalOpen(false);
    setSelectedInvoice(null);
  };

  const newInvoice = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/user-api/wallet`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
        }
      });
      const data = await res.json();
      const wallet = data?.wallet || data;
      
      if (wallet?.invoice_remaining > 0) {
        // setShowNewInvoiceForm(true);
        navigate('/invoices/new');
      } else {
        setPlanName('invoice');
        setPlanLimitModalOpen(true);
      }
    } catch (e) {
      console.error('Error fetching wallet:', e);
      // Fallback
      navigate('/invoices/new');
    }
  };

  const handleUpgrade = () => {
    setPlanLimitModalOpen(false);
  };

  const renderTabContent = () => {
    if (showNewInvoiceForm) {
      return (
        <div className="w-full flex justify-center -mt-12">
          <section className="flex-1 flex justify-center h-full w-full">
            <FormInvoice onClose={() => setShowNewInvoiceForm(false)} />
          </section>
        </div>
      );
    }

    if (!isLoading && !search && invoices?.length === 0) {
      return (
        <div className="text-center w-full">
          <div className="flex items-center justify-center mt-10">
            <img src={imageBlur} alt="No invoices" width={150} draggable="false" className="pointer-events-none mb-4" />
          </div>
          <h2 className="text-2xl font-semibold">No Invoices Yet</h2>
          <p className="text-gray-600 mt-2">
            Start by creating your first invoice and <br /> keep your billing organized.
          </p>
          <button
            onClick={newInvoice}
            className="mt-4 bg-[#448AFF] hover:bg-[#3d7ef7] text-white p-3 rounded-full cursor-pointer transition duration-300">
            Create new invoice
          </button>
        </div>
      );
    }

    return (
      <>
        <div className="w-full flex justify-center mb-6">
          <div className="relative w-full ">
            <input
              type="text"
              placeholder="Search by client name"
              value={search}
              onChange={handleSearchChange}
              className="w-full border border-gray-300 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Search loading spinner */}
            {search && isLoading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
          {isLoading ? (
            Array.from({ length: itemsPerPage }).map((_, index) => <SkeletonLoader key={index} lines={4} />)
          ) : filteredInvoices.length > 0 ? (
            filteredInvoices
              .slice((page - 1) * itemsPerPage, page * itemsPerPage)
              .map((inv: InvoiceModel) => (
                <InvoiceCard key={inv.id} invoicesData={inv} onClickDetail={() => handleOpenDetail(inv)} />
              ))
          ) : (
            <div className="col-span-full text-center mt-10">
              <p className="text-gray-500 text-sm">
                No invoices found for <strong>"{search}"</strong>
              </p>
            </div>
          )}
        </div>

        {totalPages > 1 && !isLoading && (
          <div className="w-full flex justify-end mt-6">
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              shape="rounded"
              sx={{
                '& .MuiPaginationItem-root': {
                  color: '#448AFF',
                  borderRadius: '4px',
                  minWidth: '32px',
                  height: '32px',
                },
                '& .Mui-selected': {
                  backgroundColor: '#448AFF !important',
                  color: 'white',
                },
              }}
            />
          </div>
        )}
      </>
    );
  };

  return (
    <div className="flex w-full md:min-h-[83vh] md:px-2 md:py-2">
      <div className="w-full rounded-2xl border border-gray-100 overflow-x-hidden p-3 sm:p-4 md:p-6 bg-white">
        {/* ===== Header (Tabs + Create Button) ===== */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-5">
          {/* Tabs */}
          <div className="flex-1">
            <Tabs
              value={selectedTab}
              onChange={(_, newValue) => setSelectedTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                '& .MuiTabs-indicator': { backgroundColor: '#448AFF' },
              }}>
              <Tab
                label={
                  <div className="flex items-center gap-2">
                    <span>Invoices</span>
                    <span className="bg-blue-100 text-[#448AFF] px-2 py-0.5 rounded-md text-sm">{totalInvoices}</span>
                  </div>
                }
                className="!text-[#448AFF]"
                sx={{
                  padding: { xs: '6px 10px', sm: '6px 14px' },
                  minWidth: 'auto',
                }}
              />
            </Tabs>
          </div>

          {/* Create Button */}
          <div className="flex justify-end -mt-14  md:mt-0 lg:mt-0 w-full sm:w-auto">
            <button
              className="bg-[#448AFF] hover:bg-[#3c7ef7] text-white rounded-full font-semibold px-5 py-2.5 transition-all duration-300"
              onClick={newInvoice}>
              Create
            </button>
          </div>
        </div>

        {/* ===== Main Content ===== */}
        <div className="flex flex-col items-center justify-center py-10">{renderTabContent()}</div>
      </div>

      {/* Detail Modal */}
      {selectedInvoice && (
        <InvoiceDetailModal open={detailModalOpen} onClose={handleCloseDetail} invoice={selectedInvoice} />
      )}

      {/* Plan Limit Modal */}
      <PlanLimitModal
        isOpen={planLimitModalOpen}
        onClose={() => setPlanLimitModalOpen(false)}
        onUpgrade={handleUpgrade}
        planName={planName}
      />
    </div>
  );
};

export default ListInvoiceCreatedS;
