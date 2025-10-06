import { Http } from "../utils/http";

interface VerifyEmailPayload {
  otp_hash: string;
  otp: string;
}
// register response
interface RegisterResponse {
  token: string;
  user: {
    account_balance: string;
    address: string;
    bank_account_name: string;
    bank_account_number: string;
    bank_code: string;
    bank_name: string;
    bvn_verified: number;
    created_at: string;
    driver_license_verified: number;
    email: string;
    email_verified_at: string;
    first_name: string;
    id: number;
    last_name: string;
    nin_verified: number;
    phone: string;
    phone_verified_at: string;
    updated_at: string;
  };

  
}
interface LoginResponse {

  otp_hash: string;
}

export const requestVerificationCode = (payload: { email: string }) =>
  Http.post(`/auth/resend-otp`, payload);

export const verifyEmail = (payload: VerifyEmailPayload): Promise<RegisterResponse> => Http.post(`/admin/verify-otp`, payload);

export const login = (payload: { email: string; password: string }): Promise<LoginResponse> =>
  Http.post(`/admin/login`, payload);

export const forgotPassword = (payload: { email: string }) =>
  Http.post(`/auth/forgot-password`, payload);

export const resendOtp = (payload: { email: string }) =>
  Http.post(`/auth/resend-otp`, payload);

// Resend OTP using otp_hash (for after login verification)
export const resendOtpWithHash = (payload: { otp_hash: string }) =>
  Http.post(`/admin/resend-otp`, payload);

export const resetPassword = (payload: {
  otp: string;
  reset_id: string;
  password: string;
  password_confirmation: string;
}) => Http.post(`/auth/reset-password`, payload);

export const getUserDetails = () => Http.get(`/user`);



// create pin
export const createPin = (payload: {
  pin: string;
  pin_confirmation: string;
}) => Http.post(`/profile/create-pin`, payload);


