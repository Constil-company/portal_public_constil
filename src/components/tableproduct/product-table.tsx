/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Edit } from 'lucide-react';
import React from 'react';
import { MaterialReactTable as MRT, type MRT_ColumnDef } from 'material-react-table';
import { SkeletonLoader } from '../common/skeleton-loader';
import { showConfirmToast } from '../messagealert/confirm-toast';
import { toast } from 'react-toastify';
import { ProductModel } from '../../models/produt';
import { useDeleteProductMutation } from '../../services/rtkapi/productApi';
import FormEditProductModal from '../formnewproduct/edit-proct-form';

const MaterialReactTable = MRT as unknown as React.ComponentType<any>;

const ProductTable = ({
  openModalProduct,
  data,
  isLoading,
  total = 0,
  pageIndex = 0,
  pageSize = 10,
  setPageIndex,
  setPageSize,
}: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productData, setProductData] = useState<ProductModel | null>(null);
  // @ts-ignore
  const [deleteProduct] = useDeleteProductMutation();

  const formatPrice = useCallback((value: number | string): string => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return 'N/A';
    return `${num.toFixed(2)} USD`;
  }, []);

  const openEditModal = (row: ProductModel) => {
    setProductData(row);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!id) return;
    showConfirmToast({
      message: "You won't be able to revert this!",
      onConfirm: async () => {
        try {
          const res = await deleteProduct({ id }).unwrap();
          toast.success(res?.message);
        } catch (err: any) {
          toast.error(err?.data?.message);
        }
      },
    });
  };

  const columns: MRT_ColumnDef<ProductModel>[] = [
    { header: 'Ref', accessorKey: 'ref' },
    { header: 'Product / Service', accessorKey: 'name' },
    {
      header: 'Price',
      accessorKey: 'unit_price',
      Cell: ({ cell }) => formatPrice(cell.getValue<number>()),
    },
    { header: 'Description', accessorKey: 'description' },
  ];

  return (
    <>
      <FormEditProductModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productData={productData}
      />

      <div className="bg-white rounded-lg p-2 sm:p-4">
        <div className="flex flex-col gap-y-3 sm:flex-row sm:items-center sm:justify-between w-full pb-3 sm:pb-4">
          <h2 className="text-base sm:text-lg font-semibold uppercase text-gray-800">
            Product List
          </h2>

          <button
            onClick={openModalProduct}
            disabled={isLoading}
            className="bg-[#12153A] hover:bg-[#1A1E50] text-white font-medium whitespace-nowrap cursor-pointer transition duration-300 rounded-md text-xs px-6 py-2 sm:text-sm">
            {data?.length === 0 ? 'Add Product' : 'New Product'}
          </button>
        </div>

        {isLoading ? (
          <SkeletonLoader lines={4} />
        ) : (
          <MaterialReactTable
            columns={columns}
            data={data ?? []}
            muiTablePaperProps={{
              elevation: 0,
              sx: { boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)' },
            }}
            enableRowActions   
            positionActionsColumn="last"
            enableStickyHeader={false}
            enableColumnActions={false}
            enableSorting={false}
            manualPagination
            rowCount={total}
            state={{ pagination: { pageIndex, pageSize } as any }}
            onPaginationChange={(updater: any) => {
              const next =
                typeof updater === 'function'
                  ? updater({ pageIndex, pageSize })
                  : updater;
              setPageIndex(next.pageIndex ?? 0);
              setPageSize(next.pageSize ?? pageSize);
            }}
            muiTablePaginationProps={{
              rowsPerPageOptions: [5, 10, 20, 50],
            }}
            renderRowActions={({ row }: any) => (
              <div className="flex items-center gap-1">
                <IconButton
                  size="small"
                  color="success"
                  onClick={() => openEditModal(row.original)}>
                  <Edit size={16} />
                </IconButton>
                 <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDelete(row.original.id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </div>
            )}
          />
        )}
      </div>
    </>
  );
};

export default ProductTable;
