import { createAPI } from '../../redux/createAPI';

const authApi = createAPI.injectEndpoints({
  endpoints: (build) => ({
    loginpApi: build.mutation({
      query: ({ formData }) => {
        return {
          url: `/user/user_auth/login/`,
          method: 'POST',
          body: formData,
        };
      },
    }),
    sendOtpApi: build.mutation({
      query: ({ formData }) => {
        return {
          url: `/user/verify/send_otp/`,
          method: 'POST',
          body: formData,
        };
      },
    }),
    verifyOtpApi: build.mutation({
      query: ({ formData }) => {
        return {
          url: `/user/verify/verify_otp/`,
          method: 'POST',
          body: formData,
        };
      },
    }),
    resendOtpApi: build.mutation({
      query: ({ formData }) => {
        return {
          url: `/user/verify/re_send_otp/`,
          method: 'POST',
          body: formData,
        };
      },
    }),
       // ✅ Google Login/Signup mutation
    loginWithGoogle: build.mutation({
      query: ({ id_token }) => ({
        url: `/user/user_auth/login_with_google/`,
        method: 'POST',
        body: { id_token },
      }),
    }),
    signupApi: build.mutation({
      query: ({ formData }) => {
        return {
          url: `/user/user_auth/signup/`,
          method: 'POST',
          body: formData,
        };
      },
    }),
    forgotPasswordApi: build.mutation({
      query: ({ email }) => {
        return {
          url: `/user/user_auth/forgot_password/`,
          method: 'POST',
          body: { email },
        };
      },
    }),
    resetPasswordApi: build.mutation({
      query: ({ email, otp, new_password, confirm_password }) => {
        return {
          url: `/user/user_auth/reset_password/`,
          method: 'POST',
          body: { email, otp, new_password, confirm_password },
        };
      },
    }),

     updatePassword: build.mutation({
      query: (body) => ({
        url: `${import.meta.env.VITE_SUPABASE_URL}/auth/v1/user`,
        method: "PUT",
        body: { password: body.new_password },
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useSignupApiMutation,
  useLoginpApiMutation,
  useSendOtpApiMutation,
  useVerifyOtpApiMutation,
  useUpdatePasswordMutation,
  useResendOtpApiMutation,
    useLoginWithGoogleMutation, // ✅ export Google mutation
  useForgotPasswordApiMutation,
  useResetPasswordApiMutation,
} = authApi;
