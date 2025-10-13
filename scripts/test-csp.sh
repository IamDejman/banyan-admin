#!/bin/bash

# Content Security Policy (CSP) Testing Script
# Tests CSP headers to ensure they're properly configured and secure

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🛡️  Content Security Policy (CSP) Testing${NC}"
echo "============================================="

# Configuration
BASE_URL="https://banyan-admin-six.vercel.app"
LOCAL_URL="http://localhost:3000"

# Function to test CSP headers
test_csp_headers() {
    local url=$1
    local description=$2
    
    echo -e "${YELLOW}🧪 Testing CSP headers: $description${NC}"
    echo -e "${BLUE}   URL: $url${NC}"
    
    # Get headers
    response=$(curl -s -I "$url" 2>/dev/null || echo "")
    
    if [ -z "$response" ]; then
        echo -e "${RED}❌ FAIL: Could not connect to $url${NC}"
        return 1
    fi
    
    # Check for CSP header
    csp_header=$(echo "$response" | grep -i "content-security-policy" || echo "")
    
    if [ -n "$csp_header" ]; then
        echo -e "${GREEN}✅ PASS: CSP header found${NC}"
        echo -e "${BLUE}   $csp_header${NC}"
        
        # Extract CSP value
        csp_value=$(echo "$csp_header" | cut -d: -f2- | xargs)
        
        # Test CSP directives
        test_csp_directives "$csp_value"
        
        return 0
    else
        echo -e "${RED}❌ CRITICAL: No CSP header found!${NC}"
        return 1
    fi
}

