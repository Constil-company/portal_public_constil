/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useState, useCallback } from 'react';
import { GetAllInvoicesPaginatedResponse, InvoiceApiDeleteInvoiceRequest } from '../api/invoices';
import { InvoiceModel } from '../models/invoice';
import { deleteInvoice, getEstimatives, getInvoices } from '../services/invoices-service';
import { toast } from 'react-toastify';

interface ContextData {
  invoiceDelete: (request: InvoiceApiDeleteInvoiceRequest) => Promise<void>;
  invoices: InvoiceModel[];
  setInvoices: (data: InvoiceModel[]) => void;
  setEstimations: (data: InvoiceModel[]) => void;
  estimations: InvoiceModel[];
  getInvoice: (from: number, size: number) => Promise<void>;
  getEstimative: (from: number, size: number) => Promise<void>;
  totalInvoices: number;
  totalEstimations: number;
  totalPages: number; // Para invoices
  totalPagesEstimations: number; // Para estimativas
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

interface Props {
  children: ReactNode;
}

export const invoiceContext = createContext({} as ContextData);

export function InvoiceContextProvider({ children }: Props) {
  const [invoices, setInvoices] = useState<InvoiceModel[]>([]);
  const [estimations, setEstimations] = useState<InvoiceModel[]>([]);
  const [totalInvoices, setTotalInvoices] = useState<number>(0);
  const [totalEstimations, setTotalEstimations] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0); // Para invoices
  const [totalPagesEstimations, setTotalPagesEstimations] = useState<number>(0); // Para estimativas
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getInvoice = useCallback(async (from: number, size: number): Promise<void> => {
    try {
      setIsLoading(true);
      const response: GetAllInvoicesPaginatedResponse = await getInvoices();
      console.log('QUI API Response (Invoices):', response, 'from:', from, 'size:', size);
      const data = response.data ?? [];
      const totalItems = response.pagination?.totalItems ?? 0;
      const pages = response.pagination?.totalPages ?? 0;
      console.log('Processed data (Invoices):', data.length, 'totalItems:', totalItems, 'totalPages:', pages);
      setInvoices(InvoiceModel.fromListResponse(data));
      setTotalInvoices(totalItems);
      setTotalPages(pages);
    } catch (err) {
      console.error('Erro ao buscar invoices:', err);
      setInvoices([]);
      setTotalInvoices(0);
      setTotalPages(0);
      toast.error('Erro ao carregar invoices');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getEstimative = useCallback(async (from: number, size: number): Promise<void> => {
    try {
      setIsLoading(true);
      const response: GetAllInvoicesPaginatedResponse = await getEstimatives(from, size);
      console.log('API Response (Estimatives):', response, 'from:', from, 'size:', size, 'data length:', response.data?.length);
      const data = response.data ?? [];
      const totalItems = response.pagination?.totalItems ?? 0;
      const pages = response.pagination?.totalPages ?? 0;
      console.log('Processed data (Estimatives):', data.length, 'totalItems:', totalItems, 'totalPages:', pages);
      setEstimations(InvoiceModel.fromListResponse(data));
      setTotalEstimations(totalItems);
      setTotalPagesEstimations(pages);
    } catch (err) {
      console.error('Erro ao buscar estimativas:', err);
      setEstimations([]);
      setTotalEstimations(0);
      setTotalPagesEstimations(0);
      toast.error('Erro ao carregar estimativas');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const invoiceDelete = useCallback(async (request: InvoiceApiDeleteInvoiceRequest): Promise<void> => {
    try {
      await deleteInvoice(request);
      toast.success('Item deletado com sucesso');
      await getInvoice(0, 9);
    } catch (err) {
      console.error('Erro ao deletar invoice:', err);
      toast.error('Não foi possível deletar o item');
    }
  }, [getInvoice]);

  return (
    <invoiceContext.Provider
      value={{
        invoices,
        estimations,
        totalInvoices,
        totalEstimations,
        totalPages,
        totalPagesEstimations,
        getEstimative,
        getInvoice,
        isLoading,
        setIsLoading,
        invoiceDelete,
        setInvoices,
        setEstimations,
      }}
    >
      {children}
    </invoiceContext.Provider>
  );
}