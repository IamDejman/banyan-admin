#!/bin/bash

# Port Security Monitoring Script
# Monitors open ports and detects potential security issues

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
LOG_FILE="/var/log/port-monitor.log"
ALERT_EMAIL="admin@yourdomain.com"
CRITICAL_PORTS="22,80,443,3306,5432,6379,27017"
ALLOWED_PORTS="22,80,443,3000"

echo -e "${BLUE}🔍 Port Security Monitor${NC}"
echo "========================="

# Function to log events
log_event() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> $LOG_FILE
}

# Function to check open ports
check_open_ports() {
    echo -e "${YELLOW}🔍 Scanning for open ports...${NC}"
    
    # Get list of open ports
    OPEN_PORTS=$(netstat -tuln | grep LISTEN | awk '{print $4}' | cut -d: -f2 | sort -u | tr '\n' ',' | sed 's/,$//')
    
    echo -e "${BLUE}📊 Open ports detected: $OPEN_PORTS${NC}"
    
    # Check for unexpected ports
    IFS=',' read -ra OPEN_ARRAY <<< "$OPEN_PORTS"
    IFS=',' read -ra ALLOWED_ARRAY <<< "$ALLOWED_PORTS"
    
    for port in "${OPEN_ARRAY[@]}"; do
        if [[ ! " ${ALLOWED_ARRAY[@]} " =~ " ${port} " ]]; then
            echo -e "${RED}⚠️  WARNING: Unexpected open port detected: $port${NC}"
            log_event "WARNING: Unexpected open port $port detected"
        else
            echo -e "${GREEN}✅ Port $port is allowed${NC}"
        fi
    done
}

# Function to check SSL/TLS security
check_ssl_security() {
    echo -e "${YELLOW}🔐 Checking SSL/TLS security...${NC}"
    
    if command -v nmap &> /dev/null; then
        # Check SSL/TLS versions and ciphers
        nmap --script ssl-enum-ciphers -p 443 localhost 2>/dev/null | grep -E "(TLSv|SSLv)" || echo "SSL scan completed"
        
        # Check for weak ciphers
        WEAK_CIPHERS=$(nmap --script ssl-enum-ciphers -p 443 localhost 2>/dev/null | grep -i "weak\|ssl2\|ssl3\|tls1.0\|tls1.1" || echo "")
        
        if [ ! -z "$WEAK_CIPHERS" ]; then
            echo -e "${RED}⚠️  WARNING: Weak SSL/TLS configuration detected${NC}"
            log_event "WARNING: Weak SSL/TLS configuration detected"
        else
            echo -e "${GREEN}✅ SSL/TLS configuration appears secure${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  nmap not installed, skipping SSL security check${NC}"
    fi
}

# Function to check for suspicious connections
check_suspicious_connections() {
    echo -e "${YELLOW}🕵️  Checking for suspicious connections...${NC}"
    
    # Check for connections from suspicious IPs
    SUSPICIOUS_IPS=$(netstat -tn | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -nr | head -10)
    
    echo -e "${BLUE}📊 Top connecting IPs:${NC}"
    echo "$SUSPICIOUS_IPS"
    
    # Check for too many connections from single IP
    while IFS= read -r line; do
        COUNT=$(echo $line | awk '{print $1}')
        IP=$(echo $line | awk '{print $2}')
        
        if [ "$COUNT" -gt 100 ]; then
            echo -e "${RED}⚠️  WARNING: High connection count from $IP: $COUNT connections${NC}"
            log_event "WARNING: High connection count from $IP: $COUNT"
        fi
    done <<< "$SUSPICIOUS_IPS"
}

# Function to check certificate expiration
check_cert_expiration() {
    echo -e "${YELLOW}📅 Checking SSL certificate expiration...${NC}"
    
    if [ -f "ssl/cert.pem" ]; then
        EXPIRY_DATE=$(openssl x509 -in ssl/cert.pem -noout -enddate | cut -d= -f2)
        EXPIRY_EPOCH=$(date -d "$EXPIRY_DATE" +%s)
        CURRENT_EPOCH=$(date +%s)
        DAYS_UNTIL_EXPIRY=$(( (EXPIRY_EPOCH - CURRENT_EPOCH) / 86400 ))
        
        echo -e "${BLUE}📅 Certificate expires: $EXPIRY_DATE${NC}"
        
        if [ "$DAYS_UNTIL_EXPIRY" -lt 30 ]; then
            echo -e "${RED}⚠️  WARNING: SSL certificate expires in $DAYS_UNTIL_EXPIRY days!${NC}"
            log_event "WARNING: SSL certificate expires in $DAYS_UNTIL_EXPIRY days"
        elif [ "$DAYS_UNTIL_EXPIRY" -lt 60 ]; then
            echo -e "${YELLOW}⚠️  SSL certificate expires in $DAYS_UNTIL_EXPIRY days${NC}"
        else
            echo -e "${GREEN}✅ SSL certificate is valid for $DAYS_UNTIL_EXPIRY days${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  SSL certificate not found${NC}"
    fi
}

# Function to generate security report
generate_report() {
    echo -e "${YELLOW}📋 Generating security report...${NC}"
    
    REPORT_FILE="security-report-$(date +%Y%m%d-%H%M%S).txt"
    
    {
        echo "Security Report - $(date)"
        echo "=========================="
        echo ""
        echo "Open Ports:"
        netstat -tuln | grep LISTEN
        echo ""
        echo "Active Connections:"
        netstat -tn | head -20
        echo ""
        echo "SSL Certificate Status:"
        if [ -f "ssl/cert.pem" ]; then
            openssl x509 -in ssl/cert.pem -noout -subject -issuer -dates
        fi
        echo ""
        echo "Recent Security Events:"
        tail -20 $LOG_FILE 2>/dev/null || echo "No log file found"
    } > $REPORT_FILE
    
    echo -e "${GREEN}📄 Security report saved to: $REPORT_FILE${NC}"
}

# Main execution
main() {
    echo -e "${BLUE}🚀 Starting port security monitoring...${NC}"
    
    check_open_ports
    echo ""
    check_ssl_security
    echo ""
    check_suspicious_connections
    echo ""
    check_cert_expiration
    echo ""
    generate_report
    
    echo -e "${GREEN}✅ Port security monitoring complete${NC}"
}

# Check if script is run with arguments
case "${1:-}" in
    --continuous)
        echo -e "${BLUE}🔄 Running continuous monitoring...${NC}"
        while true; do
            main
            echo -e "${YELLOW}⏰ Waiting 5 minutes before next check...${NC}"
            sleep 300
        done
        ;;
    --help)
        echo "Usage: $0 [--continuous|--help]"
        echo "  --continuous  Run continuous monitoring"
        echo "  --help        Show this help"
        ;;
    *)
        main
        ;;
esac
