import axios from 'axios';
import {
  CancelSubscriptionResponse,
  CheckPaymentStatusRequest,
  CheckPaymentStatusResponse,
  CreateCheckoutRequest,
  CreateCheckoutSessionResponse,
  GetAllSubscriptionHistoryPaginatedResponse,
  SubscriptionApi,
  SubscriptionPlansResponse,
  UserSubscriptionPlanResponse,
} from '../../../api/subscription';
import apiInstance from '../../configs/api-config';
import { DefaultError } from '../../errors/default-error';

const api = new SubscriptionApi(undefined, undefined, apiInstance);

export async function getPlans(): Promise<SubscriptionPlansResponse> {
  const response = await axios.get(`${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/user-api/packages`, {
    headers: {
      'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
    }
  }).catch((error) => {
    throw new DefaultError(error.status, error.response?.data?.details || error.message);
  });

  return response?.data;
}

export async function createSession(priceId: string): Promise<CreateCheckoutSessionResponse> {
  const requestData = {
    priceId,
  } as CreateCheckoutRequest;

  const response = await api.createCheckoutSession(requestData).catch((error) => {
    throw new DefaultError(error.status, error.response.data.details);
  });

  return await response?.data;
}

export async function getStatus(sessionId: string): Promise<CheckPaymentStatusResponse> {
  const requestData = {
    sessionId,
  } as CheckPaymentStatusRequest;

  const response = await api.checkPaymentStatus(requestData).catch((error) => {
    throw new DefaultError(error.status, error.response.data.details);
  });

  return await response?.data;
}

export async function getBillingList(): Promise<GetAllSubscriptionHistoryPaginatedResponse> {
  const response = await axios.get(`${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/user-api/list_invoices`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
    }
  }).catch((error) => {
    throw new DefaultError(error.status, error.response?.data?.details || error.message);
  });

  return response?.data;
}

export async function getCurrentPlan(): Promise<UserSubscriptionPlanResponse> {
  const response = await axios.get(`${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/user-api/subscription`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
    }
  }).catch((error) => {
    throw new DefaultError(error.status, error.response?.data?.details || error.message);
  });

  // Handle wrapped data
  const planData = response?.data?.subscription || response?.data?.data?.subscription || response?.data?.data;
  return planData;
}

export async function cancelSubscription(): Promise<CancelSubscriptionResponse> {
  const response = await api.cancelSubscription().catch((error) => {
    throw new DefaultError(error.status, error.response.data.details);
  });

  return await response?.data;
}
