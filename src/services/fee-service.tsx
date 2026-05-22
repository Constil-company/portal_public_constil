import {
  CreateFeeRequest,
  FeesApi,
  FeesApiGetAllFeesRequest,
  GetAllFeesPaginatedResponse,
} from "../api/fees";
import apiInstance from "./configs/api-config";

const api = new FeesApi(undefined, undefined, apiInstance);

// Tipo para garantir a estrutura correta
type FeeData = {
  
  name: string;
  rate: number;
  type: 'TAX' | 'DISCOUNT';
};

export const createFee = async (data: FeeData) => {
  try {
    const request: CreateFeeRequest = {
      
      name: data.name,
      rate: data.rate,
      type: data.type,
    };

    const response = await api.createFee({ createFeeRequest: request });
    return response.data;
  } catch (error) {
    console.error("Error creating fee:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to create fee");
  }
};

export const getFees = async (
  request: FeesApiGetAllFeesRequest
): Promise<GetAllFeesPaginatedResponse> => {
  try {
    const response = await api.getAllFees(request);
    return response.data;
  } catch (error) {
    console.error("Error fetching fees:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to get fees");
  }
};