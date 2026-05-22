/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import ProductTable from '../tableproduct/product-table';
import FormnewproductModal from '../formnewproduct/new-proct-form';
import imageBlur from '../../assets/logo/notificacao.svg';
import { SkeletonLoader } from '../common/skeleton-loader';
import PlanLimitModal from '../modal/plan-limit-modal';
import { useGetProductQuery } from '../../services/rtkapi/productApi';

export function ProductList() {
  // @ts-ignore
    const [pageIndex, setPageIndex] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(10);
  const { data, isLoading } = useGetProductQuery({ from: pageIndex * pageSize, size: pageSize });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlanLimitModalOpen, setIsPlanLimitModalOpen] = useState(false);
  const planName = 'Free';

  const handleNewProduct = () => {
    setIsModalOpen(true);
  };

  function EmptyProduct() {
    return (
      <section className="flex items-center  flex-col px-4 md:px-8  h-full lg:mt-10 md:mt-20  lg:mr-20 textc">
        <div className=" transform    justify-center transition-transform duration-700 hover:scale-105">
          <img src={imageBlur} alt="" width={150} draggable="false" className="pointer-events-none" />
        </div>
        <h2 className="text-2xl font-semibold mt-4 animate-fade-in">No Products Yet</h2>
        <p className="text-gray-600 mt-2 animate-fade-in delay-200 text-center">
          Start by adding your first product to <br /> manage and sell with ease.
        </p>
        <button
          onClick={handleNewProduct}
          className="mt-4 bg-[#448AFF] hover:bg-[#448AFF] text-white p-3 w-48 rounded-full cursor-pointer transition duration-300"
          disabled={isLoading}>
          Add a Product
        </button>
      </section>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg w-full p-4">
        <SkeletonLoader lines={10} />
      </div>
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

      <FormnewproductModal onClose={() => setIsModalOpen(false)} open={isModalOpen} />

      <div className=" ">
        {(data?.data?.length ?? 0) > 0 ? (
          <ProductTable
            openModalProduct={handleNewProduct}
            data={data?.data}
            isLoading={isLoading}
            total={data?.pagination?.totalItems ?? 0}
            pageIndex={pageIndex}
            pageSize={pageSize}
            setPageIndex={setPageIndex}
            setPageSize={setPageSize}
          />
        ) : (
          <EmptyProduct />
        )}

      </div>
    </div>
  );
}

export default ProductList;
