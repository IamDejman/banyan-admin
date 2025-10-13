#!/bin/bash

# CORS Security Testing Script
# Tests CORS configuration to ensure it's properly secured

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 CORS Security Testing${NC}"
echo "========================"

# Configuration
BASE_URL="https://banyan-admin-six.vercel.app"
LOCAL_URL="http://localhost:3000"
ALLOWED_ORIGIN="https://banyan-admin-six.vercel.app"
BLOCKED_ORIGIN="https://malicious-site.com"

# Function to test CORS preflight
test_cors_preflight() {
    local url=$1
    local origin=$2
    local expected_result=$3
    
    echo -e "${YELLOW}🧪 Testing CORS preflight: $origin -> $url${NC}"
    
    response=$(curl -s -o /dev/null -w "%{http_code}" \
        -X OPTIONS \
        -H "Origin: $origin" \
        -H "Access-Control-Request-Method: POST" \
        -H "Access-Control-Request-Headers: Content-Type" \
        "$url/api/test" 2>/dev/null || echo "000")
    
    if [ "$response" = "204" ] || [ "$response" = "200" ]; then
        if [ "$expected_result" = "allowed" ]; then
            echo -e "${GREEN}✅ PASS: CORS preflight allowed (HTTP $response)${NC}"
        else
            echo -e "${RED}❌ FAIL: CORS preflight should be blocked (HTTP $response)${NC}"
        fi
    else
        if [ "$expected_result" = "blocked" ]; then
            echo -e "${GREEN}✅ PASS: CORS preflight blocked (HTTP $response)${NC}"
        else
            echo -e "${RED}❌ FAIL: CORS preflight should be allowed (HTTP $response)${NC}"
        fi
    fi
}

# Function to test CORS headers
test_cors_headers() {
    local url=$1
    local origin=$2
    local expected_result=$3
    
    echo -e "${YELLOW}🧪 Testing CORS headers: $origin -> $url${NC}"
    
    response=$(curl -s -I \
        -H "Origin: $origin" \
        "$url/api/test" 2>/dev/null || echo "")
    
    cors_origin=$(echo "$response" | grep -i "access-control-allow-origin" || echo "")
    
    if [ -n "$cors_origin" ]; then
        if [ "$expected_result" = "allowed" ]; then
            echo -e "${GREEN}✅ PASS: CORS headers present${NC}"
            echo -e "${BLUE}   $cors_origin${NC}"
        else
            echo -e "${RED}❌ FAIL: CORS headers should not be present${NC}"
            echo -e "${BLUE}   $cors_origin${NC}"
        fi
    else
        if [ "$expected_result" = "blocked" ]; then
            echo -e "${GREEN}✅ PASS: No CORS headers (blocked)${NC}"
        else
            echo -e "${RED}❌ FAIL: CORS headers should be present${NC}"
        fi
    fi
}

# Function to test wildcard CORS
test_wildcard_cors() {
    local url=$1
    
    echo -e "${YELLOW}🧪 Testing for wildcard CORS vulnerability${NC}"
    
    response=$(curl -s -I \
        -H "Origin: https://evil-site.com" \
        "$url/api/test" 2>/dev/null || echo "")
    
    cors_origin=$(echo "$response" | grep -i "access-control-allow-origin: \*" || echo "")
    
    if [ -n "$cors_origin" ]; then
        echo -e "${RED}❌ CRITICAL: Wildcard CORS detected!${NC}"
        echo -e "${BLUE}   $cors_origin${NC}"
        return 1
    else
        echo -e "${GREEN}✅ PASS: No wildcard CORS detected${NC}"
        return 0
    fi
}

# Function to test API endpoints
test_api_endpoints() {
    local url=$1
    local origin=$2
    
    echo -e "${YELLOW}🧪 Testing API endpoints with $origin${NC}"
    
    # Test different HTTP methods
    for method in GET POST PUT DELETE; do
        echo -e "${BLUE}   Testing $method request...${NC}"
        
        if [ "$method" = "GET" ]; then
            response=$(curl -s -o /dev/null -w "%{http_code}" \
                -X $method \
                -H "Origin: $origin" \
                "$url/api/test" 2>/dev/null || echo "000")
        else
            response=$(curl -s -o /dev/null -w "%{http_code}" \
                -X $method \
                -H "Origin: $origin" \
                -H "Content-Type: application/json" \
                -d '{"test": "data"}' \
                "$url/api/test" 2>/dev/null || echo "000")
        fi
        
        echo -e "${BLUE}     Response: HTTP $response${NC}"
    done
}

# Function to generate CORS report
generate_cors_report() {
    echo -e "${YELLOW}📋 Generating CORS Security Report...${NC}"
    
    REPORT_FILE="cors-security-report-$(date +%Y%m%d-%H%M%S).txt"
    
    {
        echo "CORS Security Report - $(date)"
        echo "==============================="
        echo ""
        echo "Test Results:"
        echo "============="
        echo ""
        echo "1. Wildcard CORS Test:"
        test_wildcard_cors "$BASE_URL" && echo "PASS: No wildcard CORS" || echo "FAIL: Wildcard CORS detected"
        echo ""
        echo "2. Allowed Origin Test:"
        test_cors_headers "$BASE_URL" "$ALLOWED_ORIGIN" "allowed"
        echo ""
        echo "3. Blocked Origin Test:"
        test_cors_headers "$BASE_URL" "$BLOCKED_ORIGIN" "blocked"
        echo ""
        echo "4. Preflight Request Test:"
        test_cors_preflight "$BASE_URL" "$ALLOWED_ORIGIN" "allowed"
        echo ""
        echo "5. Malicious Origin Preflight:"
        test_cors_preflight "$BASE_URL" "$BLOCKED_ORIGIN" "blocked"
        echo ""
        echo "Recommendations:"
        echo "==============="
        echo "- Ensure Access-Control-Allow-Origin is set to specific domains"
        echo "- Never use wildcard (*) for Access-Control-Allow-Origin"
        echo "- Implement proper preflight handling"
        echo "- Use HTTPS for all CORS requests"
        echo "- Regularly test CORS configuration"
    } > $REPORT_FILE
    
    echo -e "${GREEN}📄 CORS report saved to: $REPORT_FILE${NC}"
}

# Main execution
main() {
    echo -e "${BLUE}🚀 Starting CORS security tests...${NC}"
    echo ""
    
    # Test wildcard CORS (most critical)
    test_wildcard_cors "$BASE_URL"
    echo ""
    
    # Test allowed origin
    test_cors_headers "$BASE_URL" "$ALLOWED_ORIGIN" "allowed"
    echo ""
    
    # Test blocked origin
    test_cors_headers "$BASE_URL" "$BLOCKED_ORIGIN" "blocked"
    echo ""
    
    # Test preflight requests
    test_cors_preflight "$BASE_URL" "$ALLOWED_ORIGIN" "allowed"
    test_cors_preflight "$BASE_URL" "$BLOCKED_ORIGIN" "blocked"
    echo ""
    
    # Test API endpoints
    test_api_endpoints "$BASE_URL" "$ALLOWED_ORIGIN"
    echo ""
    
    # Generate report
    generate_cors_report
    
    echo -e "${GREEN}✅ CORS security testing complete${NC}"
}

# Check if script is run with arguments
case "${1:-}" in
    --local)
        BASE_URL="$LOCAL_URL"
        ALLOWED_ORIGIN="http://localhost:3000"
        main
        ;;
    --report-only)
        generate_cors_report
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
