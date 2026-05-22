/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import imageBlur from '../../assets/logo/notificacao.svg';
import TableClients from '../tablecliets/table-client';
import FormnewClienteModal from '../formnewclient/form-new-client';
import { useGetClientsPaginatedQuery } from '../../services/rtkapi/clientApi';
import PlanLimitModal from '../modal/plan-limit-modal';

const OptionClients = () => {
  // Paginated clients
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const { data, isLoading } = useGetClientsPaginatedQuery({ from: pageIndex * pageSize, size: pageSize });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlanLimitModalOpen, setIsPlanLimitModalOpen] = useState<boolean>(false);
  const planName = 'Free';

  const handleNewClient = () => {
    setIsModalOpen(true);
  };

  function EmptyCliente() {
    return (
      <>
        <section className="flex flex-col items-center text-center h-full w-full px-4 mt-8 sm:mt-12  {/* Ajuste aqui: mt-8 para extra small, sm:mt-12 para small, md:mt-30 para medium+ */} md:px-8">
          <div className="flex items-center justify-center transform transition-transform duration-700 hover:scale-105">
            <img
              src={imageBlur}
              alt="No clients notification"
              draggable="false"
              className="pointer-events-none w-28 h-auto sm:w-32 md:w-36 lg:w-[150px]" // Responsive width
            />
          </div>
          <h2 className="text-xl md:text-2xl font-semibold mt-6 md:mt-4 animate-fade-in">No Clients Added</h2>
          <p className="text-gray-600 mt-2 text-sm md:text-base animate-fade-in delay-200">
            Add your first client to start creating <br /> invoices and managing relationships. <br />
          </p>
          <button
            onClick={handleNewClient}
            className="mt-6 bg-[#448AFF] hover:bg-[#448AFF] text-white p-3 w-full sm:w-2xs rounded-full cursor-pointer transition duration-300 font-medium">
            Add Client
          </button>
        </section>
      </>
    );
  }

  return (
    <div className="w-full md:mt-0 p-2 h-auto">
      <PlanLimitModal
        isOpen={isPlanLimitModalOpen}
        onClose={() => setIsPlanLimitModalOpen(false)}
        onUpgrade={() => {
          setIsPlanLimitModalOpen(false);
        }}
        planName={planName}
      />

      <FormnewClienteModal onClose={() => setIsModalOpen(false)} open={isModalOpen} />

      <div className="">
        <div className="">
          {data?.data?.length > 0 ? (
            <div className="">
              <TableClients
                openModalClient={handleNewClient}
                data={data?.data}
                isLoading={isLoading}
                total={data?.pagination?.totalItems ?? 0}
                pageIndex={pageIndex}
                pageSize={pageSize}
                setPageIndex={setPageIndex}
                setPageSize={setPageSize}
              />
            </div>
          ) : (
            <EmptyCliente />
          )}
        </div>
      </div>
    </div>
  );
};

export default OptionClients;
