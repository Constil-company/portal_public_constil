/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import apiInstance from './configs/api-config';
import axios from 'axios';

const FUNCTIONS_URL = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export interface PermissionCheckResult {
  hasPermission: boolean;
  planName: string;
}

export const loginWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${FUNCTIONS_URL}/user-api/login`, {
      email,
      password,
    }, {
      headers: {
        'apikey': ANON_KEY,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error: any) {
    let errorMessage = 'Falha ao fazer login. Tente novamente.';
    if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(errorMessage);
  }
};

export const loginWithGoogle = async (idToken: string) => {
  try {
    const response = await axios.post(`${FUNCTIONS_URL}/user-api/auth/google`, {
      id_token: idToken,
    }, {
      headers: {
        'apikey': ANON_KEY,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error: any) {
    let errorMessage = 'Falha ao fazer login com Google.';
    if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(errorMessage);
  }
};

export const userRegistrationWithEmail = async (
  firstName: string,
  lastName: string,
  email: string, 
  password: string, 
  couponCode?: string,
  phone?: string,
  address?: string,
  zipCode?: string,
  city?: string,
  state?: string,
  country?: string,
  companyName?: string
) => {
  try {
    const response = await axios.post(`${FUNCTIONS_URL}/user-api/register`, {
      email: email,
      password: password,
      first_name: firstName,
      last_name: lastName,
      full_name: `${firstName} ${lastName}`,
      coupon_code: couponCode,
      phone: phone,
      address: address,
      zip_code: zipCode,
      city: city,
      state: state,
      country: country,
      company_name: companyName
    }, {
      headers: {
        'apikey': ANON_KEY,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error: any) {
    let errorMessage = 'Falha ao registrar. Tente novamente.';
    if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(errorMessage);
  }
};

export const verifyEmail = async (email: string, otp: string) => {
  try {
    const response = await axios.post(`${FUNCTIONS_URL}/user-api/verify-otp`, {
      email: email,
      otp: otp
    }, {
      headers: {
        'apikey': ANON_KEY,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Verification failed');
  }
};

export const sendSignupOTP = async (email: string) => {
  try {
    const response = await axios.post(`${FUNCTIONS_URL}/user-api/send-signup-otp`, {
      email
    }, {
      headers: {
        'apikey': ANON_KEY,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to send OTP');
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const response = await axios.post(`${FUNCTIONS_URL}/user-api/forgot-password`, {
      email
    }, {
      headers: {
        'apikey': ANON_KEY,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to send reset code');
  }
};

export const resetPassword = async (email: string, otp: string, password: string) => {
  try {
    const response = await axios.post(`${FUNCTIONS_URL}/user-api/reset-password`, {
      email,
      otp,
      password
    }, {
      headers: {
        'apikey': ANON_KEY,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Password reset failed');
  }
};

export const checkInvoiceCreationPermission = async (): Promise<PermissionCheckResult> => {
  try {
    const response = await apiInstance.get(`${FUNCTIONS_URL}/user-api/subscription`, {
      headers: {
        'apikey': ANON_KEY
      }
    });
    const sub = response.data.subscription;
    const hasPermission = sub?.is_active || false;
    return {
      hasPermission,
      planName: sub?.package_name || 'Free',
    };
  } catch (error) {
    console.error('Erro ao verificar permissões:', error);
    return {
      hasPermission: false,
      planName: 'Free',
    };
  }
};

export const checkEstimateCreationPermission = async (): Promise<PermissionCheckResult> => {
  return checkInvoiceCreationPermission();
};

export const checkProductCreationPermission = async (): Promise<PermissionCheckResult> => {
    return checkInvoiceCreationPermission();
};

export const updateCurrentUserData = async (requestData: any) => {
  try {
    const response = await apiInstance.post(`/rest/v1/company_profiles`, requestData, {
        headers: {
            'Prefer': 'resolution=merge-duplicates'
        }
    });
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to update user data');
  }
};

export const checkClientCreationPermission = async (): Promise<PermissionCheckResult> => {
    return checkInvoiceCreationPermission();
};

export const shouldShowUpgradeButton = async (): Promise<boolean> => {
  try {
    const response = await apiInstance.get(`${FUNCTIONS_URL}/user-api/subscription`, {
        headers: {
            'apikey': ANON_KEY
        }
    });
    const sub = response.data.subscription;
    return !sub?.is_active || sub?.status === 'trial';
  } catch (error) {
    console.error('Erro ao verificar plano do usuário:', error);
    return true;
  }
};
