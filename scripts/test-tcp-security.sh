#!/bin/bash

# TCP Security Testing Script
# Tests TCP timestamps and other TCP security configurations

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 TCP Security Testing${NC}"
echo "========================"

# Configuration
BASE_URL="https://banyan-admin-six.vercel.app"
LOCAL_URL="http://localhost:3000"

# Function to test TCP timestamps
test_tcp_timestamps() {
    local host=$1
    local port=${2:-443}
    local description=$3
    
    echo -e "${YELLOW}🧪 Testing TCP timestamps: $description${NC}"
    echo -e "${BLUE}   Host: $host:$port${NC}"
    
    # Check if nmap is available
    if ! command -v nmap &> /dev/null; then
        echo -e "${YELLOW}⚠️  nmap not available, skipping TCP timestamp test${NC}"
        echo -e "${BLUE}   Install nmap to test TCP timestamps: sudo apt-get install nmap${NC}"
        return 0
    fi
    
    # Test TCP timestamps using nmap
    echo -e "${BLUE}   Running TCP timestamp scan...${NC}"
    
    # Use nmap to check for TCP timestamps
    result=$(nmap -sS -O --script tcp-timestamp $host -p $port 2>/dev/null | grep -i "timestamp" || echo "")
    
    if [ -n "$result" ]; then
        echo -e "${RED}   ❌ TCP timestamps detected: $result${NC}"
        return 1
    else
        echo -e "${GREEN}   ✅ No TCP timestamps detected${NC}"
        return 0
    fi
}

# Function to test local TCP configuration
test_local_tcp_config() {
    echo -e "${YELLOW}🧪 Testing local TCP configuration...${NC}"
    
    # Check TCP timestamps setting
    tcp_timestamps=$(sysctl net.ipv4.tcp_timestamps 2>/dev/null | cut -d= -f2 | xargs || echo "unknown")
    
    if [ "$tcp_timestamps" = "0" ]; then
        echo -e "${GREEN}   ✅ TCP timestamps: DISABLED${NC}"
    elif [ "$tcp_timestamps" = "1" ]; then
        echo -e "${RED}   ❌ TCP timestamps: ENABLED${NC}"
    else
        echo -e "${YELLOW}   ⚠️  TCP timestamps: $tcp_timestamps${NC}"
    fi
    
    # Check other TCP security settings
    tcp_syncookies=$(sysctl net.ipv4.tcp_syncookies 2>/dev/null | cut -d= -f2 | xargs || echo "unknown")
    if [ "$tcp_syncookies" = "1" ]; then
        echo -e "${GREEN}   ✅ TCP syncookies: ENABLED${NC}"
    else
        echo -e "${YELLOW}   ⚠️  TCP syncookies: $tcp_syncookies${NC}"
    fi
    
    ip_forward=$(sysctl net.ipv4.ip_forward 2>/dev/null | cut -d= -f2 | xargs || echo "unknown")
    if [ "$ip_forward" = "0" ]; then
        echo -e "${GREEN}   ✅ IP forwarding: DISABLED${NC}"
    else
        echo -e "${YELLOW}   ⚠️  IP forwarding: $ip_forward${NC}"
    fi
}

# Function to test Docker TCP configuration
test_docker_tcp_config() {
    echo -e "${YELLOW}🧪 Testing Docker TCP configuration...${NC}"
    
    # Check if Docker is running
    if ! command -v docker &> /dev/null; then
        echo -e "${YELLOW}   ⚠️  Docker not available${NC}"
        return 0
    fi
    
    # Check if the application container is running
    if docker ps | grep -q "banyan-admin"; then
        echo -e "${GREEN}   ✅ Banyan admin container is running${NC}"
        
        # Check container TCP settings
        container_id=$(docker ps | grep "banyan-admin" | awk '{print $1}')
        
        echo -e "${BLUE}   Checking container TCP settings...${NC}"
        docker exec $container_id sysctl net.ipv4.tcp_timestamps 2>/dev/null || echo "Cannot access container sysctl"
        
    else
        echo -e "${YELLOW}   ⚠️  Banyan admin container not running${NC}"
        echo -e "${BLUE}   Start container with: docker-compose up -d${NC}"
    fi
}

# Function to test network connectivity
test_network_connectivity() {
    local url=$1
    local description=$2
    
    echo -e "${YELLOW}🧪 Testing network connectivity: $description${NC}"
    
    # Test HTTP connectivity
    if curl -s --connect-timeout 10 "$url" > /dev/null; then
        echo -e "${GREEN}   ✅ HTTP connectivity: OK${NC}"
    else
        echo -e "${RED}   ❌ HTTP connectivity: FAILED${NC}"
    fi
    
    # Test HTTPS connectivity
    if curl -s --connect-timeout 10 -k "https://${url#https://}" > /dev/null; then
        echo -e "${GREEN}   ✅ HTTPS connectivity: OK${NC}"
    else
        echo -e "${RED}   ❌ HTTPS connectivity: FAILED${NC}"
    fi
}