# Function to test CSP directives
test_csp_directives() {
    local csp_value=$1
    
    echo -e "${YELLOW}🔍 Analyzing CSP directives...${NC}"
    
    # Check for required directives
    local required_directives=(
        "default-src"
        "script-src"
        "style-src"
        "img-src"
        "font-src"
        "connect-src"
        "frame-ancestors"
    )
    
    local missing_directives=()
    
    for directive in "${required_directives[@]}"; do
        if echo "$csp_value" | grep -q "$directive"; then
            echo -e "${GREEN}   ✅ $directive present${NC}"
        else
            echo -e "${RED}   ❌ $directive missing${NC}"
            missing_directives+=("$directive")
        fi
    done
    
    # Check for security directives
    if echo "$csp_value" | grep -q "upgrade-insecure-requests"; then
        echo -e "${GREEN}   ✅ upgrade-insecure-requests present${NC}"
    else
        echo -e "${YELLOW}   ⚠️  upgrade-insecure-requests missing${NC}"
    fi
    
    if echo "$csp_value" | grep -q "block-all-mixed-content"; then
        echo -e "${GREEN}   ✅ block-all-mixed-content present${NC}"
    else
        echo -e "${YELLOW}   ⚠️  block-all-mixed-content missing${NC}"
    fi
    
    # Check for dangerous directives
    if echo "$csp_value" | grep -q "default-src.*\*"; then
        echo -e "${RED}   ❌ DANGEROUS: default-src contains wildcard (*)${NC}"
    fi
    
    if echo "$csp_value" | grep -q "script-src.*\*"; then
        echo -e "${RED}   ❌ DANGEROUS: script-src contains wildcard (*)${NC}"
    fi
    
    # Check for unsafe-inline
    if echo "$csp_value" | grep -q "unsafe-inline"; then
        echo -e "${YELLOW}   ⚠️  WARNING: unsafe-inline is present${NC}"
    fi
    
    if echo "$csp_value" | grep -q "unsafe-eval"; then
        echo -e "${YELLOW}   ⚠️  WARNING: unsafe-eval is present${NC}"
    fi
    
    # Summary
    if [ ${#missing_directives[@]} -eq 0 ]; then
        echo -e "${GREEN}   ✅ All required directives present${NC}"
    else
        echo -e "${RED}   ❌ Missing directives: ${missing_directives[*]}${NC}"
    fi
}

# Function to test CSP violation reporting
test_csp_reporting() {
    local url=$1
    
    echo -e "${YELLOW}🧪 Testing CSP violation reporting...${NC}"
    
    # Check for report-uri or report-to directive
    response=$(curl -s -I "$url" 2>/dev/null || echo "")
    csp_header=$(echo "$response" | grep -i "content-security-policy" || echo "")
    
    if echo "$csp_header" | grep -q "report-uri\|report-to"; then
        echo -e "${GREEN}✅ CSP violation reporting configured${NC}"
    else
        echo -e "${YELLOW}⚠️  CSP violation reporting not configured${NC}"
        echo -e "${BLUE}   Consider adding report-uri or report-to directive${NC}"
    fi
}

# Function to test CSP with browser simulation
test_csp_browser_simulation() {
    local url=$1
    
    echo -e "${YELLOW}🧪 Testing CSP with browser simulation...${NC}"
    
    # Simulate browser request with User-Agent
    response=$(curl -s -I \
        -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
        "$url" 2>/dev/null || echo "")
    
    csp_header=$(echo "$response" | grep -i "content-security-policy" || echo "")
    
    if [ -n "$csp_header" ]; then
        echo -e "${GREEN}✅ CSP header present in browser simulation${NC}"
    else
        echo -e "${RED}❌ CSP header missing in browser simulation${NC}"
    fi
}

# Function to generate CSP report
generate_csp_report() {
    echo -e "${YELLOW}📋 Generating CSP Security Report...${NC}"
    
    REPORT_FILE="csp-security-report-$(date +%Y%m%d-%H%M%S).txt"
    
    {
        echo "Content Security Policy (CSP) Security Report - $(date)"
        echo "======================================================"
        echo ""
        echo "Test Results:"
        echo "============="
        echo ""
        echo "1. Production CSP Test:"
        test_csp_headers "$BASE_URL" "Production Environment"
        echo ""
        echo "2. CSP Violation Reporting Test:"
        test_csp_reporting "$BASE_URL"
        echo ""
        echo "3. Browser Simulation Test:"
        test_csp_browser_simulation "$BASE_URL"
        echo ""
        echo "CSP Best Practices:"
        echo "=================="
        echo "✅ Use specific sources instead of wildcards"
        echo "✅ Implement CSP violation reporting"
        echo "✅ Use nonce or hash for inline scripts/styles"
        echo "✅ Regularly review and update CSP policy"
        echo "✅ Test CSP policy in development"
        echo "✅ Monitor CSP violation reports"
        echo ""
        echo "Common CSP Directives:"
        echo "===================="
        echo "- default-src: Default source list"
        echo "- script-src: JavaScript sources"
        echo "- style-src: CSS sources"
        echo "- img-src: Image sources"
        echo "- font-src: Font sources"
        echo "- connect-src: XHR/WebSocket sources"
        echo "- frame-ancestors: Frame embedding control"
        echo "- upgrade-insecure-requests: Force HTTPS"
        echo "- block-all-mixed-content: Block mixed content"
    } > $REPORT_FILE
    
    echo -e "${GREEN}📄 CSP report saved to: $REPORT_FILE${NC}"
}

# Function to validate CSP syntax
validate_csp_syntax() {
    local csp_value=$1
    
    echo -e "${YELLOW}🔍 Validating CSP syntax...${NC}"
    
    # Check for proper semicolon separation
    if echo "$csp_value" | grep -q ";;"; then
        echo -e "${RED}   ❌ Double semicolon found${NC}"
    else
        echo -e "${GREEN}   ✅ Proper semicolon separation${NC}"
    fi
    
    # Check for proper directive format
    if echo "$csp_value" | grep -q "src.*:"; then
        echo -e "${RED}   ❌ Incorrect directive format (src: instead of -src)${NC}"
    else
        echo -e "${GREEN}   ✅ Proper directive format${NC}"
    fi
    
    # Check for quoted sources
    if echo "$csp_value" | grep -q "'self'\|'unsafe-inline'\|'unsafe-eval'\|'none'"; then
        echo -e "${GREEN}   ✅ Properly quoted keywords${NC}"
    else
        echo -e "${YELLOW}   ⚠️  Some keywords may not be properly quoted${NC}"
    fi
}

# Main execution
main() {
    echo -e "${BLUE}🚀 Starting CSP security tests...${NC}"
    echo ""
    
    # Test production CSP
    test_csp_headers "$BASE_URL" "Production Environment"
    echo ""
    
    # Test CSP violation reporting
    test_csp_reporting "$BASE_URL"
    echo ""
    
    # Test browser simulation
    test_csp_browser_simulation "$BASE_URL"
    echo ""
    
    # Generate report
    generate_csp_report
    
    echo -e "${GREEN}✅ CSP security testing complete${NC}"
}

# Check if script is run with arguments
case "${1:-}" in
    --local)
        BASE_URL="$LOCAL_URL"
        main
        ;;
    --report-only)
        generate_csp_report
        ;;
    --validate)
        echo "Enter CSP value to validate:"
        read -r csp_input
        validate_csp_syntax "$csp_input"
        ;;
    --help)
        echo "Usage: $0 [--local|--report-only|--validate|--help]"
        echo "  --local       Test local development server"
        echo "  --report-only Generate report only"
        echo "  --validate    Validate CSP syntax interactively"
        echo "  --help        Show this help"
        ;;
    *)
        main
        ;;
esac
