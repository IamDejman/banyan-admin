/**
 * Test credentials for API testing
 * These are used internally for testing API endpoints
 * 
 * Email: idowujulius92@gmail.com
 * Password: julipels
 * OTP: 100000
 */

export const TEST_CREDENTIALS = {
  email: 'idowujulius92@gmail.com',
  password: 'julipels',
  otp: '100000'
} as const;

/**
 * Get authentication token for API testing
 * This function can be used to fetch a fresh token for testing
 */
export const getTestAuthToken = async (): Promise<string | null> => {
  try {
    // Step 1: Login with credentials
    const loginResponse = await fetch('https://api.banyanclaims.com/api/v1/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: TEST_CREDENTIALS.email,
        password: TEST_CREDENTIALS.password
      })
    });

    if (!loginResponse.ok) {
      console.error('Login failed:', await loginResponse.text());
      return null;
    }

    const loginData = await loginResponse.json();
    const otpHash = loginData.otp_hash;

    if (!otpHash) {
      console.error('No OTP hash received');
      return null;
    }

    // Step 2: Verify OTP
    const verifyResponse = await fetch('https://api.banyanclaims.com/api/v1/admin/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        otp_hash: otpHash,
        otp: TEST_CREDENTIALS.otp
      })
    });

    if (!verifyResponse.ok) {
      console.error('OTP verification failed:', await verifyResponse.text());
      return null;
    }

    const verifyData = await verifyResponse.json();
    return verifyData.token || null;

  } catch (error) {
    console.error('Error getting test auth token:', error);
    return null;
  }
};

/**
 * Test API endpoint with authentication
 */
export const testApiEndpoint = async (endpoint: string, method: string = 'GET', body?: unknown) => {
  const token = await getTestAuthToken();
  
  if (!token) {
    console.error('Failed to get authentication token');
    return null;
  }

  try {
    const response = await fetch(`https://api.banyanclaims.com/api/v1${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    });

    const data = await response.json();
    return {
      status: response.status,
      data,
      ok: response.ok
    };
  } catch (error) {
    console.error('API test error:', error);
    return null;
  }
};
