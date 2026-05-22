/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useState, useCallback } from 'react';
import { ClientsApiGetClientsRequest } from '../api/client';
import { TemplatesApiGetTemplatesRequest } from '../api/documents/api';
import { DefaultApiGetAllProductsRequest } from '../api/products/api';
import { UnitsApiGetAllUnitsRequest } from '../api/unit/api';
import { ClientModel } from '../models/client';
import { ProductModel } from '../models/produt';
import { UnitModel } from '../models/unit';
import { getAllClient } from '../services/client-service';
import { deleteProduct, getAllProduct } from '../services/product-service';
import { getUnits } from '../services/unit-service';
import { FeesApiGetAllFeesRequest } from '../api/fees';
import { FeesModel } from '../models/fees';
import { getFees } from '../services/fee-service';
import { getAllTemplates } from '../services/document-service';
import { TemplateModel } from '../models/template';
import { InvoiceApiGenerateInvoiceReferenceRequest } from '../api/invoices';
import { getInvoiceReference } from '../services/invoices-service';
import {deleteClient } from '../services/client-service';
import { toast } from 'react-toastify';

interface ContextData {
  isLoadingCustomer: boolean;
  setIsLoadingCustomer: (data: boolean) => void;
  removeProduct :(id:string)=>void
  isLoading: boolean;
  setIsLoading: (data: boolean) => void;
  isLoadingProduct: boolean;
  setIsLoadingProduct: (data: boolean) => void;
  isLoadingReference: boolean;
  setIsLoadingReference: (data: boolean) => void;
  isLoadingTemplate: boolean;
  setIsLoadingTemplate: (data: boolean) => void;
  removeClient: (id: string) => void;
  customers: ClientModel[];
  setCustomers: (data: ClientModel[]) => void; 
  products: ProductModel[];
  getProducts: (data: DefaultApiGetAllProductsRequest) => Promise<ProductModel[]>;
  setProducts: (data: ProductModel[]) => void;
  getCustomers: (data: ClientsApiGetClientsRequest) => Promise<ClientModel[]>;
  getAllUnit: (data: UnitsApiGetAllUnitsRequest) => Promise<UnitModel[]>;
  unit: UnitModel[];
  setUnit: (data: UnitModel[]) => void;
  getAllfeesDISCOUNT: (data: FeesApiGetAllFeesRequest) => Promise<FeesModel[]>;
  feesDISCOUNT: FeesModel[];
  setFeesDISCOUNT: (data: FeesModel[]) => void;
  getAllfeesTAX: (data: FeesApiGetAllFeesRequest) => Promise<FeesModel[]>;
  feesTAX: FeesModel[];
  setFeesTAX: (data: FeesModel[]) => void;
  invoicesTemplate: TemplateModel[];
  setInvoicesTemplates: (data: TemplateModel[]) => void;
  getInvoiceTemplate: (data: TemplatesApiGetTemplatesRequest) => Promise<TemplateModel[]>;
  totalItems: number;
  generatedInvoiceReference: string;
  getGeneratedInvoiceReference: (data?: InvoiceApiGenerateInvoiceReferenceRequest) => Promise<string>;
}

interface Props {
  children: ReactNode;
}

export const globalContext = createContext({} as ContextData);

