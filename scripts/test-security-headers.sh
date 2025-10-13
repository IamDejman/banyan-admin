#!/bin/bash

# Security Headers Testing Script
# Tests all security headers to ensure they're properly configured

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🛡️  Security Headers Testing${NC}"
echo "============================="

# Configuration
BASE_URL="https://banyan-admin-six.vercel.app"
LOCAL_URL="http://localhost:3000"

# Required security headers
declare -A REQUIRED_HEADERS=(
    ["X-Frame-Options"]="DENY"
    ["X-Content-Type-Options"]="nosniff"
    ["Strict-Transport-Security"]="max-age=31536000"
    ["Referrer-Policy"]="strict-origin-when-cross-origin"
    ["X-XSS-Protection"]="1; mode=block"
    ["Content-Security-Policy"]="default-src"
    ["Permissions-Policy"]="camera=()"
    ["Cross-Origin-Embedder-Policy"]="require-corp"
    ["Cross-Origin-Opener-Policy"]="same-origin"
    ["Cross-Origin-Resource-Policy"]="same-origin"
)

# Function to test security headers
test_security_headers() {
    local url=$1
    local description=$2
    
    echo -e "${YELLOW}🧪 Testing security headers: $description${NC}"
    echo -e "${BLUE}   URL: $url${NC}"
    
    # Get headers
    response=$(curl -s -I "$url" 2>/dev/null || echo "")
    
    if [ -z "$response" ]; then
        echo -e "${RED}❌ FAIL: Could not connect to $url${NC}"
        return 1
    fi
    
    local all_passed=true
    
    # Test each required header
    for header_name in "${!REQUIRED_HEADERS[@]}"; do
        expected_value="${REQUIRED_HEADERS[$header_name]}"
        
        # Extract header value
        header_value=$(echo "$response" | grep -i "^$header_name:" | cut -d: -f2- | xargs || echo "")
        
        if [ -n "$header_value" ]; then
            if echo "$header_value" | grep -q "$expected_value"; then
                echo -e "${GREEN}   ✅ $header_name: $header_value${NC}"
            else
                echo -e "${YELLOW}   ⚠️  $header_name: $header_value (expected: $expected_value)${NC}"
            fi
        else
            echo -e "${RED}   ❌ $header_name: MISSING${NC}"
            all_passed=false
        fi
    done
    
    if [ "$all_passed" = true ]; then
        echo -e "${GREEN}✅ All required security headers present${NC}"
        return 0
    else
        echo -e "${RED}❌ Some security headers are missing or incorrect${NC}"
        return 1
    fi
}

# Function to test specific header issues
test_clickjacking_protection() {
    local url=$1
    
    echo -e "${YELLOW}🧪 Testing clickjacking protection...${NC}"
    
    response=$(curl -s -I "$url" 2>/dev/null || echo "")
    
    # Check X-Frame-Options
    x_frame_options=$(echo "$response" | grep -i "^x-frame-options:" | cut -d: -f2- | xargs || echo "")
    
    # Check CSP frame-ancestors
    csp_header=$(echo "$response" | grep -i "^content-security-policy:" | cut -d: -f2- || echo "")
    
    if [ -n "$x_frame_options" ]; then
        if [ "$x_frame_options" = "DENY" ] || [ "$x_frame_options" = "SAMEORIGIN" ]; then
            echo -e "${GREEN}   ✅ X-Frame-Options: $x_frame_options${NC}"
        else
            echo -e "${RED}   ❌ X-Frame-Options: $x_frame_options (should be DENY or SAMEORIGIN)${NC}"
        fi
    else
        echo -e "${RED}   ❌ X-Frame-Options: MISSING${NC}"
    fi
    
    if [ -n "$csp_header" ]; then
        if echo "$csp_header" | grep -q "frame-ancestors"; then
            echo -e "${GREEN}   ✅ CSP frame-ancestors directive present${NC}"
        else
            echo -e "${YELLOW}   ⚠️  CSP frame-ancestors directive missing${NC}"
        fi
    fi
}

# Function to test MIME sniffing protection
test_mime_sniffing_protection() {
    local url=$1
    
    echo -e "${YELLOW}🧪 Testing MIME sniffing protection...${NC}"
    
    response=$(curl -s -I "$url" 2>/dev/null || echo "")
    
    content_type_options=$(echo "$response" | grep -i "^x-content-type-options:" | cut -d: -f2- | xargs || echo "")
    
    if [ "$content_type_options" = "nosniff" ]; then
        echo -e "${GREEN}   ✅ X-Content-Type-Options: nosniff${NC}"
    elif [ -n "$content_type_options" ]; then
        echo -e "${RED}   ❌ X-Content-Type-Options: $content_type_options (should be nosniff)${NC}"
    else
        echo -e "${RED}   ❌ X-Content-Type-Options: MISSING${NC}"
    fi
}

# Function to test HSTS
test_hsts() {
    local url=$1
    
    echo -e "${YELLOW}🧪 Testing HTTP Strict Transport Security...${NC}"
    
    response=$(curl -s -I "$url" 2>/dev/null || echo "")
    
    hsts_header=$(echo "$response" | grep -i "^strict-transport-security:" | cut -d: -f2- | xargs || echo "")
    
    if [ -n "$hsts_header" ]; then
        if echo "$hsts_header" | grep -q "max-age"; then
            echo -e "${GREEN}   ✅ Strict-Transport-Security: $hsts_header${NC}"
            
            # Check for recommended values
            if echo "$hsts_header" | grep -q "includeSubDomains"; then
                echo -e "${GREEN}     ✅ includeSubDomains directive present${NC}"
            else
                echo -e "${YELLOW}     ⚠️  includeSubDomains directive missing${NC}"
            fi
            
            if echo "$hsts_header" | grep -q "preload"; then
                echo -e "${GREEN}     ✅ preload directive present${NC}"
            else
                echo -e "${YELLOW}     ⚠️  preload directive missing${NC}"
            fi
        else
            echo -e "${RED}   ❌ Strict-Transport-Security: $hsts_header (missing max-age)${NC}"
        fi
    else
        echo -e "${RED}   ❌ Strict-Transport-Security: MISSING${NC}"
    fi
}

