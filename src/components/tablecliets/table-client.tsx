/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import React from 'react';
import { Edit } from 'lucide-react';
import { MaterialReactTable as MaterialReactTableRaw, type MRT_ColumnDef } from 'material-react-table';
import FormEditClientModal from '../formnewclient/form-edit-client';
const MaterialReactTable = MaterialReactTableRaw as unknown as React.ComponentType<any>;
import { SkeletonLoader } from '../common/skeleton-loader';
import { showConfirmToast } from '../messagealert/confirm-toast';
import { ClientModel } from '../../models/client';
import { useDeleteClientMutation } from '../../services/rtkapi/clientApi';
import { toast } from 'react-toastify';

const TableClients = ({ openModalClient, data, isLoading, total = 0, pageIndex = 0, pageSize = 10, setPageIndex, setPageSize }: any) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [clientData, setClientData] = useState<ClientModel | null>(null);
  // @ts-ignore
  const [deleteClient] = useDeleteClientMutation();

  const openModalEditClient = (data: ClientModel) => {
    setClientData(data);
    setIsModalOpen(true);
  };

  const handleDeleteClient = (id: string) => {
    if (!id) return;
    showConfirmToast({
      message: "You won't be able to revert this!",
      onConfirm: async () => {
        try {
          const response = await deleteClient({ id }).unwrap();
          toast.success(response?.message || 'Client removed successfully');
        } catch (err: any) {
          console.error("Delete client error:", err);
          const errorMessage = err?.data?.message || err?.data?.detail || "";
          
          if (errorMessage.includes("column \"is_deleted\" does not exist")) {
            toast.error("Database update required! Please run the SQL command in Supabase to enable client archiving.", {
              autoClose: 10000
            });
            console.warn("Please run: ALTER TABLE clients ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;");
          } else if (errorMessage.includes("violates foreign key constraint")) {
            toast.error("Cannot delete client because they have associated invoices or estimates. Use 'Archive' instead.");
          } else {
            toast.error(errorMessage || 'Failed to remove client');
          }
        }
      },
    });
  };

  const columns: MRT_ColumnDef<any>[] = [
    { header: 'Client Name', accessorKey: 'name' },
    { header: 'Address', accessorKey: 'address' },
    { header: 'E-mail', accessorKey: 'email' },
    { header: 'Phone', accessorKey: 'phone' },
    { header: 'Observation', accessorKey: 'observation' },
  ];

  return (
    <>
      <FormEditClientModal clientData={clientData} onClose={() => setIsModalOpen(false)} open={isModalOpen} />

      <div className="bg-white rounded-lg p-2 sm:p-4">
        <div className="flex flex-col gap-y-3 sm:flex-row sm:items-center sm:justify-between w-full pb-3 sm:pb-4">
          <h2 className="text-base sm:text-lg font-semibold uppercase text-gray-800">Client list</h2>
          <div className="flex items-center flex-wrap gap-x-1.5 gap-y-2 sm:gap-x-2">
            <button
              onClick={openModalClient}
              disabled={isLoading}
              className="bg-[#12153A] hover:bg-[#1A1E50] text-white font-medium whitespace-nowrap cursor-pointer transition duration-300 rounded-md text-xs px-6 py-2 sm:text-sm  ">
              {data?.length === 0 ? 'Add Client' : 'New Client'}
            </button>
          </div>
        </div>

        {isLoading ? (
          // @ts-ignore
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
              const next = typeof updater === 'function' ? updater({ pageIndex, pageSize }) : updater;
              setPageIndex(next.pageIndex ?? 0);
              setPageSize(next.pageSize ?? pageSize);
            }}
            muiTablePaginationProps={{ rowsPerPageOptions: [5, 10, 20, 50] }}
            renderRowActions={({ row }: { row: any }) => (
              <div className="flex items-center gap-1">
                <IconButton size="small" color='success' onClick={() => openModalEditClient(row.original)} sx={{ p: { xs: 0.5, sm: 0.75 } }}>
                  <Edit size={16} />
                </IconButton>
                 <IconButton size="small" color="error" onClick={() => handleDeleteClient(row.original.id!)} sx={{ p: { xs: 0.75, sm: 0.75 } }}>
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

export default TableClients;