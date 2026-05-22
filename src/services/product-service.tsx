import {
    GetAllProductsPaginatedResponse,
      DefaultApi,
    DefaultApiGetAllProductsRequest,
    DefaultApiUpdateProductPartiallyRequest,
} from "../api/products";
import { ProductModel } from "../models/produt";
import apiInstance from "./configs/api-config";

const api = new DefaultApi(undefined, undefined, apiInstance);

export const getAllProduct = async (
  data?: DefaultApiGetAllProductsRequest
): Promise<GetAllProductsPaginatedResponse> => {
  try {
    const response = await api.getAllProducts(data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error();
  }
};

export const createProduct = async (
  data: ProductModel
): Promise<any> => {
  const { name, price, observation = "" } = data;

  const payload = {
    name,
    unit_price: price,
    description: observation,
  };
  try {
    const response = await apiInstance.post('/rest/v1/products', payload, {
        headers: { 'Prefer': 'return=representation' }
    });
    return response.data?.[0] || response.data;
  } catch (error) {
    console.error(error);
    throw new Error();
  }
};


export const updateProduct = async (data:DefaultApiUpdateProductPartiallyRequest)=>{
  try {
    const response = await api.updateProductPartially(data);
    return response.data;
  } catch (error) {
    console.error(error);
    
    throw new Error();
  }
}





export const deleteProduct = async (id: string) => {
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
    
    const response = await apiInstance.delete(`/rest/v1/products?id=eq.${id}&user_id=eq.${userId}`);
    return response;
  } catch (error) {
    console.error("Delete product error:", error);
    throw new Error();
  }
};