# Function to test cross-origin policies
test_cross_origin_policies() {
    local url=$1
    
    echo -e "${YELLOW}🧪 Testing Cross-Origin policies...${NC}"
    
    response=$(curl -s -I "$url" 2>/dev/null || echo "")
    
    # Test COEP
    coep=$(echo "$response" | grep -i "^cross-origin-embedder-policy:" | cut -d: -f2- | xargs || echo "")
    if [ -n "$coep" ]; then
        echo -e "${GREEN}   ✅ Cross-Origin-Embedder-Policy: $coep${NC}"
    else
        echo -e "${YELLOW}   ⚠️  Cross-Origin-Embedder-Policy: MISSING${NC}"
    fi
    
    # Test COOP
    coop=$(echo "$response" | grep -i "^cross-origin-opener-policy:" | cut -d: -f2- | xargs || echo "")
    if [ -n "$coop" ]; then
        echo -e "${GREEN}   ✅ Cross-Origin-Opener-Policy: $coop${NC}"
    else
        echo -e "${YELLOW}   ⚠️  Cross-Origin-Opener-Policy: MISSING${NC}"
    fi
    
    # Test CORP
    corp=$(echo "$response" | grep -i "^cross-origin-resource-policy:" | cut -d: -f2- | xargs || echo "")
    if [ -n "$corp" ]; then
        echo -e "${GREEN}   ✅ Cross-Origin-Resource-Policy: $corp${NC}"
    else
        echo -e "${YELLOW}   ⚠️  Cross-Origin-Resource-Policy: MISSING${NC}"
    fi
}

# Function to generate security headers report
generate_security_headers_report() {
    echo -e "${YELLOW}📋 Generating Security Headers Report...${NC}"
    
    REPORT_FILE="security-headers-report-$(date +%Y%m%d-%H%M%S).txt"
    
    {
        echo "Security Headers Report - $(date)"
        echo "================================="
        echo ""
        echo "Test Results:"
        echo "============="
        echo ""
        echo "1. Production Security Headers Test:"
        test_security_headers "$BASE_URL" "Production Environment"
        echo ""
        echo "2. Clickjacking Protection Test:"
        test_clickjacking_protection "$BASE_URL"
        echo ""
        echo "3. MIME Sniffing Protection Test:"
        test_mime_sniffing_protection "$BASE_URL"
        echo ""
        echo "4. HSTS Test:"
        test_hsts "$BASE_URL"
        echo ""
        echo "5. Cross-Origin Policies Test:"
        test_cross_origin_policies "$BASE_URL"
        echo ""
        echo "Security Headers Best Practices:"
        echo "==============================="
        echo "✅ X-Frame-Options: DENY (prevents clickjacking)"
        echo "✅ X-Content-Type-Options: nosniff (prevents MIME sniffing)"
        echo "✅ Strict-Transport-Security: max-age=31536000; includeSubDomains; preload"
        echo "✅ Content-Security-Policy: Comprehensive policy with frame-ancestors"
        echo "✅ Referrer-Policy: strict-origin-when-cross-origin"
        echo "✅ X-XSS-Protection: 1; mode=block"
        echo "✅ Permissions-Policy: Restrict dangerous APIs"
        echo "✅ Cross-Origin policies: COEP, COOP, CORP"
        echo ""
        echo "Common Security Header Issues:"
        echo "============================="
        echo "- Missing X-Frame-Options allows clickjacking attacks"
        echo "- Missing X-Content-Type-Options allows MIME sniffing"
        echo "- Missing HSTS allows downgrade attacks"
        echo "- Weak CSP policies allow XSS attacks"
        echo "- Missing referrer policy leaks sensitive information"
    } > $REPORT_FILE
    
    echo -e "${GREEN}📄 Security headers report saved to: $REPORT_FILE${NC}"
}

# Main execution
main() {
    echo -e "${BLUE}🚀 Starting security headers tests...${NC}"
    echo ""
    
    # Test production security headers
    test_security_headers "$BASE_URL" "Production Environment"
    echo ""
    
    # Test specific security issues
    test_clickjacking_protection "$BASE_URL"
    echo ""
    
    test_mime_sniffing_protection "$BASE_URL"
    echo ""
    
    test_hsts "$BASE_URL"
    echo ""
    
    test_cross_origin_policies "$BASE_URL"
    echo ""
    
    # Generate report
    generate_security_headers_report
    
    echo -e "${GREEN}✅ Security headers testing complete${NC}"
}

# Check if script is run with arguments
case "${1:-}" in
    --local)
        BASE_URL="$LOCAL_URL"
        main
        ;;
    --report-only)
        generate_security_headers_report
        ;;
    --help)
        echo "Usage: $0 [--local|--report-only|--help]"
        echo "  --local       Test local development server"
        echo "  --report-only Generate report only"
        echo "  --help        Show this help"
        ;;
    *)
        main
        ;;
esac
