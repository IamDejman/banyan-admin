/**
 * Content Security Policy (CSP) Configuration
 * Centralized CSP policy configuration for the application
 */

export interface CSPConfig {
  development: string;
  production: string;
}

// CSP Policy for Development
const developmentCSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net https://unpkg.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
  "img-src 'self' data: blob: https: http:",
  "font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net",
  "connect-src 'self' https://api.banyanclaims.com https://banyan.backend.ricive.com wss: ws: http://localhost:*",
  "media-src 'self'",
  "object-src 'none'",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "manifest-src 'self'",
  "worker-src 'self' blob:",
  "child-src 'self' blob:",
  // Development-specific: Allow hot reloading
  "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net https://unpkg.com",
].join('; ');

// CSP Policy for Production
const productionCSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net https://unpkg.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
  "img-src 'self' data: blob: https:",
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
  "block-all-mixed-content",
  // Add CSP violation reporting
  "report-uri /api/csp-report",
].join('; ');

// Strict CSP Policy (for maximum security)
const strictCSP = [
  "default-src 'self'",
  "script-src 'self' 'nonce-{NONCE}'",
  "style-src 'self' 'nonce-{NONCE}' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' https://fonts.gstatic.com",
  "connect-src 'self' https://api.banyanclaims.com https://banyan.backend.ricive.com",
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
  "block-all-mixed-content",
  "report-uri /api/csp-report",
].join('; ');

export const cspConfig: CSPConfig = {
  development: developmentCSP,
  production: productionCSP,
};

export const strictCSPConfig = strictCSP;

/**
 * Get CSP policy based on environment
 */
export function getCSPPolicy(): string {
  const isDevelopment = process.env.NODE_ENV === 'development';
  return isDevelopment ? cspConfig.development : cspConfig.production;
}

/**
 * Get CSP policy with nonce support
 */
export function getCSPPolicyWithNonce(nonce: string): string {
  return strictCSPConfig.replace(/{NONCE}/g, nonce);
}

/**
 * Validate CSP directive
 */
export function validateCSPDirective(directive: string): boolean {
  const validDirectives = [
    'default-src',
    'script-src',
    'style-src',
    'img-src',
    'font-src',
    'connect-src',
    'media-src',
    'object-src',
    'frame-src',
    'frame-ancestors',
    'base-uri',
    'form-action',
    'manifest-src',
    'worker-src',
    'child-src',
    'upgrade-insecure-requests',
    'block-all-mixed-content',
    'report-uri',
    'report-to',
  ];

  const directiveName = directive.split(' ')[0];
  return validDirectives.includes(directiveName);
}

/**
 * Parse CSP policy into directives
 */
export function parseCSPPolicy(policy: string): Record<string, string[]> {
  const directives: Record<string, string[]> = {};
  
  policy.split(';').forEach(directive => {
    const trimmed = directive.trim();
    if (trimmed) {
      const [name, ...values] = trimmed.split(' ');
      directives[name] = values;
    }
  });
  
  return directives;
}

/**
 * CSP violation report handler
 */
export interface CSPViolationReport {
  'csp-report': {
    'blocked-uri': string;
    'disposition': string;
    'document-uri': string;
    'effective-directive': string;
    'original-policy': string;
    'referrer': string;
    'status-code': number;
    'violated-directive': string;
  };
}

export function validateCSPReport(report: CSPViolationReport): boolean {
  const requiredFields = [
    'blocked-uri',
    'document-uri',
    'effective-directive',
    'original-policy',
    'violated-directive',
  ];

  const cspReport = report['csp-report'];
  return requiredFields.every(field => field in cspReport);
}

// Export constants for easy access
export const CSP_DIRECTIVES = {
  DEFAULT_SRC: 'default-src',
  SCRIPT_SRC: 'script-src',
  STYLE_SRC: 'style-src',
  IMG_SRC: 'img-src',
  FONT_SRC: 'font-src',
  CONNECT_SRC: 'connect-src',
  MEDIA_SRC: 'media-src',
  OBJECT_SRC: 'object-src',
  FRAME_SRC: 'frame-src',
  FRAME_ANCESTORS: 'frame-ancestors',
  BASE_URI: 'base-uri',
  FORM_ACTION: 'form-action',
  MANIFEST_SRC: 'manifest-src',
  WORKER_SRC: 'worker-src',
  CHILD_SRC: 'child-src',
  UPGRADE_INSECURE_REQUESTS: 'upgrade-insecure-requests',
  BLOCK_ALL_MIXED_CONTENT: 'block-all-mixed-content',
  REPORT_URI: 'report-uri',
  REPORT_TO: 'report-to',
} as const;

export const CSP_KEYWORDS = {
  SELF: "'self'",
  UNSAFE_INLINE: "'unsafe-inline'",
  UNSAFE_EVAL: "'unsafe-eval'",
  NONE: "'none'",
  STRICT_DYNAMIC: "'strict-dynamic'",
} as const;
