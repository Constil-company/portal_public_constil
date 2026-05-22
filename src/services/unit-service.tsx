import { UnitsApi, UnitsApiGetAllUnitsRequest, GetAllUnitsPaginatedResponse } from '../api/unit';
import apiInstance from './configs/api-config';
import { toast } from 'react-toastify';

const api = new UnitsApi(undefined, undefined, apiInstance);

export const getUnits = async (
  request: UnitsApiGetAllUnitsRequest
): Promise<GetAllUnitsPaginatedResponse> => {
  try {
    const response = await api.getAllUnits(request);
    return response.data;
  } catch (error: any) {
    console.error('Erro ao buscar unidades:', error.response?.data || error.message);
    if (error.response?.status === 403) {
      toast.error('Acesso negado ao buscar unidades. Verifique suas permissões.');
    } else {
      toast.error('Falha ao buscar unidades. Tente novamente.');
    }
    // Fallback para evitar quebra da UI
    return { data: [{ id: 'UNIT', name: 'Unit' }] } as GetAllUnitsPaginatedResponse;
  }
};