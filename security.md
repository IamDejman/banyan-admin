# Security Configuration Guide

## OpenTCPPort Vulnerabilities Fix

### Issue Description
Open TCP ports 80 and 443 were detected, which can be security risks if not properly configured.
- **Port 80**: Standard HTTP port - should redirect to HTTPS
- **Port 443**: Standard HTTPS port - must be properly secured with SSL/TLS

### Solutions

#### 1. Use HTTPS Only (Recommended)
- Configure your web server (nginx/Apache) to redirect HTTP (port 80) to HTTPS (port 443)
- Use Let's Encrypt or similar SSL certificates
- Force HTTPS in your Next.js configuration

#### 2. Close Port 80 (If Not Needed)
If you don't need HTTP traffic, close port 80 entirely:
```bash
# For Ubuntu/Debian
sudo ufw deny 80
sudo ufw deny out 80

# For CentOS/RHEL
sudo firewall-cmd --permanent --remove-port=80/tcp
sudo firewall-cmd --reload
```

#### 3. Configure Reverse Proxy (Recommended for Production)
Use nginx as a reverse proxy:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Next.js Application Security
The application now includes:
- Security headers (X-Frame-Options, CSP, HSTS, etc.)
- Disabled X-Powered-By header
- Content Security Policy
- HTTPS enforcement

### Environment Variables
Set these environment variables in production:
```
NODE_ENV=production
PORT=3000
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-secret-key
```

### Deployment Checklist
- [ ] Use HTTPS only
- [ ] Configure firewall rules
- [ ] Set up SSL certificates
- [ ] Configure reverse proxy
- [ ] Set secure environment variables
- [ ] Enable security headers
- [ ] Regular security updates
- [ ] Monitor for vulnerabilities

### Port 443 Security Enhancements

#### SSL/TLS Configuration
- **Modern TLS Only**: TLSv1.2 and TLSv1.3 only
- **Strong Ciphers**: ECDHE ciphers with AES-GCM and ChaCha20-Poly1305
- **OCSP Stapling**: Enabled for certificate validation
- **HSTS**: Strict Transport Security with preload
- **Certificate Monitoring**: Automated expiration checks

#### Access Controls
- **Rate Limiting**: API and login endpoint protection
- **Bot Detection**: Block suspicious user agents
- **Request Filtering**: Block requests with no user agent
- **Security Headers**: Comprehensive security headers

### Monitoring Tools

#### Port Monitoring Script
```bash
# Run port security check
./scripts/port-monitor.sh

# Continuous monitoring
./scripts/port-monitor.sh --continuous
```

#### SSL Certificate Management
```bash
# Setup SSL certificates
./scripts/setup-ssl.sh

# Check certificate status
openssl x509 -in ssl/cert.pem -noout -dates
```

#### Security Monitoring
- Use tools like `nmap` to scan for open ports
- Set up security monitoring with the provided scripts
- Regular penetration testing
- Keep dependencies updated
- Monitor SSL certificate expiration
- Log analysis for suspicious activity

### Port 443 Specific Security Measures
1. **SSL/TLS Hardening**: Only modern protocols and strong ciphers
2. **Certificate Management**: Automated renewal and monitoring
3. **Access Logging**: Detailed logging of all HTTPS connections
4. **Rate Limiting**: Protection against DDoS and brute force
5. **Security Headers**: CSP, HSTS, and other protective headers
6. **Bot Protection**: Block automated scanning tools
7. **Connection Monitoring**: Track and alert on suspicious connections

## Cross-Domain Misconfiguration (CORS) Fix

### Issue Description
Cross-Domain Misconfiguration vulnerability detected with overly permissive CORS headers (`Access-Control-Allow-Origin: *`).

### CORS Security Implementation

#### 1. Restricted Origins
- **Production**: `https://banyan-admin-six.vercel.app`
- **Development**: `http://localhost:3000`, `http://127.0.0.1:3000`
- **Custom**: Configurable via `ALLOWED_ORIGINS` environment variable

#### 2. CORS Headers Configuration
```javascript
// Allowed methods
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS

// Allowed headers
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin

// Credentials support
Access-Control-Allow-Credentials: true

// Cache duration
Access-Control-Max-Age: 86400
```

