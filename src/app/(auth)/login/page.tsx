'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BanyanLogo } from '@/components/ui/banyan-logo';
import Link from 'next/link';
import { login, verifyEmail, resendOtpWithHash } from '@/app/services/auth';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import cookie from '@/app/utils/cookie';

// Define proper error types for Axios errors
interface ApiError {
  response?: {
    data?: {
      message?: string;
      statusCode?: number;
    };
    status?: number;
  };
  message?: string;
}

export default function LoginPage() {
  const [step, setStep] = useState<'credentials' | '2fa'>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpHash, setOtpHash] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setError('');
      setIsLoading(true);
      const res = await login({ email, password });
      setOtpHash(res?.otp_hash || '');
      setIsLoading(false);
      setStep('2fa');
      // Start 5-minute countdown when OTP step is reached
      setCountdown(300); // 5 minutes = 300 seconds
    } catch (err: unknown) {
      const error = err as ApiError;
      console.log(error, "err");
      console.log(error?.message, "err?.message");
      setIsLoading(false);
      console.log(error?.response?.data?.message, "err?.response?.data?.message");
      setError(error?.response?.data?.message || 'An error occurred');
    }
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    try {
      setIsLoading(true);
      e.preventDefault();
      setError('');
      const res = await verifyEmail({ otp_hash: otpHash, otp: twoFactorCode });
      console.log(res.token, "res");
      cookie().setCookie('token', res?.token);
      // cookie().setCookie('userType', res?.user?.role);
      cookie().setCookie('userData', JSON.stringify(res?.user));
      setIsLoading(false);
      router.push('/dashboard/claims');
    } catch (err: unknown) {
      const error = err as ApiError;
      setIsLoading(false);
      setError(error?.response?.data?.message || 'An error occurred');
    }
  };

  // Countdown timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  // Resend OTP function
  const handleResendOtp = async () => {
    if (countdown > 0 || !otpHash) return;
    
    try {
      setIsResending(true);
      setError('');
      await resendOtpWithHash({ otp_hash: otpHash });
      // Restart countdown after successful resend
      setCountdown(300); // 5 minutes
      setError(''); // Clear any previous errors
    } catch (err: unknown) {
      const error = err as ApiError;
      setError(error?.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setIsResending(false);
    }
  };

  // Format countdown display
  const formatCountdown = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-6">
            <BanyanLogo size={64} className="text-primary" />
          </div>
          <CardTitle className="text-2xl text-center">
            {step === 'credentials' ? 'Welcome back' : 'Two-Factor Authentication'}
          </CardTitle>
          <CardDescription className="text-center">
            {step === 'credentials'
              ? 'Enter your credentials to access your account'
              : 'Enter the 6-digit code from your authenticator app'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'credentials' ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                 
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Button type="submit" className="w-full">
                {isLoading ? <Loader2 className="w-4 h-4 mr-2" /> : 'Sign in'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handle2FASubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="mb-6">
                <Label htmlFor="2fa" className="mb-4 block">Authentication Code</Label>
                <Input
                  id="2fa"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  required
                  maxLength={6}
                />
              </div>
              <Button type="submit" className="w-full">
                {isLoading ? <Loader2 className="w-4 h-4 mr-2" /> : 'Verify'}
              </Button>
              
              {/* Resend OTP Section */}
              <div className="text-center text-sm space-y-4 mt-8">
                {countdown > 0 ? (
                  <div className="text-muted-foreground">
                    Resend OTP in {formatCountdown(countdown)}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isResending}
                    className="text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isResending ? 'Resending...' : 'Resend OTP'}
                  </button>
                )}
                
                <div>
                  <button
                    type="button"
                    onClick={() => setStep('credentials')}
                    className="text-primary hover:underline"
                  >
                    Back to Login
                  </button>
                </div>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 