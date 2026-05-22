import { GetAllTemplatePaginatedResponse, TemplatesApi, TemplatesApiGetTemplatesRequest } from './../api/documents';
import apiInstance from './configs/api-config';

const api = new TemplatesApi(undefined, undefined, apiInstance);

export const getAllTemplates = async (
  request: TemplatesApiGetTemplatesRequest
): Promise<GetAllTemplatePaginatedResponse> => {
  try {
    const response = (await api.getTemplates(request)).data;
    return response;
  } catch (error) {
    console.error(error);
    throw new Error();
  }
};