#### 3. Security Layers
- **Next.js Middleware**: Request-level CORS validation
- **Server Configuration**: Node.js server CORS protection
- **Nginx Configuration**: Proxy-level CORS enforcement
- **Vercel Configuration**: Platform-level CORS headers

#### 4. CORS Testing Tools
```bash
# Test CORS configuration
npm run security:cors

# Test local development
npm run security:cors-local

# Complete security audit
npm run security:all
```

### CORS Security Best Practices
1. **Never use wildcard (*)** for Access-Control-Allow-Origin
2. **Validate origins** against allowlist
3. **Handle preflight requests** properly
4. **Use HTTPS** for all CORS requests
5. **Implement rate limiting** on CORS endpoints
6. **Log CORS violations** for monitoring
7. **Regular testing** of CORS configuration

### Environment Variables
```bash
# Add custom allowed origins (comma-separated)
ALLOWED_ORIGINS=https://custom-domain.com,https://another-domain.com
```

## Content Security Policy (CSP) Fix

### Issue Description
Content Security Policy (CSP) header was not properly configured, leaving the application vulnerable to XSS and data injection attacks.

### CSP Security Implementation

#### 1. Comprehensive CSP Policy
```javascript
// Production CSP Policy
default-src 'self';
script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net https://unpkg.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net;
img-src 'self' data: blob: https: http:;
font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net;
connect-src 'self' https://api.banyanclaims.com https://banyan.backend.ricive.com wss: ws:;
media-src 'self';
object-src 'none';
frame-src 'none';
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
manifest-src 'self';
worker-src 'self' blob:;
child-src 'self' blob:;
upgrade-insecure-requests;
block-all-mixed-content;
report-uri /api/csp-report;
```

#### 2. Multi-Layer CSP Implementation
- **Next.js Configuration**: Application-level CSP headers
- **Server Configuration**: Node.js server CSP headers
- **Nginx Configuration**: Proxy-level CSP enforcement
- **Vercel Configuration**: Platform-level CSP headers
- **Middleware**: Request-level CSP validation

#### 3. CSP Violation Reporting
- **API Endpoint**: `/api/csp-report` for violation reporting
- **Logging**: Comprehensive violation logging
- **Monitoring**: Integration with logging services (Sentry, etc.)
- **Analysis**: CSP violation analysis and policy updates

#### 4. CSP Testing Tools
```bash
# Test CSP configuration
npm run security:csp

# Test local development
npm run security:csp-local

# Validate CSP syntax
npm run security:csp-validate

# Complete security audit
npm run security:all
```

### CSP Security Features
1. **Strict Source Lists**: No wildcards, specific domain allowlists
2. **Violation Reporting**: Real-time CSP violation monitoring
3. **HTTPS Enforcement**: Upgrade insecure requests
4. **Mixed Content Blocking**: Prevent mixed content issues
5. **Frame Protection**: Prevent clickjacking attacks
6. **Object Protection**: Block dangerous object types
7. **Form Protection**: Restrict form submission targets

### CSP Best Practices
1. **Start Strict**: Begin with restrictive policies
2. **Monitor Violations**: Use violation reporting
3. **Regular Updates**: Update CSP based on violations
4. **Test Thoroughly**: Test CSP in all environments
5. **Document Changes**: Document CSP policy changes
6. **Use Nonces**: Implement nonce-based CSP when possible
7. **Validate Syntax**: Regularly validate CSP syntax

### CSP Configuration Files
- **`src/lib/config/csp.ts`**: Centralized CSP configuration
- **`src/app/api/csp-report/route.ts`**: Violation reporting endpoint
- **`scripts/test-csp.sh`**: CSP testing and validation script

## Security Headers Fix

### Issue Description
Multiple security headers were missing or not properly configured:
- **Missing Anti-clickjacking Header**: X-Frame-Options and frame-ancestors
- **Missing MIME Sniffing Protection**: X-Content-Type-Options
- **Missing HSTS**: Strict-Transport-Security header

### Security Headers Implementation

#### 1. Anti-Clickjacking Protection
```http
X-Frame-Options: DENY
Content-Security-Policy: frame-ancestors 'none'
```
- **X-Frame-Options**: Prevents page from being embedded in frames
- **CSP frame-ancestors**: Modern alternative to X-Frame-Options
- **Protection**: Blocks clickjacking attacks

