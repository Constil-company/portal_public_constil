import {
  FiPlus,
  FiFileText,
  FiX,
  FiExternalLink,
} from 'react-icons/fi';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, CardContent } from '@mui/material';
import { useState } from 'react';
import {
  useAllAiEstimateQuery,
  useGetEstimateFilterQuery,
  useGetEstimateSearchQuery,
} from '../../services/rtkapi/invoiceApi';
import { useNavigate } from 'react-router-dom';
import { setEstimateTables } from '../../redux/estimateSlice';
import { useDispatch } from 'react-redux';
import { S3UploadService } from '../../components/data/s3-data';

interface AiEstimate {
  id: string;
  name: string;
  address: string;
  description: string;
  input_pdf_url: string;
  output_pdf_url: string;
  trade:string;
}

const Reports = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedEstimate, setSelectedEstimate] = useState<AiEstimate | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const itemsPerPage = 10;
  const currentPage = 1;

  const { data: allData, isLoading: allLoading } = useAllAiEstimateQuery(undefined, {
    skip: !!search || (!!startDate && !!endDate),
  });

  const { data: searchData, isLoading: searchLoading } = useGetEstimateSearchQuery({ name: search }, { skip: !search });
  const { data: dateData, isLoading: dateLoading } = useGetEstimateFilterQuery(
    { start_date: startDate, end_date: endDate },
    { skip: !(startDate && endDate) }
  );

  const handleOpenModal = (estimate: AiEstimate) => {
    setSelectedEstimate(estimate);
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedEstimate(null);
  };

  const navigateToDetails = () => {
    if (!selectedEstimate) return;
    dispatch(setEstimateTables(selectedEstimate as any));
    navigate('/estimates/ai/file');
    handleCloseModal();
  };

  const handleOpenInputPdf = () => {
    if (!selectedEstimate?.input_pdf_url) return;
    const url = S3UploadService.getPublicUrl(selectedEstimate.input_pdf_url);
    window.open(url, '_blank');
  };

  const finalData = search ? searchData?.data : startDate && endDate ? dateData?.data : allData?.data;
  const loading = allLoading || searchLoading || dateLoading;

  const paginatedData = finalData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6 md:mt-0 p-2 h-auto">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">Welcome back! Here's an overview of your projects.</div>
        <button
          onClick={() => navigate('/estimates/ai/steps')}
          className="flex items-center cursor-pointer gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md font-semibold text-sm">
          <FiPlus />
          <span>New Project</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100 flex flex-col md:flex-row gap-4 md:items-center">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search by project name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
          />
        </div>

        <div className="flex gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1">Start Date</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1">End Date</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
           <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : paginatedData?.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
           <p className="text-gray-400">No project matches your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedData?.map((estimate: AiEstimate) => (
            <div
              key={estimate.id}
              onClick={() => handleOpenModal(estimate)}
              className="group bg-white rounded-3xl border border-gray-100 shadow-sm p-6 cursor-pointer hover:border-blue-300 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 opacity-0 group-hover:opacity-100 rounded-full -mr-12 -mt-12 transition-all duration-500" />
              
              <CardContent className="p-0 relative z-10">
                <Box className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <FiFileText size={24} />
                  </div>
                  <div className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertIcon style={{ transform: 'rotate(90deg)', fontSize: 20, color: '#9CA3AF' }} />
                  </div>
                </Box>

                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors truncate">
                  {estimate.name}
                </h3>
                <p className="text-xs text-gray-400 font-medium mb-3 truncate flex items-center gap-1">
                   <span className="font-bold text-gray-500">Address:</span> {estimate.address}
                </p>
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                  {estimate.description || "No description provided for this project."}
                </p>
              </CardContent>
            </div>
          ))}
        </div>
      )}

      {/* CUSTOM SLEEK MODAL (matches screenshot) */}
      {openModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900 italic tracking-tight">View PDFs</h2>
              <button 
                onClick={handleCloseModal} 
                className="p-2 hover:bg-gray-200 rounded-full transition-colors group"
              >
                <FiX size={20} className="text-gray-400 group-hover:text-gray-600" />
              </button>
            </div>

            <div className="p-8 space-y-4">
              <button 
                onClick={navigateToDetails}
                className="w-full flex items-center justify-center gap-2 py-4 px-4 border border-blue-100 text-[#448AFF] font-bold rounded-2xl hover:bg-blue-50 transition-all uppercase text-xs tracking-widest shadow-sm hover:shadow-md"
              >
                View Details
              </button>

              <button 
                onClick={handleOpenInputPdf}
                className="w-full flex items-center justify-center gap-2 py-4 px-4 border border-blue-100 text-[#448AFF] font-bold rounded-2xl hover:bg-blue-50 transition-all uppercase text-xs tracking-widest shadow-sm hover:shadow-md"
              >
                Input PDF
              </button>

              <div className="pt-6">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-1">Output PDFs</p>
                <div 
                  onClick={navigateToDetails}
                  className="group/item border border-gray-100 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl group-hover/item:bg-blue-600 group-hover/item:text-white transition-all">
                      <FiFileText size={20} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-700">Estimate File</span>
                      <span className="text-[10px] text-gray-400">PDF Document</span>
                    </div>
                  </div>
                  <span className="text-[#448AFF] text-xs font-bold flex items-center gap-1 group-hover/item:translate-x-1 transition-transform">
                    Open <FiExternalLink size={14} />
                  </span>
                </div>
              </div>
            </div>

            <div className="p-8 pt-0">
              <button 
                onClick={handleCloseModal}
                className="w-full py-4 bg-[#1A78F2] hover:bg-blue-600 text-white font-black rounded-2xl transition-all shadow-lg shadow-blue-200 active:scale-95 uppercase text-xs tracking-[0.2em]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
