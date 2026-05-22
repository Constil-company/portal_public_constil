import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAllAiEstimateQuery } from '../../services/rtkapi/invoiceApi';
import { SkeletonLoader } from '../../components/common/skeleton-loader';
import { useDispatch } from 'react-redux';
import { setEstimateTables } from '../../redux/estimateSlice';
import { FileText, Plus, Search, X, ExternalLink, Check } from 'lucide-react';
import { S3UploadService } from '../../components/data/s3-data';
import { toast } from 'react-toastify';

const AiEstimateList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data, isLoading, refetch } = useAllAiEstimateQuery();
  const [selectedEst, setSelectedEst] = useState<any | null>(null);
  
  // ✅ Smart Polling: Only poll if there's a job in 'pending' or 'processing' status
  const aiEstimates = data || [];
  const hasActiveJobs = aiEstimates.some((est: any) => {
    const jobStatus = est.pdf_jobs?.[0]?.status;
    return est.status === 'pending' || jobStatus === 'pending' || jobStatus === 'processing';
  });

  useEffect(() => {
    if (!hasActiveJobs) return;

    const interval = setInterval(() => {
      console.log("[AI List] Polling for updates...");
      refetch();
    }, 5000);

    return () => clearInterval(interval);
  }, [hasActiveJobs, refetch]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleOpenModal = (estimate: any) => {
    const jobStatus = estimate.pdf_jobs?.[0]?.status;
    const isDone = estimate.status === 'completed' || jobStatus === 'done';
    
    if (!isDone) {
      const status = jobStatus || estimate.status || 'pending';
      toast.info(`AI is still working on this project (Status: ${status}). Please wait...`);
      return;
    }
    setSelectedEst(estimate);
  };

  const handleViewDetails = () => {
    if (!selectedEst) return;
    dispatch(setEstimateTables(selectedEst));
    navigate('/estimates/ai/file');
    setSelectedEst(null);
  };

  const handleOpenInputPdf = () => {
    if (!selectedEst?.input_pdf_url) return;
    const url = S3UploadService.getPublicUrl(selectedEst.input_pdf_url);
    window.open(url, '_blank');
  };

  return (
    <div className="flex w-full md:min-h-[83vh] md:px-2 md:py-2 bg-[#fcfcfc]">
      <div className="w-full rounded-2xl shadow-sm border border-gray-100 overflow-x-hidden p-3 sm:p-4 md:p-6 bg-white">
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-8">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Estimates</h1>
              <p className="text-sm text-gray-500 mt-1">Manage and view your AI-analyzed projects</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/estimates/ai/steps')}
            className="bg-[#448AFF] hover:bg-[#3d7ef7] text-white rounded-full font-semibold px-6 py-2.5 flex items-center gap-2 transition-all shadow-lg active:scale-95"
          >
            <Plus size={18} />
            New AI Project
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonLoader key={i} lines={4} />
            ))}
          </div>
        ) : aiEstimates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiEstimates.map((est: any) => {
              const jobStatus = est.pdf_jobs?.[0]?.status;
              const isDone = est.status === 'completed' || jobStatus === 'done';
              const isPending = !isDone && (est.status === 'pending' || jobStatus === 'pending' || jobStatus === 'processing');

              return (
                <div
                  key={est.id}
                  onClick={() => handleOpenModal(est)}
                  className={`group border rounded-2xl p-5 bg-white transition-all cursor-pointer relative overflow-hidden ${
                    isPending 
                      ? 'opacity-80 border-blue-200 bg-blue-50/20 cursor-wait' 
                      : 'border-gray-100 hover:border-blue-200 hover:shadow-xl'
                  }`}
                >
                  <div className={`absolute top-0 left-0 w-1 h-full bg-blue-500 transition-opacity ${
                    isPending ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`} />
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-2.5 rounded-xl ${isPending ? 'bg-blue-600 text-white animate-pulse' : 'bg-blue-50 text-blue-600'}`}>
                      <FileText size={24} />
                    </div>
                    {(() => {
                      const displayStatus = jobStatus || est.status || 'pending';
                      const isFail = est.status === 'failed' || jobStatus === 'fail';

                      if (isDone) {
                        return (
                          <span className="text-[10px] uppercase font-bold px-2 py-1 rounded-md bg-green-100 text-green-700 flex items-center gap-1">
                            <Check size={12} /> COMPLETED
                          </span>
                        );
                      }

                      if (isFail) {
                        return (
                           <span className="text-[10px] uppercase font-bold px-2 py-1 rounded-md bg-red-100 text-red-700 flex items-center gap-1">
                            <X size={12} /> FAILED
                          </span>
                        );
                      }

                      return (
                        <span className="text-[10px] uppercase font-bold px-2 py-1 rounded-md bg-blue-100 text-blue-700 animate-pulse flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-ping" />
                          {displayStatus}
                        </span>
                      );
                    })()}
                  </div>
                  
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                    {est.name || 'Untitled Project'}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                    {isPending ? 'AI is processing your document...' : (est.description || 'No description available')}
                  </p>
                
                <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-50">
                  <span className="text-[11px] text-gray-400">
                    {new Date(est.created_at).toLocaleDateString()}
                  </span>
                  <span className={`text-blue-600 text-xs font-semibold transition-opacity ${
                    isPending ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
                  }`}>
                    View Details →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Search className="text-gray-300" size={32} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">No AI projects found</h2>
            <p className="text-gray-500 mt-2 max-w-xs">
              We couldn't find any AI estimates. Try creating a new one to get started!
            </p>
          </div>
        )}
      </div>

      {/* VIEW PDF MODAL */}
      {selectedEst && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">View PDFs</h2>
              <button onClick={() => setSelectedEst(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <button 
                onClick={handleViewDetails}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-blue-200 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors uppercase text-sm tracking-wide"
              >
                View Details
              </button>

              <button 
                onClick={handleOpenInputPdf}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-blue-200 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors uppercase text-sm tracking-wide"
              >
                Input PDF
              </button>

              <div className="pt-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Output PDFs</p>
                <div className="border border-gray-100 rounded-xl p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <FileText size={18} />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Estimate File</span>
                  </div>
                  <button 
                    onClick={handleViewDetails}
                    className="text-blue-600 text-sm font-bold hover:underline flex items-center gap-1"
                  >
                    Open <ExternalLink size={12} />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <button 
                onClick={() => setSelectedEst(null)}
                className="w-full py-3 bg-[#448AFF] hover:bg-[#3d7ef7] text-white font-bold rounded-xl transition-all shadow-lg active:scale-95 uppercase text-sm tracking-wide"
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

export default AiEstimateList;

