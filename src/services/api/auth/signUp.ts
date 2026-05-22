/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserApi, UserLogoUploadResponse } from '../../../api/user';
import { userRegistrationForm } from '../../../components/validations/registration-validation';
import apiInstance, { removeRequestHeaderAuth } from '../../configs/api-config';
import { SignUpError } from '../../errors/signUp-error';

const api = new UserApi(undefined, undefined, apiInstance);

export async function createAccount(data: userRegistrationForm) {
  removeRequestHeaderAuth();

  const requestData: any = {
    phone: data.phoneNumber,
    address: data.adress,
    zip_code: data.zipCode,
    state: data.state,
    city: data.city,
    country: data.country,
  };

  const response = await apiInstance
    .post(`/user/user_auth/signup/`, requestData, {
      headers: {
        // @ts-ignore
        Authorization: `Bearer ${data?.accessToken}`,
        'Content-Type': 'application/json',
      },
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      throw new SignUpError(error.status, error.response?.data?.message);
    });
  return response?.data;
}

export async function uploadBusinessLogo(logo: File, accessToken: string): Promise<UserLogoUploadResponse | undefined> {
  const response = await api.uploadUserLogo(
    { file: logo },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return await response.data;
}
