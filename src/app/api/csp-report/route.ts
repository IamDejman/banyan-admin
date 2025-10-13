import { NextRequest, NextResponse } from 'next/server';
import { validateCSPReport, CSPViolationReport } from '@/lib/config/csp';

/**
 * CSP Violation Reporting Endpoint
 * Handles Content Security Policy violation reports
 */

export async function POST(request: NextRequest) {
  try {
    // Parse the CSP violation report
    const report: CSPViolationReport = await request.json();
    
    // Validate the report structure
    if (!validateCSPReport(report)) {
      console.error('Invalid CSP violation report structure:', report);
      return NextResponse.json(
        { error: 'Invalid CSP violation report' },
        { status: 400 }
      );
    }
    
    const violation = report['csp-report'];
    
    // Log CSP violation (in production, you might want to send this to a logging service)
    console.error('CSP Violation Report:', {
      timestamp: new Date().toISOString(),
      blockedUri: violation['blocked-uri'],
      documentUri: violation['document-uri'],
      violatedDirective: violation['violated-directive'],
      effectiveDirective: violation['effective-directive'],
      originalPolicy: violation['original-policy'],
      disposition: violation['disposition'],
      referrer: violation['referrer'],
      statusCode: violation['status-code'],
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
    });
    
    // In production, you might want to:
    // 1. Send to logging service (e.g., Sentry, LogRocket, etc.)
    // 2. Store in database for analysis
    // 3. Send alerts for critical violations
    // 4. Update CSP policy based on violations
    
    // Example: Send to external logging service
    if (process.env.NODE_ENV === 'production') {
      await sendToLoggingService(violation, request);
    }
    
    // Return success response
    return NextResponse.json(
      { message: 'CSP violation report received' },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error processing CSP violation report:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Send CSP violation to external logging service
 */
async function sendToLoggingService(violation: CSPViolationReport['csp-report'], request: NextRequest) {
  try {
    // Example: Send to Sentry (optional dependency)
    if (process.env.SENTRY_DSN) {
      // Note: To use Sentry, install @sentry/nextjs and uncomment the code below
      // const { captureException } = require('@sentry/nextjs');
      // captureException(new Error('CSP Violation'), {
      //   tags: { type: 'csp-violation' },
      //   extra: {
      //     blockedUri: violation['blocked-uri'],
      //     documentUri: violation['document-uri'],
      //     violatedDirective: violation['violated-directive'],
      //     userAgent: request.headers.get('user-agent'),
      //   },
      // });
      console.log('Sentry integration available (install @sentry/nextjs to enable)');
    }
    
    // Example: Send to custom logging endpoint
    if (process.env.LOGGING_ENDPOINT) {
      await fetch(process.env.LOGGING_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.LOGGING_API_KEY}`,
        },
        body: JSON.stringify({
          type: 'csp-violation',
          timestamp: new Date().toISOString(),
          violation,
          metadata: {
            userAgent: request.headers.get('user-agent'),
            ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
          },
        }),
      });
    }
    
  } catch (error) {
    console.error('Error sending CSP violation to logging service:', error);
  }
}

/**
 * GET endpoint for CSP report endpoint health check
 */
export async function GET() {
  return NextResponse.json(
    { 
      message: 'CSP violation reporting endpoint is active',
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}
