/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useState } from "react";
import { ClientModel } from "../models/client";
import { GetAllClientsPaginatedResponse } from "../api/client";
import { getAllClient } from "../services/client-service";
import { toast } from "react-toastify";

// Definindo a interface dos dados do contexto
interface ClientContextData {
  clients: ClientModel[];
  setClients: (data: ClientModel[]) => void;
  getClient: (from: number, size: number) => void;
  totalClients: number;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

// Props do provedor
interface ClientContextProviderProps {
  children: ReactNode;
}

// Criando o contexto
export const clientContext = createContext<ClientContextData>({} as ClientContextData);

// Provedor do contexto
export function ClientContextProvider({ children }: ClientContextProviderProps) {
  const [clients, setClients] = useState<ClientModel[]>([]);
  const [totalClients, setTotalClients] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Função para buscar clientes paginados
  async function getClient(from: number, size: number) {
    setIsLoading(true);

    try {
      const response: GetAllClientsPaginatedResponse = await getAllClient({ from, size });
      const data = response.data ?? [];
      const totalItems = response.pagination?.totalItems ?? 0;
      setTotalClients(totalItems);
      setClients(ClientModel.fromListResponse(data));
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast.error("Unable to fetch clients.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <clientContext.Provider
      value={{
        clients,
        setClients,
        getClient,
        totalClients,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </clientContext.Provider>
  );
}