export function GlobalContextProvider({ children }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [customers, setCustomers] = useState<ClientModel[]>([]);
  const [isLoadingCustomer, setIsLoadingCustomer] = useState<boolean>(false);
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [isLoadingProduct, setIsLoadingProduct] = useState<boolean>(false);
  const [unit, setUnit] = useState<UnitModel[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [feesTAX, setFeesTAX] = useState<FeesModel[]>([]);
  const [feesDISCOUNT, setFeesDISCOUNT] = useState<FeesModel[]>([]);
  const [invoicesTemplate, setInvoicesTemplates] = useState<TemplateModel[]>([]);
  const [generatedInvoiceReference, setGeneratedInvoiceReference] = useState<string>('');
  const [isLoadingReference, setIsLoadingReference] = useState<boolean>(false);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState<boolean>(false);

  const getCustomers = useCallback(async (data: ClientsApiGetClientsRequest) => {
    setIsLoading(true);
    setIsLoadingCustomer(true);
    try {
      const res = await getAllClient(data);
      const clientList = ClientModel.fromListResponse(res.data ?? []);
      setCustomers(clientList);
      setTotalItems(res.pagination?.totalItems ?? 0);
      return clientList;
    } catch (err) {
      console.error('Error fetching customers:', err);
      throw err;
    } finally {
      setIsLoading(false);
      setIsLoadingCustomer(false);
    }
  }, []);

  const getProducts = useCallback(async (data: DefaultApiGetAllProductsRequest) => {
    setIsLoadingProduct(true);
    try {
      const response = await getAllProduct(data);
      const productList = ProductModel.fromListResponse(response.data ?? []);
      setProducts(productList);
      setTotalItems(response?.pagination?.totalItems ?? 0);
      return productList;
    } catch (err) {
      console.error('Error fetching products:', err);
      throw err;
    } finally {
      setIsLoadingProduct(false);
    }
  }, []);

  const getAllUnit = useCallback(async (data: UnitsApiGetAllUnitsRequest) => {
    setIsLoading(true);
    try {
      const response = await getUnits(data);
      const unitList = UnitModel.fromListResponse(response.data ?? []);
      setUnit(unitList);
      return unitList;
    } catch (err) {
      console.error('Error fetching units:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAllfeesDISCOUNT = useCallback(async (data: FeesApiGetAllFeesRequest) => {
    setIsLoading(true);
    try {
      const response = await getFees(data);
      const feesList = FeesModel.fromListResponse(response.data ?? []);
      setFeesDISCOUNT(feesList);
      return feesList;
    } catch (err) {
      console.error('Error fetching discount fees:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAllfeesTAX = useCallback(async (data: FeesApiGetAllFeesRequest) => {
    setIsLoading(true);
    try {
      const response = await getFees(data);
      const feesList = FeesModel.fromListResponse(response.data ?? []);
      setFeesTAX(feesList);
      return feesList;
    } catch (err) {
      console.error('Error fetching tax fees:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getInvoiceTemplate = useCallback(async (data: TemplatesApiGetTemplatesRequest) => {
    setIsLoadingTemplate(true);
    try {
      const response = await getAllTemplates(data);
      const templateList = TemplateModel.fromListResponse(response.data ?? []);
      setInvoicesTemplates(templateList);
      return templateList;
    } catch (err) {
      console.error('Error fetching templates:', err);
      throw err;
    } finally {
      setIsLoadingTemplate(false);
    }
  }, []);

  const getGeneratedInvoiceReference = useCallback(async (data?: InvoiceApiGenerateInvoiceReferenceRequest) => {
    setIsLoadingReference(true);
    try {
      const response = await getInvoiceReference(data);
      setGeneratedInvoiceReference(response);
      return response;
    } catch (err) {
      console.error('Error generating invoice reference:', err);
      throw err;
    } finally {
      setIsLoadingReference(false);
    }
  }, []);


  const removeProduct = useCallback(async(id:string)=>{
    if(!id){
      toast.error('Unable to remove product, please try again later');
      return;
    }

    await  deleteProduct(id)
    .then((response)=>{
      if(response.status === 200){
        toast.success('Product deleted successfully');
       // getProducts({ from: 0, size: 10 });
        setProducts((prev) => prev.filter((product) => product.id !== id));
      }
     
    }).catch((err)=>{
      console.error(err)
      toast.error('Unable to remove product, please try again later');
    })
  },[])

   const removeClient = useCallback(async (id: string) => {
    if (!id) return;
    await deleteClient(id)
    .then((response:any)=>{
      if (response.status === 200 || response.status === 204) {
        setCustomers((prev) => prev.filter((client) => client.id !== id));
        getCustomers({ from: 0, size: 10 });
        toast.success('Client deleted successfully');
      } else {
        toast.error('Unable to remove client, please try again later');
      }
    }).catch((err: any)=>{
      console.error("Remove client error:", err);
      const errorMessage = err?.response?.data?.message || err?.response?.data?.detail || "";
      if (errorMessage.includes("violates foreign key constraint")) {
        toast.error("Cannot delete client because they have associated invoices or estimates.");
      } else {
        toast.error('Unable to remove client, please try again later');
      }
    })
    
  },[])
  return (
    <globalContext.Provider
      value={{
        products,
        setProducts,
        customers,
        setCustomers,
        totalItems,
        isLoading,
        setIsLoading,
        isLoadingProduct,
        setIsLoadingProduct,
        isLoadingCustomer,
        setIsLoadingCustomer,
        isLoadingReference,
        setIsLoadingReference,
        isLoadingTemplate,
        setIsLoadingTemplate,
        feesTAX,
        feesDISCOUNT,
        setFeesTAX,
        setFeesDISCOUNT,
        unit,
        setUnit,
        invoicesTemplate,
        setInvoicesTemplates,
        generatedInvoiceReference,
        getCustomers,
        removeProduct,
        getProducts,
        getAllUnit,
        getAllfeesTAX,
        getAllfeesDISCOUNT,
        getInvoiceTemplate,
        getGeneratedInvoiceReference,
        removeClient
      }}
    >
      {children}
    </globalContext.Provider>
  );
}