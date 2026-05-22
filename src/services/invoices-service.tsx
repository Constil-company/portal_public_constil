import { AxiosResponse } from 'axios';
import {
  GeneratedInvoiceResponse,
  GenerateInvoiceRequest,
  GetAllInvoicesDirectionEnum,
  GetAllInvoicesKindEnum,
  GetAllInvoicesOrderByEnum,
  GetAllInvoicesPaginatedResponse,
  GetAllInvoicesStatusEnum,
  InvoiceApi,
  InvoiceApiDeleteInvoiceRequest,
  InvoiceApiGenerateInvoiceReferenceRequest,
  InvoiceApiGetAllInvoicesRequest,
  InvoiceApiSendInvoiceByEmailRequest,
  SendInvoiceByEmail200Response,
  SendInvoiceEmailRequest,
} from '../api/invoices';
import apiInstance from './configs/api-config';
import { useGetInvoicesQuery } from './rtkapi/invoiceApi';

const api = new InvoiceApi(undefined, undefined, apiInstance);

export const getInvoices = async (): Promise<GetAllInvoicesPaginatedResponse> => {
  try {
   const { data } = useGetInvoicesQuery();

    return data;
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao buscar faturas');
  }
};

export const getEstimatives = async (from: number, size: number): Promise<GetAllInvoicesPaginatedResponse> => {
  try {
    const request: InvoiceApiGetAllInvoicesRequest = {
      from: from,
      size: size,
      orderBy: GetAllInvoicesOrderByEnum.Views,
      direction: GetAllInvoicesDirectionEnum.Desc,
      kind: GetAllInvoicesKindEnum.E,
      status: GetAllInvoicesStatusEnum.Active,
    };

    const response = await api.getAllInvoices(request);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao buscar estimativas');
  }
};

export const getInvoiceReference = async (data?: InvoiceApiGenerateInvoiceReferenceRequest): Promise<string> => {
  try {
    const response = await api.generateInvoiceReference(data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao gerar referência de fatura');
  }
};

export const createInvoice = async (data: GenerateInvoiceRequest): Promise<AxiosResponse<GeneratedInvoiceResponse>> => {
  const requestData = {
    generateInvoiceRequest: data,
  };
  try {
    const response = await api.generateInvoice(requestData);
    return response;
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao criar fatura');
  }
};

export const downloadInvoice = async (invoiceId: string) => {
  try {
    const response = await api.downloadInvoice({ invoiceId });
    return response;
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao baixar fatura');
  }
};

export const deleteInvoice = async (request: InvoiceApiDeleteInvoiceRequest) => {
  try {
    const response = await api.deleteInvoice(request);
    return response;
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao excluir fatura');
  }
};

export const sendInvoiceByEmail = async (data: SendInvoiceEmailRequest): Promise<AxiosResponse<SendInvoiceByEmail200Response>> => {
  try {
    const request: InvoiceApiSendInvoiceByEmailRequest = {
      sendInvoiceEmailRequest: data,
    };

    const response = await api.sendInvoiceByEmail(request);
    return response;
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao enviar a fatura por e-mail');
  }
};