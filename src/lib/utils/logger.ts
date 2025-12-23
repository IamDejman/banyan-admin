/**
 * Logger utility that only logs in development mode
 * Use this instead of console.log/error/warn to prevent logs in production
 */

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  log: (...args: unknown[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  
  error: (...args: unknown[]) => {
    // Always log errors, even in production (but you can change this)
    console.error(...args);
  },
  
  warn: (...args: unknown[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  
  info: (...args: unknown[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },
  
  debug: (...args: unknown[]) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },
};

// For client-side usage (browser)
export const clientLogger = {
  log: (...args: unknown[]) => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log(...args);
    }
  },
  
  error: (...args: unknown[]) => {
    // Always log errors
    if (typeof window !== 'undefined') {
      console.error(...args);
    }
  },
  
  warn: (...args: unknown[]) => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.warn(...args);
    }
  },
  
  info: (...args: unknown[]) => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.info(...args);
    }
  },
  
  debug: (...args: unknown[]) => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.debug(...args);
    }
  },
};