#### 2. MIME Sniffing Protection
```http
X-Content-Type-Options: nosniff
```
- **Prevents**: MIME-type confusion attacks
- **Protection**: Stops browsers from interpreting files as different content types
- **Compatibility**: Works with older browsers

#### 3. HTTP Strict Transport Security (HSTS)
```http
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```
- **Forces HTTPS**: Redirects HTTP to HTTPS
- **Prevents**: Protocol downgrade attacks
- **Subdomains**: Includes all subdomains
- **Preload**: Eligible for browser preload lists

#### 4. Additional Security Headers
```http
Referrer-Policy: strict-origin-when-cross-origin
X-XSS-Protection: 1; mode=block
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
```

#### 5. Security Headers Testing
```bash
# Test all security headers
npm run security:headers

# Test local development
npm run security:headers-local

# Complete security audit
npm run security:all
```

### Security Headers Best Practices
1. **X-Frame-Options**: Always set to DENY or SAMEORIGIN
2. **X-Content-Type-Options**: Always set to nosniff
3. **HSTS**: Use long max-age with includeSubDomains
4. **CSP**: Include frame-ancestors directive
5. **Referrer-Policy**: Control referrer information leakage
6. **Permissions-Policy**: Restrict dangerous browser APIs
7. **Cross-Origin Policies**: Control cross-origin resource access

### Security Headers Configuration Files
- **`next.config.ts`**: Next.js security headers configuration
- **`server.js`**: Node.js server security headers
- **`nginx.conf`**: Nginx proxy security headers
- **`vercel.json`**: Vercel platform security headers
- **`src/middleware.ts`**: Request-level security headers
- **`scripts/test-security-headers.sh`**: Security headers testing script

## TCP Timestamps Information Disclosure Fix

### Issue Description
TCP Timestamps Information Disclosure vulnerability detected - TCP timestamps can reveal system uptime information, which can be used by attackers for reconnaissance.

### TCP Security Implementation

#### 1. Disable TCP Timestamps
```bash
# Linux/Unix systems
net.ipv4.tcp_timestamps = 0

# Windows systems
netsh int tcp set global timestamps=disabled
```

#### 2. Additional TCP Security Measures
```bash
# Enable TCP syncookies (SYN flood protection)
net.ipv4.tcp_syncookies = 1

# Disable IP forwarding
net.ipv4.ip_forward = 0

# Disable source routing
net.ipv4.conf.all.accept_source_route = 0

# Disable ICMP redirects
net.ipv4.conf.all.accept_redirects = 0

# Ignore ICMP ping requests
net.ipv4.icmp_echo_ignore_all = 1
```

#### 3. Docker Configuration
```yaml
# docker-compose.yml
services:
  app:
    sysctls:
      - net.ipv4.tcp_timestamps=0
      - net.ipv4.tcp_syncookies=1
      - net.ipv4.ip_forward=0
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE
```

#### 4. Nginx TCP Security
```nginx
# nginx.conf
events {
    use epoll;
    multi_accept on;
}

http {
    tcp_nodelay on;
    tcp_nopush on;
}
```

#### 5. TCP Security Testing
```bash
# Test TCP configuration
npm run security:tcp

# Test local development
npm run security:tcp-local

# Harden TCP settings (requires sudo)
npm run security:harden-tcp

# Complete security audit
npm run security:all
```

### TCP Security Best Practices
1. **Disable TCP Timestamps**: Prevents uptime disclosure
2. **Enable TCP Syncookies**: Protects against SYN flood attacks
3. **Disable IP Forwarding**: Prevents routing attacks
4. **Use Reverse Proxy**: Additional security layer
5. **Implement Rate Limiting**: DoS protection
6. **Regular Monitoring**: Monitor for security issues
7. **System Hardening**: Apply comprehensive security measures

### TCP Security Configuration Files
- **`scripts/harden-tcp.sh`**: TCP security hardening script
- **`scripts/test-tcp-security.sh`**: TCP security testing script
- **`Dockerfile`**: Docker TCP security configuration
- **`docker-compose.yml`**: Container TCP security settings
- **`nginx.conf`**: Nginx TCP security configuration