# Function to check system uptime disclosure
check_uptime_disclosure() {
    local host=$1
    local port=${2:-443}
    
    echo -e "${YELLOW}🧪 Checking for uptime disclosure...${NC}"
    
    if ! command -v nmap &> /dev/null; then
        echo -e "${YELLOW}   ⚠️  nmap not available, skipping uptime disclosure test${NC}"
        return 0
    fi
    
    # Use nmap to check for uptime information
    uptime_info=$(nmap -sS --script smb-os-discovery $host -p $port 2>/dev/null | grep -i "uptime\|system\|os" || echo "")
    
    if [ -n "$uptime_info" ]; then
        echo -e "${YELLOW}   ⚠️  Potential uptime disclosure detected:${NC}"
        echo -e "${BLUE}   $uptime_info${NC}"
    else
        echo -e "${GREEN}   ✅ No obvious uptime disclosure detected${NC}"
    fi
}

# Function to generate TCP security report
generate_tcp_report() {
    echo -e "${YELLOW}📋 Generating TCP Security Report...${NC}"
    
    REPORT_FILE="tcp-security-report-$(date +%Y%m%d-%H%M%S).txt"
    
    {
        echo "TCP Security Report - $(date)"
        echo "============================"
        echo ""
        echo "Test Results:"
        echo "============="
        echo ""
        echo "1. Local TCP Configuration:"
        test_local_tcp_config
        echo ""
        echo "2. Docker TCP Configuration:"
        test_docker_tcp_config
        echo ""
        echo "3. Production TCP Timestamps Test:"
        test_tcp_timestamps "banyan-admin-six.vercel.app" "443" "Production Environment"
        echo ""
        echo "4. Network Connectivity Test:"
        test_network_connectivity "$BASE_URL" "Production Environment"
        echo ""
        echo "TCP Security Best Practices:"
        echo "============================"
        echo "✅ Disable TCP timestamps (net.ipv4.tcp_timestamps = 0)"
        echo "✅ Enable TCP syncookies (net.ipv4.tcp_syncookies = 1)"
        echo "✅ Disable IP forwarding (net.ipv4.ip_forward = 0)"
        echo "✅ Use reverse proxy (nginx) for additional security"
        echo "✅ Implement rate limiting"
        echo "✅ Use HTTPS only"
        echo "✅ Regular security updates"
        echo ""
        echo "Common TCP Security Issues:"
        echo "=========================="
        echo "- TCP timestamps reveal system uptime"
        echo "- SYN flood attacks without syncookies"
        echo "- IP forwarding allows routing attacks"
        echo "- Missing rate limiting allows DoS attacks"
        echo "- Unencrypted connections allow interception"
    } > $REPORT_FILE
    
    echo -e "${GREEN}📄 TCP security report saved to: $REPORT_FILE${NC}"
}

# Main execution
main() {
    echo -e "${BLUE}🚀 Starting TCP security tests...${NC}"
    echo ""
    
    # Test local configuration
    test_local_tcp_config
    echo ""
    
    # Test Docker configuration
    test_docker_tcp_config
    echo ""
    
    # Test production TCP timestamps
    test_tcp_timestamps "banyan-admin-six.vercel.app" "443" "Production Environment"
    echo ""
    
    # Test network connectivity
    test_network_connectivity "$BASE_URL" "Production Environment"
    echo ""
    
    # Check for uptime disclosure
    check_uptime_disclosure "banyan-admin-six.vercel.app" "443"
    echo ""
    
    # Generate report
    generate_tcp_report
    
    echo -e "${GREEN}✅ TCP security testing complete${NC}"
}

# Check if script is run with arguments
case "${1:-}" in
    --local)
        BASE_URL="$LOCAL_URL"
        test_local_tcp_config
        test_docker_tcp_config
        test_tcp_timestamps "localhost" "3000" "Local Development"
        ;;
    --production)
        main
        ;;
    --report-only)
        generate_tcp_report
        ;;
    --help)
        echo "Usage: $0 [--local|--production|--report-only|--help]"
        echo "  --local       Test local development environment"
        echo "  --production  Test production environment"
        echo "  --report-only Generate report only"
        echo "  --help        Show this help"
        ;;
    *)
        main
        ;;
esac
