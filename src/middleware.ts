import { NextRequest, NextResponse } from 'next/server';

// Define allowed origins based on environment
const getAllowedOrigins = () => {
  const allowedOrigins = [
    // Production domain
    'https://banyan-admin-six.vercel.app',
    // Development domains
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ];

  // Add custom domains from environment variables
  if (process.env.ALLOWED_ORIGINS) {
    const customOrigins = process.env.ALLOWED_ORIGINS.split(',');
    allowedOrigins.push(...customOrigins);
  }

  return allowedOrigins;
};

// CORS headers configuration
const corsHeaders = {
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Origin',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'true',
};

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin');
  const allowedOrigins = getAllowedOrigins();
  
  // Check if origin is allowed
  const isAllowedOrigin = origin && allowedOrigins.includes(origin);
  
  // Set CORS headers based on allowed origins
  const corsResponseHeaders = {
    ...corsHeaders,
    'Access-Control-Allow-Origin': isAllowedOrigin ? origin : 'null',
  };

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: corsResponseHeaders,
    });
  }

  // For API routes, add CORS headers
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Check for unauthorized cross-origin requests
    if (request.method !== 'GET' && !isAllowedOrigin) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'Unauthorized cross-origin request',
          message: 'CORS policy violation' 
        }),
        {
          status: 403,
          headers: {
            ...corsResponseHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Add CORS headers to response
    const response = NextResponse.next();
    Object.entries(corsResponseHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  }

  // For non-API routes, add security headers
  const response = NextResponse.next();
  
  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()');
  response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');
  
  // Add Content Security Policy
  const cspHeader = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net https://unpkg.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
    "img-src 'self' data: blob: https: http:",
    "font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net",
    "connect-src 'self' https://api.banyanclaims.com https://banyan.backend.ricive.com wss: ws:",
    "media-src 'self'",
    "object-src 'none'",
    "frame-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "manifest-src 'self'",
    "worker-src 'self' blob:",
    "child-src 'self' blob:",
    "upgrade-insecure-requests",
    "block-all-mixed-content"
  ].join('; ');
  
  response.headers.set('Content-Security-Policy', cspHeader);
  
  // Add CORS headers for allowed origins only
  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }

  return response;
}

export const config = {
  matcher: [
    // Match all API routes
    '/api/:path*',
    // Match all pages except static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
