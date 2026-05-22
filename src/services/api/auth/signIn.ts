/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { jwtDecode } from 'jwt-decode';
import { LoginRequest, UserApi, UserAuthenticationResponseData } from '../../../api/user';
import { userLoginForm } from '../../../components/validations/login-validation';
import apiInstance, { removeRequestHeaderAuth } from '../../configs/api-config';
import { SignInError } from '../../errors/signIn-error';
import { DecodedToken } from '../../../models/google-auth';

const api = new UserApi(undefined, undefined, apiInstance);

export async function signInWithEmailAndPassword(
  data: userLoginForm
): Promise<UserAuthenticationResponseData | undefined> {
  removeRequestHeaderAuth();
  const requestData: any = {
    email: data?.email,
    password: data?.password,
  };

  const response = await api.login({ loginRequest: requestData }).catch((error) => {
    throw new SignInError(error.status, error.response.data.details);
  });
  // @ts-ignore
  return await response?.data;
}

export async function signInWithGoogle(token: string): Promise<UserAuthenticationResponseData | undefined> {
  removeRequestHeaderAuth();

  const decodedToken = jwtDecode<DecodedToken>(token);

  const requestData: LoginRequest = {
    provider: {
      authProvider: 'google',
      authProviderIdToken: token,
    },
    credentials: {
      email: decodedToken.email,
    },
  };

  const response = await api.login({ loginRequest: requestData }).catch((error) => {
    throw new SignInError(error.status, error.response.data.details);
  });

  return await response.data.data;
}
