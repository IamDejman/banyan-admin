#!/bin/bash

# Firewall Configuration Script for Banyan Admin
# Configures firewall rules to secure ports 80 and 443

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔥 Firewall Configuration for Banyan Admin${NC}"
echo "=============================================="

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}❌ This script must be run as root${NC}"
   echo "Please run: sudo $0"
   exit 1
fi

# Detect firewall system
detect_firewall() {
    if command -v ufw &> /dev/null; then
        echo "ufw"
    elif command -v firewall-cmd &> /dev/null; then
        echo "firewalld"
    elif command -v iptables &> /dev/null; then
        echo "iptables"
    else
        echo "none"
    fi
}

# Configure UFW (Ubuntu/Debian)
configure_ufw() {
    echo -e "${YELLOW}🔧 Configuring UFW firewall...${NC}"
    
    # Reset UFW to defaults
    ufw --force reset
    
    # Set default policies
    ufw default deny incoming
    ufw default allow outgoing
    
    # Allow SSH (port 22)
    ufw allow 22/tcp comment 'SSH'
    
    # Allow HTTP (port 80) - redirects to HTTPS
    ufw allow 80/tcp comment 'HTTP - redirects to HTTPS'
    
    # Allow HTTPS (port 443) - main application
    ufw allow 443/tcp comment 'HTTPS - Banyan Admin'
    
    # Allow application port (3000) from localhost only
    ufw allow from 127.0.0.1 to any port 3000 comment 'Next.js app - localhost only'
    
    # Rate limiting for SSH
    ufw limit 22/tcp
    
    # Enable UFW
    ufw --force enable
    
    echo -e "${GREEN}✅ UFW configured successfully${NC}"
}

# Configure Firewalld (CentOS/RHEL)
configure_firewalld() {
    echo -e "${YELLOW}🔧 Configuring Firewalld firewall...${NC}"
    
    # Start and enable firewalld
    systemctl start firewalld
    systemctl enable firewalld
    
    # Set default zone
    firewall-cmd --set-default-zone=public
    
    # Remove default services
    firewall-cmd --remove-service=dhcpv6-client --permanent
    
    # Add custom services
    firewall-cmd --add-service=ssh --permanent
    firewall-cmd --add-service=http --permanent
    firewall-cmd --add-service=https --permanent
    
    # Add custom port for Next.js app (localhost only)
    firewall-cmd --add-port=3000/tcp --permanent
    firewall-cmd --add-rich-rule="rule family='ipv4' source address='127.0.0.1' port protocol='tcp' port='3000' accept" --permanent
    
    # Rate limiting for SSH
    firewall-cmd --add-rich-rule="rule service name='ssh' limit value='3/m' accept" --permanent
    
    # Reload firewall
    firewall-cmd --reload
    
    echo -e "${GREEN}✅ Firewalld configured successfully${NC}"
}

# Configure iptables (generic)
configure_iptables() {
    echo -e "${YELLOW}🔧 Configuring iptables firewall...${NC}"
    
    # Clear existing rules
    iptables -F
    iptables -X
    iptables -t nat -F
    iptables -t nat -X
    iptables -t mangle -F
    iptables -t mangle -X
    
    # Set default policies
    iptables -P INPUT DROP
    iptables -P FORWARD DROP
    iptables -P OUTPUT ACCEPT
    
    # Allow loopback
    iptables -A INPUT -i lo -j ACCEPT
    iptables -A OUTPUT -o lo -j ACCEPT
    
    # Allow established connections
    iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
    
    # Allow SSH (port 22) with rate limiting
    iptables -A INPUT -p tcp --dport 22 -m state --state NEW -m recent --set
    iptables -A INPUT -p tcp --dport 22 -m state --state NEW -m recent --update --seconds 60 --hitcount 4 -j DROP
    iptables -A INPUT -p tcp --dport 22 -j ACCEPT
    
    # Allow HTTP (port 80)
    iptables -A INPUT -p tcp --dport 80 -j ACCEPT
    
    # Allow HTTPS (port 443)
    iptables -A INPUT -p tcp --dport 443 -j ACCEPT
    
    # Allow Next.js app port (localhost only)
    iptables -A INPUT -p tcp -s 127.0.0.1 --dport 3000 -j ACCEPT
    
    # Log dropped packets
    iptables -A INPUT -j LOG --log-prefix "DROPPED: " --log-level 4
    iptables -A INPUT -j DROP
    
    # Save rules (method varies by distribution)
    if command -v iptables-save &> /dev/null; then
        iptables-save > /etc/iptables/rules.v4 2>/dev/null || \
        iptables-save > /etc/sysconfig/iptables 2>/dev/null || \
        echo -e "${YELLOW}⚠️  Please save iptables rules manually${NC}"
    fi
    
    echo -e "${GREEN}✅ iptables configured successfully${NC}"
}

# Show current firewall status
show_status() {
    FIREWALL_TYPE=$(detect_firewall)
    
    echo -e "${BLUE}📊 Current Firewall Status:${NC}"
    echo "Firewall Type: $FIREWALL_TYPE"
    echo ""
    
    case $FIREWALL_TYPE in
        "ufw")
            ufw status verbose
            ;;
        "firewalld")
            firewall-cmd --list-all
            ;;
        "iptables")
            iptables -L -n -v
            ;;
        "none")
            echo -e "${RED}❌ No firewall detected${NC}"
            ;;
    esac
}

# Main menu
echo "Firewall Configuration Options:"
echo "1) Configure UFW (Ubuntu/Debian)"
echo "2) Configure Firewalld (CentOS/RHEL)"
echo "3) Configure iptables (Generic)"
echo "4) Show current status"
echo "5) Exit"

read -p "Enter choice [1-5]: " choice

case $choice in
    1)
        configure_ufw
        ;;
    2)
        configure_firewalld
        ;;
    3)
        configure_iptables
        ;;
    4)
        show_status
        ;;
    5)
        echo -e "${GREEN}👋 Goodbye!${NC}"
        exit 0
        ;;
    *)
        echo -e "${RED}❌ Invalid option${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}🎉 Firewall configuration complete!${NC}"
echo -e "${YELLOW}📝 Important Notes:${NC}"
echo "- Port 80: Open for HTTP (redirects to HTTPS)"
echo "- Port 443: Open for HTTPS (main application)"
echo "- Port 3000: Restricted to localhost only"
echo "- SSH: Rate limited for security"
echo "- All other ports: Blocked by default"
echo ""
echo -e "${BLUE}🔍 Test your configuration:${NC}"
echo "nmap -p 80,443,3000 your-server-ip"
