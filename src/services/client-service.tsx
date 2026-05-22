import {
  ClientResponse,
  ClientsApi,
  ClientsApiGetClientsRequest,
  ClientsApiUpdateClientRequest,
  GetAllClientsPaginatedResponse,
} from "../api/client/api";
import { ClientModel } from "../models/client";
import apiInstance from "./configs/api-config";

const api = new ClientsApi(undefined, undefined, apiInstance);

export const createClient = async (
  data: ClientModel
): Promise<ClientResponse> => {
  try {
    const request = {
      createClientRequest: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        website: data.website,
        observation: data.observation,
      },
    };

    const response = await api.createClient(request);
    return response.data;
  } catch (error) {
    console.error(error);

    throw new Error();
  }
};

export const getAllClient = async (
  data: ClientsApiGetClientsRequest
): Promise<GetAllClientsPaginatedResponse> => {
  try {
    const response = await api.getClients(data);
    return response.data;
  } catch (error) {
    console.error(error);

    throw new Error();
  }
};


export const deleteClient = async (id: string) => {
  try {
    const token = localStorage.getItem('access_token');
    let userId = "";
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        userId = payload.sub;
      } catch (e) {
        console.error("Error decoding token", e);
      }
    }
    
    // Using apiInstance directly for DELETE to include user_id filter easily
    const response = await apiInstance.delete(`/rest/v1/clients?id=eq.${id}&user_id=eq.${userId}`);
    return response;
  } catch (error) {
    console.error("Delete client error:", error);
    throw error;
  }
}


export const updateClient = async(request:ClientsApiUpdateClientRequest)=>{
  try {
    const response = await api.updateClient(request);
    return response;
  } catch (error) {
    return error;
  }
}
