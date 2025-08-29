'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BanyanLogo } from '@/components/ui/banyan-logo';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { login, verifyEmail } from '@/app/services/auth';
import { Loader2 } from 'lucide-react';
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
  const [rememberMe, setRememberMe] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setError('');
      setIsLoading(true);
      const res = await login({ email, password });
      setOtpHash(res?.otp_hash || '');
      setIsLoading(false);
      setStep('2fa');
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
      router.push('/dashboard');
    } catch (err: unknown) {
      const error = err as ApiError;
      setIsLoading(false);
      setError(error?.response?.data?.message || 'An error occurred');
    }
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
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="remember" className="text-sm">
                    Remember me
                  </Label>
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
              <div className="space-y-2">
                <Label htmlFor="2fa">Authentication Code</Label>
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
              <div className="text-center text-sm">
                <button
                  type="button"
                  onClick={() => setStep('credentials')}
                  className="text-primary hover:underline"
                >
                  Back to Login
                </button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 